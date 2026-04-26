import React from "react";
import { Eye } from "lucide-react";

const StatusBadge = ({ status }) => {
  const styles = {
    "Admin Approved": "text-green-500 bg-green-500/10 border-green-500/20",
    "Accepted by Visitor":
      "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    "Sent to Visitor": "text-blue-500 bg-blue-500/10 border-blue-500/20",
    Rejected: "text-primary bg-primary/10 border-primary/20",
    "Checked In": "text-blue-500 bg-blue-500/10 border-blue-500/20",
    "Checked Out":
      "text-[var(--color-text-secondary)] bg-[var(--color-surface-1)] border-[var(--color-border-soft)]",
    Accepted: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    "Accepted by Contact Person":
      "text-orange-500 bg-orange-500/10 border-orange-500/20",
    "Sent to Admin": "text-orange-500 bg-orange-500/10 border-orange-500/20",
    Pending: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  };

  return (
    <span
      className={`px-2 py-0.5 text-[8px] font-bold tracking-[0.14em] uppercase border rounded-full shadow-sm ${styles[status] || styles["Pending"]}`}
    >
      {status}
    </span>
  );
};

const RequestsTable = ({ requests, onReview }) => {
  return (
    <div className="bg-[var(--color-bg-paper)] border border-[var(--color-border-soft)] rounded-[28px] overflow-hidden shadow-lg relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none opacity-30"></div>

      <div className="hidden sm:block relative z-10">
        <table className="w-full text-left border-separate border-spacing-y-0 sm:border-collapse min-w-0 sm:min-w-[700px] table-fixed">
          <colgroup>
            <col className="w-[72px]" />
            <col className="w-[32%]" />
            <col className="w-[16%]" />
            <col className="w-[30%]" />
            <col className="w-[14%]" />
            <col className="w-[16%]" />
          </colgroup>
          <thead>
            <tr className="bg-[var(--color-surface-1)] border-b border-[var(--color-border-soft)] text-[var(--color-text-dim)] text-[9px] font-bold uppercase tracking-[0.22em]">
              <th className="px-5 py-3 w-20 text-center align-middle">
                Request ID
              </th>
              <th className="px-5 py-3 text-center align-middle">Visitor</th>
              <th className="px-5 py-3 text-center align-middle">Visit Date</th>
              <th className="px-5 py-3 text-center align-middle">Purpose</th>
              <th className="px-5 py-3 text-center align-middle">Status</th>
              <th className="px-5 py-3 text-center align-middle">Actions</th>
            </tr>
          </thead>
        </table>
      </div>

      <div
        className="overflow-auto p-2.5 sm:p-0 z-10 relative"
        style={{ maxHeight: "35rem" }}
      >
        <div className="overflow-x-auto w-full max-w-full pb-4">
          <table className="w-full text-left border-separate border-spacing-y-3 sm:border-spacing-y-0 sm:border-collapse min-w-0 sm:min-w-[700px] block sm:table table-fixed">
            <colgroup>
              <col className="w-[72px]" />
              <col className="w-[32%]" />
              <col className="w-[16%]" />
              <col className="w-[30%]" />
              <col className="w-[14%]" />
              <col className="w-[16%]" />
            </colgroup>
            <tbody className="block sm:table-row-group">
              {requests.map((visitor, index) => (
                <tr
                  key={visitor.id}
                  className="group transition-all hover:bg-[var(--color-surface-1)]/70 block sm:table-row bg-transparent border-b border-[var(--color-border-soft)]/80 sm:border-none p-4 sm:p-0"
                >
                  <td className="block sm:table-cell px-2 sm:px-5 py-3 sm:py-4 text-left sm:text-center border-b border-[var(--color-border-soft)] sm:border-none last:border-none">
                    <span className="text-[9px] font-bold tracking-[0.16em] text-primary/60 uppercase block sm:hidden mb-2">
                      Request ID
                    </span>
                    <div className="text-[11px] font-semibold tracking-[0.12em] text-[var(--color-text-primary)] flex items-center justify-start sm:justify-center transition-all mx-0 sm:mx-auto group-hover:text-primary">
                      #{visitor.id || "N/A"}
                    </div>
                  </td>
                  <td className="block sm:table-cell px-2 sm:px-5 py-3 sm:py-4 text-left sm:text-center border-b border-[var(--color-border-soft)] sm:border-none last:border-none">
                    <span className="text-[9px] font-bold tracking-[0.16em] text-primary/60 uppercase block sm:hidden mb-2">
                      Visitor
                    </span>
                    <div className="sm:flex sm:justify-center">
                      <div className="space-y-1 sm:text-center">
                        <p className="text-[var(--color-text-primary)] text-[11px] font-semibold uppercase tracking-[0.14em] sm:text-center">
                          {visitor.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="block sm:table-cell px-2 sm:px-5 py-3 sm:py-4 border-b border-[var(--color-border-soft)] sm:border-none last:border-none text-center">
                    <span className="text-[9px] font-bold tracking-[0.16em] text-primary/60 uppercase block sm:hidden mb-2">
                      Visit Date
                    </span>
                    <div className="flex flex-col items-center justify-center gap-1 sm:mx-auto">
                      <div className="text-[var(--color-text-secondary)] text-[11px] font-semibold">
                        {visitor.date ? visitor.date.split(" ")[0] : ""}
                      </div>
                    </div>
                  </td>
                  <td className="block sm:table-cell px-2 sm:px-5 py-3 sm:py-4 text-left sm:text-center border-b border-[var(--color-border-soft)] sm:border-none last:border-none">
                    <span className="text-[9px] font-bold tracking-[0.16em] text-primary/60 uppercase block sm:hidden mb-2">
                      Purpose
                    </span>
                    <p className="text-[var(--color-text-primary)] text-[11px] font-semibold uppercase tracking-[0.12em] truncate max-w-[220px] sm:mx-auto sm:text-center">
                      {visitor.rawRequest?.VVR_Purpose ||
                        visitor.purpose ||
                        "N/A"}
                    </p>
                  </td>
                  <td className="block sm:table-cell px-2 sm:px-5 py-3 sm:py-4 text-left sm:text-center border-b border-[var(--color-border-soft)] sm:border-none last:border-none">
                    <span className="text-[9px] font-bold tracking-[0.16em] text-primary/60 uppercase block sm:hidden mb-2 text-left">
                      Status
                    </span>
                    <div className="sm:flex sm:justify-center">
                      <StatusBadge status={visitor.status} />
                    </div>
                  </td>
                  <td className="block sm:table-cell px-2 sm:px-5 py-3 sm:py-4 text-left sm:text-center">
                    <span className="text-[9px] font-bold tracking-[0.16em] text-primary/60 uppercase block sm:hidden mb-2 text-left">
                      Actions
                    </span>
                    <div className="sm:flex sm:justify-center">
                      <button
                        onClick={() => onReview(visitor.id)}
                        className="inline-flex flex-col md:flex-row items-center gap-2 px-3 py-1 rounded-lg border border-[var(--color-border-soft)] text-[var(--color-text-primary)] text-[9px] font-bold uppercase tracking-[0.14em] hover:bg-primary hover:text-white hover:border-primary transition-all group/btn shadow-sm sm:mx-auto"
                      >
                        <Eye
                          size={9}
                          className="group-hover/btn:scale-110 transition-transform"
                        />
                        Review
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-14 text-center text-[var(--color-text-dim)] uppercase text-[9px] tracking-[0.24em] font-medium opacity-80"
                  >
                    No requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RequestsTable;
