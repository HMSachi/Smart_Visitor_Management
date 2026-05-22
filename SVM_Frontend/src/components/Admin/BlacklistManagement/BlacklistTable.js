import React, { useState, useEffect } from "react";
import {
  Shield,
  User,
  Clock,
  Eye,
  UserPlus,
  Search,
  Power,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  GetAllBlacklist,
  AddBlacklist,
  UpdateBlacklistStatus,
  UpdateBlacklist,
  AddBlacklistReport,
  ApproveBlacklist,
  RejectBlacklist,
} from "../../../actions/BlacklistAction";
import BlacklistDetailModal from "./BlacklistDetailModal";
import AddBlacklistModal from "./AddBlacklistModal";
import EditBlacklistModal from "./EditBlacklistModal";
import { useThemeMode } from "../../../theme/ThemeModeContext";
import VisitorService from "../../../services/VisitorService";
import VisitGroupService from "../../../services/VisitGroupService";

/* ─────────────────────────────────────────────
   Main table component
 ───────────────────────────────────────────── */
const BlacklistTable = () => {
  const dispatch = useDispatch();
  const { themeMode } = useThemeMode();
  const isLight = themeMode === "light";
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEditPerson, setSelectedEditPerson] = useState(null);
  const [visitorMap, setVisitorMap] = useState({});
  const [companionMap, setCompanionMap] = useState({});

  const { blacklists, isLoading } = useSelector(
    (state) => state.blacklistState || { blacklists: [] },
  );

  useEffect(() => {
    dispatch(GetAllBlacklist());

    // Load dynamic lookup maps
    const loadMaps = async () => {
      try {
        const [visitorsRes, groupsRes] = await Promise.all([
          VisitorService.GetAllVisitors(),
          VisitGroupService.GetAllVisitGroup(),
        ]);

        const visitors = visitorsRes.data?.ResultSet || visitorsRes.data || [];
        const groups = groupsRes.data?.ResultSet || groupsRes.data || [];

        const vMap = {};
        visitors.forEach((v) => {
          if (v.VV_Visitor_id) {
            vMap[String(v.VV_Visitor_id)] = {
              name: v.VV_Name,
              email: v.VV_Email,
            };
          }
        });

        const cMap = {};
        groups.forEach((g) => {
          if (g.VVG_id) {
            cMap[String(g.VVG_id)] = {
              name: g.VVG_Visitor_Name,
              email: g.VVG_NIC_Passport_Number || "N/A",
            };
          }
        });

        setVisitorMap(vMap);
        setCompanionMap(cMap);
      } catch (e) {
        console.error("Error loading lookup maps:", e);
      }
    };

    loadMaps();
  }, [dispatch]);

  const safeBlacklists = Array.isArray(blacklists) ? blacklists : [];

  const filtered = safeBlacklists
    .filter((item) => {
      const resolvedName =
        item.VB_Name ||
        (item.VVG_id && companionMap[String(item.VVG_id)]?.name) ||
        (item.VB_Visitor_id && visitorMap[String(item.VB_Visitor_id)]?.name) ||
        "";

      const resolvedEmail =
        item.VB_Email ||
        (item.VVG_id && companionMap[String(item.VVG_id)]?.email) ||
        (item.VB_Visitor_id && visitorMap[String(item.VB_Visitor_id)]?.email) ||
        "";

      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      const nameMatch =
        resolvedName && resolvedName.toLowerCase().includes(searchLower);
      const emailMatch =
        resolvedEmail && resolvedEmail.toLowerCase().includes(searchLower);
      const visitorIdMatch =
        item.VB_Visitor_id && String(item.VB_Visitor_id).includes(searchLower);
      return nameMatch || emailMatch || visitorIdMatch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.VB_Created_Date || 0);
      const dateB = new Date(b.VB_Created_Date || 0);
      return dateB - dateA; // newest first
    });

  const handleViewDetails = (item) => {
    // Inject dynamic names into details modal so details modal is perfectly synced
    const resolvedName =
      item.VB_Name ||
      (item.VVG_id && companionMap[String(item.VVG_id)]?.name) ||
      (item.VB_Visitor_id && visitorMap[String(item.VB_Visitor_id)]?.name) ||
      `Visitor ID: ${item.VB_Visitor_id}`;

    const resolvedEmail =
      item.VB_Email ||
      (item.VVG_id && companionMap[String(item.VVG_id)]?.email) ||
      (item.VB_Visitor_id && visitorMap[String(item.VB_Visitor_id)]?.email) ||
      "system-restricted";

    setSelectedPerson({
      ...item,
      VB_Name: resolvedName,
      VB_Email: resolvedEmail,
    });
    setIsDetailModalOpen(true);
  };

  const isSecurityPortal =
    window.location.pathname.includes("Security") ||
    window.location.pathname.includes("security");
  const isContactPerson =
    window.location.pathname.includes("Contact_Person") ||
    window.location.pathname.includes("contact_person") ||
    window.location.pathname.includes("Contact-Person");

  const handleAddPerson = (newPerson) => {
    if (isSecurityPortal) {
      let reporterName = "Security Officer";
      let reporterEmail = "security@example.com";
      let pUid = "Security";
      try {
        const session = JSON.parse(
          localStorage.getItem("user_session") || "{}",
        );
        if (session.ResultSet) {
          reporterName = session.ResultSet.P_Name || reporterName;
          reporterEmail = session.ResultSet.P_Email || reporterEmail;
          pUid = session.ResultSet.P_UID || pUid;
        }
      } catch (e) {}

      const reportData = {
        VB_Visitor_id: newPerson.VB_Visitor_id,
        VVG_id: newPerson.VVG_id || "",
        VB_Reporter_Name: reporterName,
        VB_Reporter_Role: "Security",
        VB_Reporter_Email: reporterEmail,
        VB_Description: newPerson.VB_Description,
        VB_Alert_Type: newPerson.VB_Alert_Type || "Security",
        VB_Reported_By: reporterName,
        P_UID: pUid,
      };
      dispatch(AddBlacklistReport(reportData));
    } else {
      dispatch(AddBlacklist(newPerson));
    }
  };

  const handleEditClick = (item) => {
    const resolvedName =
      item.VB_Name ||
      (item.VVG_id && companionMap[String(item.VVG_id)]?.name) ||
      (item.VB_Visitor_id && visitorMap[String(item.VB_Visitor_id)]?.name) ||
      "";

    const resolvedEmail =
      item.VB_Email ||
      (item.VVG_id && companionMap[String(item.VVG_id)]?.email) ||
      (item.VB_Visitor_id && visitorMap[String(item.VB_Visitor_id)]?.email) ||
      "";

    setSelectedEditPerson({
      ...item,
      VB_Name: resolvedName,
      VB_Email: resolvedEmail,
    });
    setIsEditModalOpen(true);
  };

  const handleEditPerson = (updatedData) => {
    dispatch(UpdateBlacklist(updatedData));
  };

  const handleToggleStatus = (item) => {
    const newStatus = item.VB_Status === "I" ? "A" : "I";
    const actionText = newStatus === "I" ? "deactivate" : "activate";
    if (
      window.confirm(
        `Are you sure you want to ${actionText} this blacklist entry?`,
      )
    ) {
      dispatch(UpdateBlacklistStatus(item.VB_id, newStatus));
    }
  };

  const handleApprove = (item) => {
    if (
      window.confirm("Are you sure you want to approve this blacklist report?")
    ) {
      let adminId = "1";
      let pUid = "Admin";
      try {
        const session = JSON.parse(
          localStorage.getItem("user_session") || "{}",
        );
        if (session.ResultSet) {
          adminId =
            session.ResultSet.Admin_id || session.ResultSet.P_ID || adminId;
          pUid = session.ResultSet.P_UID || pUid;
        }
      } catch (e) {}
      dispatch(ApproveBlacklist(item.VB_id, adminId, pUid));
    }
  };

  const handleReject = (item) => {
    const reason = window.prompt(
      "Please enter a reason for rejecting this blacklist report:",
    );
    if (reason !== null) {
      if (!reason.trim()) {
        alert("Reject reason is required.");
        return;
      }
      let adminId = "1";
      let pUid = "Admin";
      try {
        const session = JSON.parse(
          localStorage.getItem("user_session") || "{}",
        );
        if (session.ResultSet) {
          adminId =
            session.ResultSet.Admin_id || session.ResultSet.P_ID || adminId;
          pUid = session.ResultSet.P_UID || pUid;
        }
      } catch (e) {}
      dispatch(RejectBlacklist(item.VB_id, adminId, reason, pUid));
    }
  };

  return (
    <>
      {/* ── Blacklist detail modal ── */}
      <BlacklistDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        person={selectedPerson}
        onApprove={handleApprove}
        onReject={handleReject}
        isSecurityPortal={isSecurityPortal}
      />

      {/* ── Add new blacklist modal ── */}
      <AddBlacklistModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddPerson}
      />

      {/* ── Edit blacklist modal ── */}
      <EditBlacklistModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEdit={handleEditPerson}
        initialData={selectedEditPerson}
      />

      {/* ── Table Container ── */}
      <div
        className={`space-y-6 animate-fade-in-slow ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
      >
        {/* ── Toolbar ── */}
        <header className="flex flex-col sm:flex-row justify-end items-center gap-4 relative z-10 px-1 w-full">
          <div className="flex flex-col sm:flex-row gap-3 items-center shrink-0 w-full sm:w-auto ml-auto">
            {/* Search Box - Rounded Style */}
            <div className="relative w-full sm:w-80 group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search
                  size={14}
                  className="text-[var(--color-text-dim)] group-focus-within:text-primary transition-colors"
                />
              </div>
              <input
                type="text"
                placeholder="Filter restricted visitors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[var(--color-bg-paper)] border border-[var(--color-border-soft)] text-[var(--color-text-primary)] text-[13px] rounded-full py-2 pl-9 pr-4 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-gray-400/60 shadow-inner"
              />
            </div>

            {!isContactPerson && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 h-10 rounded-full text-[12px] font-bold uppercase tracking-[0.1em] transition-all shadow-[0_8px_20px_-4px_rgba(255,107,0,0.4)] active:scale-95 group shrink-0"
              >
                <UserPlus size={16} />
                Add Restricted User
              </button>
            )}
          </div>
        </header>

        {/* ── Table card ── */}
        <div className="bg-[var(--color-bg-paper)] border border-white/5 rounded-[5px] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-inherit">
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-[12px] font-normal tracking-[0.3em] uppercase text-[var(--color-text-secondary)] border-b border-white/5 whitespace-nowrap">
                    Visitor Name
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-[12px] font-normal tracking-[0.3em] uppercase text-[var(--color-text-secondary)] border-b border-white/5 whitespace-nowrap">
                    Visitor Email
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-[12px] font-normal tracking-[0.3em] uppercase text-[var(--color-text-secondary)] border-b border-white/5 whitespace-nowrap">
                    Reason for Restriction
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-[12px] font-normal tracking-[0.3em] uppercase text-[var(--color-text-secondary)] border-b border-white/5 text-center whitespace-nowrap">
                    Added Date
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-[12px] font-normal tracking-[0.3em] uppercase text-[var(--color-text-secondary)] border-b border-white/5 text-center whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-[12px] font-normal tracking-[0.3em] uppercase text-primary border-b border-white/5 text-right whitespace-nowrap">
                    Management
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.04]">
                <AnimatePresence>
                  {isLoading ? (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td colSpan="6" className="py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                          <span className="text-[11px] text-[var(--color-text-dim)] uppercase tracking-widest font-medium">
                            Fetching restricted list...
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ) : filtered.length > 0 ? (
                    filtered.map((item, idx) => (
                      <motion.tr
                        key={item.VB_id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="group hover:bg-white/[0.02] transition-colors"
                      >
                        {/* Visitor Name */}
                        <td className="px-3 sm:px-6 py-3 sm:py-4 align-middle">
                          <span className="text-[13px] font-medium text-white tracking-wide group-hover:text-primary transition-colors block">
                            {item.VB_Name ||
                              (item.VVG_id &&
                                companionMap[String(item.VVG_id)]?.name) ||
                              (item.VB_Visitor_id &&
                                visitorMap[String(item.VB_Visitor_id)]?.name) ||
                              `Visitor ID: ${item.VB_Visitor_id}`}
                          </span>
                        </td>

                        {/* Visitor Email */}
                        <td className="px-3 sm:px-6 py-3 sm:py-4 align-middle">
                          <span className="text-[13px] font-medium text-white tracking-wide block">
                            {item.VB_Email ||
                              (item.VVG_id &&
                                companionMap[String(item.VVG_id)]?.email) ||
                              (item.VB_Visitor_id &&
                                visitorMap[String(item.VB_Visitor_id)]
                                  ?.email) ||
                              "—"}
                          </span>
                        </td>

                        {/* Reason */}
                        <td className="px-3 sm:px-6 py-3 sm:py-4 align-middle">
                          <div className="max-w-xs xl:max-w-md">
                            <p className="text-[12px] text-white/70 leading-relaxed line-clamp-2">
                              {item.VB_Description || "—"}
                            </p>
                          </div>
                        </td>

                        {/* Date Added */}
                        <td className="px-3 sm:px-6 py-3 sm:py-4 align-middle">
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-1.5 text-[12px] text-white/60">
                              <Clock size={12} className="text-primary/40" />
                              <span className="tracking-wider">
                                {item.VB_Created_Date
                                  ? item.VB_Created_Date.split(" ")[0]
                                  : "—"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-3 sm:px-6 py-3 sm:py-4 align-middle text-center">
                          {item.VB_Approval_Status ? (
                            <span
                              className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                                item.VB_Approval_Status === "Pending"
                                  ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                                  : item.VB_Approval_Status === "Approved"
                                    ? "bg-green-500/10 border-green-500/20 text-green-400"
                                    : "bg-red-500/10 border-red-500/20 text-red-400"
                              } min-w-[110px]`}
                            >
                              {item.VB_Approval_Status.charAt(0).toUpperCase() +
                                item.VB_Approval_Status.slice(1).toLowerCase()}
                            </span>
                          ) : (
                            <span className="text-gray-400/55 font-mono text-[11px]">
                              —
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-3 sm:px-6 py-3 sm:py-4 align-middle">
                          <div className="flex justify-end items-center gap-2">
                            <button
                              onClick={() => handleViewDetails(item)}
                              className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all group/btn"
                            >
                              <Eye
                                size={16}
                                className="group-hover/btn:scale-110 transition-transform"
                              />
                            </button>

                            {!isContactPerson &&
                              !isSecurityPortal &&
                              item.VB_Approval_Status === "Pending" && (
                                <>
                                  <button
                                    onClick={() => handleApprove(item)}
                                    title="Approve Report"
                                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500 shadow-xl group/btn border bg-green-500/5 border-green-500/20 text-green-400 hover:text-white hover:bg-green-500 hover:border-green-500"
                                  >
                                    <CheckCircle
                                      size={15}
                                      className="group-hover/btn:scale-110 transition-transform"
                                    />
                                  </button>
                                  <button
                                    onClick={() => handleReject(item)}
                                    title="Reject Report"
                                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500 shadow-xl group/btn border bg-red-500/5 border-red-500/20 text-red-400 hover:text-white hover:bg-red-500 hover:border-red-500"
                                  >
                                    <XCircle
                                      size={15}
                                      className="group-hover/btn:scale-110 transition-transform"
                                    />
                                  </button>
                                </>
                              )}

                            {/* Edit button */}
                            {!isContactPerson && (
                              <button
                                onClick={() => handleEditClick(item)}
                                title="Edit Blacklist"
                                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500 shadow-xl group/btn border ${isLight ? "bg-amber-500/5 border-amber-500/20 text-amber-500 hover:text-white hover:bg-amber-500 hover:border-amber-500" : "bg-yellow-500/5 border-yellow-500/20 text-yellow-500 hover:text-white hover:bg-yellow-500 hover:border-yellow-500"}`}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="15"
                                  height="15"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-edit-3 group-hover/btn:scale-110 transition-transform"
                                >
                                  <path d="M12 20h9" />
                                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="block sm:table-row"
                    >
                      <td
                        colSpan="6"
                        className="px-6 py-14 text-center block sm:table-cell"
                      >
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-primary/5 rounded-[24px] flex items-center justify-center border border-primary/10 shadow-inner">
                            <Shield size={26} className="text-primary/40" />
                          </div>
                          <div>
                            <h3
                              className={`text-base font-bold capitalize tracking-[0.2em] mb-2 ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
                            >
                              No Blacklisted Visitors
                            </h3>
                            <p
                              className={`text-[12px] capitalize tracking-widest ${isLight ? "text-gray-500" : "text-gray-300/60"}`}
                            >
                              There are currently no visitors on the blacklist.
                            </p>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlacklistTable;
