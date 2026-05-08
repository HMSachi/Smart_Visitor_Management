import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { GetVisitRequestsByVisitor } from "../../../actions/VisitRequestAction";
import { GetAllGatePasses } from "../../../actions/GatePassAction";
import { GetAllBlacklist } from "../../../actions/BlacklistAction";
import { GetAllPlaces } from "../../../actions/PlacesAction";
import VisitorService from "../../../services/VisitorService";
import VisitRequestService from "../../../services/VisitRequestService";
import VehicleService from "../../../services/VehicleService";
import VisitGroupService from "../../../services/VisitGroupService";
import ItemCarriedService from "../../../services/ItemCarriedService";
import { validateNIC, validatePhone } from "../../../utils/validation";
import {
  ClipboardList,
  Calendar,
  MapPin,
  CheckCircle2,
  Hash,
  AlertCircle,
  QrCode,
  Pencil,
  X,
  Save,
  Car,
  Users,
  Package,
  Briefcase,
  Loader2,
  Plus,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const StatusBadge = ({ status }) => {
  const s = (status || "").toString().trim().toUpperCase();
  switch (s) {
    case "A":
    case "APPROVED":
      return (
        <div className="svm-status-pill svm-status-pill--success">Approved</div>
      );
    case "R":
    case "REJECTED":
      return (
        <div className="svm-status-pill svm-status-pill--danger">Declined</div>
      );
    case "ACCEPTED":
      return (
        <div className="svm-status-pill svm-status-pill--purple">Accepted</div>
      );
    case "SENT":
    case "SENT_TO_ADMIN":
      return (
        <div className="svm-status-pill svm-status-pill--warning">Contact person accepted</div>
      );
    case "P":
    case "PENDING":
    default:
      return (
        <div className="svm-status-pill svm-status-pill--info">Pending</div>
      );
  }
};

const canReviewRequest = (status) => {
  return true;
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

const MyRequests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { visitRequestsByVis, isLoading, error } = useSelector(
    (state) => state.visitRequestsState,
  );
  const { gatePasses } = useSelector(
    (state) => state.gatePassState || { gatePasses: [] },
  );
  const { blacklists } = useSelector(
    (state) => state.blacklistState || { blacklists: [] },
  );
  const { places: placesList, loading: placesLoading } = useSelector(
    (state) => state.placesState || { places: [], loading: false },
  );

  // Extract Visitor ID from login session
  const user = useSelector((state) => state.login.user);
  const userEmail = user?.ResultSet?.[0]?.VA_Email;
  const [visitorId, setVisitorId] = useState(null);
  const [visitorName, setVisitorName] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  // Edit modal state
  const [editingRequest, setEditingRequest] = useState(null);
  const [editLoadingData, setEditLoadingData] = useState(false);
  const [editForm, setEditForm] = useState({
    VVR_Visit_Date: "",
    VVR_Places_to_Visit: "",
    VVR_Purpose: "",
  });
  const [editVehicles, setEditVehicles] = useState([]); // [{ VV_Vehicle_id, VV_Vehicle_Number, VV_Vehicle_Type, _isNew? }]
  const [editGroupMembers, setEditGroupMembers] = useState([]); // [{ VVG_id, VVG_Visitor_Name, VVG_Designation, VVG_NIC_Passport_Number }]
  const [editItems, setEditItems] = useState([]); // [{ VIC_Item_id, VIC_Item_Name, VIC_Quantity, VIC_Designation }]
  const [editJointItems, setEditJointItems] = useState([]); // [{ subVisitorName, VIC_Item_Name, VIC_Quantity, VIC_Designation, _isNew? }]
  const [editSaving, setEditSaving] = useState(false);
  const [vehicleSavingIdx, setVehicleSavingIdx] = useState(null);
  const [memberSavingIdx, setMemberSavingIdx] = useState(null);
  const [itemSavingIdx, setItemSavingIdx] = useState(null);
  const [newVehicleSavingIdx, setNewVehicleSavingIdx] = useState(null);
  const [newMemberSavingIdx, setNewMemberSavingIdx] = useState(null);
  const [newItemSavingIdx, setNewItemSavingIdx] = useState(null);
  const [subItemSavingIdx, setSubItemSavingIdx] = useState(null);
  const [newSubItemSavingIdx, setNewSubItemSavingIdx] = useState(null);
  const [rowSuccess, setRowSuccess] = useState({});
  const [editError, setEditError] = useState("");
  const [dirtyRows, setDirtyRows] = useState(new Set()); // keys: 'vehicle-N','member-N','item-N'
  const [warnDirty, setWarnDirty] = useState(false); // true when Save is blocked by dirty rows
  const rowRefs = useRef({}); // { 'vehicle-0': domEl, 'member-1': domEl, ... }

  useEffect(() => {
    const loadVisitorId = async () => {
      try {
        const response = await VisitorService.GetAllVisitors();

        const visitors = response?.data?.ResultSet || [];
        const match = visitors.find(
          (v) =>
            v?.VV_Email?.trim().toLowerCase() ===
            userEmail?.trim().toLowerCase(),
        );

        if (match) {
          setVisitorId(match.VV_Visitor_id);
          setVisitorName(match.VV_Name);
        }
      } catch (err) {
        console.error("Error loading visitor:", err);
      }
    };

    if (userEmail) {
      loadVisitorId();
    }
    dispatch(GetAllGatePasses());
    dispatch(GetAllBlacklist());
    dispatch(GetAllPlaces());
  }, [userEmail, dispatch]);

  useEffect(() => {
    if (visitorId) {
      dispatch(GetVisitRequestsByVisitor(visitorId));
    }
  }, [dispatch, visitorId]);

  const handleViewGatePass = (req) => {
    // Find the gate pass ID from the gatePasses list
    const list = Array.isArray(gatePasses)
      ? gatePasses
      : gatePasses?.gatePasses || gatePasses?.ResultSet || [];
    const gatePass = list.find((gp) => {
      const gpRequestId =
        gp.VVR_Request_id ||
        gp.VGP_Request_id ||
        gp.vvr_Request_id ||
        gp.vgp_Request_id;
      return String(gpRequestId) === String(req.VVR_Request_id);
    });

    const gatePassId = gatePass?.VGP_Pass_id || gatePass?.vgp_Pass_id;

    if (!gatePassId) {
      console.error("Gate pass not found");
      return;
    }

    // Navigate with gatePassId as URL parameter
    navigate(`/visitor/gate-pass/${gatePassId}`);
  };

  const hasGatePass = (requestId) => {
    if (!requestId) return false;
    const list = Array.isArray(gatePasses)
      ? gatePasses
      : gatePasses?.gatePasses || gatePasses?.ResultSet || [];
    return list.some((gp) => {
      const gpRequestId =
        gp.VVR_Request_id ||
        gp.VGP_Request_id ||
        gp.vvr_Request_id ||
        gp.vgp_Request_id;
      return String(gpRequestId) === String(requestId);
    });
  };

  const handleOpenReviewPage = (request) => {
    navigate(`/visitor/request-details/${request.VVR_Request_id}`, {
      state: {
        request,
        visitorName,
      },
    });
  };

  const handleOpenEdit = async (req) => {
    setEditingRequest(req);
    setEditError("");
    setEditLoadingData(true);
    setEditForm({
      VVR_Visit_Date: toDateInputValue(req.VVR_Visit_Date),
      VVR_Places_to_Visit: req.VVR_Places_to_Visit || "",
      VVR_Purpose: req.VVR_Purpose || "",
    });
    setEditVehicles([]);
    setEditGroupMembers([]);
    setEditItems([]);
    setDirtyRows(new Set());
    setWarnDirty(false);
    try {
      const [vehicleRes, groupRes, itemsRes, jointRes] = await Promise.all([
        VehicleService.GetAllVehicles(),
        VisitGroupService.GetAllVisitGroup(),
        ItemCarriedService.GetAllItemsCarried(),
        VisitorService.GetVisitorJoint(req.VVR_Request_id),
      ]);
      const reqId = String(req.VVR_Request_id);
      const allVehicles = vehicleRes?.data?.ResultSet || vehicleRes?.data || [];
      setEditVehicles(
        (Array.isArray(allVehicles) ? allVehicles : [])
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
      const allGroups = groupRes?.data?.ResultSet || groupRes?.data || [];
      setEditGroupMembers(
        (Array.isArray(allGroups) ? allGroups : [])
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
      const allItems = itemsRes?.data?.ResultSet || itemsRes?.data || [];
      setEditItems(
        (Array.isArray(allItems) ? allItems : [])
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
      const rawJoint = jointRes?.data?.ResultSet || jointRes?.data || [];
      setEditJointItems(
        (Array.isArray(rawJoint) ? rawJoint : []).map((i) => ({
          ...i,
          subVisitorName: i.Group_Members || "",
          subVisitorNic: i.VVG_NIC_Passport_Number || i.NIC || "",
          subVisitorPhone: i.VVG_Designation || i.Contact || "",
          VIC_Item_Name: i.VIC_Item_Name || i.itemName || "",
          VIC_Quantity: String(i.VIC_Quantity || i.quantity || "1"),
          VIC_Designation: i.VIC_Designation || i.description || "",
          _original: {
            subVisitorName: i.Group_Members || "",
            VIC_Item_Name: i.VIC_Item_Name || i.itemName || "",
            VIC_Quantity: String(i.VIC_Quantity || i.quantity || "1"),
            VIC_Designation: i.VIC_Designation || i.description || "",
          },
        }))
      );
    } catch (err) {
      console.error("Failed to load edit data:", err);
    } finally {
      setEditLoadingData(false);
    }
  };

  const handleCloseEdit = () => {
    if (
      editSaving ||
      vehicleSavingIdx !== null ||
      memberSavingIdx !== null ||
      itemSavingIdx !== null ||
      subItemSavingIdx !== null ||
      newSubItemSavingIdx !== null
    )
      return;
    setEditingRequest(null);
    setEditError("");
    setRowSuccess({});
    setDirtyRows(new Set());
    setWarnDirty(false);
    setEditJointItems([]);
  };

  // Helper: mark a row as dirty (edited but not yet saved)
  const markDirty = (key) => setDirtyRows((prev) => new Set(prev).add(key));
  const clearDirty = (key) =>
    setDirtyRows((prev) => {
      const n = new Set(prev);
      n.delete(key);
      return n;
    });

  // Helper: check if a vehicle/member/item row has unsaved edits vs _original
  const isVehicleDirty = (v, idx) => {
    if (v._isNew) return true; // new unsaved row is always dirty
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
  const isSubItemDirty = (it) => {
    if (it._isNew) return true;
    if (!it._original) return false;
    return (
      it.subVisitorName !== it._original.subVisitorName ||
      it.VIC_Item_Name !== it._original.VIC_Item_Name ||
      it.VIC_Quantity !== it._original.VIC_Quantity ||
      it.VIC_Designation !== it._original.VIC_Designation
    );
  };

  // Helper to flash a green tick on a row key then clear it after 2s
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

  // ── Core request fields (Visit Date, Places, Purpose) ──
  const handleSaveRequestCore = async () => {
    if (!editingRequest) return;
    if (
      !editForm.VVR_Visit_Date ||
      !editForm.VVR_Places_to_Visit ||
      !editForm.VVR_Purpose
    ) {
      setEditError("Visit date, places, and purpose are required.");
      return;
    }
    // Check for unsaved row edits
    const unsavedKeys = [];
    editVehicles.forEach((v, i) => {
      if (isVehicleDirty(v, i)) unsavedKeys.push(`vehicle-${i}`);
    });
    editGroupMembers.forEach((m, i) => {
      if (isMemberDirty(m)) unsavedKeys.push(`member-${i}`);
    });
    editItems.forEach((it, i) => {
      if (isItemDirty(it)) unsavedKeys.push(`item-${i}`);
    });
    editJointItems.forEach((it, i) => {
      if (isSubItemDirty(it)) unsavedKeys.push(`subItem-${i}`);
    });
    if (unsavedKeys.length > 0) {
      setDirtyRows(new Set(unsavedKeys));
      setWarnDirty(true);
      setEditError(
        `${unsavedKeys.length} row(s) have unsaved changes. Please click Update/Submit on each highlighted row first.`,
      );
      // Auto-scroll to the first dirty row
      const firstKey = unsavedKeys[0];
      const el = rowRefs.current[firstKey];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
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
      if (visitorId) dispatch(GetVisitRequestsByVisitor(visitorId));
      flashSuccess("core");
      // All clean — close form and go back to My Requests
      setTimeout(() => {
        setEditingRequest(null);
        setEditError("");
        setRowSuccess({});
        setDirtyRows(new Set());
        navigate("/visitor/my-requests");
      }, 800);
    } catch (err) {
      console.error("Failed to update request core:", err);
      setEditError("Failed to save request details. Please try again.");
    } finally {
      setEditSaving(false);
    }
  };

  // ── Update existing vehicle row ──
  const handleUpdateVehicle = async (idx) => {
    const vehicle = editVehicles[idx];
    if (!vehicle?.VV_Vehicle_id || vehicleSavingIdx !== null) return;
    setVehicleSavingIdx(idx);
    try {
      await VehicleService.UpdateVehicle({
        VV_Vehicle_id: vehicle.VV_Vehicle_id,
        VV_Vehicle_Number: vehicle.VV_Vehicle_Number,
      });
      // Sync _original so row is no longer dirty
      setEditVehicles((arr) =>
        arr.map((v, i) =>
          i === idx
            ? {
              ...v,
              _original: {
                VV_Vehicle_Number: v.VV_Vehicle_Number,
                VV_Vehicle_Type: v.VV_Vehicle_Type,
              },
            }
            : v,
        ),
      );
      clearDirty(`vehicle-${idx}`);
      flashSuccess(`vehicle-${idx}`);
    } catch (err) {
      console.error(`Failed to update vehicle ${idx}:`, err);
    } finally {
      setVehicleSavingIdx(null);
    }
  };

  // ── Submit new vehicle row ──
  const handleAddVehicle = async (idx) => {
    const vehicle = editVehicles[idx];
    if (!vehicle?._isNew || newVehicleSavingIdx !== null) return;
    if (!vehicle.VV_Vehicle_Number || !vehicle.VV_Vehicle_Type) {
      setEditError("Vehicle number and type are required.");
      return;
    }
    setNewVehicleSavingIdx(idx);
    setEditError("");
    try {
      await VehicleService.AddVehicle({
        VV_Vehicle_Number: vehicle.VV_Vehicle_Number,
        VV_Vehicle_Type: vehicle.VV_Vehicle_Type,
        VVR_Request_id: editingRequest.VVR_Request_id,
      });
      setEditVehicles((arr) =>
        arr.map((v, i) =>
          i === idx
            ? {
              ...v,
              _isNew: false,
              VV_Vehicle_id: "saved",
              _original: {
                VV_Vehicle_Number: v.VV_Vehicle_Number,
                VV_Vehicle_Type: v.VV_Vehicle_Type,
              },
            }
            : v,
        ),
      );
      clearDirty(`vehicle-${idx}`);
      flashSuccess(`vehicle-${idx}`);
    } catch (err) {
      console.error(`Failed to add vehicle ${idx}:`, err);
      setEditError("Failed to add vehicle.");
    } finally {
      setNewVehicleSavingIdx(null);
    }
  };

  // ── Update existing member ──
  const handleUpdateMember = async (idx) => {
    const member = editGroupMembers[idx];
    if (!member?.VVG_id || memberSavingIdx !== null) return;

    // Check blacklist before updating
    const isBlacklisted = (blacklists || []).some(
      (b) =>
        b.VB_Name &&
        b.VB_Name.toLowerCase() === member.VVG_Visitor_Name?.toLowerCase() &&
        b.VB_Status === "A",
    );
    if (isBlacklisted) {
      setEditError(
        `Access Restricted for ${member.VVG_Visitor_Name}. They are blacklisted.`,
      );
      return;
    }

    setMemberSavingIdx(idx);
    try {
      await VisitGroupService.UpdateVisitGroup({
        VVG_id: member.VVG_id,
        VVG_Visitor_Name: member.VVG_Visitor_Name,
        VVG_Designation: member.VVG_Designation,
        VVG_Status: "A",
        VVR_Request_id: member.VVR_Request_id,
      });
      setEditGroupMembers((arr) =>
        arr.map((m, i) =>
          i === idx
            ? {
              ...m,
              _original: {
                VVG_Visitor_Name: m.VVG_Visitor_Name,
                VVG_Designation: m.VVG_Designation,
              },
            }
            : m,
        ),
      );
      clearDirty(`member-${idx}`);
      flashSuccess(`member-${idx}`);
    } catch (err) {
      console.error(`Failed to update member ${idx}:`, err);
    } finally {
      setMemberSavingIdx(null);
    }
  };

  // ── Submit new member ──
  const handleSubmitNewMember = async (idx) => {
    const member = editGroupMembers[idx];
    if (!member?._isNew || newMemberSavingIdx !== null) return;
    if (!member.VVG_Visitor_Name || !member.VVG_NIC_Passport_Number) {
      setEditError("Name and NIC are required for new visitors.");
      return;
    }
    const nicErr = validateNIC(member.VVG_NIC_Passport_Number);
    if (nicErr) {
      setEditError(nicErr);
      return;
    }

    // Validate phone number (stored in Designation)
    const phoneErr = validatePhone(member.VVG_Designation);
    if (phoneErr) {
      setEditError(phoneErr);
      return;
    }

    // Check blacklist before adding
    const isBlacklisted = (blacklists || []).some(
      (b) =>
        b.VB_Name &&
        b.VB_Name.toLowerCase() === member.VVG_Visitor_Name?.toLowerCase() &&
        b.VB_Status === "A",
    );
    if (isBlacklisted) {
      setEditError(
        `Access Restricted for ${member.VVG_Visitor_Name}. They are blacklisted.`,
      );
      return;
    }

    setNewMemberSavingIdx(idx);
    setEditError("");
    try {
      await VisitGroupService.AddVisitGroup({
        VVG_Visitor_Name: member.VVG_Visitor_Name,
        VVG_NIC_Passport_Number: member.VVG_NIC_Passport_Number,
        VVG_Designation: member.VVG_Designation,
        VVG_Status: "A",
        VVR_Request_id: editingRequest.VVR_Request_id,
      });
      // Replace the _isNew row with a persisted placeholder (refresh marks it persisted)
      setEditGroupMembers((arr) =>
        arr.map((m, i) =>
          i === idx
            ? {
              ...m,
              _isNew: false,
              VVG_id: "saved",
              _original: {
                VVG_Visitor_Name: m.VVG_Visitor_Name,
                VVG_Designation: m.VVG_Designation,
              },
            }
            : m,
        ),
      );
      clearDirty(`member-${idx}`);
      flashSuccess(`member-${idx}`);
    } catch (err) {
      console.error(`Failed to add member ${idx}:`, err);
      setEditError("Failed to add visitor.");
    } finally {
      setNewMemberSavingIdx(null);
    }
  };

  // ── Update existing item ──
  const handleUpdateItem = async (idx) => {
    const item = editItems[idx];
    if (!item?.VIC_Item_id || itemSavingIdx !== null) return;
    setItemSavingIdx(idx);
    try {
      await ItemCarriedService.UpdateItem({
        VIC_Item_id: item.VIC_Item_id,
        VIC_Item_Name: item.VIC_Item_Name,
        VIC_Quantity: item.VIC_Quantity,
        VIC_Designation: item.VIC_Designation,
      });
      setEditItems((arr) =>
        arr.map((it, i) =>
          i === idx
            ? {
              ...it,
              _original: {
                VIC_Item_Name: it.VIC_Item_Name,
                VIC_Quantity: it.VIC_Quantity,
                VIC_Designation: it.VIC_Designation,
              },
            }
            : it,
        ),
      );
      clearDirty(`item-${idx}`);
      flashSuccess(`item-${idx}`);
    } catch (err) {
      console.error(`Failed to update item ${idx}:`, err);
    } finally {
      setItemSavingIdx(null);
    }
  };

  // ── Submit new item ──
  const handleSubmitNewItem = async (idx) => {
    const item = editItems[idx];
    if (!item?._isNew || newItemSavingIdx !== null) return;
    if (!item.VIC_Item_Name) {
      setEditError("Item name is required.");
      return;
    }
    setNewItemSavingIdx(idx);
    setEditError("");
    try {
      await ItemCarriedService.AddItem({
        VIC_Item_Name: item.VIC_Item_Name,
        VIC_Quantity: item.VIC_Quantity || "1",
        VIC_Designation: item.VIC_Designation || "",
        VVR_Request_id: editingRequest.VVR_Request_id,
      });
      setEditItems((arr) =>
        arr.map((it, i) =>
          i === idx
            ? {
              ...it,
              _isNew: false,
              VIC_Item_id: "saved",
              _original: {
                VIC_Item_Name: it.VIC_Item_Name,
                VIC_Quantity: it.VIC_Quantity,
                VIC_Designation: it.VIC_Designation,
              },
            }
            : it,
        ),
      );
      clearDirty(`item-${idx}`);
      flashSuccess(`item-${idx}`);
    } catch (err) {
      console.error(`Failed to add item ${idx}:`, err);
      setEditError("Failed to add item.");
    } finally {
      setNewItemSavingIdx(null);
    }
  };

  // ── Update existing sub-visitor item ──
  const handleUpdateSubItem = async (idx) => {
    setSubItemSavingIdx(idx);
    setTimeout(() => {
      setEditJointItems((arr) => arr.map((it, i) => i === idx ? {
        ...it,
        _original: {
          subVisitorName: it.subVisitorName,
          VIC_Item_Name: it.VIC_Item_Name,
          VIC_Quantity: it.VIC_Quantity,
          VIC_Designation: it.VIC_Designation,
        }
      } : it));
      clearDirty(`subItem-${idx}`);
      flashSuccess(`subItem-${idx}`);
      setSubItemSavingIdx(null);
    }, 500);
  };

  // ── Submit new sub-visitor item ──
  const handleSubmitNewSubItem = async (idx) => {
    setNewSubItemSavingIdx(idx);
    setTimeout(() => {
      setEditJointItems((arr) => arr.map((it, i) => i === idx ? {
        ...it,
        _isNew: false,
        _original: {
          subVisitorName: it.subVisitorName,
          VIC_Item_Name: it.VIC_Item_Name,
          VIC_Quantity: it.VIC_Quantity,
          VIC_Designation: it.VIC_Designation,
        }
      } : it));
      clearDirty(`subItem-${idx}`);
      flashSuccess(`subItem-${idx}`);
      setNewSubItemSavingIdx(null);
    }, 500);
  };

  // ── Helper: add blank new rows ──
  const handleAddNewVehicleRow = () => {
    setEditVehicles((arr) => [
      { _isNew: true, VV_Vehicle_Number: "", VV_Vehicle_Type: "" },
      ...arr,
    ]);
  };
  const handleAddNewMemberRow = () => {
    setEditGroupMembers((arr) => [
      {
        _isNew: true,
        VVG_Visitor_Name: "",
        VVG_NIC_Passport_Number: "",
        VVG_Designation: "",
        VVR_Request_id: editingRequest?.VVR_Request_id,
      },
      ...arr,
    ]);
  };
  const handleAddNewItemRow = () => {
    setEditItems((arr) => [
      {
        _isNew: true,
        VIC_Item_Name: "",
        VIC_Quantity: "",
        VIC_Designation: "",
      },
      ...arr,
    ]);
  };
  const handleAddNewSubItemRow = () => {
    setEditJointItems((arr) => [
      {
        _isNew: true,
        subVisitorName: "",
        VIC_Item_Name: "",
        VIC_Quantity: "",
        VIC_Designation: "",
      },
      ...arr,
    ]);
  };
  const handleRemoveNewRow = (section, idx) => {
    if (section === "vehicle")
      setEditVehicles((arr) => arr.filter((_, i) => i !== idx));
    if (section === "member")
      setEditGroupMembers((arr) => arr.filter((_, i) => i !== idx));
    if (section === "item")
      setEditItems((arr) => arr.filter((_, i) => i !== idx));
    if (section === "subItem")
      setEditJointItems((arr) => arr.filter((_, i) => i !== idx));
  };

  const filteredRequests = (visitRequestsByVis || [])
    .filter(
      (req) =>
        String(req.VVR_Request_id).includes(searchTerm) ||
        req.VVR_Purpose?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort(
      (a, b) => Number(b.VVR_Request_id) - Number(a.VVR_Request_id)
    );

  return (
    <div className="min-h-screen bg-[var(--color-bg-default)] text-white px-4 md:px-8 pt-24 md:pt-28 pb-6 md:pb-8 font-sans relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-5">
          <div>
            <h1 className="text-[20px] md:text-[21px] font-semibold text-white mt-1 tracking-[0.02em]">
              My Visit Requests
            </h1>
          </div>
        </header>

        <div>
          {isLoading ? (
            <div className="bg-black/20 border border-white/5 rounded-[20px] overflow-hidden backdrop-blur-xl shadow-2xl p-24 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <p className="mt-6 text-gray-400 font-bold uppercase tracking-[0.4em] text-xs">
                Hang tight, we're loading your visit requests.
              </p>
            </div>
          ) : error ? (
            <div className="bg-black/20 border border-white/5 rounded-[20px] overflow-hidden backdrop-blur-xl shadow-2xl p-24 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary border border-primary/20">
                <AlertCircle size={32} />
              </div>
              <p className="text-primary font-bold uppercase tracking-[0.2em]">
                {error}
              </p>
            </div>
          ) : filteredRequests.length > 0 ? (
            <>
              <div className="hidden lg:block bg-black/20 border border-white/5 rounded-[5px] overflow-hidden backdrop-blur-xl shadow-2xl mb-4">
                <TableContainer
                  component={Paper}
                  className="bg-transparent shadow-none border-none"
                >
                  <Table size="small" sx={{ minWidth: 560 }}>
                    <TableHead className="bg-white/[0.02]">
                      <TableRow>
                        <TableCell className="text-gray-400 font-medium tracking-[0.1em] text-[12px] border-b-white/5 py-1 px-2.5">
                          ID
                        </TableCell>
                        <TableCell className="text-gray-400 font-medium tracking-[0.1em] text-[12px] border-b-white/5 py-1 px-2.5 min-w-[150px]">
                          Date
                        </TableCell>
                        <TableCell className="text-gray-400 font-medium tracking-[0.1em] text-[12px] border-b-white/5 py-1 px-2.5 min-w-[200px]">
                          Going to
                        </TableCell>
                        <TableCell className="text-gray-400 font-medium tracking-[0.1em] text-[12px] border-b-white/5 py-1 px-2.5">
                          Reason
                        </TableCell>
                        <TableCell align="center" className="text-gray-400 font-medium tracking-[0.1em] text-[12px] border-b-white/5 py-1 px-2.5">
                          Status
                        </TableCell>
                        <TableCell
                          className="text-gray-400 font-medium tracking-[0.1em] text-[12px] border-b-white/5 py-1 px-2.5"
                          align="right"
                        >
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredRequests.map((req) => (
                        <TableRow
                          key={req.VVR_Request_id}
                          hover
                          className="hover:bg-white/[0.02] transition-all"
                        >
                          <TableCell className="px-2.5 py-1 border-b-white/5 font-normal text-[12px]">
                            <div className="flex items-center gap-1.5">
                              <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                <Hash size={11} />
                              </div>
                              <span className="text-white font-mono tracking-normal text-[11px]">
                                #{req.VVR_Request_id}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="px-2.5 py-1 border-b-white/5 font-normal text-[12px]">
                            <div className="flex items-center gap-2 text-gray-300">
                              <Calendar size={11} className="text-primary/50" />
                              <span className="text-[12px] font-normal tracking-normal">
                                {req.VVR_Visit_Date
                                  ? req.VVR_Visit_Date.split("T")[0].split(
                                    " ",
                                  )[0]
                                  : "N/A"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="px-2.5 py-1 border-b-white/5 font-normal text-[12px]">
                            <div className="flex items-center gap-2 text-gray-300">
                              <MapPin size={11} className="text-primary/50" />
                              <span className="text-[12px] font-normal tracking-normal">
                                {req.VVR_Places_to_Visit || "-"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="px-2.5 py-1 border-b-white/5 font-normal text-[12px]">
                            <p className="text-white font-normal tracking-wide text-[12px] opacity-80 line-clamp-1">
                              {req.VVR_Purpose || "-"}
                            </p>
                          </TableCell>
                          <TableCell className="px-2.5 py-1 border-b-white/5 font-normal text-[12px]">
                            <div className="flex items-center justify-center">
                              <StatusBadge status={req.VVR_Status} />
                            </div>
                          </TableCell>
                          <TableCell
                            className="px-2.5 py-1 border-b-white/5 font-normal text-[12px]"
                            align="right"
                          >
                            <div className="flex items-center justify-end gap-2">
                              {hasGatePass(req.VVR_Request_id) && (
                                <button
                                  onClick={() => handleViewGatePass(req)}
                                  className="w-8.5 h-8.5 flex items-center justify-center border border-green-500/30 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-all"
                                  title="Gate Pass"
                                >
                                  <QrCode size={14} />
                                </button>
                              )}
                              {canReviewRequest(req.VVR_Status) && (
                                <button
                                  onClick={() => handleOpenReviewPage(req)}
                                  className="w-8.5 h-8.5 flex items-center justify-center border border-primary/30 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all"
                                  title="View Details"
                                >
                                  <Eye size={14} />
                                </button>
                              )}
                              <button
                                onClick={() => handleOpenEdit(req)}
                                className="w-8.5 h-8.5 flex items-center justify-center border border-white/10 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 hover:text-white transition-all"
                                title="Edit"
                              >
                                <Pencil size={14} />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4 auto-rows-max">
                {filteredRequests.map((req) => (
                  <motion.div
                    key={req.VVR_Request_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="group bg-black/20 border border-white/5 rounded-[5px] overflow-hidden backdrop-blur-xl shadow-2xl hover:border-white/10 hover:bg-black/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10"
                  >
                    <div className="p-5 md:p-6 space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-primary border border-primary/20 flex-shrink-0">
                            <Hash size={11} />
                          </div>
                          <span className="text-white font-mono tracking-normal text-[13px] font-semibold truncate">
                            #{req.VVR_Request_id}
                          </span>
                        </div>
                        <div className="flex-shrink-0">
                          <StatusBadge status={req.VVR_Status} />
                        </div>
                      </div>

                      <div className="h-px bg-gradient-to-r from-white/5 via-white/10 to-white/5"></div>

                      <div className="space-y-3.5">
                        <div>
                          <p className="text-gray-500 font-semibold uppercase tracking-[0.1em] text-[9px] mb-1.5">
                            Visit Date
                          </p>
                          <div className="flex items-center gap-2 text-gray-300">
                            <Calendar
                              size={14}
                              className="text-primary/50 flex-shrink-0"
                            />
                            <span className="text-[13px] font-medium tracking-normal">
                              {req.VVR_Visit_Date
                                ? req.VVR_Visit_Date.split("T")[0].split(" ")[0]
                                : "N/A"}
                            </span>
                          </div>
                        </div>

                        <div>
                          <p className="text-gray-500 font-semibold uppercase tracking-[0.1em] text-[9px] mb-1.5">
                            Destination
                          </p>
                          <div className="flex items-center gap-2 text-gray-300">
                            <MapPin
                              size={14}
                              className="text-primary/50 flex-shrink-0"
                            />
                            <span className="text-[13px] font-medium tracking-normal truncate">
                              {req.VVR_Places_to_Visit || "-"}
                            </span>
                          </div>
                        </div>

                        <div>
                          <p className="text-gray-500 font-semibold uppercase tracking-[0.1em] text-[9px] mb-1.5">
                            Purpose
                          </p>
                          <p className="text-white font-medium tracking-wide text-[13px] opacity-80 line-clamp-2">
                            {req.VVR_Purpose || "-"}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 flex gap-2">
                        {canReviewRequest(req.VVR_Status) && (
                          <button
                            onClick={() => handleOpenReviewPage(req)}
                            className="flex-1 flex items-center justify-center p-2 border border-primary/30 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all"
                            title="Review"
                          >
                            <Eye size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit(req)}
                          className="flex-1 flex items-center justify-center p-2 border border-white/10 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 hover:text-white transition-all"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        {hasGatePass(req.VVR_Request_id) && (
                          <button
                            onClick={() => handleViewGatePass(req)}
                            className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary/10 border border-primary/30 rounded-xl text-primary hover:bg-primary/20 hover:border-primary/50 transition-all font-bold uppercase tracking-[0.1em] text-[12px] group/btn"
                          >
                            <QrCode
                              size={13}
                              className="group-hover/btn:scale-110 transition-transform"
                            />
                            Gate Pass
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-black/20 border border-white/5 rounded-[20px] overflow-hidden backdrop-blur-xl shadow-2xl p-24 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-400 border border-white/5">
                <ClipboardList size={32} />
              </div>
              <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-xs">
                No active visitation requests detected
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ─── FULL-SCREEN EDIT FORM ─── */}
      <AnimatePresence>
        {editingRequest && (
          <motion.div
            key="edit-fullscreen"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 32 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[9999] flex flex-col"
            style={{ background: "var(--color-bg-default)" }}
          >
            {/* ─── TOP NAV BAR ─── */}
            <div
              className="flex-shrink-0 flex items-center justify-between px-6"
              style={{
                background: "var(--color-bg-paper)",
                borderBottom: "1px solid var(--color-border-soft)",
                minHeight: 64,
              }}
            >
              {/* Left — breadcrumb */}
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
                      My Requests
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

              {/* Right — feedback + actions */}
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
                  onClick={handleSaveRequestCore}
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

            {/* ─── SCROLLABLE BODY ─── */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div
                style={{
                  maxWidth: 900,
                  margin: "0 auto",
                  padding: "32px 24px 80px",
                }}
                className="space-y-5"
              >
                {/* ══ REQUEST SUMMARY ══ */}
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
                        className="flex items-center gap-2"
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.14em",
                          color: "var(--color-text-dim)",
                        }}
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
                        className="flex items-center gap-2"
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.14em",
                          color: "var(--color-text-dim)",
                        }}
                      >
                        <MapPin size={11} className="text-primary" /> Places to
                        Visit
                      </label>
                      <select
                        value={editForm.VVR_Places_to_Visit}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            VVR_Places_to_Visit: e.target.value,
                          }))
                        }
                        disabled={placesLoading}
                        className={`mas-input appearance-none cursor-pointer ${placesLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                      >
                        <option value="">{placesLoading ? "Loading places..." : "Select a place to visit"}</option>
                        {placesList && placesList.length > 0 && placesList
                          .filter((place) => {
                            const status = (place.VAIL_Status || place.Status || 'A').toString().trim().toUpperCase();
                            return status === 'A';
                          })
                          .map((place, idx) => {
                            const id = place.VAIL_Item_List_ID || place.Item_List_ID || place.Id || idx;
                            const name = place.VAIL_Item_Name || place.Item_Name || place.Name || "Unknown";
                            return (
                              <option key={id} value={name}>{name}</option>
                            );
                          })}
                      </select>
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                      <label
                        className="flex items-center gap-2"
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.14em",
                          color: "var(--color-text-dim)",
                        }}
                      >
                        <Briefcase size={11} className="text-primary" /> What Is
                        The Reason?
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Briefly describe the purpose…"
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

                {/* ══ LOADING STATE ══ */}
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
                      Loading related details…
                    </span>
                  </div>
                ) : (
                  <>
                    {/* ══ VEHICLE REGISTRY ══ */}
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
                          onClick={handleAddNewVehicleRow}
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
                          No vehicles registered. Click{" "}
                          <strong>Add Vehicle</strong> to add one.
                        </p>
                      )}
                      <div className="space-y-3">
                        {editVehicles.map((vehicle, idx) => (
                          <div
                            key={vehicle.VV_Vehicle_id || idx}
                            ref={(el) => {
                              rowRefs.current[`vehicle-${idx}`] = el;
                            }}
                            className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end p-4 rounded-2xl"
                            style={(() => {
                              const isDirtyWarn =
                                warnDirty && dirtyRows.has(`vehicle-${idx}`);
                              if (isDirtyWarn)
                                return {
                                  border: "2px solid rgba(239,68,68,0.7)",
                                  background: "rgba(239,68,68,0.05)",
                                  borderRadius: "16px",
                                };
                              if (vehicle._isNew)
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
                                value={vehicle.VV_Vehicle_Number}
                                onChange={(e) =>
                                  setEditVehicles((arr) =>
                                    arr.map((v, i) =>
                                      i === idx
                                        ? {
                                          ...v,
                                          VV_Vehicle_Number: e.target.value,
                                        }
                                        : v,
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
                                Vehicle Type{" "}
                                {!vehicle._isNew && (
                                  <span style={{ fontSize: 9, opacity: 0.6 }}>
                                    (read-only)
                                  </span>
                                )}
                              </label>
                              <input
                                type="text"
                                value={vehicle.VV_Vehicle_Type}
                                onChange={(e) =>
                                  vehicle._isNew &&
                                  setEditVehicles((arr) =>
                                    arr.map((v, i) =>
                                      i === idx
                                        ? {
                                          ...v,
                                          VV_Vehicle_Type: e.target.value,
                                        }
                                        : v,
                                    ),
                                  )
                                }
                                readOnly={!vehicle._isNew}
                                style={
                                  !vehicle._isNew
                                    ? { opacity: 0.5, cursor: "not-allowed" }
                                    : {}
                                }
                                className="mas-input"
                                placeholder="e.g. Car, Van…"
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
                              {vehicle._isNew ? (
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

                    {/* ══ PEOPLE VISITING ══ */}
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
                          onClick={handleAddNewMemberRow}
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
                          No additional visitors. Click{" "}
                          <strong>Add Visitor</strong> to add one.
                        </p>
                      )}
                      <div className="space-y-3">
                        {editGroupMembers.map((member, idx) => (
                          <div
                            key={member.VVG_id || idx}
                            ref={(el) => {
                              rowRefs.current[`member-${idx}`] = el;
                            }}
                            className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end p-4 rounded-2xl"
                            style={(() => {
                              const isDirtyWarn =
                                warnDirty && dirtyRows.has(`member-${idx}`);
                              if (isDirtyWarn)
                                return {
                                  border: "2px solid rgba(239,68,68,0.7)",
                                  background: "rgba(239,68,68,0.05)",
                                  borderRadius: "16px",
                                };
                              if (member._isNew)
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
                                value={member.VVG_Visitor_Name}
                                onChange={(e) =>
                                  setEditGroupMembers((arr) =>
                                    arr.map((m, i) =>
                                      i === idx
                                        ? {
                                          ...m,
                                          VVG_Visitor_Name: e.target.value,
                                        }
                                        : m,
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
                                value={member.VVG_Designation}
                                maxLength={10}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                                  setEditGroupMembers((arr) =>
                                    arr.map((m, i) =>
                                      i === idx
                                        ? {
                                          ...m,
                                          VVG_Designation: val,
                                        }
                                        : m,
                                    ),
                                  );
                                }}
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
                                ID / Passport{" "}
                                {!member._isNew && (
                                  <span style={{ opacity: 0.6, fontSize: 9 }}>
                                    (read-only)
                                  </span>
                                )}
                              </label>
                              <input
                                type="text"
                                value={member.VVG_NIC_Passport_Number}
                                maxLength={12}
                                onChange={(e) => {
                                  if (member._isNew) {
                                    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 12);
                                    setEditGroupMembers((arr) =>
                                      arr.map((m, i) =>
                                        i === idx
                                          ? {
                                            ...m,
                                            VVG_NIC_Passport_Number: val,
                                          }
                                          : m,
                                      ),
                                    );
                                  }
                                }}
                                readOnly={!member._isNew}
                                style={
                                  !member._isNew
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
                              {member._isNew ? (
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

                    {/* ══ ITEMS TO BRING ══ */}
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
                          Items to Bring (Main Visitor)
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
                          onClick={handleAddNewItemRow}
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
                          No items declared. Click <strong>Add Item</strong> to
                          add one.
                        </p>
                      )}
                      <div className="space-y-3">
                        {editItems.map((item, idx) => (
                          <div
                            key={item.VIC_Item_id || idx}
                            ref={(el) => {
                              rowRefs.current[`item-${idx}`] = el;
                            }}
                            className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end p-4 rounded-2xl"
                            style={(() => {
                              const isDirtyWarn =
                                warnDirty && dirtyRows.has(`item-${idx}`);
                              if (isDirtyWarn)
                                return {
                                  border: "2px solid rgba(239,68,68,0.7)",
                                  background: "rgba(239,68,68,0.05)",
                                  borderRadius: "16px",
                                };
                              if (item._isNew)
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
                                value={item.VIC_Item_Name}
                                onChange={(e) =>
                                  setEditItems((arr) =>
                                    arr.map((it, i) =>
                                      i === idx
                                        ? {
                                          ...it,
                                          VIC_Item_Name: e.target.value,
                                        }
                                        : it,
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
                                value={item.VIC_Quantity}
                                onChange={(e) =>
                                  setEditItems((arr) =>
                                    arr.map((it, i) =>
                                      i === idx
                                        ? {
                                          ...it,
                                          VIC_Quantity: e.target.value,
                                        }
                                        : it,
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
                                value={item.VIC_Designation}
                                onChange={(e) =>
                                  setEditItems((arr) =>
                                    arr.map((it, i) =>
                                      i === idx
                                        ? {
                                          ...it,
                                          VIC_Designation: e.target.value,
                                        }
                                        : it,
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
                              {item._isNew ? (
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

                    {/* ══ SUB-VISITOR ITEMS CARRIED (Commented Out) ══
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
                          Sub-Visitor Items Carried
                        </h3>
                        {editJointItems.filter((it) => !it._isNew).length > 0 && (
                          <span
                            style={{
                              color: "var(--color-text-dim)",
                              fontSize: 10,
                              marginLeft: 4,
                            }}
                          >
                            {editJointItems.filter((it) => !it._isNew).length} item
                            {editJointItems.filter((it) => !it._isNew).length > 1
                              ? "s"
                              : ""}
                          </span>
                        )}
                        <span
                          style={{
                            color: "var(--color-text-dim)",
                            fontSize: 10,
                            marginLeft: "auto",
                          }}
                          className="font-semibold italic"
                        >
                          Update API coming soon
                        </span>
                        <button
                          onClick={handleAddNewSubItemRow}
                          className="btn-outline ml-2 whitespace-nowrap"
                          style={{ padding: "5px 14px", fontSize: 11, gap: 5 }}
                        >
                          <Plus size={12} /> Add Item
                        </button>
                      </div>
                      {editJointItems.length === 0 && (
                        <p
                          style={{
                            color: "var(--color-text-dim)",
                            fontSize: 11,
                          }}
                          className="font-medium"
                        >
                          No items. Click <strong>Add Item</strong> to
                          add one.
                        </p>
                      )}
                      <div className="space-y-3">
                        {editJointItems.map((item, idx) => (
                          <div
                            key={`subItem-${idx}`}
                            ref={(el) => {
                              rowRefs.current[`subItem-${idx}`] = el;
                            }}
                            className="grid grid-cols-1 md:grid-cols-[1.2fr_1.2fr_0.8fr_1.2fr_auto] gap-3 items-end p-4 rounded-2xl"
                            style={(() => {
                              const isDirtyWarn =
                                warnDirty && dirtyRows.has(`subItem-${idx}`);
                              if (isDirtyWarn)
                                return {
                                  border: "2px solid rgba(239,68,68,0.7)",
                                  background: "rgba(239,68,68,0.05)",
                                  borderRadius: "16px",
                                };
                              if (item._isNew)
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
                                Sub-Visitor
                              </label>
                              <select
                                value={item.subVisitorName || ""}
                                onChange={(e) =>
                                  setEditJointItems((arr) =>
                                    arr.map((it, i) =>
                                      i === idx
                                        ? {
                                          ...it,
                                          subVisitorName: e.target.value,
                                        }
                                        : it,
                                    ),
                                  )
                                }
                                className="mas-input appearance-none bg-transparent"
                              >
                                <option value="" className="text-black">Select...</option>
                                {editGroupMembers.map((p, pIdx) => (
                                  <option key={pIdx} value={p.VVG_Visitor_Name || p._original?.VVG_Visitor_Name} className="text-black">
                                    {p.VVG_Visitor_Name || p._original?.VVG_Visitor_Name || `Visitor ${pIdx + 1}`}
                                  </option>
                                ))}
                              </select>
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
                                Item Name
                              </label>
                              <input
                                type="text"
                                value={item.VIC_Item_Name}
                                onChange={(e) =>
                                  setEditJointItems((arr) =>
                                    arr.map((it, i) =>
                                      i === idx
                                        ? {
                                          ...it,
                                          VIC_Item_Name: e.target.value,
                                        }
                                        : it,
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
                                value={item.VIC_Quantity}
                                onChange={(e) =>
                                  setEditJointItems((arr) =>
                                    arr.map((it, i) =>
                                      i === idx
                                        ? {
                                          ...it,
                                          VIC_Quantity: e.target.value,
                                        }
                                        : it,
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
                                value={item.VIC_Designation}
                                onChange={(e) =>
                                  setEditJointItems((arr) =>
                                    arr.map((it, i) =>
                                      i === idx
                                        ? {
                                          ...it,
                                          VIC_Designation: e.target.value,
                                        }
                                        : it,
                                    ),
                                  )
                                }
                                className="mas-input"
                              />
                            </div>
                            <div className="flex flex-col items-end gap-1.5">
                              {rowSuccess[`subItem-${idx}`] && (
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
                              {item._isNew ? (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      handleRemoveNewRow("subItem", idx)
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
                                    onClick={() => handleSubmitNewSubItem(idx)}
                                    disabled={newSubItemSavingIdx !== null}
                                    className="btn-primary disabled:opacity-60 whitespace-nowrap"
                                    style={{
                                      padding: "9px 18px",
                                      fontSize: 12,
                                      background: "var(--color-success)",
                                    }}
                                  >
                                    {newSubItemSavingIdx === idx ? (
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
                                  onClick={() => handleUpdateSubItem(idx)}
                                  disabled={subItemSavingIdx !== null}
                                  className="btn-primary disabled:opacity-60 whitespace-nowrap"
                                  style={{ padding: "9px 18px", fontSize: 12 }}
                                >
                                  {subItemSavingIdx === idx ? (
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
                    */}
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

export default MyRequests;



