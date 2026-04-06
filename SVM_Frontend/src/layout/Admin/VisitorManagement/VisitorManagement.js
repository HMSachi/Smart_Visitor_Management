import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import {
  GetAllVisitors,
  GetVisitorById,
  ToggleVisitorStatus
} from '../../../actions/VisitorAction';
import Header from '../../../components/Admin/Layout/Header';
import {
  User, Mail, Phone, MapPin, Building, Shield,
  Search, RefreshCw, X, Hash, CheckCircle2,
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

      {/* Removed Modal for Add Visitor */}

    </div>
  );
};

export default VisitorManagement;
