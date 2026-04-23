import React from "react";
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
} from "lucide-react";
import { motion } from "framer-motion";
import { useThemeMode } from "../../theme/ThemeModeContext";

const SectionHeader = ({ title, icon: Icon, isLight }) => (
  <div className="flex flex-col md:flex-row items-center gap-4 md:gap-5 mb-10 group/header">
    <div className="w-1.5 h-6 bg-primary rounded-full group-hover/header:h-10 transition-all duration-500"></div>
    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-3">
      {Icon && (
        <Icon
          size={16}
          className="text-primary/40 group-hover/header:scale-110 transition-transform"
        />
      )}
      <h3
        className={`uppercase text-xs tracking-widest font-bold ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
      >
        {title}
      </h3>
    </div>
    <div
      className={`flex-1 h-[1px] ml-4 group-hover/header:bg-primary/20 transition-all ${isLight ? "bg-gray-100" : "bg-white/5"}`}
    ></div>
  </div>
);

const Field = ({ label, value, icon: Icon, isLight }) => (
  <div className="group/field relative">
    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-3 mb-2">
      {Icon && (
        <Icon
          size={12}
          className="text-primary/20 group-hover/field:text-primary transition-colors"
        />
      )}
      <label
        className={`uppercase text-[13px] font-bold tracking-widest ${isLight ? "text-gray-400" : "text-white/40"}`}
      >
        {label}
      </label>
    </div>
    <div className="relative">
      <p
        className={`text-sm font-semibold uppercase tracking-widest py-3 px-5 rounded-2xl group-hover:border-primary transition-all duration-500 shadow-sm border ${
          isLight
            ? "text-[#1A1A1A] bg-white border-gray-200 shadow-sm"
            : "text-white bg-black/40 border-white/10"
        }`}
      >
        {value || "N/A"}
      </p>
      <div
        className={`absolute right-5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full group-hover:bg-primary transition-colors ${isLight ? "bg-gray-200" : "bg-white/10"}`}
      ></div>
    </div>
  </div>
);

const PersonnelAuthProtocol = ({ visitor, onBack, onAction }) => {
  const { themeMode } = useThemeMode();
  const isLight = themeMode === "light";

  if (!visitor) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-20 max-w-6xl mx-auto px-6"
    >
      {/* Control Navigation */}
      <div
        className={`sticky top-0 z-30 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-16 p-6 border rounded-2xl shadow-lg overflow-hidden transition-all duration-500 backdrop-blur-lg ${
          isLight
            ? "bg-white/95 border-gray-200 shadow-gray-200/50"
            : "bg-black/80 border-white/10 shadow-black/50"
        }`}
      >
        <button
          onClick={onBack}
          className={`flex flex-col md:flex-row items-center gap-4 md:gap-3 uppercase text-[13px] font-bold tracking-widest hover:text-primary transition-all group relative z-10 ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
        >
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center group-hover:border-primary transition-all border ${
              isLight
                ? "bg-gray-50 border-gray-100"
                : "bg-white/5 border-white/10"
            }`}
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
          </div>
          Back to requests
        </button>

        <div className="flex gap-4 w-full lg:w-auto relative z-10">
          {(visitor.status === "Accepted by Visitor" || 
             visitor.status === "Accepted by Contact Person" || 
             visitor.status === "Sent to Admin") && (
            <>
              <button
                onClick={() => onAction(visitor, "Approve")}
                className="flex-1 lg:flex-none px-12 py-3 bg-[#00B14F] hover:bg-[#009e46] text-white text-[13px] font-bold tracking-widest uppercase rounded-xl transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} />
                ACCEPT
              </button>
              <button
                onClick={() => onAction(visitor, "Reject")}
                className="flex-1 lg:flex-none px-12 py-3 bg-primary hover:bg-[#A00D25] text-white text-[13px] font-bold tracking-widest uppercase rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                <AlertCircle size={16} />
                REJECT
              </button>
            </>
          )}
        </div>
      </div>

      {/* Visitor Profile Matrix */}
      <div className="mb-20">
        <SectionHeader title="Visitor details" icon={User} isLight={isLight} />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          <Field
            label="Full name"
            value={visitor.name || visitor.fullName}
            icon={User}
            isLight={isLight}
          />
          <Field
            label="ID or passport number"
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
      </div>

      {/* Visit Protocol Dynamics */}
      <div className="mb-20">
        <SectionHeader
          title="Visit details"
          icon={Briefcase}
          isLight={isLight}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

        {/* Infrastructure Authorization Grid */}
        <div
          className={`mt-6 p-3 md:p-6 border rounded-2xl shadow-inner relative overflow-hidden transition-all duration-500 ${
            isLight
              ? "bg-gray-50 border-gray-200"
              : "bg-black/20 border-white/5 shadow-black/50"
          }`}
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 mb-6">
            <div className="w-1 h-4 bg-primary rounded-full"></div>
            <p
              className={`text-[13px] font-bold uppercase tracking-widest ${isLight ? "text-gray-400" : "text-white/40"}`}
            >
              Places to visit
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {(visitor.areas || visitor.selectedAreas) &&
            (visitor.areas || visitor.selectedAreas).length > 0 ? (
              (visitor.areas || visitor.selectedAreas).map((area, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{
                    scale: 1.05,
                    borderColor: "var(--color-primary)",
                  }}
                  className={`p-3 border rounded-lg uppercase text-[11px] font-bold tracking-widest flex flex-col items-center justify-center text-center gap-2 transition-all shadow-sm group/zone ${
                    isLight
                      ? "bg-white border-gray-200 text-[#1A1A1A]"
                      : "bg-black/40 border-white/10 text-white"
                  }`}
                >
                  <MapPin
                    size={14}
                    className="text-primary/40 group-hover/zone:text-primary transition-colors"
                  />
                  {area}
                </motion.div>
              ))
            ) : (
              <div className="col-span-full border border-dashed border-white/10 p-3 md:p-6 rounded-xl text-center">
                <p className="text-gray-300/80 uppercase text-[13px] font-medium tracking-widest">
                  No places selected
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logistics & Vehicle Registry */}
      {(visitor.vehicle || visitor.plateNumber) && (
        <div className="mb-20">
          <SectionHeader
            title="Logistics & Vehicle Registry"
            icon={Car}
            isLight={isLight}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Field
              label="Transport Identifier"
              value={visitor.vehicle || visitor.plateNumber}
              icon={Car}
              isLight={isLight}
            />
            <Field
              label="Transport Type"
              value={visitor.vehicleType || "CIVILIAN"}
              icon={Hash}
              isLight={isLight}
            />
          </div>
        </div>
      )}

      {/* Personnel Registry (Auxiliary) */}
      {(visitor.members || visitor.additionalVisitors) &&
        (visitor.members || visitor.additionalVisitors).length > 0 && (
          <div className="mb-20">
            <SectionHeader
              title="Personnel Registry (Auxiliary)"
              icon={Users}
            />
            <div className="space-y-6">
              {(visitor.members || visitor.additionalVisitors).map(
                (member, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 md:p-10 bg-[var(--color-bg-paper)] border border-white/5 rounded-[32px] group/aux shadow-2xl relative overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary group-hover:w-2 transition-all"></div>
                    <Field
                      label={`Unit Identity`}
                      value={member.name || member.fullName}
                      icon={User}
                      isLight={isLight}
                    />
                    <Field
                      label="Auth Identifier (NIC)"
                      value={member.nic}
                      icon={Hash}
                      isLight={isLight}
                    />
                    <Field
                      label="Signal Protocol (Phone)"
                      value={member.contact || member.phoneNumber || "N/A"}
                      icon={Phone}
                      isLight={isLight}
                    />
                  </motion.div>
                ),
              )}
            </div>
          </div>
        )}

      {/* Material Intake Protocol */}
      {visitor.equipment && visitor.equipment.length > 0 && (
        <div className="mb-20 bg-[var(--color-bg-default)] p-6 md:p-12 border border-white/5 rounded-[40px] shadow-[inset_0_0_60px_rgba(0,0,0,0.5)]">
          <SectionHeader title="Material Intake Protocol" icon={Package} />
          <div className="grid grid-cols-1 gap-6 mt-12">
            {visitor.equipment.map((item, idx) => {
              const itemName = typeof item === "string" ? item : item.itemName;
              const itemQty =
                typeof item === "string"
                  ? "01_UNIT"
                  : item.quantity || "01_UNIT";
              const itemDesc =
                typeof item === "string"
                  ? "DECLARED"
                  : item.description || "DECLARED";
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-8 p-8 bg-[var(--color-bg-paper)]/40 border border-white/5 rounded-3xl group/item hover:border-primary/20 transition-all shadow-xl"
                >
                  <div className="md:col-span-12 lg:col-span-5">
                    <Field
                      label="Asset Nomenclature"
                      value={itemName}
                      icon={Package}
                      isLight={isLight}
                    />
                  </div>
                  <div className="md:col-span-6 lg:col-span-2">
                    <Field
                      label="Asset Qty"
                      value={itemQty}
                      icon={Hash}
                      isLight={isLight}
                    />
                  </div>
                  <div className="md:col-span-6 lg:col-span-5">
                    <Field
                      label="Intake Description"
                      value={itemDesc}
                      icon={Info}
                      isLight={isLight}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PersonnelAuthProtocol;
