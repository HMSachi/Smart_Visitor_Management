import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useThemeMode } from "../../../theme/ThemeModeContext";
import {
  GetVisitorsByCP,
  ToggleVisitorStatus,
  AddVisitor,
} from "../../../actions/VisitorAction";
import { AddAdministrator } from "../../../actions/AdministratorAction";
import { GetAllContactPersons } from "../../../actions/ContactPersonAction";
import { GetAllBlacklist } from "../../../actions/BlacklistAction";
import Header from "../../../components/Contact_Person/Layout/Header";
import Sidebar from "../../../components/Contact_Person/Layout/Sidebar";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Search,
  Plus,
  RefreshCw,
  X,
  Hash,
  Briefcase,
  AlertCircle,
  Car,
  Eye,
  EyeOff,
  Users,
} from "lucide-react";
import {
  validateName,
  validateNIC,
  validatePhone,
  validateEmail,
  validatePassword,
} from "../../../utils/validation";

const ContactAllVisitors = () => {
  const dispatch = useDispatch();
  const { visitorsByCP, isLoading, error } = useSelector(
    (state) => state.visitorManagement,
  );
  const { contactPersons } = useSelector((state) => state.contactPerson);
  const { blacklists } = useSelector((state) => state.blacklistState || { blacklists: [] });
  const { themeMode } = useThemeMode();
  const isLight = themeMode === "light";

  // Try to safely extract CP ID from logged in user, fallback to 2 per your specification if undefined
  const user = useSelector((state) => state.login.user);
  const [cpId, setCpId] = useState(null);

  const userEmail = user?.ResultSet?.[0]?.VA_Email;

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    VV_Contact_person_id: cpId,
    VV_Name: "",
    VV_NIC_Passport_NO: "",
    VV_Visiting_places: "",
    VV_Visitor_Type: "",
    VV_Phone: "",
    VV_Email: "",
    VV_Company: "",
    VA_Password: "",
    VV_Vehicle_Type: "",
    VV_Vehicle_Number: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const loadContactPersonId = () => {
      try {
        // Dispatch Redux action to fetch all contact persons (only once)
        dispatch(GetAllContactPersons());
        dispatch(GetAllBlacklist());
      } catch (err) {
        console.error("Error loading contact persons:", err);
      }
    };

    if (userEmail && !cpId) {
      loadContactPersonId();
    }
  }, [userEmail, dispatch]);

  // Separate effect to handle matching contact person once data is loaded
  useEffect(() => {
    if (contactPersons && contactPersons.length > 0 && userEmail && !cpId) {
      const allContactPersons = contactPersons || [];
      console.log("All Contact Persons:", allContactPersons);
      console.log("Logged user email:", userEmail);

      const match = allContactPersons.find(
        (cp) =>
          cp?.VCP_Email?.trim().toLowerCase() ===
          userEmail?.trim().toLowerCase(),
      );

      if (match) {
        console.log("Matched Contact Person:", match);
        setCpId(match.VCP_Contact_person_id);
      } else {
        console.error("No contact person found for:", userEmail);
        setCpId(null);
      }
    }
  }, [contactPersons, userEmail]);

  useEffect(() => {
    if (cpId) {
      dispatch(GetVisitorsByCP(cpId));
    }
  }, [dispatch, cpId]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled client-side due to missing string-based search endpoint for CP
  };

  const handleToggleStatus = (visitor) => {
    const statusValue = (visitor.VV_Status || "")
      .toString()
      .trim()
      .toUpperCase();
    const isActive = statusValue === "ACTIVE" || statusValue === "A";

    const newStatus = isActive ? "I" : "A";
    dispatch(ToggleVisitorStatus(visitor.VV_Visitor_id, newStatus));
    // Since ToggleVisitorStatus might reload GetAllVisitors in action, force CP sync after timeout
    setTimeout(() => {
      dispatch(GetVisitorsByCP(cpId));
    }, 1600);
  };

  const openModal = () => {
    console.log("Opening modal with cpId:", cpId);

    setFormData({
      VV_Contact_person_id: cpId,
      VV_Name: "",
      VV_NIC_Passport_NO: "",
      VV_Visiting_places: "",
      VV_Visitor_Type: "",
      VV_Phone: "",
      VV_Email: "",
      VV_Company: "",
      VA_Password: "",
      VV_Vehicle_Type: "",
      VV_Vehicle_Number: "",
    });
    setIsModalOpen(true);
    setShowPassword(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setErrors({});
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;

    // Real-time filtering and length enforcement
    if (name === "VV_Name") {
      value = value.replace(/[^A-Za-z\s]/g, "");
    } else if (name === "VV_NIC_Passport_NO") {
      value = value.replace(/[^0-9]/g, "").slice(0, 12);
    } else if (name === "VV_Phone") {
      value = value.replace(/[^0-9]/g, "").slice(0, 10);
    } else if (name === "VA_Password") {
      value = value.slice(0, 5);
    }

    setFormData({ ...formData, [name]: value });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const nameErr = validateName(formData.VV_Name);
    if (nameErr) newErrors.VV_Name = nameErr;

    const nicErr = validateNIC(formData.VV_NIC_Passport_NO);
    if (nicErr) newErrors.VV_NIC_Passport_NO = nicErr;

    const emailErr = validateEmail(formData.VV_Email);
    if (emailErr) newErrors.VV_Email = emailErr;

    const phoneErr = validatePhone(formData.VV_Phone);
    if (phoneErr) newErrors.VV_Phone = phoneErr;

    const passErr = validatePassword(formData.VA_Password);
    if (passErr) newErrors.VA_Password = passErr;

    // Organization validation
    if (!formData.VV_Company?.trim()) {
      newErrors.VV_Company = "Organization name is required";
    }

    // Purpose of Visit validation
    if (!formData.VV_Visitor_Type?.trim()) {
      newErrors.VV_Visitor_Type = "Purpose of visit is required";
    }

    // Where to Visit validation
    if (!formData.VV_Visiting_places?.trim()) {
      newErrors.VV_Visiting_places = "Visiting area is required";
    }

    // Blacklist validation
    const isBlacklisted = blacklists.some(
      (b) =>
        (b.VB_Email && b.VB_Email.toLowerCase() === formData.VV_Email?.toLowerCase() && b.VB_Status === "A") ||
        (b.VB_Name && b.VB_Name.toLowerCase() === formData.VV_Name?.toLowerCase() && b.VB_Status === "A")
    );

    if (isBlacklisted) {
      newErrors.VV_Name = "⚠️ This person is in the restricted list. Please contact the system administrator.";
      newErrors.VV_Email = "⚠️ This person is in the restricted list. Please contact the system administrator.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    try {
      console.log("Logged user:", user);
      console.log("cpId being used:", cpId);

      if (!cpId) {
        console.error("Visitor creation blocked: cpId is missing.");
        alert(
          "Contact Person ID not found for the logged user. Please make sure this logged user exists in the ContactPerson table with the same email.",
        );
        return;
      }

      const adminPayload = {
        VA_Name: formData.VV_Name?.trim(),
        VA_Role: "Visitor",
        VA_Email: formData.VV_Email?.trim(),
        VA_Password: formData.VA_Password,
      };

      const visitorPayload = {
        VV_Contact_person_id: cpId,
        VV_Name: formData.VV_Name?.trim(),
        VV_NIC_Passport_NO: formData.VV_NIC_Passport_NO?.trim(),
        VV_Visiting_places: formData.VV_Visiting_places?.trim(),
        VV_Visitor_Type: formData.VV_Visitor_Type?.trim(),
        VV_Phone: formData.VV_Phone?.trim(),
        VV_Email: formData.VV_Email?.trim(),
        VV_Company: formData.VV_Company?.trim(),
      };

      console.log("AddAdministrator payload:", adminPayload);
      const adminResponse = await dispatch(AddAdministrator(adminPayload));
      console.log("AddAdministrator response:", adminResponse);

      console.log("AddVisitor payload:", visitorPayload);
      const visitorResponse = await dispatch(AddVisitor(visitorPayload));
      console.log("AddVisitor response:", visitorResponse);

      closeModal();

      setTimeout(() => {
        dispatch(GetVisitorsByCP(cpId));
      }, 1600);
    } catch (err) {
      console.error("Visitor creation failed - full error:", err);
      console.error("Visitor creation failed - response:", err?.response);
      console.error(
        "Visitor creation failed - response data:",
        err?.response?.data,
      );
      console.error("Visitor creation failed - message:", err?.message);
    }
  };

  // Client-side filtering based on search ID/Name
  const filteredVisitors = visitorsByCP
    ? visitorsByCP
        .filter(
          (visitor) =>
            visitor.VV_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(visitor.VV_Visitor_id).includes(searchTerm),
        )
        .sort((a, b) => Number(b.VV_Visitor_id) - Number(a.VV_Visitor_id))
    : [];

  return (
    <div
      className="flex overflow-hidden h-screen w-full transition-colors duration-500 contact-theme-root bg-background-default text-text-primary"
    >

      <div
        className="flex-1 flex flex-col min-w-0 overflow-y-auto relative bg-background-default"
      >
        <Header title="Authorized Visitors" />

        <div className="p-4 md:p-8 animate-fade-in-slow relative max-w-none mx-auto w-full z-10">
          <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
              <div
                className="flex items-center transition-colors border rounded-lg px-2.5 h-9 min-w-[180px] w-full sm:w-[220px] md:w-[250px] shadow-sm group bg-background-paper border-border-soft focus-within:border-primary"
              >
                <Search
                  size={14}
                  className="mr-3 text-text-dim group-focus-within:text-primary"
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search visitor..."
                  className="bg-transparent text-[12px] font-normal tracking-wide focus:outline-none w-full text-text-primary placeholder:text-text-dim"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="text-text-dim hover:text-primary"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <button
                onClick={openModal}
                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 h-9 rounded-lg text-[12px] font-normal uppercase tracking-widest transition-all shadow-lg active:scale-95 group"
              >
                <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                New Pre-Approval
              </button>
            </div>
          </div>

          <div
            className="border rounded-[32px] overflow-hidden relative z-10 bg-background-paper border-border-soft shadow-xl shadow-black/5"
          >
            {isLoading ? (
              <div className="p-8 md:p-20 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 border-4 border-border-soft border-t-primary rounded-full animate-spin mb-6"></div>
                <p className="text-text-secondary text-[12px] uppercase tracking-[0.3em] font-normal">
                  Hang tight, we’re loading visitor records.
                </p>
              </div>
            ) : error ? (
              <div className="p-8 md:p-20 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20 text-primary">
                  <AlertCircle size={24} />
                </div>
                <p className="text-primary text-[12px] uppercase tracking-widest font-normal">
                  {error}
                </p>
              </div>
            ) : (
              isMobile ? (
                <div className="p-4 space-y-6">
                  {filteredVisitors && filteredVisitors.length > 0 ? (
                    filteredVisitors.map((visitor) => {
                      const isActive =
                        (visitor.VV_Status || "")
                          .toString()
                          .trim()
                          .toUpperCase() === "A" ||
                        (visitor.VV_Status || "")
                          .toString()
                          .trim()
                          .toUpperCase() === "ACTIVE";
                      return (
                        <div
                          key={visitor.VV_Visitor_id}
                          className="p-5 rounded-[28px] border transition-all bg-background-paper border-border-soft shadow-sm"
                        >
                          <div className="flex justify-between items-start mb-6">
                            <div>
                              <h4 className={`text-[12px] font-black uppercase tracking-tight ${isActive ? "text-text-primary" : "text-text-dim"}`}>
                                {visitor.VV_Name || "Unknown"}
                              </h4>
                              <p className="text-text-dim text-[12px] font-normal tracking-[0.2em] mt-1 uppercase opacity-70">
                                VISITOR-{visitor.VV_Visitor_id.toString().padStart(3, '0')}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-3">
                              <div
                                className={`svm-status-pill normal-case ${isActive ? "svm-status-pill--success" : "svm-status-pill--danger"}`}
                              >
                                {isActive ? "Active" : "Inactive"}
                              </div>
                              <button className="flex items-center gap-1.5 text-[12px] font-black uppercase tracking-widest text-text-secondary hover:text-primary transition-colors">
                                <Eye size={14} /> View History
                              </button>
                            </div>
                          </div>

                          <div className="space-y-4 mb-6 px-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-text-dim">
                                <Users size={14} className="text-primary/70" />
                                <span className="text-[12px] font-black uppercase tracking-[0.15em]">Company</span>
                              </div>
                              <span className="text-[12px] font-normal truncate max-w-[150px] text-right text-text-secondary">
                                {visitor.VV_Company || "-"}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-text-dim">
                                <MapPin size={14} className="text-primary/70" />
                                <span className="text-[12px] font-black uppercase tracking-[0.15em]">Areas</span>
                              </div>
                              <span className="text-[12px] font-normal truncate max-w-[150px] text-right text-text-secondary">
                                {visitor.VV_Visiting_places || "N/A"}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-text-dim">
                                <AlertCircle size={14} className="text-primary/70" />
                                <span className="text-[12px] font-black uppercase tracking-[0.15em]">NIC</span>
                              </div>
                              <span className="text-[12px] font-normal text-text-secondary">
                                {visitor.VV_NIC_Passport_NO || "-"}
                              </span>
                            </div>
                          </div>

                          <button
                            className="w-full py-1.5 rounded-2xl border transition-all flex items-center justify-center gap-2 text-[12px] font-black uppercase tracking-[0.2em] shadow-sm active:scale-[0.98] bg-background-alt border-border-soft text-text-secondary hover:bg-background-elevated"
                          >
                            <Eye size={15} /> Details
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-20 text-center opacity-40">
                      <Users size={40} className="mx-auto mb-3" />
                      <p className="text-[12px] font-normal uppercase tracking-widest">No Visitors Detected</p>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="custom-scrollbar relative z-10 overflow-x-auto overflow-y-auto"
                  style={{ height: "calc(100vh - 160px)" }}
                >
                <table className="w-full min-w-[720px] md:min-w-[900px] border-collapse">
                  <thead className="sticky top-0 z-20 font-normal text-[12px]">
                    <tr
                      className="border-b bg-background-alt border-border-soft"
                    >
                      <th
                        className="px-3 py-1.5 text-center font-normal tracking-[0.3em] text-[12px] text-primary"
                      >
                        Id
                      </th>
                      <th
                        className="px-3 py-1.5 text-left font-normal tracking-[0.3em] text-[12px] text-text-secondary"
                      >
                        Visitor
                      </th>
                      <th
                        className="px-3 py-1.5 text-left font-normal tracking-[0.3em] text-[12px] text-text-secondary"
                      >
                        Credentials
                      </th>
                      <th
                        className="px-3 py-1.5 text-left font-normal tracking-[0.3em] text-[12px] text-text-secondary"
                      >
                        Company
                      </th>
                      <th
                        className="px-3 py-1.5 text-left font-normal tracking-[0.3em] text-[12px] min-w-[250px] text-text-secondary"
                      >
                        Visiting area
                      </th>
                      <th
                        className="px-3 py-1 text-center font-normal tracking-[0.3em] text-[12px] text-text-secondary"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-soft">
                    {filteredVisitors && filteredVisitors.length > 0 ? (
                      filteredVisitors.map((visitor) => {
                        const isActive =
                          (visitor.VV_Status || "")
                            .toString()
                            .trim()
                            .toUpperCase() === "A" ||
                          (visitor.VV_Status || "")
                            .toString()
                            .trim()
                            .toUpperCase() === "ACTIVE";
                        return (
                          <tr
                            key={visitor.VV_Visitor_id}
                            className="group border-b transition-all duration-300 relative overflow-hidden hover:bg-background-elevated border-border-soft"
                          >
                            <td className="px-3 py-1 text-center text-primary text-[12px] tracking-wide font-normal">
                              #{visitor.VV_Visitor_id}
                            </td>
                            <td className="px-3 py-1 text-left font-normal text-[12px]">
                              <span
                                className={`font-normal text-[12px] tracking-wide ${isActive ? "text-text-primary" : "text-text-dim line-through"}`}
                              >
                                {visitor.VV_Name || "-"}
                              </span>
                            </td>
                            <td className="px-3 py-1 text-left font-normal text-[12px]">
                              <span
                                className={`text-[12px] font-normal ${isActive ? "text-text-secondary" : "text-text-dim"}`}
                              >
                                {visitor.VV_NIC_Passport_NO || "-"}
                              </span>
                            </td>
                            <td className="px-3 py-1 text-left font-normal text-[12px]">
                              <span
                                title={
                                  visitor.VV_Company || "No company specified"
                                }
                                className={`text-[12px] font-normal ${isActive ? "text-text-secondary" : "text-text-dim"}`}
                              >
                                {visitor.VV_Company || "-"}
                              </span>
                            </td>
                            <td className="px-3 py-1 text-left font-normal text-[12px] min-w-[250px]">
                              <span
                                title={
                                  visitor.VV_Visiting_places ||
                                  "No visiting area specified"
                                }
                                className={`text-[12px] font-normal ${isActive ? "text-text-secondary" : "text-text-dim"}`}
                              >
                                {visitor.VV_Visiting_places || "-"}
                              </span>
                            </td>
                            <td className="px-3 py-1 text-center font-normal text-[10px]">
                              <div className="flex items-center justify-center">
                                <button
                                  onClick={() => handleToggleStatus(visitor)}
                                  disabled={isLoading}
                                  title="Click to toggle status"
                                  className={`svm-status-pill normal-case transition-colors cursor-pointer ${
                                    isActive
                                      ? "svm-status-pill--success hover:bg-green-500/20"
                                      : "svm-status-pill--danger hover:bg-primary/20"
                                  }`}
                                >
                                  {isActive ? "Active" : "Inactive"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-[12px] font-normal px-2.5 py-12 text-center tracking-[0.24em] text-text-dim"
                        >
                          No visitors detected matching criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )
          )}
          </div>
        </div>

        {/* Modal for Add Visitor */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
            <div className="bg-[var(--color-bg-paper)] border border-white/10 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden relative my-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>

              <div className="flex justify-between items-center p-4 md:p-5 border-b border-white/5 relative z-10 bg-black/20">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-3">
                  <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                  <h2 className="text-[12px] md:text-[12px] font-normal text-white tracking-[0.16em]">
                    Pre-approve visitor
                  </h2>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={handleFormSubmit}
                className="p-4 md:p-5 space-y-5 relative z-10 max-h-[80vh] overflow-y-auto custom-scrollbar"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[12px] text-gray-400 tracking-[0.14em] font-normal flex flex-col md:flex-row items-center gap-2 md:gap-2 px-1">
                      <User size={11} className="text-primary/60" /> Full name
                    </label>
                    <input
                      type="text"
                      name="VV_Name"
                      value={formData.VV_Name}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg px-3.5 py-2.5 text-[12px] text-white focus:outline-none transition-colors placeholder-white/10 ${
                        errors.VV_Name
                          ? "bg-red-500/20 border border-red-500/50 focus:border-red-500/70"
                          : "bg-black/40 border border-white/10 focus:border-primary/50"
                      }`}
                      placeholder="e.g., John Smith"
                    />
                    {errors.VV_Name && (
                      <p className="text-[12px] text-red-400 font-normal mt-1">
                        {errors.VV_Name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[12px] text-gray-400 tracking-[0.14em] font-normal flex flex-col md:flex-row items-center gap-2 md:gap-2 px-1">
                      <Hash size={11} className="text-primary/60" /> ID or
                      passport
                    </label>
                    <input
                      type="text"
                      name="VV_NIC_Passport_NO"
                      value={formData.VV_NIC_Passport_NO}
                      onChange={handleInputChange}
                      maxLength={12}
                      className={`w-full rounded-lg px-3.5 py-2.5 text-[12px] text-white focus:outline-none transition-colors placeholder-white/10 ${
                        errors.VV_NIC_Passport_NO
                          ? "bg-red-500/20 border border-red-500/50 focus:border-red-500/70"
                          : "bg-black/40 border border-white/10 focus:border-primary/50"
                      }`}
                      placeholder="e.g., 123456789"
                    />
                    {errors.VV_NIC_Passport_NO && (
                      <p className="text-[12px] text-red-400 font-normal mt-1">
                        {errors.VV_NIC_Passport_NO}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[12px] text-gray-400 tracking-[0.14em] font-normal flex flex-col md:flex-row items-center gap-2 md:gap-2 px-1">
                      <Mail size={11} className="text-primary/60" /> Email
                      address
                    </label>
                    <input
                      type="email"
                      name="VV_Email"
                      value={formData.VV_Email}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg px-3.5 py-2.5 text-[12px] text-white focus:outline-none transition-colors placeholder-white/10 ${
                        errors.VV_Email
                          ? "bg-red-500/20 border border-red-500/50 focus:border-red-500/70"
                          : "bg-black/40 border border-white/10 focus:border-primary/50"
                      }`}
                      placeholder="john@example.com"
                    />
                    {errors.VV_Email && (
                      <p className="text-[12px] text-red-400 font-normal mt-1">
                        {errors.VV_Email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[12px] text-gray-400 tracking-[0.14em] font-normal flex flex-col md:flex-row items-center gap-2 md:gap-2 px-1">
                      <Phone size={11} className="text-primary/60" /> Phone
                      number
                    </label>
                    <input
                      type="text"
                      name="VV_Phone"
                      value={formData.VV_Phone}
                      onChange={handleInputChange}
                      maxLength={10}
                      className={`w-full rounded-lg px-3.5 py-2.5 text-[12px] text-white focus:outline-none transition-colors placeholder-white/10 ${
                        errors.VV_Phone
                          ? "bg-red-500/20 border border-red-500/50 focus:border-red-500/70"
                          : "bg-black/40 border border-white/10 focus:border-primary/50"
                      }`}
                      placeholder="1234567890"
                    />
                    {errors.VV_Phone && (
                      <p className="text-[12px] text-red-400 font-normal mt-1">
                        {errors.VV_Phone}
                      </p>
                    )}
                    {!errors.VV_Phone && (
                      <p className="text-[12px] text-white/40 tracking-[0.12em] px-1 mt-1">
                        Enter 10 digits (Numbers only)
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[12px] text-gray-400 tracking-[0.14em] font-normal flex flex-col md:flex-row items-center gap-2 md:gap-2 px-1">
                      <Building size={11} className="text-primary/60" />{" "}
                      Organization
                    </label>
                    <input
                      type="text"
                      name="VV_Company"
                      value={formData.VV_Company}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg px-3.5 py-2.5 text-[12px] text-white focus:outline-none transition-colors placeholder-white/10 ${
                        errors.VV_Company
                          ? "bg-red-500/20 border border-red-500/50 focus:border-red-500/70"
                          : "bg-black/40 border border-white/10 focus:border-primary/50"
                      }`}
                      placeholder="e.g., Acme Corporation"
                    />
                    {errors.VV_Company && (
                      <p className="text-[12px] text-red-400 font-normal mt-1">
                        {errors.VV_Company}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[12px] text-gray-400 tracking-[0.14em] font-normal flex flex-col md:flex-row items-center gap-2 md:gap-2 px-1">
                      <Briefcase size={11} className="text-primary/60" />{" "}
                      What is the reason?
                    </label>
                    <input
                      type="text"
                      name="VV_Visitor_Type"
                      value={formData.VV_Visitor_Type}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg px-3.5 py-2.5 text-[12px] text-white focus:outline-none transition-colors placeholder-white/10 ${
                        errors.VV_Visitor_Type
                          ? "bg-red-500/20 border border-red-500/50 focus:border-red-500/70"
                          : "bg-black/40 border border-white/10 focus:border-primary/50"
                      }`}
                      placeholder="e.g., Meeting, Delivery, Interview"
                    />
                    {errors.VV_Visitor_Type && (
                      <p className="text-[12px] text-red-400 font-normal mt-1">
                        {errors.VV_Visitor_Type}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[12px] text-gray-400 tracking-[0.14em] font-normal flex flex-col md:flex-row items-center gap-2 md:gap-2 px-1">
                      <MapPin size={11} className="text-primary/60" /> Where to
                      visit
                    </label>
                    <input
                      type="text"
                      name="VV_Visiting_places"
                      value={formData.VV_Visiting_places}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg px-3.5 py-2.5 text-[12px] text-white focus:outline-none transition-colors placeholder-white/10 ${
                        errors.VV_Visiting_places
                          ? "bg-red-500/20 border border-red-500/50 focus:border-red-500/70"
                          : "bg-black/40 border border-white/10 focus:border-primary/50"
                      }`}
                      placeholder="e.g., Building A, Floor 3, Room 301"
                    />
                    {errors.VV_Visiting_places && (
                      <p className="text-[12px] text-red-400 font-normal mt-1">
                        {errors.VV_Visiting_places}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[12px] text-primary tracking-[0.14em] font-normal flex flex-col md:flex-row items-center gap-2 md:gap-2 px-1">
                      <AlertCircle size={11} className="text-primary/60" />{" "}
                      Create password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="VA_Password"
                        value={formData.VA_Password}
                        onChange={handleInputChange}
                        maxLength={5}
                        className={`w-full rounded-lg pl-3.5 pr-10 py-2.5 text-[12px] text-white focus:outline-none transition-colors placeholder-white/10 ${
                          errors.VA_Password
                            ? "bg-red-500/20 border border-red-500/50 focus:border-red-500/70"
                            : "bg-black/60 border border-primary/20 focus:border-primary/50"
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.VA_Password ? (
                      <p className="text-[12px] text-red-400 font-normal mt-1">
                        {errors.VA_Password}
                      </p>
                    ) : (
                      <p className="text-[12px] text-white/35 tracking-[0.12em] px-1 mt-1">
                        Max 5 chars, Capital &amp; Special Char
                      </p>
                    )}
                  </div>
                </div>

                {/* NEW: Vehicle Section */}
                {/* <div className="pt-4 border-t border-white/5 space-y-3">
                  <div className="flex flex-col md:flex-row items-center gap-3 md:gap-3">
                    <Car size={13} className="text-primary" />
                    <h3 className="text-[12px] font-normal text-white uppercase tracking-[0.16em] mb-0">
                      Vehicle Logistics
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[12px] text-gray-400 uppercase tracking-[0.14em] font-normal px-1">
                        Vehicle Type
                      </label>
                      <input
                        type="text"
                        name="VV_Vehicle_Type"
                        value={formData.VV_Vehicle_Type}
                        onChange={handleInputChange}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3.5 py-2.5 text-[12px] text-white focus:outline-none focus:border-primary/50"
                        placeholder="Car, van, bike"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] text-gray-400 uppercase tracking-[0.14em] font-normal px-1">
                        Plate Number
                      </label>
                      <input
                        type="text"
                        name="VV_Vehicle_Number"
                        value={formData.VV_Vehicle_Number}
                        onChange={handleInputChange}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3.5 py-2.5 text-[12px] text-white focus:outline-none focus:border-primary/50"
                        placeholder="Enter plate number"
                      />
                    </div>
                  </div>
                </div> */}

                <div className="pt-5 flex justify-end gap-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2.5 rounded-lg text-[12px] font-normal text-gray-400 hover:bg-white/5 tracking-[0.14em] transition-all"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-7 py-2.5 rounded-lg bg-primary hover:bg-[var(--color-primary-hover)] text-white text-[12px] font-normal tracking-[0.16em] shadow-lg shadow-primary/20 transition-all focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
                  >
                    Send pre-approval
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactAllVisitors;
