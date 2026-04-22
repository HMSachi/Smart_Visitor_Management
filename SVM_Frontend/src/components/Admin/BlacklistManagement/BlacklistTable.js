import React, { useState } from "react";
import {
  Search,
  Plus,
  Trash2,
  Shield,
  User,
  AlertCircle,
  Clock,
  Download,
  ChevronRight,
  Hash,
  Ban,
  UserX,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const RestrictionLevel = ({ level }) => {
  const styles = {
    "Level 01": "border border-blue-500/30 text-blue-400 bg-blue-500/8",
    "Level 02": "border border-primary/30 text-primary/90 bg-primary/8",
    "Level 03":
      "border border-red-500/40 text-red-400 bg-red-500/10 shadow-[0_0_12px_rgba(255,100,100,0.1)]",
  };

  return (
    <div
      className={`px-2 py-1 rounded-md text-[8px] font-bold tracking-widest uppercase flex items-center gap-1 w-fit ${styles[level] || styles["Level 01"]}`}
    >
      <div
        className={`w-1 h-1 rounded-full ${level === "Level 03" ? "bg-red-400 shadow-[0_0_4px_rgba(255,100,100,0.6)] animate-pulse" : level === "Level 02" ? "bg-primary shadow-[0_0_4px_var(--color-primary)]" : "bg-blue-400"}`}
      ></div>
      {level}
    </div>
  );
};

const RestrictedTable = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const blacklist = [];

  const filtered = blacklist.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.docId.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="bg-[var(--color-bg-paper)] border border-white/8 rounded-2xl overflow-hidden flex flex-col shadow-xl animate-fade-in-slow relative hover:border-white/12 transition-colors duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent pointer-events-none"></div>

      <div className="flex-1 overflow-x-auto sm:overflow-visible bg-[var(--color-bg-default)] p-2 sm:p-0">
        <div
          className="overflow-x-auto w-full max-w-full pb-2"
          style={{ maxHeight: "300px", overflowY: "auto" }}
        >
          <table className="w-full text-left border-separate border-spacing-y-2 sm:border-spacing-y-0 sm:border-collapse min-w-0 sm:min-w-[700px] block sm:table">
            <thead className="hidden sm:table-header-group sticky top-0 z-10">
              <tr className="bg-gradient-to-r from-white/[0.03] to-white/[0.01] border-b border-white/8">
                <th className="px-4 py-3.5 text-[9px] font-semibold tracking-widest uppercase text-white/50 whitespace-nowrap border-r border-white/5">
                  Visitor
                </th>
                <th className="px-4 py-3.5 text-[9px] font-semibold tracking-widest uppercase text-white/50 whitespace-nowrap border-r border-white/5">
                  Reason
                </th>
                <th className="px-4 py-3.5 text-[9px] font-semibold tracking-widest uppercase text-white/50 text-center whitespace-nowrap border-r border-white/5">
                  Risk
                </th>
                <th className="px-4 py-3.5 text-[9px] font-semibold tracking-widest uppercase text-primary text-center whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="block sm:table-row-group">
              <AnimatePresence>
                {filtered.length > 0 ? (
                  filtered.map((item, idx) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group hover:bg-white/[0.02] transition-all duration-300 block sm:table-row bg-[#161618] sm:bg-transparent border border-white/5 sm:border-b sm:border-t-0 sm:border-l-0 sm:border-r-0 sm:border-white/5 rounded-[12px] sm:rounded-none mb-2 sm:mb-0 p-2.5 sm:p-0 sm:hover:bg-white/[0.03]"
                    >
                      <td className="block sm:table-cell px-4 sm:px-4 py-3 sm:py-4 border-b border-white/5 sm:border-none">
                        <span className="text-[9px] font-bold tracking-widest text-primary/60 uppercase block sm:hidden mb-2">
                          Visitor
                        </span>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                          <div>
                            <p className="text-white text-[11px] font-semibold tracking-wide mb-1 group-hover:text-primary transition-colors break-words">
                              {item.name}
                            </p>
                            <p className="text-gray-300/70 text-[9px] font-medium tracking-[0.1em] font-mono">
                              {item.docId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="block sm:table-cell px-4 sm:px-4 py-3 sm:py-4 border-b border-white/5 sm:border-none">
                        <span className="text-[9px] font-bold tracking-widest text-primary/60 uppercase block sm:hidden mb-2">
                          Reason
                        </span>
                        <div className="flex flex-col gap-1.5">
                          <p className="text-white/85 text-[10px] font-medium tracking-wide leading-snug max-w-full sm:max-w-xs break-words">
                            {item.reason}
                          </p>
                          <div className="flex flex-col md:flex-row items-start md:items-center gap-1.5 md:gap-2">
                            <p className="text-gray-300/70 text-[8px] font-medium tracking-[0.15em] uppercase flex flex-col md:flex-row items-center gap-1.5 md:gap-1">
                              <User size={7} className="text-primary/50" />{" "}
                              <span>{item.addedBy}</span>
                            </p>
                            <span className="text-white/10 text-[8px] hidden md:block">
                              •
                            </span>
                            <p className="text-gray-300/70 text-[8px] font-medium tracking-[0.15em] uppercase flex flex-col md:flex-row items-center gap-1.5 md:gap-1">
                              <Clock size={7} className="text-primary/50" />{" "}
                              <span>{item.date}</span>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="block sm:table-cell px-4 sm:px-4 py-3 sm:py-4 border-b border-white/5 sm:border-none">
                        <span className="text-[9px] font-bold tracking-widest text-primary/60 uppercase block sm:hidden mb-2">
                          Risk
                        </span>
                        <div className="flex justify-start sm:justify-center">
                          <RestrictionLevel level={item.level} />
                        </div>
                      </td>
                      <td className="block sm:table-cell px-4 sm:px-4 py-3 sm:py-4 text-center">
                        <span className="text-[9px] font-bold tracking-widest text-primary/60 uppercase block sm:hidden mb-2 text-left">
                          Action
                        </span>
                        <div className="flex justify-center gap-1.5">
                          <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.03] border border-white/10 text-gray-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-300 shadow-lg group/btn">
                            <Trash2
                              size={11}
                              className="group-hover/btn:scale-110 transition-transform"
                            />
                          </button>
                          <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.03] border border-white/10 text-gray-400 hover:text-white hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 shadow-lg group/btn">
                            <ChevronRight
                              size={11}
                              className="group-hover/btn:translate-x-0.5 transition-transform"
                            />
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
                      colSpan="4"
                      className="px-4 py-10 text-center block sm:table-cell"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center border border-primary/15 shadow-sm">
                          <Shield size={20} className="text-primary/40" />
                        </div>
                        <div>
                          <h3 className="text-white text-[11px] font-bold uppercase tracking-widest mb-1">
                            No Blacklist Found
                          </h3>
                          <p className="text-gray-400/60 text-[8px] uppercase tracking-[0.2em] font-medium">
                            System is secure and compliant
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
  );
};

export default RestrictedTable;
