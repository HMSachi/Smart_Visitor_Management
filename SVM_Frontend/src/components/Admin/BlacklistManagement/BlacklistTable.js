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
      className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-widest capitalize border flex items-center gap-1.5 w-fit mx-auto ${
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
          className={`flex flex-col md:flex-row justify-between items-center gap-2 p-2 rounded-xl border shadow-sm ${isLight ? "bg-white border-gray-100" : "bg-[var(--color-bg-paper)] border-white/5"}`}
        >
          <div className="flex flex-col sm:flex-row gap-2 items-center shrink-0 w-full md:w-auto">
            <div
              className={`flex items-center border transition-all rounded-[5px] px-2 h-7 min-w-[220px] w-full sm:w-[280px] md:w-[320px] group shadow-sm ${isLight ? "bg-white border-gray-200 hover:border-primary/20 focus-within:border-primary/40" : "bg-black/40 border-white/10 focus-within:border-primary hover:border-white/20"}`}
            >
              <Search size={10} className={`transition-colors mr-1.5 ${isLight ? "text-gray-400 group-focus-within:text-primary" : "text-white/20 group-focus-within:text-primary"}`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search restricted visitors..."
                className={`bg-transparent text-[2px] focus:outline-none w-full tracking-wide ${isLight ? "text-[#1A1A1A] placeholder:text-gray-400" : "text-white placeholder:text-white/20"}`}
              />
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center justify-center gap-1 bg-primary hover:bg-primary-hover text-white px-3 h-7 rounded-[5px] text-[2px] font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95 group shrink-0 w-full sm:w-auto"
            >
              <UserPlus size={12} className="group-hover:rotate-12 transition-transform" />
              Add to Blacklist
            </button>
          </div>
        </div>

        {/* ── Table card ── */}
        <div
          className={`rounded-2xl overflow-hidden flex flex-col shadow-xl relative border ${isLight ? "bg-white border-gray-200" : "bg-[var(--color-bg-paper)] border-white/5"}`}
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          <div
            className={`flex-1 overflow-x-auto sm:overflow-visible p-3 sm:p-0 ${isLight ? "bg-[#F8F9FA]" : "bg-[var(--color-bg-default)]"}`}
          >
            <table className="w-full text-left sm:border-collapse min-w-0 sm:min-w-[680px] block sm:table">
              <thead className="hidden sm:table-header-group font-normal text-[12px]">
                <tr
                  className={
                    isLight
                      ? "bg-gray-50 border-b border-gray-100"
                      : "bg-[var(--color-bg-paper)] border-b border-white/5"
                  }
                >
                  <th
                    className={`px-6 py-2 text-[12px] font-normal tracking-[0.2em] uppercase whitespace-nowrap ${isLight ? "text-gray-500" : "text-gray-400"}`}
                  >
                    Visitor
                  </th>
                  <th
                    className={`px-6 py-2 text-[12px] font-normal tracking-[0.2em] uppercase whitespace-nowrap ${isLight ? "text-gray-500" : "text-gray-400"}`}
                  >
                    Restriction
                  </th>
                  <th
                    className={`px-6 py-2 text-[12px] font-normal tracking-[0.2em] uppercase text-center whitespace-nowrap ${isLight ? "text-gray-500" : "text-gray-400"}`}
                  >
                    Date
                  </th>
<<<<<<< HEAD
                  <th
                    className={`px-6 py-2 text-[12px] font-normal tracking-[0.2em] uppercase text-center whitespace-nowrap ${isLight ? "text-gray-500" : "text-gray-400"}`}
                  >
                    Risk
                  </th>
                  <th className="px-6 py-2 text-[12px] font-normal tracking-[0.2em] uppercase text-primary text-right whitespace-nowrap pr-6">
                    Control
=======
                  <th className="px-4 md:px-5 py-4 text-[10px] font-bold tracking-[0.2em] uppercase text-primary text-right whitespace-nowrap">
                    Action
>>>>>>> d84c08bc478503668fb632876e0c28206051dcb9
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
<<<<<<< HEAD
                        colSpan="5"
                        className="px-6 py-14 text-center block sm:table-cell font-normal text-[12px]"
=======
                        colSpan="4"
                        className="px-6 py-14 text-center block sm:table-cell"
>>>>>>> d84c08bc478503668fb632876e0c28206051dcb9
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
                          className={`block sm:table-cell px-6 py-1 border-b sm:border-none text-[12px] ${isLight ? "border-gray-100" : "border-white/5"}`}
                        >
                          <span className="text-[12px] font-normal tracking-[0.3em] text-primary/60 uppercase block sm:hidden mb-2">
                            Visitor
                          </span>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                            <div>
                              <p
                                className={`capitalize text-[12px] font-normal tracking-wide mb-0.5 group-hover:text-primary transition-colors break-words ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
                              >
                                {item.VB_Name}
                              </p>
                              <p
                                className={`text-[11px] font-normal tracking-[0.1em] ${isLight ? "text-gray-500" : "text-gray-400/70"}`}
                              >
                                {item.VB_Email || "no-email"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Reason */}
                        <td
                          className={`block sm:table-cell px-6 py-1 border-b sm:border-none text-[12px] ${isLight ? "border-gray-100" : "border-white/5"}`}
                        >
                          <span className="text-[12px] font-normal tracking-[0.3em] text-primary/60 uppercase block sm:hidden mb-2">
                            Restriction
                          </span>
                          <div className="flex flex-col gap-1.5">
                            <p
                              className={`capitalize text-[12px] font-normal tracking-wide leading-relaxed max-w-full sm:max-w-md break-words ${isLight ? "text-gray-700" : "text-white/80"}`}
                            >
                              {item.VB_Description || "—"}
                            </p>
                          </div>
                        </td>

                        {/* Date Added */}
                        <td
                          className={`block sm:table-cell px-6 py-1 border-b sm:border-none text-center text-[12px] ${isLight ? "border-gray-100" : "border-white/5"}`}
                        >
                          <span className="text-[12px] font-normal tracking-[0.3em] text-primary/60 uppercase block sm:hidden mb-2 text-left">
                            Date
                          </span>
                          <div className="flex flex-col items-center gap-1">
                            <p
                              className={`capitalize text-[12px] font-normal tracking-wide ${isLight ? "text-gray-600" : "text-gray-300/90"}`}
                            >
                              {item.VB_Created_Date
                                ? item.VB_Created_Date.split(" ")[0]
                                : "—"}
                            </p>
                            <span
                              className={`text-[9px] font-normal tracking-[0.1em] uppercase px-2 py-0.5 rounded-md ${item.VB_Status === "I" ? "bg-gray-500/20 border border-gray-500/30 text-gray-400" : "bg-green-500/10 border border-green-500/20 text-green-400"}`}
                            >
                              {item.VB_Status === "I" ? "Inactive" : "Active"}
                            </span>
                          </div>
                        </td>

<<<<<<< HEAD
                        {/* Risk Level */}
                        <td
                          className={`block sm:table-cell px-6 py-1 border-b sm:border-none text-[12px] ${isLight ? "border-gray-100" : "border-white/5"}`}
                        >
                          <span className="text-[12px] font-normal tracking-widest text-primary/60 uppercase block sm:hidden mb-2">
                            Risk Level
                          </span>
                          <RestrictionLevel
                            level={item.VB_Alert_Type || "Level 01"}
                          />
                        </td>
=======
>>>>>>> d84c08bc478503668fb632876e0c28206051dcb9

                        {/* Actions */}
                        <td className="block sm:table-cell px-6 py-1 text-right font-normal text-[12px] pr-6">
                          <span className="text-[12px] font-normal tracking-widest text-primary/60 uppercase block sm:hidden mb-2 text-left">
                            Action
                          </span>
                          <div className="flex justify-start sm:justify-end gap-2">
                            {/* ── View Details button ── */}
                            <button
                              onClick={() => handleViewDetails(item)}
                              title="View Details"
                              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-500 shadow-sm group/btn border ${isLight ? "bg-primary/5 border-primary/15 text-primary hover:text-white hover:bg-primary hover:border-primary" : "bg-blue-500/5 border-blue-500/20 text-blue-400 hover:text-white hover:bg-blue-500 hover:border-blue-500"}`}
                            >
                              <Eye
                                size={13}
                                className="group-hover/btn:scale-110 transition-transform"
                              />
                            </button>

                            {/* Edit button */}
                            <button
                              onClick={() => handleEditClick(item)}
                              title="Edit Blacklist"
                              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-500 shadow-sm group/btn border ${isLight ? "bg-amber-500/5 border-amber-500/20 text-amber-500 hover:text-white hover:bg-amber-500 hover:border-amber-500" : "bg-yellow-500/5 border-yellow-500/20 text-yellow-500 hover:text-white hover:bg-yellow-500 hover:border-yellow-500"}`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="13"
                                height="13"
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
                              className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all duration-500 shadow-sm group/btn ${
                                item.VB_Status === "I"
                                  ? "bg-green-500/5 border-green-500/20 text-green-400 hover:text-white hover:bg-green-500 hover:border-green-500"
                                  : "bg-red-500/5 border-red-500/20 text-red-400 hover:text-white hover:bg-red-500 hover:border-red-500"
                              }`}
                            >
                              {item.VB_Status === "I" ? (
                                <CheckCircle
                                  size={13}
                                  className="group-hover/btn:scale-110 transition-transform"
                                />
                              ) : (
                                <Power
                                  size={13}
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
<<<<<<< HEAD
                        colSpan="5"
                        className="px-6 py-14 text-center block sm:table-cell font-normal text-[12px]"
=======
                        colSpan="4"
                        className="px-6 py-14 text-center block sm:table-cell"
>>>>>>> d84c08bc478503668fb632876e0c28206051dcb9
                      >
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-primary/5 rounded-[24px] flex items-center justify-center border border-primary/10 shadow-inner">
                            <Shield size={26} className="text-primary/40" />
                          </div>
                          <div>
                            <h3
                              className={`text-[12px] font-normal capitalize tracking-[0.2em] mb-2 ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
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
