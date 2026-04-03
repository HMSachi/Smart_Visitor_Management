import React, { useState, useEffect } from 'react';
import { TextField, Button, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, InputBase } from '@mui/material';
import { Edit2, Plus, X, Search } from 'lucide-react';
import Header from '../../../components/Admin/Layout/Header';
import contactPersonService from '../../../services/ContactPersonService';

const UserManagement = () => {
  const [contactPersons, setContactPersons] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    department: '',
    email: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchContactPersons();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [showActiveOnly, searchTerm]);

  const fetchContactPersons = async () => {
    setLoadingData(true);
    try {
      let response;
      if (searchTerm.trim()) {
        response = await contactPersonService.SearchContactPersons(searchTerm);
      } else if (showActiveOnly) {
        response = await contactPersonService.GetActiveContactPersons();
      } else {
        response = await contactPersonService.GetAllContactPersons();
      }
      
      if (response.data && response.data.ResultSet) {
        setContactPersons(response.data.ResultSet);
      }
    } catch (err) {
      console.error("Failed to fetch contact persons", err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleOpenForm = async (person = null) => {
    setMessage(null);
    setError(null);
    setPhoneError('');
    setEmailError('');
    if (person) {
      setLoading(true);
      try {
        const response = await contactPersonService.GetContactPersonById(person.VCP_Contact_person_id);
        const fetchedPerson = response.data?.ResultSet?.[0] || person;
        
        setIsEditing(true);
        setFormData({
          id: fetchedPerson.VCP_Contact_person_id,
          name: fetchedPerson.VCP_Name || '',
          department: fetchedPerson.VCP_Department || '',
          email: fetchedPerson.VCP_Email || '',
          phone: fetchedPerson.VCP_Phone || '',
        });
        setIsFormVisible(true);
      } catch (err) {
        console.error("Failed to fetch contact person by ID", err);
        setError("Failed to fetch the latest Contact Person details. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setIsEditing(false);
      setFormData({ id: '', name: '', department: '', email: '', phone: '' });
      setIsFormVisible(true);
    }
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setPhoneError('');
    setEmailError('');
    setFormData({ id: '', name: '', department: '', email: '', phone: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'phone') {
      setPhoneError('');
    }
    if (name === 'email') {
      setEmailError('');
    }
  };

  const handlePhoneBlur = async () => {
    if (!formData.phone.trim()) return;
    try {
      const idToCheck = formData.id || '0';
      const response = await contactPersonService.GetContactPersonByPhone(idToCheck, formData.phone);
      if (response.data && response.data.ResultSet && response.data.ResultSet.length > 0) {
        setPhoneError('This phone number is already registered to another contact person.');
      }
    } catch (err) {
      console.warn("Failed to validate phone number uniquely", err);
    }
  };

  const handleEmailBlur = async () => {
    if (!formData.email.trim()) return;
    try {
      const response = await contactPersonService.GetContactPersonByEmail(formData.email);
      if (response.data && response.data.ResultSet && response.data.ResultSet.length > 0) {
        const existingPerson = response.data.ResultSet[0];
        if (String(existingPerson.VCP_Contact_person_id) !== String(formData.id)) {
          setEmailError('This email is already registered to another contact person.');
        }
      }
    } catch (err) {
      console.warn("Failed to validate email uniquely", err);
    }
  };

  const handleToggleStatus = async (person) => {
    const newStatus = person.VCP_Status === 'A' ? 'I' : 'A'; // Assuming 'I' is inactive
    setLoadingData(true);
    try {
      await contactPersonService.UpdateContactPersonStatus(person.VCP_Contact_person_id, newStatus);
      await fetchContactPersons();
    } catch (err) {
      console.error("Failed to update status", err);
      setError("Failed to update Contact Person status.");
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phoneError || emailError) return;

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      if (isEditing) {
        await contactPersonService.UpdateContactPerson(
          formData.id,
          formData.name,
          formData.department,
          formData.email,
          formData.phone
        );
        setMessage("Contact Person updated successfully!");
      } else {
        await contactPersonService.AddContactPerson(
          formData.name,
          formData.department,
          formData.email,
          formData.phone
        );
        setMessage("Contact Person added successfully!");
      }
      
      fetchContactPersons();
      setTimeout(() => handleCloseForm(), 1500);
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'add'} Contact Person. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-w-0 bg-[var(--color-bg-default)] min-h-screen">
      <Header />
      
      <div className="flex-1 p-8 overflow-y-auto w-full">
        <div className="max-w-[1600px] mx-auto">
          <header className="mb-6 flex justify-between items-end border-b border-white/[0.03] pb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-[2px] bg-primary"></div>
                <span className="text-primary uppercase tracking-wider text-xs font-semibold">User Administration</span>
              </div>
              <h1 className="text-white uppercase px-1 text-2xl font-bold tracking-tight">
                Contact Persons
              </h1>
            </div>
            {!isFormVisible && (
              <div className="flex gap-4 items-center">
                <div className="flex items-center bg-black/40 border border-white/10 px-3 py-1 group focus-within:border-primary transition-all">
                  <Search size={16} className="text-white/20 group-focus-within:text-primary" />
                  <InputBase
                    placeholder="SEARCH BY NAME..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                      ml: 1,
                      flex: 1,
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      letterSpacing: '0.1em',
                      '& input::placeholder': {
                        color: 'rgba(255,255,255,0.2)',
                        opacity: 1,
                      },
                    }}
                  />
                </div>
                <Button
                  onClick={() => setShowActiveOnly(!showActiveOnly)}
                  variant="outlined"
                  className={`rounded-none px-4 py-2 text-xs font-bold tracking-widest transition-all ${
                    showActiveOnly 
                    ? "border-primary text-primary bg-primary/10 hover:bg-primary/20" 
                    : "border-white/10 text-white/40 hover:text-white/60 hover:border-white/20"
                  }`}
                  sx={{ borderRadius: 0 }}
                >
                  {showActiveOnly ? "SHOWING ACTIVE" : "SHOWING ALL"}
                </Button>
                <Button
                  onClick={() => handleOpenForm()}
                  variant="contained"
                  startIcon={<Plus size={18} />}
                  className="bg-primary hover:bg-[var(--color-primary-hover)] rounded-none px-6 py-2.5 text-xs font-bold tracking-[0.2em]"
                  sx={{ borderRadius: 0 }}
                >
                  ADD CONTACT PERSON
                </Button>
              </div>
            )}
          </header>

          {isFormVisible ? (
             <form onSubmit={handleSubmit} className="p-8 bg-[#0F0F10] border border-white/5 space-y-6 mb-8 relative">
              <IconButton 
                onClick={handleCloseForm} 
                className="absolute top-4 right-4 text-white/40 hover:text-white"
              >
                <X size={20} />
              </IconButton>
              
              <h2 className="text-lg font-bold uppercase tracking-wider mb-6 text-white/90">
                {isEditing ? 'UPDATE CONTACT PERSON' : 'ADD NEW CONTACT PERSON'}
              </h2>

              {message && <Alert severity="success" className="rounded-none bg-green-500/10 border border-green-500/50 text-green-400">{message}</Alert>}
              {error && <Alert severity="error" className="rounded-none bg-red-500/10 border border-red-500/50 text-red-500">{error}</Alert>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group space-y-2">
                  <label className="text-[12px] font-medium tracking-[0.2em] text-white/40 uppercase ml-1 block">Full Name</label>
                  <TextField fullWidth name="name" value={formData.name} onChange={handleChange} required variant="outlined" size="small" InputProps={{ className: "rounded-none bg-black/60 border-white/5 text-sm text-white transition-all focus-within:bg-black" }} sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "rgba(255,255,255,0.1)" }, "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" }, "&.Mui-focused fieldset": { borderColor: "var(--color-primary)" } } }} />
                </div>
                <div className="group space-y-2">
                  <label className="text-[12px] font-medium tracking-[0.2em] text-white/40 uppercase ml-1 block">Department</label>
                  <TextField fullWidth name="department" value={formData.department} onChange={handleChange} required variant="outlined" size="small" InputProps={{ className: "rounded-none bg-black/60 border-white/5 text-sm text-white transition-all focus-within:bg-black" }} sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "rgba(255,255,255,0.1)" }, "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" }, "&.Mui-focused fieldset": { borderColor: "var(--color-primary)" } } }} />
                </div>
                <div className="group space-y-2">
                  <label className="text-[12px] font-medium tracking-[0.2em] text-white/40 uppercase ml-1 block">Email Address</label>
                  <TextField 
                    fullWidth 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    onBlur={handleEmailBlur}
                    required 
                    error={!!emailError}
                    helperText={emailError}
                    variant="outlined" 
                    size="small" 
                    InputProps={{ className: "rounded-none bg-black/60 border-white/5 text-sm text-white transition-all focus-within:bg-black" }} 
                    sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: emailError ? "var(--color-primary)" : "rgba(255,255,255,0.1)" }, "&:hover fieldset": { borderColor: emailError ? "var(--color-primary)" : "rgba(255,255,255,0.2)" }, "&.Mui-focused fieldset": { borderColor: "var(--color-primary)" } } }} 
                  />
                </div>
                <div className="group space-y-2">
                  <label className="text-[12px] font-medium tracking-[0.2em] text-white/40 uppercase ml-1 block">Phone Number</label>
                  <TextField 
                    fullWidth 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    onBlur={handlePhoneBlur}
                    required 
                    error={!!phoneError}
                    helperText={phoneError}
                    variant="outlined" 
                    size="small" 
                    InputProps={{ className: "rounded-none bg-black/60 border-white/5 text-sm text-white transition-all focus-within:bg-black" }} 
                    sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: phoneError ? "var(--color-primary)" : "rgba(255,255,255,0.1)" }, "&:hover fieldset": { borderColor: phoneError ? "var(--color-primary)" : "rgba(255,255,255,0.2)" }, "&.Mui-focused fieldset": { borderColor: "var(--color-primary)" } } }} 
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-white/5 gap-4">
                <Button onClick={handleCloseForm} type="button" variant="outlined" className="border-white/10 text-white/70 hover:bg-white/5 rounded-none px-6 py-2.5 text-xs font-bold tracking-[0.2em]" sx={{ borderRadius: 0 }}>
                  CANCEL
                </Button>
                <Button disabled={loading || !!phoneError || !!emailError} type="submit" variant="contained" className="bg-primary hover:bg-[var(--color-primary-hover)] rounded-none px-6 py-2.5 text-xs font-bold tracking-[0.2em]" sx={{ borderRadius: 0 }}>
                  {loading ? <CircularProgress size={20} color="inherit" /> : isEditing ? 'SAVE CHANGES' : 'CREATE PERSON'}
                </Button>
              </div>
            </form>
          ) : (
            <TableContainer component={Paper} className="bg-[#0F0F10] border border-white/5 rounded-none">
              <Table sx={{ minWidth: 650 }} aria-label="contact persons table">
                <TableHead className="bg-black/40">
                  <TableRow>
                    <TableCell className="text-white/40 font-bold uppercase tracking-wider text-[11px] border-b-white/5">ID</TableCell>
                    <TableCell className="text-white/40 font-bold uppercase tracking-wider text-[11px] border-b-white/5">Name</TableCell>
                    <TableCell className="text-white/40 font-bold uppercase tracking-wider text-[11px] border-b-white/5">Department</TableCell>
                    <TableCell className="text-white/40 font-bold uppercase tracking-wider text-[11px] border-b-white/5">Email</TableCell>
                    <TableCell className="text-white/40 font-bold uppercase tracking-wider text-[11px] border-b-white/5">Phone</TableCell>
                    <TableCell className="text-white/40 font-bold uppercase tracking-wider text-[11px] border-b-white/5">Status</TableCell>
                    <TableCell className="text-white/40 font-bold uppercase tracking-wider text-[11px] border-b-white/5" align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loadingData ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" className="py-12 border-b-white/5">
                        <CircularProgress size={30} className="text-primary" />
                      </TableCell>
                    </TableRow>
                  ) : contactPersons.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" className="py-12 text-white/40 uppercase tracking-widest text-sm border-b-white/5">
                        No Contact Persons found
                      </TableCell>
                    </TableRow>
                  ) : (
                    contactPersons.map((person) => (
                      <TableRow key={person.VCP_Contact_person_id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'rgba(255,255,255,0.02)' } }}>
                        <TableCell className="text-white/70 font-medium border-b-white/5">{person.VCP_Contact_person_id}</TableCell>
                        <TableCell className={`font-medium border-b-white/5 transition-colors ${person.VCP_Status === 'A' ? 'text-white' : 'text-white/30 line-through'}`}>{person.VCP_Name || '-'}</TableCell>
                        <TableCell className={`border-b-white/5 transition-colors ${person.VCP_Status === 'A' ? 'text-white/70' : 'text-white/20'}`}>{person.VCP_Department || '-'}</TableCell>
                        <TableCell className={`border-b-white/5 transition-colors ${person.VCP_Status === 'A' ? 'text-white/70' : 'text-white/20'}`}>{person.VCP_Email || '-'}</TableCell>
                        <TableCell className={`border-b-white/5 transition-colors ${person.VCP_Status === 'A' ? 'text-white/70' : 'text-white/20'}`}>{person.VCP_Phone || '-'}</TableCell>
                        <TableCell className="border-b-white/5">
                           <button 
                             onClick={() => handleToggleStatus(person)}
                             disabled={loadingData}
                             title="Click to toggle status"
                             className={`px-2 py-1 text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer ${person.VCP_Status === 'A' ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}
                           >
                             {person.VCP_Status === 'A' ? 'ACTIVE' : 'INACTIVE'}
                           </button>
                        </TableCell>
                        <TableCell align="right" className="border-b-white/5">
                          <IconButton onClick={() => handleOpenForm(person)} size="small" className="text-white/40 hover:text-white">
                            <Edit2 size={16} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

        </div>
      </div>
    </div>
  );
};

export default UserManagement;
