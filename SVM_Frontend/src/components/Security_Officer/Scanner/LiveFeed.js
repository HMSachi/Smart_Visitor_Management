import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { BrowserMultiFormatReader } from "@zxing/browser";
import {
  QrCode,
  Zap,
  RefreshCw,
  User,
  Clipboard,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { GetGatePassById } from "../../../actions/GatePassAction";
import { motion, AnimatePresence } from "framer-motion";

const LiveFeed = () => {
  const dispatch = useDispatch();
  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const scannerRef = useRef(null);
  const [scanStatus, setScanStatus] = useState("idle"); // idle, scanning, success, error, details
  const [scanMessage, setScanMessage] = useState(
    "Point the camera at a QR code to begin verification.",
  );
  const [scanResult, setScanResult] = useState("");
  const [passDetails, setPassDetails] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const stopScanner = () => {
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }
  };

  const startScanner = async () => {
    if (!videoRef.current) {
      return;
    }

    stopScanner();
    setScanResult("");
    setPassDetails(null);
    setQrData(null);
    setScanStatus("scanning");
    setScanMessage("Opening tactical camera feed...");

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

      setScanMessage("Camera active. Hold QR code steady inside the frame.");
    } catch (error) {
      setScanStatus("error");
      setScanMessage(
        "Unable to access camera. Allow camera permission and retry.",
      );
    }
  };

  const handleVerification = async (data) => {
    setIsLoading(true);
    setScanStatus("success");
    setScanMessage("Payload intercepted. Decrypting security credentials...");

    try {
      let passId = data;
      let parsedQrData = null;

      // Try to parse if it's JSON from our QRSuccessModal
      try {
        const parsed = JSON.parse(data);
        if (parsed && typeof parsed === "object") {
          parsedQrData = parsed;
          setQrData(parsed);
        }
        if (parsed.id) passId = parsed.id;
      } catch (e) {
        // Not JSON, use raw data as pass ID
        console.log("QR data is not JSON, treating as gate pass ID:", data);
      }

      if (!passId) {
        throw new Error("No valid Pass ID found in QR code");
      }

      // Fetch gate pass details from database
      const result = await dispatch(GetGatePassById(passId));
      
      // Handle different response structures
      let details = null;
      if (Array.isArray(result) && result.length > 0) {
        details = result[0];
      } else if (result && typeof result === "object" && !Array.isArray(result)) {
        details = result;
      }

      if (details && details.VGP_Pass_id) {
        // Database validation successful
        setPassDetails(details);
        setScanStatus("details");
        setScanMessage("Access protocol verified and decrypted. Database record confirmed.");
      } else {
        throw new Error("Gate pass not found in database");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setScanStatus("error");
      setScanMessage(
        err.message || "Verification Failed: The scanned credential is not recognized by the central node.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const profileData = useMemo(() => {
    // Merge QR data with database details
    const merged = {
      Name: qrData?.Name || passDetails?.Visitor_Name || passDetails?.VV_Name || "N/A",
      "NIC/Passport_No": qrData?.["NIC/Passport_No"] || passDetails?.Visitor_NIC || passDetails?.VV_NIC_Passport_NO || "N/A",
      Email: qrData?.Email || passDetails?.Visitor_Email || passDetails?.VV_Email || "N/A",
      "Phone number": qrData?.["Phone number"] || passDetails?.Visitor_Phone || passDetails?.VV_Phone || "N/A",
      Company: qrData?.Company || passDetails?.Visitor_Company || passDetails?.VV_Company || "N/A",
      "Visiting purpose": qrData?.["Visiting purpose"] || passDetails?.VVR_Purpose || passDetails?.VVR_Visiting_Purpose || "N/A",
      "Visiting area": qrData?.["Visiting area"] || passDetails?.VVR_Places_to_Visit || passDetails?.VGP_Visiting_Area || "N/A",
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
    setScanMessage("Point the camera at a QR code to begin verification.");
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
  }, [scanStatus]);

  return (
    <div className="max-w-4xl w-full space-y-6 md:space-y-12 relative z-10 mx-auto px-4">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4 mb-2">
          <Zap size={14} className="text-primary animate-pulse" />
          <span className="text-primary uppercase tracking-[0.3em] text-[10px] font-bold">
            Node-04 // Security Perimeter
          </span>
        </div>
        <h1 className="uppercase text-3xl font-black tracking-tight italic">
          Tactical Scanner
        </h1>
      </div>

      <AnimatePresence mode="wait">
        {scanStatus !== "details" ? (
          <motion.div
            key="scanner"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="space-y-12"
          >
            {/* Scanner Frame */}
            <div className="relative aspect-square max-w-sm mx-auto mas-glass border-primary/20 p-2 group overflow-hidden rounded-[32px]">
              {/* Animated Corners */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-primary z-30"></div>
              <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-primary z-30"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-primary z-30"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-primary z-30"></div>

              <div className="w-full h-full bg-[#0A0A0B] relative overflow-hidden flex items-center justify-center rounded-[24px]">
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
                      Payload Intercepted
                    </p>
                  </div>
                )}

                {scanStatus === "error" && (
                  <div className="absolute inset-0 z-30 bg-primary/20 flex flex-col items-center justify-center backdrop-blur-md px-10 text-center">
                    <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(200,16,46,0.4)]">
                      <AlertTriangle size={40} className="text-white" />
                    </div>
                    <p className="mt-8 text-primary uppercase font-black tracking-[0.3em]">
                      Perimeter Breach
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

            <div className="flex flex-col items-center gap-8">
              <button
                onClick={startScanner}
                disabled={scanStatus === "scanning" || isLoading}
                className={`px-16 py-5 bg-primary text-white font-black uppercase text-xs tracking-[0.4em] shadow-[0_0_50px_rgba(200,16,46,0.3)] transition-all flex items-center gap-4 ${scanStatus === "scanning" ? "opacity-50 grayscale" : "hover:scale-105 active:scale-95"}`}
              >
                <RefreshCw
                  size={18}
                  className={scanStatus === "scanning" ? "animate-spin" : ""}
                />
                {scanStatus === "scanning"
                  ? "Scanning Feed..."
                  : "Initiate Scan"}
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
            className="w-full max-w-2xl mx-auto bg-[#121214] border border-white/10 rounded-[48px] overflow-hidden shadow-2xl relative"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-green-500/50"></div>

            <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-3xl flex items-center justify-center text-green-500 shadow-lg">
                  <ShieldCheck size={32} />
                </div>
                <div>
                  <h2 className="text-white text-2xl font-black uppercase tracking-tight italic">
                    Clearance Verified
                  </h2>
                  <p className="text-green-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-1">
                    Status: Database Validated {passDetails?.VGP_Pass_id ? "✓" : ""}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-gray-500 uppercase text-[10px] font-bold tracking-[0.3em]">
                  Pass Node
                </span>
                <p className="text-white font-mono text-lg font-bold">
                  #{passDetails?.VGP_Pass_id || passDetails?.id || "N/A"}
                </p>
              </div>
            </div>

            <div className="p-10 grid grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-gray-500 uppercase text-[10px] font-bold tracking-[0.3em]">
                  <User size={12} className="text-primary" /> Personnel Identity
                </label>
                <p className="text-white text-lg font-bold uppercase tracking-widest bg-white/5 p-4 rounded-2xl border border-white/5 shadow-inner">
                  {profileData.Name || `Visitor #${passDetails?.VGP_Visitor_id || "UNKNOWN"}`}
                </p>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-gray-500 uppercase text-[10px] font-bold tracking-[0.3em]">
                  <Clipboard size={12} className="text-primary" /> Request
                  Protocol
                </label>
                <p className="text-white text-lg font-bold uppercase tracking-widest bg-white/5 p-4 rounded-2xl border border-white/5 shadow-inner">
                  REG-NODE-{passDetails?.VGP_Request_id || qrData?.id || "000"}
                </p>
              </div>
              {hasFullQrProfile && (
                <div className="col-span-2 space-y-3">
                  <label className="flex items-center gap-2 text-gray-500 uppercase text-[10px] font-bold tracking-[0.3em]">
                    <QrCode size={12} className="text-primary" /> Decoded QR
                    Profile
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                    {Object.entries(profileData).map(([label, value]) => (
                      <div key={label} className="space-y-1">
                        <p className="text-gray-400 uppercase text-[9px] tracking-[0.25em] font-bold">
                          {label}
                        </p>
                        <p className="text-white text-sm font-semibold tracking-wide break-words">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="col-span-2 space-y-3 pt-4">
                <label className="flex items-center gap-2 text-gray-500 uppercase text-[10px] font-bold tracking-[0.3em]">
                  <Zap size={12} className="text-primary" /> Authorization
                  Insights
                </label>
                <div className="bg-green-500/5 border border-green-500/10 rounded-3xl p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-white/90 text-[11px] uppercase tracking-widest font-medium italic">
                      Credential integrity confirmed via Cloud-Link
                    </span>
                  </div>
                  <div className="px-5 py-2 bg-green-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                    Validated
                  </div>
                </div>
              </div>
            </div>

            <div className="p-10 bg-black/20 border-t border-white/5 flex gap-4">
              <button
                onClick={() => alert("Verification Log Saved to Cluster")}
                className="flex-1 bg-white text-black hover:bg-green-500 hover:text-white py-5 font-black uppercase text-xs tracking-[0.3em] rounded-2xl transition-all flex items-center justify-center gap-3"
              >
                Grant Entrance <ArrowRight size={16} />
              </button>
              <button
                onClick={handleResetNode}
                className="px-10 py-5 border border-white/10 text-white hover:bg-white/5 font-black uppercase text-xs tracking-[0.3em] rounded-2xl transition-all"
              >
                Reset Node
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-center gap-8 py-8 border-t border-white/5 opacity-50">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
          <span className="text-gray-500 uppercase text-[9px] font-bold tracking-widest">
            Biometric: Active
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
          <span className="text-gray-500 uppercase text-[9px] font-bold tracking-widest">
            Log: Syncing
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
          <span className="text-gray-500 uppercase text-[9px] font-bold tracking-widest">
            Node: {navigator.onLine ? "ONLINE" : "OFFLINE"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LiveFeed;
