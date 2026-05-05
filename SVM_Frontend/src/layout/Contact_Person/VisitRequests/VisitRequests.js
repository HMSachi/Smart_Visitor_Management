import React, { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

import { Menu, MenuItem } from "@mui/material";
import {
  AddVisitRequest,
  UpdateVisitRequest,
  GetVisitRequestsByCP,
  ApproveVisitRequest,
} from "../../../actions/VisitRequestAction";
import { GetVisitorsByCP } from "../../../actions/VisitorAction";
import { AddVehicle } from "../../../actions/VehicleAction";
import VisitRequestService from "../../../services/VisitRequestService";
import VehicleService from "../../../services/VehicleService";
import VisitGroupService from "../../../services/VisitGroupService";
import ItemCarriedService from "../../../services/ItemCarriedService";
import ContactPersonService from "../../../services/ContactPersonService";
import Header from "../../../components/Contact_Person/Layout/Header";

import { useThemeMode } from "../../../theme/ThemeModeContext";
import {
  Search,
  Plus,
  Eye,
  X,
  Calendar,
  MapPin,
  ClipboardList,
  Send,
  Edit,
  CheckCircle2,
  XCircle,
  Clock,
  Hash,
  User,
  AlertCircle,
  Filter,
  ChevronDown,
  Car,
  MoreVertical,
  Save,
  Loader2,
  Package,
  Users,
  Pencil,
  Briefcase,
} from "lucide-react";
import { setSelectedRequest } from "../../../reducers/contactPersonSlice";

const StatusBadge = ({ status }) => {
  const s = (status || "").toString().trim().toUpperCase();
  switch (s) {
    case "A":
    case "APPROVED":
      return (
        <div className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-500 rounded-md text-[10px] font-bold tracking-[0.1em] uppercase flex items-center justify-center w-max shadow-sm">
          Admin Approved
        </div>
      );
    case "R":
    case "REJECTED":
      return (
        <div className="px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary rounded-md text-[10px] font-bold tracking-[0.1em] uppercase flex items-center justify-center w-max shadow-sm">
          Declined
        </div>
      );
    case "ACCEPTED":
      return (
        <div className="px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-md text-[10px] font-bold tracking-[0.1em] uppercase flex items-center justify-center w-max shadow-sm">
          Accepted by Visitor
        </div>
      );
    case "SENT":
    case "SENT_TO_ADMIN":
      return (
        <div className="px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-md text-[10px] font-bold tracking-[0.1em] uppercase flex items-center justify-center w-max shadow-sm">
          Accepted by Contact Person
        </div>
      );
    case "P":
    case "PENDING":
    default:
      return (
        <div className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-md text-[10px] font-bold tracking-[0.1em] uppercase flex items-center justify-center w-max shadow-sm">
          Sent to Visitor
        </div>
      );
  }
};

const toDateInputValue = (value) => {
  if (!value) return "";

  if (typeof value === "string") {
    const directMatch = value.match(/^\d{4}-\d{2}-\d{2}/);
    if (directMatch) return directMatch[0];
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return "";

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const VisitRequests = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { visitRequestsByCP, isLoading, error } = useSelector(
    (state) => state.visitRequestsState,
  );
  const { visitorsByCP } = useSelector((state) => state.visitorManagement);
  const { themeMode } = useThemeMode();
  const isLight = themeMode === "light";

  const user = useSelector((state) => state.login.user);
  const userEmail = user?.ResultSet?.[0]?.VA_Email;
  const [cpId, setCpId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(
    location.state?.initialFilter || "All",
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [expandedAreasByRequest, setExpandedAreasByRequest] = useState({});
  const [formData, setFormData] = useState({
    VVR_Request_id: "",
    VVR_Visitor_id: "",
    VVR_Contact_person_id: "",
    VVR_Visit_Date: "",
    VVR_Places_to_Visit: "",
    VVR_Purpose: "",
    VV_Vehicle_Type: "",
    VV_Vehicle_Number: "",
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReq, setSelectedReq] = useState(null);
  const [visitorSearchOpen, setVisitorSearchOpen] = useState(false);
  const [visitorSearchTerm, setVisitorSearchTerm] = useState("");

  // ─── Full-screen Edit Form State ────────────────────────────────────────────
  const [editingRequest, setEditingRequest] = useState(null);
  const [editForm, setEditForm] = useState({
    VVR_Visit_Date: "",
    VVR_Places_to_Visit: "",
    VVR_Purpose: "",
  });
  const [editVehicles, setEditVehicles] = useState([]);
  const [editGroupMembers, setEditGroupMembers] = useState([]);
  const [editItems, setEditItems] = useState([]);
  const [editSaving, setEditSaving] = useState(false);
  const [editLoadingData, setEditLoadingData] = useState(false);
  const [vehicleSavingIdx, setVehicleSavingIdx] = useState(null);
  const [memberSavingIdx, setMemberSavingIdx] = useState(null);
  const [itemSavingIdx, setItemSavingIdx] = useState(null);
  const [newVehicleSavingIdx, setNewVehicleSavingIdx] = useState(null);
  const [newMemberSavingIdx, setNewMemberSavingIdx] = useState(null);
  const [newItemSavingIdx, setNewItemSavingIdx] = useState(null);
  const [rowSuccess, setRowSuccess] = useState({});
  const [editError, setEditError] = useState("");
  const [dirtyRows, setDirtyRows] = useState(new Set());
  const [warnDirty, setWarnDirty] = useState(false);
  const rowRefs = useRef({});

  const handleMenuOpen = (event, req) => {
    setAnchorEl(event.currentTarget);
    setSelectedReq(req);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReq(null);
  };

  const handleDisableRequest = async () => {
    if (selectedReq) {
      const payload = {
        VVR_Request_id: selectedReq.VVR_Request_id,
        VVR_Visit_Date: selectedReq.VVR_Visit_Date
          ? selectedReq.VVR_Visit_Date.split("T")[0]
          : "",
        VVR_Places_to_Visit: selectedReq.VVR_Places_to_Visit || "",
        VVR_Purpose: selectedReq.VVR_Purpose || "",
        VVR_Status: "R",
        VVR_Contact_person_id: cpId,
      };
      await dispatch(UpdateVisitRequest(payload));
    }
    handleMenuClose();
  };

  const handleSendToAdmin = async () => {
    if (selectedReq) {
      const payload = {
        VVR_Request_id: selectedReq.VVR_Request_id,
        VVR_Visit_Date: selectedReq.VVR_Visit_Date
          ? selectedReq.VVR_Visit_Date.split("T")[0]
          : "",
        VVR_Places_to_Visit: selectedReq.VVR_Places_to_Visit || "",
        VVR_Purpose: selectedReq.VVR_Purpose || "",
        VVR_Status: "SENT_TO_ADMIN",
        VVR_Contact_person_id: cpId,
      };
      await dispatch(UpdateVisitRequest(payload));
      alert(
        "Request protocol initiated. Sent to Cloud Admin for final approval.",
      );
    }
    handleMenuClose();
  };

  useEffect(() => {
    const loadContactPersonId = async () => {
      try {
        const response = await ContactPersonService.GetAllContactPersons();
        const contactPersons = response?.data?.ResultSet || [];
        const match = contactPersons.find(
          (cp) =>
            cp?.VCP_Email?.trim().toLowerCase() ===
            userEmail?.trim().toLowerCase(),
        );

        if (match?.VCP_Contact_person_id) {
          setCpId(match.VCP_Contact_person_id);
          return;
        }

        setCpId(user?.ResultSet?.[0]?.VCP_Contact_person_id || null);
      } catch (err) {
        console.error("Error loading contact person:", err);
        setCpId(user?.ResultSet?.[0]?.VCP_Contact_person_id || null);
      }
    };

    if (userEmail) {
      loadContactPersonId();
    } else {
      setCpId(user?.ResultSet?.[0]?.VCP_Contact_person_id || null);
    }
  }, [userEmail, user]);

  useEffect(() => {
    if (!cpId) return;
    dispatch(GetVisitRequestsByCP(cpId));
    dispatch(GetVisitorsByCP(cpId));
    setFormData((prev) => ({ ...prev, VVR_Contact_person_id: cpId }));
  }, [dispatch, cpId]);

  const openModal = (mode, request = null) => {
    setModalMode(mode);
    if (request) {
      setFormData({
        VVR_Request_id: request.VVR_Request_id,
        VVR_Visitor_id: request.VVR_Visitor_id,
        VVR_Contact_person_id: cpId,
        VVR_Visit_Date: toDateInputValue(request.VVR_Visit_Date),
        VVR_Places_to_Visit: request.VVR_Places_to_Visit,
        VVR_Purpose: request.VVR_Purpose,
        VV_Vehicle_Type: "", // Reset for edit mode unless we fetch existing vehicle
        VV_Vehicle_Number: "",
      });
    } else {
      setFormData({
        VVR_Request_id: "",
        VVR_Visitor_id: "",
        VVR_Contact_person_id: cpId,
        VVR_Visit_Date: "",
        VVR_Places_to_Visit: "",
        VVR_Purpose: "",
        VV_Vehicle_Type: "",
        VV_Vehicle_Number: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (modalMode === "add") {
        response = await dispatch(AddVisitRequest(formData));

        // Extract Request ID for vehicle registration
        const requestId =
          response?.ResultSet?.[0]?.VVR_Request_id ||
          response?.VVR_Request_id ||
          0;

        // If vehicle details provided, add them
        if (
          requestId &&
          (formData.VV_Vehicle_Number || formData.VV_Vehicle_Type)
        ) {
          dispatch(
            AddVehicle({
              VV_Vehicle_Type: formData.VV_Vehicle_Type || "N/A",
              VV_Vehicle_Number: formData.VV_Vehicle_Number || "N/A",
              VVR_Request_id: requestId,
            }),
          );
        }
      } else {
        dispatch(UpdateVisitRequest(formData));
      }
    } catch (err) {
      console.error("Submission failed:", err);
    }
    closeModal();
  };

  const handleAction = (id, status) => {
    dispatch(ApproveVisitRequest(id, status));
    setTimeout(() => dispatch(GetVisitRequestsByCP(cpId)), 2000);
  };

  // ─── Edit Form Helpers ────────────────────────────────────────────────────────
  const flashSuccess = (key) => {
    setRowSuccess((s) => ({ ...s, [key]: true }));
    setTimeout(
      () =>
        setRowSuccess((s) => {
          const n = { ...s };
          delete n[key];
          return n;
        }),
      2000,
    );
  };
  const clearDirty = (key) =>
    setDirtyRows((p) => {
      const n = new Set(p);
      n.delete(key);
      return n;
    });
  const isVehicleDirty = (v) => {
    if (v._isNew) return true;
    if (!v._original) return false;
    return v.VV_Vehicle_Number !== v._original.VV_Vehicle_Number;
  };
  const isMemberDirty = (m) => {
    if (m._isNew) return true;
    if (!m._original) return false;
    return (
      m.VVG_Visitor_Name !== m._original.VVG_Visitor_Name ||
      m.VVG_Designation !== m._original.VVG_Designation
    );
  };
  const isItemDirty = (it) => {
    if (it._isNew) return true;
    if (!it._original) return false;
    return (
      it.VIC_Item_Name !== it._original.VIC_Item_Name ||
      it.VIC_Quantity !== it._original.VIC_Quantity ||
      it.VIC_Designation !== it._original.VIC_Designation
    );
  };

  const handleOpenEdit = async (req) => {
    setEditingRequest(req);
    setEditError("");
    setDirtyRows(new Set());
    setWarnDirty(false);
    setEditForm({
      VVR_Visit_Date: toDateInputValue(req.VVR_Visit_Date),
      VVR_Places_to_Visit: req.VVR_Places_to_Visit || "",
      VVR_Purpose: req.VVR_Purpose || "",
    });
    setEditVehicles([]);
    setEditGroupMembers([]);
    setEditItems([]);
    setEditLoadingData(true);
    try {
      const reqId = String(req.VVR_Request_id);
      const [vRes, gRes, iRes] = await Promise.all([
        VehicleService.GetAllVehicles(),
        VisitGroupService.GetAllVisitGroup(),
        ItemCarriedService.GetAllItemsCarried(),
      ]);
      const allV = vRes?.data?.ResultSet || vRes?.data || [];
      setEditVehicles(
        (Array.isArray(allV) ? allV : [])
          .filter((v) => String(v.VVR_Request_id) === reqId)
          .map((v) => ({
            VV_Vehicle_id: v.VV_Vehicle_id,
            VV_Vehicle_Number: v.VV_Vehicle_Number || "",
            VV_Vehicle_Type: v.VV_Vehicle_Type || "",
            _original: {
              VV_Vehicle_Number: v.VV_Vehicle_Number || "",
              VV_Vehicle_Type: v.VV_Vehicle_Type || "",
            },
          })),
      );
      const allG = gRes?.data?.ResultSet || gRes?.data || [];
      setEditGroupMembers(
        (Array.isArray(allG) ? allG : [])
          .filter((m) => String(m.VVR_Request_id) === reqId)
          .map((m) => ({
            VVG_id: m.VVG_id,
            VVG_Visitor_Name: m.VVG_Visitor_Name || "",
            VVG_NIC_Passport_Number: m.VVG_NIC_Passport_Number || "",
            VVG_Designation: m.VVG_Designation || "",
            VVR_Request_id: m.VVR_Request_id,
            _original: {
              VVG_Visitor_Name: m.VVG_Visitor_Name || "",
              VVG_Designation: m.VVG_Designation || "",
            },
          })),
      );
      const allI = iRes?.data?.ResultSet || iRes?.data || [];
      setEditItems(
        (Array.isArray(allI) ? allI : [])
          .filter((i) => String(i.VVR_Request_id) === reqId)
          .map((i) => ({
            VIC_Item_id: i.VIC_Item_id,
            VIC_Item_Name: i.VIC_Item_Name || "",
            VIC_Quantity: String(i.VIC_Quantity || ""),
            VIC_Designation: i.VIC_Designation || "",
            _original: {
              VIC_Item_Name: i.VIC_Item_Name || "",
              VIC_Quantity: String(i.VIC_Quantity || ""),
              VIC_Designation: i.VIC_Designation || "",
            },
          })),
      );
    } catch (e) {
      console.error(e);
    } finally {
      setEditLoadingData(false);
    }
  };
  const handleCloseEdit = () => {
    if (editSaving) return;
    setEditingRequest(null);
    setEditError("");
    setRowSuccess({});
    setDirtyRows(new Set());
    setWarnDirty(false);
  };
  const handleSaveCore = async () => {
    if (!editingRequest) return;
    if (
      !editForm.VVR_Visit_Date ||
      !editForm.VVR_Places_to_Visit ||
      !editForm.VVR_Purpose
    ) {
      setEditError("All fields are required.");
      return;
    }
    const unsaved = [];
    editVehicles.forEach((v, i) => {
      if (isVehicleDirty(v)) unsaved.push(`vehicle-${i}`);
    });
    editGroupMembers.forEach((m, i) => {
      if (isMemberDirty(m)) unsaved.push(`member-${i}`);
    });
    editItems.forEach((it, i) => {
      if (isItemDirty(it)) unsaved.push(`item-${i}`);
    });
    if (unsaved.length > 0) {
      setDirtyRows(new Set(unsaved));
      setWarnDirty(true);
      setEditError(
        `${unsaved.length} row(s) have unsaved changes. Click Update/Submit on highlighted rows first.`,
      );
      const el = rowRefs.current[unsaved[0]];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setWarnDirty(false);
    setEditSaving(true);
    setEditError("");
    try {
      await VisitRequestService.UpdateVisitRequest({
        VVR_Request_id: editingRequest.VVR_Request_id,
        VVR_Visit_Date: editForm.VVR_Visit_Date,
        VVR_Places_to_Visit: editForm.VVR_Places_to_Visit,
        VVR_Purpose: editForm.VVR_Purpose,
        VVR_Status: editingRequest.VVR_Status,
      });
      dispatch(GetVisitRequestsByCP(cpId));
      flashSuccess("core");
      setTimeout(() => {
        setEditingRequest(null);
        setEditError("");
        setRowSuccess({});
        setDirtyRows(new Set());
      }, 800);
    } catch (e) {
      console.error(e);
      setEditError("Failed to save. Please try again.");
    } finally {
      setEditSaving(false);
    }
  };
  const handleUpdateVehicle = async (idx) => {
    const v = editVehicles[idx];
    if (!v?.VV_Vehicle_id || vehicleSavingIdx !== null) return;
    setVehicleSavingIdx(idx);
    try {
      await VehicleService.UpdateVehicle({
        VV_Vehicle_id: v.VV_Vehicle_id,
        VV_Vehicle_Number: v.VV_Vehicle_Number,
      });
      setEditVehicles((a) =>
        a.map((x, i) =>
          i === idx
            ? {
              ...x,
              _original: {
                VV_Vehicle_Number: x.VV_Vehicle_Number,
                VV_Vehicle_Type: x.VV_Vehicle_Type,
              },
            }
            : x,
        ),
      );
      clearDirty(`vehicle-${idx}`);
      flashSuccess(`vehicle-${idx}`);
    } catch (e) {
      console.error(e);
    } finally {
      setVehicleSavingIdx(null);
    }
  };
  const handleAddVehicle = async (idx) => {
    const v = editVehicles[idx];
    if (!v?._isNew || newVehicleSavingIdx !== null) return;
    if (!v.VV_Vehicle_Number || !v.VV_Vehicle_Type) {
      setEditError("Vehicle number and type required.");
      return;
    }
    setNewVehicleSavingIdx(idx);
    setEditError("");
    try {
      await VehicleService.AddVehicle({
        VV_Vehicle_Number: v.VV_Vehicle_Number,
        VV_Vehicle_Type: v.VV_Vehicle_Type,
        VVR_Request_id: editingRequest.VVR_Request_id,
      });
      setEditVehicles((a) =>
        a.map((x, i) =>
          i === idx
            ? {
              ...x,
              _isNew: false,
              VV_Vehicle_id: "saved",
              _original: {
                VV_Vehicle_Number: x.VV_Vehicle_Number,
                VV_Vehicle_Type: x.VV_Vehicle_Type,
              },
            }
            : x,
        ),
      );
      clearDirty(`vehicle-${idx}`);
      flashSuccess(`vehicle-${idx}`);
    } catch (e) {
      console.error(e);
      setEditError("Failed to add vehicle.");
    } finally {
      setNewVehicleSavingIdx(null);
    }
  };
  const handleUpdateMember = async (idx) => {
    const m = editGroupMembers[idx];
    if (!m?.VVG_id || memberSavingIdx !== null) return;
    setMemberSavingIdx(idx);
    try {
      await VisitGroupService.UpdateVisitGroup({
        VVG_id: m.VVG_id,
        VVG_Visitor_Name: m.VVG_Visitor_Name,
        VVG_Designation: m.VVG_Designation,
        VVG_Status: "A",
        VVR_Request_id: m.VVR_Request_id,
      });
      setEditGroupMembers((a) =>
        a.map((x, i) =>
          i === idx
            ? {
              ...x,
              _original: {
                VVG_Visitor_Name: x.VVG_Visitor_Name,
                VVG_Designation: x.VVG_Designation,
              },
            }
            : x,
        ),
      );
      clearDirty(`member-${idx}`);
      flashSuccess(`member-${idx}`);
    } catch (e) {
      console.error(e);
    } finally {
      setMemberSavingIdx(null);
    }
  };
  const handleSubmitNewMember = async (idx) => {
    const m = editGroupMembers[idx];
    if (!m?._isNew || newMemberSavingIdx !== null) return;
    if (!m.VVG_Visitor_Name || !m.VVG_NIC_Passport_Number) {
      setEditError("Name and ID required.");
      return;
    }
    setNewMemberSavingIdx(idx);
    setEditError("");
    try {
      await VisitGroupService.AddVisitGroup({
        VVG_Visitor_Name: m.VVG_Visitor_Name,
        VVG_NIC_Passport_Number: m.VVG_NIC_Passport_Number,
        VVG_Designation: m.VVG_Designation,
        VVG_Status: "A",
        VVR_Request_id: editingRequest.VVR_Request_id,
      });
      setEditGroupMembers((a) =>
        a.map((x, i) =>
          i === idx
            ? {
              ...x,
              _isNew: false,
              VVG_id: "saved",
              _original: {
                VVG_Visitor_Name: x.VVG_Visitor_Name,
                VVG_Designation: x.VVG_Designation,
              },
            }
            : x,
        ),
      );
      clearDirty(`member-${idx}`);
      flashSuccess(`member-${idx}`);
    } catch (e) {
      console.error(e);
      setEditError("Failed to add visitor.");
    } finally {
      setNewMemberSavingIdx(null);
    }
  };
  const handleUpdateItem = async (idx) => {
    const it = editItems[idx];
    if (!it?.VIC_Item_id || itemSavingIdx !== null) return;
    setItemSavingIdx(idx);
    try {
      await ItemCarriedService.UpdateItem({
        VIC_Item_id: it.VIC_Item_id,
        VIC_Item_Name: it.VIC_Item_Name,
        VIC_Quantity: it.VIC_Quantity,
        VIC_Designation: it.VIC_Designation,
      });
      setEditItems((a) =>
        a.map((x, i) =>
          i === idx
            ? {
              ...x,
              _original: {
                VIC_Item_Name: x.VIC_Item_Name,
                VIC_Quantity: x.VIC_Quantity,
                VIC_Designation: x.VIC_Designation,
              },
            }
            : x,
        ),
      );
      clearDirty(`item-${idx}`);
      flashSuccess(`item-${idx}`);
    } catch (e) {
      console.error(e);
    } finally {
      setItemSavingIdx(null);
    }
  };
  const handleSubmitNewItem = async (idx) => {
    const it = editItems[idx];
    if (!it?._isNew || newItemSavingIdx !== null) return;
    if (!it.VIC_Item_Name) {
      setEditError("Item name required.");
      return;
    }
    setNewItemSavingIdx(idx);
    setEditError("");
    try {
      await ItemCarriedService.AddItem({
        VIC_Item_Name: it.VIC_Item_Name,
        VIC_Quantity: it.VIC_Quantity || "1",
        VIC_Designation: it.VIC_Designation || "",
        VVR_Request_id: editingRequest.VVR_Request_id,
      });
      setEditItems((a) =>
        a.map((x, i) =>
          i === idx
            ? {
              ...x,
              _isNew: false,
              VIC_Item_id: "saved",
              _original: {
                VIC_Item_Name: x.VIC_Item_Name,
                VIC_Quantity: x.VIC_Quantity,
                VIC_Designation: x.VIC_Designation,
              },
            }
            : x,
        ),
      );
      clearDirty(`item-${idx}`);
      flashSuccess(`item-${idx}`);
    } catch (e) {
      console.error(e);
      setEditError("Failed to add item.");
    } finally {
      setNewItemSavingIdx(null);
    }
  };
  const handleRemoveNewRow = (section, idx) => {
    if (section === "vehicle")
      setEditVehicles((a) => a.filter((_, i) => i !== idx));
    if (section === "member")
      setEditGroupMembers((a) => a.filter((_, i) => i !== idx));
    if (section === "item") setEditItems((a) => a.filter((_, i) => i !== idx));
  };

  const handleReview = (requestId) => {
    dispatch(setSelectedRequest(requestId));
    navigate("/contact_person/request-review", {
      state: { requestId },
    });
  };

  const statusOptions = [
    { id: "All", label: "All Requests" },
    { id: "P", label: "Sent to Visitor" },
    { id: "ACCEPTED", label: "Visitor Accepted" },
    { id: "SENT", label: "Sent to Admin" },
    { id: "A", label: "Approved" },
    { id: "R", label: "Rejected" },
  ];

  const filteredRequests = useMemo(() => {
    if (!visitRequestsByCP) return [];

    return visitRequestsByCP
      .filter((req) => {
        const matchesSearch =
          String(req.VVR_Request_id).includes(searchTerm) ||
          req.VVR_Purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (req.VVR_Visitor_Name || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const reqStatus = (req.VVR_Status || "")
          .toString()
          .trim()
          .toUpperCase();
        let matchesStatus = statusFilter === "All";

        if (statusFilter === "P")
          matchesStatus = reqStatus === "P" || reqStatus === "PENDING";
        if (statusFilter === "ACCEPTED")
          matchesStatus = reqStatus === "ACCEPTED";
        if (statusFilter === "SENT")
          matchesStatus = reqStatus === "SENT" || reqStatus === "SENT_TO_ADMIN";
        if (statusFilter === "A")
          matchesStatus = reqStatus === "A" || reqStatus === "APPROVED";
        if (statusFilter === "R")
          matchesStatus = reqStatus === "R" || reqStatus === "REJECTED";

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => Number(b.VVR_Request_id) - Number(a.VVR_Request_id));
  }, [visitRequestsByCP, searchTerm, statusFilter]);

  const activeVisitors = (visitorsByCP || []).filter((visitor) => {
    const status = (visitor?.VV_Status || "").toString().trim().toUpperCase();
    return status === "A" || status === "ACTIVE";
  });

  const getVisitorDisplayName = (req) => {
    const requestName = req?.VVR_Visitor_Name?.trim();
    if (requestName) return requestName;

    const matchedVisitor = (visitorsByCP || []).find(
      (visitor) =>
        String(visitor?.VV_Visitor_id) === String(req?.VVR_Visitor_id),
    );

    return matchedVisitor?.VV_Name || req?.VVR_Visitor_id || "Unknown visitor";
  };

  const getVisitAreas = (value) => {
    if (Array.isArray(value)) {
      return value.map((item) => String(item).trim()).filter(Boolean);
    }

    if (typeof value !== "string") {
      return [];
    }

    return value
      .split("|")
      .flatMap((chunk) => chunk.split(","))
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const toggleVisitAreas = (requestId) => {
    setExpandedAreasByRequest((previous) => ({
      ...previous,
      [requestId]: !previous[requestId],
    }));
  };

  const renderVisitAreas = (req) => {
    const areas = getVisitAreas(req?.VVR_Places_to_Visit);
    const requestKey = req?.VVR_Request_id;
    const isExpanded = Boolean(expandedAreasByRequest[requestKey]);
    const visibleAreas = isExpanded ? areas : areas.slice(0, 1);
    const remainingCount = areas.length - visibleAreas.length;

    if (!areas.length) {
      return <span className="text-gray-400">No places listed</span>;
    }

    return (
      <div className="flex flex-col gap-2 min-w-0 max-w-full">
        <div className="flex flex-wrap gap-1.5 max-w-full">
          {visibleAreas.map((area, index) => (
            <span
              key={`${requestKey}-${area}-${index}`}
              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] max-w-full ${isLight ? "bg-[#F8F9FA] border-gray-200 text-[#1A1A1A]" : "bg-white/5 border-white/10 text-white/85"}`}
            >
              <span className="truncate">{area}</span>
            </span>
          ))}
        </div>

        {areas.length > 2 && (
          <button
            type="button"
            onClick={() => toggleVisitAreas(requestKey)}
            className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${isLight ? "text-primary hover:text-primary-hover" : "text-primary hover:text-primary-hover"}`}
          >
            <ChevronDown
              size={12}
              className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
            />
            {isExpanded ? "Show less" : `See ${remainingCount} more`}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-w-0 h-full">
      <Header title="" />

      <div className="p-3 md:p-5 animate-fade-in-slow relative max-w-[1700px] mx-auto w-full z-10">
        <header
          className={`mb-6 flex flex-col md:flex-row justify-between items-start md:items-end border-b pb-4 gap-3 relative ${isLight ? "border-gray-100" : "border-white/[0.03]"}`}
        >
          <div>
            <h2
              className={`text-[15px] font-bold tracking-tight uppercase ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
            >
              Active Visit Requests
            </h2>
            <p
              className={`text-[10px] font-bold uppercase tracking-[0.18em] mt-1 opacity-90 ${isLight ? "text-gray-500" : "text-white/50"}`}
            >
              Manage visitor applications
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
            <div
              className={`flex items-center border transition-all rounded-xl px-3 py-2 min-w-[220px] w-full sm:w-[240px] md:w-[250px] group shadow-sm ${isLight ? "bg-white border-gray-200 hover:border-primary/20 focus-within:border-primary/40" : "bg-black/40 border-white/10 focus-within:border-primary hover:border-white/20"}`}
            >
              <Search
                size={12}
                className={`transition-colors mr-2.5 ${isLight ? "text-gray-400 group-focus-within:text-primary" : "text-white/20 group-focus-within:text-primary"}`}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="SEARCH VISITOR..."
                className={`bg-transparent text-[10px] sm:text-[11px] focus:outline-none w-full uppercase tracking-widest ${isLight ? "text-[#1A1A1A] placeholder:text-gray-400" : "text-white placeholder:text-white/20"}`}
              />
            </div>

            <button
              onClick={() => navigate("/contact_person/create-visit-request")}
              className="flex flex-col md:flex-row items-center gap-2.5 md:gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.18em] transition-all shadow-[0_8px_20px_rgba(200,16,46,0.3)] active:scale-95 group"
            >
              <Plus
                size={15}
                className="group-hover:rotate-90 transition-transform"
              />{" "}
              Create Visit Request
            </button>
          </div>
        </header>

        {/* Status Filter Tabs - Modern Capsule Style */}
        <div className="mb-6 overflow-x-auto no-scrollbar pb-2">
          <div
            className={`inline-flex p-1 rounded-full border transition-all ${isLight ? "bg-white border-gray-100 shadow-sm" : "bg-black/20 border-white/5"}`}
          >
            {statusOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setStatusFilter(option.id)}
                className={`relative px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] transition-all duration-300 whitespace-nowrap ${statusFilter === option.id
                    ? "text-white"
                    : isLight
                      ? "text-gray-500 hover:text-primary"
                      : "text-white/40 hover:text-white"
                  }`}
              >
                {statusFilter === option.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary rounded-full shadow-[0_5px_15px_rgba(200,16,46,0.3)]"
                    transition={{
                      type: "spring",
                      bounce: 0.15,
                      duration: 0.5,
                    }}
                  />
                )}
                <span className="relative z-10">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div
          className={`border rounded-[20px] overflow-hidden relative ${isLight ? "bg-white border-gray-200 shadow-lg shadow-gray-200/40" : "bg-[#0F0F10] border-white/5"}`}
        >
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`h-16 rounded-2xl animate-pulse ${isLight ? "bg-gray-50" : "bg-white/[0.02]"}`} />
              ))}
            </div>
          ) : error ? (
            <div className="p-24 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-primary/20 text-primary shadow-2xl">
                <AlertCircle size={32} />
              </div>
              <p className="text-primary text-[13px] font-bold uppercase tracking-[0.3em]">
                {error}
              </p>
            </div>
          ) : (
            <div
              className="custom-scrollbar relative z-10 overflow-x-auto overflow-y-auto"
              style={{ height: "38rem" }}
            >
              <table className="w-full min-w-[720px] md:min-w-[900px] border-collapse">
                <thead className="sticky top-0 z-20">
                  <tr
                    className={`border-b ${isLight ? "bg-[#F8F9FA] border-gray-100" : "bg-black/95 border-b-white/5"}`}
                  >
                    <th
                      className={`px-4 py-3 text-center font-bold uppercase tracking-[0.18em] text-[11px] ${isLight ? "text-primary/60" : "text-primary"}`}
                    >
                      Request ID
                    </th>
                    <th
                      className={`px-4 py-3 text-left font-bold uppercase tracking-[0.18em] text-[11px] ${isLight ? "text-gray-400" : "text-white/40"}`}
                    >
                      Visitor
                    </th>
                    <th
                      className={`px-4 py-3 text-center font-bold uppercase tracking-[0.18em] text-[11px] ${isLight ? "text-gray-400" : "text-white/40"}`}
                    >
                      Visit Date
                    </th>
                    <th
                      className={`px-4 py-3 text-left font-bold uppercase tracking-[0.18em] text-[11px] ${isLight ? "text-gray-400" : "text-white/40"}`}
                    >
                      Purpose
                    </th>
                    <th
                      className={`px-4 py-3 text-left font-bold uppercase tracking-[0.18em] text-[11px] ${isLight ? "text-gray-400" : "text-white/40"}`}
                    >
                      Visit Areas
                    </th>
                    <th
                      className={`px-4 py-3 text-center font-bold uppercase tracking-[0.18em] text-[11px] ${isLight ? "text-gray-400" : "text-white/40"}`}
                    >
                      Status
                    </th>
                    <th
                      className={`px-4 py-3 text-center font-bold uppercase tracking-[0.18em] text-[11px] ${isLight ? "text-gray-400" : "text-white/40"}`}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredRequests && filteredRequests.length > 0 ? (
                    filteredRequests.map((req) => (
                      <tr
                        key={req.VVR_Request_id}
                        className={`group border-b transition-all duration-300 relative overflow-hidden ${isLight ? "hover:bg-[#F8F9FA] border-gray-50" : "hover:bg-white/[0.02] border-white/5"}`}
                      >
                        <td className="px-4 py-4 text-center text-primary text-[11px] tracking-[0.14em] font-medium">
                          #{req.VVR_Request_id}
                        </td>
                        <td className="px-4 py-4 text-left">
                          <span
                            className={`font-medium text-[12px] uppercase tracking-[0.14em] ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
                          >
                            {getVisitorDisplayName(req)}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div
                            className={`flex flex-col items-center justify-center gap-1.5 text-[12px] ${isLight ? "text-gray-500" : "text-white/70"}`}
                          >
                            <span className="font-medium tracking-wide">
                              {req.VVR_Visit_Date
                                ? req.VVR_Visit_Date.split("T")[0].split(
                                  " ",
                                )[0]
                                : "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-left">
                          <div className="max-w-[170px]">
                            <p
                              title={
                                req.VVR_Purpose || "No purpose specified"
                              }
                              className={`font-medium uppercase tracking-[0.14em] text-[12px] truncate ${isLight ? "text-[#1A1A1A]" : "text-white/90"}`}
                            >
                              {req.VVR_Purpose || "-"}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4 align-top text-left">
                          <div
                            className={`flex flex-col gap-2 text-[12px] font-medium tracking-wide min-w-0 ${isLight ? "text-gray-500" : "text-white/55"}`}
                          >
                            <div className="min-w-0 max-w-[280px] lg:max-w-[360px]">
                              {renderVisitAreas(req)}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex items-center justify-center">
                            <StatusBadge status={req.VVR_Status} />
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleReview(req.VVR_Request_id)}
                              className={`inline-flex h-8.5 px-3 items-center justify-center rounded-xl border border-transparent transition-all gap-2 group/btn ${isLight ? "bg-primary/5 text-primary hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/25" : "bg-blue-400/5 text-blue-400 hover:bg-blue-400 hover:text-white hover:shadow-lg hover:shadow-blue-400/25"}`}
                              title="View Request Details"
                            >
                              <Eye size={14} className="shrink-0 transition-transform group-hover/btn:scale-110" />
                              <span className="text-[10px] font-bold uppercase tracking-widest hidden lg:inline">View</span>
                            </button>
                            <button
                              onClick={() => handleOpenEdit(req)}
                              className={`inline-flex h-8.5 w-8.5 items-center justify-center rounded-xl border border-transparent transition-all ${isLight ? "bg-gray-100 text-gray-500 hover:bg-gray-200" : "bg-white/5 text-gray-300 hover:bg-white/10"}`}
                              title="Edit"
                            >
                              <Edit size={14} className="shrink-0" />
                            </button>
                            <button
                              onClick={(e) => handleMenuOpen(e, req)}
                              className={`inline-flex h-8.5 w-8.5 items-center justify-center rounded-xl border border-transparent transition-all ${isLight ? "bg-gray-100 text-gray-500 hover:bg-gray-200" : "bg-white/5 text-gray-300 hover:bg-white/10"}`}
                              title="More Options"
                            >
                              <MoreVertical size={14} className="shrink-0" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-24 text-center">
                        <div className="flex flex-col items-center justify-center opacity-20">
                          <ClipboardList
                            size={48}
                            className={`mb-4 ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
                          />
                          <p
                            className={`uppercase tracking-[0.4em] text-[10px] font-bold ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
                          >
                            No Active Visit Requests Detected
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal for Add/Update Visit Request */}
        {isModalOpen && (
          <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto ${isLight ? "bg-black/40 backdrop-blur-sm" : "bg-black/90 backdrop-blur-md"}`}
          >
            <div
              className={`${isLight ? "bg-white border-gray-200 shadow-2xl shadow-gray-200/50" : "bg-[#0A0A0B] border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)]"} border rounded-[28px] w-full max-w-md overflow-hidden relative my-auto border-t-primary/20`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none opacity-50`}
              ></div>

              <div className="flex justify-between items-center p-5 border-b border-white/5 relative z-10 bg-white/[0.01]">
                <div className="flex flex-col md:flex-row items-center gap-3 md:gap-3">
                  <div className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_10px_var(--color-primary)]"></div>
                  <div>
                    <p className="text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-1">
                      Visit Request
                    </p>
                    <h2
                      className={`text-base font-bold uppercase tracking-[0.1em] ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
                    >
                      {modalMode === "add"
                        ? "Create Visit Request"
                        : "Edit Visit Request"}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-white transition-all bg-white/5 p-2 rounded-xl border border-white/5 hover:border-white/20"
                >
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="p-5 space-y-5 relative z-10 max-h-[70vh] overflow-y-auto custom-scrollbar"
              >
                <div className="space-y-4">
                  {modalMode === "add" && (
                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold px-1 opacity-70">
                        Choose Visitor
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            setVisitorSearchOpen(!visitorSearchOpen);
                            setVisitorSearchTerm("");
                          }}
                          className={`w-full border rounded-xl px-5 py-4 text-[13px] text-left focus:outline-none focus:border-primary/50 appearance-none cursor-pointer transition-all flex items-center justify-between ${isLight
                              ? "bg-gray-50 border-gray-200 text-[#1A1A1A] hover:bg-gray-100"
                              : "bg-white/[0.03] border-white/10 text-white hover:bg-white/[0.05]"
                            } ${formData.VVR_Visitor_id ? (isLight ? "text-[#1A1A1A]" : "text-white") : isLight ? "text-gray-400" : "text-white/50"}`}
                        >
                          <span>
                            {formData.VVR_Visitor_id
                              ? activeVisitors.find(
                                (v) =>
                                  String(v.VV_Visitor_id) ===
                                  String(formData.VVR_Visitor_id),
                              )?.VV_Name || "Select a visitor"
                              : "Select a visitor"}
                          </span>
                          <ChevronDown
                            size={16}
                            className={`transition-transform ${visitorSearchOpen ? "rotate-180" : ""}`}
                          />
                        </button>

                        {visitorSearchOpen && (
                          <div
                            className={`absolute top-full left-0 right-0 z-50 mt-2 border rounded-xl shadow-lg ${isLight
                                ? "bg-white border-gray-200 shadow-gray-200/40"
                                : "bg-[#0A0A0B] border-white/10 shadow-black/50"
                              }`}
                          >
                            <div className="p-3 border-b border-white/5 sticky top-0 bg-inherit">
                              <input
                                type="text"
                                placeholder="Search visitors..."
                                value={visitorSearchTerm}
                                onChange={(e) =>
                                  setVisitorSearchTerm(e.target.value)
                                }
                                className={`w-full border rounded-lg px-3 py-2 text-[12px] focus:outline-none focus:border-primary/50 transition-all ${isLight
                                    ? "bg-gray-50 border-gray-200 text-[#1A1A1A]"
                                    : "bg-white/[0.02] border-white/10 text-white"
                                  }`}
                                autoFocus
                              />
                            </div>
                            <div className="max-h-[280px] overflow-y-auto custom-scrollbar">
                              {activeVisitors
                                .filter((v) =>
                                  `${v.VV_Name} ${v.VV_Visitor_id}`
                                    .toLowerCase()
                                    .includes(visitorSearchTerm.toLowerCase()),
                                )
                                .map((v, index) => (
                                  <button
                                    key={v.VV_Visitor_id}
                                    type="button"
                                    onClick={() => {
                                      setFormData({
                                        ...formData,
                                        VVR_Visitor_id: v.VV_Visitor_id,
                                      });
                                      setVisitorSearchOpen(false);
                                      setVisitorSearchTerm("");
                                    }}
                                    className={`w-full px-4 py-3 text-left text-[12px] font-medium transition-all border-b border-white/5 last:border-b-0 flex items-center justify-between group ${String(formData.VVR_Visitor_id) ===
                                        String(v.VV_Visitor_id)
                                        ? isLight
                                          ? "bg-primary/10 text-primary"
                                          : "bg-primary/10 text-primary"
                                        : isLight
                                          ? "hover:bg-gray-50 text-[#1A1A1A]"
                                          : "hover:bg-white/[0.05] text-white/80"
                                      }`}
                                  >
                                    <div className="flex flex-col">
                                      <span className="font-semibold">
                                        {v.VV_Name}
                                      </span>
                                      <span
                                        className={`text-[10px] ${isLight
                                            ? "text-gray-500"
                                            : "text-white/40"
                                          }`}
                                      >
                                        ID: {v.VV_Visitor_id}
                                      </span>
                                    </div>
                                    {String(formData.VVR_Visitor_id) ===
                                      String(v.VV_Visitor_id) && (
                                        <CheckCircle2 size={16} />
                                      )}
                                  </button>
                                ))}
                              {activeVisitors.filter((v) =>
                                `${v.VV_Name} ${v.VV_Visitor_id}`
                                  .toLowerCase()
                                  .includes(visitorSearchTerm.toLowerCase()),
                              ).length === 0 && (
                                  <div
                                    className={`px-4 py-6 text-center text-[11px] font-semibold tracking-[0.1em] uppercase ${isLight ? "text-gray-400" : "text-white/40"
                                      }`}
                                  >
                                    No visitors found
                                  </div>
                                )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 text-white">
                    <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold px-1 opacity-70">
                      Visit Date
                    </label>
                    <input
                      required
                      type="date"
                      name="VVR_Visit_Date"
                      value={formData.VVR_Visit_Date}
                      onChange={handleInputChange}
                      className={`w-full border rounded-xl px-5 py-4 text-[13px] focus:outline-none focus:border-primary/50 transition-all ${isLight
                          ? "bg-gray-50 border-gray-200 text-[#1A1A1A] hover:bg-gray-100"
                          : "bg-white/[0.03] border-white/10 text-white hover:bg-white/[0.05]"
                        }`}
                      style={{ colorScheme: isLight ? "light" : "dark" }}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold px-1 opacity-70">
                      Areas to Visit
                    </label>
                    <input
                      required
                      type="text"
                      name="VVR_Places_to_Visit"
                      value={formData.VVR_Places_to_Visit}
                      onChange={handleInputChange}
                      className={`w-full border rounded-xl px-5 py-4 text-[13px] focus:outline-none focus:border-primary/50 transition-all ${isLight
                          ? "bg-gray-50 border-gray-200 text-[#1A1A1A] hover:bg-gray-100"
                          : "bg-white/[0.03] border-white/10 text-white hover:bg-white/[0.05]"
                        }`}
                      placeholder="Enter the place or area name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold px-1 opacity-70">
                      Reason for Visit
                    </label>
                    <textarea
                      required
                      name="VVR_Purpose"
                      value={formData.VVR_Purpose}
                      onChange={handleInputChange}
                      rows="3"
                      className={`w-full border rounded-xl px-5 py-4 text-[13px] focus:outline-none focus:border-primary/50 resize-none transition-all ${isLight
                          ? "bg-gray-50 border-gray-200 text-[#1A1A1A] hover:bg-gray-100"
                          : "bg-white/[0.03] border-white/10 text-white hover:bg-white/[0.05]"
                        }`}
                      placeholder="Tell us why the visitor is coming"
                    ></textarea>
                  </div>

                  {/* <div className="pt-3 border-t border-white/5 space-y-3">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">
                      Vehicle Details
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        name="VV_Vehicle_Type"
                        value={formData.VV_Vehicle_Type}
                        onChange={handleInputChange}
                        className={`w-full border rounded-xl px-4 py-3.5 text-[12px] focus:outline-none focus:border-primary/40 placeholder:text-gray-400 ${
                          isLight
                            ? "bg-gray-50 border-gray-200 text-[#1A1A1A] hover:bg-gray-100"
                            : "bg-white/[0.03] border-white/5 text-white hover:bg-white/[0.05]"
                        }`}
                        placeholder="Vehicle type"
                      />
                      <input
                        type="text"
                        name="VV_Vehicle_Number"
                        value={formData.VV_Vehicle_Number}
                        onChange={handleInputChange}
                        className={`w-full border rounded-xl px-4 py-3.5 text-[12px] focus:outline-none focus:border-primary/40 placeholder:text-gray-400 ${
                          isLight
                            ? "bg-gray-50 border-gray-200 text-[#1A1A1A] hover:bg-gray-100"
                            : "bg-white/[0.03] border-white/5 text-white hover:bg-white/[0.05]"
                        }`}
                        placeholder="Plate number"
                      />
                    </div>
                  </div> */}
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-3 rounded-xl text-[11px] font-bold text-gray-500 hover:text-white hover:bg-white/5 uppercase tracking-[0.2em] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-7 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-[11px] font-bold uppercase tracking-[0.2em] shadow-[0_8px_25px_rgba(200,16,46,0.3)] transition-all"
                  >
                    {modalMode === "add" ? "Submit Request" : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Actions Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            className: `${isLight ? "bg-white border-gray-200 text-[#1A1A1A] shadow-xl" : "bg-[#18181B] border-white/10 text-white shadow-2xl"} border min-w-[45px] overflow-hidden rounded-md py-0`,
          }}
          MenuListProps={{
            className: "py-0",
          }}
        >
          <MenuItem
            onClick={handleDisableRequest}
            className="px-1.5 py-0.5 text-[3px] uppercase font-semibold tracking-[0.006em] text-primary hover:bg-primary/5 transition-colors border-b border-white/5 min-h-0 leading-none"
          >
            <div className="flex flex-col md:flex-row items-center gap-0.5 md:gap-0.5">
              <XCircle size={7} /> Disable Request
            </div>
          </MenuItem>
          {(selectedReq?.VVR_Status === "ACCEPTED" || selectedReq?.VVR_Status === "Accepted by Visitor") && (
            <MenuItem
              onClick={handleSendToAdmin}
              className="px-1.5 py-0.5 text-[3px] uppercase font-semibold tracking-[0.006em] text-green-500 hover:bg-green-500/5 transition-colors min-h-0 leading-none"
            >
              <div className="flex flex-col md:flex-row items-center gap-0.5 md:gap-0.5">
                <CheckCircle2 size={7} /> Send for Approval
              </div>
            </MenuItem>
          )}
        </Menu>
      </div>

      {/* ─── FULL-SCREEN EDIT OVERLAY ─── */}
      <AnimatePresence>
        {editingRequest && (
          <motion.div
            key="vr-edit"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 32 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[9999] flex flex-col"
            style={{ background: "var(--color-bg-default)" }}
          >
            {/* Top Nav */}
            <div
              className="flex-shrink-0 flex items-center justify-between px-6"
              style={{
                background: "var(--color-bg-paper)",
                borderBottom: "1px solid var(--color-border-soft)",
                minHeight: 64,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-primary"
                  style={{
                    background: "var(--color-primary-low)",
                    border: "1px solid rgba(200,16,46,0.2)",
                  }}
                >
                  <Pencil size={15} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      style={{ color: "var(--color-text-dim)", fontSize: 12 }}
                      className="font-medium"
                    >
                      Visit Requests
                    </span>
                    <span style={{ color: "var(--color-text-dim)" }}>/</span>
                    <span
                      style={{
                        color: "var(--color-text-primary)",
                        fontSize: 13,
                      }}
                      className="font-semibold"
                    >
                      Edit Request
                    </span>
                  </div>
                  <p
                    style={{ color: "var(--color-text-dim)", fontSize: 10 }}
                    className="font-semibold uppercase tracking-widest mt-0.5"
                  >
                    ID #{editingRequest.VVR_Request_id}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {rowSuccess["core"] && (
                  <span
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold"
                    style={{
                      background: "rgba(34,197,94,0.1)",
                      color: "var(--color-success)",
                      fontSize: 12,
                      border: "1px solid rgba(34,197,94,0.2)",
                    }}
                  >
                    <CheckCircle2 size={13} /> Saved successfully
                  </span>
                )}
                {editError && (
                  <span
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold"
                    style={{
                      background: "var(--color-primary-low)",
                      color: "var(--color-primary)",
                      fontSize: 12,
                      border: "1px solid rgba(200,16,46,0.2)",
                    }}
                  >
                    <AlertCircle size={12} /> {editError}
                  </span>
                )}
                <button
                  onClick={handleCloseEdit}
                  disabled={editSaving}
                  className="btn-outline disabled:opacity-40"
                >
                  <X size={14} /> Cancel
                </button>
                <button
                  onClick={handleSaveCore}
                  disabled={editSaving || editLoadingData}
                  className="btn-primary disabled:opacity-60"
                >
                  {editSaving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                      Saving…
                    </>
                  ) : (
                    <>
                      <Save size={13} /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
            {/* Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div
                style={{
                  maxWidth: 900,
                  margin: "0 auto",
                  padding: "32px 24px 80px",
                }}
                className="space-y-5"
              >
                {/* Request Summary */}
                <div
                  className="rounded-3xl p-5 md:p-6 space-y-4"
                  style={{
                    background: "var(--color-bg-paper)",
                    border: "1px solid var(--color-border-soft)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Hash size={14} className="text-primary" />
                    <h3
                      style={{
                        color: "var(--color-text-primary)",
                        fontSize: 11,
                        margin: 0,
                      }}
                      className="font-bold uppercase tracking-[0.2em]"
                    >
                      Request Summary
                    </h3>
                    <span
                      style={{
                        color: "var(--color-text-dim)",
                        fontSize: 10,
                        marginLeft: "auto",
                      }}
                      className="font-semibold"
                    >
                      Use <strong>Save Changes</strong> above to persist
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.14em",
                          color: "var(--color-text-dim)",
                        }}
                        className="flex items-center gap-2"
                      >
                        <Calendar size={11} className="text-primary" /> Visit
                        Date
                      </label>
                      <input
                        type="date"
                        value={editForm.VVR_Visit_Date}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            VVR_Visit_Date: e.target.value,
                          }))
                        }
                        className="mas-input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.14em",
                          color: "var(--color-text-dim)",
                        }}
                        className="flex items-center gap-2"
                      >
                        <MapPin size={11} className="text-primary" /> Places to
                        Visit
                      </label>
                      <input
                        type="text"
                        value={editForm.VVR_Places_to_Visit}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            VVR_Places_to_Visit: e.target.value,
                          }))
                        }
                        className="mas-input"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                      <label
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.14em",
                          color: "var(--color-text-dim)",
                        }}
                        className="flex items-center gap-2"
                      >
                        <Briefcase size={11} className="text-primary" /> Purpose
                      </label>
                      <textarea
                        rows={3}
                        value={editForm.VVR_Purpose}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            VVR_Purpose: e.target.value,
                          }))
                        }
                        className="mas-input resize-none"
                      />
                    </div>
                  </div>
                </div>
                {editLoadingData ? (
                  <div
                    className="rounded-3xl flex items-center justify-center gap-3 py-12"
                    style={{
                      background: "var(--color-bg-paper)",
                      border: "1px solid var(--color-border-soft)",
                    }}
                  >
                    <Loader2 size={20} className="text-primary animate-spin" />
                    <span
                      style={{
                        color: "var(--color-text-secondary)",
                        fontSize: 13,
                      }}
                      className="font-semibold"
                    >
                      Loading details…
                    </span>
                  </div>
                ) : (
                  <>
                    {/* Vehicles */}
                    <div
                      className="rounded-3xl p-5 md:p-6 space-y-4"
                      style={{
                        background: "var(--color-bg-paper)",
                        border: "1px solid var(--color-border-soft)",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Car size={14} className="text-primary" />
                        <h3
                          style={{
                            color: "var(--color-text-primary)",
                            fontSize: 11,
                            margin: 0,
                          }}
                          className="font-bold uppercase tracking-[0.2em]"
                        >
                          Vehicle Registry
                        </h3>
                        {editVehicles.filter((v) => !v._isNew).length > 0 && (
                          <span
                            style={{
                              color: "var(--color-text-dim)",
                              fontSize: 10,
                              marginLeft: 4,
                            }}
                          >
                            {editVehicles.filter((v) => !v._isNew).length}{" "}
                            vehicle
                            {editVehicles.filter((v) => !v._isNew).length > 1
                              ? "s"
                              : ""}
                          </span>
                        )}
                        <button
                          onClick={() =>
                            setEditVehicles((a) => [
                              ...a,
                              {
                                _isNew: true,
                                VV_Vehicle_Number: "",
                                VV_Vehicle_Type: "",
                              },
                            ])
                          }
                          className="btn-outline ml-auto whitespace-nowrap"
                          style={{ padding: "5px 14px", fontSize: 11, gap: 5 }}
                        >
                          <Plus size={12} /> Add Vehicle
                        </button>
                      </div>
                      {editVehicles.length === 0 && (
                        <p
                          style={{
                            color: "var(--color-text-dim)",
                            fontSize: 11,
                          }}
                          className="font-medium"
                        >
                          No vehicles. Click <strong>Add Vehicle</strong> to add
                          one.
                        </p>
                      )}
                      <div className="space-y-3">
                        {editVehicles.map((v, idx) => (
                          <div
                            key={v.VV_Vehicle_id || idx}
                            ref={(el) => {
                              rowRefs.current[`vehicle-${idx}`] = el;
                            }}
                            className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end p-4 rounded-2xl"
                            style={(() => {
                              const w =
                                warnDirty && dirtyRows.has(`vehicle-${idx}`);
                              if (w)
                                return {
                                  border: "2px solid rgba(239,68,68,0.7)",
                                  background: "rgba(239,68,68,0.05)",
                                  borderRadius: 16,
                                };
                              if (v._isNew)
                                return {
                                  border: "1.5px dashed rgba(251,191,36,0.5)",
                                  background: "rgba(251,191,36,0.04)",
                                };
                              return {
                                background: "var(--color-surface-1)",
                                border: "1px solid var(--color-border-soft)",
                              };
                            })()}
                          >
                            <div className="space-y-1.5">
                              <label
                                style={{
                                  fontSize: 10,
                                  fontWeight: 600,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.14em",
                                  color: "var(--color-text-dim)",
                                }}
                              >
                                Vehicle Number
                              </label>
                              <input
                                type="text"
                                value={v.VV_Vehicle_Number}
                                onChange={(e) =>
                                  setEditVehicles((a) =>
                                    a.map((x, i) =>
                                      i === idx
                                        ? {
                                          ...x,
                                          VV_Vehicle_Number: e.target.value,
                                        }
                                        : x,
                                    ),
                                  )
                                }
                                className="mas-input"
                                placeholder="e.g. ABC-1234"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label
                                style={{
                                  fontSize: 10,
                                  fontWeight: 600,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.14em",
                                  color: "var(--color-text-dim)",
                                }}
                              >
                                Vehicle Type
                                {!v._isNew && (
                                  <span style={{ fontSize: 9, opacity: 0.6 }}>
                                    {" "}
                                    (read-only)
                                  </span>
                                )}
                              </label>
                              <input
                                type="text"
                                value={v.VV_Vehicle_Type}
                                onChange={(e) =>
                                  v._isNew &&
                                  setEditVehicles((a) =>
                                    a.map((x, i) =>
                                      i === idx
                                        ? {
                                          ...x,
                                          VV_Vehicle_Type: e.target.value,
                                        }
                                        : x,
                                    ),
                                  )
                                }
                                readOnly={!v._isNew}
                                style={
                                  !v._isNew
                                    ? { opacity: 0.5, cursor: "not-allowed" }
                                    : {}
                                }
                                className="mas-input"
                                placeholder="e.g. Car"
                              />
                            </div>
                            <div className="flex flex-col items-end gap-1.5">
                              {rowSuccess[`vehicle-${idx}`] && (
                                <span
                                  className="flex items-center gap-1 font-semibold whitespace-nowrap"
                                  style={{
                                    color: "var(--color-success)",
                                    fontSize: 11,
                                  }}
                                >
                                  <CheckCircle2 size={12} /> Saved
                                </span>
                              )}
                              {v._isNew ? (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      handleRemoveNewRow("vehicle", idx)
                                    }
                                    className="btn-outline whitespace-nowrap"
                                    style={{
                                      padding: "9px 14px",
                                      fontSize: 11,
                                    }}
                                  >
                                    <X size={12} />
                                  </button>
                                  <button
                                    onClick={() => handleAddVehicle(idx)}
                                    disabled={newVehicleSavingIdx !== null}
                                    className="btn-primary disabled:opacity-60 whitespace-nowrap"
                                    style={{
                                      padding: "9px 18px",
                                      fontSize: 12,
                                      background: "var(--color-success)",
                                    }}
                                  >
                                    {newVehicleSavingIdx === idx ? (
                                      <>
                                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                                        Submitting…
                                      </>
                                    ) : (
                                      <>
                                        <Plus size={12} /> Submit
                                      </>
                                    )}
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleUpdateVehicle(idx)}
                                  disabled={vehicleSavingIdx !== null}
                                  className="btn-primary disabled:opacity-60 whitespace-nowrap"
                                  style={{ padding: "9px 18px", fontSize: 12 }}
                                >
                                  {vehicleSavingIdx === idx ? (
                                    <>
                                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                                      Updating…
                                    </>
                                  ) : (
                                    <>
                                      <Save size={12} /> Update
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* People */}
                    <div
                      className="rounded-3xl p-5 md:p-6 space-y-4"
                      style={{
                        background: "var(--color-bg-paper)",
                        border: "1px solid var(--color-border-soft)",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-primary" />
                        <h3
                          style={{
                            color: "var(--color-text-primary)",
                            fontSize: 11,
                            margin: 0,
                          }}
                          className="font-bold uppercase tracking-[0.2em]"
                        >
                          People Visiting
                        </h3>
                        {editGroupMembers.filter((m) => !m._isNew).length >
                          0 && (
                            <span
                              style={{
                                color: "var(--color-text-dim)",
                                fontSize: 10,
                                marginLeft: 4,
                              }}
                            >
                              {editGroupMembers.filter((m) => !m._isNew).length}{" "}
                              visitor
                              {editGroupMembers.filter((m) => !m._isNew).length >
                                1
                                ? "s"
                                : ""}
                            </span>
                          )}
                        <button
                          onClick={() =>
                            setEditGroupMembers((a) => [
                              ...a,
                              {
                                _isNew: true,
                                VVG_Visitor_Name: "",
                                VVG_NIC_Passport_Number: "",
                                VVG_Designation: "",
                                VVR_Request_id: editingRequest?.VVR_Request_id,
                              },
                            ])
                          }
                          className="btn-outline ml-auto whitespace-nowrap"
                          style={{ padding: "5px 14px", fontSize: 11, gap: 5 }}
                        >
                          <Plus size={12} /> Add Visitor
                        </button>
                      </div>
                      {editGroupMembers.length === 0 && (
                        <p
                          style={{
                            color: "var(--color-text-dim)",
                            fontSize: 11,
                          }}
                          className="font-medium"
                        >
                          No visitors. Click <strong>Add Visitor</strong> to add
                          one.
                        </p>
                      )}
                      <div className="space-y-3">
                        {editGroupMembers.map((m, idx) => (
                          <div
                            key={m.VVG_id || idx}
                            ref={(el) => {
                              rowRefs.current[`member-${idx}`] = el;
                            }}
                            className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end p-4 rounded-2xl"
                            style={(() => {
                              const w =
                                warnDirty && dirtyRows.has(`member-${idx}`);
                              if (w)
                                return {
                                  border: "2px solid rgba(239,68,68,0.7)",
                                  background: "rgba(239,68,68,0.05)",
                                  borderRadius: 16,
                                };
                              if (m._isNew)
                                return {
                                  border: "1.5px dashed rgba(251,191,36,0.5)",
                                  background: "rgba(251,191,36,0.04)",
                                };
                              return {
                                background: "var(--color-surface-1)",
                                border: "1px solid var(--color-border-soft)",
                              };
                            })()}
                          >
                            <div className="space-y-1.5">
                              <label
                                style={{
                                  fontSize: 10,
                                  fontWeight: 600,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.14em",
                                  color: "var(--color-text-dim)",
                                }}
                              >
                                Full Name
                              </label>
                              <input
                                type="text"
                                value={m.VVG_Visitor_Name}
                                onChange={(e) =>
                                  setEditGroupMembers((a) =>
                                    a.map((x, i) =>
                                      i === idx
                                        ? {
                                          ...x,
                                          VVG_Visitor_Name: e.target.value,
                                        }
                                        : x,
                                    ),
                                  )
                                }
                                className="mas-input"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label
                                style={{
                                  fontSize: 10,
                                  fontWeight: 600,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.14em",
                                  color: "var(--color-text-dim)",
                                }}
                              >
                                Designation / Phone
                              </label>
                              <input
                                type="text"
                                value={m.VVG_Designation}
                                onChange={(e) =>
                                  setEditGroupMembers((a) =>
                                    a.map((x, i) =>
                                      i === idx
                                        ? {
                                          ...x,
                                          VVG_Designation: e.target.value,
                                        }
                                        : x,
                                    ),
                                  )
                                }
                                className="mas-input"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label
                                style={{
                                  fontSize: 10,
                                  fontWeight: 600,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.14em",
                                  color: "var(--color-text-dim)",
                                }}
                              >
                                ID / Passport
                                {!m._isNew && (
                                  <span style={{ opacity: 0.6, fontSize: 9 }}>
                                    {" "}
                                    (read-only)
                                  </span>
                                )}
                              </label>
                              <input
                                type="text"
                                value={m.VVG_NIC_Passport_Number}
                                maxLength={12}
                                onChange={(e) => {
                                  if (m._isNew) {
                                    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 12);
                                    setEditGroupMembers((a) =>
                                      a.map((x, i) =>
                                        i === idx
                                          ? {
                                            ...x,
                                            VVG_NIC_Passport_Number: val,
                                          }
                                          : x,
                                      ),
                                    );
                                  }
                                }}
                                readOnly={!m._isNew}
                                style={
                                  !m._isNew
                                    ? { opacity: 0.5, cursor: "not-allowed" }
                                    : {}
                                }
                                className="mas-input"
                              />
                            </div>
                            <div className="flex flex-col items-end gap-1.5">
                              {rowSuccess[`member-${idx}`] && (
                                <span
                                  className="flex items-center gap-1 font-semibold whitespace-nowrap"
                                  style={{
                                    color: "var(--color-success)",
                                    fontSize: 11,
                                  }}
                                >
                                  <CheckCircle2 size={12} /> Saved
                                </span>
                              )}
                              {m._isNew ? (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      handleRemoveNewRow("member", idx)
                                    }
                                    className="btn-outline whitespace-nowrap"
                                    style={{
                                      padding: "9px 14px",
                                      fontSize: 11,
                                    }}
                                  >
                                    <X size={12} />
                                  </button>
                                  <button
                                    onClick={() => handleSubmitNewMember(idx)}
                                    disabled={newMemberSavingIdx !== null}
                                    className="btn-primary disabled:opacity-60 whitespace-nowrap"
                                    style={{
                                      padding: "9px 18px",
                                      fontSize: 12,
                                      background: "var(--color-success)",
                                    }}
                                  >
                                    {newMemberSavingIdx === idx ? (
                                      <>
                                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                                        Submitting…
                                      </>
                                    ) : (
                                      <>
                                        <Plus size={12} /> Submit
                                      </>
                                    )}
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleUpdateMember(idx)}
                                  disabled={memberSavingIdx !== null}
                                  className="btn-primary disabled:opacity-60 whitespace-nowrap"
                                  style={{ padding: "9px 18px", fontSize: 12 }}
                                >
                                  {memberSavingIdx === idx ? (
                                    <>
                                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                                      Updating…
                                    </>
                                  ) : (
                                    <>
                                      <Save size={12} /> Update
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Items */}
                    <div
                      className="rounded-3xl p-5 md:p-6 space-y-4"
                      style={{
                        background: "var(--color-bg-paper)",
                        border: "1px solid var(--color-border-soft)",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Package size={14} className="text-primary" />
                        <h3
                          style={{
                            color: "var(--color-text-primary)",
                            fontSize: 11,
                            margin: 0,
                          }}
                          className="font-bold uppercase tracking-[0.2em]"
                        >
                          Items to Bring
                        </h3>
                        {editItems.filter((it) => !it._isNew).length > 0 && (
                          <span
                            style={{
                              color: "var(--color-text-dim)",
                              fontSize: 10,
                              marginLeft: 4,
                            }}
                          >
                            {editItems.filter((it) => !it._isNew).length} item
                            {editItems.filter((it) => !it._isNew).length > 1
                              ? "s"
                              : ""}
                          </span>
                        )}
                        <button
                          onClick={() =>
                            setEditItems((a) => [
                              ...a,
                              {
                                _isNew: true,
                                VIC_Item_Name: "",
                                VIC_Quantity: "",
                                VIC_Designation: "",
                              },
                            ])
                          }
                          className="btn-outline ml-auto whitespace-nowrap"
                          style={{ padding: "5px 14px", fontSize: 11, gap: 5 }}
                        >
                          <Plus size={12} /> Add Item
                        </button>
                      </div>
                      {editItems.length === 0 && (
                        <p
                          style={{
                            color: "var(--color-text-dim)",
                            fontSize: 11,
                          }}
                          className="font-medium"
                        >
                          No items. Click <strong>Add Item</strong> to add one.
                        </p>
                      )}
                      <div className="space-y-3">
                        {editItems.map((it, idx) => (
                          <div
                            key={it.VIC_Item_id || idx}
                            ref={(el) => {
                              rowRefs.current[`item-${idx}`] = el;
                            }}
                            className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end p-4 rounded-2xl"
                            style={(() => {
                              const w =
                                warnDirty && dirtyRows.has(`item-${idx}`);
                              if (w)
                                return {
                                  border: "2px solid rgba(239,68,68,0.7)",
                                  background: "rgba(239,68,68,0.05)",
                                  borderRadius: 16,
                                };
                              if (it._isNew)
                                return {
                                  border: "1.5px dashed rgba(251,191,36,0.5)",
                                  background: "rgba(251,191,36,0.04)",
                                };
                              return {
                                background: "var(--color-surface-1)",
                                border: "1px solid var(--color-border-soft)",
                              };
                            })()}
                          >
                            <div className="space-y-1.5">
                              <label
                                style={{
                                  fontSize: 10,
                                  fontWeight: 600,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.14em",
                                  color: "var(--color-text-dim)",
                                }}
                              >
                                Item Name
                              </label>
                              <input
                                type="text"
                                value={it.VIC_Item_Name}
                                onChange={(e) =>
                                  setEditItems((a) =>
                                    a.map((x, i) =>
                                      i === idx
                                        ? {
                                          ...x,
                                          VIC_Item_Name: e.target.value,
                                        }
                                        : x,
                                    ),
                                  )
                                }
                                className="mas-input"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label
                                style={{
                                  fontSize: 10,
                                  fontWeight: 600,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.14em",
                                  color: "var(--color-text-dim)",
                                }}
                              >
                                Quantity
                              </label>
                              <input
                                type="text"
                                value={it.VIC_Quantity}
                                onChange={(e) =>
                                  setEditItems((a) =>
                                    a.map((x, i) =>
                                      i === idx
                                        ? { ...x, VIC_Quantity: e.target.value }
                                        : x,
                                    ),
                                  )
                                }
                                className="mas-input"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label
                                style={{
                                  fontSize: 10,
                                  fontWeight: 600,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.14em",
                                  color: "var(--color-text-dim)",
                                }}
                              >
                                Description
                              </label>
                              <input
                                type="text"
                                value={it.VIC_Designation}
                                onChange={(e) =>
                                  setEditItems((a) =>
                                    a.map((x, i) =>
                                      i === idx
                                        ? {
                                          ...x,
                                          VIC_Designation: e.target.value,
                                        }
                                        : x,
                                    ),
                                  )
                                }
                                className="mas-input"
                              />
                            </div>
                            <div className="flex flex-col items-end gap-1.5">
                              {rowSuccess[`item-${idx}`] && (
                                <span
                                  className="flex items-center gap-1 font-semibold whitespace-nowrap"
                                  style={{
                                    color: "var(--color-success)",
                                    fontSize: 11,
                                  }}
                                >
                                  <CheckCircle2 size={12} /> Saved
                                </span>
                              )}
                              {it._isNew ? (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      handleRemoveNewRow("item", idx)
                                    }
                                    className="btn-outline whitespace-nowrap"
                                    style={{
                                      padding: "9px 14px",
                                      fontSize: 11,
                                    }}
                                  >
                                    <X size={12} />
                                  </button>
                                  <button
                                    onClick={() => handleSubmitNewItem(idx)}
                                    disabled={newItemSavingIdx !== null}
                                    className="btn-primary disabled:opacity-60 whitespace-nowrap"
                                    style={{
                                      padding: "9px 18px",
                                      fontSize: 12,
                                      background: "var(--color-success)",
                                    }}
                                  >
                                    {newItemSavingIdx === idx ? (
                                      <>
                                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                                        Submitting…
                                      </>
                                    ) : (
                                      <>
                                        <Plus size={12} /> Submit
                                      </>
                                    )}
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleUpdateItem(idx)}
                                  disabled={itemSavingIdx !== null}
                                  className="btn-primary disabled:opacity-60 whitespace-nowrap"
                                  style={{ padding: "9px 18px", fontSize: 12 }}
                                >
                                  {itemSavingIdx === idx ? (
                                    <>
                                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                                      Updating…
                                    </>
                                  ) : (
                                    <>
                                      <Save size={12} /> Update
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VisitRequests;
