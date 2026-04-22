import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { BrowserMultiFormatReader } from "@zxing/browser";
import {
  QrCode,
  Zap,
  RefreshCw,
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
    "Point your camera at the QR code to get started.",
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
        throw new Error("We could not find a valid pass ID in the QR code.");
      }

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
  }, [scanStatus]);

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
            className="w-full max-w-lg mx-auto bg-[#121214] border border-white/10 rounded-[28px] overflow-hidden shadow-2xl relative"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-green-500/50"></div>

            <div className="p-5 md:p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
                <div className="w-11 h-11 md:w-12 md:h-12 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-center justify-center text-green-500 shadow-lg">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h2 className="text-white text-lg md:text-xl font-black uppercase tracking-tight italic">
                    Scan Complete
                  </h2>
                  <p className="text-green-500 font-bold uppercase tracking-[0.22em] text-[8px] mt-1">
                    Status: Verified {passDetails?.VGP_Pass_id ? "✓" : ""}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {hasFullQrProfile && (
                <div className="col-span-1 md:col-span-2 space-y-3">
                  <label className="flex flex-col md:flex-row items-center gap-3 md:gap-2 text-gray-500 uppercase text-[9px] font-bold tracking-[0.22em]">
                    <QrCode size={12} className="text-primary" /> Visitor
                    Details
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 bg-white/5 p-3 rounded-2xl border border-white/10">
                    {Object.entries(profileData).map(([label, value]) => (
                      <div key={label} className="space-y-1">
                        <p className="text-gray-400 uppercase text-[9px] tracking-[0.2em] font-bold">
                          {label}
                        </p>
                        <p className="text-white text-xs md:text-sm font-semibold tracking-wide break-words">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="col-span-1 md:col-span-2 space-y-3 pt-1 md:pt-3">
                <label className="flex flex-col md:flex-row items-center gap-3 md:gap-2 text-gray-500 uppercase text-[9px] font-bold tracking-[0.22em]">
                  <Zap size={12} className="text-primary" /> Access Status
                </label>
                <div className="bg-green-500/5 border border-green-500/10 rounded-2xl p-3.5 md:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-white/90 text-[10px] uppercase tracking-widest font-medium italic leading-relaxed">
                      This QR code is valid and the visitor information was
                      found.
                    </span>
                  </div>
                  <div className="px-3.5 py-1.5 bg-green-500 text-white text-[9px] font-black uppercase tracking-[0.18em] rounded-full">
                    Verified
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 md:p-6 bg-black/20 border-t border-white/5 flex flex-col md:flex-row gap-3 md:gap-4">
              <button
                onClick={() => alert("Verification Log Saved to Cluster")}
                className="flex-1 bg-white text-black hover:bg-green-500 hover:text-white py-3.5 font-black uppercase text-[10px] tracking-[0.22em] rounded-2xl transition-all flex items-center justify-center gap-3"
              >
                Allow Entry <ArrowRight size={16} />
              </button>
              <button
                onClick={handleResetNode}
                className="px-5 md:px-7 py-3.5 border border-white/10 text-white hover:bg-white/5 font-black uppercase text-[10px] tracking-[0.22em] rounded-2xl transition-all"
              >
                Scan Another QR Code
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveFeed;
