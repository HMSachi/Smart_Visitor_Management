import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  UserPlus,
  User,
  Mail,
  Shield,
  AlertTriangle,
  Save,
  Briefcase,
} from "lucide-react";
import { useThemeMode } from "../../../theme/ThemeModeContext";

const InputField = ({
  label,
  icon: Icon,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  isLight,
}) => (
  <div className="space-y-2">
    <label
      className={`text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 ${isLight ? "text-gray-500" : "text-gray-300/70"}`}
    >
      <Icon size={12} className="text-primary/60" />
      {label} {required && <span className="text-primary">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-gray-500 border ${isLight ? "bg-white border-gray-200 text-[#1A1A1A] shadow-sm shadow-gray-100/50" : "bg-white/[0.03] border-white/10 text-white shadow-inner shadow-black/20"}`}
    />
  </div>
);

const AddBlacklistModal = ({ isOpen, onClose, onAdd }) => {
  const { themeMode } = useThemeMode();
  const isLight = themeMode === "light";
  const [formData, setFormData] = useState({
    VB_Name: "",
    VB_Role: "visitor",
    VB_Email: "",
    VB_Description: "",
    VB_Alert_Type: "Level 01",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ...formData,
      VB_Admin_id: localStorage.getItem("admin_id") || "1",
      VB_Visitor_id: "", // Empty string instead of '0' avoids foreign key conflicts
    });
    onClose();
    setFormData({
      VB_Name: "",
      VB_Role: "visitor",
      VB_Email: "",
      VB_Description: "",
      VB_Alert_Type: "Level 01",
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110]"
          />

          <div className="fixed inset-0 flex items-center justify-center p-4 z-[111] pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`w-full max-w-4xl rounded-[32px] pointer-events-auto overflow-hidden flex flex-col max-h-[90vh] border ${isLight ? "bg-white border-gray-200 shadow-[0_30px_80px_rgba(0,0,0,0.18)]" : "bg-[#141416] border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.65)]"}`}
            >
              {/* Header */}
              <div
                className={`p-6 border-b flex justify-between items-center ${isLight ? "border-gray-200 bg-[#F8F9FA]" : "border-white/5 bg-white/[0.01]"}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <UserPlus size={24} />
                  </div>
                  <div>
                    <h2
                      className={`text-lg font-bold tracking-widest uppercase ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
                    >
                      Add Blacklisted Visitor
                    </h2>
                    <p
                      className={`text-xs tracking-wider ${isLight ? "text-gray-500" : "text-gray-400"}`}
                    >
                      Add a visitor to the restricted access list
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className={`p-2 rounded-xl transition-colors ${isLight ? "text-gray-500 hover:bg-gray-100 hover:text-[#1A1A1A]" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Content */}
              <form
                onSubmit={handleSubmit}
                className={`overflow-y-auto p-8 space-y-8 ${isLight ? "bg-[#F8F9FA] scrollbar-thin scrollbar-thumb-gray-300" : "bg-[var(--color-bg-default)] scrollbar-thin scrollbar-thumb-white/10"}`}
              >
                {/* Section 1: Subject Identity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-full flex items-center gap-3">
                    <div className="w-1 h-4 bg-primary rounded-full shadow-[0_0_8px_var(--color-primary)]"></div>
                    <h3 className="text-primary text-[12px] font-bold uppercase tracking-[0.3em]">
                      Visitor Details
                    </h3>
                  </div>

                  <InputField
                    isLight={isLight}
                    label="Full Name"
                    icon={User}
                    name="VB_Name"
                    value={formData.VB_Name}
                    onChange={handleChange}
                    placeholder="Visitor's full name"
                    required
                  />
                  <InputField
                    isLight={isLight}
                    label="Email Address"
                    icon={Mail}
                    name="VB_Email"
                    value={formData.VB_Email}
                    onChange={handleChange}
                    type="email"
                    placeholder="email@example.com"
                  />
                  <InputField
                    isLight={isLight}
                    label="Role"
                    icon={Briefcase}
                    name="VB_Role"
                    value={formData.VB_Role}
                    onChange={handleChange}
                    placeholder="e.g. visitor, contractor"
                  />
                </div>

                {/* Section 2: Restriction Logistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                  <div className="col-span-full flex items-center gap-3">
                    <div className="w-1 h-4 bg-primary rounded-full shadow-[0_0_8px_var(--color-primary)]"></div>
                    <h3 className="text-primary text-[12px] font-bold uppercase tracking-[0.3em]">
                      Blacklist Details
                    </h3>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label
                      className={`text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 ${isLight ? "text-gray-500" : "text-gray-300/70"}`}
                    >
                      <AlertTriangle size={12} className="text-primary/60" />
                      Reason for Blacklisting{" "}
                      <span className="text-primary">*</span>
                    </label>
                    <textarea
                      name="VB_Description"
                      value={formData.VB_Description}
                      onChange={handleChange}
                      required
                      placeholder="Specify reasons for blacklisting..."
                      className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all min-h-[100px] resize-none border ${isLight ? "bg-white border-gray-200 text-[#1A1A1A] shadow-sm shadow-gray-100/50" : "bg-white/[0.03] border-white/10 text-white shadow-inner shadow-black/20"}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      className={`text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 ${isLight ? "text-gray-500" : "text-gray-300/70"}`}
                    >
                      <Shield size={12} className="text-primary/60" />
                      Risk Level
                    </label>
                    <select
                      name="VB_Alert_Type"
                      value={formData.VB_Alert_Type}
                      onChange={handleChange}
                      className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all appearance-none border ${isLight ? "bg-white border-gray-200 text-[#1A1A1A] shadow-sm shadow-gray-100/50" : "bg-white/[0.03] border-white/10 text-white shadow-inner shadow-black/20"}`}
                    >
                      <option
                        value="Level 01"
                        className={isLight ? "bg-white" : "bg-[#141416]"}
                      >
                        Level 01 - Monitoring Required
                      </option>
                      <option
                        value="Level 02"
                        className={isLight ? "bg-white" : "bg-[#141416]"}
                      >
                        Level 02 - Strict Access Control
                      </option>
                      <option
                        value="Level 03"
                        className={isLight ? "bg-white" : "bg-[#141416]"}
                      >
                        Level 03 - Denied Entry
                      </option>
                    </select>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex gap-4 pt-6 border-t border-white/5">
                  <button
                    type="button"
                    onClick={onClose}
                    className={`flex-1 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all border ${isLight ? "border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-[#1A1A1A]" : "border-white/10 text-gray-400 hover:bg-white/5 hover:text-white"}`}
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-4 bg-primary rounded-2xl text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-lg shadow-primary/20"
                  >
                    <Save size={18} />
                    Add to Blacklist
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddBlacklistModal;
