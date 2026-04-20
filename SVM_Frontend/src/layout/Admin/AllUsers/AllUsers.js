import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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

const StatusBadge = ({ status }) => {
  const s = (status || "").toString().trim().toUpperCase();
  if (s === "ACTIVE" || s === "A") {
    return (
      <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg text-[12px] font-medium tracking-[0.2em] uppercase flex items-center gap-2 w-max">
        <CheckCircle2 size={12} /> Active
      </div>
    );
  }
  return (
    <div className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-lg text-[12px] font-medium tracking-[0.2em] uppercase flex items-center gap-2 w-max">
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
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
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

  const categories = [
    {
      id: "ADMIN",
      title: "System Administrators",
      icon: ShieldAlert,
      data: administrators.filter((a) => a.VA_Role === "Admin"),
    },
    {
      id: "SECURITY",
      title: "Security Officers",
      icon: Shield,
      data: administrators.filter((a) => a.VA_Role === "Security"),
    },
    {
      id: "CONTACT",
      title: "Contact Persons",
      icon: Users,
      data: contactPersons,
    },
    {
      id: "VISITOR",
      title: "Visitor Accounts",
      icon: UserCheck,
      data: administrators.filter((a) => a.VA_Role === "Visitor"),
    },
  ];

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

  const loading = adminLoading || contactLoading;
  const error = adminError || contactError;

  return (
    <div className="flex flex-col min-w-0 bg-[var(--color-bg-default)] min-h-screen">
      <Header />

      <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full animate-fade-in-slow relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        <div className="max-w-[1600px] mx-auto">
          <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/[0.03] pb-6 gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-[2px] bg-primary"></div>
                <span className="text-primary uppercase tracking-wider text-xs font-semibold">
                  User Directory
                </span>
              </div>
              <h1 className="text-white uppercase px-1 text-2xl font-bold tracking-tight">
                All System Users
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
              {/* Search Form */}
              <form
                onSubmit={handleSearch}
                className="flex items-center bg-black/40 border border-white/10 hover:border-white/20 transition-colors rounded-xl px-4 py-3 min-w-[300px]"
              >
                <Search size={16} className="text-gray-400 mr-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search across all roles..."
                  className="bg-transparent text-[13px] text-white focus:outline-none w-full"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="text-gray-500 hover:text-white"
                  >
                    <RefreshCw size={14} />
                  </button>
                )}
              </form>

              <div
                className="flex items-center transition-colors rounded-xl px-3 py-2 min-w-[180px]"
                style={{
                  background: themeMode === "light" ? "#ffffff" : undefined,
                }}
              >
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`text-[13px] focus:outline-none w-full ${themeMode === "light" ? "text-black bg-white border border-gray-200" : "bg-black/40 text-white border border-white/10 hover:border-white/20"}`}
                >
                  <option
                    value="ALL"
                    className={
                      themeMode === "light"
                        ? "bg-white text-black"
                        : "bg-[#0f0f10]"
                    }
                  >
                    All Statuses
                  </option>
                  <option
                    value="ACTIVE"
                    className={
                      themeMode === "light"
                        ? "bg-white text-black"
                        : "bg-[#0f0f10]"
                    }
                  >
                    Active
                  </option>
                  <option
                    value="INACTIVE"
                    className={
                      themeMode === "light"
                        ? "bg-white text-black"
                        : "bg-[#0f0f10]"
                    }
                  >
                    Inactive
                  </option>
                </select>
              </div>

              <button
                onClick={() => openModal("add")}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl text-[13px] font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-primary/20"
              >
                <Plus size={16} /> Add New User
              </button>
            </div>
          </header>

          <div className="space-y-12">
            {loading ? (
              <div className="p-20 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 border-4 border-white/5 border-t-primary rounded-full animate-spin mb-6"></div>
                <p className="text-gray-300 text-[13px] uppercase tracking-[0.3em] font-medium">
                  Loading Users...
                </p>
              </div>
            ) : error ? (
              <div className="p-20 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20 text-primary">
                  <AlertCircle size={24} />
                </div>
                <p className="text-primary text-[14px] uppercase tracking-widest">
                  {error}
                </p>
              </div>
            ) : (
              filteredCategories.map((cat) => (
                <section key={cat.id} className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/5">
                      <cat.icon size={20} />
                    </div>
                    <div>
                      <h2 className="text-white text-lg font-bold tracking-widest uppercase">
                        {cat.title}
                      </h2>
                      <p className="text-white/30 text-[10px] tracking-[0.3em] uppercase font-medium">
                        {cat.data.length} Total Users
                      </p>
                    </div>
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-white/10 to-transparent ml-4"></div>
                  </div>

                  <div className="bg-[var(--color-bg-paper)] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none opacity-50"></div>
                    <TableContainer
                      component={Paper}
                      className="bg-[#0F0F10] border border-white/5 rounded-none z-10 relative"
                    >
                      <Table
                        sx={{ minWidth: 650 }}
                        aria-label={`${cat.title} table`}
                      >
                        <TableHead className="bg-black/40">
                          <TableRow>
                            <TableCell className="text-white/40 font-bold uppercase tracking-wider text-[11px] border-b-white/5">
                              User ID
                            </TableCell>
                            <TableCell className="text-white/40 font-bold uppercase tracking-wider text-[11px] border-b-white/5">
                              Name
                            </TableCell>
                            <TableCell className="text-white/40 font-bold uppercase tracking-wider text-[11px] border-b-white/5">
                              {cat.id === "CONTACT"
                                ? "Department"
                                : "Role"}
                            </TableCell>
                            <TableCell className="text-white/40 font-bold uppercase tracking-wider text-[11px] border-b-white/5">
                              {cat.id === "CONTACT"
                                ? "Phone Number"
                                : "Date Joined"}
                            </TableCell>
                            <TableCell className="text-white/40 font-bold uppercase tracking-wider text-[11px] border-b-white/5">
                              Status
                            </TableCell>
                            <TableCell
                              className="text-white/40 font-bold uppercase tracking-wider text-[11px] border-b-white/5"
                              align="right"
                            >
                              Action
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {cat.data.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={6}
                                align="center"
                                className="py-12 text-white/40 uppercase tracking-widest text-sm border-b-white/5"
                              >
                                No users found in this category
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
                                    "&:last-child td, &:last-child th": {
                                      border: 0,
                                    },
                                    "&:hover": {
                                      backgroundColor: "rgba(255,255,255,0.02)",
                                    },
                                  }}
                                >
                                  <TableCell className="text-white/70 font-medium border-b-white/5">
                                    <div className="flex items-center gap-2">
                                      <Hash
                                        size={12}
                                        className="text-primary/40"
                                      />
                                      <span>
                                        {item.VA_Admin_id ||
                                          item.VCP_Contact_person_id}
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell
                                    className={`font-medium border-b-white/5 transition-colors ${isActive ? "text-white" : "text-white/30 line-through"}`}
                                  >
                                    {item.VA_Name || item.VCP_Name || "-"}
                                    <p className="text-gray-400 text-[10px] tracking-[0.1em] lowercase mt-1 opacity-70">
                                      {item.VA_Email || item.VCP_Email}
                                    </p>
                                  </TableCell>
                                  <TableCell
                                    className={`border-b-white/5 transition-colors ${isActive ? "text-white/70" : "text-white/20"}`}
                                  >
                                    {item.VA_Role || item.VCP_Department || "-"}
                                  </TableCell>
                                  <TableCell
                                    className={`border-b-white/5 transition-colors ${isActive ? "text-white/70" : "text-white/20"}`}
                                  >
                                    {item.VA_Created_Date
                                      ? item.VA_Created_Date.split(" ")[0]
                                      : item.VCP_Phone || "AUTHEN.SYSTEM"}
                                  </TableCell>
                                  <TableCell className="border-b-white/5">
                                    <button
                                      onClick={() =>
                                        handleToggleStatus(item, cat.id)
                                      }
                                      disabled={loading}
                                      title="Click to toggle status"
                                      className={`px-2 py-1 text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer ${isActive ? "bg-green-500/10 text-green-400 hover:bg-green-500/20" : "bg-red-500/10 text-red-400 hover:bg-red-500/20"}`}
                                    >
                                      {isActive ? "ACTIVE" : "INACTIVE"}
                                    </button>
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    className="border-b-white/5"
                                  >
                                    <IconButton
                                      onClick={() =>
                                        openModal("edit", item, cat.id)
                                      }
                                      size="small"
                                      className="text-white/40 hover:text-white"
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
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal for Add / Edit Administrator */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[var(--color-bg-paper)] border border-white/10 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>

            <div className="flex justify-between items-center p-6 border-b border-white/5 relative z-10">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                {modalMode === "add"
                  ? "Add New System Admin"
                  : "Edit Administrator Profile"}
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
              className="p-6 space-y-4 relative z-10"
            >
              <div className="space-y-1">
                <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex gap-2">
                  <User size={12} /> Name
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-white focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex gap-2">
                  <Mail size={12} /> Email
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-white focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="example@mas.com"
                />
              </div>

              {formData.type === "CONTACT" ? (
                <>
                  <div className="space-y-1">
                    <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex gap-2">
                      <Users size={12} /> Department
                    </label>
                    <input
                      required
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-white focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="e.g. Human Resources"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex gap-2">
                      <X size={12} /> Phone Connection
                    </label>
                    <input
                      required
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-white focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="e.g. +94 123 4567"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex gap-2">
                      <Users size={12} /> Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-white focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="e.g. Human Resources"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex gap-2">
                      <Phone size={12} /> Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-white focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="e.g. +94 123 4567"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex gap-2">
                      <Shield size={12} /> Role
                    </label>
                    <input
                      required
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-white focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="e.g. Admin, Security"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex gap-2">
                      <Hash size={12} /> Password
                    </label>
                    <input
                      required={modalMode === "add"}
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-white focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder={
                        modalMode === "add"
                          ? "Enter secure password"
                          : "Leave blank to keep current"
                      }
                    />
                  </div>
                </>
              )}

              <div className="pt-6 flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 rounded-xl text-[13px] font-bold text-gray-400 hover:bg-white/5 uppercase tracking-wider transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white text-[13px] font-bold uppercase tracking-wider shadow-lg shadow-primary/20 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-primary"
                >
                  {modalMode === "add" ? "Create Node" : "Update Access"}
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
