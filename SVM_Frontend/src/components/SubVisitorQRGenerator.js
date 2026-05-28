import React, { useState, useEffect, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download, AlertCircle, ShieldCheck } from "lucide-react";
import PageSpinner from "./common/PageSpinner";
import SubVisitorQRService from "../services/SubVisitorQRService";

const SubVisitorQRGenerator = ({ subVisitorsData, mainVisitorData, requestId, gatePassId }) => {
  const [qrCodes, setQrCodes] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const generateAllQRs = useCallback(async () => {
    if (!subVisitorsData || subVisitorsData.length === 0) {
      setError("No sub-visitors found");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const results = await SubVisitorQRService.GenerateMultipleSubVisitorQRs(
        subVisitorsData,
        mainVisitorData,
        requestId
      );
      setQrCodes(results);
      console.log("[SubVisitorQRGenerator] Generated QRs:", results);
    } catch (err) {
      console.error("[SubVisitorQRGenerator] Error generating QRs:", err);
      setError(err.message || "Failed to generate QR codes");
    } finally {
      setIsGenerating(false);
    }
  }, [subVisitorsData, mainVisitorData, requestId]);

  useEffect(() => {
    generateAllQRs();
  }, [generateAllQRs]);

  const handleDownloadQR = (index) => {
    const qrElement = document.querySelector(`#sub-visitor-qr-${index} svg`);
    if (!qrElement) return;

    const svgData = new XMLSerializer().serializeToString(qrElement);
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
      const subVisitorName = qrCodes[index]?.subVisitorName || `SubVisitor_${index}`;
      downloadLink.download = `SubVisitor_QR_${subVisitorName}_${gatePassId || "Pass"}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handlePrintQR = (index) => {
    const qrElement = document.querySelector(`#sub-visitor-qr-${index}`);
    if (!qrElement) return;

    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(qrElement.innerHTML);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 250);
  };

  if (!subVisitorsData || subVisitorsData.length === 0) {
    return null;
  }

  if (isGenerating) {
    return (
      <div className="w-full max-w-[430px] mx-auto bg-[#161618]/95 backdrop-blur-3xl border border-white/20 shadow-[0_24px_80px_rgba(0,0,0,0.9)] rounded-[32px] overflow-hidden">
        <div className="p-12 flex flex-col items-center justify-center text-center">
          <PageSpinner size={44} color="var(--color-primary)" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[430px] mx-auto bg-[#161618]/95 backdrop-blur-3xl border border-primary/30 shadow-[0_24px_80px_rgba(0,0,0,0.9)] rounded-[32px] overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex items-start gap-4">
            <AlertCircle size={24} className="text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-white font-bold mb-2">Error Generating QR Codes</h3>
              <p className="text-white/70 text-sm mb-4">{error}</p>
              <button
                onClick={generateAllQRs}
                className="px-6 py-2 bg-primary text-white font-bold uppercase text-[10px] tracking-[0.2em] rounded-xl hover:bg-primary/90 transition-all"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (qrCodes.length === 0) {
    return null;
  }

  const currentQR = qrCodes[selectedIndex];
  const currentSubVisitor = subVisitorsData[selectedIndex];

  return (
    <div className="w-full max-w-[760px] mx-auto relative z-10 mt-12">
      {/* Tabs for selecting sub-visitor */}
      <div className="flex gap-2 flex-wrap justify-center mb-6 px-4">
        {qrCodes.map((qr, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            disabled={!qr.success}
            className={`px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all ${
              selectedIndex === index
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                : "bg-white/10 text-white/70 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
            }`}
          >
            {qr.subVisitorName}
            {!qr.success && " ⚠"}
          </button>
        ))}
      </div>

      {/* QR Code Display */}
      {currentQR && currentQR.success ? (
        <div className="w-full max-w-[430px] mx-auto bg-[#161618]/95 backdrop-blur-3xl border border-white/20 shadow-[0_24px_80px_rgba(0,0,0,0.9)] rounded-[32px] overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-green-500/40 to-transparent"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-500/5 rounded-full blur-[100px] pointer-events-none"></div>

          {/* Header */}
          <div className="p-5 border-b border-white/5 flex items-center justify-between relative z-10 bg-white/[0.01]">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-4">
              <div className="w-8 h-8 bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-center rounded-xl shadow-lg">
                <ShieldCheck size={16} />
              </div>
              <div>
                <p className="text-gray-300/90 text-[11px] font-medium capitalize tracking-[0.16em] mb-1">
                  Group Member Pass
                </p>
                <h2 className="text-white text-[15px] font-bold capitalize tracking-[0.14em]">
                  Pass is Ready
                </h2>
              </div>
            </div>
          </div>

          {/* Profile Section */}
          <div className="p-4 md:p-6 flex flex-col items-center justify-center text-center relative z-10">
            {/* Avatar */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black flex-shrink-0 mb-4"
              style={{
                background: "linear-gradient(135deg, rgba(34, 197, 94, 0.25), rgba(34, 197, 94, 0.1))",
                border: "1px solid rgba(34, 197, 94, 0.25)",
                color: "var(--color-success)",
                boxShadow: "0 4px 12px rgba(34, 197, 94, 0.1)",
              }}
            >
              {(currentSubVisitor.name || currentSubVisitor.Visitor_Group_Name || currentSubVisitor.Group_Members || "?")
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>

            {/* Sub-Visitor Name & NIC */}
            <div className="space-y-3 mb-6">
              <p className="text-gray-300/80 text-[11px] font-medium capitalize tracking-[0.3em]">
                Identity Verified ✓
              </p>
              <p className="text-white text-[15px] font-medium capitalize tracking-[0.14em]">
                {currentSubVisitor.name || currentSubVisitor.Visitor_Group_Name || currentSubVisitor.Group_Members || "Sub-Visitor"}
              </p>
              <p className="text-green-600 dark:text-green-400 text-[10px] uppercase tracking-[0.28em] font-bold opacity-80">
                {currentSubVisitor.nic || currentSubVisitor.Visit_Group_NIC_Passport_Number || currentSubVisitor.Members_NIC_Passport_Number || "ID N/A"}
              </p>
              <div className="h-[1px] w-12 bg-white/10 mx-auto my-3"></div>
              <p className="text-gray-400 text-[11px] capitalize tracking-[0.08em] leading-relaxed max-w-[280px]">
                Present this digital pass at the security checkpoint for verification.
              </p>
            </div>

            {/* QR Code Container */}
            <div
              id={`sub-visitor-qr-${selectedIndex}`}
              className="relative group/qr p-4 bg-white rounded-[22px] mb-5 shadow-[0_0_35px_rgba(255,255,255,0.08)] transition-all hover:scale-105 sub-visitor-qr-svg-container"
            >
              <QRCodeSVG
                value={currentQR.qrCode}
                size={220}
                level="M"
                includeMargin
              />
              <div className="absolute inset-x-0 -bottom-2 flex justify-center">
                <span className="bg-black text-white px-3 py-1 rounded-full text-[9px] font-bold tracking-[0.16em] capitalize border border-white/20">
                  Group Pass
                </span>
              </div>
            </div>

            {/* Main Visitor Info Badge */}
            <div className="w-full bg-white/[0.03] border border-white/5 rounded-xl p-3 mb-4">
              <p className="text-[9px] uppercase tracking-[0.2em] font-bold mb-2 text-gray-400">
                Main Visitor
              </p>
              <p className="text-white text-sm font-semibold">
                {mainVisitorData.visitorName || mainVisitorData.VV_Name || "N/A"}
              </p>
              <p className="text-gray-400 text-[10px] mt-1">
                ID: {mainVisitorData.visitorId || mainVisitorData.VV_Visitor_id || "N/A"}
              </p>
            </div>
          </div>

          {/* Access Status Bar */}
          <div
            className="px-6 py-3 flex items-center justify-between transition-colors duration-300"
            style={{ background: "var(--color-surface-1)" }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest font-medium text-gray-400">
               Pass verified — welcome inside
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div
            className="px-4 border-t border-white/5 bg-white/[0.01] relative z-10 flex flex-col md:flex-row gap-3 md:gap-3 p-4"
            style={{
              borderTop: "1px solid var(--color-border-soft)",
            }}
          >
            <button
              onClick={() => handleDownloadQR(selectedIndex)}
              className="flex-1 py-3 bg-green-500/10 border border-green-500/20 text-green-500 hover:bg-green-500 hover:text-white text-[10px] font-bold capitalize tracking-[0.16em] rounded-xl transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <Download size={13} /> Save
            </button>
            <button
              onClick={() => handlePrintQR(selectedIndex)}
              className="py-3 px-6 border border-white/10 text-white text-[10px] font-bold capitalize tracking-[0.16em] rounded-xl hover:bg-white/5 transition-all"
            >
              Print
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-[430px] mx-auto bg-[#161618]/95 backdrop-blur-3xl border border-primary/30 shadow-[0_24px_80px_rgba(0,0,0,0.9)] rounded-[32px] overflow-hidden">
          <div className="p-8 text-center">
            <AlertCircle size={32} className="text-primary mx-auto mb-3" />
            <p className="text-white/70 font-semibold">
              {currentQR?.error || "Failed to generate QR code"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubVisitorQRGenerator;
