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
} from "lucide-react";
import { GetGatePassById } from "../../../actions/GatePassAction";
import { motion, AnimatePresence } from "framer-motion";
import {
  decodeSecureQrPayload,
  isSecureQrPayload,
} from "../../../utils/secureQrPayload";
import VisitorService from "../../../services/VisitorService";

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

const LiveFeed = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const scannerRef = useRef(null);
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
        setPassDetails(details);
        setScanStatus("details");
        setScanMessage(
          "The visitor details were found and verified successfully.",
        );

        // Fetch sub-visitor data live from the VisitorJoint API
        const requestId = details.VGP_Request_id || details.VVR_Request_id;
        if (requestId) {
          try {
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
                uniqueSubVisitors.push({ name, nic: nic || "N/A" });
              }
            }
            setSubVisitorsData(uniqueSubVisitors);
            console.log(
              "[LiveFeed] Fetched sub-visitors from API:",
              uniqueSubVisitors,
            );
          } catch (err) {
            console.warn("[LiveFeed] Could not fetch sub-visitors:", err);
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
        ? qrData.subVisitors
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

  const handleResetNode = () => {
    stopScanner();
    setScanResult("");
    setPassDetails(null);
    setQrData(null);
    setSubVisitorsData([]);
    setSubVisitorApiData(null);
    setIsLoading(false);
    setScanStatus("idle");
    setScanMessage("Point your camera at the QR code to get started.");
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
                  <InfoRow
                    icon={<CreditCard size={14} />}
                    label="NIC / Passport"
                    value={profileData["NIC/Passport_No"]}
                  />
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
                          className="p-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border-soft)] flex items-center gap-2"
                        >
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
                      ))}
                    </div>
                  </div>
                )}

              {/* Access status bar */}
              <div
                className="px-4 py-1 flex items-center justify-between transition-colors duration-300 flex-shrink-0"
                style={{ background: "var(--color-surface-1)" }}
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[9px] uppercase tracking-widest font-medium text-[var(--color-text-secondary)]">
                    Pass verified — welcome inside
                  </span>
                </div>
                <ShieldCheck
                  size={14}
                  className="text-green-600 dark:text-green-400 flex-shrink-0"
                />
              </div>
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
                onClick={() => alert("Entry allowed. Verification logged.")}
                className="flex-1 py-2.5 font-black uppercase text-[9px] tracking-[0.22em] rounded-xl transition-all flex items-center justify-center gap-2 text-white"
                style={{
                  background: "linear-gradient(135deg, #16a34a, #22c55e)",
                  boxShadow: "0 4px 12px rgba(34, 197, 94, 0.25)",
                }}
              >
                Allow Entry <ArrowRight size={13} />
              </button>
              <button
                onClick={handleResetNode}
                className="px-4 py-2.5 border border-[var(--color-border-medium)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)] font-black uppercase text-[9px] tracking-[0.22em] rounded-xl transition-all"
              >
                Scan Another
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveFeed;
