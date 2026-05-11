import React, { useState, useCallback } from "react";
import {
  User,
  Briefcase,
  Calendar,
  MapPin,
  Car,
  Users,
  Hash,
  Mail,
  Phone,
  Package,
  Info,
  AlertCircle,
  QrCode,
  Download,
  Loader2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { useThemeMode } from "../../theme/ThemeModeContext";
import SubVisitorQRService from "../../services/SubVisitorQRService";

/* ─── Shared sub-components ─── */

const SplitSection = ({ title, icon: Icon, isLight, children }) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-2">
      <div className="w-[3px] h-3.5 bg-primary rounded-full" />
      <div className="flex items-center gap-1.5">
        {Icon && <Icon size={13} className="text-primary/70" />}
        <h3
          className={`text-[13px] font-medium capitalize tracking-tight ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
        >
          {title}
        </h3>
      </div>
    </div>
    <div className="w-full">{children}</div>
  </div>
);

const SectionCard = ({ children, isLight, darkClassName = "" }) => (
  <div
    className={`rounded-[12px] border overflow-hidden ${isLight ? "bg-white border-gray-200" : `bg-black/25 border-white/10 ${darkClassName}`}`}
  >
    {children}
  </div>
);

const Field = ({ label, value, icon: Icon, isLight }) => (
  <div className="group/field flex flex-col gap-0.5">
    <div className="flex items-center gap-1.5 px-0.5">
      {Icon && (
        <Icon
          size={11}
          className="text-primary/50 group-hover/field:text-primary transition-colors"
        />
      )}
      <label
        className={`text-[12px] font-medium capitalize tracking-tight ${isLight ? "text-gray-500" : "text-white/40"}`}
      >
        {label}
      </label>
    </div>
    <div
      className={`px-3 py-1 rounded-lg border transition-all duration-300 ${isLight ? "bg-gray-50/30 border-gray-100 text-[#1A1A1A]" : "bg-black/20 border-white/5 text-white"}`}
    >
      <p className="text-[12px] font-medium tracking-tight">
        {value || "No data"}
      </p>
    </div>
  </div>
);

/* ─── Main component ─── */

const ContactPersonAuthProtocol = ({
  visitor,
  groupMembers = [],
  itemsCarried = [],
  vehiclesList = [],
  jointItems = [],
  gatePasses = [],
}) => {
  const { themeMode } = useThemeMode();
  const isLight = themeMode === "light";

  // Check whether the main visitor has a gate pass (mirrors VisitorTable logic)
  const hasGatePass = () => {
    if (!visitor?.id) return false;
    const list = Array.isArray(gatePasses)
      ? gatePasses
      : gatePasses?.gatePasses || gatePasses?.ResultSet || [];
    return list.some((gp) => {
      const gpRequestId =
        gp.VVR_Request_id ||
        gp.VGP_Request_id ||
        gp.vvr_Request_id ||
        gp.vgp_Request_id;
      return String(gpRequestId) === String(visitor.id);
    });
  };

  // QR popup state
  const [popupQR, setPopupQR] = useState({
    open: false,
    member: null,
    idx: null,
    loading: false,
    qrCode: null,
    error: null,
  });
  const [qrCache, setQrCache] = useState({});

  const handleOpenSubVisitorQR = useCallback(
    async (member, idx) => {
      const cached = qrCache[idx];
      if (cached) {
        setPopupQR({
          open: true,
          member,
          idx,
          loading: false,
          qrCode: cached,
          error: null,
        });
        return;
      }
      setPopupQR({
        open: true,
        member,
        idx,
        loading: true,
        qrCode: null,
        error: null,
      });
      try {
        const subVisitorData = { name: member.fullName, nic: member.nic };
        const mainVisitorData = {
          visitorName: visitor.name || visitor.fullName,
          visitorId: visitor.raw?.VVR_Visitor_id || visitor.id,
          VV_Name: visitor.name || visitor.fullName,
          VV_Visitor_id: visitor.raw?.VVR_Visitor_id,
        };
        const qrCode = await SubVisitorQRService.GenerateSubVisitorQR(
          subVisitorData,
          mainVisitorData,
          visitor.id,
        );
        setQrCache((prev) => ({ ...prev, [idx]: qrCode }));
        setPopupQR((prev) => ({
          ...prev,
          loading: false,
          qrCode,
          error: null,
        }));
      } catch (err) {
        setPopupQR((prev) => ({
          ...prev,
          loading: false,
          error: err.message || "Failed to generate QR",
        }));
      }
    },
    [qrCache, visitor],
  );

  const handleClosePopup = () =>
    setPopupQR({
      open: false,
      member: null,
      idx: null,
      loading: false,
      qrCode: null,
      error: null,
    });

  const handleDownloadSubQR = (memberName) => {
    const svgEl = document.querySelector("#cp-sub-qr-popup svg");
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const link = document.createElement("a");
      link.download = `SubVisitor_QR_${memberName || "pass"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  if (!visitor) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-0 w-full px-0 space-y-1.5"
    >
      {/* ── 1. Visitor Details + embedded Items Carried ── */}
      <div className="mb-8">
        <SectionCard isLight={isLight}>
          <div className="p-4 md:p-5">
            <SplitSection title="Visitor details" icon={User} isLight={isLight}>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                <Field
                  label="Full name"
                  value={visitor.name || visitor.fullName}
                  icon={User}
                  isLight={isLight}
                />
                <Field
                  label="NIC"
                  value={visitor.nic}
                  icon={Hash}
                  isLight={isLight}
                />
                <Field
                  label="Phone number"
                  value={visitor.contact || visitor.phoneNumber}
                  icon={Phone}
                  isLight={isLight}
                />
                <Field
                  label="Email address"
                  value={visitor.email || visitor.emailAddress}
                  icon={Mail}
                  isLight={isLight}
                />
              </div>

              {/* Items carried by the main visitor — embedded subsection */}
              <div
                className={`mt-4 pt-4 border-t ${isLight ? "border-gray-100" : "border-white/10"}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Package size={13} className="text-primary/70" />
                  <p
                    className={`capitalize text-[12px] font-medium tracking-tight ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
                  >
                    Items carried
                  </p>
                </div>
                {itemsCarried && itemsCarried.length > 0 ? (
                  <div
                    className={`border rounded-lg overflow-hidden ${isLight ? "border-gray-100" : "border-white/10"}`}
                  >
                    <div
                      className={`flex justify-between items-center px-3 py-1.5 border-b ${isLight ? "bg-gray-50 border-gray-100" : "bg-white/5 border-white/10"}`}
                    >
                      <span
                        className={`text-[12px] font-medium capitalize tracking-tight flex-[2] ${isLight ? "text-gray-400" : "text-gray-400"}`}
                      >
                        Item name
                      </span>
                      <span
                        className={`text-[12px] font-medium capitalize tracking-tight w-16 text-center ${isLight ? "text-gray-400" : "text-gray-400"}`}
                      >
                        Qty
                      </span>
                      <span
                        className={`text-[12px] font-medium capitalize tracking-tight flex-[3] sm:text-right ${isLight ? "text-gray-400" : "text-gray-400"}`}
                      >
                        Description
                      </span>
                    </div>
                    <div
                      className={`divide-y overflow-y-auto max-h-[200px] ${isLight ? "divide-gray-50/50" : "divide-white/5"}`}
                    >
                      {itemsCarried.map((item, idx) => (
                        <div
                          key={item.id || idx}
                          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-1.5 ${isLight ? (idx % 2 === 0 ? "bg-white" : "bg-gray-50/30") : idx % 2 === 0 ? "bg-transparent" : "bg-white/5"}`}
                        >
                          <span
                            className={`text-[12px] font-medium flex-[2] truncate ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
                          >
                            {item.itemName}
                          </span>
                          <div className="w-16 flex justify-center">
                            <span
                              className={`text-[12px] font-medium px-2 py-0.5 rounded tracking-wide ${isLight ? "text-primary bg-primary/5" : "text-white bg-white/10"}`}
                            >
                              x{item.quantity ? item.quantity : 1}
                            </span>
                          </div>
                          <span
                            className={`text-[12px] font-medium flex-[3] sm:text-right truncate ${isLight ? "text-gray-500" : "text-gray-400"}`}
                          >
                            {item.description || "-"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div
                    className={`border border-dashed rounded-xl p-3 text-center ${isLight ? "border-gray-200" : "border-white/10"}`}
                  >
                    <p
                      className={`text-[10px] font-semibold capitalize tracking-[0.16em] ${isLight ? "text-gray-400" : "text-gray-500"}`}
                    >
                      No items declared by the primary visitor
                    </p>
                  </div>
                )}
              </div>
            </SplitSection>
          </div>
        </SectionCard>
      </div>

      {/* ── 2. Visit Details ── */}
      <SectionCard isLight={isLight}>
        <div className="p-3 md:p-5">
          <SplitSection
            title="Visit details"
            icon={Briefcase}
            isLight={isLight}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <Field
                label="Visit date"
                value={visitor.date || visitor.proposedVisitDate}
                icon={Calendar}
                isLight={isLight}
              />
              <Field
                label="Reason for visit"
                value={visitor.purpose || visitor.purposeOfVisitation}
                icon={Info}
                isLight={isLight}
              />
              <Field
                label="Company"
                value={visitor.representingCompany}
                icon={Briefcase}
                isLight={isLight}
              />
              <Field
                label="Visitor type"
                value={visitor.visitorClassification}
                icon={Users}
                isLight={isLight}
              />
            </div>
          </SplitSection>
        </div>
      </SectionCard>

      {/* ── 3. Places to Visit ── */}
      <SectionCard isLight={isLight}>
        <div className="p-3 md:p-5">
          <SplitSection title="Places to visit" icon={MapPin} isLight={isLight}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
              {(visitor.areas || visitor.selectedAreas) &&
                (visitor.areas || visitor.selectedAreas).length > 0 ? (
                (visitor.areas || visitor.selectedAreas).map((area, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{
                      scale: 1.02,
                      borderColor: "var(--color-primary)",
                    }}
                    className={`px-4 py-2.5 border rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm group/zone ${isLight ? "bg-gray-50 border-gray-100 text-[#1A1A1A]" : "bg-black/40 border-white/10 text-white"}`}
                  >
                    <MapPin
                      size={12}
                      className="text-primary/50 group-hover/zone:text-primary transition-colors"
                    />
                    {area}
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full border border-dashed rounded-xl p-4 text-center border-white/10">
                  <p
                    className={`text-[9px] font-bold uppercase tracking-[0.18em] ${isLight ? "text-gray-400" : "text-gray-500"}`}
                  >
                    No places selected
                  </p>
                </div>
              )}
            </div>
          </SplitSection>
        </div>
      </SectionCard>

      {/* ── 4. Vehicle Registry (conditional) ── */}
      {vehiclesList && vehiclesList.length > 0 && (
        <SectionCard isLight={isLight}>
          <div className="p-3 md:p-4">
            <SplitSection title="Vehicle registry" icon={Car} isLight={isLight}>
              <div
                className={`border rounded-lg overflow-hidden ${isLight ? "border-gray-100" : "border-white/10"}`}
              >
                <div
                  className={`flex justify-between items-center px-3 py-1.5 border-b ${isLight ? "bg-gray-50 border-gray-100" : "bg-white/5 border-white/10"}`}
                >
                  <span
                    className={`text-[12px] font-medium capitalize tracking-tight flex-1 ${isLight ? "text-gray-400" : "text-gray-400"}`}
                  >
                    Vehicle type
                  </span>
                  <span
                    className={`text-[12px] font-medium capitalize tracking-tight flex-1 sm:text-right ${isLight ? "text-gray-400" : "text-gray-400"}`}
                  >
                    Vehicle number
                  </span>
                </div>
                <div
                  className={`divide-y overflow-y-auto max-h-[200px] custom-scrollbar ${isLight ? "divide-gray-50/50" : "divide-white/5"}`}
                >
                  {vehiclesList.map((vehicle, idx) => (
                    <div
                      key={vehicle.id || idx}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-1.5 ${isLight ? (idx % 2 === 0 ? "bg-white" : "bg-gray-50/30") : idx % 2 === 0 ? "bg-transparent" : "bg-white/5"}`}
                    >
                      <span
                        className={`text-[12px] font-medium capitalize flex-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}
                      >
                        {vehicle.vehicleType}
                      </span>
                      <span
                        className={`text-[12px] font-medium flex-1 sm:text-right ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
                      >
                        {vehicle.plateNumber}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </SplitSection>
          </div>
        </SectionCard>
      )}

      {/* ── 5. Visiting People with QR buttons (conditional) ── */}
      {groupMembers && groupMembers.length > 0 && (
        <SectionCard isLight={isLight}>
          <div className="p-2 md:p-3">
            <SplitSection
              title="Visiting people"
              icon={Users}
              isLight={isLight}
            >
              <div
                className={`border rounded-lg overflow-hidden ${isLight ? "border-gray-100" : "border-white/10"}`}
              >
                <div
                  className={`flex justify-between items-center px-3 py-1.5 border-b ${isLight ? "bg-gray-50 border-gray-100" : "bg-white/5 border-white/10"}`}
                >
                  <span
                    className={`text-[12px] font-medium capitalize tracking-tight flex-1 ${isLight ? "text-gray-400" : "text-gray-400"}`}
                  >
                    Name
                  </span>
                  <span
                    className={`text-[12px] font-medium capitalize tracking-tight flex-1 sm:text-center ${isLight ? "text-gray-400" : "text-gray-400"}`}
                  >
                    NIC
                  </span>
                  <span
                    className={`text-[12px] font-medium capitalize tracking-tight flex-1 sm:text-center ${isLight ? "text-gray-400" : "text-gray-400"}`}
                  >
                    Contact
                  </span>
                  {/* <span className={`text-[12px] font-medium capitalize tracking-tight w-12 text-center ${isLight ? 'text-gray-400' : 'text-gray-400'}`}>QR</span> */}
                </div>
                <div
                  className={`divide-y overflow-y-auto max-h-[200px] custom-scrollbar ${isLight ? "divide-gray-50/50" : "divide-white/5"}`}
                >
                  {groupMembers.map((member, idx) => (
                    <div
                      key={member.id || idx}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 px-3 py-1 ${isLight ? (idx % 2 === 0 ? "bg-white" : "bg-gray-50/30") : idx % 2 === 0 ? "bg-transparent" : "bg-white/5"}`}
                    >
                      <span
                        className={`text-[12px] font-medium flex-1 ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
                      >
                        {member.fullName}
                      </span>
                      <span
                        className={`text-[12px] font-medium capitalize flex-1 sm:text-center ${isLight ? "text-gray-600" : "text-gray-400"}`}
                      >
                        {member.nic}
                      </span>
                      <span
                        className={`text-[12px] font-medium flex-1 sm:text-center ${isLight ? "text-gray-600" : "text-gray-400"}`}
                      >
                        {member.contact || "-"}
                      </span>
                      {/* <div className="w-12 flex justify-center">
                        {hasGatePass() && (
                          <button
                            onClick={() => handleOpenSubVisitorQR(member, idx)}
                            title="View QR code"
                            className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all border ${isLight ? "bg-white border-gray-100 text-gray-500 hover:border-primary/40 hover:text-primary" : "bg-white/5 border-white/10 text-white/40 hover:border-primary/40 hover:text-primary"}`}
                          >
                            <QrCode size={13} />
                          </button>
                        )}
                      </div> */}
                    </div>
                  ))}
                </div>
              </div>
            </SplitSection>
          </div>
        </SectionCard>
      )}

      {/* 
      {jointItems && jointItems.length > 0 && (
        <div className="mb-2">
          <SectionCard
            isLight={isLight}
            darkClassName="bg-[var(--color-bg-default)]"
          >
            <div className="p-2 md:p-3">
              <SplitSection
                title="Items carried in"
                icon={Package}
                isLight={isLight}
              >
                <div
                  className={`border rounded-lg overflow-hidden ${isLight ? "border-gray-200" : "border-white/10"}`}
                >
                  <div
                    className={`flex justify-between items-center px-3 py-1.5 border-b ${isLight ? "bg-gray-100 border-gray-200" : "bg-white/5 border-white/10"}`}
                  >
                    <span className={`text-[10px] font-bold capitalize tracking-wider flex-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>Sub visitor</span>
                    <span className={`text-[10px] font-bold capitalize tracking-wider flex-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>Item name</span>
                    <span className={`text-[10px] font-bold capitalize tracking-wider w-16 text-center ${isLight ? "text-gray-500" : "text-gray-400"}`}>Qty</span>
                    <span className={`text-[10px] font-bold capitalize tracking-wider flex-[2] sm:text-right ${isLight ? "text-gray-500" : "text-gray-400"}`}>Description</span>
                  </div>
                  <div className={`divide-y overflow-y-auto max-h-[200px] custom-scrollbar ${isLight ? "divide-gray-100" : "divide-white/5"}`}>
                    {jointItems.map((item, idx) => {
                      const memberName = item.Group_Members || "Unknown Member";
                      return (
                        <div key={idx} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 px-3 py-1 ${isLight ? (idx % 2 === 0 ? "bg-white" : "bg-gray-50/50") : idx % 2 === 0 ? "bg-transparent" : "bg-white/5"}`}>
                          <span className={`text-[11px] font-medium flex-1 truncate ${isLight ? "text-[#1A1A1A]" : "text-white"}`}>{memberName}</span>
                          <span className={`text-[11px] font-medium flex-1 truncate ${isLight ? "text-gray-600" : "text-gray-400"}`}>{item.VIC_Item_Name || item.itemName}</span>
                          <div className="w-16 flex justify-center">
                            <span className={`text-[11px] font-medium px-2 py-0.5 rounded tracking-wide ${isLight ? "text-primary bg-primary/5" : "text-white bg-white/10"}`}>
                              x{item.VIC_Quantity || item.quantity || 1}
                            </span>
                          </div>
                          <span className={`text-[11px] font-medium flex-[2] sm:text-right truncate ${isLight ? "text-gray-500" : "text-gray-400"}`}>{item.VIC_Designation || item.description || "-"}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </SplitSection>
            </div>
          </SectionCard>
        </div>
      )}
      */}

      {/* ── Sub-Visitor QR Popup Modal ── */}
      <AnimatePresence>
        {popupQR.open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[200]"
              onClick={handleClosePopup}
            />

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center p-6 z-[201] pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 24 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-auto w-full max-w-sm bg-[#161618]/95 backdrop-blur-3xl border border-white/20 shadow-[0_30px_100px_rgba(0,0,0,1)] rounded-[36px] overflow-hidden relative"
              >
                {/* Green accent line */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
                <div className="absolute -top-20 -right-20 w-56 h-56 bg-green-500/5 rounded-full blur-[80px] pointer-events-none" />

                {/* Header */}
                <div className="p-5 border-b border-white/5 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center">
                      <QrCode size={16} className="text-green-500" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-[10px] uppercase tracking-[0.22em] font-bold">
                        Sub-Visitor Pass
                      </p>
                      <p className="text-white text-[13px] font-semibold capitalize tracking-wide">
                        {popupQR.member?.fullName || "—"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClosePopup}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col items-center gap-5 relative z-10">
                  {popupQR.loading ? (
                    <div className="flex flex-col items-center gap-4 py-8">
                      <Loader2
                        size={36}
                        className="text-green-500 animate-spin"
                      />
                      <p className="text-gray-500 text-[10px] uppercase tracking-[0.22em] font-bold">
                        Generating QR Code…
                      </p>
                    </div>
                  ) : popupQR.error ? (
                    <div className="flex flex-col items-center gap-3 py-6">
                      <AlertCircle
                        size={32}
                        className="text-primary opacity-60"
                      />
                      <p className="text-gray-400 text-[10px] uppercase tracking-[0.16em] font-semibold text-center">
                        {popupQR.error}
                      </p>
                      <button
                        onClick={() =>
                          handleOpenSubVisitorQR(popupQR.member, popupQR.idx)
                        }
                        className="px-5 py-2 bg-primary/10 border border-primary/30 text-primary text-[9px] font-bold uppercase tracking-[0.18em] rounded-xl hover:bg-primary/20 transition-all"
                      >
                        Retry
                      </button>
                    </div>
                  ) : popupQR.qrCode ? (
                    <>
                      {/* QR Code */}
                      <div
                        id="cp-sub-qr-popup"
                        className="p-4 bg-white rounded-[24px] shadow-[0_0_40px_rgba(34,197,94,0.12)] relative"
                      >
                        <QRCodeSVG
                          value={popupQR.qrCode}
                          size={190}
                          level="M"
                          includeMargin={false}
                        />
                        <div className="absolute inset-x-0 -bottom-2.5 flex justify-center">
                          <span className="bg-black text-white px-3 py-0.5 rounded-full text-[8px] font-bold tracking-[0.18em] border border-white/20">
                            SUB PASS
                          </span>
                        </div>
                      </div>

                      {/* NIC */}
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                        <p className="text-green-400/80 text-[9px] uppercase tracking-[0.22em] font-bold">
                          {popupQR.member?.nic}
                        </p>
                      </div>

                      {/* Download */}
                      <button
                        onClick={() =>
                          handleDownloadSubQR(popupQR.member?.fullName)
                        }
                        className="w-full flex items-center justify-center gap-2 py-3 bg-green-500/10 border border-green-500/25 text-green-500 hover:bg-green-500 hover:text-white text-[10px] font-bold uppercase tracking-[0.18em] rounded-2xl transition-all"
                      >
                        <Download size={13} />
                        Download QR
                      </button>
                    </>
                  ) : null}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ContactPersonAuthProtocol;
