import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  Download,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";
import GatePassService from "../../../services/GatePassService";

const GatePass = () => {
  const { gatePassId } = useParams();
  const navigate = useNavigate();
  const [gatePassData, setGatePassData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGatePass = async () => {
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

    fetchGatePass();
  }, [gatePassId]);

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

  const qrPayload = useMemo(() => {
    if (!gatePassData) return null;
    return {
      id: gatePassId,
      Name: visitorName,
      "NIC/Passport_No":
        gatePassData.Visitor_NIC ||
        gatePassData.VV_NIC_Passport_NO ||
        gatePassData.nicPassport ||
        "N/A",
      Email:
        gatePassData.Visitor_Email ||
        gatePassData.VV_Email ||
        gatePassData.email ||
        "N/A",
      "Phone number":
        gatePassData.Visitor_Phone ||
        gatePassData.VV_Phone ||
        gatePassData.phone ||
        "N/A",
      Company:
        gatePassData.Visitor_Company ||
        gatePassData.VV_Company ||
        gatePassData.company ||
        "N/A",
      "Visiting purpose":
        gatePassData.VVR_Purpose ||
        gatePassData.VVR_Visiting_Purpose ||
        gatePassData.visitingPurpose ||
        "N/A",
      "Visiting area": visitingArea,
    };
  }, [gatePassData, gatePassId, visitorName, visitingArea]);

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
      <div className="min-h-screen bg-[var(--color-bg-default)] px-4 md:px-8 pt-28 pb-8 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-xs">
            Hang tight, we’re preparing your gate pass.
          </p>
        </div>
      </div>
    );
  }

  if (error || !gatePassData) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-default)] px-4 md:px-8 pt-28 pb-8 text-white">
        <div className="max-w-3xl mx-auto bg-black/20 border border-white/10 rounded-[28px] p-8 md:p-12 text-center">
          <div className="w-14 h-14 mx-auto mb-6 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
            <AlertCircle size={26} />
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-[0.08em] uppercase">
            GatePass Not Available
          </h2>
          <p className="text-gray-400 mt-4 text-sm tracking-wide">
            {error ||
              "The requested gate pass could not be located. Please return to My Requests and try again."}
          </p>
          <button
            onClick={() => navigate("/visitor/my-requests")}
            className="mt-8 px-6 py-3 bg-primary hover:bg-[var(--color-primary-hover)] text-white rounded-xl text-xs font-bold uppercase tracking-[0.2em]"
          >
            Back to My Requests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-default)] text-white px-4 md:px-8 pt-24 md:pt-28 pb-6 md:pb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-[760px] mx-auto relative z-10">
        <button
          onClick={() => navigate("/visitor/my-requests")}
          className="mb-4 inline-flex flex-col md:flex-row items-center gap-3 md:gap-2 text-gray-300 hover:text-white text-[11px] font-bold uppercase tracking-[0.16em]"
        >
          <ArrowLeft size={14} /> Back to My Requests
        </button>

        <div className="w-full max-w-[430px] mx-auto bg-[#161618]/95 backdrop-blur-3xl border border-white/20 shadow-[0_24px_80px_rgba(0,0,0,0.9)] rounded-[32px] overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-green-500/40 to-transparent"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-500/5 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="p-5 border-b border-white/5 flex items-center justify-between relative z-10 bg-white/[0.01]">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-4">
              <div className="w-8 h-8 bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-center rounded-xl shadow-lg">
                <ShieldCheck size={16} />
              </div>
              <div>
                <p className="text-gray-300/90 text-[11px] font-medium capitalize tracking-[0.16em] mb-1">
                  GatePass Intelligence
                </p>
                <h2 className="text-white text-[15px] font-bold capitalize tracking-[0.14em]">
                  GatePass Generated
                </h2>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6 flex flex-col items-center justify-center text-center relative z-10">
            {qrPayload ? (
              <>
                <div className="relative group/qr p-4 mas-glass rounded-[22px] mb-5 shadow-[0_0_35px_rgba(255,255,255,0.08)] transition-all hover:scale-105 visitor-qr-svg-container">
                  <QRCodeSVG
                    value={JSON.stringify(qrPayload)}
                    size={156}
                    level="H"
                    includeMargin={false}
                  />
                  <div className="absolute inset-x-0 -bottom-2 flex justify-center">
                    <span className="bg-black text-white px-3 py-1 rounded-full text-[9px] font-bold tracking-[0.16em] capitalize border border-white/20">
                      ID: {gatePassId}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-gray-300/80 text-[11px] font-medium capitalize tracking-[0.3em]">
                    Protocol Authenticated
                  </p>
                  <p className="text-white text-[15px] font-medium capitalize tracking-[0.14em]">
                    {visitorName}
                  </p>
                  <div className="h-[1px] w-12 bg-white/10 mx-auto my-3"></div>
                  <p className="text-gray-400 text-[11px] capitalize tracking-[0.08em] leading-relaxed max-w-[280px]">
                    Present this digital gate pass at the security checkpoint
                    for verification.
                  </p>
                </div>
              </>
            ) : (
              <div className="py-12">
                <p className="text-gray-400 text-sm">
                  Unable to generate QR code
                </p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/5 bg-white/[0.01] relative z-10 flex flex-col md:flex-row gap-3 md:gap-3">
            <button
              onClick={handleDownloadQR}
              className="flex-1 py-3 bg-green-500/10 border border-green-500/20 text-green-500 hover:bg-green-500 hover:text-white text-[10px] font-bold capitalize tracking-[0.16em] rounded-xl transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <Download size={13} /> Save
            </button>
            <button
              onClick={() => navigate("/visitor/my-requests")}
              className="py-3 px-6 border border-white/10 text-white text-[10px] font-bold capitalize tracking-[0.16em] rounded-xl hover:bg-white/5 transition-all"
            >
              Conclude
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GatePass;
