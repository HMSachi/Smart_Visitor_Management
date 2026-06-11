import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  ShieldCheck,
  AlertCircle,
  User,
  Calendar,
  MapPin,
} from "lucide-react";
import PageSpinner from "../../../components/common/PageSpinner";
import GatePassService from "../../../services/GatePassService";
import VisitorService from "../../../services/VisitorService";
import VisitorAccessTokenService from "../../../services/VisitorAccessTokenService";
import VisitRequestService from "../../../services/VisitRequestService";
import { encodeSecureQrPayload } from "../../../utils/secureQrPayload";
import { useThemeMode } from "../../../theme/ThemeModeContext";
// import SubVisitorQRGenerator from "../../../components/SubVisitorQRGenerator";

const GatePass = () => {
  const { gatePassId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isToken = new URLSearchParams(location.search).get("isToken") === "true";
  const { themeMode } = useThemeMode();
  const isLight = themeMode === "light";
  const downloadCanvasRef = useRef(null);
  const downloadCanvasWrapperRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const [gatePassData, setGatePassData] = useState(null);
  const [visitorJointData, setVisitorJointData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [encodedQrValue, setEncodedQrValue] = useState("");

  useEffect(() => {
    const fetchGatePassWithJointData = async () => {
      if (!gatePassId) {
        setError("Gate pass ID not found");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        if (isToken) {
          // Retrieve visitor ID from profile session
          const profileStr = localStorage.getItem("visitor_profile");
          let visitorId = null;
          if (profileStr) {
            try {
              const localProfile = JSON.parse(profileStr);
              visitorId = localProfile.VV_Visitor_id || localProfile.Visitor_id;
            } catch (e) {}
          }

          let matchedToken = null;

          if (visitorId) {
            // Find in visitor's tokens first
            const tokenRes = await VisitorAccessTokenService.GetTokenByVisitorId(visitorId);
            const tokenList = tokenRes?.data?.ResultSet || tokenRes?.data || [];
            matchedToken = (Array.isArray(tokenList) ? tokenList : []).find(
              (tk) => String(tk.VVAT_Token || tk.Token) === String(gatePassId)
            );
          }

          if (!matchedToken) {
            // Fallback: search all tokens
            const allTokensRes = await VisitorAccessTokenService.GetAllTokens();
            const allTokensList = allTokensRes?.data?.ResultSet || allTokensRes?.data || [];
            matchedToken = (Array.isArray(allTokensList) ? allTokensList : []).find(
              (tk) => String(tk.VVAT_Token || tk.Token) === String(gatePassId)
            );
          }

          if (matchedToken) {
            const requestId = matchedToken.VVR_Request_id || matchedToken.Request_id;
            const vrResponse = await VisitRequestService.GetVisitRequestById(requestId);
            const requestDetails = vrResponse.data?.ResultSet?.[0] || vrResponse.data;

            if (requestDetails) {
              const formattedData = {
                ...requestDetails,
                VGP_Pass_id: gatePassId, // show token as the pass ID
                VGP_Request_id: requestId,
                VVR_Places_to_Visit: requestDetails.VVR_Places_to_Visit || requestDetails.Places_to_Visit,
                VVR_Visit_Date: requestDetails.VVR_Visit_Date || requestDetails.Visit_Date,
                Visitor_Name: requestDetails.VV_Name || requestDetails.VVR_Visitor_Name || requestDetails.VisitorName || "Visitor",
                Contact_Person_Name: requestDetails.CP_Name || requestDetails.ContactPersonName || "N/A",
                VV_Company: requestDetails.VV_Company || requestDetails.Company || "N/A",
                VGP_Status: matchedToken.VVAT_Status || matchedToken.Status || "A",
              };
              setGatePassData(formattedData);
            } else {
              setError("Visit request details not found for this access token");
            }
          } else {
            setError("Active access token not found or expired");
          }
        } else {
          // Standard gate pass path
          const response = await GatePassService.GetGatePassById(gatePassId);

          if (response?.data?.ResultSet && response.data.ResultSet.length > 0) {
            setGatePassData(response.data.ResultSet[0]);
          } else if (response?.data) {
            setGatePassData(response.data);
          } else {
            setError("Gate pass data not found");
          }
        }
      } catch (err) {
        console.error("Error fetching gate pass:", err);
        setError("Failed to load gate pass details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGatePassWithJointData();
  }, [gatePassId, isToken]);

  // Fetch visitor joint data when we have the request ID
  useEffect(() => {
    const fetchVisitorJoint = async () => {
      if (!gatePassData) {
        console.log("[GatePass] No gatePassData yet, skipping joint fetch");
        return;
      }

      const requestId = gatePassData.VGP_Request_id || gatePassData.VVR_Request_id;
      console.log("[GatePass] Looking for request ID. VGP_Request_id:", gatePassData.VGP_Request_id, "VVR_Request_id:", gatePassData.VVR_Request_id);
      
      if (!requestId) {
        console.log("[GatePass] No request ID available. Full gatePassData keys:", Object.keys(gatePassData));
        console.log("[GatePass] Full gatePassData:", gatePassData);
        return;
      }

      try {
        console.log("[GatePass] Fetching joint visitor data for request ID:", requestId);
        const response = await VisitorService.GetVisitorJoint(requestId);
        console.log("[GatePass] Got response:", response);
        if (response?.data) {
          console.log("[GatePass] Joint visitor data response.data:", response.data);
          setVisitorJointData(response.data);
        } else {
          console.log("[GatePass] Response has no data property. Full response:", response);
        }
      } catch (err) {
        console.warn("[GatePass] Error fetching visitor joint data:", err);
        // Don't treat this as a critical error - gate pass can still work without joint data
      }
    };

    fetchVisitorJoint();
  }, [gatePassData]);

  const visitingArea = useMemo(() => {
    if (!gatePassData) return "N/A";
    return (
      gatePassData.VVR_Places_to_Visit ||
      gatePassData.VGP_Visiting_Area ||
      gatePassData.visitingArea ||
      "N/A"
    );
  }, [gatePassData]);

  const visitorName = useMemo(() => {
    if (!gatePassData) return "Visitor";
    return (
      gatePassData.Visitor_Name ||
      gatePassData.VV_Name ||
      gatePassData.VVR_Name ||
      gatePassData.visitorName ||
      "Visitor"
    );
  }, [gatePassData]);

  const contactPerson = useMemo(() => {
    if (!gatePassData) return "N/A";
    return (
      gatePassData.Contact_Person_Name ||
      gatePassData.CP_Name ||
      gatePassData.contactPersonName ||
      "N/A"
    );
  }, [gatePassData]);

  const visitorCompany = useMemo(() => {
    if (!gatePassData) return "N/A";
    return (
      gatePassData.VV_Company ||
      gatePassData.Company ||
      gatePassData.company ||
      "N/A"
    );
  }, [gatePassData]);

  const formattedDate = useMemo(() => {
    const rawDate =
      gatePassData?.VVR_Visit_Date ||
      gatePassData?.VGP_Issue_Date ||
      gatePassData?.visitDate ||
      gatePassData?.date;
    if (!rawDate) return "N/A";
    
    try {
      const date = new Date(rawDate);
      if (isNaN(date.getTime())) return rawDate;
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }).toUpperCase();
    } catch (e) {
      return rawDate;
    }
  }, [gatePassData]);

  // Extract sub-visitor information from joint data
  const subVisitors = useMemo(() => {
    console.log("[GatePass] subVisitors useMemo triggered. visitorJointData:", visitorJointData);

    if (!visitorJointData) {
      console.log("[GatePass] No visitorJointData available");
      return [];
    }

    // Handle different response structures
    let rows = [];

    if (Array.isArray(visitorJointData)) {
      rows = visitorJointData;
    } else if (visitorJointData.ResultSet && Array.isArray(visitorJointData.ResultSet)) {
      rows = visitorJointData.ResultSet;
    } else if (visitorJointData.data && Array.isArray(visitorJointData.data)) {
      rows = visitorJointData.data;
    } else if (typeof visitorJointData === 'object') {
      rows = [visitorJointData];
    }

    // Deduplicate by NIC so each sub-visitor appears only once.
    const seen = new Set();
    const visitors = [];
    for (const row of rows) {
      const nic = row.Visit_Group_NIC_Passport_Number || row.Members_NIC_Passport_Number || row.nic;
      const name = row.Visitor_Group_Name || row.Group_Members || row.VVG_Visitor_Name || row.name;
      if (!name) continue; // Skip rows with no sub-visitor name
      const key = nic || name;
      if (!seen.has(key)) {
        seen.add(key);
        visitors.push(row);
      }
    }

    console.log("[GatePass] Extracted unique sub-visitors:", visitors);
    return visitors;
  }, [visitorJointData]);

  const qrPayload = useMemo(() => {
    console.log("[GatePass] Building QR Payload. gatePassData:", !!gatePassData, "subVisitors.length:", subVisitors?.length);
    
    if (!gatePassData) {
      console.log("[GatePass] No gatePassData, returning null payload");
      return null;
    }
    
    const payload = {
      id: gatePassId,
      v: 1,
      iat: Date.now(),
    };

    // Add sub-visitor information if available
    if (subVisitors && subVisitors.length > 0) {
      console.log("[GatePass] Adding subVisitors to QR payload. Count:", subVisitors.length);
      const mapped = subVisitors.map((sv) => {
        const mapped_name = sv.Visitor_Group_Name || sv.Group_Members || sv.VVG_Visitor_Name || sv.name || "N/A";
        const mapped_nic = sv.Visit_Group_NIC_Passport_Number || sv.Members_NIC_Passport_Number || sv.VVG_NIC_Passport_Number || sv.nic || "N/A";
        console.log("[GatePass] Mapped to - name:", mapped_name, "nic:", mapped_nic);
        return {
          name: mapped_name,
          nic: mapped_nic,
        };
      });
      payload.subVisitors = mapped;
      console.log("[GatePass] Mapped subVisitors for QR:", mapped);
    } else {
      console.log("[GatePass] No sub-visitors to add. subVisitors is:", subVisitors);
    }

    console.log("[GatePass] FINAL QR Payload before encoding:", payload);
    return payload;
  }, [gatePassData, gatePassId, subVisitors]);

  useEffect(() => {
    const buildSecureQr = async () => {
      console.log("[GatePass] buildSecureQr effect triggered. qrPayload:", qrPayload);
      
      if (!qrPayload) {
        console.log("[GatePass] No qrPayload, skipping encoding");
        setEncodedQrValue("");
        return;
      }

      try {
        console.log("[GatePass] Building secure QR with payload:", qrPayload);
        console.log("[GatePass] Payload has subVisitors:", !!qrPayload.subVisitors, "count:", qrPayload.subVisitors?.length);
        const encoded = await encodeSecureQrPayload(qrPayload);
        console.log(
          "[GatePass] QR encoded successfully, length:",
          encoded.length,
        );
        setEncodedQrValue(encoded);
      } catch (err) {
        console.error("[GatePass] Failed to encode secure QR payload:", err);
        setEncodedQrValue("");
      }
    };

    buildSecureQr();
  }, [qrPayload]);

  // The QR value used for scanning: use the gatePassId directly for best scannability.
  // The encrypted value is a fallback but produces a very dense QR that may be hard to scan.
  const displayQrValue = useMemo(() => {
    if (gatePassId) return String(gatePassId);
    return encodedQrValue || "SVMQR_PENDING";
  }, [gatePassId, encodedQrValue]);

  const handleDownloadQR = useCallback(() => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      // Use the hidden canvas element rendered by QRCodeCanvas for direct PNG export
      // Try direct ref first, then fall back to querying the wrapper div
      let canvas = downloadCanvasRef.current;
      if (!canvas && downloadCanvasWrapperRef.current) {
        canvas = downloadCanvasWrapperRef.current.querySelector("canvas");
      }
      if (!canvas) {
        console.error("[GatePass] Download canvas ref not found");
        setIsDownloading(false);
        return;
      }

      const qrSize = canvas.width; // 400px hidden canvas
      const padding = 48;
      const headerH = 64;
      const footerH = 100;
      const totalW = qrSize + padding * 2;
      const totalH = headerH + qrSize + footerH;

      const out = document.createElement("canvas");
      out.width = totalW;
      out.height = totalH;
      const ctx = out.getContext("2d");

      // --- White background ---
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, totalW, totalH);

      // --- Top red accent bar ---
      ctx.fillStyle = "#C8102E";
      ctx.fillRect(0, 0, totalW, 6);

      // --- Header: MAS Holdings label ---
      ctx.fillStyle = "#888888";
      ctx.font = "bold 13px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("MAS HOLDINGS", totalW / 2, 30);

      ctx.fillStyle = "#111111";
      ctx.font = "bold 18px Arial, sans-serif";
      ctx.fillText("GATE ENTRY PASS", totalW / 2, 54);

      // --- QR code ---
      ctx.drawImage(canvas, padding, headerH, qrSize, qrSize);

      // --- Thin separator ---
      ctx.fillStyle = "#eeeeee";
      ctx.fillRect(padding, headerH + qrSize + 8, qrSize, 1);

      // --- Footer: visitor name + pass no + date ---
      const footerTop = headerH + qrSize + 16;

      ctx.fillStyle = "#C8102E";
      ctx.font = "bold 14px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(String(visitorName || "Visitor").toUpperCase(), totalW / 2, footerTop + 18);

      ctx.fillStyle = "#444444";
      ctx.font = "12px Arial, sans-serif";
      ctx.fillText(`PASS NO: ${gatePassId || "N/A"}`, totalW / 2, footerTop + 38);

      ctx.fillStyle = "#666666";
      ctx.font = "11px Arial, sans-serif";
      ctx.fillText(`VALID DATE: ${formattedDate || "N/A"}`, totalW / 2, footerTop + 56);

      // --- Bottom red bar ---
      ctx.fillStyle = "#C8102E";
      ctx.fillRect(0, totalH - 5, totalW, 5);

      const pngDataUrl = out.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.download = `GatePass_${gatePassId || "Visitor"}.png`;
      link.href = pngDataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("[GatePass] Download failed:", err);
    } finally {
      setIsDownloading(false);
    }
  }, [gatePassId, visitorName, formattedDate, isDownloading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-default)] px-4 md:px-8 pt-28 pb-8 text-[var(--color-text-primary)] flex items-center justify-center">
        <div className="flex items-center justify-center">
          <PageSpinner size={44} color="var(--color-primary)" />
        </div>
      </div>
    );
  }

  if (error || !gatePassData) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-default)] px-4 md:px-8 pt-28 pb-8 text-[var(--color-text-primary)] flex items-center justify-center">
        <div className="max-w-[430px] w-full bg-[var(--color-bg-paper)] border border-[var(--color-border-soft)] rounded-[24px] p-8 text-center shadow-[var(--shadow-card)] animate-fade-in">
          <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-[var(--color-primary-low)] border border-[var(--color-primary-glow)] text-[var(--color-primary)] flex items-center justify-center shadow-lg">
            <AlertCircle size={26} />
          </div>
          <h2 className="text-[16px] font-bold tracking-[0.1em] uppercase text-[var(--color-text-primary)]">
            GatePass Not Available
          </h2>
          <p className="text-[var(--color-text-secondary)] mt-4 text-[12px] tracking-wide leading-relaxed">
            {error ||
              "The requested gate pass could not be located. Please return to My Requests and try again."}
          </p>
          <button
            onClick={() => navigate("/visitor/my-requests")}
            className="mt-8 w-full py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] transition-all shadow-[0_4px_14px_rgba(200,16,46,0.25)]"
          >
            Back to My Requests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-default)] text-[var(--color-text-primary)] px-3 sm:px-4 md:px-8 pt-20 sm:pt-24 md:pt-28 pb-6 md:pb-8 relative overflow-hidden flex flex-col items-center">
      {/* Visual background glows */}
      <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[var(--color-primary-low)] rounded-full blur-[100px] sm:blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-500/5 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none"></div>

      {/* Hidden canvas for reliable PNG download */}
      {qrPayload && (
        <div
          ref={downloadCanvasWrapperRef}
          style={{ position: "fixed", left: "-9999px", top: "-9999px", opacity: 0, pointerEvents: "none", zIndex: -1 }}
          aria-hidden="true"
        >
          <QRCodeCanvas
            ref={downloadCanvasRef}
            value={displayQrValue}
            size={400}
            level="M"
            includeMargin={true}
            bgColor="#ffffff"
            fgColor="#000000"
          />
        </div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[430px] z-10 flex flex-col gap-3 sm:gap-4"
      >
        <button
          onClick={() => navigate("/visitor/my-requests")}
          className="self-start inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-[10px] font-bold uppercase tracking-[0.16em] transition-all py-1"
        >
          <ArrowLeft size={14} /> Back to My Requests
        </button>

        {/* Premium Digital Entry Pass Card */}
        <div className="w-full bg-[var(--color-bg-paper)] border border-[var(--color-border-soft)] shadow-[var(--shadow-elevated)] rounded-[20px] sm:rounded-[24px] overflow-hidden relative group/pass">
          {/* Alternating top security gradient accent */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[var(--color-primary)] via-red-500 to-[var(--color-primary)]"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--color-primary-low)] rounded-full blur-[100px] pointer-events-none"></div>

          {/* Card Header */}
          <div className="px-4 sm:px-5 py-4 sm:py-5 border-b border-[var(--color-border-soft)] bg-white/[0.01] flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[var(--color-primary-low)] border border-[var(--color-primary-glow)] text-[var(--color-primary)] flex items-center justify-center rounded-xl shadow-md flex-shrink-0">
                <ShieldCheck size={15} />
              </div>
              <div>
                <p className="text-[9px] font-bold text-[var(--color-text-secondary)] uppercase tracking-[0.2em] leading-tight">
                  MAS Holdings
                </p>
                <h2 className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.12em] mb-0 text-[var(--color-text-primary)]">
                  Gate Entry Pass
                </h2>
              </div>
            </div>
            <div className="flex-shrink-0">
              <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 bg-green-500/10 border border-green-500/20 text-green-500 text-[8px] sm:text-[9px] font-bold tracking-[0.12em] uppercase rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Active
              </span>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="px-5 sm:px-6 pt-6 pb-5 flex flex-col items-center justify-center text-center relative z-10 border-b border-[var(--color-border-soft)]">
            {qrPayload ? (
              <>
                {/* QR code — pure white, no overlays, maximum scannability */}
                <div className="bg-white rounded-[16px] p-4 shadow-[0_4px_24px_rgba(0,0,0,0.13)] border border-gray-200 inline-block visitor-qr-svg-container">
                  <QRCodeSVG
                    value={displayQrValue}
                    size={200}
                    level="M"
                    includeMargin={false}
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </div>

                {/* Pass No — clearly below QR box */}
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="text-[9px] font-bold text-[var(--color-text-dim)] uppercase tracking-[0.18em]">Pass No.</span>
                  <span className="text-[var(--color-primary)] font-mono font-black text-[11px] tracking-wide break-all">{gatePassId}</span>
                </div>

                {/* Identity label */}
                <div className="mt-3 space-y-0.5">
                  <p className="text-[var(--color-primary)] text-[9px] font-bold uppercase tracking-[0.28em]">
                    Identity Secured ✓
                  </p>
                  <p className="text-[var(--color-text-primary)] text-[15px] sm:text-[16px] font-extrabold uppercase tracking-[0.06em] break-words leading-tight">
                    {visitorName}
                  </p>
                  {visitorCompany !== "N/A" && (
                    <p className="text-[var(--color-text-secondary)] text-[10px] uppercase tracking-[0.14em] font-medium break-words">
                      {visitorCompany}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="py-12 flex flex-col items-center gap-2">
                <AlertCircle size={24} className="text-[var(--color-primary)]" />
                <p className="text-[var(--color-text-secondary)] text-[12px] uppercase tracking-widest font-bold">
                  Unable to generate QR code
                </p>
              </div>
            )}
          </div>

          {/* Details Grid */}
          <div className="px-4 sm:px-6 py-4 sm:py-5 bg-white/[0.002] relative z-10 border-b border-[var(--color-border-soft)] grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-3 sm:gap-y-4 text-left">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-[var(--color-text-dim)] uppercase tracking-[0.16em] block">
                Access Zone
              </span>
              <div className="flex items-start gap-1.5">
                <MapPin size={12} className="text-[var(--color-primary)] shrink-0 mt-0.5" />
                <span className="text-[11px] font-bold text-[var(--color-text-primary)] uppercase tracking-tight break-words leading-tight">
                  {visitingArea}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-bold text-[var(--color-text-dim)] uppercase tracking-[0.16em] block">
                Valid Date
              </span>
              <div className="flex items-center gap-1.5">
                <Calendar size={12} className="text-[var(--color-primary)] shrink-0" />
                <span className="text-[11px] font-bold text-[var(--color-text-primary)] uppercase tracking-tight">
                  {formattedDate}
                </span>
              </div>
            </div>

            <div className="space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[9px] font-bold text-[var(--color-text-dim)] uppercase tracking-[0.16em] block">
                Host / Contact
              </span>
              <div className="flex items-center gap-1.5">
                <User size={12} className="text-[var(--color-primary)] shrink-0" />
                <span className="text-[11px] font-bold text-[var(--color-text-primary)] uppercase tracking-tight break-words">
                  {contactPerson}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="px-4 sm:px-5 py-4 sm:py-5 bg-white/[0.015] relative z-10 flex gap-2 sm:gap-3">
            <button
              onClick={handleDownloadQR}
              disabled={isDownloading || !qrPayload}
              className="flex-1 py-3 sm:py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.16em] rounded-xl transition-all shadow-[0_4px_14px_rgba(200,16,46,0.25)] hover:shadow-[0_6px_20px_rgba(200,16,46,0.35)] flex items-center justify-center gap-1.5 sm:gap-2 border-0 cursor-pointer"
            >
              <Download size={13} />
              {isDownloading ? "Saving..." : "Download Pass"}
            </button>
            <button
              onClick={() => navigate("/visitor/my-requests")}
              className="py-3 px-5 sm:px-8 bg-transparent border border-[var(--color-border-medium)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)] text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.16em] rounded-xl transition-all cursor-pointer whitespace-nowrap"
            >
              Done
            </button>
          </div>

          {/* Bottom Security Strips */}
          <div className="w-full flex h-1.5">
            <div className="flex-1 bg-[var(--color-primary)]" />
            <div className="flex-1 bg-[var(--color-border-soft)]" />
            <div className="flex-1 bg-[var(--color-primary)]" />
            <div className="flex-1 bg-[var(--color-border-soft)]" />
            <div className="flex-1 bg-[var(--color-primary)]" />
          </div>
        </div>
      </motion.div>

      {/* Sub-Visitor QR Codes Section (Commented Out)
      {subVisitors && subVisitors.length > 0 && gatePassData && (
        <div className="mt-12 relative z-10 w-full max-w-[760px]">
          <SubVisitorQRGenerator
            subVisitorsData={subVisitors}
            mainVisitorData={{
              visitorName: visitorName,
              visitorId: gatePassData.Visitor_Id || gatePassData.VV_Visitor_id || gatePassData.Visitor_ID || "N/A",
              Visitor_Name: visitorName,
              company: gatePassData.VV_Company || gatePassData.Company || "N/A",
              contactPersonName: gatePassData.Contact_Person_Name || gatePassData.CP_Name || "N/A",
            }}
            requestId={gatePassData.VGP_Request_id || gatePassData.VVR_Request_id}
            gatePassId={gatePassId}
          />
        </div>
      )}
      */}
    </div>
  );
};

export default GatePass;
