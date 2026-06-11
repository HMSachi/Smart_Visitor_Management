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
import AdministratorService from "../../../services/AdministratorService";
import ContactPersonService from "../../../services/ContactPersonService";
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
import PageSpinner from "../../../components/common/PageSpinner";
import {
  validateName,
  validateNIC,
  validatePhone,
  validateEmail,
  validatePassword,
} from "../../../utils/validation";

const StatusBadge = ({ status }) => {
  const s = (status || "").toString().trim().toUpperCase();
  if (s === "ACTIVE" || s === "A") {
    return (
      <div className="svm-status-pill svm-status-pill--success">Active</div>
    );
  }
  return (
    <div className="svm-status-pill svm-status-pill--danger">Inactive</div>
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

  const getAdministratorMobile = (record = {}) =>
    record.VA_Mobile_Number ||
    record.VA_Phone ||
    record.VA_Mobile ||
    record.VA_Contact_Number ||
    "";

  const getContactMobile = (record = {}) =>
    record.VCP_Phone ||
    record.VCP_Mobile ||
    record.VCP_Mobile_Number ||
    record.VCP_Contact_Number ||
    "";

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
      getAdministratorMobile(item),
      getContactMobile(item),
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

  const getCachedProfile = (type, id) => {
    if (!id || typeof window === "undefined") return null;

    try {
      const cacheKey = `svm.userProfile.${type}.${id}`;
      const cached = window.localStorage.getItem(cacheKey);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      return null;
    }
  };

  const cacheProfile = (type, id, profile) => {
    if (!id || typeof window === "undefined") return;

    try {
      const cacheKey = `svm.userProfile.${type}.${id}`;
      window.localStorage.setItem(cacheKey, JSON.stringify(profile));
    } catch (error) {
      // ignore storage issues
    }
  };

  const buildFormDataFromItem = (item = null, type = "ADMIN") => {
    if (!item) {
      return {
        id: "",
        name: "",
        email: "",
        role: "",
        password: "",
        phone: "",
        department: "",
        type: "ADMIN",
      };
    }

    if (type === "CONTACT") {
      return {
        id: item.VCP_Contact_person_id || "",
        name: item.VCP_Name || "",
        email: item.VCP_Email || "",
        role: "Contact_Person",
        password: "",
        phone: getContactMobile(item),
        department:
          item.VCP_Department || item.VCP_Designation || item.VCP_Dept || "",
        type: "CONTACT",
      };
    }

    return {
      id: item.VA_Admin_id || "",
      name: item.VA_Name || "",
      email: item.VA_Email || "",
      role: item.VA_Role || item.VA_Role_Name || "",
      password: "",
      phone: getAdministratorMobile(item),
      department:
        item.VA_Department || item.VA_Designation || item.VA_Dept || "",
      type: "ADMIN",
    };
  };

  const openModal = async (mode, item = null, type = "ADMIN") => {
    setModalMode(mode);
    setErrors({});
    setShowPassword(false);

    if (!item) {
      setFormData(buildFormDataFromItem(null));
      setIsModalOpen(true);
      return;
    }

    const baseFormData = buildFormDataFromItem(item, type);
    const resolvedRole =
      baseFormData.role ||
      item?.VA_Role ||
      item?.VA_Role_Name ||
      (type === "ADMIN" ? "Admin" : type === "SECURITY" ? "Security" : "");

    try {
      if (type === "CONTACT") {
        const response = await ContactPersonService.GetContactPersonById(
          baseFormData.id,
        );
        const record =
          response?.data?.ResultSet?.[0] ||
          response?.data?.ResultSet ||
          response?.data ||
          item;
        const cached = getCachedProfile("CONTACT", baseFormData.id);
        setFormData({
          ...baseFormData,
          id: record.VCP_Contact_person_id || baseFormData.id,
          name: record.VCP_Name || cached?.name || baseFormData.name,
          email: record.VCP_Email || cached?.email || baseFormData.email,
          role: baseFormData.role || "Contact_Person",
          phone:
            getContactMobile(record) || cached?.phone || baseFormData.phone,
          department:
            record.VCP_Department ||
            record.VCP_Designation ||
            record.VCP_Dept ||
            cached?.department ||
            baseFormData.department,
        });
      } else {
        const response = await AdministratorService.GetAdministratorById(
          baseFormData.id,
        );
        const record =
          response?.data?.ResultSet?.[0] ||
          response?.data?.ResultSet ||
          response?.data ||
          item;
        const cached =
          getCachedProfile("ADMIN", baseFormData.id) ||
          getCachedProfile("ADMIN", baseFormData.email);
        setFormData({
          ...baseFormData,
          id: record.VA_Admin_id || baseFormData.id,
          name: record.VA_Name || cached?.name || baseFormData.name,
          email: record.VA_Email || cached?.email || baseFormData.email,
          role: record.VA_Role || cached?.role || resolvedRole,
          phone:
            getAdministratorMobile(record) || cached?.phone || baseFormData.phone,
          department:
            record.VA_Department ||
            record.VA_Designation ||
            record.VA_Dept ||
            cached?.department ||
            baseFormData.department,
          password:
            cached?.password || record.VA_Password || baseFormData.password,
        });
      }
    } catch (error) {
      const cached =
        getCachedProfile(
          type === "CONTACT" ? "CONTACT" : "ADMIN",
          baseFormData.id,
        ) ||
        getCachedProfile(
          type === "CONTACT" ? "CONTACT" : "ADMIN",
          baseFormData.email,
        );
      setFormData({
        ...baseFormData,
        name: cached?.name || baseFormData.name,
        email: cached?.email || baseFormData.email,
        role: cached?.role || resolvedRole || baseFormData.role,
        phone: cached?.phone || baseFormData.phone,
        department: cached?.department || baseFormData.department,
        password: cached?.password || baseFormData.password,
      });
    }

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

    // Check for duplicate email when adding new user
    if (modalMode === "add" && formData.email && !emailErr) {
      // Check in administrators
      const emailExists = administrators.some(
        (admin) =>
          admin.VA_Email?.toLowerCase() === formData.email.toLowerCase(),
      );
      if (emailExists) {
        nextErrors.email = "Email already registered in system";
      }

      // Check in contact persons if role is Contact_Person
      if (!emailExists && formData.role === "Contact_Person") {
        const contactEmailExists = contactPersons.some(
          (contact) =>
            contact.VCP_Email?.toLowerCase() === formData.email.toLowerCase(),
        );
        if (contactEmailExists) {
          nextErrors.email = "Email already registered as contact person";
        }
      }
    }

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
        VA_Mobile_Number: formData.phone,
        VA_Phone: formData.phone,
        VA_Department: formData.department,
      };

      // Always save login details in Administrator table
      dispatch(AddAdministrator(adminData));
      cacheProfile("ADMIN", formData.id || formData.email, {
        id: formData.id,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        phone: formData.phone,
        department: formData.department,
        password: formData.password,
      });

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
        cacheProfile("CONTACT", formData.id || formData.email, {
          id: formData.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          department: formData.department,
        });

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
        cacheProfile("CONTACT", formData.id, {
          id: formData.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          department: formData.department,
        });
        setTimeout(() => dispatch(GetAllContactPersons()), 2500);
      } else {
        // Administator Flow
        const adminData = {
          VA_Admin_id: formData.id,
          VA_Name: formData.name,
          VA_Email: formData.email,
          VA_Password: formData.password,
          VA_Role: formData.role,
          VA_Mobile_Number: formData.phone,
          VA_Phone: formData.phone,
          VA_Department: formData.department,
        };
        dispatch(UpdateAdministrator(adminData));
        cacheProfile("ADMIN", formData.id, {
          id: formData.id,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          phone: formData.phone,
          department: formData.department,
          password: formData.password,
        });
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

  const totalUsers = categories.reduce((sum, cat) => sum + cat.data.length, 0);

  const loading = adminLoading || contactLoading;
  const error = adminError || contactError;
  const isMobile = window.innerWidth < 768;
  const isCompactAddForm = modalMode === "add";
  const modalWidthClass = "max-w-sm sm:max-w-2xl md:max-w-3xl";
  const headerPaddingClass = isCompactAddForm
    ? "p-3 sm:p-4 md:p-5"
    : "p-3 sm:p-4 md:p-6";
  const formSpacingClass = isCompactAddForm
    ? "p-3 sm:p-4 md:p-5 space-y-3 sm:space-y-4"
    : "p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4";
  const fieldSizeClass =
    "px-3 sm:px-3.5 py-2 sm:py-2.5 text-[11px] sm:text-[12px]";
  const actionsPaddingClass = isCompactAddForm
    ? "pt-3 sm:pt-4 md:pt-4 mt-2 gap-2 flex flex-col-reverse sm:flex-row"
    : "pt-4 sm:pt-6 mt-3 sm:mt-4 gap-2 sm:gap-3 flex flex-col-reverse sm:flex-row";
  const actionButtonSizeClass =
    "px-4 sm:px-6 py-2 sm:py-2.5 text-[11px] sm:text-[12px]";

  return (
    <div className="flex flex-col min-w-0 bg-[var(--color-bg-default)] min-h-screen">
      <Header title="All System Users" />

      <div className="flex-1 p-2 md:p-3 space-y-2 md:space-y-4 animate-fade-in-slow overflow-y-auto bg-[var(--color-bg-default)] relative">
        {/* Dynamic Operational Aura */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

        <div className="max-w-none mx-auto relative z-10 flex flex-col min-h-full">
          <div className="bg-[var(--color-bg-paper)] border border-white/5 rounded-lg sm:rounded-2xl md:rounded-[32px] shadow-xl relative overflow-hidden mb-2 sm:mb-4">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            <div className="px-3 sm:px-4 md:px-5 py-2 border-b border-white/5 bg-transparent flex flex-col xl:flex-row justify-between items-start xl:items-center gap-2 sm:gap-3 md:gap-4 relative z-10">
              <div className="flex flex-nowrap overflow-x-auto no-scrollbar gap-2 md:gap-4 w-full md:w-auto relative max-w-full">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setTableFilter(cat.id)}
                    className={`relative px-3 py-1.5 rounded-md text-[13px] font-medium tracking-wide transition-all duration-500 z-10 whitespace-nowrap min-w-0 flex-shrink-0 ${tableFilter === cat.id ? "!text-white" : "text-[var(--color-text-dim)] hover:text-[var(--color-text-primary)]"}`}
                  >
                    {tableFilter === cat.id && (
                      <motion.div
                        layoutId="activeFilter"
                        className="absolute inset-0 bg-primary rounded-lg shadow-[0_0_20px_rgba(200,16,46,0.2)]"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                    <span className="relative z-10">{cat.title}</span>
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center shrink-0 w-full xl:w-auto">
                <div className="inline-flex items-center justify-center gap-2 rounded-full border border-white/8 bg-black/20 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/80 shrink-0 w-full sm:w-auto">
                  <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]" />
                  {totalUsers} records
                </div>

                <div className="flex items-center bg-black/40 border border-white/10 px-4 py-1.5 rounded-full group focus-within:border-primary transition-all w-full sm:w-64">
                  <Search
                    size={14}
                    className="text-white/20 group-focus-within:text-primary"
                  />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none focus:outline-none text-white text-[12px] font-medium ml-2 w-full placeholder:text-white/20"
                  />
                </div>

                <button
                  onClick={() => openModal("add")}
                  className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 h-10 rounded-full text-[12px] font-bold tracking-wider transition-all shadow-lg active:scale-95 group shrink-0 w-full sm:w-auto"
                >
                  <Plus
                    size={14}
                    className="group-hover:rotate-90 transition-transform"
                  />
                  Add user
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            {loading ? (
              <div className="p-8 md:p-20 flex flex-col items-center justify-center text-center">
                <PageSpinner size={44} color="var(--color-primary)" />
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

                    <div className="bg-[var(--color-bg-paper)] border border-white/5 rounded-[5px] shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                      <TableContainer
                        component={Paper}
                        className="bg-transparent border-none z-10 relative shadow-none"
                        sx={{
                          maxHeight: "600px",
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
                                backgroundColor: "var(--color-bg-paper)",
                              }}
                            >
                              <TableCell
                                sx={{
                                  padding: "8px 24px",
                                  borderBottom:
                                    "1px solid rgba(255,255,255,0.05)",
                                  width: "8%",
                                }}
                                className="text-[var(--color-text-secondary)] font-normal text-[12px] tracking-[0.3em] uppercase whitespace-nowrap bg-[var(--color-bg-paper)]"
                              >
                                User ID
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "8px 24px",
                                  borderBottom:
                                    "1px solid rgba(255,255,255,0.05)",
                                  width: "15%",
                                }}
                                className="text-[var(--color-text-secondary)] font-normal text-[12px] tracking-[0.3em] uppercase whitespace-nowrap bg-[var(--color-bg-paper)]"
                              >
                                Name
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "8px 24px",
                                  borderBottom:
                                    "1px solid rgba(255,255,255,0.05)",
                                  width: "20%",
                                }}
                                className="text-[var(--color-text-secondary)] font-normal text-[12px] tracking-[0.3em] uppercase whitespace-nowrap bg-[var(--color-bg-paper)]"
                              >
                                Email
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "8px 24px",
                                  borderBottom:
                                    "1px solid rgba(255,255,255,0.05)",
                                  width: "12%",
                                }}
                                className={`hidden sm:table-cell text-[var(--color-text-secondary)] font-normal text-[12px] tracking-[0.3em] uppercase whitespace-nowrap bg-[var(--color-bg-paper)]`}
                              >
                                {cat.id === "CONTACT" ? "Department" : "Role"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "8px 24px",
                                  borderBottom:
                                    "1px solid rgba(255,255,255,0.05)",
                                  width: "15%",
                                }}
                                className={`hidden md:table-cell text-[var(--color-text-secondary)] font-normal text-[12px] tracking-[0.3em] uppercase whitespace-nowrap bg-[var(--color-bg-paper)]`}
                              >
                                {cat.id === "CONTACT" ? "Contact" : "Joined"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "8px 24px",
                                  borderBottom:
                                    "1px solid rgba(255,255,255,0.05)",
                                  width: "10%",
                                }}
                                className="text-[var(--color-text-secondary)] font-normal text-[12px] tracking-[0.3em] uppercase whitespace-nowrap bg-[var(--color-bg-paper)]"
                              >
                                Status
                              </TableCell>
                              <TableCell
                                align="right"
                                sx={{
                                  padding: "8px 24px",
                                  borderBottom:
                                    "1px solid rgba(255,255,255,0.05)",
                                  width: "10%",
                                }}
                                className="text-primary font-normal text-[12px] tracking-[0.3em] uppercase whitespace-nowrap bg-[var(--color-bg-paper)]"
                              >
                                Actions
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody className="divide-y divide-white/[0.04]">
                            {cat.data.length === 0 ? (
                              <TableRow
                                sx={{
                                  height: "44px",
                                  "&:hover": { backgroundColor: "transparent" },
                                }}
                              >
                                <TableCell
                                  colSpan={7}
                                  align="center"
                                  sx={{
                                    padding: "8px",
                                    borderBottom:
                                      "1px solid rgba(255,255,255,0.05)",
                                  }}
                                  className="text-[var(--color-text-dim)] text-[12px] font-normal"
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
                                          "rgba(255,255,255,0.02)",
                                      },
                                      height: "28px",
                                      borderBottom:
                                        "1px solid rgba(255,255,255,0.05)",
                                      transition: "background-color 0.2s ease",
                                    }}
                                  >
                                    <TableCell
                                      sx={{
                                        padding: "8px 24px",
                                        width: "8%",
                                        borderBottom: "none",
                                      }}
                                      className="text-white align-middle font-normal text-[12px] whitespace-nowrap"
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
                                      sx={{
                                        padding: "8px 24px",
                                        width: "15%",
                                        borderBottom: "none",
                                      }}
                                      className={`font-normal align-middle transition-colors text-[12px] ${isActive ? "text-white" : "text-white/40 line-through"}`}
                                    >
                                      {item.VA_Name || item.VCP_Name || "-"}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        padding: "8px 24px",
                                        width: "20%",
                                        borderBottom: "none",
                                      }}
                                      className={`font-normal align-middle transition-colors text-[12px] whitespace-nowrap ${isActive ? "text-white/70" : "text-white/20"}`}
                                    >
                                      {item.VA_Email || item.VCP_Email}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        padding: "8px 24px",
                                        width: "12%",
                                        borderBottom: "none",
                                      }}
                                      className={`hidden sm:table-cell align-middle transition-colors font-normal text-[12px] ${isActive ? "text-white/70" : "text-white/20"}`}
                                    >
                                      {item.VA_Role ||
                                        item.VCP_Department ||
                                        "-"}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        padding: "8px 24px",
                                        width: "15%",
                                        borderBottom: "none",
                                      }}
                                      className={`hidden md:table-cell align-middle transition-colors font-normal text-[12px] ${isActive ? "text-white/70" : "text-white/20"}`}
                                    >
                                      {item.VA_Created_Date
                                        ? item.VA_Created_Date.split(" ")[0]
                                        : getContactMobile(item) ||
                                          "AUTHEN.SYSTEM"}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        padding: "8px 24px",
                                        width: "10%",
                                        borderBottom: "none",
                                      }}
                                      className="text-[12px] align-middle font-normal"
                                    >
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
                                      sx={{
                                        padding: "8px 24px",
                                        width: "10%",
                                        borderBottom: "none",
                                      }}
                                      align="right"
                                      className="text-[12px] align-middle font-normal"
                                    >
                                      <IconButton
                                        onClick={() =>
                                          openModal("edit", item, cat.id)
                                        }
                                        size="small"
                                        className="text-white/40 hover:text-white p-1"
                                      >
                                        <Edit size={16} />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 animate-fade-in overflow-y-auto">
          <div
            className={`bg-[var(--color-bg-paper)] border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl w-[95%] sm:w-full sm:max-w-2xl md:max-w-3xl overflow-hidden relative my-auto`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none rounded-2xl sm:rounded-3xl"></div>

            <div
              className={`flex justify-between items-center ${headerPaddingClass} border-b border-white/5 relative z-10 bg-black/20`}
            >
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wider">
                {modalMode === "add" ? "Add system user" : "Edit user profile"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors p-1.5 sm:p-2"
                title="Close"
              >
                <X size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            <form
              onSubmit={handleFormSubmit}
              className={`${formSpacingClass} relative z-10 max-h-[85vh] sm:max-h-[80vh] overflow-y-auto custom-scrollbar`}
            >
              <div className="space-y-1">
                <label className="text-[11px] sm:text-[12px] text-primary tracking-[0.14em] font-normal flex items-center gap-1.5 sm:gap-2 px-0.5">
                  <User size={10} className="text-primary/60 shrink-0" /> Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg ${fieldSizeClass} text-white focus:outline-none transition-colors ${
                    errors.name
                      ? "bg-red-500/20 border border-red-500/50 focus:border-red-500/70"
                      : "bg-black/40 border border-white/10 focus:border-primary/50"
                  }`}
                  placeholder="e.g. John Doe"
                />
                {errors.name && (
                  <p className="text-[10px] sm:text-[11px] text-red-400 font-normal mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] sm:text-[12px] text-primary tracking-[0.14em] font-normal flex items-center gap-1.5 sm:gap-2 px-0.5">
                  <Mail size={10} className="text-primary/60 shrink-0" /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg ${fieldSizeClass} text-white focus:outline-none transition-colors ${
                    errors.email
                      ? "bg-red-500/20 border border-red-500/50 focus:border-red-500/70"
                      : "bg-black/40 border border-white/10 focus:border-primary/50"
                  }`}
                  placeholder="example@mas.com"
                />
                {errors.email && (
                  <p className="text-[10px] sm:text-[11px] text-red-400 font-normal mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {formData.type === "CONTACT" ? (
                <>
                  <div className="space-y-1">
                    <label className="text-[11px] sm:text-[12px] text-primary tracking-[0.14em] font-normal flex items-center gap-1.5 sm:gap-2 px-0.5">
                      <Users size={10} className="text-primary/60 shrink-0" />{" "}
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg ${fieldSizeClass} text-white focus:outline-none transition-colors ${
                        errors.department
                          ? "bg-red-500/20 border border-red-500/50 focus:border-red-500/70"
                          : "bg-black/40 border border-white/10 focus:border-primary/50"
                      }`}
                      placeholder="e.g. Human Resources"
                    />
                    {errors.department && (
                      <p className="text-[10px] sm:text-[11px] text-red-400 font-normal mt-1">
                        {errors.department}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] sm:text-[12px] text-primary tracking-[0.14em] font-normal flex items-center gap-1.5 sm:gap-2 px-0.5">
                      <Phone size={10} className="text-primary/60 shrink-0" />{" "}
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      maxLength={10}
                      className={`w-full rounded-lg ${fieldSizeClass} text-white focus:outline-none transition-colors ${
                        errors.phone
                          ? "bg-red-500/20 border border-red-500/50 focus:border-red-500/70"
                          : "bg-black/40 border border-white/10 focus:border-primary/50"
                      }`}
                      placeholder="e.g. +94 123 4567"
                    />
                    {errors.phone && (
                      <p className="text-[10px] sm:text-[11px] text-red-400 font-normal mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-[11px] sm:text-[12px] text-primary tracking-[0.14em] font-normal flex items-center gap-1.5 sm:gap-2 px-0.5">
                      <Users size={10} className="text-primary/60 shrink-0" />{" "}
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg ${fieldSizeClass} text-white focus:outline-none transition-colors ${
                        errors.department
                          ? "bg-red-500/20 border border-red-500/50 focus:border-red-500/70"
                          : "bg-black/40 border border-white/10 focus:border-primary/50"
                      }`}
                      placeholder="e.g. Human Resources"
                    />
                    {errors.department && (
                      <p className="text-[10px] sm:text-[11px] text-red-400 font-normal mt-1">
                        {errors.department}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] sm:text-[12px] text-primary tracking-[0.14em] font-normal flex items-center gap-1.5 sm:gap-2 px-0.5">
                      <Phone size={10} className="text-primary/60 shrink-0" />{" "}
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      maxLength={10}
                      className={`w-full rounded-lg ${fieldSizeClass} text-white focus:outline-none transition-colors ${
                        errors.phone
                          ? "bg-red-500/20 border border-red-500/50 focus:border-red-500/70"
                          : "bg-black/40 border border-white/10 focus:border-primary/50"
                      }`}
                      placeholder="e.g. 0712345678"
                    />
                    {errors.phone ? (
                      <p className="text-[10px] sm:text-[11px] text-red-400 font-normal mt-1">
                        {errors.phone}
                      </p>
                    ) : (
                      <p className="text-[9px] sm:text-[10px] text-white/30 uppercase tracking-widest mt-1">
                        10 digits only
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] sm:text-[12px] text-primary tracking-[0.14em] font-normal flex items-center gap-1.5 sm:gap-2 px-0.5">
                      <Shield size={10} className="text-primary/60 shrink-0" />{" "}
                      Role
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg ${fieldSizeClass} text-white focus:outline-none transition-colors ${
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
                      <p className="text-[10px] sm:text-[11px] text-red-400 font-normal mt-1">
                        {errors.role}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] sm:text-[12px] text-primary tracking-[0.14em] font-normal flex items-center gap-1.5 sm:gap-2 px-0.5">
                      <Hash size={10} className="text-primary/60 shrink-0" />{" "}
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        maxLength={5}
                        className={`w-full rounded-lg pl-3 sm:pl-3.5 pr-8 sm:pr-10 py-2 sm:py-2.5 text-[11px] sm:text-[12px] text-white focus:outline-none transition-colors ${
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
                        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
                      >
                        {showPassword ? (
                          <EyeOff size={14} className="sm:w-4 sm:h-4" />
                        ) : (
                          <Eye size={14} className="sm:w-4 sm:h-4" />
                        )}
                      </button>
                    </div>
                    {errors.password ? (
                      <p className="text-[10px] sm:text-[11px] text-red-400 font-normal mt-1">
                        {errors.password}
                      </p>
                    ) : (
                      <p className="text-[9px] sm:text-[10px] text-white/30 uppercase tracking-widest mt-1">
                        Max 5 chars, Capital &amp; Special
                      </p>
                    )}
                  </div>
                </>
              )}

              <div
                className={`${actionsPaddingClass} justify-end border-t border-white/5`}
              >
                <button
                  type="button"
                  onClick={closeModal}
                  className={`${actionButtonSizeClass} rounded-lg font-normal text-gray-400 hover:bg-white/5 tracking-wider transition-all`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${actionButtonSizeClass} rounded-lg bg-primary hover:bg-primary/90 text-white font-normal tracking-wider shadow-lg shadow-primary/20 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-primary`}
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
