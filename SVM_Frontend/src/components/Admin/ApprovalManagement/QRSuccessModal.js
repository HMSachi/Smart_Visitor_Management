import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { CheckSquare, QrCode, Send, Loader2, Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { AddGatePass, GetAllGatePasses } from "../../../actions/GatePassAction";
import VisitorService from "../../../services/VisitorService";
import VisitorProfileTokenService from "../../../services/VisitorProfileTokenService";
import { encodeSecureQrPayload } from "../../../utils/secureQrPayload";

const QRSuccessModal = ({ isOpen, onClose, visitorData, gatePasses = [], readOnly = false }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.login?.user);
  const [gatePassId, setGatePassId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSendingProfileLink, setIsSendingProfileLink] = useState(false);
  const [wasSent, setWasSent] = useState(false);
  const [error, setError] = useState(null);
  const [profileToken, setProfileToken] = useState(null);
  const [encodedQrValue, setEncodedQrValue] = useState("");
  const [visitorJointData, setVisitorJointData] = useState(null);

  const pUid =
    user?.ResultSet?.[0]?.VA_Name ||
    user?.ResultSet?.[0]?.P_UID ||
    user?.ResultSet?.[0]?.VA_Email ||
    "Admin";

  const markProfileLinkSent = (passId) => {
    setWasSent(true);
    try {
      if (passId && typeof window !== "undefined") {
        window.localStorage.setItem(`svm.gatepass.sent.${passId}`, "1");
      }
    } catch (e) {
      // ignore storage errors
    }
  };

  useEffect(() => {
    if (isOpen) setWasSent(false);
    if (isOpen && visitorData?.id && gatePasses) {
      const list = Array.isArray(gatePasses)
        ? gatePasses
        : gatePasses?.gatePasses || gatePasses?.ResultSet || [];
      const existing = list.find((gp) => {
        const gpRequestId =
          gp.VVR_Request_id ||
          gp.VGP_Request_id ||
          gp.vvr_Request_id ||
          gp.vgp_Request_id;
        return String(gpRequestId) === String(visitorData.id);
      });
      if (existing) {
        setGatePassId(existing.VGP_Pass_id);
        try {
          const key = `svm.gatepass.sent.${existing.VGP_Pass_id}`;
          const sentFlag = typeof window !== 'undefined' && window.localStorage.getItem(key);
          if (sentFlag === '1') setWasSent(true);
          else setWasSent(false);
        } catch (e) {
          setWasSent(false);
        }
      }
    }
  }, [isOpen, visitorData, gatePasses]);

  // Fetch visitor joint data when modal opens
  useEffect(() => {
    const fetchVisitorJoint = async () => {
      if (!isOpen || !visitorData?.id) {
        console.log("[QRSuccessModal] Not fetching joint - isOpen:", isOpen, "visitorData.id:", visitorData?.id);
        return;
      }

      try {
        console.log("[QRSuccessModal] Fetching joint visitor data for request ID:", visitorData.id);
        const response = await VisitorService.GetVisitorJoint(visitorData.id);
        console.log("[QRSuccessModal] Joint visitor data response:", response.data);
        if (response?.data) {
          setVisitorJointData(response.data);
        }
      } catch (err) {
        console.warn("[QRSuccessModal] Error fetching visitor joint data:", err);
        // Non-critical error
      }
    };

    fetchVisitorJoint();
  }, [isOpen, visitorData?.id]);

  const handleGenerateGatePass = async () => {
    if (!visitorData?.raw?.VVR_Visitor_id || !visitorData?.id) return;

    setIsGenerating(true);
    setError(null);
    try {
      const response = await dispatch(
        AddGatePass(visitorData.raw.VVR_Visitor_id, visitorData.id),
      );
      // Extract pass ID from response - assuming payload structure based on API
      const newPassId =
        response?.ResultSet?.[0]?.VGP_Pass_id ||
        response?.VGP_Pass_id ||
        "GP-" + Date.now();
      setGatePassId(newPassId);
      dispatch(GetAllGatePasses());

      try {
        const tokenResponse = await VisitorProfileTokenService.GenerateProfileToken(
          visitorData.raw.VVR_Visitor_id,
          pUid,
        );
        setProfileToken(VisitorProfileTokenService.extractToken(tokenResponse));
        markProfileLinkSent(newPassId);
      } catch (tokenErr) {
        console.error("Profile token notification failed:", tokenErr);
        setError(
          "Gate pass generated, but SMS/email profile link could not be sent.",
        );
      }
    } catch (err) {
      console.error("GatePass generation failed:", err);
      setError("Failed to generate digital gate pass protocol.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadQR = () => {
    const svg = document.querySelector(".qr-svg-container svg");
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
      downloadLink.download = `GatePass_${gatePassId}.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handleSend = async () => {
    if (!visitorData?.raw?.VVR_Visitor_id || wasSent) return;

    setIsSendingProfileLink(true);
    setError(null);
    try {
      const tokenResponse = await VisitorProfileTokenService.GenerateProfileToken(
        visitorData.raw.VVR_Visitor_id,
        pUid,
      );
      setProfileToken(VisitorProfileTokenService.extractToken(tokenResponse));
      markProfileLinkSent(gatePassId);
    } catch (err) {
      console.error("Profile token resend failed:", err);
      setError("Failed to send SMS/email profile link. Please try again.");
    } finally {
      setIsSendingProfileLink(false);
    }
  };

  const handleClose = () => {
    setGatePassId(null);
    setError(null);
    setWasSent(false);
    setProfileToken(null);
    setVisitorJointData(null);
    onClose();
  };

  // Extract sub-visitor information from joint data
  const subVisitors = useMemo(() => {
    if (!visitorJointData) {
      console.log("[QRSuccessModal] No visitorJointData available");
      return [];
    }

    console.log("[QRSuccessModal] Processing visitorJointData:", visitorJointData);

    let visitors = [];

    if (Array.isArray(visitorJointData)) {
      visitors = visitorJointData;
      console.log("[QRSuccessModal] Response is direct array, length:", visitors.length);
    } else if (visitorJointData.ResultSet && Array.isArray(visitorJointData.ResultSet)) {
      visitors = visitorJointData.ResultSet;
      console.log("[QRSuccessModal] Response has ResultSet, length:", visitors.length);
    } else if (visitorJointData.data && Array.isArray(visitorJointData.data)) {
      visitors = visitorJointData.data;
      console.log("[QRSuccessModal] Response has data array, length:", visitors.length);
    } else if (typeof visitorJointData === "object" && !Array.isArray(visitorJointData)) {
      visitors = [visitorJointData];
      console.log("[QRSuccessModal] Response is object, treating as single visitor");
    }

    console.log("[QRSuccessModal] Extracted visitors:", visitors);
    return visitors;
  }, [visitorJointData]);

  const qrPayload = useMemo(() => {
    console.log("[QRSuccessModal] Building QR Payload. gatePassId:", gatePassId, "subVisitors.length:", subVisitors?.length);

    if (!gatePassId) {
      console.log("[QRSuccessModal] No gatePassId, returning null payload");
      return null;
    }

    const payload = {
      id: gatePassId,
      v: 1,
      iat: Date.now(),
    };

    // Add sub-visitor information if available
    if (subVisitors && subVisitors.length > 0) {
      console.log("[QRSuccessModal] Adding subVisitors to QR payload. Count:", subVisitors.length);
      const mapped = subVisitors.map((sv) => {
        console.log("[QRSuccessModal] Processing sub-visitor:", sv);
        const mapped_name = sv.Group_Members || sv.Visitor_Group_Name || sv.VVG_Visitor_Name || sv.name || "N/A";
        const mapped_nic = sv.Members_NIC_Passport_Number || sv.Visit_Group_NIC_Passport_Number || sv.VVG_NIC_Passport_Number || sv.nic || "N/A";
        console.log("[QRSuccessModal] Mapped to - name:", mapped_name, "nic:", mapped_nic);
        return {
          name: mapped_name,
          nic: mapped_nic,
        };
      });
      payload.subVisitors = mapped;
      console.log("[QRSuccessModal] Mapped subVisitors for QR:", mapped);
    } else {
      console.log("[QRSuccessModal] No sub-visitors to add. subVisitors is:", subVisitors);
    }

    console.log("[QRSuccessModal] FINAL QR Payload before encoding:", payload);
    return payload;
  }, [gatePassId, subVisitors]);

  useEffect(() => {
    const buildSecureQr = async () => {
      console.log("[QRSuccessModal] buildSecureQr effect triggered. qrPayload:", qrPayload);

      if (!qrPayload) {
        console.log("[QRSuccessModal] No qrPayload, skipping encoding");
        setEncodedQrValue("");
        return;
      }

      try {
        console.log(
          "[QRSuccessModal] Building secure QR for pass:",
          qrPayload.id,
        );
        console.log("[QRSuccessModal] Payload has subVisitors:", !!qrPayload.subVisitors, "count:", qrPayload.subVisitors?.length);
        const encoded = await encodeSecureQrPayload(qrPayload);
        console.log("[QRSuccessModal] QR encoded successfully. Encoded length:", encoded.length);
        setEncodedQrValue(encoded);
      } catch (err) {
        console.error(
          "[QRSuccessModal] Failed to encode secure QR payload:",
          err,
        );
        setEncodedQrValue("");
      }
    };

    buildSecureQr();
  }, [qrPayload]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[150]"
            onClick={handleClose}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[151] pb-[15vh]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="w-full max-w-sm bg-[#161618]/95 backdrop-blur-3xl border border-white/20 shadow-[0_24px_80px_rgba(0,0,0,0.9)] rounded-[24px] overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-green-500/40 to-transparent"></div>
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-500/5 rounded-full blur-[100px] pointer-events-none"></div>

              <div className="p-4 border-b border-white/5 flex items-center justify-between relative z-10 bg-white/[0.01]">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <div className="w-8 h-8 bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-center rounded-lg shadow-lg">
                    <QrCode size={14} />
                  </div>
                  <div>
                    <p className="text-gray-300/90 text-[10px] font-medium capitalize tracking-[0.16em] mb-0.5">
                      GatePass Intelligence
                    </p>
                    <h2 className="text-white text-[12px] font-medium capitalize tracking-[0.14em]">
                      GatePass Generated
                    </h2>
                  </div>
                </div>
                {wasSent && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
                    <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-500 text-[9px] font-black capitalize tracking-widest">
                      Sent
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col items-center justify-center text-center relative z-10">
                {!gatePassId ? (
                  <div className="space-y-5 w-full">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20 shadow-[0_0_30px_rgba(0,177,79,0.2)]">
                      <CheckSquare size={24} className="text-green-500" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-white text-[12px] font-medium capitalize tracking-widest">
                        {visitorData?.name}
                      </h3>
                      <p className="text-gray-400 text-[12px] capitalize tracking-wide leading-relaxed">
                        Clearance synchronized. Generate pass to grant access.
                      </p>
                    </div>
                    {error && (
                      <p className="text-primary text-[10px] capitalize tracking-widest bg-primary/10 p-3 rounded-lg border border-primary/20">
                        {error}
                      </p>
                    )}
                    <button
                      onClick={handleGenerateGatePass}
                      disabled={isGenerating}
                      className="flex items-center justify-center gap-2 w-full py-2 bg-green-500 hover:bg-green-600 text-white text-[12px] font-medium capitalize tracking-[0.1em] rounded-xl transition-all shadow-md shadow-green-500/20 disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <QrCode size={14} />
                          Generate Digital Pass
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="relative group/qr p-3 mas-glass rounded-[16px] mb-3 shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all hover:scale-105 qr-svg-container">
                      <QRCodeSVG
                        value={encodedQrValue || "SVMQR_PENDING"}
                        size={160}
                        level="H"
                        includeMargin={false}
                      />
                      <div className="absolute inset-x-0 -bottom-2 flex justify-center">
                        <span className="bg-black text-white px-3 py-1 rounded-full text-[10px] font-medium tracking-[0.1em] capitalize border border-white/20">
                          ID: {gatePassId}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-gray-300/80 text-[10px] font-medium capitalize tracking-[0.2em]">
                        Authenticated
                      </p>
                      <p className="text-white text-[12px] font-medium capitalize tracking-widest flex items-center justify-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        {visitorData?.name}
                      </p>
                      <div className="h-[1px] w-12 bg-white/10 mx-auto my-1"></div>
                      <p className="text-gray-400 text-[10px] capitalize tracking-wider leading-relaxed max-w-[280px]">
                        {wasSent
                          ? `SMS and email sent to ${visitorData?.contact || visitorData?.email || "Visitor"}.`
                          : "Present this digital gate pass at the checkpoint."}
                      </p>
                      {profileToken && (
                        <p className="text-green-400/80 text-[9px] tracking-wide max-w-[280px] break-all">
                          Profile link token generated successfully.
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {error && gatePassId && (
                  <p className="mt-4 text-primary text-[10px] capitalize tracking-widest bg-primary/10 p-3 rounded-lg border border-primary/20">
                    {error}
                  </p>
                )}
              </div>

              <div className="p-3 border-t border-white/5 bg-white/[0.01] relative z-10 flex flex-col md:flex-row gap-2">
                {gatePassId && (
                  <>
                    {!readOnly && (
                      <button
                        onClick={handleSend}
                        disabled={wasSent || isSendingProfileLink}
                        className={`flex-1 py-2 text-white text-[11px] font-medium capitalize tracking-[0.1em] rounded-[10px] transition-all shadow-md flex items-center justify-center gap-2 ${wasSent ? "bg-green-500/20 text-green-500 cursor-default" : "bg-primary hover:bg-[#A00D25]"}`}
                      >
                        {wasSent ? (
                          <>
                            <CheckSquare size={13} /> Dispatched
                          </>
                        ) : isSendingProfileLink ? (
                          <>
                            <Loader2 size={13} className="animate-spin" /> Sending
                          </>
                        ) : (
                          <>
                            <Send size={13} /> Send
                          </>
                        )}
                      </button>
                    )}

                    <button
                      onClick={handleDownloadQR}
                      className="flex-1 py-2 bg-green-500/10 border border-green-500/20 text-green-500 hover:bg-green-500 hover:text-white text-[11px] font-medium capitalize tracking-[0.1em] rounded-[10px] transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <Download size={13} /> Save
                    </button>
                  </>
                )}
                <button
                  onClick={handleClose}
                  className={`py-2 px-6 border border-white/10 text-white text-[11px] font-medium capitalize tracking-[0.1em] rounded-[10px] hover:bg-white/5 transition-all ${!gatePassId ? "w-full" : ""}`}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QRSuccessModal;
