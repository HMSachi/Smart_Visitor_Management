import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  GetAllAdministrator,
  DeleteAdministrator,
  AddAdministrator,
  UpdateAdministrator,
} from "../../../actions/AdministratorAction";
import {
  GetAllContactPersons,
  UpdateContactPerson,
  UpdateContactPersonStatus,
  AddContactPerson,
} from "../../../actions/ContactPersonAction";
import Header from "../../../components/Admin/Layout/Header";
import { useThemeMode } from "../../../theme/ThemeModeContext";
import {
  Shield,
  Mail,
  Calendar,
  Hash,
  CheckCircle2,
  AlertCircle,
  Search,
  Plus,
  Edit,
  RefreshCw,
  X,
  User,
  Users,
  ShieldAlert,
  UserCheck,
  Phone,
} from "lucide-react";
import { 
  validateName, validateNIC, validatePhone, validateEmail, validatePassword 
} from "../../../utils/validation";

const StatusBadge = ({ status }) => {
  const s = (status || "").toString().trim().toUpperCase();
  if (s === "ACTIVE" || s === "A") {
    return (
      <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg text-[12px] font-medium tracking-[0.2em] uppercase flex flex-col md:flex-row items-center gap-4 md:gap-2 w-max">
        <CheckCircle2 size={12} /> Active
      </div>
    );
  }
  return (
    <div className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-lg text-[12px] font-medium tracking-[0.2em] uppercase flex flex-col md:flex-row items-center gap-4 md:gap-2 w-max">
      <AlertCircle size={12} /> Inactive
    </div>
  );
};

const AllUsers = () => {
  const dispatch = useDispatch();
  const {
    administrators,
    isLoading: adminLoading,
    error: adminError,
  } = useSelector((state) => state.administrator);
  const {
    contactPersons,
    loading: contactLoading,
    error: contactError,
  } = useSelector((state) => state.contactPerson);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [tableFilter, setTableFilter] = useState("ADMIN");
  const { themeMode } = useThemeMode();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    role: "",
    password: "",
    phone: "",
    department: "",
    type: "ADMIN", // Current being edited type
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(GetAllAdministrator());
    dispatch(GetAllContactPersons());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const normalizeStatus = (status) => {
    const value = (status || "").toString().trim().toUpperCase();
    return value === "ACTIVE" || value === "A" ? "ACTIVE" : "INACTIVE";
  };

  const matchesStatus = (item) => {
    if (statusFilter === "ALL") return true;
    const itemStatus = normalizeStatus(item.VA_Status || item.VCP_Status);
    return itemStatus === statusFilter;
  };

  const matchesSearch = (item) => {
    if (!searchTerm.trim()) return true;

    const query = searchTerm.trim().toLowerCase();
    const searchValues = [
      item.VA_Admin_id,
      item.VCP_Contact_person_id,
      item.VA_Name,
      item.VCP_Name,
      item.VA_Email,
      item.VCP_Email,
      item.VA_Role,
      item.VCP_Department,
      item.VCP_Phone,
      normalizeStatus(item.VA_Status || item.VCP_Status),
    ];

    return searchValues.some((value) =>
      (value || "").toString().toLowerCase().includes(query),
    );
  };

  const handleToggleStatus = (item, type) => {
    // Robust check for active status (case-insensitive and handles full words)
    const statusValue = (item.VA_Status || item.VCP_Status || "")
      .toString()
      .trim()
      .toUpperCase();
    const isActive = statusValue === "ACTIVE" || statusValue === "A";
    const newStatus = isActive ? "I" : "A";

    if (type === "CONTACT") {
      dispatch(
        UpdateContactPersonStatus(item.VCP_Contact_person_id, newStatus),
      );
      // Use the 2.5s delay to ensure DB consistency
      setTimeout(() => dispatch(GetAllContactPersons()), 2500);
    } else {
      // Use the robust DeleteAdministrator (which handles Activation via Update if newStatus is 'A')
      dispatch(DeleteAdministrator(item, newStatus));
      // Use the 2.5s delay to ensure DB consistency
      setTimeout(() => dispatch(GetAllAdministrator()), 2500);
    }
  };

  const openModal = (mode, item = null, type = "ADMIN") => {
    setModalMode(mode);
    if (item) {
      if (type === "CONTACT") {
        setFormData({
          id: item.VCP_Contact_person_id || "",
          name: item.VCP_Name || "",
          email: item.VCP_Email || "",
          role: "CONTACT",
          password: "",
          phone: item.VCP_Phone || "",
          department: item.VCP_Department || "",
          type: "CONTACT",
        });
      } else {
        setFormData({
          id: item.VA_Admin_id || "",
          name: item.VA_Name || "",
          email: item.VA_Email || "",
          role: item.VA_Role || "",
          password: item.VA_Password || "",
          phone: item.VA_Phone || "",
          department: item.VA_Department || "",
          type: "ADMIN",
        });
      }
    } else {
      setFormData({
        id: "",
        name: "",
        email: "",
        role: "",
        password: "",
        phone: "",
        department: "",
        type: "ADMIN",
      });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setErrors({});
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    
    // Real-time filtering and length enforcement
    if (name === "name") {
      value = value.replace(/[^A-Za-z\s]/g, "");
    } else if (name === "phone") {
      value = value.replace(/[^0-9]/g, "").slice(0, 10);
    } else if (name === "password") {
      value = value.slice(0, 5);
    }
    
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    const nameErr = validateName(formData.name);
    if (nameErr) nextErrors.name = nameErr;

    const emailErr = validateEmail(formData.email);
    if (emailErr) nextErrors.email = emailErr;

    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) nextErrors.phone = phoneErr;

    if (modalMode === "add") {
      if (!formData.role) {
        nextErrors.role = "Role is required";
      }

      const passErr = validatePassword(formData.password);
      if (passErr) nextErrors.password = passErr;
    } else if (formData.password) {
      const passErr = validatePassword(formData.password);
      if (passErr) nextErrors.password = passErr;
    }

    if (!formData.department?.trim()) {
      nextErrors.department = "Department is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    if (modalMode === "add") {
      const adminData = {
        VA_Name: formData.name,
        VA_Email: formData.email,
        VA_Password: formData.password,
        VA_Role: formData.role,
      };

      // Always save login details in Administrator table
      dispatch(AddAdministrator(adminData));

      // If role is Contact Person, also save in ContactPerson table
      if (formData.role === "Contact_Person") {
        dispatch(
          AddContactPerson(
            formData.name,
            formData.department,
            formData.email,
            formData.phone,
          ),
        );

        setTimeout(() => {
          dispatch(GetAllAdministrator());
          dispatch(GetAllContactPersons());
        }, 2500);
      } else {
        setTimeout(() => {
          dispatch(GetAllAdministrator());
        }, 2500);
      }
    } else {
      if (formData.type === "CONTACT") {
        // Update Contact Person specifically
        dispatch(
          UpdateContactPerson(
            formData.id,
            formData.name,
            formData.department,
            formData.email,
            formData.phone,
          ),
        );
        setTimeout(() => dispatch(GetAllContactPersons()), 2500);
      } else {
        // Administator Flow
        const adminData = {
          VA_Admin_id: formData.id,
          VA_Name: formData.name,
          VA_Email: formData.email,
          VA_Password: formData.password,
          VA_Role: formData.role,
        };
        dispatch(UpdateAdministrator(adminData));
        setTimeout(() => dispatch(GetAllAdministrator()), 2500);
      }
    }
    closeModal();
  };

  const categories = useMemo(
    () => [
      {
        id: "ADMIN",
        title: "System Administrators",
        icon: ShieldAlert,
        data: administrators
          .filter((a) => a.VA_Role === "Admin")
          .slice()
          .sort((a, b) => (b.VA_Admin_id || 0) - (a.VA_Admin_id || 0)),
      },
      {
        id: "SECURITY",
        title: "Security Supports",
        icon: Shield,
        data: administrators
          .filter((a) => a.VA_Role === "Security")
          .slice()
          .sort((a, b) => (b.VA_Admin_id || 0) - (a.VA_Admin_id || 0)),
      },
      {
        id: "CONTACT",
        title: "Contact Persons",
        icon: Users,
        data: contactPersons
          .slice()
          .sort(
            (a, b) =>
              (b.VCP_Contact_person_id || 0) - (a.VCP_Contact_person_id || 0),
          ),
      },
      {
        id: "VISITOR",
        title: "Visitor Accounts",
        icon: UserCheck,
        data: administrators
          .filter((a) => a.VA_Role === "Visitor")
          .slice()
          .sort((a, b) => (b.VA_Admin_id || 0) - (a.VA_Admin_id || 0)),
      },
    ],
    [administrators, contactPersons],
  );

  const filteredCategories = useMemo(
    () =>
      categories.map((cat) => ({
        ...cat,
        data: cat.data.filter(
          (item) => matchesSearch(item) && matchesStatus(item),
        ),
      })),
    [categories, searchTerm, statusFilter],
  );

  const visibleCategories =
    tableFilter === "ALL"
      ? filteredCategories
      : filteredCategories.filter((cat) => cat.id === tableFilter);

  const loading = adminLoading || contactLoading;
  const error = adminError || contactError;
  const isCompactAddForm = modalMode === "add";
  const modalWidthClass = isCompactAddForm ? "max-w-sm" : "max-w-md";
  const headerPaddingClass = isCompactAddForm ? "p-4" : "p-6";
  const formSpacingClass = isCompactAddForm ? "p-4 space-y-3" : "p-6 space-y-4";
  const fieldSizeClass = isCompactAddForm
    ? "px-3 py-2.5 text-[12px]"
    : "px-4 py-3 text-[13px]";
  const actionsPaddingClass = isCompactAddForm
    ? "pt-4 mt-2 gap-2"
    : "pt-6 mt-4 gap-3";
  const actionButtonSizeClass = isCompactAddForm
    ? "px-4 py-2.5 text-[12px]"
    : "px-6 py-3 text-[13px]";

  return (
    <div className="flex flex-col min-w-0 bg-[var(--color-bg-default)] min-h-screen">
      <Header title="All System Users" />

      <div className="flex-1 p-3 sm:p-4 md:p-8 overflow-y-auto w-full animate-fade-in-slow relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        <div className="max-w-[1500px] mx-auto">
          <header className="mb-4 md:mb-5 flex flex-col md:flex-row justify-end items-start md:items-center pb-4 md:pb-5 gap-4 relative z-10">

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
              {/* Search Form */}
              <form
                onSubmit={handleSearch}
                className="flex items-center bg-black/30 border border-white/15 hover:border-primary/40 transition-all duration-300 rounded-lg px-3 py-2 w-full sm:min-w-[240px] sm:w-auto shadow-sm"
              >
                <Search size={14} className="text-gray-500 mr-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search users..."
                  className="bg-transparent text-[12px] text-white placeholder-gray-500 focus:outline-none w-full"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="text-gray-600 hover:text-gray-400 transition-colors"
                  >
                    <X size={12} />
                  </button>
                )}
              </form>

              <div
                className="flex items-center transition-all rounded-lg px-2.5 py-1.5 w-full sm:min-w-[160px] sm:w-auto border border-white/15 hover:border-primary/40 shadow-sm"
                style={{
                  background:
                    themeMode === "light" ? "#ffffff" : "rgba(0,0,0,0.3)",
                }}
              >
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`text-[11px] focus:outline-none w-full transition-colors ${themeMode === "light" ? "text-black bg-white" : "bg-transparent text-gray-300 hover:text-white"}`}
                >
                  <option
                    value="ALL"
                    className={
                      themeMode === "light"
                        ? "bg-white text-black"
                        : "bg-[#0f0f10] text-white"
                    }
                  >
                    All Statuses
                  </option>
                  <option
                    value="ACTIVE"
                    className={
                      themeMode === "light"
                        ? "bg-white text-black"
                        : "bg-[#0f0f10] text-white"
                    }
                  >
                    Active
                  </option>
                  <option
                    value="INACTIVE"
                    className={
                      themeMode === "light"
                        ? "bg-white text-black"
                        : "bg-[#0f0f10] text-white"
                    }
                  >
                    Inactive
                  </option>
                </select>
              </div>

              <button
                onClick={() => openModal("add")}
                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/85 text-white px-4 py-2 rounded-lg text-[11px] font-semibold uppercase tracking-wide transition-all duration-300 shadow-lg hover:shadow-primary/30 w-full sm:w-auto"
              >
                <Plus size={14} strokeWidth={2.5} /> Add User
              </button>
            </div>
          </header>

          <div className="flex flex-col gap-3 mb-6 md:mb-7">
            <div className="flex flex-wrap bg-[var(--color-surface-2)] p-1 rounded-xl border border-white/5 relative max-w-full shadow-sm gap-1 w-full sm:w-auto">
              {[
                ...categories.map((cat) => ({
                  id: cat.id,
                  label: cat.title,
                })),
              ].map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => setTableFilter(btn.id)}
                  className={`relative px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-500 z-10 whitespace-nowrap min-w-max flex-1 sm:flex-none ${tableFilter === btn.id ? "!text-white" : "text-[var(--color-text-dim)] hover:text-[var(--color-text-primary)]"}`}
                >
                  {tableFilter === btn.id && (
                    <motion.div
                      layoutId="userTableFilter"
                      className="absolute inset-0 bg-primary rounded-lg shadow-[0_0_20px_rgba(200,16,46,0.2)]"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span className="relative z-10">{btn.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-10">
            {loading ? (
              <div className="p-8 md:p-20 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 border-4 border-white/5 border-t-primary rounded-full animate-spin mb-6"></div>
                <p className="text-gray-300 text-[13px] uppercase tracking-[0.3em] font-medium">
                  Hang tight, we’re loading the user list.
                </p>
              </div>
            ) : error ? (
              <div className="p-8 md:p-20 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20 text-primary">
                  <AlertCircle size={24} />
                </div>
                <p className="text-primary text-[14px] uppercase tracking-widest">
                  {error}
                </p>
              </div>
            ) : (
              <>
                {visibleCategories.map((cat) => (
                  <section key={cat.id} className="relative">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center text-primary shadow-md hover:shadow-lg transition-shadow">
                        <cat.icon size={18} strokeWidth={1.8} />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-white text-sm font-semibold tracking-wide uppercase">
                          {cat.title}
                        </h2>
                        <p className="text-white/40 text-[9px] tracking-[0.2em] uppercase font-medium mt-0.5">
                          {cat.data.length}{" "}
                          {cat.data.length === 1 ? "user" : "users"}
                        </p>
                      </div>
                      <div className="flex-1 h-[1px] bg-gradient-to-r from-white/10 via-white/5 to-transparent"></div>
                    </div>

                    <div className="bg-[var(--color-bg-paper)] border border-white/8 rounded-2xl overflow-hidden shadow-xl relative hover:border-white/12 transition-colors duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent pointer-events-none"></div>
                      <TableContainer
                        component={Paper}
                        className="bg-transparent border-none z-10 relative"
                        sx={{
                          maxHeight: "453px",
                          overflow: "auto",
                          overflowX: "auto",
                        }}
                      >
                        <Table
                          sx={{ minWidth: 920 }}
                          stickyHeader
                          aria-label={`${cat.title} table`}
                        >
                          <TableHead>
                            <TableRow
                              sx={{
                                height: "40px",
                                backgroundColor: "rgba(255,255,255,0.03)",
                              }}
                            >
                              <TableCell
                                sx={{
                                  padding: "8px 14px",
                                  borderBottom:
                                    "1px solid rgba(255,255,255,0.08)",
                                  width: "12%",
                                }}
                                className="text-white/50 font-semibold text-[9px] tracking-widest uppercase whitespace-nowrap"
                              >
                                User ID
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "8px 14px",
                                  borderBottom:
                                    "1px solid rgba(255,255,255,0.08)",
                                  width: "28%",
                                }}
                                className="text-white/50 font-semibold text-[9px] tracking-widest uppercase whitespace-nowrap"
                              >
                                Name & Email
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "8px 14px",
                                  borderBottom:
                                    "1px solid rgba(255,255,255,0.08)",
                                  width: "18%",
                                }}
                                className="hidden sm:table-cell text-white/50 font-semibold text-[9px] tracking-widest uppercase whitespace-nowrap"
                              >
                                {cat.id === "CONTACT" ? "Department" : "Role"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "8px 14px",
                                  borderBottom:
                                    "1px solid rgba(255,255,255,0.08)",
                                  width: "16%",
                                }}
                                className="hidden md:table-cell text-white/50 font-semibold text-[9px] tracking-widest uppercase whitespace-nowrap"
                              >
                                {cat.id === "CONTACT" ? "Contact" : "Joined"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "8px 14px",
                                  borderBottom:
                                    "1px solid rgba(255,255,255,0.08)",
                                  width: "14%",
                                }}
                                className="text-white/50 font-semibold text-[9px] tracking-widest uppercase whitespace-nowrap"
                              >
                                Status
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "8px 14px",
                                  borderBottom:
                                    "1px solid rgba(255,255,255,0.08)",
                                  width: "12%",
                                }}
                                align="right"
                                className="text-white/50 font-semibold text-[9px] tracking-widest uppercase whitespace-nowrap"
                              >
                                Actions
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {cat.data.length === 0 ? (
                              <TableRow
                                sx={{
                                  height: "44px",
                                  "&:hover": { backgroundColor: "transparent" },
                                }}
                              >
                                <TableCell
                                  colSpan={6}
                                  align="center"
                                  sx={{
                                    padding: "12px",
                                    borderBottom:
                                      "1px solid rgba(255,255,255,0.05)",
                                  }}
                                  className="text-white/30 text-[11px] font-medium"
                                >
                                  No users in this category
                                </TableCell>
                              </TableRow>
                            ) : (
                              cat.data.map((item) => {
                                const isActive =
                                  (item.VA_Status || item.VCP_Status || "")
                                    .toString()
                                    .trim()
                                    .toUpperCase() === "A" ||
                                  (item.VA_Status || item.VCP_Status || "")
                                    .toString()
                                    .trim()
                                    .toUpperCase() === "ACTIVE";

                                return (
                                  <TableRow
                                    key={
                                      item.VA_Admin_id ||
                                      item.VCP_Contact_person_id
                                    }
                                    sx={{
                                      "&:hover": {
                                        backgroundColor:
                                          "rgba(255,255,255,0.04)",
                                      },
                                      height: "44px",
                                      borderBottom:
                                        "1px solid rgba(255,255,255,0.05)",
                                      transition: "background-color 0.2s ease",
                                    }}
                                  >
                                    <TableCell
                                      sx={{ padding: "8px 14px", width: "12%" }}
                                      className="text-white/70 font-medium text-[11px] whitespace-nowrap"
                                    >
                                      <div className="flex items-center gap-1">
                                        <Hash
                                          size={10}
                                          className="text-primary/40"
                                        />
                                        <span>
                                          {item.VA_Admin_id ||
                                            item.VCP_Contact_person_id}
                                        </span>
                                      </div>
                                    </TableCell>
                                    <TableCell
                                      sx={{ padding: "8px 14px", width: "28%" }}
                                      className={`font-medium transition-colors text-[11px] ${isActive ? "text-white" : "text-white/30 line-through"}`}
                                    >
                                      {item.VA_Name || item.VCP_Name || "-"}
                                      <p className="text-gray-400 text-[9px] tracking-[0.1em] lowercase mt-0.5 opacity-70">
                                        {item.VA_Email || item.VCP_Email}
                                      </p>
                                    </TableCell>
                                    <TableCell
                                      sx={{ padding: "8px 14px", width: "18%" }}
                                      className={`hidden sm:table-cell transition-colors text-[11px] ${isActive ? "text-white/70" : "text-white/20"}`}
                                    >
                                      {item.VA_Role ||
                                        item.VCP_Department ||
                                        "-"}
                                    </TableCell>
                                    <TableCell
                                      sx={{ padding: "8px 14px", width: "16%" }}
                                      className={`hidden md:table-cell transition-colors text-[11px] ${isActive ? "text-white/70" : "text-white/20"}`}
                                    >
                                      {item.VA_Created_Date
                                        ? item.VA_Created_Date.split(" ")[0]
                                        : item.VCP_Phone || "AUTHEN.SYSTEM"}
                                    </TableCell>
                                    <TableCell
                                      sx={{ padding: "8px 14px", width: "14%" }}
                                    >
                                      <button
                                        onClick={() =>
                                          handleToggleStatus(item, cat.id)
                                        }
                                        disabled={loading}
                                        title="Click to toggle status"
                                        className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold transition-all cursor-pointer rounded ${isActive ? "bg-green-500/10 text-green-400 hover:bg-green-500/20" : "bg-red-500/10 text-red-400 hover:bg-red-500/20"}`}
                                      >
                                        {isActive ? "ACTIVE" : "INACTIVE"}
                                      </button>
                                    </TableCell>
                                    <TableCell
                                      sx={{ padding: "8px 14px", width: "12%" }}
                                      align="right"
                                    >
                                      <IconButton
                                        onClick={() =>
                                          openModal("edit", item, cat.id)
                                        }
                                        size="small"
                                        className="text-white/40 hover:text-white p-1"
                                      >
                                        <Edit size={13} />
                                      </IconButton>
                                    </TableCell>
                                  </TableRow>
                                );
                              })
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  </section>
                ))}
                {visibleCategories.length === 0 && (
                  <div className="p-8 md:p-20 text-center border border-white/5 rounded-2xl bg-black/20">
                    <p className="text-gray-300 text-[13px] uppercase tracking-[0.3em] font-medium">
                      No users match the selected table and filters.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Add / Edit Administrator */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
          <div
            className={`bg-[var(--color-bg-paper)] border border-white/10 rounded-3xl shadow-2xl w-full ${modalWidthClass} relative my-auto`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none rounded-3xl"></div>

            <div
              className={`flex justify-between items-center ${headerPaddingClass} border-b border-white/5 relative z-10`}
            >
              <h2
                className={`${isCompactAddForm ? "text-base" : "text-lg"} font-bold text-white uppercase tracking-wider`}
              >
                {modalMode === "add"
                  ? "Add New System User"
                  : "Edit User Profile"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleFormSubmit}
              className={`${formSpacingClass} relative z-10 max-h-[70vh] overflow-y-auto custom-scrollbar`}
            >
              <div className="space-y-1">
                <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex flex-col md:flex-row gap-4 md:gap-2">
                  <User size={12} /> Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full rounded-xl ${fieldSizeClass} text-white focus:outline-none transition-colors ${
                    errors.name
                      ? "bg-red-500/20 border border-red-500/50 focus:border-red-500/70"
                      : "bg-black/40 border border-white/10 focus:border-primary/50"
                  }`}
                  placeholder="e.g. John Doe"
                />
                {errors.name && (
                  <p className="text-[10px] text-red-400 font-semibold mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex flex-col md:flex-row gap-4 md:gap-2">
                  <Mail size={12} /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full rounded-xl ${fieldSizeClass} text-white focus:outline-none transition-colors ${
                    errors.email
                      ? "bg-red-500/20 border border-red-500/50 focus:border-red-500/70"
                      : "bg-black/40 border border-white/10 focus:border-primary/50"
                  }`}
                  placeholder="example@mas.com"
                />
                {errors.email && (
                  <p className="text-[10px] text-red-400 font-semibold mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {formData.type === "CONTACT" ? (
                <>
                  <div className="space-y-1">
                    <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex flex-col md:flex-row gap-4 md:gap-2">
                      <Users size={12} /> Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl ${fieldSizeClass} text-white focus:outline-none transition-colors ${
                        errors.department
                          ? "bg-red-500/20 border border-red-500/50 focus:border-red-500/70"
                          : "bg-black/40 border border-white/10 focus:border-primary/50"
                      }`}
                      placeholder="e.g. Human Resources"
                    />
                    {errors.department && (
                      <p className="text-[10px] text-red-400 font-semibold mt-1">
                        {errors.department}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex flex-col md:flex-row gap-4 md:gap-2">
                      <X size={12} /> Phone Connection
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      maxLength={10}
                      className={`w-full rounded-xl ${fieldSizeClass} text-white focus:outline-none transition-colors ${
                        errors.phone
                          ? "bg-red-500/20 border border-red-500/50 focus:border-red-500/70"
                          : "bg-black/40 border border-white/10 focus:border-primary/50"
                      }`}
                      placeholder="e.g. +94 123 4567"
                    />
                    {errors.phone && (
                      <p className="text-[10px] text-red-400 font-semibold mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex flex-col md:flex-row gap-4 md:gap-2">
                      <Users size={12} /> Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl ${fieldSizeClass} text-white focus:outline-none transition-colors ${
                        errors.department
                          ? "bg-red-500/20 border border-red-500/50 focus:border-red-500/70"
                          : "bg-black/40 border border-white/10 focus:border-primary/50"
                      }`}
                      placeholder="e.g. Human Resources"
                    />
                    {errors.department && (
                      <p className="text-[10px] text-red-400 font-semibold mt-1">
                        {errors.department}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex flex-col md:flex-row gap-4 md:gap-2">
                      <Phone size={12} /> Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      maxLength={10}
                      className={`w-full rounded-xl ${fieldSizeClass} text-white focus:outline-none transition-colors ${
                        errors.phone
                          ? "bg-red-500/20 border border-red-500/50 focus:border-red-500/70"
                          : "bg-black/40 border border-white/10 focus:border-primary/50"
                      }`}
                      placeholder="e.g. 0712345678"
                    />
                    {errors.phone ? (
                      <p className="text-[10px] text-red-400 font-semibold mt-1">
                        {errors.phone}
                      </p>
                    ) : (
                      <p className="text-[9px] text-white/30 uppercase tracking-widest mt-1">
                        10 digits only
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex flex-col md:flex-row gap-4 md:gap-2">
                      <Shield size={12} /> Role
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl ${fieldSizeClass} text-white focus:outline-none transition-colors ${
                        errors.role
                          ? "bg-red-500/20 border border-red-500/50 focus:border-red-500/70"
                          : "bg-black/40 border border-white/10 focus:border-primary/50"
                      }`}
                    >
                      <option value="">Select a role</option>
                      <option value="Admin">Admin</option>
                      <option value="Security">Security</option>
                      <option value="Contact_Person">Contact Person</option>
                    </select>
                    {errors.role && (
                      <p className="text-[10px] text-red-400 font-semibold mt-1">
                        {errors.role}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex flex-col md:flex-row gap-4 md:gap-2">
                      <Hash size={12} /> Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      maxLength={5}
                      className={`w-full rounded-xl ${fieldSizeClass} text-white focus:outline-none transition-colors ${
                        errors.password
                          ? "bg-red-500/20 border border-red-500/50 focus:border-red-500/70"
                          : "bg-black/40 border border-white/10 focus:border-primary/50"
                      }`}
                      placeholder={
                        modalMode === "add"
                          ? "Max 5 chars, Capital & Special"
                          : "Leave blank to keep current"
                      }
                    />
                    {errors.password ? (
                      <p className="text-[10px] text-red-400 font-semibold mt-1">
                        {errors.password}
                      </p>
                    ) : (
                      <p className="text-[9px] text-white/30 uppercase tracking-widest mt-1">
                        Max 5 chars, Capital &amp; Special Char
                      </p>
                    )}
                  </div>
                </>
              )}

              <div className={`${actionsPaddingClass} flex justify-end`}>
                <button
                  type="button"
                  onClick={closeModal}
                  className={`${actionButtonSizeClass} rounded-xl font-bold text-gray-400 hover:bg-white/5 uppercase tracking-wider transition-all`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${actionButtonSizeClass} rounded-xl bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider shadow-lg shadow-primary/20 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-primary`}
                >
                  {modalMode === "add" ? "Create User" : "Update Access"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
