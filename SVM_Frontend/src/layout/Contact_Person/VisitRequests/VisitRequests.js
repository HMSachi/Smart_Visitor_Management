import React, { useEffect, useRef, useState, useMemo } from "react";
import ReactDOM from "react-dom";
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
import { GetAllGatePasses } from "../../../actions/GatePassAction";
import { GetAllBlacklist } from "../../../actions/BlacklistAction";
import { GetAllPlaces } from "../../../actions/PlacesAction";
import VisitRequestService from "../../../services/VisitRequestService";
import VehicleService from "../../../services/VehicleService";
import VisitGroupService from "../../../services/VisitGroupService";
import ItemCarriedService from "../../../services/ItemCarriedService";
import ContactPersonService from "../../../services/ContactPersonService";
import VisitorService from "../../../services/VisitorService";
import VisitorAttachmentService from "../../../services/VisitorAttachmentService";
import Header from "../../../components/Contact_Person/Layout/Header";
import AttachmentPreviewModal from "../../../components/common/AttachmentPreviewModal";
import { useAttachmentPreview } from "../../../hooks/useAttachmentPreview";

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
  QrCode,
  Download,
  FileText,
  FolderOpen,
  ImageIcon,
  ShieldCheck,
  Phone,
  Paperclip,
  Upload,
} from "lucide-react";
import { setSelectedRequest } from "../../../reducers/contactPersonSlice";
import { QRCodeSVG } from "qrcode.react";
import { encodeSecureQrPayload } from "../../../utils/secureQrPayload";

const StatusBadge = ({ status }) => {
  const s = (status || "").toString().trim().toUpperCase();
  switch (s) {
    case "A":
    case "APPROVED":
      return (
        <div className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-500 rounded-[5px] text-[9px] font-bold tracking-[0.1em] flex items-center justify-center w-max shadow-sm">
          Admin approved
        </div>
      );
    case "R":
    case "REJECTED":
      return (
        <div className="px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary rounded-[5px] text-[9px] font-bold tracking-[0.1em] flex items-center justify-center w-max shadow-sm">
          Declined
        </div>
      );
    case "ACCEPTED":
      return (
        <div className="px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-[5px] text-[9px] font-bold tracking-[0.1em] flex items-center justify-center w-max shadow-sm">
          Accepted by visitor
        </div>
      );
    case "SENT":
    case "SENT_TO_ADMIN":
    case "SENT TO ADMIN":
      return (
        <div className="px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-[5px] text-[9px] font-bold tracking-[0.1em] flex items-center justify-center w-max shadow-sm">
          Contact person accepted
        </div>
      );
    case "P":
    case "PENDING":
    default:
      return (
        <div className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-[5px] text-[9px] font-bold tracking-[0.1em] flex items-center justify-center w-max shadow-sm">
          Sent to visitor
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
  const { gatePasses } = useSelector(
    (state) => state.gatePassState || { gatePasses: [] },
  );
  const visitorMgmtData = useSelector((state) => state.visitorManagement);
  const visitorsByCP = Array.isArray(visitorMgmtData?.visitorsByCP)
    ? visitorMgmtData.visitorsByCP
    : [];
  const { blacklists } = useSelector(
    (state) => state.blacklistState || { blacklists: [] },
  );
  const { places: placesList, loading: placesLoading } = useSelector(
    (state) => state.placesState || { places: [], loading: false },
  );
  const { themeMode } = useThemeMode();
  const { previewData, openPreview, closePreview } = useAttachmentPreview();
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
  const [editJointItems, setEditJointItems] = useState([]);
  const [editSaving, setEditSaving] = useState(false);
  const [editLoadingData, setEditLoadingData] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [isLoadingMain, setIsLoadingMain] = useState(true);
  const [vehicleSavingIdx, setVehicleSavingIdx] = useState(null);
  const [memberSavingIdx, setMemberSavingIdx] = useState(null);
  const [itemSavingIdx, setItemSavingIdx] = useState(null);
  const [newVehicleSavingIdx, setNewVehicleSavingIdx] = useState(null);

  // Vehicle Insurance upload state per vehicle index: 'uploading' | 'done' | 'error'
  const [insuranceUploading, setInsuranceUploading] = useState({});
  const [insuranceModal, setInsuranceModal] = useState({
    open: false,
    visitorId: null,
    visitorName: "",
    vehicleIdx: null,
    loading: false,
    list: [],
    error: null,
  });
  const [insuranceFile, setInsuranceFile] = useState(null);
  const [insuranceUploadResult, setInsuranceUploadResult] = useState(null);

  const openInsuranceModal = async (idx) => {
    console.log("[Insurance Modal] Button clicked for vehicle index:", idx);
    console.log("[Insurance Modal] editingRequest:", editingRequest);
    const visitorId = editingRequest?.VVR_Visitor_id;
    console.log("[Insurance Modal] visitorId:", visitorId);
    if (!visitorId) {
      console.error("[Insurance Modal] No visitor ID found!");
      alert("Visitor ID not found in this request.");
      return;
    }
    const visitorName =
      editingRequest?.VV_Name || editingRequest?.VVR_Visitor_Name || "";
    console.log(
      "[Insurance Modal] Opening modal with visitorName:",
      visitorName,
    );
    setInsuranceModal({
      open: true,
      visitorId,
      visitorName,
      vehicleIdx: idx,
      loading: true,
      list: [],
      error: null,
    });
    setInsuranceFile(null);
    setInsuranceUploadResult(null);
    try {
      console.log("[Insurance Modal] Fetching attachments...");
      const res =
        await VisitorAttachmentService.GetAttachmentsByVisitorId(visitorId);
      const rawList = res?.data?.ResultSet || res?.data || [];
      const allAttachments = Array.isArray(rawList) ? rawList : [];
      // Filter to show only vehicle insurance attachments
      const list = allAttachments.filter(
        (att) =>
          (att.VAT_File_Category || att.FileCategory || "").toLowerCase() ===
          "vehicle insurance",
      );
      console.log("[Insurance Modal] Attachments loaded:", list);
      setInsuranceModal((prev) => ({ ...prev, loading: false, list }));
    } catch (err) {
      console.error("[Insurance Modal] Error loading attachments:", err);
      setInsuranceModal((prev) => ({
        ...prev,
        loading: false,
        error: err?.message || "Failed to load attachments.",
      }));
    }
  };

  const closeInsuranceModal = () => {
    setInsuranceModal({
      open: false,
      visitorId: null,
      visitorName: "",
      vehicleIdx: null,
      loading: false,
      list: [],
      error: null,
    });
    setInsuranceFile(null);
    setInsuranceUploadResult(null);
  };

  const handleInsuranceFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setInsuranceFile(file);
    setInsuranceUploadResult(null);
  };

  const handleInsuranceUpload = async () => {
    if (!insuranceFile || !insuranceModal.visitorId) return;
    const idx = insuranceModal.vehicleIdx;
    const pUid = user?.ResultSet?.[0]?.VA_Name || "ContactPerson";
    setInsuranceUploading((prev) => ({ ...prev, [idx]: "uploading" }));
    setInsuranceUploadResult(null);
    try {
      await VisitorAttachmentService.UploadAttachment(
        insuranceModal.visitorId,
        "Vehicle Insurance",
        pUid,
        insuranceFile,
      );
      setInsuranceUploadResult({ success: true, message: "Uploaded" });
      setInsuranceFile(null);
      const res = await VisitorAttachmentService.GetAttachmentsByVisitorId(
        insuranceModal.visitorId,
      );
      const rawList = res?.data?.ResultSet || res?.data || [];
      const list = Array.isArray(rawList) ? rawList : [];
      setInsuranceModal((prev) => ({ ...prev, list }));
      setInsuranceUploading((prev) => ({ ...prev, [idx]: "done" }));
      setTimeout(
        () =>
          setInsuranceUploading((prev) => {
            const n = { ...prev };
            delete n[idx];
            return n;
          }),
        3000,
      );
    } catch (err) {
      console.error("Insurance upload failed:", err);
      setInsuranceUploadResult({
        success: false,
        message: err?.message || "Upload failed.",
      });
      setInsuranceUploading((prev) => ({ ...prev, [idx]: "error" }));
      setTimeout(
        () =>
          setInsuranceUploading((prev) => {
            const n = { ...prev };
            delete n[idx];
            return n;
          }),
        3000,
      );
    }
  };

  // Sub-Visitor NIC upload state per subvisitor index: 'uploading' | 'done' | 'error'
  const [subVisitorNicUploading, setSubVisitorNicUploading] = useState({});
  const [subVisitorNicModal, setSubVisitorNicModal] = useState({
    open: false,
    memberIdx: null,
    subVisitorId: null,
    subVisitorName: "",
    loading: false,
    list: [],
    error: null,
  });
  const [subVisitorNicFile, setSubVisitorNicFile] = useState(null);
  const [subVisitorNicUploadResult, setSubVisitorNicUploadResult] = useState(null);
  const subVisitorNicFileInputRef = useRef(null);

  const openSubVisitorNicModal = async (idx) => {
    console.log("[SubVisitor NIC Modal] Button clicked for member index:", idx);
    const member = editGroupMembers[idx];
    if (!member) return;
    const subVisitorId = member.VVG_id;
    if (!subVisitorId) {
      alert("Please submit/save this visitor first before uploading attachments.");
      return;
    }
    const visitorId = editingRequest?.VVR_Visitor_id;
    if (!visitorId) {
      alert("Visitor ID not found in this request.");
      return;
    }

    setSubVisitorNicModal({
      open: true,
      memberIdx: idx,
      subVisitorId,
      subVisitorName: member.VVG_Visitor_Name || "Sub-Visitor",
      loading: true,
      list: [],
      error: null,
    });
    setSubVisitorNicFile(null);
    setSubVisitorNicUploadResult(null);

    try {
      console.log("[SubVisitor NIC Modal] Fetching attachments...");
      const res = await VisitorAttachmentService.GetAttachmentsByGroupId(subVisitorId);
      const rawList = res?.data?.ResultSet || res?.data || [];
      const list = Array.isArray(rawList) ? rawList : [];
      console.log("[SubVisitor NIC Modal] Attachments loaded:", list);
      setSubVisitorNicModal((prev) => ({ ...prev, loading: false, list }));
    } catch (err) {
      console.error("[SubVisitor NIC Modal] Error loading attachments:", err);
      setSubVisitorNicModal((prev) => ({
        ...prev,
        loading: false,
        error: err?.message || "Failed to load attachments.",
      }));
    }
  };

  const closeSubVisitorNicModal = () => {
    setSubVisitorNicModal({
      open: false,
      memberIdx: null,
      subVisitorId: null,
      subVisitorName: "",
      loading: false,
      list: [],
      error: null,
    });
    setSubVisitorNicFile(null);
    setSubVisitorNicUploadResult(null);
  };

  const handleSubVisitorNicFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubVisitorNicFile(file);
    setSubVisitorNicUploadResult(null);
  };

  const handleSubVisitorNicUpload = async () => {
    if (!subVisitorNicFile || !subVisitorNicModal.subVisitorId) return;
    const idx = subVisitorNicModal.memberIdx;
    const visitorId = editingRequest?.VVR_Visitor_id;
    if (!visitorId) return;
    const pUid = user?.ResultSet?.[0]?.VA_Name || "ContactPerson";
    setSubVisitorNicUploading((prev) => ({ ...prev, [idx]: "uploading" }));
    setSubVisitorNicUploadResult(null);
    try {
      await VisitorAttachmentService.UploadSubVisitorAttachment(
        subVisitorNicModal.subVisitorId,
        visitorId,
        "NIC",
        pUid,
        subVisitorNicFile,
      );
      setSubVisitorNicUploadResult({ success: true, message: "Uploaded" });
      setSubVisitorNicFile(null);
      const res = await VisitorAttachmentService.GetAttachmentsByGroupId(
        subVisitorNicModal.subVisitorId,
      );
      const rawList = res?.data?.ResultSet || res?.data || [];
      const list = Array.isArray(rawList) ? rawList : [];
      setSubVisitorNicModal((prev) => ({ ...prev, list }));
      setSubVisitorNicUploading((prev) => ({ ...prev, [idx]: "done" }));
      setTimeout(
        () =>
          setSubVisitorNicUploading((prev) => {
            const n = { ...prev };
            delete n[idx];
            return n;
          }),
        3000,
      );
    } catch (err) {
      console.error("SubVisitor NIC upload failed:", err);
      setSubVisitorNicUploadResult({
        success: false,
        message: err?.message || "Upload failed.",
      });
      setSubVisitorNicUploading((prev) => ({ ...prev, [idx]: "error" }));
      setTimeout(
        () =>
          setSubVisitorNicUploading((prev) => {
            const n = { ...prev };
            delete n[idx];
            return n;
          }),
        3000,
      );
    }
  };
  const [newMemberSavingIdx, setNewMemberSavingIdx] = useState(null);
  const [newItemSavingIdx, setNewItemSavingIdx] = useState(null);
  const [subItemSavingIdx, setSubItemSavingIdx] = useState(null);
  const [newSubItemSavingIdx, setNewSubItemSavingIdx] = useState(null);
  const [rowSuccess, setRowSuccess] = useState({});
  const [editError, setEditError] = useState("");
  const [dirtyRows, setDirtyRows] = useState(new Set());
  const [warnDirty, setWarnDirty] = useState(false);
  const rowRefs = useRef({});
  const insuranceFileInputRef = useRef(null);

  // ─── Gate Pass Modal State ──────────────────────────────────────────────────
  const [isGatePassModalOpen, setIsGatePassModalOpen] = useState(false);
  const [selectedGatePass, setSelectedGatePass] = useState(null);
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);
  const [encodedQr, setEncodedQr] = useState("");

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
        VVR_Status: "SENT",
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
    dispatch(GetAllGatePasses());
  }, [userEmail, user, dispatch]);

  useEffect(() => {
    if (!cpId) return;
    dispatch(GetVisitRequestsByCP(cpId));
    dispatch(GetVisitorsByCP(cpId));
    dispatch(GetAllBlacklist());
    dispatch(GetAllPlaces());
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

  const handleViewGatePass = async (req) => {
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
    if (!gatePassId) return;

    // Instead of navigating, open the modal
    setSelectedGatePass({
      ...gatePass,
      visitorName: getVisitorDisplayName(req),
    });
    setIsGatePassModalOpen(true);
    setIsGeneratingQr(true);

    try {
      const payload = {
        id: gatePassId,
        v: 1,
        iat: Date.now(),
      };
      const encoded = await encodeSecureQrPayload(payload);
      setEncodedQr(encoded);
    } catch (err) {
      console.error("Failed to generate secure QR:", err);
      setEncodedQr("");
    } finally {
      setIsGeneratingQr(false);
    }
  };

  const handleDownloadQR = () => {
    const svg = document.querySelector(".gate-pass-modal-qr svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `GatePass_${selectedGatePass?.VGP_Pass_id || "Visitor"}.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
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
    setEditJointItems([]);
    setEditLoadingData(true);
    try {
      const reqId = String(req.VVR_Request_id);
      const [vRes, gRes, iRes, jRes] = await Promise.all([
        VehicleService.GetAllVehicles(),
        VisitGroupService.GetAllVisitGroup(),
        ItemCarriedService.GetAllItemsCarried(),
        VisitorService.GetVisitorJoint(req.VVR_Request_id).catch(() => null),
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
      const rawJoint = jRes?.data?.ResultSet || jRes?.data || [];
      setEditJointItems(
        Array.isArray(rawJoint)
          ? rawJoint.map((i) => ({
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
          : [],
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
    setEditJointItems([]);
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
    editJointItems.forEach((it, i) => {
      if (isSubItemDirty(it)) unsaved.push(`subItem-${i}`);
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

    // Check blacklist before updating
    const isBlacklisted = (blacklists || []).some(
      (b) =>
        b.VB_Name &&
        b.VB_Name.toLowerCase() === m.VVG_Visitor_Name?.toLowerCase() &&
        b.VB_Status === "A",
    );
    if (isBlacklisted) {
      setEditError(
        `Access Restricted for ${m.VVG_Visitor_Name}. They are blacklisted.`,
      );
      return;
    }

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

    // Check blacklist before adding
    const isBlacklisted = (blacklists || []).some(
      (b) =>
        b.VB_Name &&
        b.VB_Name.toLowerCase() === m.VVG_Visitor_Name?.toLowerCase() &&
        b.VB_Status === "A",
    );
    if (isBlacklisted) {
      setEditError(
        `Access Restricted for ${m.VVG_Visitor_Name}. They are blacklisted.`,
      );
      return;
    }

    setNewMemberSavingIdx(idx);
    setEditError("");
    try {
      const res = await VisitGroupService.AddVisitGroup({
        VVG_Visitor_Name: m.VVG_Visitor_Name,
        VVG_NIC_Passport_Number: m.VVG_NIC_Passport_Number,
        VVG_Designation: m.VVG_Designation,
        VVG_Status: "A",
        VVR_Request_id: editingRequest.VVR_Request_id,
      });
      const vvgId =
        res?.data?.ResultSet?.[0]?.VGIdParam ||
        res?.data?.ResultSet?.VGIdParam ||
        res?.data?.VGIdParam ||
        res?.ResultSet?.[0]?.VGIdParam ||
        "saved";
      setEditGroupMembers((a) =>
        a.map((x, i) =>
          i === idx
            ? {
                ...x,
                _isNew: false,
                VVG_id: vvgId,
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
    if (section === "subItem")
      setEditJointItems((a) => a.filter((_, i) => i !== idx));
  };

  const handleUpdateSubItem = async (idx) => {
    const it = editJointItems[idx];
    if (it._isNew || subItemSavingIdx !== null) return;
    setSubItemSavingIdx(idx);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API Call
      setEditJointItems((a) =>
        a.map((x, i) =>
          i === idx
            ? {
                ...x,
                _original: {
                  subVisitorName: x.subVisitorName,
                  VIC_Item_Name: x.VIC_Item_Name,
                  VIC_Quantity: x.VIC_Quantity,
                  VIC_Designation: x.VIC_Designation,
                },
              }
            : x,
        ),
      );
      clearDirty(`subItem-${idx}`);
      flashSuccess(`subItem-${idx}`);
    } catch (e) {
      console.error(e);
    } finally {
      setSubItemSavingIdx(null);
    }
  };

  const handleSubmitNewSubItem = async (idx) => {
    const it = editJointItems[idx];
    if (!it?._isNew || newSubItemSavingIdx !== null) return;
    if (!it.subVisitorName || !it.VIC_Item_Name) {
      setEditError("Sub-Visitor Name and Item Name are required.");
      return;
    }
    setNewSubItemSavingIdx(idx);
    setEditError("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API Call
      setEditJointItems((a) =>
        a.map((x, i) =>
          i === idx
            ? {
                ...x,
                _isNew: false,
                _original: {
                  subVisitorName: x.subVisitorName,
                  VIC_Item_Name: x.VIC_Item_Name,
                  VIC_Quantity: x.VIC_Quantity,
                  VIC_Designation: x.VIC_Designation,
                },
              }
            : x,
        ),
      );
      clearDirty(`subItem-${idx}`);
      flashSuccess(`subItem-${idx}`);
    } catch (e) {
      console.error(e);
      setEditError("Failed to add sub-visitor item.");
    } finally {
      setNewSubItemSavingIdx(null);
    }
  };

  const handleReview = (requestId) => {
    dispatch(setSelectedRequest(requestId));
    navigate("/contact_person/request-review", {
      state: { requestId },
    });
  };

  const statusOptions = [
    { id: "All", label: "All requests" },
    { id: "P", label: "Sent to visitor" },
    { id: "ACCEPTED", label: "Visitor accepted" },
    { id: "SENT", label: "Sent to admin" },
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
              className={`inline-flex items-center text-[12px] font-normal tracking-wide max-w-full ${isLight ? "text-[#1A1A1A]" : "text-white/85"}`}
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
      <Header title="Active Visit Requests" />

      <div className="p-3 md:p-5 animate-fade-in-slow relative max-w-[1700px] mx-auto w-full z-10">
        <div className="mb-8 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          <div className="overflow-x-auto no-scrollbar pb-1">
            <div
              className={`inline-flex p-1 rounded-full border transition-all gap-0.5 ${isLight ? "bg-white border-gray-100 shadow-sm" : "bg-black/20 border-white/5"}`}
            >
              {statusOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setStatusFilter(option.id)}
                  className={`relative px-4 py-2 rounded-full text-[13px] font-medium tracking-wide transition-all duration-300 whitespace-nowrap ${
                    statusFilter === option.id
                      ? "text-white"
                      : isLight
                        ? "text-gray-500 hover:text-primary"
                        : "text-white/40 hover:text-white"
                  }`}
                >
                  {statusFilter === option.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary rounded-full shadow-[0_4px_12px_rgba(200,16,46,0.25)]"
                      transition={{
                        type: "spring",
                        bounce: 0.15,
                        duration: 0.5,
                      }}
                    />
                  )}
                  <span className="relative z-10 capitalize">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 items-center shrink-0">
            <div
              className={`flex items-center border transition-all rounded-[8px] px-3 h-9 min-w-[220px] w-full sm:w-[280px] md:w-[320px] group shadow-sm ${isLight ? "bg-white border-gray-200 hover:border-primary/20 focus-within:border-primary/40" : "bg-black/40 border-white/10 focus-within:border-primary hover:border-white/20"}`}
            >
              <Search
                size={14}
                className={`transition-colors mr-2 ${isLight ? "text-gray-400 group-focus-within:text-primary" : "text-white/20 group-focus-within:text-primary"}`}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className={`bg-transparent text-[13px] focus:outline-none w-full tracking-wide ${isLight ? "text-[#1A1A1A] placeholder:text-gray-400" : "text-white placeholder:text-white/20"}`}
              />
            </div>

            <button
              onClick={() => navigate("/contact_person/create-visit-request")}
              className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 h-9 rounded-[8px] text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95 group"
            >
              <Plus
                size={16}
                className="group-hover:rotate-90 transition-transform"
              />
              Create Request
            </button>
          </div>
        </div>

        <div
          className={`border rounded-[20px] overflow-hidden relative ${isLight ? "bg-white border-gray-200 shadow-lg shadow-gray-200/40" : "bg-[#0F0F10] border-white/5"}`}
        >
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`h-16 rounded-2xl animate-pulse ${isLight ? "bg-gray-50" : "bg-white/[0.02]"}`}
                />
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
              className="custom-scrollbar relative z-10 overflow-auto"
              style={{ height: "calc(100vh - 160px)" }}
            >
              {isMobile ? (
                <div className="p-4 space-y-6">
                  {filteredRequests && filteredRequests.length > 0 ? (
                    filteredRequests.map((req) => (
                      <div
                        key={req.VVR_Request_id}
                        className={`p-5 rounded-[28px] border transition-all ${isLight ? "bg-white border-gray-100 shadow-sm" : "bg-white/5 border-white/5"}`}
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h4
                              className={`text-[13px] font-black uppercase tracking-tight ${isLight ? "text-gray-900" : "text-white"}`}
                            >
                              {getVisitorDisplayName(req)}
                            </h4>
                            <p className="text-gray-400 text-[9px] font-bold tracking-[0.2em] mt-1 uppercase opacity-70">
                              BATCH-{new Date().getFullYear()}-
                              {req.VVR_Request_id.toString().padStart(3, "0")}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-3">
                            <StatusBadge status={req.VVR_Status} />
                            <button
                              onClick={() => handleViewGatePass(req)}
                              className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${isLight ? "text-gray-500 hover:text-primary" : "text-white/40 hover:text-primary"} transition-colors`}
                            >
                              <QrCode size={14} /> View Pass
                            </button>
                          </div>
                        </div>

                        <div className="space-y-4 mb-6 px-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-gray-400">
                              <Calendar size={14} className="text-primary/70" />
                              <span className="text-[9px] font-black uppercase tracking-[0.15em]">
                                Deployed
                              </span>
                            </div>
                            <span
                              className={`text-[10px] font-bold ${isLight ? "text-gray-700" : "text-gray-200"}`}
                            >
                              {req.VVR_Visit_Date
                                ? req.VVR_Visit_Date.split("T")[0]
                                : "N/A"}{" "}
                              // {req.VVR_Visit_Time || "08:30 AM"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-gray-400">
                              <MapPin size={14} className="text-primary/70" />
                              <span className="text-[9px] font-black uppercase tracking-[0.15em]">
                                Areas
                              </span>
                            </div>
                            <span
                              className={`text-[10px] font-bold truncate max-w-[160px] text-right ${isLight ? "text-gray-700" : "text-gray-200"}`}
                            >
                              {req.VVR_Purpose || "General Access"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-gray-400">
                              <AlertCircle
                                size={14}
                                className="text-primary/70"
                              />
                              <span className="text-[9px] font-black uppercase tracking-[0.15em]">
                                Request
                              </span>
                            </div>
                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[9px] font-black border border-primary/20">
                              1
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleReview(req.VVR_Request_id)}
                          className={`w-full py-1.5 rounded-2xl border transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm active:scale-[0.98] ${isLight ? "bg-white border-gray-100 text-gray-600 hover:bg-gray-50" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"}`}
                        >
                          <Eye size={15} /> Inspect
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-20 text-center opacity-40">
                      <ClipboardList size={40} className="mx-auto mb-3" />
                      <p className="text-[10px] font-bold uppercase tracking-widest">
                        No Requests Found
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr
                        className={`text-[12px] font-normal tracking-[0.3em] border-b ${isLight ? "bg-[#FAFAFB] text-gray-400 border-gray-100" : "bg-white/[0.02] text-white/40 border-white/5"}`}
                      >
                        <th className="px-3 py-2 text-center w-[60px] font-normal text-[12px] hidden md:table-cell">
                          ID
                        </th>
                        <th className="px-3 py-2 text-left font-normal text-[12px]">
                          Visitor
                        </th>
                        <th className="px-3 py-2 text-center font-normal text-[12px] hidden md:table-cell">
                          Date
                        </th>
                        <th className="px-3 py-2 text-left font-normal text-[12px] hidden lg:table-cell">
                          Reason
                        </th>
                        <th className="px-3 py-2 text-left font-normal text-[12px] hidden xl:table-cell">
                          Areas
                        </th>
                        <th className="px-3 py-2 text-center font-normal text-[12px]">
                          Status
                        </th>
                        <th className="px-3 py-2 text-center w-[80px] font-normal text-[12px]">
                          Gatepass
                        </th>
                        <th className="px-3 py-2 text-center w-[120px] font-normal text-[12px]">
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
                            <td className="px-3 py-1 text-center text-primary text-[12px] tracking-wide font-normal hidden md:table-cell">
                              #{req.VVR_Request_id}
                            </td>
                            <td className="px-3 py-1 text-left font-normal text-[12px]">
                              <span
                                className={`font-normal text-[12px] tracking-wide ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
                              >
                                {getVisitorDisplayName(req)}
                              </span>
                            </td>
                            <td className="px-3 py-1 font-normal text-[12px] hidden md:table-cell">
                              <div
                                className={`flex flex-col items-center justify-center gap-1.5 text-[12px] ${isLight ? "text-gray-500" : "text-white/70"}`}
                              >
                                <span className="font-normal tracking-wide">
                                  {req.VVR_Visit_Date
                                    ? req.VVR_Visit_Date.split("T")[0].split(
                                        " ",
                                      )[0]
                                    : "N/A"}
                                </span>
                              </div>
                            </td>
                            <td className="px-3 py-1 text-left font-normal text-[12px] hidden lg:table-cell">
                              <div className="max-w-[170px]">
                                <p
                                  title={
                                    req.VVR_Purpose || "No purpose specified"
                                  }
                                  className={`font-normal tracking-wide text-[12px] truncate ${isLight ? "text-[#1A1A1A]" : "text-white/90"}`}
                                >
                                  {req.VVR_Purpose || "-"}
                                </p>
                              </div>
                            </td>
                            <td className="px-3 py-1 align-top text-left font-normal text-[12px] hidden xl:table-cell">
                              <div
                                className={`flex flex-col gap-2 text-[12px] font-normal tracking-wide min-w-0 ${isLight ? "text-gray-500" : "text-white/55"}`}
                              >
                                <div className="min-w-0 max-w-[280px] lg:max-w-[360px]">
                                  {renderVisitAreas(req)}
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-1 text-center font-normal text-[12px]">
                              <div className="flex items-center justify-center">
                                <StatusBadge status={req.VVR_Status} />
                              </div>
                            </td>
                            <td className="px-3 py-1 text-center font-normal text-[12px]">
                              <div className="flex items-center justify-center">
                                {hasGatePass(req.VVR_Request_id) && (
                                  <button
                                    onClick={() => handleViewGatePass(req)}
                                    className={`inline-flex h-8.5 w-8.5 items-center justify-center rounded-xl border border-transparent transition-all group/btn ${isLight ? "bg-green-500/5 text-green-600 border-green-500/20 hover:bg-green-500 hover:text-white hover:shadow-lg hover:shadow-green-500/25" : "bg-green-400/5 text-green-400 border-green-400/20 hover:bg-green-400 hover:text-white hover:shadow-lg hover:shadow-green-400/25"}`}
                                    title="View Gate Pass"
                                  >
                                    <QrCode
                                      size={14}
                                      className="shrink-0 transition-transform group-hover/btn:scale-110"
                                    />
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-1 text-center font-normal text-[12px]">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() =>
                                    handleReview(req.VVR_Request_id)
                                  }
                                  className={`inline-flex h-8.5 w-8.5 items-center justify-center rounded-xl border border-transparent transition-all group/btn ${isLight ? "bg-primary/5 text-primary border-primary/20 hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/25" : "bg-blue-400/5 text-blue-400 border-blue-400/20 hover:bg-blue-400 hover:text-white hover:shadow-lg hover:shadow-blue-400/25"}`}
                                  title="View Request Details"
                                >
                                  <Eye
                                    size={14}
                                    className="shrink-0 transition-transform group-hover/btn:scale-110"
                                  />
                                </button>
                                <button
                                  onClick={() => handleOpenEdit(req)}
                                  className={`inline-flex h-8.5 w-8.5 items-center justify-center rounded-xl border border-transparent transition-all ${isLight ? "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200" : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"}`}
                                  title="Edit"
                                >
                                  <Edit size={14} className="shrink-0" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={8}
                            className="py-24 text-center font-normal text-[12px]"
                          >
                            <div className="flex flex-col items-center justify-center opacity-20">
                              <ClipboardList
                                size={48}
                                className={`mb-4 ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
                              />
                              <p
                                className={`uppercase tracking-[0.4em] text-[10px] font-normal ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
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
                          className={`w-full border rounded-xl px-5 py-4 text-[13px] text-left focus:outline-none focus:border-primary/50 appearance-none cursor-pointer transition-all flex items-center justify-between ${
                            isLight
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
                            className={`absolute top-full left-0 right-0 z-50 mt-2 border rounded-xl shadow-lg ${
                              isLight
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
                                className={`w-full border rounded-lg px-3 py-2 text-[12px] focus:outline-none focus:border-primary/50 transition-all ${
                                  isLight
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
                                    className={`w-full px-4 py-1.5 text-left text-[12px] font-medium transition-all border-b border-white/5 last:border-b-0 flex items-center justify-between group ${
                                      String(formData.VVR_Visitor_id) ===
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
                                        className={`text-[10px] ${
                                          isLight
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
                                  className={`px-4 py-6 text-center text-[11px] font-semibold tracking-[0.1em] uppercase ${
                                    isLight ? "text-gray-400" : "text-white/40"
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
                      className={`w-full border rounded-xl px-5 py-4 text-[13px] focus:outline-none focus:border-primary/50 transition-all ${
                        isLight
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
                    <select
                      required
                      name="VVR_Places_to_Visit"
                      value={formData.VVR_Places_to_Visit}
                      onChange={handleInputChange}
                      disabled={placesLoading}
                      className={`w-full border rounded-xl px-5 py-4 text-[13px] focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer ${
                        isLight
                          ? "bg-gray-50 border-gray-200 text-[#1A1A1A] hover:bg-gray-100"
                          : "bg-white/[0.03] border-white/10 text-white hover:bg-white/[0.05]"
                      } ${placesLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      <option value="">
                        {placesLoading
                          ? "Loading places..."
                          : "Select a place to visit"}
                      </option>
                      {placesList &&
                        placesList.length > 0 &&
                        placesList
                          .filter((place) => {
                            const status = (
                              place.VAIL_Status ||
                              place.Status ||
                              "A"
                            )
                              .toString()
                              .trim()
                              .toUpperCase();
                            return status === "A";
                          })
                          .map((place, idx) => {
                            const id =
                              place.VAIL_Item_List_ID ||
                              place.Item_List_ID ||
                              place.Id ||
                              idx;
                            const name =
                              place.VAIL_Item_Name ||
                              place.Item_Name ||
                              place.Name ||
                              "Unknown";
                            return (
                              <option key={id} value={name}>
                                {name}
                              </option>
                            );
                          })}
                    </select>
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
                      className={`w-full border rounded-xl px-5 py-4 text-[13px] focus:outline-none focus:border-primary/50 resize-none transition-all ${
                        isLight
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
                    className="px-5 py-1.5 rounded-xl text-[11px] font-bold text-gray-500 hover:text-white hover:bg-white/5 uppercase tracking-[0.2em] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-7 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-[11px] font-bold uppercase tracking-[0.2em] shadow-[0_8px_25px_rgba(200,16,46,0.3)] transition-all"
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
          {(selectedReq?.VVR_Status === "ACCEPTED" ||
            selectedReq?.VVR_Status === "Accepted by Visitor") && (
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

        {/* ─── GATE PASS MODAL ─── */}
        <AnimatePresence>
          {isGatePassModalOpen && selectedGatePass && (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsGatePassModalOpen(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-[430px] bg-[#161618]/95 backdrop-blur-3xl border border-white/20 shadow-[0_24px_80px_rgba(0,0,0,0.9)] rounded-[32px] overflow-hidden relative"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-green-500/40 to-transparent"></div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-500/5 rounded-full blur-[100px] pointer-events-none"></div>

                {/* Modal Header */}
                <div className="p-5 border-b border-white/5 flex items-center justify-between relative z-10 bg-white/[0.01]">
                  <div className="flex flex-col md:flex-row items-center gap-4 md:gap-4">
                    <div className="w-8 h-8 bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-center rounded-xl shadow-lg">
                      <ShieldCheck size={16} />
                    </div>
                    <div>
                      <p className="text-gray-300/90 text-[11px] font-medium capitalize tracking-[0.16em] mb-1">
                        Entry Pass System
                      </p>
                      <h2 className="text-white text-[15px] font-bold capitalize tracking-[0.14em]">
                        Your Pass is Ready
                      </h2>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsGatePassModalOpen(false)}
                    className="text-gray-500 hover:text-white transition-all bg-white/5 p-2 rounded-xl border border-white/5 hover:border-white/20"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center relative z-10">
                  <div className="relative group/qr p-6 mas-glass rounded-[22px] mb-8 shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-all hover:scale-105 visitor-qr-svg-container gate-pass-modal-qr">
                    {isGeneratingQr ? (
                      <div className="w-[160px] h-[160px] flex items-center justify-center">
                        <Loader2
                          className="animate-spin text-primary"
                          size={24}
                        />
                      </div>
                    ) : (
                      <QRCodeSVG
                        value={encodedQr || "SVMQR_ERROR"}
                        size={160}
                        level="H"
                      />
                    )}
                    <div className="absolute inset-x-0 -bottom-2 flex justify-center">
                      <span className="bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] capitalize border border-white/20">
                        Pass No.{" "}
                        {selectedGatePass.VGP_Pass_id ||
                          selectedGatePass.vgp_Pass_id}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-gray-300/80 text-[11px] font-medium capitalize tracking-[0.3em]">
                      Identity Verified ✓
                    </p>
                    <p className="text-white text-xl font-medium capitalize tracking-widest flex items-center justify-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      {selectedGatePass.visitorName}
                    </p>
                    <div className="h-[1px] w-12 bg-white/10 mx-auto my-3"></div>
                    <p className="text-gray-400 text-[11px] capitalize tracking-widest leading-relaxed max-w-[300px]">
                      Present this digital gate pass at the security checkpoint
                      for verification.
                    </p>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t border-white/5 bg-white/[0.01] relative z-10 flex flex-col md:flex-row gap-3 md:gap-3">
                  <button
                    onClick={handleDownloadQR}
                    className="flex-1 py-1.5 bg-green-500/10 border border-green-500/20 text-green-500 hover:bg-green-500 hover:text-white text-[10px] font-bold capitalize tracking-[0.16em] rounded-xl transition-all shadow-xl flex items-center justify-center gap-2"
                  >
                    <Download size={13} /> Save
                  </button>
                  <button
                    onClick={() => setIsGatePassModalOpen(false)}
                    className="py-1.5 px-6 border border-white/10 text-white text-[10px] font-bold capitalize tracking-[0.16em] rounded-xl hover:bg-white/5 transition-all"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
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
                className="space-y-2"
              >
                {/* ── Request Summary card (mirrors View "Visit Details" section) ── */}
                <div
                  className={`rounded-[12px] border overflow-hidden ${isLight ? "bg-white border-gray-200" : "bg-black/25 border-white/10"}`}
                >
                  <div className="p-4 md:p-5">
                    {/* SplitSection header */}
                    <div className="flex flex-col gap-2 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-[3px] h-3.5 bg-primary rounded-full" />
                        <div className="flex items-center gap-1.5">
                          <Hash size={13} className="text-primary/70" />
                          <h3
                            className={`text-[11px] font-bold uppercase tracking-[0.1em] ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
                          >
                            Request Summary
                          </h3>
                        </div>
                        <span
                          className={`ml-auto text-[10px] font-semibold ${isLight ? "text-gray-400" : "text-white/30"}`}
                        >
                          Use <strong>Save Changes</strong> above to persist
                        </span>
                      </div>
                    </div>
                    {/* Fields grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Visit Date */}
                      <div className="group/field flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 px-0.5">
                          <Calendar size={11} className="text-primary/50" />
                          <label
                            className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-white/40"}`}
                          >
                            Visit Date
                          </label>
                        </div>
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
                          style={{ colorScheme: isLight ? "light" : "dark" }}
                        />
                      </div>
                      {/* Places to Visit */}
                      <div className="group/field flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 px-0.5">
                          <MapPin size={11} className="text-primary/50" />
                          <label
                            className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-white/40"}`}
                          >
                            Places to Visit
                          </label>
                        </div>
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
                          <option value="">
                            {placesLoading
                              ? "Loading places..."
                              : "Select a place to visit"}
                          </option>
                          {placesList &&
                            placesList.length > 0 &&
                            placesList
                              .filter((place) => {
                                const status = (
                                  place.VAIL_Status ||
                                  place.Status ||
                                  "A"
                                )
                                  .toString()
                                  .trim()
                                  .toUpperCase();
                                return status === "A";
                              })
                              .map((place, idx) => {
                                const id =
                                  place.VAIL_Item_List_ID ||
                                  place.Item_List_ID ||
                                  place.Id ||
                                  idx;
                                const name =
                                  place.VAIL_Item_Name ||
                                  place.Item_Name ||
                                  place.Name ||
                                  "Unknown";
                                return (
                                  <option key={id} value={name}>
                                    {name}
                                  </option>
                                );
                              })}
                        </select>
                      </div>
                      {/* Purpose */}
                      <div className="md:col-span-2 group/field flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 px-0.5">
                          <Briefcase size={11} className="text-primary/50" />
                          <label
                            className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-white/40"}`}
                          >
                            Purpose
                          </label>
                        </div>
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
                          placeholder="Tell us why the visitor is coming"
                        />
                      </div>
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
                    {/* ── Vehicle Registry card (mirrors View "Vehicle Registry" section) ── */}
                    <div
                      className={`rounded-[12px] border overflow-hidden ${isLight ? "bg-white border-gray-200" : "bg-black/25 border-white/10"}`}
                    >
                      <div className="p-4 md:p-5 space-y-4">
                        {/* SplitSection header */}
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-[3px] h-3.5 bg-primary rounded-full" />
                            <div className="flex items-center gap-1.5">
                              <Car size={13} className="text-primary/70" />
                              <h3
                                className={`text-[11px] font-bold uppercase tracking-[0.1em] ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
                              >
                                Vehicle Registry
                              </h3>
                              {editVehicles.filter((v) => !v._isNew).length >
                                0 && (
                                <span
                                  className={`text-[10px] font-semibold ml-1 ${isLight ? "text-gray-400" : "text-white/30"}`}
                                >
                                  {editVehicles.filter((v) => !v._isNew).length}{" "}
                                  vehicle
                                  {editVehicles.filter((v) => !v._isNew)
                                    .length > 1
                                    ? "s"
                                    : ""}
                                </span>
                              )}
                            </div>
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
                              style={{
                                padding: "5px 14px",
                                fontSize: 11,
                                gap: 5,
                              }}
                            >
                              <Plus size={12} /> Add Vehicle
                            </button>
                          </div>
                        </div>
                        {editVehicles.length === 0 && (
                          <p
                            className={`text-[11px] font-medium ${isLight ? "text-gray-400" : "text-white/30"}`}
                          >
                            No vehicles. Click <strong>Add Vehicle</strong> to
                            add one.
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
                                <div className="flex gap-2 items-center">
                                  {/* Vehicle Insurance attachment button — icon only, title as tooltip */}
                                  <button
                                    type="button"
                                    onClick={() => openInsuranceModal(idx)}
                                    disabled={
                                      insuranceUploading[idx] === "uploading"
                                    }
                                    title="Vehicle Insurance Attachments"
                                    style={{
                                      padding: "9px 12px",
                                      fontSize: 12,
                                      border:
                                        insuranceUploading[idx] === "done"
                                          ? "1px solid rgba(34,197,94,0.4)"
                                          : insuranceUploading[idx] === "error"
                                            ? "1px solid rgba(239,68,68,0.4)"
                                            : "1px solid var(--color-border-soft)",
                                      color:
                                        insuranceUploading[idx] === "done"
                                          ? "var(--color-success)"
                                          : insuranceUploading[idx] === "error"
                                            ? "#ef4444"
                                            : "var(--color-text-secondary)",
                                      background:
                                        insuranceUploading[idx] === "done"
                                          ? "rgba(34,197,94,0.08)"
                                          : insuranceUploading[idx] === "error"
                                            ? "rgba(239,68,68,0.08)"
                                            : "var(--color-bg-alt)",
                                    }}
                                    className="btn-outline whitespace-nowrap disabled:opacity-50"
                                  >
                                    {insuranceUploading[idx] === "uploading" ? (
                                      <div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                                    ) : insuranceUploading[idx] === "done" ? (
                                      <CheckCircle2 size={13} />
                                    ) : insuranceUploading[idx] === "error" ? (
                                      <AlertCircle size={13} />
                                    ) : (
                                      <Paperclip size={13} />
                                    )}
                                  </button>
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
                                      disabled={vehicleSavingIdx !== null || !isVehicleDirty(v)}
                                      className={`whitespace-nowrap ${vehicleSavingIdx !== null || !isVehicleDirty(v) ? "btn-outline opacity-50" : "btn-primary"}`}
                                      style={{
                                        padding: "9px 18px",
                                        fontSize: 12,
                                      }}
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
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* ── Visiting People card (mirrors View "Visiting People" section) ── */}
                    <div
                      className={`rounded-xl sm:rounded-[12px] border overflow-hidden ${isLight ? "bg-white border-gray-200" : "bg-black/25 border-white/10"}`}
                    >
                      <div className="p-3 sm:p-4 md:p-5 space-y-3 sm:space-y-4">
                        {/* SplitSection header */}
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-[3px] h-2.5 sm:h-3.5 bg-primary rounded-full" />
                            <div className="flex items-center gap-1 sm:gap-1.5 flex-1 min-w-0">
                              <Users
                                size={11}
                                className="sm:size-[13px] text-primary/70 flex-shrink-0"
                              />
                              <h3
                                className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.1em] truncate ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
                              >
                                People Visiting
                              </h3>
                              {editGroupMembers.filter((m) => !m._isNew)
                                .length > 0 && (
                                <span
                                  className={`text-[9px] sm:text-[10px] font-semibold ml-1 flex-shrink-0 ${isLight ? "text-gray-400" : "text-white/30"}`}
                                >
                                  {
                                    editGroupMembers.filter((m) => !m._isNew)
                                      .length
                                  }{" "}
                                  visitor
                                  {editGroupMembers.filter((m) => !m._isNew)
                                    .length > 1
                                    ? "s"
                                    : ""}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() =>
                                setEditGroupMembers((a) => [
                                  ...a,
                                  {
                                    _isNew: true,
                                    VVG_Visitor_Name: "",
                                    VVG_NIC_Passport_Number: "",
                                    VVG_Designation: "",
                                    VVR_Request_id:
                                      editingRequest?.VVR_Request_id,
                                  },
                                ])
                              }
                              className="btn-outline ml-auto whitespace-nowrap px-2 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-[10px] flex-shrink-0"
                              style={{ gap: 4 }}
                            >
                              <Plus size={10} className="sm:size-[12px]" /> Add
                              Visitor
                            </button>
                          </div>
                        </div>
                        {editGroupMembers.length === 0 && (
                          <p
                            className={`text-[10px] sm:text-[11px] font-medium ${isLight ? "text-gray-400" : "text-white/30"}`}
                          >
                            No visitors. Click <strong>Add Visitor</strong> to
                            add one.
                          </p>
                        )}
                        <div className="space-y-2 sm:space-y-3">
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
                                  onChange={(e) => {
                                    const val = e.target.value.replace(
                                      /[^A-Za-z\s]/g,
                                      "",
                                    );
                                    setEditGroupMembers((a) =>
                                      a.map((x, i) =>
                                        i === idx
                                          ? {
                                              ...x,
                                              VVG_Visitor_Name: val,
                                            }
                                          : x,
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
                                  Designation / Phone
                                </label>
                                <input
                                  type="text"
                                  value={m.VVG_Designation}
                                  onChange={(e) => {
                                    const val = e.target.value
                                      .replace(/[^0-9]/g, "")
                                      .slice(0, 10);
                                    setEditGroupMembers((a) =>
                                      a.map((x, i) =>
                                        i === idx
                                          ? {
                                              ...x,
                                              VVG_Designation: val,
                                            }
                                          : x,
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
                                      const val = e.target.value
                                        .replace(/[^0-9]/g, "")
                                        .slice(0, 12);
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
                                  <div className="flex gap-2 items-center">
                                    <button
                                      type="button"
                                      disabled={true}
                                      title="Sub-Visitor NIC Attachments (Save visitor first)"
                                      style={{
                                        padding: "9px 12px",
                                        fontSize: 12,
                                        border: "1px solid var(--color-border-soft)",
                                        color: "var(--color-text-secondary)",
                                        background: "var(--color-bg-alt)",
                                        opacity: 0.5,
                                        cursor: "not-allowed",
                                      }}
                                      className="btn-outline whitespace-nowrap"
                                    >
                                      <Paperclip size={13} />
                                    </button>
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
                                  <div className="flex gap-2 items-center">
                                    {/* Sub-Visitor NIC attachment button — icon only, title as tooltip */}
                                    <button
                                      type="button"
                                      onClick={() => openSubVisitorNicModal(idx)}
                                      disabled={
                                        subVisitorNicUploading[idx] === "uploading"
                                      }
                                      title="Sub-Visitor NIC Attachments"
                                      style={{
                                        padding: "9px 12px",
                                        fontSize: 12,
                                        border:
                                          subVisitorNicUploading[idx] === "done"
                                            ? "1px solid rgba(34,197,94,0.4)"
                                            : subVisitorNicUploading[idx] === "error"
                                              ? "1px solid rgba(239,68,68,0.4)"
                                              : "1px solid var(--color-border-soft)",
                                        color:
                                          subVisitorNicUploading[idx] === "done"
                                            ? "var(--color-success)"
                                            : subVisitorNicUploading[idx] === "error"
                                              ? "#ef4444"
                                              : "var(--color-text-secondary)",
                                        background:
                                          subVisitorNicUploading[idx] === "done"
                                            ? "rgba(34,197,94,0.08)"
                                            : subVisitorNicUploading[idx] === "error"
                                              ? "rgba(239,68,68,0.08)"
                                              : "var(--color-bg-alt)",
                                      }}
                                      className="btn-outline whitespace-nowrap disabled:opacity-50"
                                    >
                                      {subVisitorNicUploading[idx] === "uploading" ? (
                                        <div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                                      ) : subVisitorNicUploading[idx] === "done" ? (
                                        <CheckCircle2 size={13} />
                                      ) : subVisitorNicUploading[idx] === "error" ? (
                                        <AlertCircle size={13} />
                                      ) : (
                                        <Paperclip size={13} />
                                      )}
                                    </button>
                                    <button
                                      onClick={() => handleUpdateMember(idx)}
                                      disabled={memberSavingIdx !== null || !isMemberDirty(m)}
                                      className={`whitespace-nowrap ${memberSavingIdx !== null || !isMemberDirty(m) ? "btn-outline opacity-50" : "btn-primary"}`}
                                      style={{
                                        padding: "9px 18px",
                                        fontSize: 12,
                                      }}
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
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* ── Items to Bring card (mirrors View "Items Carried" section) ── */}
                    <div
                      className={`rounded-xl sm:rounded-[12px] border overflow-hidden ${isLight ? "bg-white border-gray-200" : "bg-black/25 border-white/10"}`}
                    >
                      <div className="p-3 sm:p-4 md:p-5 space-y-3 sm:space-y-4">
                        {/* SplitSection header */}
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-[3px] h-2.5 sm:h-3.5 bg-primary rounded-full" />
                            <div className="flex items-center gap-1 sm:gap-1.5 flex-1 min-w-0">
                              <Package
                                size={11}
                                className="sm:size-[13px] text-primary/70 flex-shrink-0"
                              />
                              <h3
                                className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.1em] truncate ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
                              >
                                Items to Bring
                              </h3>
                              {editItems.filter((it) => !it._isNew).length >
                                0 && (
                                <span
                                  className={`text-[9px] sm:text-[10px] font-semibold ml-1 flex-shrink-0 ${isLight ? "text-gray-400" : "text-white/30"}`}
                                >
                                  {editItems.filter((it) => !it._isNew).length}{" "}
                                  item
                                  {editItems.filter((it) => !it._isNew).length >
                                  1
                                    ? "s"
                                    : ""}
                                </span>
                              )}
                            </div>
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
                              className="btn-outline ml-auto whitespace-nowrap px-2 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-[10px] flex-shrink-0"
                              style={{ gap: 4 }}
                            >
                              <Plus size={10} className="sm:size-[12px]" /> Add
                              Item
                            </button>
                          </div>
                        </div>
                        {editItems.length === 0 && (
                          <p
                            className={`text-[10px] sm:text-[11px] font-medium ${isLight ? "text-gray-400" : "text-white/30"}`}
                          >
                            No items. Click <strong>Add Item</strong> to add
                            one.
                          </p>
                        )}
                        <div className="space-y-2 sm:space-y-3">
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
                                          ? {
                                              ...x,
                                              VIC_Quantity: e.target.value,
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
                                    disabled={itemSavingIdx !== null || !isItemDirty(it)}
                                    className={`whitespace-nowrap ${itemSavingIdx !== null || !isItemDirty(it) ? "btn-outline opacity-50" : "btn-primary"}`}
                                    style={{
                                      padding: "9px 18px",
                                      fontSize: 12,
                                    }}
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
                    </div>

                    {/* ── Sub-Visitor Items Carried (Commented Out) ──
                    <div className={`rounded-[12px] border overflow-hidden ${isLight ? "bg-white border-gray-200" : "bg-black/25 border-white/10"}`}>
                      <div className="p-4 md:p-5 space-y-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-[3px] h-3.5 bg-primary rounded-full" />
                            <div className="flex items-center gap-1.5">
                              <Package size={13} className="text-primary/70" />
                              <h3 className={`text-[11px] font-bold uppercase tracking-[0.1em] ${isLight ? "text-[#1A1A1A]" : "text-white"}`}>
                                Sub-Visitor Items Carried
                              </h3>
                              {editJointItems.filter((it) => !it._isNew).length > 0 && (
                                <span className={`text-[10px] font-semibold ml-1 ${isLight ? "text-gray-400" : "text-white/30"}`}>
                                  {editJointItems.filter((it) => !it._isNew).length} item
                                  {editJointItems.filter((it) => !it._isNew).length > 1 ? "s" : ""}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() =>
                                setEditJointItems((a) => [
                                  ...a,
                                  {
                                    _isNew: true,
                                    subVisitorName: "",
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
                        </div>
                        {editJointItems.length === 0 && (
                          <p className={`text-[11px] font-medium ${isLight ? "text-gray-400" : "text-white/30"}`}>
                            No items. Click <strong>Add Sub-Visitor Item</strong> to add one.
                          </p>
                        )}
                        <div className="space-y-3">
                          {editJointItems.map((it, idx) => (
                            <div
                              key={`subItem-${idx}`}
                              ref={(el) => { rowRefs.current[`subItem-${idx}`] = el; }}
                              className="grid grid-cols-1 md:grid-cols-[1.2fr_1.2fr_0.8fr_1.2fr_auto] gap-3 items-end p-4 rounded-2xl"
                              style={(() => {
                                const w = warnDirty && dirtyRows.has(`subItem-${idx}`);
                                if (w) return { border: "2px solid rgba(239,68,68,0.7)", background: "rgba(239,68,68,0.05)", borderRadius: 16 };
                                if (it._isNew) return { border: "1.5px dashed rgba(251,191,36,0.5)", background: "rgba(251,191,36,0.04)" };
                                return { background: "var(--color-surface-1)", border: "1px solid var(--color-border-soft)" };
                              })()}
                            >
                              <div className="space-y-1.5">
                                <label style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--color-text-dim)" }}>
                                  Sub-Visitor
                                </label>
                                <select
                                  value={it.subVisitorName || ""}
                                  onChange={(e) => setEditJointItems((a) => a.map((x, i) => i === idx ? { ...x, subVisitorName: e.target.value } : x))}
                                  className="mas-input appearance-none"
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
                                <label style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--color-text-dim)" }}>
                                  Item Name
                                </label>
                                <input
                                  type="text"
                                  value={it.VIC_Item_Name || ""}
                                  onChange={(e) => setEditJointItems((a) => a.map((x, i) => i === idx ? { ...x, VIC_Item_Name: e.target.value } : x))}
                                  className="mas-input"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--color-text-dim)" }}>
                                  Quantity
                                </label>
                                <input
                                  type="text"
                                  value={it.VIC_Quantity || ""}
                                  onChange={(e) => setEditJointItems((a) => a.map((x, i) => i === idx ? { ...x, VIC_Quantity: e.target.value } : x))}
                                  className="mas-input"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--color-text-dim)" }}>
                                  Description
                                </label>
                                <input
                                  type="text"
                                  value={it.VIC_Designation || ""}
                                  onChange={(e) => setEditJointItems((a) => a.map((x, i) => i === idx ? { ...x, VIC_Designation: e.target.value } : x))}
                                  className="mas-input"
                                />
                              </div>
                              <div className="flex flex-col items-end gap-1.5">
                                {rowSuccess[`subItem-${idx}`] && (
                                  <span className="flex items-center gap-1 font-semibold whitespace-nowrap" style={{ color: "var(--color-success)", fontSize: 11 }}>
                                    <CheckCircle2 size={12} /> Saved
                                  </span>
                                )}
                                {it._isNew ? (
                                  <div className="flex gap-2">
                                    <button onClick={() => handleRemoveNewRow("subItem", idx)} className="btn-outline whitespace-nowrap" style={{ padding: "9px 14px", fontSize: 11 }}>
                                      <X size={12} />
                                    </button>
                                    <button
                                      onClick={() => handleSubmitNewSubItem(idx)}
                                      disabled={newSubItemSavingIdx !== null}
                                      className="btn-primary disabled:opacity-60 whitespace-nowrap"
                                      style={{ padding: "9px 18px", fontSize: 12, background: "var(--color-success)" }}
                                    >
                                      {newSubItemSavingIdx === idx ? (
                                        <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting…</>
                                      ) : (
                                        <><Plus size={12} /> Submit</>
                                      )}
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleUpdateSubItem(idx)}
                                    disabled={subItemSavingIdx !== null || !isSubItemDirty(it)}
                                    className={`whitespace-nowrap ${subItemSavingIdx !== null || !isSubItemDirty(it) ? "btn-outline opacity-50" : "btn-primary"}`}
                                    style={{ padding: "9px 18px", fontSize: 12 }}
                                  >
                                    {subItemSavingIdx === idx ? (
                                      <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating…</>
                                    ) : (
                                      <><Save size={12} /> Update</>
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
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

      {/* Vehicle Insurance Modal - using Portal to escape parent constraints */}
      {insuranceModal.open &&
        ReactDOM.createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(4px)",
            }}
          >
            <div
              className="bg-[var(--color-bg-paper)] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden"
              style={{ zIndex: 10000, maxWidth: "28rem", width: "100%" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-black/20 relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-5 bg-primary rounded-full" />
                  <div>
                    <h2 className="text-[12px] font-normal text-white tracking-[0.16em]">
                      Vehicle Insurance Attachments
                    </h2>
                    {insuranceModal.visitorName && (
                      <p className="text-[10px] text-white/40 tracking-widest mt-0.5">
                        Showing insurance files only ·{" "}
                        {insuranceModal.visitorName}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={closeInsuranceModal}
                  className="text-gray-400 hover:text-white transition-colors bg-white/5 p-1.5 rounded-lg"
                  title="Close"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 relative z-10 min-h-[120px]">
                {insuranceModal.loading ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3">
                    <div className="w-8 h-8 border-2 border-border-soft border-t-primary rounded-full animate-spin" />
                    <p className="text-[11px] text-white/30 tracking-widest uppercase">
                      Loading...
                    </p>
                  </div>
                ) : insuranceModal.error ? (
                  <div className="flex items-center gap-2 px-3 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-[11px]">
                    <AlertCircle size={13} className="shrink-0" />
                    {insuranceModal.error}
                  </div>
                ) : insuranceModal.list.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3 opacity-40">
                    <FolderOpen size={32} />
                    <p className="text-[11px] tracking-widest uppercase">
                      No attachments found
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                    {insuranceModal.list.map((att, idx) => {
                      const category =
                        att.VAT_File_Category || att.FileCategory || "document";
                      const fileName =
                        att.VAT_File_Name ||
                        att.FileName ||
                        att.FilePath ||
                        `file-${idx + 1}`;
                      const vatId =
                        att.VAT_Id || att.VAT_Attachment_id || att.Id || null;
                      const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(
                        fileName,
                      );
                      return (
                        <li
                          key={idx}
                          onClick={() => vatId && openPreview(vatId, fileName)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 transition-all group cursor-pointer"
                        >
                          {isImage ? (
                            <ImageIcon
                              size={15}
                              className="text-primary/60 shrink-0"
                            />
                          ) : (
                            <FileText
                              size={15}
                              className="text-primary/60 shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] text-white/80 font-normal truncate">
                              {fileName}
                            </p>
                            <span
                              className={`text-[9px] font-normal uppercase tracking-widest px-1.5 py-0.5 rounded mt-0.5 inline-block ${
                                category.toLowerCase() === "vehicle insurance"
                                  ? "bg-emerald-500/20 text-emerald-300"
                                  : "bg-white/10 text-white/40"
                              }`}
                            >
                              {category}
                            </span>
                          </div>
                          <button
                            type="button"
                            title="Download file"
                            onClick={(e) => {
                              e.stopPropagation();
                              vatId &&
                                VisitorAttachmentService.DownloadAttachment(
                                  vatId,
                                  fileName,
                                );
                            }}
                            className={`p-2 rounded-lg text-primary/80 hover:text-primary hover:bg-primary/10 transition-all flex-shrink-0 ${!vatId ? "opacity-30 cursor-not-allowed" : ""}`}
                          >
                            <Download size={18} />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}

                <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                  <div>
                    <h3 className="text-[11px] font-semibold text-white mb-3 uppercase tracking-widest flex items-center gap-2">
                      <Upload size={14} />
                      Add New Insurance File
                    </h3>
                  </div>

                  {/* File Input Area */}
                  <div className="relative">
                    <input
                      type="file"
                      ref={(el) => (insuranceFileInputRef.current = el)}
                      accept=".png,.jpg,.jpeg,.pdf,.xlsx,.doc,.docx"
                      onChange={handleInsuranceFileSelect}
                      className="hidden"
                      id="insurance-file-input"
                    />
                    <label
                      htmlFor="insurance-file-input"
                      className={`flex flex-col gap-2.5 p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer group ${
                        insuranceFile
                          ? "border-emerald-500/30 bg-emerald-500/10"
                          : "border-white/20 hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.04]"
                      }`}
                    >
                      {insuranceFile ? (
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2 min-w-0">
                            <FileText
                              size={18}
                              className="text-emerald-400 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-[11px] text-emerald-200 font-medium truncate">
                                {insuranceFile.name}
                              </p>
                              <p className="text-[9px] text-emerald-200/60">
                                Ready to upload ·{" "}
                                {(insuranceFile.size / 1024 / 1024).toFixed(2)}{" "}
                                MB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setInsuranceFile(null);
                              setInsuranceUploadResult(null);
                            }}
                            className="text-emerald-300/70 hover:text-emerald-200 transition-colors p-1 hover:bg-emerald-500/10 rounded shrink-0"
                            title="Remove file"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="flex items-center gap-2">
                            <Upload
                              size={18}
                              className="text-white/40 group-hover:text-white/60"
                            />
                            <span className="text-[11px] text-white/50 group-hover:text-white/70">
                              Click to browse or drag file here
                            </span>
                          </div>
                          <span className="text-[9px] text-white/30">
                            Supported: PNG, JPG, PDF, XLSX, DOC
                          </span>
                        </div>
                      )}
                    </label>
                  </div>

                  {/* Upload Result Message */}
                  {insuranceUploadResult && (
                    <div
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-[11px] ${
                        insuranceUploadResult.success
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-200"
                          : "bg-red-500/10 border border-red-500/20 text-red-300"
                      }`}
                    >
                      {insuranceUploadResult.success ? (
                        <CheckCircle2 size={14} className="shrink-0" />
                      ) : (
                        <AlertCircle size={14} className="shrink-0" />
                      )}
                      {insuranceUploadResult.message}
                    </div>
                  )}

                  {/* Upload Button */}
                  <button
                    type="button"
                    onClick={handleInsuranceUpload}
                    disabled={
                      !insuranceFile ||
                      insuranceUploading[insuranceModal.vehicleIdx] ===
                        "uploading"
                    }
                    className="w-full py-2.5 rounded-lg text-[11px] font-semibold tracking-[0.14em] text-white uppercase transition-all border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background:
                        insuranceFile &&
                        insuranceUploading[insuranceModal.vehicleIdx] !==
                          "uploading"
                          ? "linear-gradient(135deg, rgb(16 185 129) 0%, rgb(5 150 105) 100%)"
                          : "rgba(255, 255, 255, 0.1)",
                      boxShadow:
                        insuranceFile &&
                        insuranceUploading[insuranceModal.vehicleIdx] !==
                          "uploading"
                          ? "0 4px 12px rgba(16, 185, 129, 0.2)"
                          : "none",
                    }}
                  >
                    {insuranceUploading[insuranceModal.vehicleIdx] ===
                    "uploading" ? (
                      <span className="inline-flex items-center justify-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Uploading...
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center gap-2">
                        <Upload size={14} /> Upload Insurance File
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
      {/* Sub-Visitor NIC Modal - using Portal to escape parent constraints */}
      {subVisitorNicModal.open &&
        ReactDOM.createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(4px)",
            }}
          >
            <div
              className="bg-[var(--color-bg-paper)] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden"
              style={{ zIndex: 10000, maxWidth: "28rem", width: "100%" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-black/20 relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-5 bg-primary rounded-full" />
                  <div>
                    <h2 className="text-[12px] font-normal text-white tracking-[0.16em]">
                      Sub-Visitor NIC Attachments
                    </h2>
                    {subVisitorNicModal.subVisitorName && (
                      <p className="text-[10px] text-white/40 tracking-widest mt-0.5">
                        Showing NIC files only ·{" "}
                        {subVisitorNicModal.subVisitorName}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={closeSubVisitorNicModal}
                  className="text-gray-400 hover:text-white transition-colors bg-white/5 p-1.5 rounded-lg"
                  title="Close"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 relative z-10 min-h-[120px]">
                {subVisitorNicModal.loading ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3">
                    <div className="w-8 h-8 border-2 border-border-soft border-t-primary rounded-full animate-spin" />
                    <p className="text-[11px] text-white/30 tracking-widest uppercase">
                      Loading...
                    </p>
                  </div>
                ) : subVisitorNicModal.error ? (
                  <div className="flex items-center gap-2 px-3 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-[11px]">
                    <AlertCircle size={13} className="shrink-0" />
                    {subVisitorNicModal.error}
                  </div>
                ) : subVisitorNicModal.list.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3 opacity-40">
                    <FolderOpen size={32} />
                    <p className="text-[11px] tracking-widest uppercase">
                      No attachments found
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                    {subVisitorNicModal.list.map((att, idx) => {
                      const category =
                        att.VAT_File_Category || att.FileCategory || "document";
                      const fileName =
                        att.VAT_File_Name ||
                        att.FileName ||
                        att.FilePath ||
                        `file-${idx + 1}`;
                      const vatId =
                        att.VAT_Id || att.VAT_Attachment_id || att.Id || null;
                      const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(
                        fileName,
                      );
                      return (
                        <li
                          key={idx}
                          onClick={() => vatId && openPreview(vatId, fileName)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 transition-all group cursor-pointer"
                        >
                          {isImage ? (
                            <ImageIcon
                              size={15}
                              className="text-primary/60 shrink-0"
                            />
                          ) : (
                            <FileText
                              size={15}
                              className="text-primary/60 shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] text-white/80 font-normal truncate">
                              {fileName}
                            </p>
                            <span
                              className={`text-[9px] font-normal uppercase tracking-widest px-1.5 py-0.5 rounded mt-0.5 inline-block ${
                                category.toLowerCase() === "nic"
                                  ? "bg-emerald-500/20 text-emerald-300"
                                  : "bg-white/10 text-white/40"
                              }`}
                            >
                              {category}
                            </span>
                          </div>
                          <button
                            type="button"
                            title="Download file"
                            onClick={(e) => {
                              e.stopPropagation();
                              vatId &&
                                VisitorAttachmentService.DownloadAttachment(
                                  vatId,
                                  fileName,
                                );
                            }}
                            className={`p-2 rounded-lg text-primary/80 hover:text-primary hover:bg-primary/10 transition-all flex-shrink-0 ${!vatId ? "opacity-30 cursor-not-allowed" : ""}`}
                          >
                            <Download size={18} />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}

                <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                  <div>
                    <h3 className="text-[11px] font-semibold text-white mb-3 uppercase tracking-widest flex items-center gap-2">
                      <Upload size={14} />
                      Add New NIC File
                    </h3>
                  </div>

                  {/* File Input Area */}
                  <div className="relative">
                    <input
                      type="file"
                      ref={(el) => (subVisitorNicFileInputRef.current = el)}
                      accept=".png,.jpg,.jpeg,.pdf,.xlsx,.doc,.docx"
                      onChange={handleSubVisitorNicFileSelect}
                      className="hidden"
                      id="subvisitor-nic-file-input"
                    />
                    <label
                      htmlFor="subvisitor-nic-file-input"
                      className={`flex flex-col gap-2.5 p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer group ${
                        subVisitorNicFile
                          ? "border-emerald-500/30 bg-emerald-500/10"
                          : "border-white/20 hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.04]"
                      }`}
                    >
                      {subVisitorNicFile ? (
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2 min-w-0">
                            <FileText
                              size={18}
                              className="text-emerald-400 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-[11px] text-emerald-200 font-medium truncate">
                                {subVisitorNicFile.name}
                              </p>
                              <p className="text-[9px] text-emerald-200/60">
                                Ready to upload ·{" "}
                                {(subVisitorNicFile.size / 1024 / 1024).toFixed(2)}{" "}
                                MB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setSubVisitorNicFile(null);
                              setSubVisitorNicUploadResult(null);
                            }}
                            className="text-emerald-300/70 hover:text-emerald-200 transition-colors p-1 hover:bg-emerald-500/10 rounded shrink-0"
                            title="Remove file"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="flex items-center gap-2">
                            <Upload
                              size={18}
                              className="text-white/40 group-hover:text-white/60"
                            />
                            <span className="text-[11px] text-white/50 group-hover:text-white/70">
                              Click to browse or drag file here
                            </span>
                          </div>
                          <span className="text-[9px] text-white/30">
                            Supported: PNG, JPG, PDF, XLSX, DOC
                          </span>
                        </div>
                      )}
                    </label>
                  </div>

                  {/* Upload Result Message */}
                  {subVisitorNicUploadResult && (
                    <div
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-[11px] ${
                        subVisitorNicUploadResult.success
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-200"
                          : "bg-red-500/10 border border-red-500/20 text-red-300"
                      }`}
                    >
                      {subVisitorNicUploadResult.success ? (
                        <CheckCircle2 size={14} className="shrink-0" />
                      ) : (
                        <AlertCircle size={14} className="shrink-0" />
                      )}
                      {subVisitorNicUploadResult.message}
                    </div>
                  )}

                  {/* Upload Button */}
                  <button
                    type="button"
                    onClick={handleSubVisitorNicUpload}
                    disabled={
                      !subVisitorNicFile ||
                      subVisitorNicUploading[subVisitorNicModal.memberIdx] ===
                        "uploading"
                    }
                    className="w-full py-2.5 rounded-lg text-[11px] font-semibold tracking-[0.14em] text-white uppercase transition-all border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background:
                        subVisitorNicFile &&
                        subVisitorNicUploading[subVisitorNicModal.memberIdx] !==
                          "uploading"
                          ? "linear-gradient(135deg, rgb(16 185 129) 0%, rgb(5 150 105) 100%)"
                          : "rgba(255, 255, 255, 0.1)",
                      boxShadow:
                        subVisitorNicFile &&
                        subVisitorNicUploading[subVisitorNicModal.memberIdx] !==
                          "uploading"
                          ? "0 4px 12px rgba(16, 185, 129, 0.2)"
                          : "none",
                    }}
                  >
                    {subVisitorNicUploading[subVisitorNicModal.memberIdx] ===
                    "uploading" ? (
                      <span className="inline-flex items-center justify-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Uploading...
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center gap-2">
                        <Upload size={14} /> Upload NIC File
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
      <AttachmentPreviewModal
        previewData={previewData}
        onClose={closePreview}
      />
    </div>
  );
};

export default VisitRequests;
