import React from 'react';
import { Eye, Search, Download } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const styles = {
    'Approved': 'text-green-500 bg-green-500/10 border-green-500/20',
    'Pending': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    'Rejected': 'text-primary bg-primary/10 border-primary/20',
    'Checked In': 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    'Checked Out': 'text-gray-300/90 bg-white/5 border-white/10',
    'Accepted': 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    'Sent to Admin': 'text-orange-500 bg-orange-500/10 border-orange-500/20',
  };

  return (
    <span className={`px-2 py-0.5 text-[10px] font-bold tracking-[0.15em] uppercase border rounded-md shadow-sm ${styles[status] || styles['Pending']}`}>
      {status}
    </span>
  );
};

const RequestsTable = ({ requests, searchTerm, setSearchTerm, statusFilter, setStatusFilter, onReview }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50 animate-fade-in">

      {/* Table Header Section */}
      <div className="p-6 sm:p-8 border-b border-gray-100 bg-[#F8F9FA] flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(200,16,46,0.1)]">
            <Download size={22} className="opacity-80" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white uppercase">Personnel Authorization</h2>
            <p className="text-gray-300 text-[13px] font-medium uppercase tracking-[0.2em] mt-1 opacity-90">Database Synchronization Active</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          {/* Custom Search Bar */}
          <div className="relative flex-1 xl:w-72 group">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300/80 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="SEARCH MATRIX..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-[#1A1A1A] placeholder:text-gray-400 focus:border-primary focus:bg-white outline-none transition-all uppercase tracking-widest"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Custom Filter Select */}
          <div className="relative min-w-[160px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] font-medium text-[#1A1A1A] uppercase tracking-widest focus:border-primary focus:bg-white transition-all cursor-pointer outline-none appearance-none"
            >
              <option value="All">ALL STATUS</option>
              <option value="Pending">PENDING</option>
              <option value="Approved">APPROVED</option>
              <option value="Rejected">REJECTED</option>
              <option value="Checked Out">CHECKED OUT</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300/80 border-l border-white/10 pl-3">
              <Eye size={12} />
            </div>
          </div>

        </div>
      </div>

      <div className="overflow-x-auto sm:overflow-visible p-4 sm:p-0">
        <table className="w-full text-left border-separate border-spacing-y-4 sm:border-spacing-y-0 sm:border-collapse min-w-0 sm:min-w-[700px] block sm:table">
          <thead className="hidden sm:table-header-group">
            <tr className="bg-[#F8F9FA] border-b border-gray-100 text-gray-400 text-[13px] font-bold uppercase tracking-[0.2em]">
              <th className="px-8 py-3 w-20 text-center">Unit</th>
              <th className="px-8 py-3">Visitor Identity</th>
              <th className="px-8 py-3 text-center">Date to Visit</th>
              <th className="px-8 py-3">Objective</th>
              <th className="px-8 py-3 text-center">Authorization</th>
              <th className="px-8 py-3 text-right">Control</th>
            </tr>
          </thead>
          <tbody className="block sm:table-row-group">
            {requests.map((visitor) => (
              <tr key={visitor.id} className="group transition-all hover:bg-[#F8F9FA]/50 block sm:table-row bg-white sm:bg-transparent border-b border-gray-50 sm:border-none p-6 sm:p-0">
                <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-5 text-left sm:text-center border-b border-white/5 sm:border-none last:border-none">
                  <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3">Unit Member Count</span>
                  <div className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/5 text-[13px] font-medium text-gray-300 flex items-center justify-center transition-all mx-0 sm:mx-auto group-hover:border-primary/20 group-hover:text-white">
                    {visitor.members.length + 1}
                  </div>
                </td>
                <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-5 border-b border-white/5 sm:border-none last:border-none">
                  <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3">Visitor Identity</span>
                  <div>
                    <p className="text-[#1A1A1A] text-[13px] font-bold uppercase tracking-wider">{visitor.name}</p>
                  </div>
                </td>
                <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-5 border-b border-white/5 sm:border-none last:border-none text-center">
                  <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3">Date to Visit</span>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <div className="text-[#1A1A1A] text-[13px] font-bold">
                      {visitor.date ? visitor.date.split(' ')[0] : ''}
                    </div>
                  </div>
                </td>
                <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-5 border-b border-white/5 sm:border-none last:border-none">
                  <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3">Objective</span>
                  <p className="text-[#1A1A1A] text-[13px] font-semibold uppercase tracking-wider truncate max-w-[200px]">
                    {visitor.rawRequest?.VVR_Purpose || visitor.purpose || 'N/A'}
                  </p>
                </td>
                <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-5 text-left sm:text-center border-b border-white/5 sm:border-none last:border-none">
                  <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Authorization</span>
                  <StatusBadge status={visitor.status} />
                </td>
                <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-5 text-left sm:text-right">
                  <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Actions</span>
                  <button
                    onClick={() => onReview(visitor)}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl border border-gray-200 text-[#1A1A1A] text-[11px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all group/btn shadow-sm"
                  >
                    <Eye size={11} className="group-hover/btn:scale-110 transition-transform" />
                    Review
                  </button>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan="6" className="px-8 py-20 text-center text-gray-300 uppercase text-xs tracking-[0.3em] font-medium opacity-80">
                  NO VISITOR AUTHORIZATIONS FOUND
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestsTable;
