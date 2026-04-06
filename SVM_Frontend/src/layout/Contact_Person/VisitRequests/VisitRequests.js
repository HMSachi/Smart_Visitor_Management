import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import {
  AddVisitRequest,
  UpdateVisitRequest,
  GetVisitRequestsByCP,
  ApproveVisitRequest
} from '../../../actions/VisitRequestAction';
import { GetVisitorsByCP } from '../../../actions/VisitorAction';
import Header from '../../../components/Contact_Person/Layout/Header';
import Sidebar from '../../../components/Contact_Person/Layout/Sidebar';
import {
  Search, Plus, X, Calendar, MapPin, ClipboardList, 
  Send, Edit, CheckCircle2, XCircle, Clock, Hash, User,
  AlertCircle, Filter, ChevronDown
} from 'lucide-react';

const StatusBadge = ({ status }) => {
  const s = (status || '').toString().trim().toUpperCase();
  switch (s) {
    case 'A':
    case 'APPROVED':
      return (
        <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg text-[10px] font-bold tracking-[0.1em] uppercase flex items-center gap-2 w-max">
          <CheckCircle2 size={12} /> Approved
        </div>
      );
    case 'R':
    case 'REJECTED':
      return (
        <div className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-lg text-[10px] font-bold tracking-[0.1em] uppercase flex items-center gap-2 w-max">
          <XCircle size={12} /> Rejected
        </div>
      );
    case 'P':
    case 'PENDING':
    default:
      return (
        <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-lg text-[10px] font-bold tracking-[0.1em] uppercase flex items-center gap-2 w-max">
          <Clock size={12} /> Pending
        </div>
      );
  }
};

const VisitRequests = () => {
  const dispatch = useDispatch();
  const { visitRequestsByCP, isLoading, error } = useSelector((state) => state.visitRequestsState);
  const { visitorsByCP } = useSelector((state) => state.visitorManagement);
  
  const user = useSelector(state => state.login.user);
  const cpId = user?.ResultSet?.[0]?.VA_Admin_id || user?.ResultSet?.[0]?.VCP_Contact_person_id || 2;

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [formData, setFormData] = useState({
    VVR_Request_id: '',
    VVR_Visitor_id: '',
    VVR_Contact_person_id: cpId,
    VVR_Visit_Date: '',
    VVR_Places_to_Visit: '',
    VVR_Purpose: ''
  });

  useEffect(() => {
    dispatch(GetVisitRequestsByCP(cpId));
    dispatch(GetVisitorsByCP(cpId));
  }, [dispatch, cpId]);

  const openModal = (mode, request = null) => {
    setModalMode(mode);
    if (request) {
      setFormData({
        VVR_Request_id: request.VVR_Request_id,
        VVR_Visitor_id: request.VVR_Visitor_id,
        VVR_Contact_person_id: cpId,
        VVR_Visit_Date: request.VVR_Visit_Date ? request.VVR_Visit_Date.split('T')[0] : '',
        VVR_Places_to_Visit: request.VVR_Places_to_Visit,
        VVR_Purpose: request.VVR_Purpose
      });
    } else {
      setFormData({
        VVR_Request_id: '',
        VVR_Visitor_id: '',
        VVR_Contact_person_id: cpId,
        VVR_Visit_Date: '',
        VVR_Places_to_Visit: '',
        VVR_Purpose: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      dispatch(AddVisitRequest(formData));
    } else {
      dispatch(UpdateVisitRequest(formData));
    }
    closeModal();
  };

  const handleAction = (id, status) => {
    dispatch(ApproveVisitRequest(id, status));
    setTimeout(() => dispatch(GetVisitRequestsByCP(cpId)), 2000);
  };

  const filteredRequests = visitRequestsByCP ? visitRequestsByCP.filter(req => 
    String(req.VVR_Request_id).includes(searchTerm) || 
    req.VVR_Purpose?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="flex bg-secondary overflow-hidden text-white h-screen w-full">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 bg-[var(--color-bg-default)] overflow-y-auto">
        <Header title="Visit Requests Management" />

        <div className="p-4 md:p-8 animate-fade-in-slow relative max-w-[1600px] mx-auto w-full">
          
          <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/[0.03] pb-6 gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-[2px] bg-primary"></div>
                <span className="text-primary uppercase tracking-wider text-xs font-semibold">Visitation Protocol</span>
              </div>
              <h1 className="text-white uppercase px-1 text-2xl font-bold tracking-tight">Active Visit Requests</h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
              <div className="flex items-center bg-black/40 border border-white/10 hover:border-white/20 transition-colors rounded-xl px-4 py-3 min-w-[300px]">
                <Search size={16} className="text-gray-400 mr-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search Request (ID/Purpose)..."
                  className="bg-transparent text-[13px] text-white focus:outline-none w-full"
                />
              </div>

              <button onClick={() => openModal('add')} className="flex items-center gap-2 bg-primary hover:bg-[var(--color-primary-hover)] text-white px-6 py-3 rounded-xl text-[13px] font-bold uppercase tracking-widest transition-all shadow-lg">
                <Plus size={16} /> Create Visit Request
              </button>
            </div>
          </header>

          <div className="bg-[var(--color-bg-paper)] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none opacity-50"></div>

            {isLoading ? (
              <div className="p-20 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 border-4 border-white/5 border-t-primary rounded-full animate-spin mb-6"></div>
                <p className="text-gray-300 text-[13px] uppercase tracking-[0.3em] font-medium">Fetching Protocol Data...</p>
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
                <Table sx={{ minWidth: 650 }} aria-label="visit requests table">
                  <TableHead className="bg-black/40">
                    <TableRow>
                      <TableCell className="text-white/40 font-bold uppercase tracking-wider text-[11px] border-b-white/5">ID</TableCell>
                      <TableCell className="text-white/40 font-bold uppercase tracking-wider text-[11px] border-b-white/5">Visitor ID</TableCell>
                      <TableCell className="text-white/40 font-bold uppercase tracking-wider text-[11px] border-b-white/5">Date</TableCell>
                      <TableCell className="text-white/40 font-bold uppercase tracking-wider text-[11px] border-b-white/5">Purpose</TableCell>
                      <TableCell className="text-white/40 font-bold uppercase tracking-wider text-[11px] border-b-white/5">Destination</TableCell>
                      <TableCell className="text-white/40 font-bold uppercase tracking-wider text-[11px] border-b-white/5">Status</TableCell>
                      <TableCell className="text-white/40 font-bold uppercase tracking-wider text-[11px] border-b-white/5" align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredRequests && filteredRequests.length > 0 ? (
                      filteredRequests.map((req) => (
                        <TableRow key={req.VVR_Request_id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'rgba(255,255,255,0.02)' } }}>
                          <TableCell className="text-white/70 font-mono border-b-white/5">#{req.VVR_Request_id}</TableCell>
                          <TableCell className="text-white/70 font-medium border-b-white/5">
                            <div className="flex items-center gap-2">
                                <User size={12} className="text-primary/50" />
                                <span>{req.VVR_Visitor_id}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-white/70 border-b-white/5">
                            <div className="flex items-center gap-2">
                                <Calendar size={12} className="text-primary/50" />
                                <span>{req.VVR_Visit_Date ? req.VVR_Visit_Date.split('T')[0] : 'N/A'}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-white border-b-white/5 uppercase tracking-wider text-[12px] font-medium">{req.VVR_Purpose || '-'}</TableCell>
                          <TableCell className="text-white/70 border-b-white/5">{req.VVR_Places_to_Visit || '-'}</TableCell>
                          <TableCell className="border-b-white/5">
                            <StatusBadge status={req.VVR_Status} />
                          </TableCell>
                          <TableCell align="right" className="border-b-white/5">
                            <div className="flex items-center justify-end gap-2">
                              <IconButton size="small" onClick={() => openModal('edit', req)} className="text-blue-400 hover:bg-blue-400/10">
                                <Edit size={16} />
                              </IconButton>
                              <IconButton size="small" onClick={() => handleAction(req.VVR_Request_id, 'C')} title="Cancel Request" className="text-primary hover:bg-primary/10">
                                <X size={16} />
                              </IconButton>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center" className="py-12 text-white/40 uppercase tracking-widest text-sm border-b-white/5">
                          No Visitation Requests Found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
        </div>

        {/* Modal for Add/Update Visit Request */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
            <div className="bg-[var(--color-bg-paper)] border border-white/10 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative my-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>

              <div className="flex justify-between items-center p-6 border-b border-white/5 relative z-10 bg-black/20">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                  <h2 className="text-lg font-bold text-white uppercase tracking-[0.2em]">
                    {modalMode === 'add' ? 'Dispatch Visit Request' : 'Modify Visit Request'}
                  </h2>
                </div>
                <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 relative z-10">
                <div className="space-y-4">
                  {modalMode === 'add' && (
                    <div className="space-y-2">
                      <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex items-center gap-2 px-1">
                        <User size={12} className="text-primary/60" /> Select Visitor
                      </label>
                      <select
                        required
                        name="VVR_Visitor_id"
                        value={formData.VVR_Visitor_id}
                        onChange={handleInputChange}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-[13px] text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer"
                      >
                        <option value="">SELECT AUTHORIZED VISITOR</option>
                        {visitorsByCP && visitorsByCP.map(v => (
                          <option key={v.VV_Visitor_id} value={v.VV_Visitor_id}>
                            {v.VV_Name} (ID: {v.VV_Visitor_id})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex items-center gap-2 px-1">
                      <Calendar size={12} className="text-primary/60" /> Proposed Visit Date
                    </label>
                    <input
                      required
                      type="date"
                      name="VVR_Visit_Date"
                      value={formData.VVR_Visit_Date}
                      onChange={handleInputChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-[13px] text-white focus:outline-none focus:border-primary/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex items-center gap-2 px-1">
                      <MapPin size={12} className="text-primary/60" /> Destination Areas
                    </label>
                    <input
                      required
                      type="text"
                      name="VVR_Places_to_Visit"
                      value={formData.VVR_Places_to_Visit}
                      onChange={handleInputChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-[13px] text-white focus:outline-none focus:border-primary/50"
                      placeholder="e.g. Conference Room B, Factory Floor"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex items-center gap-2 px-1">
                      <ClipboardList size={12} className="text-primary/60" /> Purpose of Visitation
                    </label>
                    <textarea
                      required
                      name="VVR_Purpose"
                      value={formData.VVR_Purpose}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-[13px] text-white focus:outline-none focus:border-primary/50 resize-none"
                      placeholder="Specify the reason for the visit..."
                    ></textarea>
                  </div>
                </div>

                <div className="pt-6 flex justify-end gap-3 border-t border-white/5">
                  <button type="button" onClick={closeModal} className="px-8 py-3.5 rounded-xl text-[13px] font-bold text-gray-400 hover:bg-white/5 uppercase tracking-widest transition-all">
                    Discard
                  </button>
                  <button type="submit" className="px-10 py-3.5 rounded-xl bg-primary hover:bg-[var(--color-primary-hover)] text-white text-[13px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
                    <Send size={16} /> {modalMode === 'add' ? 'Send Protocol' : 'Update Protocol'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitRequests;
