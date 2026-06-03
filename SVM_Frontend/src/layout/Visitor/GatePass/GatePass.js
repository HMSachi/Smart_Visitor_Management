import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  ShieldCheck,
  AlertCircle,
  User,
  Calendar,
  MapPin,
  Briefcase,
} from "lucide-react";
import PageSpinner from "../../../components/common/PageSpinner";
import GatePassService from "../../../services/GatePassService";
import VisitorService from "../../../services/VisitorService";
import { encodeSecureQrPayload } from "../../../utils/secureQrPayload";
import { useThemeMode } from "../../../theme/ThemeModeContext";
// import SubVisitorQRGenerator from "../../../components/SubVisitorQRGenerator";

const GatePass = () => {
  const { gatePassId } = useParams();
  const navigate = useNavigate();
  const { themeMode } = useThemeMode();
  const isLight = themeMode === "light";
  
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
        const response = await GatePassService.GetGatePassById(gatePassId);

        if (response?.data?.ResultSet && response.data.ResultSet.length > 0) {
          setGatePassData(response.data.ResultSet[0]);
        } else if (response?.data) {
          setGatePassData(response.data);
        } else {
          setError("Gate pass data not found");
        }
      } catch (err) {
        console.error("Error fetching gate pass:", err);
        setError("Failed to load gate pass. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGatePassWithJointData();
  }, [gatePassId]);

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

  const handleDownloadQR = () => {
    const svg = document.querySelector(".visitor-qr-svg-container svg");
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
      downloadLink.download = `GatePass_${gatePassId || "Visitor"}.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

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
    <div className="min-h-screen bg-[var(--color-bg-default)] text-[var(--color-text-primary)] px-4 md:px-8 pt-24 md:pt-28 pb-6 md:pb-8 relative overflow-hidden flex flex-col items-center">
      {/* Visual background glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-primary-low)] rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[430px] z-10 flex flex-col gap-4"
      >
        <button
          onClick={() => navigate("/visitor/my-requests")}
          className="self-start inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-[10px] font-bold uppercase tracking-[0.16em] transition-all"
        >
          <ArrowLeft size={14} /> Back to My Requests
        </button>

        {/* Premium Digital Entry Pass Card */}
        <div className="w-full bg-[var(--color-bg-paper)] border border-[var(--color-border-soft)] shadow-[var(--shadow-elevated)] rounded-[24px] overflow-hidden relative group/pass">
          {/* Alternating top security gradient accent */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[var(--color-primary)] via-red-500 to-[var(--color-primary)]"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--color-primary-low)] rounded-full blur-[100px] pointer-events-none"></div>

          {/* Card Header */}
          <div className="p-5 border-b border-[var(--color-border-soft)] bg-white/[0.01] flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[var(--color-primary-low)] border border-[var(--color-primary-glow)] text-[var(--color-primary)] flex items-center justify-center rounded-xl shadow-md">
                <ShieldCheck size={16} />
              </div>
              <div>
                <p className="text-[9px] font-bold text-[var(--color-text-secondary)] uppercase tracking-[0.2em] leading-tight">
                  MAS Holdings
                </p>
                <h2 className="text-[13px] font-bold uppercase tracking-[0.12em] mb-0 text-[var(--color-text-primary)]">
                  Gate Entry Pass
                </h2>
              </div>
            </div>
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-green-500/10 border border-green-500/20 text-green-500 text-[9px] font-bold tracking-[0.12em] uppercase rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Active
              </span>
            </div>
          </div>

          {/* QR Code and Scan Animation */}
          <div className="p-6 flex flex-col items-center justify-center text-center relative z-10 border-b border-[var(--color-border-soft)] bg-white/[0.005]">
            {qrPayload ? (
              <>
                <div className="relative group/qr p-4 bg-white rounded-[20px] mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-[var(--color-border-soft)] transition-all duration-300 hover:scale-102 visitor-qr-svg-container">
                  <QRCodeSVG
                    value={encodedQrValue || "SVMQR_PENDING"}
                    size={164}
                    level="H"
                    includeMargin={false}
                  />
                  
                  {/* Digital Tech Scan Line Animation */}
                  <motion.div 
                    animate={{ top: ['0%', '100%'], opacity: [0, 0.8, 0.8, 0] }}
                    transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                    className="absolute left-0 w-full h-[2px] bg-[var(--color-primary)] z-20 shadow-[0_0_8px_var(--color-primary)]" 
                  />

                  {/* Pass ID Pill Badge */}
                  <div className="absolute inset-x-0 -bottom-3 flex justify-center">
                    <span className="bg-[var(--color-bg-alt)] text-[var(--color-text-primary)] px-3.5 py-1 rounded-full text-[9px] font-bold tracking-[0.16em] uppercase border border-[var(--color-border-soft)] shadow-md">
                      PASS NO. <span className="text-[var(--color-primary)] font-mono font-black">{gatePassId}</span>
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-1">
                  <p className="text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-[0.25em]">
                    Identity Secured ✓
                  </p>
                  <p className="text-[var(--color-text-primary)] text-[15px] font-extrabold uppercase tracking-[0.08em]">
                    {visitorName}
                  </p>
                  {visitorCompany !== "N/A" && (
                    <p className="text-[var(--color-text-secondary)] text-[10px] uppercase tracking-[0.15em] font-medium">
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
          <div className="px-6 py-5 bg-white/[0.002] relative z-10 border-b border-[var(--color-border-soft)] grid grid-cols-2 gap-x-6 gap-y-4 text-left">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-[var(--color-text-dim)] uppercase tracking-[0.16em] block">
                Access Zone
              </span>
              <div className="flex items-center gap-1.5">
                <MapPin size={12} className="text-[var(--color-primary)] shrink-0" />
                <span className="text-[11px] font-bold text-[var(--color-text-primary)] uppercase tracking-tight truncate">
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

            <div className="space-y-1">
              <span className="text-[9px] font-bold text-[var(--color-text-dim)] uppercase tracking-[0.16em] block">
                Host / Contact
              </span>
              <div className="flex items-center gap-1.5">
                <User size={12} className="text-[var(--color-primary)] shrink-0" />
                <span className="text-[11px] font-bold text-[var(--color-text-primary)] uppercase tracking-tight truncate">
                  {contactPerson}
                </span>
              </div>
            </div>


          </div>

          {/* Action buttons */}
          <div className="p-5 bg-white/[0.015] relative z-10 flex gap-3">
            <button
              onClick={handleDownloadQR}
              className="flex-1 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-[11px] font-bold uppercase tracking-[0.16em] rounded-xl transition-all shadow-[0_4px_14px_rgba(200,16,46,0.25)] hover:shadow-[0_6px_20px_rgba(200,16,46,0.35)] flex items-center justify-center gap-2 border-0 cursor-pointer"
            >
              <Download size={14} /> Download Pass
            </button>
            <button
              onClick={() => navigate("/visitor/my-requests")}
              className="py-3 px-8 bg-transparent border border-[var(--color-border-medium)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)] text-[11px] font-bold uppercase tracking-[0.16em] rounded-xl transition-all cursor-pointer"
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
