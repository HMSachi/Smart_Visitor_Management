import React, { useState, useCallback } from "react";
import {
  ArrowLeft,
  User,
  Shield,
  Calendar,
  MapPin,
  Car,
  Users,
  Briefcase,
  Hash,
  Mail,
  Phone,
  Package,
  Info,
  CheckCircle2,
  AlertCircle,
  Clock,
  QrCode,
  Download,
  Loader2,
  X,
  FolderOpen,
  ImageIcon,
  FileText,
  CreditCard,
  Paperclip,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { useThemeMode } from "../../theme/ThemeModeContext";
import SubVisitorQRService from "../../services/SubVisitorQRService";
import VisitorAttachmentService from "../../services/VisitorAttachmentService";
import AttachmentPreviewModal from "../../components/common/AttachmentPreviewModal";
import { useAttachmentPreview } from "../../hooks/useAttachmentPreview";

const SplitSection = ({ title, icon: Icon, isLight, children }) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-1.5">
      <div className="w-[3px] h-3.5 bg-primary rounded-full"></div>
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
    className={`rounded-[12px] border overflow-hidden ${
      isLight
        ? "bg-white border-gray-200"
        : `bg-black/25 border-white/10 ${darkClassName}`
    }`}
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
      className={`px-3 py-1 rounded-lg border transition-all duration-300 ${
        isLight
          ? "bg-gray-50/30 border-gray-100 text-[#1A1A1A]"
          : "bg-black/20 border-white/5 text-white"
      }`}
    >
      <p className="text-[12px] font-medium tracking-tight">
        {value || "No data"}
      </p>
    </div>
  </div>
);

const SimpleTable = ({ columns, data, isLight }) => (
  <div
    className={`overflow-x-auto rounded-xl border ${isLight ? "border-gray-100" : "border-white/5"}`}
  >
    <table className="w-full text-left border-collapse">
      <thead>
        <tr
          className={`border-b ${isLight ? "bg-gray-50/50 border-gray-100" : "bg-black/20 border-white/5"}`}
        >
          {columns.map((col, idx) => (
            <th
              key={idx}
              className={`py-1.5 px-2.5 text-[12px] font-medium tracking-tight capitalize ${isLight ? "text-gray-400" : "text-white/30"}`}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIdx) => (
          <tr
            key={rowIdx}
            className={`border-b last:border-b-0 transition-colors ${isLight ? "border-gray-50 hover:bg-gray-50/30" : "border-white/[0.02] hover:bg-white/[0.01]"}`}
          >
            {columns.map((col, colIdx) => (
              <td
                key={colIdx}
                className={`py-1.5 px-2.5 text-[12px] font-normal tracking-tight ${isLight ? "text-[#1A1A1A]" : "text-white/90"}`}
              >
                {row[col.key] || "—"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const PersonnelAuthProtocol = ({
  visitor,
  onBack,
  onAction,
  showStatusForAdmin = false,
  groupMembers = [],
  itemsCarried = [],
  vehiclesList = [],
  jointItems = [],
  gatePasses = [],
}) => {
  const { themeMode } = useThemeMode();
  const isLight = themeMode === "light";
  const { previewData, openPreview, closePreview } = useAttachmentPreview();

  // Check whether the main visitor has a gate pass (same logic as VisitorTable)
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

  // Single popup state for whichever sub-visitor QR is open
  // { open, member, idx, loading, qrCode, error }
  const [popupQR, setPopupQR] = useState({
    open: false,
    member: null,
    idx: null,
    loading: false,
    qrCode: null,
    error: null,
  });
  // Cache generated QRs by index so re-opening is instant
  const [qrCache, setQrCache] = useState({});

  // View Attachments Modal State (main visitor)
  const [viewAttachments, setViewAttachments] = useState({
    open: false,
    visitorId: null,
    visitorName: "",
    loading: false,
    list: [],
    error: null,
    filterCategory: null,
  });

  // Sub-Visitor Attachments Modal State
  const [subVisitorAttachments, setSubVisitorAttachments] = useState({
    open: false,
    groupId: null,
    memberName: "",
    loading: false,
    list: [],
    error: null,
  });

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
          visitorName: visitor.name,
          visitorId: visitor.raw?.VVR_Visitor_id || visitor.id,
          VV_Name: visitor.name,
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
    const svgEl = document.querySelector("#sub-qr-popup svg");
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

  const openViewAttachments = async (visitorId, visitorName, filterCategory = null) => {
    setViewAttachments({
      open: true,
      visitorId,
      visitorName,
      loading: true,
      list: [],
      error: null,
      filterCategory,
    });
    try {
      const res =
        await VisitorAttachmentService.GetAttachmentsByVisitorId(visitorId);
      const rawList = res?.data?.ResultSet || res?.data || [];
      const list = Array.isArray(rawList) ? rawList : [];
      setViewAttachments((prev) => ({ ...prev, loading: false, list }));
    } catch (err) {
      setViewAttachments((prev) => ({
        ...prev,
        loading: false,
        error: err?.message || "Failed to load attachments.",
      }));
    }
  };

  const closeViewAttachments = () => {
    setViewAttachments({
      open: false,
      visitorId: null,
      visitorName: "",
      loading: false,
      list: [],
      error: null,
    });
  };

  const openSubVisitorAttachments = async (groupId, memberName) => {
    setSubVisitorAttachments({
      open: true,
      groupId,
      memberName,
      loading: true,
      list: [],
      error: null,
    });
    try {
      const res = await VisitorAttachmentService.GetAttachmentsByGroupId(groupId);
      const rawList = res?.data?.ResultSet || res?.data || [];
      const list = Array.isArray(rawList) ? rawList : [];
      setSubVisitorAttachments((prev) => ({ ...prev, loading: false, list }));
    } catch (err) {
      setSubVisitorAttachments((prev) => ({
        ...prev,
        loading: false,
        error: err?.message || "Failed to load attachments.",
      }));
    }
  };

  const closeSubVisitorAttachments = () => {
    setSubVisitorAttachments({
      open: false,
      groupId: null,
      memberName: "",
      loading: false,
      list: [],
      error: null,
    });
  };

  if (!visitor) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-0 w-full px-0 space-y-1.5"
    >
      {/* Visitor Profile Matrix */}
      <div className="mb-2">
        <SectionCard isLight={isLight}>
          <div className="p-3">
            {/* Visitor Details Header */}
            <div className="flex flex-col gap-1 mb-3">
              <div className="flex items-center gap-1.5">
                <div className="w-[3px] h-3.5 bg-primary rounded-full" />
                <div className="flex items-center gap-1.5">
                  <User size={13} className="text-primary/70" />
                  <h3
                    className={`text-[13px] font-medium capitalize tracking-tight ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
                  >
                    Visitor details
                  </h3>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
              <Field
                label="Full name"
                value={visitor.name || visitor.fullName}
                icon={User}
                isLight={isLight}
              />
              <div className="relative">
                <button
                  type="button"
                  title="View uploaded attachments"
                  onClick={() =>
                    openViewAttachments(
                      visitor.visitorId || visitor.raw?.VVR_Visitor_id || visitor.id,
                      visitor.name || visitor.fullName,
                      ["nic", "passport", "driving licence"]
                    )
                  }
                  className={`absolute -top-7 right-0 p-2 rounded-lg border-2 transition-all font-semibold z-10 ${
                    isLight
                      ? "bg-primary/15 border-primary/40 text-primary hover:bg-primary/25 hover:border-primary/60 active:scale-95"
                      : "bg-primary/20 border-primary/50 text-primary hover:bg-primary/30 hover:border-primary/70 active:scale-95"
                  }`}
                >
                  <FolderOpen size={14} />
                </button>
                <Field
                  label="NIC"
                  value={visitor.nic}
                  icon={Hash}
                  isLight={isLight}
                />
              </div>
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

            {/* Items carried by the main visitor — embedded as a subsection */}
            <div
              className={`mt-3 pt-3 border-t ${isLight ? "border-gray-100" : "border-white/10"}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Package size={13} className="text-primary/70" />
                <p
                  className={`capitalize text-[12px] font-medium tracking-tight ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
                >
                  Items carried
                </p>
              </div>
              {itemsCarried && itemsCarried.length > 0 ? (
                <div className="grid grid-cols-1 gap-2">
                  {itemsCarried.map((item, idx) => {
                    const s = (item.status || "")
                      .toString()
                      .trim()
                      .toUpperCase();
                    const isTaken = s === "A";
                    const isNotTaken = s === "I";
                    return (
                      <motion.div
                        key={item.id || idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`grid grid-cols-1 md:grid-cols-3 gap-3 p-2 border rounded-xl ${
                          isLight
                            ? "bg-gray-50 border-gray-200"
                            : "bg-black/30 border-white/8"
                        }`}
                      >
                        <Field
                          label="Item name"
                          value={item.itemName}
                          icon={Package}
                          isLight={isLight}
                        />
                        <Field
                          label="Qty"
                          value={item.quantity ? String(item.quantity) : "—"}
                          icon={Hash}
                          isLight={isLight}
                        />
                        <Field
                          label="Description"
                          value={item.description || "—"}
                          icon={Briefcase}
                          isLight={isLight}
                        />
                        {/* Status chip — full width */}
                        <div className="md:col-span-3 flex items-center gap-2">
                          {isTaken ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-[0.14em] uppercase bg-green-500/10 border border-green-500/25 text-green-600 dark:text-green-400">
                              <CheckCircle2 size={11} />
                              Taken
                            </span>
                          ) : isNotTaken ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-[0.14em] uppercase bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400">
                              <AlertCircle size={11} />
                              Not Taken
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-[0.14em] uppercase bg-gray-200/60 border border-gray-300/50 text-gray-500 dark:bg-white/5 dark:border-white/10 dark:text-gray-400">
                              <Clock size={11} />
                              Not checked yet
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div
                  className={`border border-dashed rounded-xl p-2 text-center ${isLight ? "border-gray-200" : "border-white/10"}`}
                >
                  <p
                    className={`text-[10px] font-semibold capitalize tracking-[0.16em] ${isLight ? "text-gray-400" : "text-gray-500"}`}
                  >
                    No items declared
                  </p>
                </div>
              )}
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard isLight={isLight}>
        <div className="p-3 md:p-5">
          <SplitSection title="Places to visit" icon={MapPin} isLight={isLight}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
              {(visitor.areas || visitor.selectedAreas) &&
                (visitor.areas || visitor.selectedAreas).map((area, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{
                      scale: 1.02,
                      borderColor: "var(--color-primary)",
                    }}
                    className={`px-4 py-2.5 border rounded-xl text-[10px] font-bold capitalize tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm group/zone ${
                      isLight
                        ? "bg-gray-50 border-gray-100 text-[#1A1A1A]"
                        : "bg-black/40 border-white/10 text-white"
                    }`}
                  >
                    <MapPin
                      size={12}
                      className="text-primary/50 group-hover/zone:text-primary transition-colors"
                    />
                    {area}
                  </motion.div>
                ))}
            </div>
          </SplitSection>
        </div>
      </SectionCard>

      {vehiclesList && vehiclesList.length > 0 && (
        <SectionCard isLight={isLight}>
          <div className="p-3 md:p-5">
            <SplitSection title="Vehicle registry" icon={Car} isLight={isLight}>
              <div
                className={`border rounded-lg overflow-auto max-h-[250px] ${isLight ? "border-gray-100" : "border-white/10"}`}
              >
                <div
                  className={`flex justify-between items-center px-3 py-1.5 border-b min-w-max ${isLight ? "bg-gray-50 border-gray-100" : "bg-white/5 border-white/10"}`}
                >
                  <span
                    className={`text-[11px] md:text-[12px] font-medium capitalize tracking-tight flex-1 min-w-[100px] ${isLight ? "text-gray-400" : "text-gray-400"}`}
                  >
                    Vehicle type
                  </span>
                  <span
                    className={`text-[11px] md:text-[12px] font-medium capitalize tracking-tight flex-1 min-w-[100px] text-center ${isLight ? "text-gray-400" : "text-gray-400"}`}
                  >
                    Vehicle number
                  </span>
                  <span
                    className={`text-[11px] md:text-[12px] font-medium capitalize tracking-tight flex-[2] text-right min-w-[200px] ${isLight ? "text-gray-400" : "text-gray-400"}`}
                  >
                    Attachments
                  </span>
                </div>
                <div
                  className={`divide-y ${isLight ? "divide-gray-50/50" : "divide-white/5"}`}
                >
                  {vehiclesList.map((vehicle, idx) => (
                    <div
                      key={vehicle.id || idx}
                      className={`flex flex-row items-center justify-between gap-2 px-3 py-1.5 min-w-max ${isLight ? (idx % 2 === 0 ? "bg-white" : "bg-gray-50/30") : idx % 2 === 0 ? "bg-transparent" : "bg-white/5"}`}
                    >
                      <span
                        className={`text-[11px] md:text-[12px] font-medium capitalize flex-1 min-w-[100px] ${isLight ? "text-gray-600" : "text-gray-400"}`}
                      >
                        {vehicle.vehicleType}
                      </span>
                      <span
                        className={`text-[11px] md:text-[12px] font-medium flex-1 min-w-[100px] text-center ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
                      >
                        {vehicle.plateNumber}
                      </span>
                      {/* Attachment buttons */}
                      <div className="flex-[2] flex justify-end gap-2 min-w-[200px]">
                        
                        <button
                          type="button"
                          title="Vehicle Insurance"
                          onClick={() =>
                            openViewAttachments(
                              visitor.visitorId || visitor.raw?.VVR_Visitor_id || visitor.id,
                              visitor.name || visitor.fullName,
                              "Vehicle Insurance"
                            )
                          }
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all text-[10px] font-semibold tracking-wide ${
                            isLight
                              ? "bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 active:scale-95"
                              : "bg-primary/15 border-primary/30 text-primary hover:bg-primary/25 active:scale-95"
                          }`}
                        >
                          <Shield size={12} />
                          Insurance
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SplitSection>
          </div>
        </SectionCard>
      )}

      {groupMembers && groupMembers.length > 0 && (
        <SectionCard isLight={isLight}>
          <div className="p-2 md:p-3">
            <SplitSection
              title="Additional visitors"
              icon={Users}
              isLight={isLight}
            >
              <div
                className={`border rounded-lg overflow-auto max-h-[250px] ${isLight ? "border-gray-100" : "border-white/10"}`}
              >
                {/* Header */}
                <div
                  className={`flex justify-between items-center px-3 py-1.5 border-b min-w-max ${isLight ? "bg-gray-50 border-gray-100" : "bg-white/5 border-white/10"}`}
                >
                  <span className={`text-[11px] md:text-[12px] font-medium capitalize tracking-tight flex-1 min-w-[120px] ${isLight ? "text-gray-400" : "text-gray-400"}`}>Name</span>
                  <span className={`text-[11px] md:text-[12px] font-medium capitalize tracking-tight flex-1 min-w-[130px] text-center ${isLight ? "text-gray-400" : "text-gray-400"}`}>NIC</span>
                  <span className={`text-[11px] md:text-[12px] font-medium capitalize tracking-tight flex-1 min-w-[120px] text-center ${isLight ? "text-gray-400" : "text-gray-400"}`}>Contact</span>
                  <span className={`text-[11px] md:text-[12px] font-medium capitalize tracking-tight w-28 text-right min-w-[110px] ${isLight ? "text-gray-400" : "text-gray-400"}`}>Attachments</span>
                </div>
                {/* Rows */}
                <div className={`divide-y ${isLight ? "divide-gray-50/50" : "divide-white/5"}`}>
                  {groupMembers.map((member, idx) => (
                    <div
                      key={member.id || idx}
                      className={`flex flex-row items-center justify-between gap-2 px-3 py-1.5 min-w-max ${isLight ? (idx % 2 === 0 ? "bg-white" : "bg-gray-50/30") : idx % 2 === 0 ? "bg-transparent" : "bg-white/5"}`}
                    >
                      <span className={`text-[11px] md:text-[12px] font-medium flex-1 min-w-[120px] ${isLight ? "text-[#1A1A1A]" : "text-white"}`}>{member.fullName}</span>
                      <span className={`text-[11px] md:text-[12px] font-medium capitalize flex-1 min-w-[130px] text-center ${isLight ? "text-gray-600" : "text-gray-400"}`}>{member.nic}</span>
                      <span className={`text-[11px] md:text-[12px] font-medium flex-1 min-w-[120px] text-center ${isLight ? "text-gray-600" : "text-gray-400"}`}>{member.contact || "-"}</span>
                      <div className="w-28 flex justify-end min-w-[110px]">
                        <button
                          type="button"
                          title="Attachments"
                          onClick={() => openSubVisitorAttachments(member.id, member.fullName)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all text-[10px] font-semibold tracking-wide ${
                            isLight
                              ? "bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 active:scale-95"
                              : "bg-primary/15 border-primary/30 text-primary hover:bg-primary/25 active:scale-95"
                          }`}
                        >
                          <Paperclip size={12} />
                        </button>
                      </div>
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
            <div className="p-3">
              <SplitSection
                title="Items carried in"
                icon={Package}
                isLight={isLight}
              >
                {(() => {
                  // Group rows by sub-visitor name
                  const grouped = jointItems.reduce((acc, row) => {
                    const name = row.Group_Members || "Unknown Member";
                    if (!acc[name]) acc[name] = [];
                    acc[name].push(row);
                    return acc;
                  }, {});
                  return (
                    <div className="space-y-4">
                      {Object.entries(grouped).map(([memberName, memberItems], gIdx) => (
                        <div key={gIdx}>
                          <div className={`flex items-center gap-2 mb-2 pb-1.5 border-b ${isLight ? "border-gray-100" : "border-white/10"}`}>
                            <User size={12} className="text-primary/60" />
                            <span className={`text-[10px] font-bold capitalize tracking-[0.2em] ${isLight ? "text-[#1A1A1A]" : "text-white"}`}>
                              {memberName}
                            </span>
                            <span className={`ml-auto text-[9px] font-semibold capitalize tracking-[0.14em] px-2 py-0.5 rounded-full border ${isLight ? "bg-gray-50 border-gray-200 text-gray-400" : "bg-white/5 border-white/10 text-white/40"}`}>
                              {memberItems.length} {memberItems.length === 1 ? "item" : "items"}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                            {memberItems.map((item, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`grid grid-cols-1 md:grid-cols-3 gap-3 p-3 border rounded-xl hover:border-primary/20 transition-all ${isLight ? "bg-gray-50 border-gray-200" : "bg-[var(--color-bg-paper)]/40 border-white/5"}`}
                              >
                                <Field label="Item name" value={item.VIC_Item_Name || item.itemName} icon={Package} isLight={isLight} />
                                <Field label="Qty" value={item.VIC_Quantity ? String(item.VIC_Quantity) : (item.quantity ? String(item.quantity) : "—")} icon={Hash} isLight={isLight} />
                                <Field label="Description" value={item.VIC_Designation || item.description || "—"} icon={Briefcase} isLight={isLight} />
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </SplitSection>
            </div>
          </SectionCard>
        </div>
      )}
      */}

      {onAction && (
        <div
          className={`mt-6 pt-6 border-t ${isLight ? "border-gray-100" : "border-white/5"} flex items-center justify-end gap-3`}
        >
          {(visitor.status === "Accepted by Contact Person" ||
            visitor.status === "Accepted by Visitor") && (
            <>
              <button
                onClick={() => onAction(visitor, "Reject")}
                className={`px-6 py-2.5 border font-bold text-[11px] tracking-[0.15em] capitalize rounded-xl transition-all flex items-center gap-1.5 active:scale-95 ${
                  isLight
                    ? "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <AlertCircle size={14} />
                Reject request
              </button>
              <button
                onClick={() => onAction(visitor, "Approve")}
                className="px-8 py-2.5 bg-[#00B14F] hover:bg-[#009e46] text-white text-[11px] font-bold tracking-[0.15em] capitalize rounded-xl transition-all shadow-lg shadow-green-500/20 flex items-center gap-1.5 active:scale-95"
              >
                <CheckCircle2 size={14} />
                Approve entry
              </button>
            </>
          )}
        </div>
      )}

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
                      <p className="text-gray-400 text-[10px] capitalize tracking-[0.22em] font-bold">
                        Sub-visitor pass
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
                      <p className="text-gray-500 text-[10px] capitalize tracking-[0.22em] font-bold">
                        Generating QR code…
                      </p>
                    </div>
                  ) : popupQR.error ? (
                    <div className="flex flex-col items-center gap-3 py-6">
                      <AlertCircle
                        size={32}
                        className="text-primary opacity-60"
                      />
                      <p className="text-gray-400 text-[10px] capitalize tracking-[0.16em] font-semibold text-center">
                        {popupQR.error}
                      </p>
                      <button
                        onClick={() =>
                          handleOpenSubVisitorQR(popupQR.member, popupQR.idx)
                        }
                        className="px-5 py-2 bg-primary/10 border border-primary/30 text-primary text-[9px] font-bold capitalize tracking-[0.18em] rounded-xl hover:bg-primary/20 transition-all"
                      >
                        Retry
                      </button>
                    </div>
                  ) : popupQR.qrCode ? (
                    <>
                      {/* QR Code */}
                      <div
                        id="sub-qr-popup"
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
                            Sub pass
                          </span>
                        </div>
                      </div>

                      {/* NIC */}
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                        <p className="text-green-400/80 text-[9px] capitalize tracking-[0.22em] font-bold">
                          {popupQR.member?.nic}
                        </p>
                      </div>

                      {/* Download */}
                      <button
                        onClick={() =>
                          handleDownloadSubQR(popupQR.member?.fullName)
                        }
                        className="w-full flex items-center justify-center gap-2 py-3 bg-green-500/10 border border-green-500/25 text-green-500 hover:bg-green-500 hover:text-white text-[10px] font-bold capitalize tracking-[0.18em] rounded-2xl transition-all"
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

      {/* ── View Attachments Modal ── */}
      {viewAttachments.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[var(--color-bg-paper)] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-black/20 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-5 bg-primary rounded-full" />
                <div>
                  <h2 className="text-[12px] font-normal text-white tracking-[0.16em]">
                    {viewAttachments.filterCategory
                      ? Array.isArray(viewAttachments.filterCategory)
                        ? "Uploaded Documents"
                        : viewAttachments.filterCategory
                      : "Uploaded Documents"}
                  </h2>
                  {viewAttachments.visitorName && (
                    <p className="text-[10px] text-white/40 tracking-widest mt-0.5">
                      {viewAttachments.visitorName} · #
                      {viewAttachments.visitorId}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={closeViewAttachments}
                className="text-gray-400 hover:text-white transition-colors bg-white/5 p-1.5 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 relative z-10 min-h-[120px]">
              {viewAttachments.loading ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <div className="w-8 h-8 border-2 border-border-soft border-t-primary rounded-full animate-spin" />
                  <p className="text-[11px] text-white/30 tracking-widest uppercase">
                    Loading...
                  </p>
                </div>
              ) : viewAttachments.error ? (
                <div className="flex items-center gap-2 px-3 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-[11px]">
                  <AlertCircle size={13} className="shrink-0" />
                  {viewAttachments.error}
                </div>
              ) : viewAttachments.list.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3 opacity-40">
                  <FolderOpen size={32} />
                  <p className="text-[11px] tracking-widest uppercase">
                    No attachments found
                  </p>
                </div>
              ) : (
                <ul className="space-y-2 max-h-[312px] overflow-y-auto pr-1 custom-scrollbar">
                  {(viewAttachments.filterCategory
                    ? viewAttachments.list.filter(
                        (att) => {
                          const cat = (att.VAT_File_Category || att.FileCategory || "").toLowerCase();
                          if (Array.isArray(viewAttachments.filterCategory)) {
                             return viewAttachments.filterCategory.map(c => c.toLowerCase()).includes(cat);
                          }
                          return cat === viewAttachments.filterCategory.toLowerCase();
                        }
                      )
                    : viewAttachments.list
                  ).length === 0 && !viewAttachments.loading ? (
                    <li className="flex flex-col items-center justify-center py-10 gap-3 opacity-40">
                      <FolderOpen size={28} />
                      <p className="text-[11px] tracking-widest uppercase">
                        No {Array.isArray(viewAttachments.filterCategory) ? "" : viewAttachments.filterCategory || ""} attachments found
                      </p>
                    </li>
                  ) : (
                    (viewAttachments.filterCategory
                      ? viewAttachments.list.filter(
                          (att) => {
                            const cat = (att.VAT_File_Category || att.FileCategory || "").toLowerCase();
                            if (Array.isArray(viewAttachments.filterCategory)) {
                               return viewAttachments.filterCategory.map(c => c.toLowerCase()).includes(cat);
                            }
                            return cat === viewAttachments.filterCategory.toLowerCase();
                          }
                        )
                      : viewAttachments.list
                    ).map((att, idx) => {
                    const category =
                      att.VAT_File_Category || att.FileCategory || "document";
                    const fileName =
                      att.VAT_File_Name ||
                      att.FileName ||
                      att.FilePath ||
                      `file-${idx + 1}`;
                    const vatId =
                      att.VAT_Id || att.VAT_Attachment_id || att.Id || null;
                    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(
                      fileName,
                    );
                    return (
                      <li
                        key={idx}
                        onClick={() => vatId && openPreview(vatId, fileName)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 transition-all group cursor-pointer"
                      >
                        {isImage ? (
                          <ImageIcon
                            size={15}
                            className="text-primary/60 shrink-0"
                          />
                        ) : (
                          <FileText
                            size={15}
                            className="text-primary/60 shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-medium text-white truncate">
                            {fileName}
                          </p>
                          <p className="text-[9px] text-white/40 capitalize">
                            {category}
                          </p>
                        </div>
                        <button
                          type="button"
                          title="Download file"
                          onClick={(e) => {
                            e.stopPropagation();
                            vatId && VisitorAttachmentService.DownloadAttachment(vatId, fileName);
                          }}
                          className={`flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/25 transition-all shrink-0 ${!vatId ? "opacity-30 cursor-not-allowed" : ""}`}
                        >
                          <Download size={18} />
                        </button>
                      </li>
                    );
                  }))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Sub-Visitor Attachments Modal ── */}
      {subVisitorAttachments.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[var(--color-bg-paper)] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-black/20 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-5 bg-primary rounded-full" />
                <div>
                  <h2 className="text-[12px] font-normal text-white tracking-[0.16em]">Uploaded Documents</h2>
                  {subVisitorAttachments.memberName && (
                    <p className="text-[10px] text-white/40 tracking-widest mt-0.5">
                      {subVisitorAttachments.memberName} · #{subVisitorAttachments.groupId}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={closeSubVisitorAttachments}
                className="text-gray-400 hover:text-white transition-colors bg-white/5 p-1.5 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 relative z-10 min-h-[120px]">
              {subVisitorAttachments.loading ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <div className="w-8 h-8 border-2 border-border-soft border-t-primary rounded-full animate-spin" />
                  <p className="text-[11px] text-white/30 tracking-widest uppercase">Loading...</p>
                </div>
              ) : subVisitorAttachments.error ? (
                <div className="flex items-center gap-2 px-3 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-[11px]">
                  <AlertCircle size={13} className="shrink-0" />
                  {subVisitorAttachments.error}
                </div>
              ) : subVisitorAttachments.list.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3 opacity-40">
                  <FolderOpen size={32} />
                  <p className="text-[11px] tracking-widest uppercase">No attachments found</p>
                </div>
              ) : (
                <ul className="space-y-2 max-h-[312px] overflow-y-auto pr-1 custom-scrollbar">
                  {subVisitorAttachments.list.map((att, idx) => {
                    const category = att.VAT_File_Category || att.FileCategory || "document";
                    const fileName = att.VAT_File_Name || att.FileName || att.FilePath || `file-${idx + 1}`;
                    const vatId = att.VAT_Id || att.VAT_Attachment_id || att.Id || null;
                    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
                    return (
                      <li
                        key={idx}
                        onClick={() => vatId && openPreview(vatId, fileName)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 transition-all group cursor-pointer"
                      >
                        {isImage ? (
                          <ImageIcon size={15} className="text-primary/60 shrink-0" />
                        ) : (
                          <FileText size={15} className="text-primary/60 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-medium text-white truncate">{fileName}</p>
                          <p className="text-[9px] text-white/40 capitalize">{category}</p>
                        </div>
                        <button
                          type="button"
                          title="Download file"
                          onClick={(e) => {
                            e.stopPropagation();
                            vatId && VisitorAttachmentService.DownloadAttachment(vatId, fileName);
                          }}
                          className={`flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/25 transition-all shrink-0 ${!vatId ? "opacity-30 cursor-not-allowed" : ""}`}
                        >
                          <Download size={18} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
      <AttachmentPreviewModal previewData={previewData} onClose={closePreview} />
    </motion.div>
  );
};

export default PersonnelAuthProtocol;
