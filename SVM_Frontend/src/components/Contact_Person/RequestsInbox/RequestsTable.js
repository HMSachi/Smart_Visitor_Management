import React from 'react';
import { Eye, Search, Download } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const styles = {
    'Approved': 'bg-black text-green-500 border-green-500',
    'Pending': 'bg-black text-yellow-500 border-yellow-500',
    'Rejected': 'bg-black text-mas-red border-mas-red',
    'Checked In': 'bg-black text-blue-500 border-blue-500',
    'Checked Out': 'bg-black text-mas-text-dim border-mas-text-dim',
  };

  return (
    <span className={`px-2 py-0.5 text-[11px] tracking-wider uppercase border ${styles[status] || styles['Pending']}`}>
      {status}
    </span>
  );
};

const RequestsTable = ({ requests, searchTerm, setSearchTerm, statusFilter, setStatusFilter, onReview }) => {
  return (
    <div className="bg-[#0F0F10] border border-white/5 overflow-hidden">

      {/* Table Title & Filters */}
      <div className="p-6 border-b border-white/5 bg-[#121212] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-8 h-[2px] bg-mas-red"></div>
          <div>
            <h2 className="uppercase text-white text-lg tracking-wide font-medium">Visitor Authorization</h2>
            <p className="text-mas-text-dim uppercase text-xs tracking-wider mt-1">Clearance Protocol Hub</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <input 
              type="text" 
              placeholder="ENCRYPTED SEARCH: VISITOR DATABASE..." 
              className="w-full pl-10 pr-4 py-2 bg-[#0F0F10] border border-white/10 uppercase text-xs text-white placeholder:text-white/20 focus:border-mas-red outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-mas-text-dim" />
          </div>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-[#0F0F10] border border-white/10 uppercase text-xs text-mas-text-dim focus:text-white focus:border-mas-red transition-all cursor-pointer outline-none appearance-none"
          >
            <option value="All">ALL STATUS</option>
            <option value="Pending">PENDING</option>
            <option value="Approved">APPROVED</option>
            <option value="Rejected">REJECTED</option>
            <option value="Checked Out">CHECKED OUT</option>
          </select>

          <button className="flex items-center gap-2 px-4 py-2 border border-white/10 uppercase text-xs tracking-wider text-mas-text-dim hover:text-white hover:border-mas-red transition-all group">
            <Download size={14} className="group-hover:text-mas-red" /> Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-hidden bg-[#0F0F10]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#121212] border-b border-white/5">
              <th className="px-6 py-3 text-xs tracking-wider font-medium uppercase text-mas-text-dim text-center w-16">Unit</th>
              <th className="px-6 py-3 text-xs tracking-wider font-medium uppercase text-mas-text-dim">Main Identity</th>
              <th className="px-6 py-3 text-xs tracking-wider font-medium uppercase text-mas-text-dim">Reference / Contact</th>
              <th className="px-6 py-3 text-xs tracking-wider font-medium uppercase text-mas-text-dim">Schedule Protocol</th>
              <th className="px-6 py-3 text-xs tracking-wider font-medium uppercase text-mas-text-dim text-center">Authorization</th>
              <th className="px-6 py-3 text-xs tracking-wider font-medium uppercase text-mas-text-dim text-right pr-6 text-mas-red">Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {requests.map((visitor) => (
              <React.Fragment key={visitor.batchId}>
                <tr className="group transition-all hover:bg-white/[0.02]">
                  <td className="px-6 py-3 text-center">
                    <div className="w-6 h-6 border bg-black border-white/10 text-mas-text-dim flex items-center justify-center transition-all mx-auto">
                      <div className="text-xs">{visitor.members.length + 1}</div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-black border border-white/10 flex items-center justify-center text-mas-red text-xs group-hover:border-mas-red transition-all shrink-0">
                        {visitor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-white uppercase text-sm font-medium mb-0.5">{visitor.name}</p>
                        <p className="text-mas-red/70 uppercase text-[10px] tracking-wider font-medium">Lead Personnel</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <p className="text-white uppercase text-[13px] font-medium mb-1">{visitor.batchId}</p>
                    <p className="text-mas-text-dim uppercase text-xs tracking-wide">{visitor.contactPerson}</p>
                  </td>
                  <td className="px-6 py-3">
                    <p className="text-white uppercase text-[13px] font-medium mb-1">{visitor.date} @ {visitor.timeIn}</p>
                    <p className="text-mas-text-dim uppercase text-xs tracking-wide line-clamp-1">{visitor.areas.join(' | ')}</p>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <StatusBadge status={visitor.status} />
                  </td>
                  <td className="px-6 py-3 text-right pr-6">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => onReview(visitor.id)} title="REVIEW DETAILS" className="p-1.5 border border-white/10 text-white hover:bg-white hover:text-black transition-all">
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
            {requests.length === 0 && (
                <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-mas-text-dim uppercase">
                        NO VISITOR REQUESTS FOUND
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
