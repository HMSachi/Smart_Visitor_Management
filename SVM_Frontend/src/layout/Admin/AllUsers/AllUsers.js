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
  Eye,
  EyeOff,
} from "lucide-react";
import { 
  validateName, validateNIC, validatePhone, validateEmail, validatePassword 
} from "../../../utils/validation";

const StatusBadge = ({ status }) => {
  const s = (status || "").toString().trim().toUpperCase();
  if (s === "ACTIVE" || s === "A") {
    return <div className="svm-status-pill svm-status-pill--success">Active</div>;
  }
  return <div className="svm-status-pill svm-status-pill--danger">Inactive</div>;
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
  const [showPassword, setShowPassword] = useState(false);

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
    setShowPassword(false);
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
        title: "Admin",
        icon: ShieldAlert,
        data: administrators
          .filter((a) => a.VA_Role === "Admin")
          .slice()
          .sort((a, b) => (b.VA_Admin_id || 0) - (a.VA_Admin_id || 0)),
      },
      {
        id: "SECURITY",
        title: "Security",
        icon: Shield,
        data: administrators
          .filter((a) => a.VA_Role === "Security")
          .slice()
          .sort((a, b) => (b.VA_Admin_id || 0) - (a.VA_Admin_id || 0)),
      },
      {
        id: "CONTACT",
        title: "Contact person",
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
        title: "Visitor",
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
  const modalWidthClass = "max-w-3xl";
  const headerPaddingClass = isCompactAddForm ? "p-4" : "p-6";
  const formSpacingClass = isCompactAddForm ? "p-4 space-y-3" : "p-6 space-y-4";
  const fieldSizeClass = "px-3.5 py-2.5 text-[12px]";
  const actionsPaddingClass = isCompactAddForm
    ? "pt-4 mt-2 gap-2"
    : "pt-6 mt-4 gap-3";
  const actionButtonSizeClass = "px-6 py-2.5 text-[12px]";

  return (
    <div className="flex flex-col min-w-0 bg-[var(--color-bg-default)] min-h-screen">
      <Header title="All System Users" />

      <div className="flex-1 p-3 sm:p-4 md:p-8 overflow-y-auto w-full animate-fade-in-slow relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        <div className="max-w-none mx-auto">
          <header className="mb-6 flex flex-col xl:flex-row justify-between items-center gap-3 relative z-10">
            <div className="overflow-x-auto no-scrollbar w-full xl:w-auto">
              <div className={`inline-flex p-1 rounded-full border transition-all gap-0.5 ${themeMode === "light" ? "bg-white border-gray-100 shadow-sm" : "bg-black/20 border-white/5"}`}>
                {[
                  ...categories.map((cat) => ({
                    id: cat.id,
                    label: cat.title,
                  })),
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => setTableFilter(btn.id)}
                    className={`relative px-4 py-2 rounded-full text-[11px] font-medium tracking-wide transition-all duration-300 whitespace-nowrap ${tableFilter === btn.id
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : themeMode === "light"
                        ? "text-gray-500 hover:text-primary"
                        : "text-white/40 hover:text-white"
                      }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 items-center shrink-0 w-full xl:w-auto">
              <div
                className={`flex items-center border transition-all rounded-[8px] px-3 h-9 min-w-[220px] w-full sm:w-[280px] md:w-[320px] group shadow-sm ${themeMode === "light" ? "bg-white border-gray-200 hover:border-primary/20 focus-within:border-primary/40" : "bg-black/40 border-white/10 focus-within:border-primary hover:border-white/20"}`}
              >
                <Search size={14} className={`transition-colors mr-2 ${themeMode === "light" ? "text-gray-400 group-focus-within:text-primary" : "text-white/20 group-focus-within:text-primary"}`} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search users..."
                  className={`bg-transparent text-[13px] focus:outline-none w-full tracking-wide ${themeMode === "light" ? "text-[#1A1A1A] placeholder:text-gray-400" : "text-white placeholder:text-white/20"}`}
                />
              </div>

              <div
                className={`flex items-center border transition-all rounded-[8px] px-3 h-9 min-w-[120px] w-full sm:w-auto group shadow-sm ${themeMode === "light" ? "bg-white border-gray-200 hover:border-primary/20 focus-within:border-primary/40" : "bg-black/40 border-white/10 focus-within:border-primary hover:border-white/20"}`}
              >
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`text-[13px] bg-transparent focus:outline-none w-full tracking-wide cursor-pointer ${themeMode === "light" ? "text-[#1A1A1A]" : "text-white"}`}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <button
                onClick={() => openModal("add")}
                className="flex items-center justify-center gap-1 bg-primary hover:bg-primary-hover text-white px-3 h-7 rounded-[5px] text-[2px] font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95 group shrink-0"
              >
                <Plus size={12} className="group-hover:rotate-90 transition-transform" />
                Add User
              </button>
            </div>
          </header>

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

                    <div className="bg-[var(--color-bg-paper)] border border-white/8 rounded-[5px] overflow-hidden shadow-xl relative hover:border-white/12 transition-colors duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent pointer-events-none"></div>
                      <TableContainer
                        component={Paper}
                        className="bg-transparent border-none z-10 relative"
                        sx={{
                          maxHeight: "calc(100vh - 10rem)",
                          minHeight: "400px",
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
                                height: "24px",
                                backgroundColor: themeMode === "light" ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.03)",
                              }}
                            >
                              <TableCell
                                sx={{
                                  padding: "4px 12px",
                                  borderBottom: themeMode === "light" ? "1px solid rgba(0,0,0,0.05)" : "1px solid rgba(255,255,255,0.08)",
                                  width: "8%",
                                }}
                                className={`${themeMode === "light" ? "text-gray-500" : "text-white/40"} font-normal text-[12px] tracking-[0.2em] whitespace-nowrap`}
                              >
                                User ID
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "4px 12px",
                                  borderBottom: themeMode === "light" ? "1px solid rgba(0,0,0,0.05)" : "1px solid rgba(255,255,255,0.08)",
                                  width: "15%",
                                }}
                                className={`${themeMode === "light" ? "text-gray-500" : "text-white/40"} font-normal text-[12px] tracking-[0.2em] whitespace-nowrap`}
                              >
                                Name
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "4px 12px",
                                  borderBottom: themeMode === "light" ? "1px solid rgba(0,0,0,0.05)" : "1px solid rgba(255,255,255,0.08)",
                                  width: "20%",
                                }}
                                className={`${themeMode === "light" ? "text-gray-500" : "text-white/40"} font-normal text-[12px] tracking-[0.2em] whitespace-nowrap`}
                              >
                                Email
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "4px 12px",
                                  borderBottom: themeMode === "light" ? "1px solid rgba(0,0,0,0.05)" : "1px solid rgba(255,255,255,0.08)",
                                  width: "12%",
                                }}
                                className={`hidden sm:table-cell ${themeMode === "light" ? "text-gray-500" : "text-white/40"} font-normal text-[12px] tracking-[0.2em] whitespace-nowrap`}
                              >
                                {cat.id === "CONTACT" ? "Department" : "Role"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "4px 12px",
                                  borderBottom: themeMode === "light" ? "1px solid rgba(0,0,0,0.05)" : "1px solid rgba(255,255,255,0.08)",
                                  width: "15%",
                                }}
                                className={`hidden md:table-cell ${themeMode === "light" ? "text-gray-500" : "text-white/40"} font-normal text-[12px] tracking-[0.2em] whitespace-nowrap`}
                              >
                                {cat.id === "CONTACT" ? "Contact" : "Joined"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "4px 12px",
                                  borderBottom: themeMode === "light" ? "1px solid rgba(0,0,0,0.05)" : "1px solid rgba(255,255,255,0.08)",
                                  width: "10%",
                                }}
                                className={`${themeMode === "light" ? "text-gray-500" : "text-white/40"} font-normal text-[12px] tracking-[0.2em] whitespace-nowrap`}
                              >
                                Status
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "4px 12px",
                                  borderBottom: themeMode === "light" ? "1px solid rgba(0,0,0,0.05)" : "1px solid rgba(255,255,255,0.08)",
                                  width: "10%",
                                }}
                                align="right"
                                className={`${themeMode === "light" ? "text-gray-500" : "text-white/40"} font-normal text-[12px] tracking-[0.2em] whitespace-nowrap`}
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
                                    padding: "8px",
                                    borderBottom:
                                      "1px solid rgba(255,255,255,0.05)",
                                  }}
                                  className="text-white/30 text-[12px] font-normal"
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
                                          backgroundColor: themeMode === "light" ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)",
                                        },
                                        height: "28px",
                                        borderBottom: themeMode === "light" ? "1px solid rgba(0,0,0,0.04)" : "1px solid rgba(255,255,255,0.05)",
                                        transition: "background-color 0.2s ease",
                                      }}
                                    >
                                      <TableCell
                                        sx={{ padding: "3px 12px", width: "8%" }}
                                        className={`${themeMode === "light" ? "text-gray-800" : "text-white/80"} font-normal text-[12px] whitespace-nowrap`}
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
                                        sx={{ padding: "3px 12px", width: "15%" }}
                                        className={`font-normal transition-colors text-[12px] ${isActive ? (themeMode === "light" ? "text-gray-900" : "text-white") : (themeMode === "light" ? "text-gray-400" : "text-white/40")}`}
                                      >
                                        {item.VA_Name || item.VCP_Name || "-"}
                                      </TableCell>
                                      <TableCell
                                        sx={{ padding: "3px 12px", width: "20%" }}
                                        className={`font-normal transition-colors text-[12px] whitespace-nowrap ${isActive ? (themeMode === "light" ? "text-gray-600" : "text-gray-400 opacity-60") : (themeMode === "light" ? "text-gray-400" : "text-gray-500 opacity-30")}`}
                                      >
                                        {item.VA_Email || item.VCP_Email}
                                      </TableCell>
                                      <TableCell
                                        sx={{ padding: "3px 12px", width: "12%" }}
                                        className={`hidden sm:table-cell transition-colors font-normal text-[12px] ${isActive ? (themeMode === "light" ? "text-gray-700" : "text-white/70") : (themeMode === "light" ? "text-gray-300" : "text-white/20")}`}
                                      >
                                        {item.VA_Role ||
                                          item.VCP_Department ||
                                          "-"}
                                      </TableCell>
                                      <TableCell
                                        sx={{ padding: "3px 12px", width: "15%" }}
                                        className={`hidden md:table-cell transition-colors font-normal text-[12px] ${isActive ? (themeMode === "light" ? "text-gray-700" : "text-white/70") : (themeMode === "light" ? "text-gray-300" : "text-white/20")}`}
                                      >
                                        {item.VA_Created_Date
                                          ? item.VA_Created_Date.split(" ")[0]
                                          : item.VCP_Phone || "AUTHEN.SYSTEM"}
                                      </TableCell>
                                      <TableCell
                                        sx={{ padding: "3px 12px", width: "10%" }}
                                       className="text-[12px] font-normal">
                                        <button
                                          onClick={() =>
                                            handleToggleStatus(item, cat.id)
                                          }
                                          disabled={loading}
                                          title="Click to toggle status"
                                          className={`svm-status-pill transition-colors cursor-pointer ${isActive ? "svm-status-pill--success hover:bg-green-500/20" : "svm-status-pill--danger hover:bg-primary/20"}`}
                                        >
                                          {isActive ? "Active" : "Inactive"}
                                        </button>
                                      </TableCell>
                                      <TableCell
                                        sx={{ padding: "4px 12px", width: "10%" }}
                                        align="right"
                                       className="text-[12px] font-normal">
                                        <IconButton
                                          onClick={() =>
                                            openModal("edit", item, cat.id)
                                          }
                                          size="small"
                                          className={`${themeMode === "light" ? "text-gray-400 hover:text-primary" : "text-white/40 hover:text-white"} p-1`}
                                        >
                                          <Edit size={12} />
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
                className="text-base font-bold text-white tracking-wider"
              >
                {modalMode === "add"
                  ? "Add system user"
                  : "Edit user profile"}
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
              <div className="space-y-1.5">
                <label className="text-[12px] text-primary tracking-[0.14em] font-normal flex flex-col md:flex-row items-center gap-2 px-1">
                  <User size={11} className="text-primary/60" /> Name
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

              <div className="space-y-1.5">
                <label className="text-[12px] text-primary tracking-[0.14em] font-normal flex flex-col md:flex-row items-center gap-2 px-1">
                  <Mail size={11} className="text-primary/60" /> Email
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
                  <div className="space-y-1.5">
                    <label className="text-[12px] text-primary tracking-[0.14em] font-normal flex flex-col md:flex-row items-center gap-2 px-1">
                      <Users size={11} className="text-primary/60" /> Department
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
                  <div className="space-y-1.5">
                    <label className="text-[12px] text-primary tracking-[0.14em] font-normal flex flex-col md:flex-row items-center gap-2 px-1">
                      <X size={11} className="text-primary/60" /> Phone connection
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
                  <div className="space-y-1.5">
                    <label className="text-[12px] text-primary tracking-[0.14em] font-normal flex flex-col md:flex-row items-center gap-2 px-1">
                      <Users size={11} className="text-primary/60" /> Department
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

                  <div className="space-y-1.5">
                    <label className="text-[12px] text-primary tracking-[0.14em] font-normal flex flex-col md:flex-row items-center gap-2 px-1">
                      <Phone size={11} className="text-primary/60" /> Phone
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

                  <div className="space-y-1.5">
                    <label className="text-[12px] text-primary tracking-[0.14em] font-normal flex flex-col md:flex-row items-center gap-2 px-1">
                      <Shield size={11} className="text-primary/60" /> Role
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

                  <div className="space-y-1.5">
                    <label className="text-[12px] text-primary tracking-[0.14em] font-normal flex flex-col md:flex-row items-center gap-2 px-1">
                      <Hash size={11} className="text-primary/60" /> Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        maxLength={5}
                        className={`w-full rounded-xl pl-3.5 pr-10 py-2.5 text-[12px] text-white focus:outline-none transition-colors ${
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
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
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
                  className={`${actionButtonSizeClass} rounded-xl font-normal text-gray-400 hover:bg-white/5 tracking-wider transition-all`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${actionButtonSizeClass} rounded-xl bg-primary hover:bg-primary/90 text-white font-normal tracking-wider shadow-lg shadow-primary/20 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-primary`}
                >
                  {modalMode === "add" ? "Create user" : "Update access"}
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
