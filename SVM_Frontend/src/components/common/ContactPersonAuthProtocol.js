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

const SplitSection = ({ title, description, icon: Icon, isLight, children }) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-2">
      <div className="w-[3px] h-3.5 bg-primary rounded-full" />
      <div className="flex items-center gap-1.5">
        {Icon && <Icon size={13} className="text-primary/70" />}
        <h3 className={`text-[11px] font-bold uppercase tracking-[0.1em] ${isLight ? "text-[#1A1A1A]" : "text-white"}`}>
          {title}
        </h3>
      </div>
    </div>
    {description && (
      <p className={`text-[9px] leading-relaxed mb-1 tracking-[0.05em] ${isLight ? "text-gray-400" : "text-white/30"}`}>
        {description}
      </p>
    )}
    <div className="w-full">{children}</div>
  </div>
);

const SectionCard = ({ children, isLight, darkClassName = "" }) => (
  <div className={`rounded-[12px] border overflow-hidden ${isLight ? "bg-white border-gray-200" : `bg-black/25 border-white/10 ${darkClassName}`}`}>
    {children}
  </div>
);

const Field = ({ label, value, icon: Icon, isLight }) => (
  <div className="group/field flex flex-col gap-1">
    <div className="flex items-center gap-1.5 px-0.5">
      {Icon && <Icon size={11} className="text-primary/50 group-hover/field:text-primary transition-colors" />}
      <label className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-white/40"}`}>
        {label}
      </label>
    </div>
    <div className={`px-3 py-1.5 rounded-lg border transition-all duration-300 ${isLight ? "bg-gray-50/30 border-gray-100 text-[#1A1A1A]" : "bg-black/20 border-white/5 text-white"}`}>
      <p className="text-[11px] font-medium tracking-wide">{value || "No data"}</p>
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
}) => {
  const { themeMode } = useThemeMode();
  const isLight = themeMode === "light";

  // QR popup state
  const [popupQR, setPopupQR] = useState({ open: false, member: null, idx: null, loading: false, qrCode: null, error: null });
  const [qrCache, setQrCache] = useState({});

  const handleOpenSubVisitorQR = useCallback(async (member, idx) => {
    const cached = qrCache[idx];
    if (cached) {
      setPopupQR({ open: true, member, idx, loading: false, qrCode: cached, error: null });
      return;
    }
    setPopupQR({ open: true, member, idx, loading: true, qrCode: null, error: null });
    try {
      const subVisitorData = { name: member.fullName, nic: member.nic };
      const mainVisitorData = {
        visitorName: visitor.name || visitor.fullName,
        visitorId: visitor.raw?.VVR_Visitor_id || visitor.id,
        VV_Name: visitor.name || visitor.fullName,
        VV_Visitor_id: visitor.raw?.VVR_Visitor_id,
      };
      const qrCode = await SubVisitorQRService.GenerateSubVisitorQR(subVisitorData, mainVisitorData, visitor.id);
      setQrCache((prev) => ({ ...prev, [idx]: qrCode }));
      setPopupQR((prev) => ({ ...prev, loading: false, qrCode, error: null }));
    } catch (err) {
      setPopupQR((prev) => ({ ...prev, loading: false, error: err.message || "Failed to generate QR" }));
    }
  }, [qrCache, visitor]);

  const handleClosePopup = () =>
    setPopupQR({ open: false, member: null, idx: null, loading: false, qrCode: null, error: null });

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
            <SplitSection
              title="Visitor details"
              icon={User}
              description="Identity and contact information for the primary visitor."
              isLight={isLight}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <Field label="Full name" value={visitor.name || visitor.fullName} icon={User} isLight={isLight} />
                <Field label="ID or passport number" value={visitor.nic} icon={Hash} isLight={isLight} />
                <Field label="Phone number" value={visitor.contact || visitor.phoneNumber} icon={Phone} isLight={isLight} />
                <Field label="Email address" value={visitor.email || visitor.emailAddress} icon={Mail} isLight={isLight} />
              </div>

              {/* Items carried by the main visitor — embedded subsection */}
              <div className={`mt-6 pt-5 border-t ${isLight ? "border-gray-100" : "border-white/10"}`}>
                <div className="flex items-center gap-2 mb-4">
                  <Package size={13} className="text-primary/70" />
                  <p className={`uppercase text-[10px] font-bold tracking-[0.2em] ${isLight ? "text-[#1A1A1A]" : "text-white"}`}>
                    Items Carried
                  </p>
                  <span className={`text-[9px] font-semibold uppercase tracking-[0.14em] ${isLight ? "text-gray-400" : "text-white/35"}`}>
                    — declared by the primary visitor
                  </span>
                </div>
                {itemsCarried && itemsCarried.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {itemsCarried.map((item, idx) => (
                      <motion.div
                        key={item.id || idx}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.07 }}
                        className={`grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-[20px] ${isLight ? "bg-gray-50 border-gray-200" : "bg-black/30 border-white/8"}`}
                      >
                        <Field label="Item Name" value={item.itemName} icon={Package} isLight={isLight} />
                        <Field label="Quantity" value={item.quantity ? String(item.quantity) : "—"} icon={Hash} isLight={isLight} />
                        <Field label="Description" value={item.description || "—"} icon={Briefcase} isLight={isLight} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className={`border border-dashed rounded-xl p-3 text-center ${isLight ? "border-gray-200" : "border-white/10"}`}>
                    <p className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${isLight ? "text-gray-400" : "text-gray-500"}`}>
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
          <SplitSection title="Visit details" icon={Briefcase} isLight={isLight}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <Field label="Visit date" value={visitor.date || visitor.proposedVisitDate} icon={Calendar} isLight={isLight} />
              <Field label="Reason for visit" value={visitor.purpose || visitor.purposeOfVisitation} icon={Info} isLight={isLight} />
              <Field label="Company" value={visitor.representingCompany} icon={Briefcase} isLight={isLight} />
              <Field label="Visitor type" value={visitor.visitorClassification} icon={Users} isLight={isLight} />
            </div>
          </SplitSection>
        </div>
      </SectionCard>

      {/* ── 3. Places to Visit ── */}
      <SectionCard isLight={isLight}>
        <div className="p-3 md:p-5">
          <SplitSection title="Places to visit" icon={MapPin} isLight={isLight}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
              {(visitor.areas || visitor.selectedAreas) && (visitor.areas || visitor.selectedAreas).length > 0 ? (
                (visitor.areas || visitor.selectedAreas).map((area, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02, borderColor: "var(--color-primary)" }}
                    className={`px-4 py-2.5 border rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm group/zone ${isLight ? "bg-gray-50 border-gray-100 text-[#1A1A1A]" : "bg-black/40 border-white/10 text-white"}`}
                  >
                    <MapPin size={12} className="text-primary/50 group-hover/zone:text-primary transition-colors" />
                    {area}
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full border border-dashed rounded-xl p-4 text-center border-white/10">
                  <p className={`text-[9px] font-bold uppercase tracking-[0.18em] ${isLight ? "text-gray-400" : "text-gray-500"}`}>
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
          <div className="p-3 md:p-5">
            <SplitSection title="Vehicle Registry" icon={Car} isLight={isLight}>
              <div className="grid grid-cols-1 gap-3">
                {vehiclesList.map((vehicle, idx) => (
                  <motion.div
                    key={vehicle.id || idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.07 }}
                    className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-[20px] ${isLight ? "bg-gray-50 border-gray-200" : "bg-black/30 border-white/8"}`}
                  >
                    <Field label="Vehicle Registration Number" value={vehicle.plateNumber} icon={Car} isLight={isLight} />
                    <Field label="Vehicle Type" value={vehicle.vehicleType} icon={Hash} isLight={isLight} />
                  </motion.div>
                ))}
              </div>
            </SplitSection>
          </div>
        </SectionCard>
      )}

      {/* ── 5. Visiting People with QR buttons (conditional) ── */}
      {groupMembers && groupMembers.length > 0 && (
        <SectionCard isLight={isLight}>
          <div className="p-3 md:p-5">
            <SplitSection
              title="Visiting People"
              icon={Users}
              description="Additional attendees tied to the request."
              isLight={isLight}
            >
              <div className="space-y-4">
                {groupMembers.map((member, idx) => (
                  <motion.div
                    key={member.id || idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-4 p-4 md:p-5 border rounded-2xl hover:border-primary/20 transition-all ${isLight ? "bg-gray-50 border-gray-200" : "bg-black/35 border-white/10"}`}
                  >
                    <Field label="Full Name" value={member.fullName} icon={User} isLight={isLight} />
                    <Field label="NIC / Passport Number" value={member.nic} icon={Hash} isLight={isLight} />
                    <Field label="Designation / Contact" value={member.contact} icon={Phone} isLight={isLight} />
                    <div className="flex flex-col justify-end">
                      <button
                        onClick={() => handleOpenSubVisitorQR(member, idx)}
                        title="View QR Code"
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all border ${isLight ? "bg-white border-gray-200 text-gray-500 hover:border-primary/40 hover:text-primary" : "bg-white/5 border-white/10 text-white/40 hover:border-primary/40 hover:text-primary"}`}
                      >
                        <QrCode size={15} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </SplitSection>
          </div>
        </SectionCard>
      )}

      {/* ── 6. Items Carried In — grouped by sub-visitor ── */}
      <div className="mb-8">
        <SectionCard isLight={isLight} darkClassName="bg-[var(--color-bg-default)]">
          <div className="p-4 md:p-5">
            <SplitSection
              title="Items Carried In"
              icon={Package}
              description="Items brought in by each member of the visiting group."
              isLight={isLight}
            >
              {jointItems && jointItems.length > 0 ? (
                (() => {
                  const grouped = jointItems.reduce((acc, row) => {
                    const name = row.Group_Members || "Unknown Member";
                    if (!acc[name]) acc[name] = [];
                    acc[name].push(row);
                    return acc;
                  }, {});
                  return (
                    <div className="space-y-6">
                      {Object.entries(grouped).map(([memberName, memberItems], gIdx) => (
                        <div key={gIdx}>
                          <div className={`flex items-center gap-2 mb-3 pb-2 border-b ${isLight ? "border-gray-100" : "border-white/10"}`}>
                            <User size={12} className="text-primary/60" />
                            <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isLight ? "text-[#1A1A1A]" : "text-white"}`}>
                              {memberName}
                            </span>
                            <span className={`ml-auto text-[9px] font-semibold uppercase tracking-[0.14em] px-2 py-0.5 rounded-full border ${isLight ? "bg-gray-50 border-gray-200 text-gray-400" : "bg-white/5 border-white/10 text-white/40"}`}>
                              {memberItems.length} {memberItems.length === 1 ? "item" : "items"}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 gap-3">
                            {memberItems.map((item, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.07 }}
                                className={`grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-[20px] hover:border-primary/20 transition-all ${isLight ? "bg-gray-50 border-gray-200" : "bg-[var(--color-bg-paper)]/40 border-white/5"}`}
                              >
                                <Field label="Item Name" value={item.VIC_Item_Name || item.itemName} icon={Package} isLight={isLight} />
                                <Field label="Quantity" value={item.VIC_Quantity ? String(item.VIC_Quantity) : item.quantity ? String(item.quantity) : "—"} icon={Hash} isLight={isLight} />
                                <Field label="Description" value={item.VIC_Designation || item.description || "—"} icon={Briefcase} isLight={isLight} />
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()
              ) : (
                <div className={`border border-dashed rounded-2xl p-5 text-center ${isLight ? "border-gray-200" : "border-white/10"}`}>
                  <Package size={28} className="mx-auto mb-2 opacity-20" />
                  <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${isLight ? "text-gray-400" : "text-gray-500"}`}>
                    No items carried in by the visiting group
                  </p>
                </div>
              )}
            </SplitSection>
          </div>
        </SectionCard>
      </div>

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
                      <p className="text-gray-400 text-[10px] uppercase tracking-[0.22em] font-bold">Sub-Visitor Pass</p>
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
                      <Loader2 size={36} className="text-green-500 animate-spin" />
                      <p className="text-gray-500 text-[10px] uppercase tracking-[0.22em] font-bold">
                        Generating QR Code…
                      </p>
                    </div>
                  ) : popupQR.error ? (
                    <div className="flex flex-col items-center gap-3 py-6">
                      <AlertCircle size={32} className="text-primary opacity-60" />
                      <p className="text-gray-400 text-[10px] uppercase tracking-[0.16em] font-semibold text-center">
                        {popupQR.error}
                      </p>
                      <button
                        onClick={() => handleOpenSubVisitorQR(popupQR.member, popupQR.idx)}
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
                        onClick={() => handleDownloadSubQR(popupQR.member?.fullName)}
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
