import React from 'react';
import { Eye } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const styles = {
    'Approved': 'text-green-500 bg-green-500/10 border-green-500/20',
    'Pending': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    'Rejected': 'text-primary bg-primary/10 border-primary/20',
    'Checked In': 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    'Checked Out': 'text-[var(--color-text-secondary)] bg-[var(--color-surface-1)] border-[var(--color-border-soft)]',
    'Accepted': 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    'Sent to Admin': 'text-orange-500 bg-orange-500/10 border-orange-500/20',
  };

  return (
    <span className={`px-2 py-0.5 text-[10px] font-bold tracking-[0.15em] uppercase border rounded-md shadow-sm ${styles[status] || styles['Pending']}`}>
      {status}
    </span>
  );
};

const RequestsTable = ({ requests, onReview }) => {
  return (
    <div className="bg-[var(--color-bg-paper)] border border-[var(--color-border-soft)] rounded-[32px] overflow-hidden shadow-2xl relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none opacity-50"></div>

      <div className="overflow-x-auto sm:overflow-visible p-4 sm:p-0 z-10 relative">
        <table className="w-full text-left border-separate border-spacing-y-4 sm:border-spacing-y-0 sm:border-collapse min-w-0 sm:min-w-[700px] block sm:table">
          <thead className="hidden sm:table-header-group">
            <tr className="bg-[var(--color-surface-1)] border-b border-[var(--color-border-soft)] text-[var(--color-text-dim)] text-[11px] font-bold uppercase tracking-[0.2em]">
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
              <tr key={visitor.id} className="group transition-all hover:bg-[var(--color-surface-1)] block sm:table-row bg-transparent border-b border-[var(--color-border-soft)] sm:border-none p-6 sm:p-0">
                <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-5 text-left sm:text-center border-b border-[var(--color-border-soft)] sm:border-none last:border-none">
                  <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3">Unit Member Count</span>
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-surface-1)] border border-[var(--color-border-soft)] text-[13px] font-medium text-[var(--color-text-secondary)] flex items-center justify-center transition-all mx-0 sm:mx-auto group-hover:border-primary/20 group-hover:text-[var(--color-text-primary)]">
                    {visitor.members.length + 1}
                  </div>
                </td>
                <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-5 border-b border-[var(--color-border-soft)] sm:border-none last:border-none">
                  <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3">Visitor Identity</span>
                  <div>
                    <p className="text-[var(--color-text-primary)] text-[13px] font-bold uppercase tracking-wider">{visitor.name}</p>
                  </div>
                </td>
                <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-5 border-b border-[var(--color-border-soft)] sm:border-none last:border-none text-center">
                  <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3">Date to Visit</span>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <div className="text-[var(--color-text-secondary)] text-[13px] font-bold">
                      {visitor.date ? visitor.date.split(' ')[0] : ''}
                    </div>
                  </div>
                </td>
                <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-5 border-b border-[var(--color-border-soft)] sm:border-none last:border-none">
                  <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3">Objective</span>
                  <p className="text-[var(--color-text-primary)] text-[13px] font-semibold uppercase tracking-wider truncate max-w-[200px]">
                    {visitor.rawRequest?.VVR_Purpose || visitor.purpose || 'N/A'}
                  </p>
                </td>
                <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-5 text-left sm:text-center border-b border-[var(--color-border-soft)] sm:border-none last:border-none">
                  <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Authorization</span>
                  <StatusBadge status={visitor.status} />
                </td>
                <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-5 text-left sm:text-right">
                  <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Actions</span>
                  <button
                    onClick={() => onReview(visitor)}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl border border-[var(--color-border-soft)] text-[var(--color-text-primary)] text-[11px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all group/btn shadow-sm"
                  >
                    <Eye size={11} className="group-hover/btn:scale-110 transition-transform" />
                    Review
                  </button>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan="6" className="px-8 py-20 text-center text-[var(--color-text-dim)] uppercase text-xs tracking-[0.3em] font-medium opacity-80">
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
