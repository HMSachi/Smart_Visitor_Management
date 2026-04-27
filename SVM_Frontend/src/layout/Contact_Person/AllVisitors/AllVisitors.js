import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useThemeMode } from "../../../theme/ThemeModeContext";
import {
  GetVisitorsByCP,
  ToggleVisitorStatus,
  AddVisitor,
} from "../../../actions/VisitorAction";
import { AddAdministrator } from "../../../actions/AdministratorAction";
import Header from "../../../components/Contact_Person/Layout/Header";
import Sidebar from "../../../components/Contact_Person/Layout/Sidebar";
import ContactPersonService from "../../../services/ContactPersonService";
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
} from "lucide-react";

const ContactAllVisitors = () => {
  const dispatch = useDispatch();
  const { visitorsByCP, isLoading, error } = useSelector(
    (state) => state.visitorManagement,
  );
  const { themeMode } = useThemeMode();
  const isLight = themeMode === "light";

  // Try to safely extract CP ID from logged in user, fallback to 2 per your specification if undefined
  const user = useSelector((state) => state.login.user);
  const [cpId, setCpId] = useState(null);

  const userEmail = user?.ResultSet?.[0]?.VA_Email;

  const [searchTerm, setSearchTerm] = useState("");

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

  useEffect(() => {
    const loadContactPersonId = async () => {
      try {
        const response = await ContactPersonService.GetAllContactPersons();

        const contactPersons = response?.data?.ResultSet || [];
        console.log("All Contact Persons:", contactPersons);
        console.log("Logged user email:", userEmail);

        const match = contactPersons.find(
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
      } catch (err) {
        console.error("Error loading contact person:", err);
        setCpId(null);
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
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setErrors({});
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Full Name validation
    if (!formData.VV_Name?.trim()) {
      newErrors.VV_Name = "Full name is required";
    } else if (formData.VV_Name.trim().length < 2) {
      newErrors.VV_Name = "Name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.VV_Name)) {
      newErrors.VV_Name =
        "Name can only contain letters, spaces, hyphens, and apostrophes";
    }

    // NIC/Passport validation
    if (!formData.VV_NIC_Passport_NO?.trim()) {
      newErrors.VV_NIC_Passport_NO = "ID or Passport number is required";
    } else if (formData.VV_NIC_Passport_NO.trim().length < 5) {
      newErrors.VV_NIC_Passport_NO =
        "ID/Passport must be at least 5 characters";
    }

    // Email validation
    if (!formData.VV_Email?.trim()) {
      newErrors.VV_Email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.VV_Email)) {
      newErrors.VV_Email = "Please enter a valid email address";
    }

    // Phone validation
    if (!formData.VV_Phone?.trim()) {
      newErrors.VV_Phone = "Phone number is required";
    } else {
      const digitsOnly = formData.VV_Phone.replace(/\D/g, "");
      if (digitsOnly.length !== 10) {
        newErrors.VV_Phone = "Phone number must contain exactly 10 digits";
      }
    }

    // Organization validation
    if (!formData.VV_Company?.trim()) {
      newErrors.VV_Company = "Organization name is required";
    } else if (formData.VV_Company.trim().length < 2) {
      newErrors.VV_Company = "Organization must be at least 2 characters";
    }

    // Purpose of Visit validation
    if (!formData.VV_Visitor_Type?.trim()) {
      newErrors.VV_Visitor_Type = "Purpose of visit is required";
    } else if (formData.VV_Visitor_Type.trim().length < 2) {
      newErrors.VV_Visitor_Type = "Purpose must be at least 2 characters";
    }

    // Where to Visit validation
    if (!formData.VV_Visiting_places?.trim()) {
      newErrors.VV_Visiting_places = "Visiting area is required";
    } else if (formData.VV_Visiting_places.trim().length < 2) {
      newErrors.VV_Visiting_places =
        "Visiting area must be at least 2 characters";
    }

    // Password validation
    if (!formData.VA_Password?.trim()) {
      newErrors.VA_Password = "Password is required";
    } else if (formData.VA_Password.length < 6) {
      newErrors.VA_Password = "Password must be at least 6 characters";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(formData.VA_Password)
    ) {
      newErrors.VA_Password =
        "Password must contain uppercase, lowercase, and numbers";
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
      className={`flex overflow-hidden h-screen w-full transition-colors duration-500 ${isLight ? "bg-[#F8F9FA] text-[#1A1A1A]" : "bg-[var(--color-bg-default)] text-white"}`}
    >
      <Sidebar />

      <div
        className={`flex-1 flex flex-col min-w-0 overflow-y-auto relative ${isLight ? "bg-[#F8F9FA]" : "bg-[var(--color-bg-default)]"}`}
      >
        <Header />

        <div className="p-4 md:p-8 animate-fade-in-slow relative max-w-[1600px] mx-auto w-full z-10">
          <header
            className={`mb-6 flex flex-col md:flex-row justify-between items-start md:items-end border-b pb-4 gap-4 relative z-10 ${isLight ? "border-gray-100" : "border-white/[0.03]"}`}
          >
            <div>
              <h2
                className={`text-[15px] md:text-base font-bold tracking-[0.12em] uppercase ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
              >
                All Authorized Visitors
              </h2>
              <p
                className={`text-[10px] md:text-[11px] font-bold uppercase tracking-[0.18em] mt-1 opacity-90 ${isLight ? "text-gray-500" : "text-white/50"}`}
              >
                Manage personal visitor registry
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
              <div
                className={`flex items-center transition-colors border rounded-lg px-2.5 py-1.5 min-w-[180px] max-w-[220px] shadow-sm ${isLight ? "bg-white border-gray-200" : "bg-black/40 border-white/10 focus-within:border-primary"}`}
              >
                <Search
                  size={12}
                  className={`mr-3 ${isLight ? "text-gray-400" : "text-white/20"}`}
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="SEARCH VISITOR..."
                  className={`bg-transparent text-[5px] font-medium tracking-[0.16em] uppercase focus:outline-none w-full ${isLight ? "text-[#1A1A1A] placeholder-gray-400" : "text-white placeholder:text-white/20"}`}
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="text-gray-400 hover:text-primary"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <button
                onClick={openModal}
                className="flex flex-col md:flex-row items-center gap-3 md:gap-2 bg-primary hover:bg-[var(--color-primary-hover)] text-white px-4 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-[0.18em] transition-all shadow-lg hover:shadow-primary/20"
              >
                <Plus size={14} /> New Pre-Approval
              </button>
            </div>
          </header>

          <div
            className={`border rounded-[32px] overflow-hidden relative z-10 ${isLight ? "bg-white border-gray-200 shadow-xl shadow-gray-200/50" : "bg-[#0F0F10] border-white/5"}`}
          >
            {isLoading ? (
              <div className="p-8 md:p-20 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-6"></div>
                <p className="text-gray-500 text-[13px] uppercase tracking-[0.3em] font-medium">
                  Hang tight, we’re loading visitor records.
                </p>
              </div>
            ) : error ? (
              <div className="p-8 md:p-20 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20 text-primary">
                  <AlertCircle size={24} />
                </div>
                <p className="text-primary text-[14px] uppercase tracking-widest font-bold">
                  {error}
                </p>
              </div>
            ) : (
              <div
                className="custom-scrollbar relative z-10 overflow-auto"
                style={{ height: "38rem" }}
              >
                <table className="w-full min-w-[900px] border-collapse">
                  <thead className="sticky top-0 z-20">
                    <tr
                      className={`border-b ${isLight ? "bg-[#F8F9FA] border-gray-100" : "bg-black/95 border-b-white/5"}`}
                    >
                      <th
                        className={`px-4 py-3 text-center font-bold uppercase tracking-[0.18em] text-[11px] ${isLight ? "text-primary/60" : "text-primary"}`}
                      >
                        Visitor ID
                      </th>
                      <th
                        className={`px-4 py-3 text-left font-bold uppercase tracking-[0.18em] text-[11px] ${isLight ? "text-gray-400" : "text-white/40"}`}
                      >
                        Visitor Name
                      </th>
                      <th
                        className={`px-4 py-3 text-left font-bold uppercase tracking-[0.18em] text-[11px] ${isLight ? "text-gray-400" : "text-white/40"}`}
                      >
                        NIC / Passport
                      </th>
                      <th
                        className={`px-4 py-3 text-left font-bold uppercase tracking-[0.18em] text-[11px] ${isLight ? "text-gray-400" : "text-white/40"}`}
                      >
                        Company Name
                      </th>
                      <th
                        className={`px-4 py-3 text-left font-bold uppercase tracking-[0.18em] text-[11px] ${isLight ? "text-gray-400" : "text-white/40"}`}
                      >
                        Visiting Area
                      </th>
                      <th
                        className={`px-4 py-3 text-center font-bold uppercase tracking-[0.18em] text-[11px] ${isLight ? "text-gray-400" : "text-white/40"}`}
                      >
                        Account Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
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
                            className={`group border-b transition-all duration-300 relative overflow-hidden ${isLight ? "hover:bg-[#F8F9FA] border-gray-50" : "hover:bg-white/[0.02] border-white/5"}`}
                          >
                            <td className="px-4 py-4 text-center text-primary text-[11px] tracking-[0.14em] font-medium">
                              #{visitor.VV_Visitor_id}
                            </td>
                            <td className="px-4 py-4 text-left">
                              <span
                                className={`font-medium text-[12px] uppercase tracking-[0.14em] ${isActive ? (isLight ? "text-[#1A1A1A]" : "text-white") : "text-gray-400 line-through"}`}
                              >
                                {visitor.VV_Name || "-"}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-left">
                              <span
                                className={`text-[12px] font-medium ${isActive ? (isLight ? "text-gray-500" : "text-white/70") : "text-gray-400"}`}
                              >
                                {visitor.VV_NIC_Passport_NO || "-"}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-left">
                              <span
                                title={visitor.VV_Company || "No company specified"}
                                className={`text-[12px] font-medium ${isActive ? (isLight ? "text-gray-500" : "text-white/70") : "text-gray-400"}`}
                              >
                                {visitor.VV_Company || "-"}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-left">
                              <span
                                title={visitor.VV_Visiting_places || "No visiting area specified"}
                                className={`text-[12px] font-medium ${isActive ? (isLight ? "text-gray-500" : "text-white/70") : "text-gray-400"}`}
                              >
                                {visitor.VV_Visiting_places || "-"}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <div className="flex items-center justify-center">
                                <button
                                  onClick={() => handleToggleStatus(visitor)}
                                  disabled={isLoading}
                                  title="Click to toggle status"
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-[0.1em] uppercase flex items-center justify-center w-max shadow-sm border transition-all cursor-pointer ${
                                    isActive
                                      ? "bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20"
                                      : "bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
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
                          className={`px-4 py-12 text-center uppercase tracking-[0.24em] text-[9px] font-medium ${isLight ? "text-gray-400" : "text-white/40"}`}
                        >
                          No Visitors detected matching criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal for Add Visitor */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
            <div className="bg-[var(--color-bg-paper)] border border-white/10 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden relative my-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>

              <div className="flex justify-between items-center p-4 md:p-5 border-b border-white/5 relative z-10 bg-black/20">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-3">
                  <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                  <h2 className="text-base md:text-lg font-bold text-white uppercase tracking-[0.16em]">
                    Pre-Approve Visitor
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
                    <label className="text-[10px] text-gray-400 uppercase tracking-[0.14em] font-semibold flex flex-col md:flex-row items-center gap-2 md:gap-2 px-1">
                      <User size={11} className="text-primary/60" /> Full Name
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
                      <p className="text-[10px] text-red-400 font-semibold mt-1">
                        {errors.VV_Name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 uppercase tracking-[0.14em] font-semibold flex flex-col md:flex-row items-center gap-2 md:gap-2 px-1">
                      <Hash size={11} className="text-primary/60" /> ID or
                      Passport
                    </label>
                    <input
                      type="text"
                      name="VV_NIC_Passport_NO"
                      value={formData.VV_NIC_Passport_NO}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg px-3.5 py-2.5 text-[12px] text-white focus:outline-none transition-colors placeholder-white/10 ${
                        errors.VV_NIC_Passport_NO
                          ? "bg-red-500/20 border border-red-500/50 focus:border-red-500/70"
                          : "bg-black/40 border border-white/10 focus:border-primary/50"
                      }`}
                      placeholder="e.g., 123456789"
                    />
                    {errors.VV_NIC_Passport_NO && (
                      <p className="text-[10px] text-red-400 font-semibold mt-1">
                        {errors.VV_NIC_Passport_NO}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 uppercase tracking-[0.14em] font-semibold flex flex-col md:flex-row items-center gap-2 md:gap-2 px-1">
                      <Mail size={11} className="text-primary/60" /> Email
                      Address
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
                      <p className="text-[10px] text-red-400 font-semibold mt-1">
                        {errors.VV_Email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 uppercase tracking-[0.14em] font-semibold flex flex-col md:flex-row items-center gap-2 md:gap-2 px-1">
                      <Phone size={11} className="text-primary/60" /> Phone
                      Number
                    </label>
                    <input
                      type="text"
                      name="VV_Phone"
                      value={formData.VV_Phone}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg px-3.5 py-2.5 text-[12px] text-white focus:outline-none transition-colors placeholder-white/10 ${
                        errors.VV_Phone
                          ? "bg-red-500/20 border border-red-500/50 focus:border-red-500/70"
                          : "bg-black/40 border border-white/10 focus:border-primary/50"
                      }`}
                      placeholder="1234567890"
                    />
                    {errors.VV_Phone && (
                      <p className="text-[10px] text-red-400 font-semibold mt-1">
                        {errors.VV_Phone}
                      </p>
                    )}
                    {!errors.VV_Phone && (
                      <p className="text-[9px] text-white/40 uppercase tracking-[0.12em] px-1 mt-1">
                        Enter 10 digits (with or without formatting)
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 uppercase tracking-[0.14em] font-semibold flex flex-col md:flex-row items-center gap-2 md:gap-2 px-1">
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
                      <p className="text-[10px] text-red-400 font-semibold mt-1">
                        {errors.VV_Company}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 uppercase tracking-[0.14em] font-semibold flex flex-col md:flex-row items-center gap-2 md:gap-2 px-1">
                      <Briefcase size={11} className="text-primary/60" />{" "}
                      Purpose of Visit
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
                      <p className="text-[10px] text-red-400 font-semibold mt-1">
                        {errors.VV_Visitor_Type}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 uppercase tracking-[0.14em] font-semibold flex flex-col md:flex-row items-center gap-2 md:gap-2 px-1">
                      <MapPin size={11} className="text-primary/60" /> Where to
                      Visit
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
                      <p className="text-[10px] text-red-400 font-semibold mt-1">
                        {errors.VV_Visiting_places}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-primary uppercase tracking-[0.14em] font-semibold flex flex-col md:flex-row items-center gap-2 md:gap-2 px-1">
                      <AlertCircle size={11} className="text-primary/60" />{" "}
                      Create Password
                    </label>
                    <input
                      type="password"
                      name="VA_Password"
                      value={formData.VA_Password}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg px-3.5 py-2.5 text-[12px] text-white focus:outline-none transition-colors placeholder-white/10 ${
                        errors.VA_Password
                          ? "bg-red-500/20 border border-red-500/50 focus:border-red-500/70"
                          : "bg-black/60 border border-primary/20 focus:border-primary/50"
                      }`}
                      placeholder="••••••••"
                    />
                    {errors.VA_Password ? (
                      <p className="text-[10px] text-red-400 font-semibold mt-1">
                        {errors.VA_Password}
                      </p>
                    ) : (
                      <p className="text-[9px] text-white/35 uppercase tracking-[0.12em] px-1 mt-1">
                        Min 6 chars, uppercase, lowercase &amp; numbers
                      </p>
                    )}
                  </div>
                </div>

                {/* NEW: Vehicle Section */}
                {/* <div className="pt-4 border-t border-white/5 space-y-3">
                  <div className="flex flex-col md:flex-row items-center gap-3 md:gap-3">
                    <Car size={13} className="text-primary" />
                    <h3 className="text-[11px] font-bold text-white uppercase tracking-[0.16em] mb-0">
                      Vehicle Logistics
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-400 uppercase tracking-[0.14em] font-semibold px-1">
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
                      <label className="text-[10px] text-gray-400 uppercase tracking-[0.14em] font-semibold px-1">
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
                    className="px-6 py-2.5 rounded-lg text-[12px] font-bold text-gray-400 hover:bg-white/5 uppercase tracking-[0.14em] transition-all"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-7 py-2.5 rounded-lg bg-primary hover:bg-[var(--color-primary-hover)] text-white text-[12px] font-bold uppercase tracking-[0.16em] shadow-lg shadow-primary/20 transition-all focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
                  >
                    Send Pre-Approval
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
