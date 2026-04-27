import React from "react";
import { Eye } from "lucide-react";
import { useThemeMode } from "../../../theme/ThemeModeContext";

const StatusBadge = ({ status }) => {
  const s = (status || "").toString().trim().toUpperCase();

  switch (s) {
    case "ADMIN APPROVED":
      return (
        <div className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-500 rounded-md text-[10px] font-bold tracking-[0.1em] uppercase flex items-center justify-center w-max mx-auto shadow-sm">
          Admin Approved
        </div>
      );
    case "REJECTED":
      return (
        <div className="px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary rounded-md text-[10px] font-bold tracking-[0.1em] uppercase flex items-center justify-center w-max mx-auto shadow-sm">
          Rejected
        </div>
      );
    case "ACCEPTED BY VISITOR":
      return (
        <div className="px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-md text-[10px] font-bold tracking-[0.1em] uppercase flex items-center justify-center w-max mx-auto shadow-sm">
          Accepted by Visitor
        </div>
      );
    case "ACCEPTED BY CONTACT PERSON":
    case "SENT TO ADMIN":
      return (
        <div className="px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-md text-[10px] font-bold tracking-[0.1em] uppercase flex items-center justify-center w-max mx-auto shadow-sm">
          Sent to Admin
        </div>
      );
    case "CHECKED IN":
      return (
        <div className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-md text-[10px] font-bold tracking-[0.1em] uppercase flex items-center justify-center w-max mx-auto shadow-sm">
          Checked In
        </div>
      );
    case "CHECKED OUT":
      return (
        <div className="px-2 py-0.5 bg-gray-500/10 border border-gray-500/20 text-gray-400 rounded-md text-[10px] font-bold tracking-[0.1em] uppercase flex items-center justify-center w-max mx-auto shadow-sm">
          Checked Out
        </div>
      );
    case "SENT TO VISITOR":
    default:
      return (
        <div className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-md text-[10px] font-bold tracking-[0.1em] uppercase flex items-center justify-center w-max mx-auto shadow-sm">
          Sent to Visitor
        </div>
      );
  }
};

const RequestsTable = ({ requests, onReview }) => {
  const { themeMode } = useThemeMode();
  const isLight = themeMode === "light";

  return (
    <div
      className={`border rounded-[32px] overflow-hidden relative z-10 ${
        isLight
          ? "bg-white border-gray-200 shadow-xl shadow-gray-200/50"
          : "bg-[#0F0F10] border-white/5"
      }`}
    >
      <div
        className="custom-scrollbar relative z-10 overflow-auto"
        style={{ height: "38rem" }}
      >
        <table className="w-full min-w-[900px] border-collapse">
          <thead className="sticky top-0 z-20">
            <tr
              className={`border-b ${
                isLight
                  ? "bg-[#F8F9FA] border-gray-100"
                  : "bg-black/95 border-b-white/5"
              }`}
            >
              <th
                className={`px-4 py-3 text-center font-bold uppercase tracking-[0.18em] text-[11px] ${
                  isLight ? "text-primary/60" : "text-primary"
                }`}
              >
                Request ID
              </th>
              <th
                className={`px-4 py-3 text-center font-bold uppercase tracking-[0.18em] text-[11px] ${
                  isLight ? "text-gray-400" : "text-white/40"
                }`}
              >
                Visitor
              </th>
              <th
                className={`px-4 py-3 text-center font-bold uppercase tracking-[0.18em] text-[11px] ${
                  isLight ? "text-gray-400" : "text-white/40"
                }`}
              >
                Visit Date
              </th>
              <th
                className={`px-4 py-3 text-center font-bold uppercase tracking-[0.18em] text-[11px] ${
                  isLight ? "text-gray-400" : "text-white/40"
                }`}
              >
                Purpose
              </th>
              <th
                className={`px-4 py-3 text-center font-bold uppercase tracking-[0.18em] text-[11px] ${
                  isLight ? "text-gray-400" : "text-white/40"
                }`}
              >
                Status
              </th>
              <th
                className={`px-4 py-3 text-center font-bold uppercase tracking-[0.18em] text-[11px] ${
                  isLight ? "text-gray-400" : "text-white/40"
                }`}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {requests && requests.length > 0 ? (
              requests.map((visitor) => (
                <tr
                  key={visitor.id}
                  className={`group border-b transition-all duration-300 relative overflow-hidden ${
                    isLight
                      ? "hover:bg-[#F8F9FA] border-gray-50"
                      : "hover:bg-white/[0.02] border-white/5"
                  }`}
                >
                  {/* Request ID */}
                  <td className="px-4 py-4 text-center text-primary text-[11px] tracking-[0.14em] font-medium">
                    #{visitor.id || "N/A"}
                  </td>

                  {/* Visitor Name */}
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`font-medium text-[12px] uppercase tracking-[0.14em] ${
                        isLight ? "text-[#1A1A1A]" : "text-white"
                      }`}
                    >
                      {visitor.name || "-"}
                    </span>
                  </td>

                  {/* Visit Date */}
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`text-[12px] font-medium tracking-wide ${
                        isLight ? "text-gray-500" : "text-white/70"
                      }`}
                    >
                      {visitor.date ? visitor.date.split(" ")[0] : "N/A"}
                    </span>
                  </td>

                  {/* Purpose */}
                  <td className="px-4 py-4 text-center">
                    <div className="max-w-[200px] mx-auto">
                      <p
                        title={
                          visitor.rawRequest?.VVR_Purpose ||
                          visitor.purpose ||
                          "No purpose specified"
                        }
                        className={`font-medium uppercase tracking-[0.14em] text-[12px] truncate ${
                          isLight ? "text-[#1A1A1A]" : "text-white/90"
                        }`}
                      >
                        {visitor.rawRequest?.VVR_Purpose ||
                          visitor.purpose ||
                          "-"}
                      </p>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <StatusBadge status={visitor.status} />
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => onReview(visitor.id)}
                        title="Review Request"
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500 shadow-xl group/btn border ${
                          isLight
                            ? "bg-primary/5 border-primary/15 text-primary hover:text-white hover:bg-primary hover:border-primary"
                            : "bg-blue-500/5 border-blue-500/20 text-blue-400 hover:text-white hover:bg-blue-500 hover:border-blue-500"
                        }`}
                      >
                        <Eye
                          size={15}
                          className="group-hover/btn:scale-110 transition-transform"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className={`px-4 py-12 text-center uppercase tracking-[0.24em] text-[11px] font-medium ${
                    isLight ? "text-gray-400" : "text-white/40"
                  }`}
                >
                  No requests found matching criteria
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
