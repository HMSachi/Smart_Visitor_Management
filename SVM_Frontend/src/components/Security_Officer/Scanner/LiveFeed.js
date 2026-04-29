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
} from "lucide-react";
import { GetGatePassById } from "../../../actions/GatePassAction";
import { motion, AnimatePresence } from "framer-motion";
import {
  decodeSecureQrPayload,
  isSecureQrPayload,
} from "../../../utils/secureQrPayload";

// ── Helper: a single icon + label + value row ──────────────────────────────
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div
      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{
        background: "var(--color-surface-2)",
        border: "1px solid var(--color-border-soft)",
        color: "var(--color-text-secondary)",
      }}
    >
      {icon}
    </div>
    <div className="min-w-0">
      <p
        className="text-[9px] uppercase tracking-[0.22em] font-bold mb-0.5"
        style={{ color: "var(--color-text-dim)" }}
      >
        {label}
      </p>
      <p
        className="text-sm font-semibold break-words leading-snug"
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

      if (isSecureQrPayload(data)) {
        console.log("[LiveFeed] Detected secure QR format");
        const decoded = await decodeSecureQrPayload(data);
        if (decoded && typeof decoded === "object") {
          parsedQrData = decoded;
          setQrData(decoded);
        }
        if (decoded?.id) {
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

      if (!passId) {
        throw new Error("We could not find a valid pass ID in the QR code.");
      }

      console.log("[LiveFeed] Looking up pass ID:", passId);

      // Fetch gate pass details from database
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
    // Merge QR data with database details
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
    return merged;
  }, [qrData, passDetails]);

  const hasFullQrProfile = Object.values(profileData).some(
    (value) => value !== "N/A",
  );

  const handleResetNode = () => {
    stopScanner();
    setScanResult("");
    setPassDetails(null);
    setQrData(null);
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
            className="w-full max-w-lg mx-auto overflow-hidden rounded-[28px] shadow-2xl transition-colors duration-300"
            style={{
              background: "var(--color-bg-paper)",
              border: "1px solid var(--color-border-soft)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.15)",
            }}
          >
            {/* ── Header gradient strip ── */}
            <div
              className="relative px-6 pt-6 pb-8 overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 60%, transparent 100%)",
              }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-600 via-green-400 to-green-600 opacity-80" />

              {/* Avatar + name block */}
              <div className="flex items-center gap-4 mt-2">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black flex-shrink-0"
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
                  <p className="text-[var(--color-text-primary)] text-base font-black tracking-tight truncate">
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
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-green-600 dark:text-green-400 text-[9px] font-black uppercase tracking-[0.2em]"
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

            {/* ── Info sections ── */}
            <div className="divide-y divide-[var(--color-border-soft)] transition-colors duration-300">
              {/* Section: Identity */}
              <div className="px-6 py-4">
                <p className="text-[9px] uppercase tracking-[0.3em] font-bold mb-3 text-[var(--color-text-dim)]">
                  Identity
                </p>
                <div className="space-y-3">
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

              {/* Section: Contact */}
              <div className="px-6 py-4">
                <p className="text-[9px] uppercase tracking-[0.3em] font-bold mb-3 text-[var(--color-text-dim)]">
                  Contact
                </p>
                <div className="space-y-3">
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

              {/* Section: Visit Details */}
              <div className="px-6 py-4">
                <p className="text-[9px] uppercase tracking-[0.3em] font-bold mb-3 text-[var(--color-text-dim)]">
                  Visit Details
                </p>
                <div className="space-y-3">
                  <InfoRow
                    icon={<Target size={14} />}
                    label="Purpose"
                    value={profileData["Visiting purpose"]}
                  />
                  <InfoRow
                    icon={<MapPin size={14} />}
                    label="Area"
                    value={profileData["Visiting area"]}
                  />
                </div>
              </div>

              {/* Access status bar */}
              <div
                className="px-6 py-3 flex items-center justify-between transition-colors duration-300"
                style={{ background: "var(--color-surface-1)" }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] uppercase tracking-widest font-medium text-[var(--color-text-secondary)]">
                    QR is valid — visitor information found
                  </span>
                </div>
                <ShieldCheck
                  size={16}
                  className="text-green-600 dark:text-green-400 flex-shrink-0"
                />
              </div>
            </div>

            {/* ── Footer actions ── */}
            <div
              className="px-6 py-4 flex flex-col md:flex-row gap-3 transition-colors duration-300"
              style={{
                background: "var(--color-surface-1)",
                borderTop: "1px solid var(--color-border-soft)",
              }}
            >
              <button
                onClick={() => alert("Verification Log Saved to Cluster")}
                className="flex-1 py-3.5 font-black uppercase text-[10px] tracking-[0.22em] rounded-2xl transition-all flex items-center justify-center gap-3 text-white"
                style={{
                  background: "linear-gradient(135deg, #16a34a, #22c55e)",
                  boxShadow: "0 8px 20px rgba(34, 197, 94, 0.25)",
                }}
              >
                Allow Entry <ArrowRight size={16} />
              </button>
              <button
                onClick={handleResetNode}
                className="px-5 md:px-7 py-3.5 border border-[var(--color-border-medium)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)] font-black uppercase text-[10px] tracking-[0.22em] rounded-2xl transition-all"
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
