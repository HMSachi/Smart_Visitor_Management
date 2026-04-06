import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, InputBase } from '@mui/material';
import { Edit2, Plus, X, Search } from 'lucide-react';
import Header from '../../../components/Admin/Layout/Header';
import { 
  FetchContactPersons,
  FetchAdministrators,
  AddContactPerson,
  UpdateContactPerson,
  UpdateContactPersonStatus,
  ValidateUniqueness,
  ClearUserManagementErrors
} from '../../../actions/UserManagementAction';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { 
    contactPersons, 
    administrators, 
    isLoading, 
    success, 
    error: reduxError,
    validation
  } = useSelector((state) => state.userManagement);

  const [activeTab, setActiveTab] = useState('CONTACT'); // 'CONTACT', 'SECURITY', 'VISITOR'
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    department: '',
    email: '',
    phone: '',
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(FetchAdministrators());
    const delayDebounceFn = setTimeout(() => {
      if (activeTab === 'CONTACT') {
        fetchUsers();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [showActiveOnly, searchTerm, activeTab, dispatch]);

  useEffect(() => {
    if (success) {
      setMessage(isEditing ? "Contact Person updated successfully!" : "Contact Person added successfully!");
      setTimeout(() => handleCloseForm(), 1500);
      fetchUsers();
    }
  }, [success, isEditing]);

  useEffect(() => {
    if (reduxError) {
      setError(reduxError);
    }
  }, [reduxError]);

  const fetchUsers = () => {
    if (activeTab === 'CONTACT') {
      dispatch(FetchContactPersons({ searchTerm, showActiveOnly }));
    } else {
      dispatch(FetchAdministrators());
    }
  };

  const handleOpenForm = (person = null) => {
    setMessage(null);
    setError(null);
    dispatch(ClearUserManagementErrors());
    
    if (person) {
      setIsEditing(true);
      setSelectedPerson(person);
      setFormData({
        id: person.VCP_Contact_person_id,
        name: person.VCP_Name || '',
        department: person.VCP_Department || '',
        email: person.VCP_Email || '',
        phone: person.VCP_Phone || '',
      });
      setIsFormVisible(true);
    } else {
      setIsEditing(false);
      setSelectedPerson(null);
      setFormData({ id: '', name: '', department: '', email: '', phone: '' });
      setIsFormVisible(true);
    }
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setFormData({ id: '', name: '', department: '', email: '', phone: '' });
    dispatch(ClearUserManagementErrors());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    dispatch(ClearUserManagementErrors());
  };

  const handlePhoneBlur = () => {
    if (!formData.phone.trim()) return;
    dispatch(ValidateUniqueness('phone', formData.phone, formData.id || '0'));
  };

  const handleEmailBlur = () => {
    if (!formData.email.trim()) return;
    dispatch(ValidateUniqueness('email', formData.email, formData.id || '0'));
  };

  const handleToggleStatus = (person) => {
    if (activeTab === 'CONTACT') {
      const newStatus = person.VCP_Status === 'A' ? 'I' : 'A';
      dispatch(UpdateContactPersonStatus(person.VCP_Contact_person_id, newStatus));
    }
  };

  const getFilteredAdmins = () => {
    const role = activeTab === 'SECURITY' ? 'Security' : 'Visitor';
    return administrators.filter(admin => 
      admin.VA_Role === role && 
      (!searchTerm || admin.VA_Name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validation.phoneError || validation.emailError) return;

    if (isEditing) {
      dispatch(UpdateContactPerson(formData.id, formData.name, formData.department, formData.email, formData.phone));
    } else {
      dispatch(AddContactPerson(formData.name, formData.department, formData.email, formData.phone));
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
                {activeTab === 'CONTACT' ? 'Contact Persons' : activeTab === 'SECURITY' ? 'Security Officers' : 'Visitor Accounts'}
              </h1>
              
              {/* Tab Switcher */}
              <div className="flex gap-4 mt-6">
                <button 
                  onClick={() => { setActiveTab('CONTACT'); setSearchTerm(''); }}
                  className={`px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === 'CONTACT' ? 'border-primary text-white' : 'border-transparent text-white/30 hover:text-white/60'}`}
                >
                  Contact Persons
                </button>
                <button 
                  onClick={() => { setActiveTab('SECURITY'); setSearchTerm(''); }}
                  className={`px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === 'SECURITY' ? 'border-primary text-white' : 'border-transparent text-white/30 hover:text-white/60'}`}
                >
                  Security Officers
                </button>
                <button 
                  onClick={() => { setActiveTab('VISITOR'); setSearchTerm(''); }}
                  className={`px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === 'VISITOR' ? 'border-primary text-white' : 'border-transparent text-white/30 hover:text-white/60'}`}
                >
                  Visitor Accounts
                </button>
              </div>
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
                      ml: 1, flex: 1, color: 'white', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.1em',
                      '& input::placeholder': { color: 'rgba(255,255,255,0.2)', opacity: 1 },
                    }}
                  />
                </div>
                {activeTab === 'CONTACT' && (
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
                )}
                {activeTab === 'CONTACT' && (
                  <Button
                    onClick={() => handleOpenForm()}
                    variant="contained"
                    startIcon={<Plus size={18} />}
                    className="bg-primary hover:bg-[var(--color-primary-hover)] rounded-none px-6 py-2.5 text-xs font-bold tracking-[0.2em]"
                    sx={{ borderRadius: 0 }}
                  >
                    ADD {activeTab}
                  </Button>
                )}
              </div>
            )}
          </header>

          {isFormVisible ? (
             <form onSubmit={handleSubmit} className="p-8 bg-[#0F0F10] border border-white/5 space-y-6 mb-8 relative">
              <IconButton onClick={handleCloseForm} className="absolute top-4 right-4 text-white/40 hover:text-white">
                <X size={20} />
              </IconButton>
              
              <h2 className="text-lg font-bold uppercase tracking-wider mb-6 text-white/90">
                {isEditing ? `UPDATE ${activeTab}` : `ADD NEW ${activeTab}`}
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
                    fullWidth name="email" type="email" value={formData.email} onChange={handleChange} onBlur={handleEmailBlur} required 
                    error={!!validation.emailError} helperText={validation.emailError} variant="outlined" size="small" 
                    InputProps={{ className: "rounded-none bg-black/60 border-white/5 text-sm text-white transition-all focus-within:bg-black" }} 
                    sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: validation.emailError ? "var(--color-primary)" : "rgba(255,255,255,0.1)" }, "&:hover fieldset": { borderColor: validation.emailError ? "var(--color-primary)" : "rgba(255,255,255,0.2)" }, "&.Mui-focused fieldset": { borderColor: "var(--color-primary)" } } }} 
                  />
                </div>
                <div className="group space-y-2">
                  <label className="text-[12px] font-medium tracking-[0.2em] text-white/40 uppercase ml-1 block">Phone Number</label>
                  <TextField 
                    fullWidth name="phone" value={formData.phone} onChange={handleChange} onBlur={handlePhoneBlur} required 
                    error={!!validation.phoneError} helperText={validation.phoneError} variant="outlined" size="small" 
                    InputProps={{ className: "rounded-none bg-black/60 border-white/5 text-sm text-white transition-all focus-within:bg-black" }} 
                    sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: validation.phoneError ? "var(--color-primary)" : "rgba(255,255,255,0.1)" }, "&:hover fieldset": { borderColor: validation.phoneError ? "var(--color-primary)" : "rgba(255,255,255,0.2)" }, "&.Mui-focused fieldset": { borderColor: "var(--color-primary)" } } }} 
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-white/5 gap-4">
                <Button onClick={handleCloseForm} type="button" variant="outlined" className="border-white/10 text-white/70 hover:bg-white/5 rounded-none px-6 py-2.5 text-xs font-bold tracking-[0.2em]" sx={{ borderRadius: 0 }}>
                  CANCEL
                </Button>
                <Button disabled={isLoading || !!validation.phoneError || !!validation.emailError} type="submit" variant="contained" className="bg-primary hover:bg-[var(--color-primary-hover)] rounded-none px-6 py-2.5 text-xs font-bold tracking-[0.2em]" sx={{ borderRadius: 0 }}>
                  {isLoading ? <CircularProgress size={20} color="inherit" /> : isEditing ? 'SAVE CHANGES' : 'CREATE PERSON'}
                </Button>
              </div>
            </form>
          ) : (
            <TableContainer component={Paper} className="bg-[#0F0F10] border border-white/5 rounded-none">
              <Table sx={{ minWidth: 650 }} aria-label="user management table">
                <TableHead className="bg-black/40">
                  <TableRow>
                    <th className="text-white/40 font-bold uppercase tracking-wider text-[11px] border-b border-b-white/5 px-4 py-3 text-left">ID</th>
                    <th className="text-white/40 font-bold uppercase tracking-wider text-[11px] border-b border-b-white/5 px-4 py-3 text-left">Name</th>
                    <th className="text-white/40 font-bold uppercase tracking-wider text-[11px] border-b border-b-white/5 px-4 py-3 text-left">{activeTab === 'CONTACT' ? 'Department' : 'System Role'}</th>
                    <th className="text-white/40 font-bold uppercase tracking-wider text-[11px] border-b border-b-white/5 px-4 py-3 text-left">{activeTab === 'CONTACT' ? 'Email' : 'Authentication Origin'}</th>
                    {activeTab === 'CONTACT' && <th className="text-white/40 font-bold uppercase tracking-wider text-[11px] border-b border-b-white/5 px-4 py-3 text-left">Phone</th>}
                    <th className="text-white/40 font-bold uppercase tracking-wider text-[11px] border-b border-b-white/5 px-4 py-3 text-left">Status</th>
                    <th className="text-white/40 font-bold uppercase tracking-wider text-[11px] border-b border-b-white/5 px-4 py-3 text-right">Actions</th>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading && (activeTab === 'CONTACT' ? contactPersons : getFilteredAdmins()).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" className="py-12 border-b-white/5">
                        <CircularProgress size={30} className="text-primary" />
                      </TableCell>
                    </TableRow>
                  ) : (activeTab === 'CONTACT' ? contactPersons : getFilteredAdmins()).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" className="py-12 text-white/40 uppercase tracking-widest text-sm border-b-white/5">
                        No {activeTab} accounts found
                      </TableCell>
                    </TableRow>
                  ) : (
                    (activeTab === 'CONTACT' ? contactPersons : getFilteredAdmins()).map((item) => (
                      <TableRow key={item.VCP_Contact_person_id || item.VA_Admin_id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'rgba(255,255,255,0.02)' } }}>
                        <TableCell className="text-white/70 font-medium border-b-white/5">{item.VCP_Contact_person_id || item.VA_Admin_id}</TableCell>
                        <TableCell className={`font-medium border-b-white/5 transition-colors ${(item.VCP_Status || item.VA_Status) === 'A' || (item.VCP_Status || item.VA_Status) === 'ACTIVE' ? 'text-white' : 'text-white/30 line-through'}`}>{item.VCP_Name || item.VA_Name || '-'}</TableCell>
                        <TableCell className={`border-b-white/5 transition-colors ${(item.VCP_Status || item.VA_Status) === 'A' || (item.VCP_Status || item.VA_Status) === 'ACTIVE' ? 'text-white/70' : 'text-white/20'}`}>{item.VCP_Department || item.VA_Role || '-'}</TableCell>
                        <TableCell className={`border-b-white/5 transition-colors ${(item.VCP_Status || item.VA_Status) === 'A' || (item.VCP_Status || item.VA_Status) === 'ACTIVE' ? 'text-white/70' : 'text-white/20'}`}>{item.VCP_Email || item.VA_Email || '-'}</TableCell>
                        {activeTab === 'CONTACT' && <TableCell className={`border-b-white/5 transition-colors ${item.VCP_Status === 'A' ? 'text-white/70' : 'text-white/20'}`}>{item.VCP_Phone || '-'}</TableCell>}
                        <TableCell className="border-b-white/5">
                           <button 
                             onClick={() => handleToggleStatus(item)}
                             disabled={isLoading || activeTab !== 'CONTACT'}
                             title={activeTab === 'CONTACT' ? "Click to toggle status" : "Managed in All Users"}
                             className={`px-2 py-1 text-[10px] uppercase tracking-wider font-bold transition-all ${activeTab === 'CONTACT' ? 'cursor-pointer' : 'cursor-default opacity-50'} ${(item.VCP_Status || item.VA_Status) === 'A' || (item.VCP_Status || item.VA_Status) === 'ACTIVE' ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'}`}
                           >
                             {(item.VCP_Status || item.VA_Status) === 'A' || (item.VCP_Status || item.VA_Status) === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE'}
                           </button>
                        </TableCell>
                        <TableCell align="right" className="border-b-white/5">
                          {activeTab === 'CONTACT' ? (
                            <IconButton onClick={() => handleOpenForm(item)} size="small" className="text-white/40 hover:text-white">
                              <Edit2 size={16} />
                            </IconButton>
                          ) : (
                            <span className="text-[10px] text-white/20 uppercase tracking-widest italic">Read Only</span>
                          )}
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
