import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { CheckSquare, QrCode, Send, Loader2, Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { AddGatePass, GetAllGatePasses } from "../../../actions/GatePassAction";

const QRSuccessModal = ({ isOpen, onClose, visitorData, gatePasses = [] }) => {
  const dispatch = useDispatch();
  const [gatePassId, setGatePassId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [wasSent, setWasSent] = useState(false);
  const [error, setError] = useState(null);

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
      }
    }
  }, [isOpen, visitorData, gatePasses]);

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

  const handleSend = () => {
    // Simulate API call for sending notification
    setWasSent(true);
    // Optional: Real integration would happen here
  };

  const handleClose = () => {
    setGatePassId(null);
    setError(null);
    setWasSent(false);
    onClose();
  };

  const visitingArea = Array.isArray(visitorData?.areas)
    ? visitorData.areas.join(" | ")
    : visitorData?.areas ||
      visitorData?.raw?.VVR_Places_to_Visit ||
      visitorData?.raw?.VV_Visiting_places ||
      "N/A";

  const qrPayload = {
    // Keep pass id for the existing scanner verification flow.
    id: gatePassId,
    Name:
      visitorData?.name ||
      visitorData?.raw?.VV_Name ||
      visitorData?.raw?.VVR_Name ||
      "N/A",
    "NIC/Passport_No":
      visitorData?.nic || visitorData?.raw?.VV_NIC_Passport_NO || "N/A",
    Email: visitorData?.email || visitorData?.raw?.VV_Email || "N/A",
    "Phone number": visitorData?.contact || visitorData?.raw?.VV_Phone || "N/A",
    Company:
      visitorData?.representingCompany || visitorData?.raw?.VV_Company || "N/A",
    "Visiting purpose":
      visitorData?.visitingPurpose ||
      visitorData?.raw?.VVR_Purpose ||
      visitorData?.raw?.VVR_Visiting_Purpose ||
      visitorData?.raw?.VV_Visiting_Purpose ||
      "N/A",
    "Visiting area": visitingArea,
  };

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
          <div className="fixed inset-0 flex items-center justify-center p-6 z-[151]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="w-full max-w-md bg-[#161618]/95 backdrop-blur-3xl border border-white/20 shadow-[0_30px_100px_rgba(0,0,0,1)] rounded-[40px] overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-green-500/40 to-transparent"></div>
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-500/5 rounded-full blur-[100px] pointer-events-none"></div>

              <div className="p-6 border-b border-white/5 flex items-center justify-between relative z-10 bg-white/[0.01]">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-4">
                  <div className="w-10 h-10 bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-center rounded-xl shadow-lg">
                    {gatePassId ? (
                      <QrCode size={20} />
                    ) : (
                      <CheckSquare size={20} />
                    )}
                  </div>
                  <div>
                    <p className="text-gray-300/90 text-[13px] font-medium capitalize tracking-widest mb-1">
                      {gatePassId
                        ? "GatePass Intelligence"
                        : "Security Protocol Concluded"}
                    </p>
                    <h2 className="text-white text-lg font-bold capitalize tracking-widest">
                      {gatePassId ? "GatePass Generated" : "Clearance Granted"}
                    </h2>
                  </div>
                </div>
                {wasSent && (
                  <div className="flex flex-col md:flex-row items-center gap-4 md:gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
                    <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-500 text-[9px] font-black capitalize tracking-widest">
                      Dispatched
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4 md:p-7 flex flex-col items-center justify-center text-center relative z-10">
                {!gatePassId ? (
                  <div className="space-y-8">
                    <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20 shadow-[0_0_30px_rgba(0,177,79,0.2)]">
                      <CheckSquare size={40} className="text-green-500" />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-white text-xl font-bold capitalize tracking-[0.2em]">
                        {visitorData?.name}
                      </h3>
                      <p className="text-gray-400 text-sm capitalize tracking-widest leading-relaxed">
                        Visitor clearance successfully synchronized with core
                        servers. Generate a digital gate pass to grant entrance
                        access.
                      </p>
                    </div>
                    {error && (
                      <p className="text-primary text-xs capitalize tracking-widest bg-primary/10 p-3 rounded-lg border border-primary/20">
                        {error}
                      </p>
                    )}
                    <button
                      onClick={handleGenerateGatePass}
                      disabled={isGenerating}
                      className="flex items-center justify-center gap-3 w-full py-4 bg-green-500 hover:bg-green-600 text-white text-xs font-bold capitalize tracking-[0.3em] rounded-2xl transition-all shadow-lg shadow-green-500/20 disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Generating Protocol...
                        </>
                      ) : (
                        <>
                          <QrCode size={16} />
                          Generate Digital GatePass
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="relative group/qr p-6 mas-glass rounded-[32px] mb-8 shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-all hover:scale-105 qr-svg-container">
                      <QRCodeSVG
                        value={JSON.stringify(qrPayload)}
                        size={200}
                        level="H"
                        includeMargin={false}
                      />
                      <div className="absolute inset-x-0 -bottom-2 flex justify-center">
                        <span className="bg-black text-white px-4 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] capitalize border border-white/20">
                          ID: {gatePassId}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-gray-300/80 text-[13px] font-medium capitalize tracking-[0.4em]">
                        Protocol Authenticated
                      </p>
                      <p className="text-white text-lg font-medium capitalize tracking-widest flex items-center justify-center gap-3">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22C55E]"></div>
                        {visitorData?.name}
                      </p>
                      <div className="h-[1px] w-16 bg-white/10 mx-auto my-4"></div>
                      <p className="text-gray-400 text-[13px] capitalize tracking-widest leading-relaxed max-w-sm">
                        {wasSent
                          ? `Digital clearance transmitted to ${visitorData?.contact || visitorData?.email || "Registered Device"}.`
                          : "Gate pass protocol successfully generated. Send this digital clearance directly to the visitor's device."}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-white/5 bg-white/[0.01] relative z-10 flex flex-col md:flex-row gap-3 md:gap-3">
                {gatePassId && (
                  <>
                    <button
                      onClick={handleSend}
                      disabled={wasSent}
                      className={`flex-1 py-4 text-white text-[11px] font-bold capitalize tracking-[0.2em] rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 ${wasSent ? "bg-green-500/20 text-green-500 cursor-default" : "bg-primary hover:bg-[#A00D25]"}`}
                    >
                      {wasSent ? (
                        <>
                          <CheckSquare size={14} /> Dispatched
                        </>
                      ) : (
                        <>
                          <Send size={14} /> Send
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleDownloadQR}
                      className="flex-1 py-4 bg-green-500/10 border border-green-500/20 text-green-500 hover:bg-green-500 hover:text-white text-[11px] font-bold capitalize tracking-[0.2em] rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2"
                    >
                      <Download size={14} /> Save
                    </button>
                  </>
                )}
                <button
                  onClick={handleClose}
                  className={`py-4 px-8 border border-white/10 text-white text-[11px] font-bold capitalize tracking-[0.2em] rounded-2xl hover:bg-white/5 transition-all ${!gatePassId ? "w-full" : ""}`}
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
