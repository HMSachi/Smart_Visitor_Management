import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Contact_Person/Layout/Sidebar";
import Header from "../../../components/Contact_Person/Layout/Header";
import { useThemeMode } from "../../../theme/ThemeModeContext";
import { GetVisitorsByCP } from "../../../actions/VisitorAction";
import { AddVisitRequest } from "../../../actions/VisitRequestAction";
import ContactPersonService from "../../../services/ContactPersonService";
import { 
  User, 
  Calendar, 
  MapPin, 
  FileText, 
  ArrowLeft,
  CheckCircle2
} from "lucide-react";

const CreateVisitRequest = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { themeMode } = useThemeMode();
  const isLight = themeMode === "light";

  const { visitorsByCP, isLoading: isVisitorsLoading } = useSelector((state) => state.visitorManagement);
  const user = useSelector((state) => state.login.user);
  const userEmail = user?.ResultSet?.[0]?.VA_Email;

  const [cpId, setCpId] = useState(null);
  const [formData, setFormData] = useState({
    VVR_Visitor_id: "",
    VVR_Visit_Date: "",
    VVR_Places_to_Visit: "",
    VVR_Purpose: "",
    VVR_Status: "PENDING",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadContactPersonId = async () => {
      try {
        const response = await ContactPersonService.GetAllContactPersons();
        const contactPersons = response?.data?.ResultSet || [];
        const match = contactPersons.find(
          (cp) => cp?.VCP_Email?.trim().toLowerCase() === userEmail?.trim().toLowerCase()
        );
        if (match) {
          setCpId(match.VCP_Contact_person_id);
        }
      } catch (err) {
        console.error("Error loading contact person:", err);
      }
    };

    if (userEmail) {
      loadContactPersonId();
    }
  }, [userEmail]);

  useEffect(() => {
    if (cpId) {
      dispatch(GetVisitorsByCP(cpId));
    }
  }, [dispatch, cpId]);

  const activeVisitors = useMemo(() => {
    return (visitorsByCP || []).filter((v) => {
      const s = (v.VV_Status || "").toString().trim().toUpperCase();
      return s === "ACTIVE" || s === "A";
    });
  }, [visitorsByCP]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.VVR_Visitor_id) newErrors.VVR_Visitor_id = "Visitor is required";
    if (!formData.VVR_Visit_Date) newErrors.VVR_Visit_Date = "Visit date is required";
    if (!formData.VVR_Places_to_Visit.trim()) newErrors.VVR_Places_to_Visit = "Visiting area is required";
    if (!formData.VVR_Purpose.trim()) newErrors.VVR_Purpose = "Reason for visit is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        VVR_Contact_person_id: cpId,
      };
      await dispatch(AddVisitRequest(payload));
      alert("Visit request created successfully!");
      navigate("/contact_person/visit-requests");
    } catch (err) {
      console.error("Failed to create visit request:", err);
      alert("Failed to create visit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`contact-theme-root flex bg-[var(--color-bg-default)] overflow-hidden text-[var(--color-text-primary)] h-screen w-full`}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-[var(--color-bg-default)] overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-slow">
            
            {/* Breadcrumb & Title */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-4">
                <button 
                  onClick={() => navigate("/contact_person/visit-requests")}
                  className={`p-2 rounded-xl transition-all border ${isLight ? "bg-white border-gray-200 text-gray-500 hover:bg-gray-50" : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"}`}
                >
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <h1 className={`text-xl md:text-2xl font-bold tracking-tight uppercase ${isLight ? "text-[#1A1A1A]" : "text-white"}`}>
                    Create Visit <span className="text-primary">Request</span>
                  </h1>
                  <p className={`text-[11px] font-bold uppercase tracking-[0.3em] mt-1 opacity-70 ${isLight ? "text-gray-500" : "text-white/40"}`}>
                    Initialize visitor clearance protocol
                  </p>
                </div>
              </div>
              
              <div className={`px-5 py-3 rounded-2xl border flex flex-col md:flex-row items-center gap-4 md:gap-3 ${isLight ? "bg-white border-gray-200 shadow-sm" : "bg-black/40 border-white/10"}`}>
                <CheckCircle2 size={16} className="text-primary" />
                <span className={`text-[11px] font-bold uppercase tracking-[0.2em] ${isLight ? "text-gray-600" : "text-white/60"}`}>
                  Priority Clearance
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Main Form Container */}
              <div className={`p-6 md:p-10 rounded-[32px] border relative overflow-hidden ${isLight ? "bg-white border-gray-200 shadow-xl shadow-gray-200/50" : "bg-[#0F0F10] border-white/5"}`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50"></div>
                
                <div className="space-y-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                    <h3 className={`text-[14px] font-bold uppercase tracking-[0.2em] ${isLight ? "text-[#1A1A1A]" : "text-white"}`}>
                      Visitation Protocol Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Visitor Selection */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                        <User size={12} className="text-primary" /> Choose Visitor
                      </label>
                      <select
                        name="VVR_Visitor_id"
                        value={formData.VVR_Visitor_id}
                        onChange={handleInputChange}
                        className={`w-full border rounded-xl px-5 py-4 text-[13px] focus:outline-none transition-all appearance-none cursor-pointer ${
                          isLight
                            ? "bg-gray-50 border-gray-200 text-[#1A1A1A] focus:border-primary/40"
                            : "bg-white/[0.03] border-white/10 text-white focus:border-primary/50"
                        } ${errors.VVR_Visitor_id ? "border-red-500/50" : ""}`}
                      >
                        <option value="" className={isLight ? "text-gray-400" : "bg-[#0F0F10]"}>Select a visitor from registry</option>
                        {activeVisitors.map((v) => (
                          <option key={v.VV_Visitor_id} value={v.VV_Visitor_id} className={isLight ? "" : "bg-[#0F0F10]"}>
                            {v.VV_Name} ({v.VV_NIC_Passport_NO})
                          </option>
                        ))}
                      </select>
                      {errors.VVR_Visitor_id && <p className="text-[10px] text-red-500 font-bold mt-1 px-1">{errors.VVR_Visitor_id}</p>}
                    </div>

                    {/* Visit Date */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                        <Calendar size={12} className="text-primary" /> Proposed Visit Date
                      </label>
                      <input
                        type="date"
                        name="VVR_Visit_Date"
                        value={formData.VVR_Visit_Date}
                        onChange={handleInputChange}
                        className={`w-full border rounded-xl px-5 py-4 text-[13px] focus:outline-none transition-all [color-scheme:dark] ${
                          isLight
                            ? "bg-gray-50 border-gray-200 text-[#1A1A1A] focus:border-primary/40 [color-scheme:light]"
                            : "bg-white/[0.03] border-white/10 text-white focus:border-primary/50"
                        } ${errors.VVR_Visit_Date ? "border-red-500/50" : ""}`}
                      />
                      {errors.VVR_Visit_Date && <p className="text-[10px] text-red-500 font-bold mt-1 px-1">{errors.VVR_Visit_Date}</p>}
                    </div>

                    {/* Visiting Areas */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                        <MapPin size={12} className="text-primary" /> Authorized Access Zones
                      </label>
                      <input
                        type="text"
                        name="VVR_Places_to_Visit"
                        value={formData.VVR_Places_to_Visit}
                        onChange={handleInputChange}
                        placeholder="e.g. Production Floor, Server Room, Management Wing"
                        className={`w-full border rounded-xl px-5 py-4 text-[13px] focus:outline-none transition-all ${
                          isLight
                            ? "bg-gray-50 border-gray-200 text-[#1A1A1A] focus:border-primary/40"
                            : "bg-white/[0.03] border-white/10 text-white focus:border-primary/50"
                        } ${errors.VVR_Places_to_Visit ? "border-red-500/50" : ""}`}
                      />
                      {errors.VVR_Places_to_Visit && <p className="text-[10px] text-red-500 font-bold mt-1 px-1">{errors.VVR_Places_to_Visit}</p>}
                    </div>

                    {/* Purpose */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                        <FileText size={12} className="text-primary" /> Brief Reason for Visitation
                      </label>
                      <textarea
                        name="VVR_Purpose"
                        value={formData.VVR_Purpose}
                        onChange={handleInputChange}
                        rows="5"
                        placeholder="Provide comprehensive details regarding the objective of this visitation request..."
                        className={`w-full border rounded-xl px-5 py-4 text-[13px] focus:outline-none transition-all resize-none ${
                          isLight
                            ? "bg-gray-50 border-gray-200 text-[#1A1A1A] focus:border-primary/40"
                            : "bg-white/[0.03] border-white/10 text-white focus:border-primary/50"
                        } ${errors.VVR_Purpose ? "border-red-500/50" : ""}`}
                      ></textarea>
                      {errors.VVR_Purpose && <p className="text-[10px] text-red-500 font-bold mt-1 px-1">{errors.VVR_Purpose}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/contact_person/visit-requests")}
                  className={`w-full md:w-auto px-12 py-4 rounded-2xl text-[12px] font-bold uppercase tracking-[0.2em] transition-all border ${
                    isLight 
                      ? "bg-white border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600" 
                      : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white/70"
                  }`}
                >
                  Discard Request
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto flex-1 px-12 py-4 bg-primary hover:bg-primary-hover text-white text-[12px] font-bold uppercase tracking-[0.2em] rounded-2xl shadow-[0_12px_30px_rgba(200,16,46,0.3)] transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? "Synchronizing..." : "Submit for Authorization"}
                </button>
              </div>

            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateVisitRequest;

