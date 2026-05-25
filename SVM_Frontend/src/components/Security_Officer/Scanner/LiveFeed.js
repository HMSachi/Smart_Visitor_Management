import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useDispatch } from "react-redux";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { useLocation } from "react-router-dom";
import {
  QrCode,
  Zap,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  User,
  CreditCard,
  Mail,
  Phone,
  Building2,
  Target,
  MapPin,
  CheckCircle2,
  Package,
  LogOut,
  LogIn,
  MessageSquare,
  FolderOpen,
  FileText,
  ImageIcon,
  Download,
  X,
  AlertCircle,
  Car,
  Shield,
} from "lucide-react";
import {
  GetGatePassById,
  UpdateGatePassStatus,
} from "../../../actions/GatePassAction";
import { motion, AnimatePresence } from "framer-motion";
import {
  decodeSecureQrPayload,
  isSecureQrPayload,
} from "../../../utils/secureQrPayload";
import VisitorService from "../../../services/VisitorService";
import GatePassService from "../../../services/GatePassService";
import VisitLogService from "../../../services/VisitLogService";
import ItemCarriedService from "../../../services/ItemCarriedService";
import VehicleService from "../../../services/VehicleService";
import VisitGroupService from "../../../services/VisitGroupService";
import VisitorAttachmentService from "../../../services/VisitorAttachmentService";
import AttachmentPreviewModal from "../../../components/common/AttachmentPreviewModal";
import { useAttachmentPreview } from "../../../hooks/useAttachmentPreview";

// ── Helper: a single icon + label + value row ──────────────────────────────
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-2">
    <div
      className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{
        background: "var(--color-surface-2)",
        border: "1px solid var(--color-border-soft)",
        color: "var(--color-text-secondary)",
      }}
    >
      {React.cloneElement(icon, { size: 11 })}
    </div>
    <div className="min-w-0 flex-1">
      <p
        className="text-[8px] uppercase tracking-[0.18em] font-bold leading-none mb-0.5"
        style={{ color: "var(--color-text-dim)" }}
      >
        {label}
      </p>
      <p
        className="text-xs font-semibold break-words leading-snug"
        style={{
          color:
            value === "N/A"
              ? "var(--color-text-dim)"
              : "var(--color-text-primary)",
          fontStyle: value === "N/A" ? "italic" : "normal",
          opacity: value === "N/A" ? 0.6 : 1,
        }}
      >
        {value}
      </p>
    </div>
  </div>
);

const formatDateYYYYMMDD = (date) => {
  if (!date || Number.isNaN(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseDateOnly = (value) => {
  if (!value) {
    return null;
  }

  const raw = String(value).trim();
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    const day = Number(match[3]);
    return new Date(year, month, day);
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
};

const getExpiryDateFromVisitDate = (visitDate) => {
  const base = parseDateOnly(visitDate);
  if (!base) {
    return null;
  }

  const expiry = new Date(base);
  expiry.setDate(expiry.getDate() + 1);
  return formatDateYYYYMMDD(expiry);
};

const LiveFeed = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { previewData, openPreview, closePreview } = useAttachmentPreview();
  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const scannerRef = useRef(null);
  const useDemoScanLog = true;
  const [scanStatus, setScanStatus] = useState("idle"); // idle, scanning, success, error, details
  const [scanMessage, setScanMessage] = useState(
    "Point your camera at the QR code to get started.",
  );
  const [scanResult, setScanResult] = useState("");
  const [passDetails, setPassDetails] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // Sub-visitors fetched live from the VisitorJoint API after scanning (main QR)
  const [subVisitorsData, setSubVisitorsData] = useState([]);
  // The specific VisitorJoint row matched when scanning a sub-visitor QR
  const [subVisitorApiData, setSubVisitorApiData] = useState(null);
  // Track check-in/checkout
  const [scanCount, setScanCount] = useState(0);
  const [scanType, setScanType] = useState(null); // "CHECK_IN" or "CHECK_OUT"
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Items carried by the main visitor + their checked state
  const [mainVisitorItems, setMainVisitorItems] = useState([]); // [{ id, itemName, quantity, description }]
  const [itemCheckStates, setItemCheckStates] = useState({}); // { [id]: boolean }
  // Attachment viewer modal state
  const [viewAttachments, setViewAttachments] = useState({
    open: false,
    visitorId: null,
    visitorName: "",
    loading: false,
    list: [],
    error: null,
    filterCategory: null,
  });

  // Vehicle registry state
  const [vehiclesList, setVehiclesList] = useState([]);

  const getTodayDateKey = () => new Date().toISOString().slice(0, 10);

  const getDemoScanLogKey = (passId, dateKey) =>
    `svm.scanLog.${passId}.${dateKey}`;

  const persistGatePassMeta = (details) => {
    if (!details?.VGP_Pass_id || typeof window === "undefined") {
      return;
    }

    const payload = {
      id: details.VGP_Pass_id,
      name: details.Visitor_Name || details.VV_Name || "Unknown Visitor",
      location: details.VGP_Visiting_Area || "Main Premises",
      issueDate: details.VGP_Issue_Date || null,
    };

    try {
      window.localStorage.setItem(
        `svm.gatePassMeta.${details.VGP_Pass_id}`,
        JSON.stringify(payload),
      );
    } catch (err) {
      console.warn("localStorage access blocked:", err);
    }
  };

  const getTodayScanCountDemo = (passId) => {
    const dateKey = getTodayDateKey();
    const raw = localStorage.getItem(getDemoScanLogKey(passId, dateKey));
    const entries = raw ? JSON.parse(raw) : [];
    return { count: Array.isArray(entries) ? entries.length : 0, entries };
  };

  const logScanEntryDemo = (passId, type, remarkText) => {
    const dateKey = getTodayDateKey();
    const key = getDemoScanLogKey(passId, dateKey);
    const raw = localStorage.getItem(key);
    const entries = raw ? JSON.parse(raw) : [];
    const next = Array.isArray(entries) ? entries : [];
    next.push({
      passId,
      type,
      remarks: remarkText || "",
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(key, JSON.stringify(next));
    return { Status: "Success" };
  };

  const stopScanner = useCallback(() => {
    if (controlsRef.current) {
      try {
        controlsRef.current.stop();
      } catch (err) {
        console.warn("Unable to stop scanner controls cleanly:", err);
      }
      controlsRef.current = null;
    }

    if (scannerRef.current) {
      try {
        scannerRef.current.reset();
      } catch (err) {
        console.warn("Unable to reset scanner cleanly:", err);
      }
    }

    const stream = videoRef.current?.srcObject;
    if (stream && typeof stream.getTracks === "function") {
      stream.getTracks().forEach((track) => track.stop());
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startScanner = async () => {
    if (!videoRef.current) {
      return;
    }

    stopScanner();
    setScanResult("");
    setPassDetails(null);
    setQrData(null);
    setSubVisitorsData([]);
    setSubVisitorApiData(null);
    setMainVisitorItems([]);
    setItemCheckStates({});
    setScanStatus("scanning");
    setScanMessage("Opening the camera. Please hold the QR code steady.");

    try {
      if (!scannerRef.current) {
        scannerRef.current = new BrowserMultiFormatReader();
      }

      controlsRef.current = await scannerRef.current.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        async (result, error) => {
          if (result) {
            const rawText = result.getText();
            setScanResult(rawText);
            stopScanner();
            handleVerification(rawText);
            return;
          }

          if (error) {
            const name = error.name || error.constructor?.name || "";
            if (
              name === "NotFoundException" ||
              name === "ChecksumException" ||
              name === "FormatException"
            ) {
              return;
            }
          }
        },
      );

      setScanMessage("Camera ready. Hold the QR code inside the frame.");
    } catch (error) {
      setScanStatus("error");
      setScanMessage(
        "We could not access the camera. Please allow camera permission and try again.",
      );
    }
  };

  const handleVerification = async (data) => {
    setIsLoading(true);
    setScanStatus("success");
    setScanMessage("QR code found. Checking the visitor details now...");

    try {
      console.log("[LiveFeed] Scanned QR data length:", data?.length);
      console.log("[LiveFeed] Scanned QR starts with:", data?.substring(0, 20));

      let passId = data;
      let parsedQrData = null;
      let isSubVisitorQR = false;

      if (isSecureQrPayload(data)) {
        console.log("[LiveFeed] Detected secure QR format");
        const decoded = await decodeSecureQrPayload(data);
        console.log("[LiveFeed] Decoded secure QR payload:", decoded);
        if (decoded && typeof decoded === "object") {
          parsedQrData = decoded;
          setQrData(decoded);

          // Check if this is an individual sub-visitor QR
          if (decoded.type === "subVisitor" && decoded.subVisitor) {
            console.log("[LiveFeed] Individual sub-visitor QR detected");
            isSubVisitorQR = true;
            passId = decoded.id; // Use the id from payload
          }
        }
        if (decoded?.id && !isSubVisitorQR) {
          passId = decoded.id;
        }
      } else {
        console.log("[LiveFeed] Not a secure QR, trying legacy format");
        // Backward compatibility: handle old plain JSON and raw pass ID QR values.
        try {
          const parsed = JSON.parse(data);
          if (parsed && typeof parsed === "object") {
            parsedQrData = parsed;
            setQrData(parsed);
          }
          if (parsed?.id) {
            passId = parsed.id;
          }
        } catch (e) {
          console.log(
            "[LiveFeed] QR data is not JSON, treating as gate pass ID:",
            data,
          );
        }
      }

      if (!passId && !isSubVisitorQR) {
        throw new Error("We could not find a valid pass ID in the QR code.");
      }

      // For sub-visitor QRs, verify against the VisitorJoint API using the requestId
      if (isSubVisitorQR && parsedQrData?.subVisitor && passId) {
        console.log(
          "[LiveFeed] Sub-visitor QR — verifying via VisitorJoint API, requestId:",
          passId,
        );
        const jointResponse = await VisitorService.GetVisitorJoint(passId);
        const rows =
          jointResponse?.data?.ResultSet ||
          (Array.isArray(jointResponse?.data) ? jointResponse.data : []) ||
          [];

        if (rows.length === 0) {
          throw new Error(
            "Sub-visitor could not be verified. No matching request found.",
          );
        }

        // Find the row matching this sub-visitor's NIC
        const scannedNic = parsedQrData.subVisitor.nic;
        const matchedRow =
          rows.find(
            (r) =>
              String(r.Visit_Group_NIC_Passport_Number) === String(scannedNic),
          ) || rows[0]; // fall back to first row if NIC not matched

        setSubVisitorApiData(matchedRow);

        // Fetch vehicles for this request
        try {
          const vehicleResponse = await VehicleService.GetAllVehicles();
          const allVehicles =
            vehicleResponse?.data?.ResultSet || vehicleResponse?.data || [];
          const matchedVehicles = (
            Array.isArray(allVehicles) ? allVehicles : []
          )
            .filter((v) => String(v?.VVR_Request_id) === String(passId))
            .map((v) => ({
              id: v.VV_Vehicle_id,
              vehicleType: v.VV_Vehicle_Type,
              plateNumber: v.VV_Vehicle_Number,
            }));
          setVehiclesList(matchedVehicles);
          console.log(
            "[LiveFeed] Fetched vehicles for sub-visitor:",
            matchedVehicles,
          );
        } catch (err) {
          console.warn(
            "[LiveFeed] Could not fetch vehicles for sub-visitor:",
            err,
          );
        }

        setScanStatus("details");
        setScanMessage("Sub-visitor QR verified successfully.");
        setIsLoading(false);
        return;
      }

      console.log("[LiveFeed] Looking up pass ID:", passId);

      // Fetch gate pass details from database for regular QRs
      const result = await dispatch(GetGatePassById(passId));

      // Handle different response structures
      let details = null;
      if (Array.isArray(result) && result.length > 0) {
        details = result[0];
      } else if (
        result &&
        typeof result === "object" &&
        !Array.isArray(result)
      ) {
        details = result;
      }

      console.log("[LiveFeed] Database lookup result:", details);

      if (details && details.VGP_Pass_id) {
        // Database validation successful
        if (useDemoScanLog) {
          const localStatus = localStorage.getItem(
            `svm.gatePassStatus.${details.VGP_Pass_id}`,
          );
          if (localStatus) {
            details.VGP_Status = localStatus;
          }
        }
        setPassDetails(details);
        persistGatePassMeta(details);
        setScanStatus("details");
        setScanMessage(
          "The visitor details were found and verified successfully.",
        );

        // Fetch scan count for today to determine check-in or checkout
        try {
          let count = 0;
          if (useDemoScanLog) {
            const demo = getTodayScanCountDemo(details.VGP_Pass_id);
            count = demo.count || 0;
          } else {
            const scanCountResponse = await GatePassService.GetTodayScanCount(
              details.VGP_Pass_id,
            );
            count =
              scanCountResponse?.data?.scanCount ||
              scanCountResponse?.data?.count ||
              0;
          }

          setScanCount(count);

          // Determine scan type based on count
          if (count === 0 || count === 1) {
            setScanType(count === 0 ? "CHECK_IN" : "CHECK_OUT");
          } else {
            setScanType("CHECK_OUT");
          }

          console.log(
            "[LiveFeed] Scan count for today:",
            count,
            "Scan type:",
            count === 0 ? "CHECK_IN" : "CHECK_OUT",
          );
        } catch (err) {
          console.warn(
            "[LiveFeed] Could not fetch scan count, defaulting to CHECK_IN:",
            err,
          );
          setScanCount(0);
          setScanType("CHECK_IN");
        }

        // Fetch sub-visitor data live from the VisitGroupService and VisitorJoint API
        const requestId = details.VGP_Request_id || details.VVR_Request_id;
        if (requestId) {
          try {
            // Fetch sub-visitor records from VisitGroupService as the reliable source of VVG_id
            let allGroupMembers = [];
            try {
              const groupResponse = await VisitGroupService.GetAllVisitGroup();
              const payload =
                groupResponse?.data?.ResultSet || groupResponse?.data || [];
              allGroupMembers = (Array.isArray(payload) ? payload : []).filter(
                (item) => String(item?.VVR_Request_id) === String(requestId),
              );
            } catch (err) {
              console.warn(
                "[LiveFeed] Could not fetch group members from VisitGroup:",
                err,
              );
            }

            const jointResponse =
              await VisitorService.GetVisitorJoint(requestId);
            const rows =
              jointResponse?.data?.ResultSet ||
              (Array.isArray(jointResponse?.data) ? jointResponse.data : []) ||
              [];

            // Deduplicate sub-visitors by NIC (API returns one row per sub-visitor × item)
            const seen = new Set();
            const uniqueSubVisitors = [];
            for (const row of rows) {
              const nic =
                row.Visit_Group_NIC_Passport_Number ||
                row.Members_NIC_Passport_Number ||
                row.nic;
              const name =
                row.Visitor_Group_Name || row.Group_Members || row.name;
              if (!name) continue;
              const key = nic || name;
              if (!seen.has(key)) {
                seen.add(key);
                // Try to find the VVG_id by matching against VisitGroupService results (by NIC or name)
                const matchedGroupMember = allGroupMembers.find(
                  (m) =>
                    (nic &&
                      m.VVG_NIC_Passport_Number &&
                      String(m.VVG_NIC_Passport_Number) === String(nic)) ||
                    String(m.VVG_Visitor_Name).toLowerCase() ===
                      String(name).toLowerCase(),
                );
                const id =
                  matchedGroupMember?.VVG_id || row.VVG_id || row.id || null;
                uniqueSubVisitors.push({ id, name, nic: nic || "N/A" });
              }
            }

            // Fallback: if uniqueSubVisitors is empty but allGroupMembers has items, populate it
            if (uniqueSubVisitors.length === 0 && allGroupMembers.length > 0) {
              allGroupMembers.forEach((m) => {
                uniqueSubVisitors.push({
                  id: m.VVG_id,
                  name: m.VVG_Visitor_Name,
                  nic: m.VVG_NIC_Passport_Number || "N/A",
                });
              });
            }

            setSubVisitorsData(uniqueSubVisitors);
            console.log(
              "[LiveFeed] Fetched and matched sub-visitors:",
              uniqueSubVisitors,
            );
          } catch (err) {
            console.warn("[LiveFeed] Could not fetch sub-visitors:", err);
          }

          // Fetch items carried by the main visitor
          try {
            const itemsRes = await ItemCarriedService.GetAllItemsCarried();
            const allItems = itemsRes?.data?.ResultSet || itemsRes?.data || [];
            const matchedItems = (Array.isArray(allItems) ? allItems : [])
              .filter((i) => String(i.VVR_Request_id) === String(requestId))
              .map((i) => ({
                id: i.VIC_Item_id,
                itemName: i.VIC_Item_Name,
                quantity: i.VIC_Quantity,
                description: i.VIC_Designation || "",
                status: i.VIC_Status || null,
              }));
            setMainVisitorItems(matchedItems);
            // Default: all items are UN-ticked (security must explicitly confirm each)
            const defaultChecks = {};
            matchedItems.forEach((item) => {
              defaultChecks[item.id] = false;
            });
            setItemCheckStates(defaultChecks);
            console.log("[LiveFeed] Fetched main-visitor items:", matchedItems);
          } catch (err) {
            console.warn("[LiveFeed] Could not fetch items carried:", err);
          }

          // Fetch vehicles for this request
          try {
            const vehicleResponse = await VehicleService.GetAllVehicles();
            const allVehicles =
              vehicleResponse?.data?.ResultSet || vehicleResponse?.data || [];
            const matchedVehicles = (
              Array.isArray(allVehicles) ? allVehicles : []
            )
              .filter((v) => String(v?.VVR_Request_id) === String(requestId))
              .map((v) => ({
                id: v.VV_Vehicle_id,
                vehicleType: v.VV_Vehicle_Type,
                plateNumber: v.VV_Vehicle_Number,
              }));
            setVehiclesList(matchedVehicles);
            console.log("[LiveFeed] Fetched vehicles:", matchedVehicles);
          } catch (err) {
            console.warn("[LiveFeed] Could not fetch vehicles:", err);
          }
        }
      } else {
        throw new Error("We could not find a matching gate pass.");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setScanStatus("error");
      setScanMessage(
        err.message ||
          "We could not verify this QR code. Please try scanning it again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const profileData = useMemo(() => {
    // Check if this is an individual sub-visitor QR code — use live API data
    if (qrData?.type === "subVisitor" && qrData?.subVisitor) {
      console.log(
        "[LiveFeed] Processing sub-visitor QR. API row:",
        subVisitorApiData,
      );

      // Prefer live API data; fall back to what was encoded in the QR
      const svName =
        subVisitorApiData?.Visitor_Group_Name ||
        qrData.subVisitor.name ||
        "N/A";
      const svNic =
        subVisitorApiData?.Visit_Group_NIC_Passport_Number ||
        qrData.subVisitor.nic ||
        "N/A";
      const mainName =
        subVisitorApiData?.Visitor_Name || qrData.mainVisitor?.name || "N/A";
      const mainNic = subVisitorApiData?.Visitor_NIC_Passport_Number || "N/A";
      const visitArea = subVisitorApiData?.Visitor_Places_to_Visit || "N/A";
      const contactPerson = subVisitorApiData?.Contact_Person_Name || "N/A";

      const merged = {
        Name: svName,
        "NIC/Passport_No": svNic,
        "Main Visitor": mainName,
        "Main Visitor NIC": mainNic,
        "Visiting area": visitArea,
        "Contact Person": contactPerson,
        // Fields not available from VisitorJoint — kept for completeness
        Email: "N/A",
        "Phone number": "N/A",
        Company: "N/A",
        "Visiting purpose": "N/A",
      };

      // Add items from QR payload (compact format: n=name, q=quantity)
      if (
        qrData.items &&
        Array.isArray(qrData.items) &&
        qrData.items.length > 0
      ) {
        merged.items = qrData.items.map((item) => ({
          itemName: item.n || item.itemName || "N/A",
          itemQuantity: item.q || item.itemQuantity || 1,
          itemDescription: item.d || item.itemDescription || "",
        }));
      }

      return merged;
    }

    // Otherwise, handle normal gate pass QR
    const merged = {
      Name:
        qrData?.Name ||
        passDetails?.Visitor_Name ||
        passDetails?.VV_Name ||
        "N/A",
      "NIC/Passport_No":
        qrData?.["NIC/Passport_No"] ||
        passDetails?.Visitor_NIC ||
        passDetails?.VV_NIC_Passport_NO ||
        "N/A",
      Email:
        qrData?.Email ||
        passDetails?.Visitor_Email ||
        passDetails?.VV_Email ||
        "N/A",
      "Phone number":
        qrData?.["Phone number"] ||
        passDetails?.Visitor_Phone ||
        passDetails?.VV_Phone ||
        "N/A",
      Company:
        qrData?.Company ||
        passDetails?.Visitor_Company ||
        passDetails?.VV_Company ||
        "N/A",
      "Visiting purpose":
        qrData?.["Visiting purpose"] ||
        passDetails?.VVR_Purpose ||
        passDetails?.VVR_Visiting_Purpose ||
        "N/A",
      "Visiting area":
        qrData?.["Visiting area"] ||
        passDetails?.VVR_Places_to_Visit ||
        passDetails?.VGP_Visiting_Area ||
        "N/A",
    };

    // Add sub-visitors — merge from live API fetch (preferred) and QR payload fallback
    const liveSubVisitors =
      subVisitorsData && subVisitorsData.length > 0 ? subVisitorsData : null;
    const qrSubVisitors =
      qrData?.subVisitors && Array.isArray(qrData.subVisitors)
        ? qrData.subVisitors.map((sv) => ({
            id: sv.id || sv.groupId || sv.VVG_id || null,
            name: sv.name || sv.Visitor_Group_Name || sv.Group_Members || "N/A",
            nic:
              sv.nic ||
              sv.Visit_Group_NIC_Passport_Number ||
              sv.Members_NIC_Passport_Number ||
              "N/A",
          }))
        : null;
    const combinedSubVisitors = liveSubVisitors || qrSubVisitors;
    if (combinedSubVisitors && combinedSubVisitors.length > 0) {
      console.log("[LiveFeed] Sub-visitors for display:", combinedSubVisitors);
      merged.subVisitors = combinedSubVisitors;
    } else {
      console.log(
        "[LiveFeed] No subVisitors found. qrData:",
        qrData,
        "subVisitorsData:",
        subVisitorsData,
      );
    }

    return merged;
  }, [qrData, passDetails, subVisitorsData, subVisitorApiData]);

  const hasFullQrProfile = Object.values(profileData).some(
    (value) => value !== "N/A" && !Array.isArray(value),
  );

  const openViewAttachments = async (
    visitorId,
    visitorName,
    filterCategory = null,
    isSubVisitor = false,
  ) => {
    setViewAttachments((prev) => ({
      ...prev,
      open: true,
      visitorId,
      visitorName,
      loading: true,
      error: null,
      list: [],
      filterCategory,
    }));

    try {
      const response = isSubVisitor
        ? await VisitorAttachmentService.GetAttachmentsByGroupId(visitorId)
        : await VisitorAttachmentService.GetAttachmentsByVisitorId(visitorId);
      const rawList = response?.data?.ResultSet || response?.data || [];
      const list = Array.isArray(rawList) ? rawList : [];
      setViewAttachments((prev) => ({
        ...prev,
        loading: false,
        list,
      }));
    } catch (err) {
      console.error("Error fetching attachments:", err);
      setViewAttachments((prev) => ({
        ...prev,
        loading: false,
        error: err.message || "Failed to load attachments",
      }));
    }
  };

  const closeViewAttachments = () => {
    setViewAttachments({
      open: false,
      visitorId: null,
      visitorName: "",
      loading: false,
      list: [],
      error: null,
      filterCategory: null,
    });
  };

  const handleResetNode = () => {
    stopScanner();
    setScanResult("");
    setPassDetails(null);
    setQrData(null);
    setSubVisitorsData([]);
    setSubVisitorApiData(null);
    setMainVisitorItems([]);
    setItemCheckStates({});
    setVehiclesList([]);
    setIsLoading(false);
    setScanStatus("idle");
    setScanMessage("Point your camera at the QR code to get started.");
    setScanCount(0);
    setScanType(null);
    setRemarks("");
    setIsSubmitting(false);
    setViewAttachments({
      open: false,
      visitorId: null,
      visitorName: "",
      loading: false,
      list: [],
      error: null,
      filterCategory: null,
    });
  };

  const handleCheckInOut = async () => {
    if (!passDetails?.VGP_Pass_id) {
      console.error("No pass ID available for check-in/out");
      return;
    }

    if (scanType === "CHECK_OUT" && !remarks.trim()) {
      alert(
        "Please enter remarks about the visitor behavior before checking out.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      // Update item statuses first (A = taken/ticked, I = not taken/unticked)
      if (mainVisitorItems.length > 0) {
        await Promise.allSettled(
          mainVisitorItems.map((item) => {
            const isTaken = itemCheckStates[item.id] === true;
            return ItemCarriedService.UpdateItemStatus(
              item.id,
              isTaken ? "A" : "I",
            );
          }),
        );
        console.log("[LiveFeed] Item statuses updated.");
      }

      let result = null;
      if (useDemoScanLog) {
        result = {
          data: logScanEntryDemo(passDetails.VGP_Pass_id, scanType, remarks),
        };
      } else {
        result = await GatePassService.LogScanEntry(
          passDetails.VGP_Pass_id,
          scanType,
          remarks,
        );
      }

      if (result?.data?.Status === "Success" || result?.status === 200) {
        if (scanType === "CHECK_IN") {
          const expiryDate = getExpiryDateFromVisitDate(
            passDetails?.VVR_Visit_Date,
          );
          if (!expiryDate) {
            throw new Error(
              "Visit date is missing or invalid; unable to calculate expiry date.",
            );
          }

          const accessedAreas =
            passDetails?.VVR_Places_to_Visit ||
            passDetails?.VGP_Visiting_Area ||
            "N/A";

          await VisitLogService.AddVisitLog(
            passDetails.VGP_Pass_id,
            accessedAreas,
            expiryDate,
          );
        }

        // Update gate pass status in backend and localStorage
        const newStatus = scanType === "CHECK_IN" ? "IN" : "OUT";
        try {
          await dispatch(
            UpdateGatePassStatus(passDetails.VGP_Pass_id, newStatus),
          );
        } catch (statusErr) {
          console.warn(
            "[LiveFeed] Could not update gate pass status in backend:",
            statusErr,
          );
        }
        localStorage.setItem(
          `svm.gatePassStatus.${passDetails.VGP_Pass_id}`,
          newStatus,
        );

        const actionText = scanType === "CHECK_IN" ? "Check-in" : "Check-out";
        setScanMessage(
          `${actionText} successful! ${scanType === "CHECK_OUT" && remarks ? "Remarks logged." : ""}`,
        );

        // Show success for 2 seconds then reset
        setTimeout(() => {
          handleResetNode();
          startScanner();
        }, 2000);
      } else {
        throw new Error("Failed to log scan entry");
      }
    } catch (err) {
      console.error("Error logging scan entry:", err);
      alert(`Failed to log ${scanType}: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (scanStatus !== "idle") {
      return;
    }

    const timer = setTimeout(() => {
      startScanner();
    }, 0);

    return () => {
      clearTimeout(timer);
      stopScanner();
    };
  }, [scanStatus, stopScanner]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopScanner();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [stopScanner]);

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, [location.pathname, stopScanner]);

  return (
    <div className="max-w-2xl w-full space-y-4 md:space-y-6 relative z-10 mx-auto px-4">
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3 mb-1">
          <Zap size={14} className="text-primary animate-pulse" />
          <span className="text-primary uppercase tracking-[0.3em] text-[10px] font-bold">
            Security Checkpoint
          </span>
        </div>
        <h1 className="uppercase text-2xl md:text-3xl font-black tracking-tight italic">
          QR Scanner
        </h1>
      </div>

      <AnimatePresence mode="wait">
        {scanStatus !== "details" ? (
          <motion.div
            key="scanner"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="space-y-6"
          >
            {/* Scanner Frame */}
            <div className="relative aspect-square max-w-[18rem] md:max-w-xs mx-auto mas-glass border-primary/20 p-1 group overflow-hidden rounded-[24px]">
              {/* Animated Corners */}
              <div className="absolute top-0 left-0 w-9 h-9 border-t-4 border-l-4 border-primary z-30"></div>
              <div className="absolute top-0 right-0 w-9 h-9 border-t-4 border-r-4 border-primary z-30"></div>
              <div className="absolute bottom-0 left-0 w-9 h-9 border-b-4 border-l-4 border-primary z-30"></div>
              <div className="absolute bottom-0 right-0 w-9 h-9 border-b-4 border-r-4 border-primary z-30"></div>

              <div className="w-full h-full bg-[#0A0A0B] relative overflow-hidden flex items-center justify-center rounded-[20px]">
                {scanStatus === "scanning" && (
                  <div className="absolute inset-0 z-20 pointer-events-none">
                    <div className="w-full h-[2px] bg-primary/80 shadow-[0_0_25px_var(--color-primary)] animate-scan"></div>
                    <div className="w-full h-full bg-primary/5"></div>
                  </div>
                )}

                {scanStatus === "success" && (
                  <div className="absolute inset-0 z-30 bg-green-500/20 flex flex-col items-center justify-center backdrop-blur-md">
                    <div className="w-20 h-20 bg-green-500 rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.4)] animate-bounce">
                      <QrCode size={40} className="text-white" />
                    </div>
                    <p className="mt-8 text-green-500 uppercase font-black tracking-[0.3em]">
                      QR Code Scanned
                    </p>
                  </div>
                )}

                {scanStatus === "error" && (
                  <div className="absolute inset-0 z-30 bg-primary/20 flex flex-col items-center justify-center backdrop-blur-md px-10 text-center">
                    <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(200,16,46,0.4)]">
                      <AlertTriangle size={40} className="text-white" />
                    </div>
                    <p className="mt-8 text-primary uppercase font-black tracking-[0.3em]">
                      Scan Error
                    </p>
                    <p className="mt-4 text-white/70 text-[10px] uppercase tracking-widest">
                      {scanMessage}
                    </p>
                  </div>
                )}

                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />

                <div className="absolute inset-0 bg-black/40 pointer-events-none mix-blend-overlay"></div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-5">
              <button
                onClick={startScanner}
                disabled={scanStatus === "scanning" || isLoading}
                className={`px-9 md:px-12 py-3.5 bg-primary text-white font-black uppercase text-[10px] tracking-[0.32em] shadow-[0_0_50px_rgba(200,16,46,0.3)] transition-all flex flex-col md:flex-row items-center gap-3 md:gap-4 ${scanStatus === "scanning" ? "opacity-50 grayscale" : "hover:scale-105 active:scale-95"}`}
              >
                <RefreshCw
                  size={18}
                  className={scanStatus === "scanning" ? "animate-spin" : ""}
                />
                {scanStatus === "scanning" ? "Scanning..." : "Scan QR Code"}
              </button>

              <p className="text-gray-400 uppercase text-[10px] tracking-[0.3em] text-center max-w-sm leading-relaxed">
                {scanMessage}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg mx-auto rounded-[28px] shadow-2xl transition-colors duration-300 flex flex-col"
            style={{
              background: "var(--color-bg-paper)",
              border: "1px solid var(--color-border-soft)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.15)",
              maxHeight: "85vh",
            }}
          >
            {/* ── Header gradient strip ── */}
            <div
              className="relative px-4 pt-4 pb-5 overflow-hidden flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 60%, transparent 100%)",
              }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-600 via-green-400 to-green-600 opacity-80" />

              {/* Avatar + name block */}
              <div className="flex items-center gap-3 mt-1">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-black flex-shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(34, 197, 94, 0.25), rgba(34, 197, 94, 0.1))",
                    border: "1px solid rgba(34, 197, 94, 0.25)",
                    color: "var(--color-success)",
                    boxShadow: "0 4px 12px rgba(34, 197, 94, 0.1)",
                  }}
                >
                  {(profileData.Name !== "N/A" ? profileData.Name : "?")
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div className="min-w-0">
                  {/* Visitor type badge */}
                  {qrData?.type === "subVisitor" ? (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-[0.22em] mb-1"
                      style={{
                        background: "rgba(99, 102, 241, 0.12)",
                        border: "1px solid rgba(99, 102, 241, 0.3)",
                        color: "#818cf8",
                      }}
                    >
                      <span className="w-1 h-1 rounded-full bg-indigo-400 inline-block" />
                      Group Member
                    </span>
                  ) : (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-[0.22em] mb-1"
                      style={{
                        background: "rgba(34, 197, 94, 0.1)",
                        border: "1px solid rgba(34, 197, 94, 0.25)",
                        color: "#4ade80",
                      }}
                    >
                      <span className="w-1 h-1 rounded-full bg-green-400 inline-block" />
                      Main Visitor
                    </span>
                  )}
                  <p className="text-[var(--color-text-primary)] text-sm font-black tracking-tight truncate">
                    {profileData.Name !== "N/A"
                      ? profileData.Name
                      : "Unknown Visitor"}
                  </p>
                  <p className="text-green-600 dark:text-green-400 text-[10px] uppercase tracking-[0.28em] font-bold mt-0.5 opacity-80">
                    {profileData["NIC/Passport_No"] !== "N/A"
                      ? profileData["NIC/Passport_No"]
                      : "ID Not Available"}
                  </p>
                </div>
                <div className="ml-auto flex-shrink-0">
                  <div
                    className="flex items-center gap-1 px-2 py-1 rounded-full text-green-600 dark:text-green-400 text-[8px] font-black uppercase tracking-[0.2em]"
                    style={{
                      background: "rgba(34, 197, 94, 0.1)",
                      border: "1px solid rgba(34, 197, 94, 0.2)",
                    }}
                  >
                    <CheckCircle2 size={11} />
                    Verified
                  </div>
                </div>
              </div>
            </div>

            {/* ── Info sections (scrollable) ── */}
            <div className="divide-y divide-[var(--color-border-soft)] transition-colors duration-300 overflow-y-auto flex-1 text-[13px]">
              {/* Section: Identity */}
              <div className="px-4 py-2.5">
                <p className="text-[8px] uppercase tracking-[0.3em] font-bold mb-2 text-[var(--color-text-dim)]">
                  Visitor Info
                </p>
                <div className="space-y-1.5">
                  <InfoRow
                    icon={<User size={14} />}
                    label="Full Name"
                    value={profileData.Name}
                  />
                  <div className="flex items-center justify-between gap-2">
                    <InfoRow
                      icon={<CreditCard size={14} />}
                      label="NIC / Passport"
                      value={profileData["NIC/Passport_No"]}
                    />
                    <button
                      type="button"
                      title="View uploaded attachments"
                      onClick={() => {
                        const vid =
                          passDetails?.Visitor_Id ||
                          passDetails?.VV_Visitor_id ||
                          passDetails?.Visitor_ID ||
                          passDetails?.VGP_Visitor_id ||
                          subVisitorApiData?.Visitor_Id ||
                          subVisitorApiData?.VV_Visitor_id ||
                          qrData?.mainVisitor?.id ||
                          qrData?.id;
                        openViewAttachments(vid, profileData.Name, [
                          "nic",
                          "passport",
                          "driving licence",
                        ]);
                      }}
                      className="p-1.5 rounded-lg border border-primary/40 bg-primary/15 text-primary hover:bg-primary/25 hover:border-primary/60 transition-all shrink-0 cursor-pointer active:scale-95"
                    >
                      <FolderOpen size={13} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Section: Main Visitor (for sub-visitor QR codes) */}
              {qrData?.type === "subVisitor" &&
                (subVisitorApiData || qrData?.mainVisitor) && (
                  <div className="px-4 py-2.5">
                    <p className="text-[8px] uppercase tracking-[0.3em] font-bold mb-2 text-[var(--color-text-dim)]">
                      Main Visitor
                    </p>
                    <div className="space-y-1.5">
                      <InfoRow
                        icon={<User size={14} />}
                        label="Name"
                        value={profileData["Main Visitor"]}
                      />
                      <InfoRow
                        icon={<CreditCard size={14} />}
                        label="NIC / Passport"
                        value={profileData["Main Visitor NIC"]}
                      />
                      {profileData["Contact Person"] &&
                        profileData["Contact Person"] !== "N/A" && (
                          <InfoRow
                            icon={<Phone size={14} />}
                            label="Contact Person"
                            value={profileData["Contact Person"]}
                          />
                        )}
                      {profileData["Visiting area"] &&
                        profileData["Visiting area"] !== "N/A" && (
                          <InfoRow
                            icon={<MapPin size={14} />}
                            label="Visiting Area"
                            value={profileData["Visiting area"]}
                          />
                        )}
                    </div>
                  </div>
                )}

              {/* Section: Contact — hidden for sub-visitor QRs */}
              {qrData?.type !== "subVisitor" && (
                <div className="px-4 py-2.5">
                  <p className="text-[8px] uppercase tracking-[0.3em] font-bold mb-2 text-[var(--color-text-dim)]">
                    Contact Details
                  </p>
                  <div className="space-y-1.5">
                    <InfoRow
                      icon={<Mail size={14} />}
                      label="Email"
                      value={profileData.Email}
                    />
                    <InfoRow
                      icon={<Phone size={14} />}
                      label="Phone"
                      value={profileData["Phone number"]}
                    />
                    <InfoRow
                      icon={<Building2 size={14} />}
                      label="Company"
                      value={profileData.Company}
                    />
                  </div>
                </div>
              )}

              {/* Section: Visit Details — hidden for sub-visitor QRs */}
              {qrData?.type !== "subVisitor" && (
                <div className="px-4 py-2.5">
                  <p className="text-[8px] uppercase tracking-[0.3em] font-bold mb-2 text-[var(--color-text-dim)]">
                    Visit Details
                  </p>
                  <div className="space-y-1.5">
                    <InfoRow
                      icon={<Target size={14} />}
                      label="Purpose"
                      value={profileData["Visiting purpose"]}
                    />
                    <InfoRow
                      icon={<MapPin size={14} />}
                      label="Location"
                      value={profileData["Visiting area"]}
                    />
                  </div>
                </div>
              )}

              {/* Section: Vehicle Details */}
              {vehiclesList && vehiclesList.length > 0 && (
                <div className="px-4 py-2.5 border-t border-[var(--color-border-soft)]">
                  <p className="text-[8px] uppercase tracking-[0.3em] font-bold mb-2 text-[var(--color-text-dim)]">
                    Vehicle Details
                  </p>
                  <div className="space-y-1.5">
                    {vehiclesList.map((vehicle, idx) => (
                      <div
                        key={vehicle.id || idx}
                        className="p-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border-soft)] flex items-center justify-between gap-2.5"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{
                              background: "rgba(34,197,94,0.1)",
                              color: "var(--color-success)",
                            }}
                          >
                            <Car size={14} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[8px] uppercase tracking-[0.18em] font-bold leading-none mb-0.5 text-[var(--color-text-dim)]">
                              {vehicle.vehicleType || "Vehicle"}
                            </p>
                            <p className="text-xs font-semibold text-[var(--color-text-primary)] truncate">
                              {vehicle.plateNumber || "N/A"}
                            </p>
                          </div>
                        </div>
                        {/* Attachment Viewer Buttons */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            type="button"
                            title="Vehicle Insurance"
                            onClick={() => {
                              const vid =
                                passDetails?.Visitor_Id ||
                                passDetails?.VV_Visitor_id ||
                                passDetails?.Visitor_ID ||
                                passDetails?.VGP_Visitor_id ||
                                subVisitorApiData?.Visitor_Id ||
                                subVisitorApiData?.VV_Visitor_id ||
                                qrData?.mainVisitor?.id ||
                                qrData?.id;
                              openViewAttachments(
                                vid,
                                profileData.Name,
                                "Vehicle Insurance",
                              );
                            }}
                            className="p-1.5 rounded-lg border border-primary/40 bg-primary/15 text-primary hover:bg-primary/25 hover:border-primary/60 transition-all cursor-pointer active:scale-95 text-[10px] font-semibold flex items-center gap-1"
                          >
                            <Shield size={12} />
                            Insurance
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section: Items Carried (for sub-visitors) */}
              {profileData.items && profileData.items.length > 0 && (
                <div className="px-4 py-2.5 border-t border-[var(--color-border-soft)]">
                  <p className="text-[8px] uppercase tracking-[0.3em] font-bold mb-2 text-[var(--color-text-dim)]">
                    Items Being Brought In
                  </p>
                  <div className="space-y-1.5">
                    {profileData.items.map((item, index) => (
                      <div
                        key={index}
                        className="p-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border-soft)] flex items-center gap-2"
                      >
                        <Package
                          size={12}
                          className="text-[var(--color-text-secondary)] flex-shrink-0"
                        />
                        <span className="text-xs font-semibold text-[var(--color-text-primary)] truncate flex-1">
                          {item.itemName || "N/A"}
                        </span>
                        {item.itemQuantity && item.itemQuantity > 1 && (
                          <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary text-[9px] font-bold flex-shrink-0">
                            x{item.itemQuantity}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section: Sub Visitors (Group Members) */}
              {profileData.subVisitors &&
                profileData.subVisitors.length > 0 && (
                  <div className="px-4 py-2.5 border-t border-[var(--color-border-soft)]">
                    <p className="text-[8px] uppercase tracking-[0.3em] font-bold mb-2 text-[var(--color-text-dim)]">
                      Group Members
                    </p>
                    <div className="space-y-1.5">
                      {profileData.subVisitors.map((subVisitor, index) => (
                        <div
                          key={index}
                          className="p-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border-soft)] flex items-center justify-between gap-2.5"
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0"
                              style={{
                                background: "rgba(34,197,94,0.1)",
                                color: "var(--color-success)",
                              }}
                            >
                              {(subVisitor.name || "?")
                                .split(" ")
                                .map((w) => w[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-[var(--color-text-primary)] truncate">
                                {subVisitor.name || "N/A"}
                              </p>
                              <p className="text-[10px] text-[var(--color-text-dim)] truncate">
                                {subVisitor.nic || "N/A"}
                              </p>
                            </div>
                          </div>
                          {/* Folder Attachment Button */}
                          {(subVisitor.id || subVisitor.VVG_id) && (
                            <button
                              type="button"
                              title="View uploaded attachments"
                              onClick={() => {
                                const svId = subVisitor.id || subVisitor.VVG_id;
                                openViewAttachments(
                                  svId,
                                  subVisitor.name,
                                  ["nic", "passport", "driving licence"],
                                  true,
                                );
                              }}
                              className="p-1.5 rounded-lg border border-primary/40 bg-primary/15 text-primary hover:bg-primary/25 hover:border-primary/60 transition-all shrink-0 cursor-pointer active:scale-95"
                            >
                              <FolderOpen size={13} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Section: Items Carried — main visitor QR only */}
              {qrData?.type !== "subVisitor" && mainVisitorItems.length > 0 && (
                <div className="px-4 py-2.5 border-t border-[var(--color-border-soft)]">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[8px] uppercase tracking-[0.3em] font-bold text-[var(--color-text-dim)]">
                      Items Carried
                    </p>

                    {/* Counter shown only during CHECK_IN */}
                    {scanType === "CHECK_IN" && (
                      <span
                        className="text-[8px] font-bold uppercase tracking-[0.18em] px-2 py-0.5 rounded-full"
                        style={{
                          background: "rgba(34,197,94,0.1)",
                          border: "1px solid rgba(34,197,94,0.2)",
                          color: "var(--color-success)",
                        }}
                      >
                        {Object.values(itemCheckStates).filter(Boolean).length}{" "}
                        / {mainVisitorItems.length} verified
                      </span>
                    )}

                    {/* Read-only label during CHECK_OUT */}
                    {scanType === "CHECK_OUT" && (
                      <span
                        className="text-[8px] font-bold uppercase tracking-[0.18em] px-2 py-0.5 rounded-full"
                        style={{
                          background: "rgba(249,115,22,0.1)",
                          border: "1px solid rgba(249,115,22,0.25)",
                          color: "#f97316",
                        }}
                      >
                        {mainVisitorItems.length}{" "}
                        {mainVisitorItems.length === 1 ? "item" : "items"}
                      </span>
                    )}
                  </div>

                  {/* Instruction — only shown during CHECK_IN */}
                  {scanType === "CHECK_IN" && (
                    <p className="text-[8px] text-[var(--color-text-dim)] mb-2 leading-relaxed">
                      Tick each item the visitor is carrying out. Unticked items
                      will be marked as not taken.
                    </p>
                  )}

                  {/* READ-ONLY view for CHECK_OUT */}
                  {scanType === "CHECK_OUT" ? (
                    <div className="space-y-1.5">
                      {mainVisitorItems.map((item) => {
                        const s = (item.status || "")
                          .toString()
                          .trim()
                          .toUpperCase();
                        const isTaken = s === "A";
                        const isNotTaken = s === "I";
                        return (
                          <div
                            key={item.id}
                            className="w-full p-2 rounded-lg border flex items-center gap-2.5"
                            style={{
                              background: isTaken
                                ? "rgba(34,197,94,0.06)"
                                : isNotTaken
                                  ? "rgba(249,115,22,0.06)"
                                  : "var(--color-surface-2)",
                              borderColor: isTaken
                                ? "rgba(34,197,94,0.3)"
                                : isNotTaken
                                  ? "rgba(249,115,22,0.3)"
                                  : "var(--color-border-soft)",
                            }}
                          >
                            <Package
                              size={12}
                              className="flex-shrink-0"
                              style={{
                                color: isTaken
                                  ? "var(--color-success)"
                                  : isNotTaken
                                    ? "#f97316"
                                    : "var(--color-text-secondary)",
                              }}
                            />
                            <div className="min-w-0 flex-1">
                              <p
                                className="text-xs font-semibold truncate"
                                style={{ color: "var(--color-text-primary)" }}
                              >
                                {item.itemName || "Unnamed item"}
                              </p>
                              {item.description && (
                                <p className="text-[9px] text-[var(--color-text-dim)] truncate">
                                  {item.description}
                                </p>
                              )}
                            </div>
                            {item.quantity && (
                              <span
                                className="px-1.5 py-0.5 rounded text-[9px] font-bold flex-shrink-0"
                                style={{
                                  background: "var(--color-surface-1)",
                                  color: "var(--color-text-secondary)",
                                }}
                              >
                                x{item.quantity}
                              </span>
                            )}
                            {/* Status badge */}
                            {isTaken ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-[0.14em] flex-shrink-0 bg-green-500/10 border border-green-500/25 text-green-500">
                                <svg
                                  width="9"
                                  height="7"
                                  viewBox="0 0 10 8"
                                  fill="none"
                                >
                                  <path
                                    d="M1 4L3.5 6.5L9 1"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                Taken
                              </span>
                            ) : isNotTaken ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-[0.14em] flex-shrink-0 bg-orange-500/10 border border-orange-500/25 text-orange-500">
                                <svg
                                  width="9"
                                  height="9"
                                  viewBox="0 0 10 10"
                                  fill="none"
                                >
                                  <path
                                    d="M2 2L8 8M8 2L2 8"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                  />
                                </svg>
                                Not Taken
                              </span>
                            ) : (
                              <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-[0.14em] flex-shrink-0"
                                style={{
                                  background: "var(--color-surface-1)",
                                  border: "1px solid var(--color-border-soft)",
                                  color: "var(--color-text-dim)",
                                }}
                              >
                                Pending
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* INTERACTIVE checklist for CHECK_IN */
                    <div className="space-y-1.5">
                      {mainVisitorItems.map((item) => {
                        const isChecked = itemCheckStates[item.id] === true;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() =>
                              setItemCheckStates((prev) => ({
                                ...prev,
                                [item.id]: !prev[item.id],
                              }))
                            }
                            disabled={isSubmitting}
                            className="w-full text-left p-2 rounded-lg border transition-all flex items-center gap-2.5 group"
                            style={{
                              background: isChecked
                                ? "rgba(34,197,94,0.08)"
                                : "var(--color-surface-2)",
                              borderColor: isChecked
                                ? "rgba(34,197,94,0.35)"
                                : "var(--color-border-soft)",
                            }}
                          >
                            {/* Checkbox visual */}
                            <div
                              className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all"
                              style={{
                                background: isChecked
                                  ? "rgba(34,197,94,1)"
                                  : "var(--color-surface-1)",
                                border: isChecked
                                  ? "2px solid rgba(34,197,94,1)"
                                  : "2px solid var(--color-border-medium)",
                              }}
                            >
                              {isChecked && (
                                <svg
                                  width="10"
                                  height="8"
                                  viewBox="0 0 10 8"
                                  fill="none"
                                >
                                  <path
                                    d="M1 4L3.5 6.5L9 1"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </div>
                            {/* Item details */}
                            <Package
                              size={12}
                              className="flex-shrink-0"
                              style={{
                                color: isChecked
                                  ? "var(--color-success)"
                                  : "var(--color-text-secondary)",
                              }}
                            />
                            <div className="min-w-0 flex-1">
                              <p
                                className="text-xs font-semibold truncate transition-all"
                                style={{
                                  color: isChecked
                                    ? "var(--color-success)"
                                    : "var(--color-text-primary)",
                                  textDecoration: isChecked
                                    ? "line-through"
                                    : "none",
                                  opacity: isChecked ? 0.75 : 1,
                                }}
                              >
                                {item.itemName || "Unnamed item"}
                              </p>
                              {item.description && (
                                <p className="text-[9px] text-[var(--color-text-dim)] truncate">
                                  {item.description}
                                </p>
                              )}
                            </div>
                            {item.quantity && (
                              <span
                                className="px-1.5 py-0.5 rounded text-[9px] font-bold flex-shrink-0"
                                style={{
                                  background: isChecked
                                    ? "rgba(34,197,94,0.15)"
                                    : "rgba(var(--color-primary-rgb,200,16,46),0.1)",
                                  color: isChecked
                                    ? "var(--color-success)"
                                    : "var(--color-text-secondary)",
                                }}
                              >
                                x{item.quantity}
                              </span>
                            )}
                            {/* Taken / Not taken badge */}
                            <span
                              className="text-[8px] font-black uppercase tracking-[0.14em] flex-shrink-0"
                              style={{
                                color: isChecked
                                  ? "var(--color-success)"
                                  : "var(--color-text-dim)",
                              }}
                            >
                              {isChecked ? "Taken" : "Not taken"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Access status bar */}
              <div
                className="px-4 py-1 flex items-center justify-between transition-colors duration-300 flex-shrink-0"
                style={{ background: "var(--color-surface-1)" }}
              >
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                      scanType === "CHECK_OUT"
                        ? "bg-orange-500"
                        : "bg-green-500"
                    }`}
                  />
                  <span className="text-[9px] uppercase tracking-widest font-medium text-[var(--color-text-secondary)]">
                    {scanType === "CHECK_OUT"
                      ? "Second scan detected — checkout mode"
                      : "Pass verified — check-in"}
                  </span>
                </div>
                {scanType === "CHECK_OUT" ? (
                  <LogOut
                    size={14}
                    className="text-orange-600 dark:text-orange-400 flex-shrink-0"
                  />
                ) : (
                  <LogIn
                    size={14}
                    className="text-green-600 dark:text-green-400 flex-shrink-0"
                  />
                )}
              </div>

              {/* Remarks field for checkout */}
              {scanType === "CHECK_OUT" && (
                <div className="px-4 py-3 border-t border-[var(--color-border-soft)]">
                  <div className="flex items-center gap-1.5 mb-2">
                    <MessageSquare
                      size={13}
                      className="text-orange-600 dark:text-orange-400"
                    />
                    <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-[var(--color-text-secondary)]">
                      Visitor Behavior Remarks
                    </label>
                  </div>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter any remarks about visitor behavior during the visit..."
                    className="w-full px-3 py-2 rounded-lg border transition-all text-[12px] resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
                    style={{
                      background: "var(--color-surface-2)",
                      borderColor: "var(--color-border-soft)",
                      color: "var(--color-text-primary)",
                    }}
                    rows={3}
                    disabled={isSubmitting}
                  />
                  <p className="text-[8px] text-[var(--color-text-dim)] mt-1.5">
                    Required: Please provide feedback about the visitor's
                    behavior and conduct during the visit.
                  </p>
                </div>
              )}
            </div>

            {/* ── Footer actions ── */}
            <div
              className="px-4 py-3 flex gap-2 transition-colors duration-300 flex-shrink-0"
              style={{
                background: "var(--color-surface-1)",
                borderTop: "1px solid var(--color-border-soft)",
              }}
            >
              <button
                onClick={handleCheckInOut}
                disabled={
                  isSubmitting || (scanType === "CHECK_OUT" && !remarks.trim())
                }
                className={`flex-1 py-2.5 font-black uppercase text-[9px] tracking-[0.22em] rounded-xl transition-all flex items-center justify-center gap-2 text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                style={{
                  background:
                    scanType === "CHECK_OUT"
                      ? "linear-gradient(135deg, #ea580c, #f97316)"
                      : "linear-gradient(135deg, #16a34a, #22c55e)",
                  boxShadow:
                    scanType === "CHECK_OUT"
                      ? "0 4px 12px rgba(249, 115, 22, 0.25)"
                      : "0 4px 12px rgba(34, 197, 94, 0.25)",
                }}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    Processing...
                  </>
                ) : scanType === "CHECK_OUT" ? (
                  <>
                    Check Out <LogOut size={13} />
                  </>
                ) : (
                  <>
                    Check In <LogIn size={13} />
                  </>
                )}
              </button>
              <button
                onClick={handleResetNode}
                disabled={isSubmitting}
                className="px-4 py-2.5 border border-[var(--color-border-medium)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)] font-black uppercase text-[9px] tracking-[0.22em] rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Scan Another
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attachments Modal */}
      {viewAttachments.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="bg-[var(--color-bg-paper)] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md my-auto relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-black/20 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-5 bg-primary rounded-full" />
                <div>
                  <h2 className="text-[12px] font-normal text-white tracking-[0.16em]">
                    {viewAttachments.filterCategory
                      ? Array.isArray(viewAttachments.filterCategory)
                        ? "Uploaded Documents"
                        : viewAttachments.filterCategory
                      : "Uploaded Documents"}
                  </h2>
                  {viewAttachments.visitorName && (
                    <p className="text-[10px] text-white/40 tracking-widest mt-0.5">
                      {viewAttachments.visitorName} · #
                      {viewAttachments.visitorId}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={closeViewAttachments}
                className="text-gray-400 hover:text-white transition-colors bg-white/5 p-1.5 rounded-lg"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-5 relative z-10 min-h-[120px] overflow-y-auto flex-1">
              {viewAttachments.loading ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <div className="w-8 h-8 border-2 border-border-soft border-t-primary rounded-full animate-spin" />
                  <p className="text-[11px] text-white/30 tracking-widest uppercase">
                    Loading...
                  </p>
                </div>
              ) : viewAttachments.error ? (
                <div className="flex items-center gap-2 px-3 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-[11px]">
                  <AlertCircle size={13} className="shrink-0" />
                  {viewAttachments.error}
                </div>
              ) : (viewAttachments.filterCategory
                  ? viewAttachments.list.filter((att) => {
                      const cat = (
                        att.VAT_File_Category ||
                        att.FileCategory ||
                        ""
                      ).toLowerCase();
                      if (Array.isArray(viewAttachments.filterCategory)) {
                        return viewAttachments.filterCategory
                          .map((c) => c.toLowerCase())
                          .includes(cat);
                      }
                      return (
                        cat === viewAttachments.filterCategory.toLowerCase()
                      );
                    })
                  : viewAttachments.list
                ).length === 0 && !viewAttachments.loading ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3 opacity-40">
                  <FolderOpen size={32} />
                  <p className="text-[11px] tracking-widest uppercase">
                    No{" "}
                    {Array.isArray(viewAttachments.filterCategory)
                      ? ""
                      : viewAttachments.filterCategory || ""}{" "}
                    attachments found
                  </p>
                </div>
              ) : (
                <ul className="space-y-2 max-h-[312px] overflow-y-auto pr-1 custom-scrollbar">
                  {(viewAttachments.filterCategory
                    ? viewAttachments.list.filter((att) => {
                        const cat = (
                          att.VAT_File_Category ||
                          att.FileCategory ||
                          ""
                        ).toLowerCase();
                        if (Array.isArray(viewAttachments.filterCategory)) {
                          return viewAttachments.filterCategory
                            .map((c) => c.toLowerCase())
                            .includes(cat);
                        }
                        return (
                          cat === viewAttachments.filterCategory.toLowerCase()
                        );
                      })
                    : viewAttachments.list
                  ).map((att, idx) => {
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
                          <p className="text-[11px] font-medium text-white truncate">
                            {fileName}
                          </p>
                          <p className="text-[9px] text-white/40 capitalize">
                            {category}
                          </p>
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
                          className={`flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/25 transition-all shrink-0 ${!vatId ? "opacity-30 cursor-not-allowed" : ""}`}
                        >
                          <Download size={18} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
      <AttachmentPreviewModal
        previewData={previewData}
        onClose={closePreview}
      />
    </div>
  );
};

export default LiveFeed;
