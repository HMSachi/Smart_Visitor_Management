import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  GetAllAdministrator, 
  GetAdministratorById, 
  DeleteAdministrator, 
  AddAdministrator, 
  UpdateAdministrator 
} from '../../../actions/AdministratorAction';
import Header from '../../../components/Admin/Layout/Header';
import { Shield, Mail, Calendar, Hash, CheckCircle2, AlertCircle, Search, Plus, Edit, RefreshCw, X, User } from 'lucide-react';

const StatusBadge = ({ status }) => {
  if (status === 'Active' || status === 'A') {
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

const AllUsers = () => {
  const dispatch = useDispatch();
  const { administrators, isLoading, error } = useSelector((state) => state.administrator);
  const loading = isLoading;
  
  const [searchId, setSearchId] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [formData, setFormData] = useState({
    VA_Admin_id: '',
    VA_Name: '',
    VA_Email: '',
    VA_Role: '',
    VA_Password: ''
  });

  useEffect(() => {
    dispatch(GetAllAdministrator());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchId.trim() !== '') {
      dispatch(GetAdministratorById(searchId));
    } else {
      dispatch(GetAllAdministrator());
    }
  };

  const handleToggleStatus = (admin) => {
      // Robust check for active status (case-insensitive and handles full words)
      const statusValue = (admin.VA_Status || '').toString().trim().toUpperCase();
      const isActive = statusValue === 'ACTIVE' || statusValue === 'A';
      
      const newStatus = isActive ? 'I' : 'A';
      dispatch(DeleteAdministrator(admin.VA_Admin_id, newStatus));
  };

  const openModal = (mode, admin = null) => {
    setModalMode(mode);
    if (admin) {
      setFormData({
        VA_Admin_id: admin.VA_Admin_id || '',
        VA_Name: admin.VA_Name || '',
        VA_Email: admin.VA_Email || '',
        VA_Role: admin.VA_Role || '',
        VA_Password: admin.VA_Password || ''
      });
    } else {
      setFormData({
        VA_Admin_id: '',
        VA_Name: '',
        VA_Email: '',
        VA_Role: '',
        VA_Password: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      dispatch(AddAdministrator(formData));
    } else {
      dispatch(UpdateAdministrator(formData));
    }
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
                <span className="text-primary uppercase tracking-wider text-xs font-semibold">Command Center</span>
              </div>
              <h1 className="text-white uppercase px-1 text-2xl font-bold tracking-tight">
                All System Administrators
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
                      placeholder="Search Admin by ID..." 
                      className="bg-transparent text-[13px] text-white focus:outline-none w-full" 
                  />
                  {searchId && (
                      <button type="button" onClick={() => { setSearchId(''); dispatch(GetAllAdministrator()); }} className="text-gray-500 hover:text-white">
                          <RefreshCw size={14} />
                      </button>
                  )}
              </form>

              {/* Add Employee Button */}
              <button onClick={() => openModal('add')} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl text-[13px] font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-primary/20">
                <Plus size={16} /> Add Administrator
              </button>

            </div>
          </header>

          <div className="bg-[var(--color-bg-paper)] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none opacity-50"></div>
            
            {loading ? (
              <div className="p-20 flex flex-col items-center justify-center text-center">
                 <div className="w-12 h-12 border-4 border-white/5 border-t-primary rounded-full animate-spin mb-6"></div>
                 <p className="text-gray-300 text-[13px] uppercase tracking-[0.3em] font-medium">Fetching Authorized Nodes...</p>
              </div>
            ) : error ? (
              <div className="p-20 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20 text-primary">
                    <AlertCircle size={24} />
                  </div>
                  <p className="text-primary text-[14px] uppercase tracking-widest">{error}</p>
              </div>
            ) : (
              <div className="w-full overflow-x-auto relative z-10">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-black/40 border-b border-white/5">
                      <th className="px-8 py-6 text-[12px] font-medium tracking-[0.3em] uppercase text-white/70">ID Node</th>
                      <th className="px-8 py-6 text-[12px] font-medium tracking-[0.3em] uppercase text-white/70">Personnel Entity</th>
                      <th className="px-8 py-6 text-[12px] font-medium tracking-[0.3em] uppercase text-white/70">System Role</th>
                      <th className="px-8 py-6 text-[12px] font-medium tracking-[0.3em] uppercase text-white/70">Created Origin</th>
                      <th className="px-8 py-6 text-[12px] font-medium tracking-[0.3em] uppercase text-white/70">Status</th>
                      <th className="px-8 py-6 text-[12px] font-medium tracking-[0.3em] uppercase text-white/70">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {administrators.map((admin) => (
                      <tr key={admin.VA_Admin_id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-8 py-6">
                            <div className="flex items-center gap-2 text-gray-300">
                                <Hash size={12} className="text-primary/40 group-hover:text-primary transition-colors" />
                                <span className="text-[13px] font-mono tracking-widest">{admin.VA_Admin_id}</span>
                            </div>
                        </td>
                        <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-default)] border border-white/5 flex items-center justify-center text-primary font-medium text-sm shadow-inner group-hover:border-primary/30 transition-all">
                                  {admin.VA_Name ? admin.VA_Name.substring(0,2).toUpperCase() : 'NA'}
                               </div>
                               <div>
                                  <p className="text-white text-[13px] font-medium uppercase tracking-widest mb-1">{admin.VA_Name}</p>
                                  <p className="text-gray-400 text-[11px] font-medium tracking-[0.1em] flex items-center gap-1.5 hover:text-white transition-colors">
                                    <Mail size={10} /> {admin.VA_Email}
                                  </p>
                               </div>
                            </div>
                        </td>
                        <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                                <Shield size={12} className="text-primary/60" />
                                <span className="text-white/90 text-[13px] font-medium uppercase tracking-[0.1em]">{admin.VA_Role}</span>
                            </div>
                        </td>
                        <td className="px-8 py-6">
                            <div className="flex items-center gap-2 text-gray-300/80">
                                <Calendar size={12} className="text-primary/40" />
                                <span className="text-[12px] font-medium uppercase tracking-widest">{admin.VA_Created_Date ? admin.VA_Created_Date.split(' ')[0] : 'N/A'}</span>
                            </div>
                        </td>
                        <td className="px-8 py-6">
                            <StatusBadge status={admin.VA_Status} />
                        </td>
                        <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                                <button title="Edit Employee" onClick={() => openModal('edit', admin)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all">
                                    <Edit size={14} />
                                </button>
                                <button 
                                  title="Toggle Status (Delete/Restore)"
                                  onClick={() => handleToggleStatus(admin)}
                                  className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all ${
                                    (admin.VA_Status || '').toString().trim().toUpperCase() === 'A' || (admin.VA_Status || '').toString().trim().toUpperCase() === 'ACTIVE'
                                      ? 'bg-primary/10 hover:bg-primary/20 border-primary/30 text-primary hover:text-primary' 
                                      : 'bg-green-500/10 hover:bg-green-500/20 border-green-500/30 text-green-500 hover:text-green-500'}`}
                                >
                                    <RefreshCw size={14} />
                                </button>
                            </div>
                        </td>
                      </tr>
                    ))}
                    {!administrators || administrators.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-8 py-20 text-center text-gray-400 text-[13px] uppercase tracking-widest">
                            No System Administrators found
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Add / Edit Administrator */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[var(--color-bg-paper)] border border-white/10 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
            
            <div className="flex justify-between items-center p-6 border-b border-white/5 relative z-10">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                {modalMode === 'add' ? 'Add New System Admin' : 'Edit Administrator Profile'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 relative z-10">
              <div className="space-y-1">
                <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex gap-2"><User size={12}/> Name</label>
                <input required type="text" name="VA_Name" value={formData.VA_Name} onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-white focus:outline-none focus:border-primary/50 transition-colors" placeholder="e.g. John Doe" />
              </div>
              
              <div className="space-y-1">
                <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex gap-2"><Mail size={12}/> Email</label>
                <input required type="email" name="VA_Email" value={formData.VA_Email} onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-white focus:outline-none focus:border-primary/50 transition-colors" placeholder="example@mas.com" />
              </div>
              
              <div className="space-y-1">
                <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex gap-2"><Shield size={12}/> Role</label>
                <input required type="text" name="VA_Role" value={formData.VA_Role} onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-white focus:outline-none focus:border-primary/50 transition-colors" placeholder="e.g. Admin, Security" />
              </div>
              
              <div className="space-y-1">
                <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex gap-2"><Hash size={12}/> Password</label>
                <input required type="password" name="VA_Password" value={formData.VA_Password} onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-white focus:outline-none focus:border-primary/50 transition-colors" placeholder="Enter secure password" />
              </div>

              <div className="pt-6 flex justify-end gap-3 mt-4">
                <button type="button" onClick={closeModal} className="px-6 py-3 rounded-xl text-[13px] font-bold text-gray-400 hover:bg-white/5 uppercase tracking-wider transition-all">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white text-[13px] font-bold uppercase tracking-wider shadow-lg shadow-primary/20 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-primary">
                  {modalMode === 'add' ? 'Create Node' : 'Update Access'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AllUsers;
