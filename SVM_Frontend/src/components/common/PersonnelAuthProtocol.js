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

const SplitSection = ({
  title,
  description,
  icon: Icon,
  isLight,
  children,
}) => (
  <div className="grid grid-cols-1 gap-3 xl:grid-cols-[190px_minmax(0,1fr)]">
    <div className="xl:sticky xl:top-28 self-start">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-1.5 h-8 bg-primary rounded-full"></div>
        {Icon && <Icon size={16} className="text-primary/70" />}
        <h3
          className={`uppercase text-[11px] tracking-[0.22em] font-semibold ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
        >
          {title}
        </h3>
      </div>
      {description && (
        <p
          className={`text-[10px] leading-6 uppercase tracking-[0.16em] ${isLight ? "text-gray-400" : "text-white/40"}`}
        >
          {description}
        </p>
      )}
    </div>

    <div>{children}</div>
  </div>
);

const SectionCard = ({ children, isLight, darkClassName = "" }) => (
  <div
    className={`rounded-[28px] border shadow-sm overflow-hidden ${
      isLight
        ? "bg-white border-gray-200"
        : `bg-black/25 border-white/10 ${darkClassName}`
    }`}
  >
    {children}
  </div>
);

const Field = ({ label, value, icon: Icon, isLight }) => (
  <div className="group/field relative">
    <div className="flex flex-col md:flex-row items-center gap-3 md:gap-3 mb-2">
      {Icon && (
        <Icon
          size={12}
          className="text-primary/25 group-hover/field:text-primary transition-colors"
        />
      )}
      <label
        className={`uppercase text-[10px] font-semibold tracking-[0.18em] ${isLight ? "text-gray-500" : "text-white/45"}`}
      >
        {label}
      </label>
    </div>
    <div className="relative">
      <p
        className={`text-[12px] font-semibold uppercase tracking-[0.12em] py-2.5 px-4 rounded-2xl group-hover:border-primary transition-all duration-300 shadow-sm border ${
          isLight
            ? "text-[#1A1A1A] bg-white border-gray-200 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
            : "text-white bg-black/35 border-white/10"
        }`}
      >
        {value || "No data"}
      </p>
      <div
        className={`absolute right-5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full group-hover:bg-primary transition-colors ${isLight ? "bg-gray-200" : "bg-white/10"}`}
      ></div>
    </div>
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
}) => {
  const { themeMode } = useThemeMode();
  const isLight = themeMode === "light";
  const visitorStatus =
    visitor?.status || visitor?.raw?.VVR_Status || visitor?.raw?.VV_Status;

  if (!visitor) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-16 w-full px-0"
    >
      {/* Control Navigation */}
      <div
        className={`sticky top-0 z-30 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 p-5 border rounded-2xl shadow-[0_12px_32px_rgba(15,23,42,0.08)] overflow-hidden transition-all duration-500 backdrop-blur-lg ${
          isLight
            ? "bg-white/96 border-gray-200"
            : "bg-black/80 border-white/10"
        }`}
      >
        <button
          onClick={onBack}
          className={`flex flex-col md:flex-row items-center gap-4 md:gap-3 uppercase text-[12px] font-semibold tracking-[0.22em] hover:text-primary transition-all group relative z-10 ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
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

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4 w-full lg:w-auto relative z-10">
          {showStatusForAdmin && (
            <div
              className={`px-4 py-2 rounded-xl border text-[10px] font-semibold uppercase tracking-[0.2em] flex items-center justify-center gap-2 whitespace-nowrap ${
                isLight
                  ? "bg-gray-50 border-gray-200 text-[#1A1A1A]"
                  : "bg-white/5 border-white/10 text-white"
              }`}
            >
              <Shield size={14} className="text-primary" />
              Status: {visitorStatus || "Pending"}
            </div>
          )}
          {(visitor.status === "Accepted by Visitor" ||
            visitor.status === "Accepted by Contact Person" ||
            visitor.status === "Sent to Admin") && (
            <>
              <button
                onClick={() => onAction(visitor, "Approve")}
                className="flex-1 lg:flex-none px-10 py-3 bg-[#00B14F] hover:bg-[#009e46] text-white text-[12px] font-semibold tracking-[0.22em] uppercase rounded-xl transition-all shadow-[0_10px_24px_rgba(0,177,79,0.18)] flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} />
                ACCEPT
              </button>
              <button
                onClick={() => onAction(visitor, "Reject")}
                className="flex-1 lg:flex-none px-10 py-3 bg-primary hover:bg-[#A00D25] text-white text-[12px] font-semibold tracking-[0.22em] uppercase rounded-xl transition-all shadow-[0_10px_24px_rgba(183,28,53,0.18)] flex items-center justify-center gap-2"
              >
                <AlertCircle size={16} />
                REJECT
              </button>
            </>
          )}
        </div>
      </div>

      {/* Visitor Profile Matrix */}
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
            </SplitSection>
          </div>
        </SectionCard>
      </div>

      <div className="mb-8">
        <SectionCard isLight={isLight}>
          <div className="p-4 md:p-5">
            <SplitSection
              title="Visit details"
              icon={Briefcase}
              description="Visit intent, destination, and authorization context."
              isLight={isLight}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      </div>

      <div className="mb-8">
        <SectionCard isLight={isLight}>
          <div className="p-4 md:p-5">
            <SplitSection
              title="Places to visit"
              icon={MapPin}
              description="Requested access zones for the visit."
              isLight={isLight}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-2">
                {(visitor.areas || visitor.selectedAreas) &&
                (visitor.areas || visitor.selectedAreas).length > 0 ? (
                  (visitor.areas || visitor.selectedAreas).map((area, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{
                        scale: 1.05,
                        borderColor: "var(--color-primary)",
                      }}
                      className={`p-2 border rounded-lg uppercase text-[9px] font-semibold tracking-[0.12em] flex flex-col items-center justify-center text-center gap-1 transition-all shadow-sm group/zone ${
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
                  <div className="col-span-full border border-dashed border-white/10 p-2.5 md:p-3 rounded-xl text-center">
                    <p className="text-gray-300/80 uppercase text-[9px] font-medium tracking-[0.18em]">
                      No places selected
                    </p>
                  </div>
                )}
              </div>
            </SplitSection>
          </div>
        </SectionCard>
      </div>

      {/* Logistics & Vehicle Registry */}
      <div className="mb-8">
        <SectionCard isLight={isLight}>
          <div className="p-4 md:p-5">
            <SplitSection
              title="Vehicle Registry"
              icon={Car}
              description="Transport details associated with the request."
              isLight={isLight}
            >
              {vehiclesList && vehiclesList.length > 0 ? (
                <div className="space-y-4">
                  {vehiclesList.map((v, idx) => (
                    <motion.div
                      key={v.id || idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl border ${
                        isLight
                          ? "bg-gray-50 border-gray-200"
                          : "bg-black/35 border-white/10"
                      }`}
                    >
                      <Field
                        label="Vehicle Registration Number"
                        value={v.plateNumber}
                        icon={Car}
                        isLight={isLight}
                      />
                      <Field
                        label="Vehicle Type"
                        value={v.vehicleType}
                        icon={Hash}
                        isLight={isLight}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className={`border border-dashed rounded-2xl p-5 text-center ${
                  isLight ? "border-gray-200" : "border-white/10"
                }`}>
                  <Car size={28} className="mx-auto mb-2 opacity-20" />
                  <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
                    isLight ? "text-gray-400" : "text-gray-500"
                  }`}>
                    No vehicles declared for this visit
                  </p>
                </div>
              )}
            </SplitSection>
          </div>
        </SectionCard>
      </div>

      {/* Personnel Registry (Auxiliary) */}
      <div className="mb-8">
        <SectionCard isLight={isLight}>
          <div className="p-4 md:p-5">
            <SplitSection
              title="Visiting People"
              icon={Users}
              description="Additional attendees tied to the request."
              isLight={isLight}
            >
              {groupMembers && groupMembers.length > 0 ? (
                <div className="space-y-4">
                  {groupMembers.map((member, idx) => (
                    <motion.div
                      key={member.id || idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`grid grid-cols-1 md:grid-cols-3 gap-4 p-4 md:p-5 border rounded-2xl hover:border-primary/20 transition-all ${
                        isLight
                          ? "bg-gray-50 border-gray-200"
                          : "bg-black/35 border-white/10"
                      }`}
                    >
                      <Field
                        label="Full Name"
                        value={member.fullName}
                        icon={User}
                        isLight={isLight}
                      />
                      <Field
                        label="NIC / Passport Number"
                        value={member.nic}
                        icon={Hash}
                        isLight={isLight}
                      />
                      <Field
                        label="Designation / Contact"
                        value={member.contact}
                        icon={Phone}
                        isLight={isLight}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className={`border border-dashed rounded-2xl p-5 text-center ${
                  isLight ? "border-gray-200" : "border-white/10"
                }`}>
                  <Users size={28} className="mx-auto mb-2 opacity-20" />
                  <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
                    isLight ? "text-gray-400" : "text-gray-500"
                  }`}>
                    No additional visitors
                  </p>
                </div>
              )}
            </SplitSection>
          </div>
        </SectionCard>
      </div>

      {/* Material Intake Protocol */}
      <div className="mb-8">
        <SectionCard isLight={isLight} darkClassName="bg-[var(--color-bg-default)]">
          <div className="p-4 md:p-5">
            <SplitSection
              title="Items Carried"
              icon={Package}
              description="Declared items and quantities for the visit."
              isLight={isLight}
            >
              {itemsCarried && itemsCarried.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {itemsCarried.map((item, idx) => (
                    <motion.div
                      key={item.id || idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:p-5 border rounded-[24px] group/item hover:border-primary/20 transition-all ${
                        isLight
                          ? "bg-gray-50 border-gray-200"
                          : "bg-[var(--color-bg-paper)]/40 border-white/5"
                      }`}
                    >
                      <Field
                        label="Item Name"
                        value={item.itemName}
                        icon={Package}
                        isLight={isLight}
                      />
                      <Field
                        label="Quantity"
                        value={item.quantity ? String(item.quantity) : "—"}
                        icon={Hash}
                        isLight={isLight}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className={`border border-dashed rounded-2xl p-5 text-center ${
                  isLight ? "border-gray-200" : "border-white/10"
                }`}>
                  <Package size={28} className="mx-auto mb-2 opacity-20" />
                  <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
                    isLight ? "text-gray-400" : "text-gray-500"
                  }`}>
                    No items declared
                  </p>
                </div>
              )}
            </SplitSection>
          </div>
        </SectionCard>
      </div>
    </motion.div>
  );
};

export default PersonnelAuthProtocol;
