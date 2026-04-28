import React, { useState, useEffect } from "react";
import {
  Trash2,
  Shield,
  User,
  Clock,
  ChevronRight,
  Eye,
  UserPlus,
  Search,
  Power,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  GetAllBlacklist,
  AddBlacklist,
  UpdateBlacklistStatus,
  UpdateBlacklist,
} from "../../../actions/BlacklistAction";
import BlacklistDetailModal from "./BlacklistDetailModal";
import AddBlacklistModal from "./AddBlacklistModal";
import EditBlacklistModal from "./EditBlacklistModal";
import { useThemeMode } from "../../../theme/ThemeModeContext";

/* ─────────────────────────────────────────────
   Risk Level badge
───────────────────────────────────────────── */
const RestrictionLevel = ({ level }) => {
  const styles = {
    "Level 01": "border border-blue-500/30 text-blue-400 bg-blue-500/8",
    "Level 02": "border border-primary/30 text-primary/90 bg-primary/8",
    "Level 03":
      "border border-red-500/40 text-red-400 bg-red-500/10 shadow-[0_0_12px_rgba(255,100,100,0.1)]",
  };

  return (
    <div
      className={`px-4 py-1.5 rounded-full text-[12px] font-medium tracking-[0.2em] capitalize border flex items-center gap-2 w-fit mx-auto ${
        styles[level] || styles["Level 01"]
      }`}
    >
      <div
        className={`w-1 h-1 rounded-full ${
          level === "Level 03"
            ? "bg-primary shadow-[0_0_5px_var(--color-primary)] animate-pulse"
            : "bg-current opacity-90"
        }`}
      />
      {level}
    </div>
  );
};

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

  const { blacklists, isLoading } = useSelector(
    (state) => state.blacklistState || { blacklists: [] },
  );

  useEffect(() => {
    dispatch(GetAllBlacklist());
  }, [dispatch]);

  const safeBlacklists = Array.isArray(blacklists) ? blacklists : [];

  const filtered = safeBlacklists
    .filter(
      (item) =>
        (item.VB_Name &&
          item.VB_Name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.VB_Email &&
          item.VB_Email.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    .sort((a, b) => {
      const dateA = new Date(a.VB_Created_Date || 0);
      const dateB = new Date(b.VB_Created_Date || 0);
      return dateB - dateA; // newest first
    });

  const handleViewDetails = (item) => {
    setSelectedPerson(item);
    setIsDetailModalOpen(true);
  };

  const handleAddPerson = (newPerson) => {
    dispatch(AddBlacklist(newPerson));
  };

  const handleEditClick = (item) => {
    setSelectedEditPerson(item);
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

  return (
    <>
      {/* ── Blacklist detail modal ── */}
      <BlacklistDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        person={selectedPerson}
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
        className={`space-y-4 animate-fade-in-slow ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
      >
        {/* ── Toolbar ── */}
        <div
          className={`flex flex-col md:flex-row justify-between items-center gap-3 p-4 md:p-5 rounded-[28px] border shadow-xl ${isLight ? "bg-white border-gray-200 shadow-gray-200/50" : "bg-[var(--color-bg-paper)] border-white/5 shadow-black/20"}`}
        >
          <div className="relative w-full md:w-96">
            <Search
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isLight ? "text-gray-400" : "text-gray-400"}`}
              size={16}
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full rounded-2xl pl-11 pr-4 py-2.5 text-[13px] focus:outline-none focus:border-primary/50 transition-all placeholder:text-gray-500 shadow-inner border ${isLight ? "bg-white border-gray-200 text-[#1A1A1A] shadow-gray-100" : "bg-white/[0.03] border-white/10 text-white shadow-black/20"}`}
            />
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full md:w-auto px-6 py-3 bg-primary text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-2.5 hover:scale-[1.02] transition-all shadow-lg shadow-primary/20 active:scale-[0.98] group"
          >
            <UserPlus
              size={16}
              className="group-hover:rotate-12 transition-transform"
            />
            Add to Blacklist
          </button>
        </div>

        {/* ── Table card ── */}
        <div
          className={`rounded-[32px] overflow-hidden flex flex-col shadow-3xl relative border ${isLight ? "bg-white border-gray-200" : "bg-[var(--color-bg-paper)] border-white/5"}`}
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          <div
            className={`flex-1 overflow-x-auto sm:overflow-visible p-3 sm:p-0 ${isLight ? "bg-[#F8F9FA]" : "bg-[var(--color-bg-default)]"}`}
          >
            <table className="w-full text-left border-separate border-spacing-y-2.5 sm:border-spacing-y-0 sm:border-collapse min-w-0 sm:min-w-[680px] block sm:table">
              <thead className="hidden sm:table-header-group">
                <tr
                  className={
                    isLight
                      ? "bg-white border-b border-gray-200"
                      : "bg-[var(--color-bg-paper)] border-b border-white/5"
                  }
                >
                  <th
                    className={`px-4 md:px-5 py-4 text-[13px] font-bold tracking-[0.2em] uppercase whitespace-nowrap ${isLight ? "text-gray-500" : "text-gray-400"}`}
                  >
                    Visitor
                  </th>
                  <th
                    className={`px-4 md:px-5 py-4 text-[13px] font-bold tracking-[0.2em] uppercase whitespace-nowrap ${isLight ? "text-gray-500" : "text-gray-400"}`}
                  >
                    Blacklist Reason
                  </th>
                  <th
                    className={`px-4 md:px-5 py-4 text-[13px] font-bold tracking-[0.2em] uppercase text-center whitespace-nowrap ${isLight ? "text-gray-500" : "text-gray-400"}`}
                  >
                    Date Added
                  </th>
                  <th
                    className={`px-4 md:px-5 py-4 text-[13px] font-bold tracking-[0.2em] uppercase text-center whitespace-nowrap ${isLight ? "text-gray-500" : "text-gray-400"}`}
                  >
                    Risk Level
                  </th>
                  <th className="px-4 md:px-5 py-4 text-[10px] font-bold tracking-[0.2em] uppercase text-primary text-right whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="block sm:table-row-group">
                <AnimatePresence>
                  {isLoading ? (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="block sm:table-row"
                    >
                      <td
                        colSpan="5"
                        className="px-6 py-14 text-center block sm:table-cell"
                      >
                        <div className="flex justify-center items-center h-full">
                          <div className="w-7 h-7 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        </div>
                      </td>
                    </motion.tr>
                  ) : filtered.length > 0 ? (
                    filtered.map((item, idx) => (
                      <motion.tr
                        key={item.VB_id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`group hover:bg-primary/[0.02] transition-all duration-500 block sm:table-row sm:border-none rounded-[20px] sm:rounded-none mb-2.5 sm:mb-0 p-3 sm:p-0 border ${isLight ? "bg-white border-gray-200 shadow-sm sm:bg-transparent" : "bg-[#161618] sm:bg-transparent border-white/5"}`}
                      >
                        {/* Visitor */}
                        <td
                          className={`block sm:table-cell px-3.5 sm:px-5 py-3 sm:py-4 border-b sm:border-none text-[13px] ${isLight ? "border-gray-200" : "border-white/5"}`}
                        >
                          <span className="text-[11px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-2.5">
                            Visitor
                          </span>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                            <div>
                              <p
                                className={`capitalize text-[12px] font-medium tracking-widest mb-1 group-hover:text-primary transition-colors break-words ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
                              >
                                {item.VB_Name}
                              </p>
                              <p
                                className={`text-[12px] font-medium tracking-[0.2em] lowercase ${isLight ? "text-gray-500" : "text-gray-300/80"}`}
                              >
                                {item.VB_Email || "no-email"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Reason */}
                        <td
                          className={`block sm:table-cell px-3.5 sm:px-5 py-3 sm:py-4 border-b sm:border-none text-[13px] ${isLight ? "border-gray-200" : "border-white/5"}`}
                        >
                          <span className="text-[11px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-2.5">
                            Blacklist Reason
                          </span>
                          <div className="flex flex-col gap-2">
                            <p
                              className={`capitalize text-[12px] font-medium tracking-widest leading-relaxed max-w-full sm:max-w-md break-words ${isLight ? "text-gray-700" : "text-white/80"}`}
                            >
                              {item.VB_Description || "—"}
                            </p>
                          </div>
                        </td>

                        {/* Date Added */}
                        <td
                          className={`block sm:table-cell px-3.5 sm:px-5 py-3 sm:py-4 border-b sm:border-none text-center text-[13px] ${isLight ? "border-gray-200" : "border-white/5"}`}
                        >
                          <span className="text-[11px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-2.5 text-left">
                            Date Added
                          </span>
                          <div className="flex flex-col items-center gap-2">
                            <p
                              className={`capitalize text-[12px] font-medium tracking-[0.2em] flex items-center gap-2 ${isLight ? "text-gray-600" : "text-gray-300/90"}`}
                            >
                              <Clock size={12} className="text-primary/40" />{" "}
                              {item.VB_Created_Date
                                ? item.VB_Created_Date.split(" ")[0]
                                : "—"}
                            </p>
                            <span
                              className={`text-[9px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full ${item.VB_Status === "I" ? "bg-gray-500/20 border border-gray-500/30 text-gray-400" : "bg-green-500/10 border border-green-500/20 text-green-400"}`}
                            >
                              {item.VB_Status === "I" ? "Inactive" : "Active"}
                            </span>
                          </div>
                        </td>

                        {/* Risk Level */}
                        <td
                          className={`block sm:table-cell px-3.5 sm:px-5 py-3 sm:py-4 border-b sm:border-none text-[13px] ${isLight ? "border-gray-200" : "border-white/5"}`}
                        >
                          <span className="text-[11px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-2.5">
                            Risk Level
                          </span>
                          <RestrictionLevel
                            level={item.VB_Alert_Type || "Level 01"}
                          />
                        </td>

                        {/* Actions */}
                        <td className="block sm:table-cell px-3.5 sm:px-5 py-3 sm:py-4 text-right">
                          <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-2.5 text-left">
                            Action
                          </span>
                          <div className="flex justify-start sm:justify-end gap-2.5">
                            {/* ── View Details button ── */}
                            <button
                              onClick={() => handleViewDetails(item)}
                              title="View Details"
                              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500 shadow-xl group/btn border ${isLight ? "bg-primary/5 border-primary/15 text-primary hover:text-white hover:bg-primary hover:border-primary" : "bg-blue-500/5 border-blue-500/20 text-blue-400 hover:text-white hover:bg-blue-500 hover:border-blue-500"}`}
                            >
                              <Eye
                                size={15}
                                className="group-hover/btn:scale-110 transition-transform"
                              />
                            </button>

                            {/* Edit button */}
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

                            {/* Toggle Status */}
                            <button
                              onClick={() => handleToggleStatus(item)}
                              title={
                                item.VB_Status === "I"
                                  ? "Activate Blacklist"
                                  : "Deactivate Blacklist"
                              }
                              className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-500 shadow-xl group/btn ${
                                item.VB_Status === "I"
                                  ? "bg-green-500/5 border-green-500/20 text-green-400 hover:text-white hover:bg-green-500 hover:border-green-500"
                                  : "bg-red-500/5 border-red-500/20 text-red-400 hover:text-white hover:bg-red-500 hover:border-red-500"
                              }`}
                            >
                              {item.VB_Status === "I" ? (
                                <CheckCircle
                                  size={15}
                                  className="group-hover/btn:scale-110 transition-transform"
                                />
                              ) : (
                                <Power
                                  size={15}
                                  className="group-hover/btn:scale-110 transition-transform"
                                />
                              )}
                            </button>
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
                        colSpan="5"
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
