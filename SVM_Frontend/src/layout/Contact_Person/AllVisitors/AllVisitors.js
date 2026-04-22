import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useThemeMode } from "../../../theme/ThemeModeContext";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
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

  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

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
    ? visitorsByCP.filter(
        (visitor) =>
          visitor.VV_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(visitor.VV_Visitor_id).includes(searchTerm),
      )
    : [];

  return (
    <div className={`flex overflow-hidden h-screen w-full transition-colors duration-500 ${isLight ? "bg-[#F8F9FA] text-[#1A1A1A]" : "bg-[var(--color-bg-default)] text-white"}`}>
      <Sidebar />

      <div className={`flex-1 flex flex-col min-w-0 overflow-y-auto relative ${isLight ? "bg-[#F8F9FA]" : "bg-[var(--color-bg-default)]"}`}>
        <Header title="All Visitors" />

        <div className="p-4 md:p-8 animate-fade-in-slow relative max-w-[1600px] mx-auto w-full z-10">
          <header className={`mb-10 flex flex-col md:flex-row justify-between items-start md:items-end border-b pb-6 gap-6 relative z-10 ${isLight ? "border-gray-100" : "border-white/[0.03]"}`}>
            <div>
              <h2 className={`text-lg font-bold tracking-tight uppercase ${isLight ? "text-[#1A1A1A]" : "text-white"}`}>
                All Authorized Visitors
              </h2>
              <p className={`text-[11px] font-bold uppercase tracking-[0.2em] mt-1 opacity-90 ${isLight ? "text-gray-500" : "text-white/50"}`}>
                Manage personal visitor registry
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
              <div className={`flex items-center transition-colors border rounded-xl px-4 py-3 min-w-[250px] shadow-sm ${isLight ? "bg-white border-gray-200" : "bg-black/40 border-white/10 focus-within:border-primary"}`}>
                <Search size={16} className={`mr-3 ${isLight ? "text-gray-400" : "text-white/20"}`} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="SEARCH VISITOR..."
                  className={`bg-transparent text-[12px] font-bold tracking-widest uppercase focus:outline-none w-full ${isLight ? "text-[#1A1A1A] placeholder-gray-400" : "text-white placeholder:text-white/20"}`}
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
                className="flex flex-col md:flex-row items-center gap-4 md:gap-2 bg-primary hover:bg-[var(--color-primary-hover)] text-white px-6 py-3 rounded-xl text-[13px] font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-primary/20"
              >
                <Plus size={16} /> New Pre-Approval
              </button>
            </div>
          </header>

          <div className={`border rounded-[32px] overflow-hidden relative z-10 ${isLight ? "bg-white border-gray-200 shadow-xl shadow-gray-200/50" : "bg-[#0F0F10] border-white/5"}`}>

            {isLoading ? (
              <div className="p-8 md:p-20 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-6"></div>
                <p className="text-gray-500 text-[13px] uppercase tracking-[0.3em] font-medium">
                  Scanning Entries...
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
              <TableContainer
                component={Paper}
                className="!bg-transparent !border-none !rounded-none !shadow-none z-10 relative"
              >
                <Table sx={{ minWidth: 650 }} aria-label="visitors table">
                  <TableHead className={`${isLight ? "bg-[#F8F9FA]" : "bg-black/40"}`}>
                    <TableRow>
                      <TableCell className={`font-bold uppercase tracking-widest text-[11px] ${isLight ? "text-gray-500 border-b-gray-100" : "text-white/40 border-b-white/5"}`}>
                        ID
                      </TableCell>
                      <TableCell className={`font-bold uppercase tracking-widest text-[11px] ${isLight ? "text-gray-500 border-b-gray-100" : "text-white/40 border-b-white/5"}`}>
                        Visitor
                      </TableCell>
                      <TableCell className={`font-bold uppercase tracking-widest text-[11px] ${isLight ? "text-gray-500 border-b-gray-100" : "text-white/40 border-b-white/5"}`}>
                        Credentials
                      </TableCell>
                      <TableCell className={`font-bold uppercase tracking-widest text-[11px] ${isLight ? "text-gray-500 border-b-gray-100" : "text-white/40 border-b-white/5"}`}>
                        Company
                      </TableCell>
                      <TableCell className={`font-bold uppercase tracking-widest text-[11px] ${isLight ? "text-gray-500 border-b-gray-100" : "text-white/40 border-b-white/5"}`}>
                        Destination
                      </TableCell>
                      <TableCell className={`font-bold uppercase tracking-widest text-[11px] ${isLight ? "text-gray-500 border-b-gray-100" : "text-white/40 border-b-white/5"}`}>
                        Status
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
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
                          <TableRow
                            key={visitor.VV_Visitor_id}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                              "&:hover": {
                                backgroundColor: isLight ? "#F8F9FA" : "rgba(255,255,255,0.02)",
                              },
                            }}
                          >
                            <TableCell className={`font-bold ${isLight ? "text-gray-600 border-b-gray-50" : "text-white/70 border-b-white/5"}`}>
                              {visitor.VV_Visitor_id}
                            </TableCell>
                            <TableCell
                              className={`font-bold transition-colors ${isActive ? (isLight ? "text-[#1A1A1A]" : "text-white") : "text-gray-400 line-through"} ${isLight ? "border-b-gray-50" : "border-b-white/5"}`}
                            >
                              {visitor.VV_Name || "-"}
                            </TableCell>
                            <TableCell
                              className={`font-medium transition-colors ${isActive ? (isLight ? "text-gray-500" : "text-white/70") : "text-gray-400"} ${isLight ? "border-b-gray-50" : "border-b-white/5"}`}
                            >
                              {visitor.VV_NIC_Passport_NO || "-"}
                            </TableCell>
                            <TableCell
                              className={`font-medium transition-colors ${isActive ? (isLight ? "text-gray-500" : "text-white/70") : "text-gray-400"} ${isLight ? "border-b-gray-50" : "border-b-white/5"}`}
                            >
                              {visitor.VV_Company || "-"}
                            </TableCell>
                            <TableCell
                              className={`font-medium transition-colors ${isActive ? (isLight ? "text-gray-500" : "text-white/70") : "text-gray-400"} ${isLight ? "border-b-gray-50" : "border-b-white/5"}`}
                            >
                              {visitor.VV_Visiting_places || "-"}
                            </TableCell>
                            <TableCell className={`${isLight ? "border-b-gray-50" : "border-b-white/5"}`}>
                              <button
                                onClick={() => handleToggleStatus(visitor)}
                                disabled={isLoading}
                                title="Click to toggle status"
                                className={`px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer ${isActive ? "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200" : "bg-red-50 text-primary hover:bg-red-100 border border-red-200"}`}
                              >
                                {isActive ? "ACTIVE" : "INACTIVE"}
                              </button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          align="center"
                          className={`py-12 uppercase tracking-widest text-sm ${isLight ? "text-gray-400 border-b-gray-50" : "text-white/40 border-b-white/5"}`}
                        >
                          No Visitors detected matching criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
        </div>

        {/* Modal for Add Visitor */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
            <div className="bg-[var(--color-bg-paper)] border border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative my-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>

              <div className="flex justify-between items-center p-6 border-b border-white/5 relative z-10 bg-black/20">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-3">
                  <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                  <h2 className="text-lg font-bold text-white uppercase tracking-[0.2em]">
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
                className="p-8 space-y-6 relative z-10 max-h-[80vh] overflow-y-auto custom-scrollbar"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex flex-col md:flex-row items-center gap-4 md:gap-2 px-1">
                      <User size={12} className="text-primary/60" /> Full Name
                    </label>
                    <input
                      required
                      type="text"
                      name="VV_Name"
                      value={formData.VV_Name}
                      onChange={handleInputChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-[13px] text-white focus:outline-none focus:border-primary/50 transition-colors placeholder-white/5"
                      placeholder="JOHN SMITH"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex flex-col md:flex-row items-center gap-4 md:gap-2 px-1">
                      <Hash size={12} className="text-primary/60" /> NIC /
                      Passport NO
                    </label>
                    <input
                      required
                      type="text"
                      name="VV_NIC_Passport_NO"
                      value={formData.VV_NIC_Passport_NO}
                      onChange={handleInputChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-[13px] text-white focus:outline-none focus:border-primary/50 transition-colors placeholder-white/5"
                      placeholder="Enter identification"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex flex-col md:flex-row items-center gap-4 md:gap-2 px-1">
                      <Mail size={12} className="text-primary/60" /> Email
                      Address
                    </label>
                    <input
                      required
                      type="email"
                      name="VV_Email"
                      value={formData.VV_Email}
                      onChange={handleInputChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-[13px] text-white focus:outline-none focus:border-primary/50 transition-colors placeholder-white/5"
                      placeholder="EMAIL@EXAMPLE.COM"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex flex-col md:flex-row items-center gap-4 md:gap-2 px-1">
                      <Phone size={12} className="text-primary/60" /> Phone
                      Number
                    </label>
                    <input
                      required
                      type="text"
                      name="VV_Phone"
                      value={formData.VV_Phone}
                      onChange={handleInputChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-[13px] text-white focus:outline-none focus:border-primary/50 transition-colors placeholder-white/5"
                      placeholder="+94 7X XXX XXXX"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex flex-col md:flex-row items-center gap-4 md:gap-2 px-1">
                      <Building size={12} className="text-primary/60" />{" "}
                      Representing Company
                    </label>
                    <input
                      required
                      type="text"
                      name="VV_Company"
                      value={formData.VV_Company}
                      onChange={handleInputChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-[13px] text-white focus:outline-none focus:border-primary/50 transition-colors placeholder-white/5"
                      placeholder="COMPANY NAME"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex flex-col md:flex-row items-center gap-4 md:gap-2 px-1">
                      <Briefcase size={12} className="text-primary/60" />{" "}
                      Visitor Classification
                    </label>
                    <input
                      required
                      type="text"
                      name="VV_Visitor_Type"
                      value={formData.VV_Visitor_Type}
                      onChange={handleInputChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-[13px] text-white focus:outline-none focus:border-primary/50 transition-colors placeholder-white/5"
                      placeholder="E.G. CONTRACTOR, GUEST"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex flex-col md:flex-row items-center gap-4 md:gap-2 px-1">
                      <MapPin size={12} className="text-primary/60" /> Visiting
                      Area
                    </label>
                    <input
                      required
                      type="text"
                      name="VV_Visiting_places"
                      value={formData.VV_Visiting_places}
                      onChange={handleInputChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-[13px] text-white focus:outline-none focus:border-primary/50 transition-colors placeholder-white/5"
                      placeholder="E.G. PRODUCTION FLOOR"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] text-primary uppercase tracking-widest font-semibold flex flex-col md:flex-row items-center gap-4 md:gap-2 px-1">
                      <AlertCircle size={12} className="text-primary/60" />{" "}
                      Login Security Password
                    </label>
                    <input
                      required
                      type="password"
                      name="VA_Password"
                      value={formData.VA_Password}
                      onChange={handleInputChange}
                      className="w-full bg-black/60 border border-primary/20 rounded-xl px-4 py-3.5 text-[13px] text-white focus:outline-none focus:border-primary/50 transition-colors placeholder-white/10"
                      placeholder="••••••••"
                    />
                    <p className="text-[9px] text-white/30 uppercase tracking-widest px-1 mt-1">
                      Visitor will use this to log in
                    </p>
                  </div>
                </div>

                {/* NEW: Vehicle Section */}
                <div className="pt-6 border-t border-white/5 space-y-4">
                  <div className="flex flex-col md:flex-row items-center gap-4 md:gap-3">
                    <Car size={14} className="text-primary" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-0">
                      Vehicle Logistics
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold px-1">
                        Vehicle Type
                      </label>
                      <input
                        type="text"
                        name="VV_Vehicle_Type"
                        value={formData.VV_Vehicle_Type}
                        onChange={handleInputChange}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-[13px] text-white focus:outline-none focus:border-primary/50"
                        placeholder="E.G. CAR, VAN"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold px-1">
                        Plate Number
                      </label>
                      <input
                        type="text"
                        name="VV_Vehicle_Number"
                        value={formData.VV_Vehicle_Number}
                        onChange={handleInputChange}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-[13px] text-white focus:outline-none focus:border-primary/50"
                        placeholder="E.G. WP-CAD-1234"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-8 flex justify-end gap-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-8 py-3.5 rounded-xl text-[13px] font-bold text-gray-400 hover:bg-white/5 uppercase tracking-widest transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-10 py-3.5 rounded-xl bg-primary hover:bg-[var(--color-primary-hover)] text-white text-[13px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
                  >
                    Authorize Entry
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
