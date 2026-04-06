import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import {
  GetAllVisitors,
  GetVisitorById,
  ToggleVisitorStatus,
  AddVisitor
} from '../../../actions/VisitorAction';
import Header from '../../../components/Admin/Layout/Header';
import {
  User, Mail, Phone, MapPin, Building, Shield,
  Search, Plus, RefreshCw, X, Hash, CheckCircle2,
  AlertCircle, Briefcase
} from 'lucide-react';

const StatusBadge = ({ status }) => {
  const s = (status || '').toString().trim().toUpperCase();
  if (s === 'ACTIVE' || s === 'A') {
    return (
      <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg text-[12px] font-medium tracking-[0.2em] uppercase flex items-center gap-2 w-max">
        <CheckCircle2 size={12} /> Active
      </div>
    );
  }
  return (
    <div className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-lg text-[12px] font-medium tracking-[0.2em] uppercase flex items-center gap-2 w-max">
      <AlertCircle size={12} /> Inactive
    </div>
  );
};

const VisitorManagement = () => {
  const dispatch = useDispatch();
  const { visitors, isLoading, error } = useSelector((state) => state.visitorManagement);

  const [searchId, setSearchId] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    VV_Contact_person_id: '',
    VV_Name: '',
    VV_NIC_Passport_NO: '',
    VV_Visiting_places: '',
    VV_Visitor_Type: '',
    VV_Phone: '',
    VV_Email: '',
    VV_Company: ''
  });

  useEffect(() => {
    dispatch(GetAllVisitors());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchId.trim() !== '') {
      dispatch(GetVisitorById(searchId));
    } else {
      dispatch(GetAllVisitors());
    }
  };

  const handleToggleStatus = (visitor) => {
    // Robust check for active status (case-insensitive)
    const statusValue = (visitor.VV_Status || '').toString().trim().toUpperCase();
    const isActive = statusValue === 'ACTIVE' || statusValue === 'A';

    const newStatus = isActive ? 'I' : 'A';
    dispatch(ToggleVisitorStatus(visitor.VV_Visitor_id, newStatus));
  };

  const openModal = () => {
    setFormData({
      VV_Contact_person_id: '',
      VV_Name: '',
      VV_NIC_Passport_NO: '',
      VV_Visiting_places: '',
      VV_Visitor_Type: '',
      VV_Phone: '',
      VV_Email: '',
      VV_Company: ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    dispatch(AddVisitor(formData));
    closeModal();
  };

  return (
    <div className="flex flex-col min-w-0 bg-[var(--color-bg-default)] min-h-screen">
      <Header />

      <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full animate-fade-in-slow relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        <div className="max-w-[1600px] mx-auto">

          <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/[0.03] pb-6 gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-[2px] bg-primary"></div>
                <span className="text-primary uppercase tracking-wider text-xs font-semibold">Access Control</span>
              </div>
              <h1 className="text-white uppercase px-1 text-2xl font-bold tracking-tight">
                Visitor Management
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">

              {/* Search Form */}
              <form onSubmit={handleSearch} className="flex items-center bg-black/40 border border-white/10 hover:border-white/20 transition-colors rounded-xl px-4 py-3 min-w-[250px]">
                <Search size={16} className="text-gray-400 mr-3" />
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Search Visitor by ID..."
                  className="bg-transparent text-[13px] text-white focus:outline-none w-full"
                />
                {searchId && (
                  <button type="button" onClick={() => { setSearchId(''); dispatch(GetAllVisitors()); }} className="text-gray-500 hover:text-white">
                    <RefreshCw size={14} />
                  </button>
                )}
              </form>

              {/* Add Visitor Button */}
              <button onClick={openModal} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl text-[13px] font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-primary/20">
                <Plus size={16} /> Add Visitor
              </button>

            </div>
          </header>

          <div className="bg-[var(--color-bg-paper)] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none opacity-50"></div>

            {isLoading ? (
              <div className="p-20 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 border-4 border-white/5 border-t-primary rounded-full animate-spin mb-6"></div>
                <p className="text-gray-300 text-[13px] uppercase tracking-[0.3em] font-medium">Scanning Entries...</p>
              </div>
            ) : error ? (
              <div className="p-20 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20 text-primary">
                  <AlertCircle size={24} />
                </div>
                <p className="text-primary text-[14px] uppercase tracking-widest">{error}</p>
              </div>
            ) : (
              <TableContainer component={Paper} className="bg-[#0F0F10] border border-white/5 rounded-none z-10 relative">
                <Table sx={{ minWidth: 650 }} aria-label="visitors table">
                  <TableHead className="bg-black/40">
                    <TableRow>
                      <TableCell className="text-white/40 font-bold uppercase tracking-wider text-[11px] border-b-white/5">ID</TableCell>
                      <TableCell className="text-white/40 font-bold uppercase tracking-wider text-[11px] border-b-white/5">Visitor</TableCell>
                      <TableCell className="text-white/40 font-bold uppercase tracking-wider text-[11px] border-b-white/5">Credentials</TableCell>
                      <TableCell className="text-white/40 font-bold uppercase tracking-wider text-[11px] border-b-white/5">Company</TableCell>
                      <TableCell className="text-white/40 font-bold uppercase tracking-wider text-[11px] border-b-white/5">Destination</TableCell>
                      <TableCell className="text-white/40 font-bold uppercase tracking-wider text-[11px] border-b-white/5">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {visitors && visitors.length > 0 ? (
                      visitors.map((visitor) => {
                        const isActive = (visitor.VV_Status || '').toString().trim().toUpperCase() === 'A' || (visitor.VV_Status || '').toString().trim().toUpperCase() === 'ACTIVE';
                        return (
                          <TableRow key={visitor.VV_Visitor_id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'rgba(255,255,255,0.02)' } }}>
                            <TableCell className="text-white/70 font-medium border-b-white/5">{visitor.VV_Visitor_id}</TableCell>
                            <TableCell className={`font-medium border-b-white/5 transition-colors ${isActive ? 'text-white' : 'text-white/30 line-through'}`}>{visitor.VV_Name || '-'}</TableCell>
                            <TableCell className={`border-b-white/5 transition-colors ${isActive ? 'text-white/70' : 'text-white/20'}`}>{visitor.VV_NIC_Passport_NO || '-'}</TableCell>
                            <TableCell className={`border-b-white/5 transition-colors ${isActive ? 'text-white/70' : 'text-white/20'}`}>{visitor.VV_Company || '-'}</TableCell>
                            <TableCell className={`border-b-white/5 transition-colors ${isActive ? 'text-white/70' : 'text-white/20'}`}>{visitor.VV_Visiting_places || '-'}</TableCell>
                            <TableCell className="border-b-white/5">
                               <button 
                                 onClick={() => handleToggleStatus(visitor)}
                                 disabled={isLoading}
                                 title="Click to toggle status"
                                 className={`px-2 py-1 text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer ${isActive ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'}`}
                               >
                                 {isActive ? 'ACTIVE' : 'INACTIVE'}
                               </button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center" className="py-12 text-white/40 uppercase tracking-widest text-sm border-b-white/5">
                          No Visitors detected in registry
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Add Visitor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
          <div className="bg-[var(--color-bg-paper)] border border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative my-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>

            <div className="flex justify-between items-center p-6 border-b border-white/5 relative z-10 bg-black/20">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                <h2 className="text-lg font-bold text-white uppercase tracking-[0.2em]">Add New Entry</h2>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-8 space-y-6 relative z-10 max-h-[80vh] overflow-y-auto custom-scrollbar">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex items-center gap-2 px-1">
                    <User size={12} className="text-primary/60" /> Full Name
                  </label>
                  <input required type="text" name="VV_Name" value={formData.VV_Name} onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-[13px] text-white focus:outline-none focus:border-primary/50 transition-colors placeholder-white/5" placeholder="JOHN SMITH" />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex items-center gap-2 px-1">
                    <Hash size={12} className="text-primary/60" /> NIC / Passport NO
                  </label>
                  <input required type="text" name="VV_NIC_Passport_NO" value={formData.VV_NIC_Passport_NO} onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-[13px] text-white focus:outline-none focus:border-primary/50 transition-colors placeholder-white/5" placeholder="Enter identification" />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex items-center gap-2 px-1">
                    <Mail size={12} className="text-primary/60" /> Email Address
                  </label>
                  <input required type="email" name="VV_Email" value={formData.VV_Email} onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-[13px] text-white focus:outline-none focus:border-primary/50 transition-colors placeholder-white/5" placeholder="EMAIL@EXAMPLE.COM" />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex items-center gap-2 px-1">
                    <Phone size={12} className="text-primary/60" /> Phone Number
                  </label>
                  <input required type="text" name="VV_Phone" value={formData.VV_Phone} onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-[13px] text-white focus:outline-none focus:border-primary/50 transition-colors placeholder-white/5" placeholder="+94 7X XXX XXXX" />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex items-center gap-2 px-1">
                    <Building size={12} className="text-primary/60" /> Representing Company
                  </label>
                  <input required type="text" name="VV_Company" value={formData.VV_Company} onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-[13px] text-white focus:outline-none focus:border-primary/50 transition-colors placeholder-white/5" placeholder="COMPANY NAME" />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex items-center gap-2 px-1">
                    <Briefcase size={12} className="text-primary/60" /> Visitor Classification
                  </label>
                  <input required type="text" name="VV_Visitor_Type" value={formData.VV_Visitor_Type} onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-[13px] text-white focus:outline-none focus:border-primary/50 transition-colors placeholder-white/5" placeholder="E.G. CONTRACTOR, GUEST" />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex items-center gap-2 px-1">
                    <MapPin size={12} className="text-primary/60" /> Visiting Area
                  </label>
                  <input required type="text" name="VV_Visiting_places" value={formData.VV_Visiting_places} onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-[13px] text-white focus:outline-none focus:border-primary/50 transition-colors placeholder-white/5" placeholder="E.G. PRODUCTION FLOOR" />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex items-center gap-2 px-1">
                    <Hash size={12} className="text-primary/60" /> Contact Person ID
                  </label>
                  <input required type="number" name="VV_Contact_person_id" value={formData.VV_Contact_person_id} onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-[13px] text-white focus:outline-none focus:border-primary/50 transition-colors placeholder-white/5" placeholder="ENTER CP ID" />
                </div>
              </div>

              <div className="pt-8 flex justify-end gap-3 border-t border-white/5">
                <button type="button" onClick={closeModal} className="px-8 py-3.5 rounded-xl text-[13px] font-bold text-gray-400 hover:bg-white/5 uppercase tracking-widest transition-all">
                  Cancel
                </button>
                <button type="submit" className="px-10 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-[13px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black">
                  Authorize Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default VisitorManagement;
