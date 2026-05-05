import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import {
  X,
  UserPlus,
  User,
  Mail,
  AlertTriangle,
  Save,
  Briefcase,
  Loader2,
  Shield,
  Users,
} from "lucide-react";
import { useThemeMode } from "../../../theme/ThemeModeContext";
import VisitorService from "../../../services/VisitorService";
import VisitRequestService from "../../../services/VisitRequestService";
import VisitGroupService from "../../../services/VisitGroupService";

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
  readOnly = false,
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
      readOnly={readOnly}
      required={required}
      placeholder={placeholder}
      className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-gray-500 border ${readOnly ? (isLight ? "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed" : "bg-white/[0.01] border-white/5 text-gray-400 cursor-not-allowed") : (isLight ? "bg-white border-gray-200 text-[#1A1A1A] shadow-sm shadow-gray-100/50" : "bg-white/[0.03] border-white/10 text-white shadow-inner shadow-black/20")}`}
    />
  </div>
);

const SelectVisitorField = ({
  label,
  icon: Icon,
  visitors,
  selectedVisitor,
  onSelectVisitor,
  isLight,
  isLoading,
}) => (
  <div className="space-y-2">
    <label
      className={`text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 ${isLight ? "text-gray-500" : "text-gray-300/70"}`}
    >
      <Icon size={12} className="text-primary/60" />
      {label} <span className="text-primary">*</span>
    </label>
    <select
      value={selectedVisitor ? String(selectedVisitor.VV_Visitor_id) : ""}
      onChange={(e) => {
        if (e.target.value === "") {
          onSelectVisitor(null);
        } else {
          const selectedId = e.target.value;
          const visitor = visitors.find(
            (v) => String(v.VV_Visitor_id) === selectedId,
          );
          onSelectVisitor(visitor);
        }
      }}
      disabled={isLoading || visitors.length === 0}
      className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all appearance-none border cursor-pointer ${isLight ? "bg-white border-gray-200 text-[#1A1A1A] shadow-sm shadow-gray-100/50 disabled:bg-gray-50 disabled:cursor-not-allowed" : "bg-white/[0.03] border-white/10 text-white shadow-inner shadow-black/20 disabled:opacity-50 disabled:cursor-not-allowed"}`}
    >
      <option value="">
        {isLoading ? "Loading visitors..." : visitors.length === 0 ? "No visitors available" : "Select a visitor..."}
      </option>
      {visitors.map((visitor) => (
        <option
          key={visitor.VV_Visitor_id}
          value={String(visitor.VV_Visitor_id)}
          className={isLight ? "bg-white" : "bg-[#141416]"}
        >
          {visitor.VV_Name} - {visitor.VV_Email || "No email"}
        </option>
      ))}
    </select>
  </div>
);

const SelectSubVisitorField = ({
  label,
  icon: Icon,
  subVisitors,
  selectedSubVisitor,
  onSelectSubVisitor,
  isLight,
  isLoading,
}) => (
  <div className="space-y-2">
    <label
      className={`text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 ${isLight ? "text-gray-500" : "text-gray-300/70"}`}
    >
      <Icon size={12} className="text-primary/60" />
      {label} <span className="text-gray-400 text-[9px]">(Optional)</span>
    </label>
    <select
      value={selectedSubVisitor ? String(selectedSubVisitor.VVG_id) : ""}
      onChange={(e) => {
        if (e.target.value === "") {
          onSelectSubVisitor(null);
        } else {
          const selectedId = e.target.value;
          const subVisitor = subVisitors.find(
            (v) => String(v.VVG_id) === selectedId,
          );
          onSelectSubVisitor(subVisitor);
        }
      }}
      disabled={isLoading || subVisitors.length === 0}
      className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all appearance-none border cursor-pointer ${isLight ? "bg-white border-gray-200 text-[#1A1A1A] shadow-sm shadow-gray-100/50 disabled:bg-gray-50 disabled:cursor-not-allowed" : "bg-white/[0.03] border-white/10 text-white shadow-inner shadow-black/20 disabled:opacity-50 disabled:cursor-not-allowed"}`}
    >
      <option value="">
        {isLoading ? "Loading companions..." : subVisitors.length === 0 ? "No companions found" : "Select a companion (optional)..."}
      </option>
      {subVisitors.map((subVisitor) => (
        <option
          key={subVisitor.VVG_id}
          value={String(subVisitor.VVG_id)}
          className={isLight ? "bg-white" : "bg-[#141416]"}
        >
          {subVisitor.VVG_Visitor_Name}
        </option>
      ))}
    </select>
  </div>
);

const AddBlacklistModal = ({ isOpen, onClose, onAdd }) => {
  const { themeMode } = useThemeMode();
  const isLight = themeMode === "light";
  const [formData, setFormData] = useState({
    VB_Name: "",
    VB_Role: "Visitor",
    VB_Email: "",
    VB_Description: "",
    VB_Alert_Type: "Level 01",
  });
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [visitors, setVisitors] = useState([]);
  const [isLoadingVisitors, setIsLoadingVisitors] = useState(false);
  const [selectedSubVisitor, setSelectedSubVisitor] = useState(null);
  const [subVisitors, setSubVisitors] = useState([]);
  const [isLoadingSubVisitors, setIsLoadingSubVisitors] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadVisitors();
    }
  }, [isOpen]);

  const loadVisitors = async () => {
    setIsLoadingVisitors(true);
    try {
      const response = await VisitorService.GetAllVisitors();
      const visitorList = response?.data?.ResultSet || response?.data || [];
      setVisitors(visitorList);
    } catch (error) {
      console.error("Error loading visitors:", error);
      setVisitors([]);
    } finally {
      setIsLoadingVisitors(false);
    }
  };

  const loadSubVisitors = async (visitorId) => {
    setIsLoadingSubVisitors(true);
    setSubVisitors([]);
    setSelectedSubVisitor(null);
    try {
      // Get all visit requests for this visitor
      const requestsResponse = await VisitRequestService.GetVisitRequestsByVisitor(visitorId);
      const requests = Array.isArray(requestsResponse?.data?.ResultSet)
        ? requestsResponse.data.ResultSet
        : Array.isArray(requestsResponse?.data)
          ? requestsResponse.data
          : [];

      if (!requests.length) {
        setSubVisitors([]);
        return;
      }

      // Get all visit groups
      const groupsResponse = await VisitGroupService.GetAllVisitGroup();
      const allGroups = Array.isArray(groupsResponse?.data?.ResultSet)
        ? groupsResponse.data.ResultSet
        : Array.isArray(groupsResponse?.data)
          ? groupsResponse.data
          : [];

      // Get request IDs for the selected visitor
      const requestIds = requests.map((r) => r.VVR_Request_id);

      // Filter groups by those request IDs
      const visitorGroups = allGroups.filter((g) =>
        requestIds.includes(g.VVR_Request_id)
      );

      setSubVisitors(visitorGroups);
    } catch (error) {
      console.error("Error loading sub-visitors:", error);
      setSubVisitors([]);
    } finally {
      setIsLoadingSubVisitors(false);
    }
  };

  const handleSelectVisitor = (visitor) => {
    setSelectedVisitor(visitor);
    setSelectedSubVisitor(null);
    if (visitor) {
      setFormData((prev) => ({
        ...prev,
        VB_Name: visitor.VV_Name || "",
        VB_Email: visitor.VV_Email || "",
        VB_Role: "Visitor",
      }));
      loadSubVisitors(visitor.VV_Visitor_id);
    } else {
      setFormData((prev) => ({
        ...prev,
        VB_Name: "",
        VB_Email: "",
        VB_Role: "Visitor",
      }));
      setSubVisitors([]);
    }
  };

  const handleSelectSubVisitor = (subVisitor) => {
    setSelectedSubVisitor(subVisitor);
    if (subVisitor) {
      setFormData((prev) => ({
        ...prev,
        VB_Name: subVisitor.VVG_Visitor_Name || "",
        VB_Email: subVisitor.VVG_NIC_Passport_Number || "N/A", 
        VB_Role: "Visitor Companion",
      }));
    } else if (selectedVisitor) {
      setFormData((prev) => ({
        ...prev,
        VB_Name: selectedVisitor.VV_Name || "",
        VB_Email: selectedVisitor.VV_Email || "",
        VB_Role: "Visitor",
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedVisitor) {
      alert("Please select a visitor from the list");
      return;
    }
    onAdd({
      ...formData,
      VB_Admin_id: localStorage.getItem("admin_id") || "1",
      VB_Visitor_id: selectedVisitor.VV_Visitor_id,
    });
    onClose();
    setFormData({
      VB_Name: "",
      VB_Role: "Visitor",
      VB_Email: "",
      VB_Description: "",
      VB_Alert_Type: "Level 01",
    });
    setSelectedVisitor(null);
    setSelectedSubVisitor(null);
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={`fixed inset-0 backdrop-blur-sm z-[110] ${isLight ? "bg-transparent" : "bg-black/40"}`}
          />

          <div className="fixed inset-0 flex items-center justify-center p-4 z-[111] pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`w-full max-w-2xl rounded-[26px] pointer-events-auto overflow-hidden flex flex-col max-h-[82vh] border ${isLight ? "bg-white border-gray-200 shadow-[0_20px_48px_rgba(0,0,0,0.14)]" : "bg-[#141416] border-white/10 shadow-[0_20px_64px_rgba(0,0,0,0.52)]"}`}
            >
              {/* Header */}
              <div
                className={`p-4 border-b flex justify-between items-center ${isLight ? "border-gray-200 bg-[#F8F9FA]" : "border-white/5 bg-white/[0.01]"}`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <UserPlus size={18} />
                  </div>
                  <div>
                    <h2
                      className={`text-[14px] font-semibold tracking-[0.18em] uppercase ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
                    >
                      Add Blacklisted Visitor
                    </h2>
                    <p
                      className={`text-[10px] tracking-wider ${isLight ? "text-gray-500" : "text-gray-400"}`}
                    >
                      Add an existing visitor to the restricted access list
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className={`p-2 rounded-xl transition-colors ${isLight ? "text-gray-500 hover:bg-gray-100 hover:text-[#1A1A1A]" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Content */}
              <form
                onSubmit={handleSubmit}
                className={`overflow-y-auto p-5 space-y-5 ${isLight ? "bg-[#F8F9FA] scrollbar-thin scrollbar-thumb-gray-300" : "bg-[var(--color-bg-default)] scrollbar-thin scrollbar-thumb-white/10"}`}
              >
                {/* Section 1: Select Visitor */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="col-span-full flex items-center gap-2.5">
                    <div className="w-1 h-3.5 bg-primary rounded-full shadow-[0_0_6px_var(--color-primary)]"></div>
                    <h3 className="text-primary text-[10px] font-bold uppercase tracking-[0.28em]">
                      Visitor Selection
                    </h3>
                  </div>

                  <div className="col-span-full">
                    {isLoadingVisitors ? (
                      <div className="flex items-center justify-center py-6 gap-2">
                        <Loader2 size={16} className="animate-spin text-primary" />
                        <span
                          className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}
                        >
                          Loading visitors...
                        </span>
                      </div>
                    ) : (
                      <SelectVisitorField
                        label="Select Visitor"
                        icon={User}
                        visitors={visitors}
                        selectedVisitor={selectedVisitor}
                        onSelectVisitor={handleSelectVisitor}
                        isLight={isLight}
                        isLoading={isLoadingVisitors}
                      />
                    )}
                  </div>

                  {selectedVisitor && (
                    <div className="col-span-full">
                      {isLoadingSubVisitors ? (
                        <div className="flex items-center justify-center py-4 gap-2">
                          <Loader2 size={14} className="animate-spin text-primary" />
                          <span
                            className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}
                          >
                            Loading companions...
                          </span>
                        </div>
                      ) : (
                        <SelectSubVisitorField
                          label="Add a Companion to Blacklist"
                          icon={Users}
                          subVisitors={subVisitors}
                          selectedSubVisitor={selectedSubVisitor}
                          onSelectSubVisitor={handleSelectSubVisitor}
                          isLight={isLight}
                          isLoading={isLoadingSubVisitors}
                        />
                      )}
                    </div>
                  )}

                  <InputField
                    isLight={isLight}
                    label="Full Name"
                    icon={User}
                    name="VB_Name"
                    value={formData.VB_Name}
                    onChange={handleChange}
                    readOnly={true}
                    placeholder="Auto-filled from selected visitor"
                  />
                  <InputField
                    isLight={isLight}
                    label={selectedSubVisitor ? "NIC / Passport" : "Email Address"}
                    icon={selectedSubVisitor ? Briefcase : Mail}
                    name="VB_Email"
                    value={formData.VB_Email}
                    onChange={handleChange}
                    readOnly={true}
                    type={selectedSubVisitor ? "text" : "email"}
                    placeholder={selectedSubVisitor ? "Auto-filled NIC from companion" : "Auto-filled from selected visitor"}
                  />
                </div>

                {/* Section 2: Restriction Logistics */}
                <div
                  className={`grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-3.5 border-t ${isLight ? "border-gray-200" : "border-white/5"}`}
                >
                  <div className="col-span-full flex items-center gap-2.5">
                    <div className="w-1 h-3.5 bg-primary rounded-full shadow-[0_0_6px_var(--color-primary)]"></div>
                    <h3 className="text-primary text-[10px] font-bold uppercase tracking-[0.28em]">
                      Blacklist Details
                    </h3>
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label
                      className={`text-[9px] font-bold uppercase tracking-[0.18em] flex items-center gap-2 ${isLight ? "text-gray-500" : "text-gray-300/70"}`}
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
                      className={`w-full rounded-xl px-3.5 py-2.5 text-[12px] focus:outline-none focus:border-primary/50 transition-all min-h-[74px] resize-none border ${isLight ? "bg-white border-gray-200 text-[#1A1A1A] shadow-sm shadow-gray-100/50" : "bg-white/[0.03] border-white/10 text-white shadow-inner shadow-black/20"}`}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div
                  className={`flex gap-2.5 pt-4 border-t ${isLight ? "border-gray-200" : "border-white/5"}`}
                >
                  <button
                    type="button"
                    onClick={onClose}
                    className={`flex-1 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border ${isLight ? "border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-[#1A1A1A]" : "border-white/10 text-gray-400 hover:bg-white/5 hover:text-white"}`}
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedVisitor || isLoadingVisitors}
                    className="flex-[2] py-3 bg-primary rounded-2xl text-white text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2.5 hover:scale-[1.02] transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <Save size={15} />
                    Add to Blacklist
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default AddBlacklistModal;
