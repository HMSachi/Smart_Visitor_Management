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
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-2 mb-1.5">
      <div className="w-1 h-3.5 bg-primary rounded-full"></div>
      {Icon && <Icon size={14} className="text-primary/70" />}
      <h3
        className={`text-[13px] font-bold ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
      >
        {title}
      </h3>
    </div>
    {description && (
      <p
        className={`text-[10px] leading-6 mb-2 tracking-[0.1em] ${isLight ? "text-gray-500" : "text-white/40"}`}
      >
        {description}
      </p>
    )}
    <div>{children}</div>
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
  <div className="group/field relative">
    <div className="flex items-center gap-1.5 mb-1">
      {Icon && (
        <Icon
          size={11}
          className="text-primary/40 group-hover/field:text-primary transition-colors"
        />
      )}
      <label
        className={`text-[11px] font-semibold ${isLight ? "text-gray-500" : "text-white/60"}`}
      >
        {label}
      </label>
    </div>
    <div className="relative">
      <p
        className={`text-[12px] font-medium py-1.5 px-3 rounded-lg border transition-all duration-300 shadow-sm ${
          isLight
            ? "text-[#1A1A1A] bg-white border-gray-200"
            : "text-white bg-black/20 border-white/5"
        }`}
      >
        {value || "No data"}
      </p>
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-0 w-full px-0 space-y-2"
    >
      {/* Control Navigation has been moved to parent components */}

      {/* Visitor Profile Matrix */}
      <div>
        <SectionCard isLight={isLight}>
          <div className="p-3">
            <SplitSection
              title="Visitor details"
              icon={User}
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

      <div className="mb-4">
        <SectionCard isLight={isLight}>
          <div className="p-3 md:p-4">
            <SplitSection
              title="Visit details"
              icon={Briefcase}
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

      <div className="mb-4">
        <SectionCard isLight={isLight}>
          <div className="p-3 md:p-4">
            <SplitSection
              title="Places to visit"
              icon={MapPin}
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
                      className={`p-1.5 border rounded-md text-[10px] font-medium flex flex-col items-center justify-center text-center gap-1 transition-all shadow-sm group/zone ${
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
      <div>
        <SectionCard isLight={isLight}>
          <div className="p-3">
            <SplitSection
              title="Vehicle Registry"
              icon={Car}
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
                <div
                  className={`border border-dashed rounded-2xl p-5 text-center ${
                    isLight ? "border-gray-200" : "border-white/10"
                  }`}
                >
                  <Car size={28} className="mx-auto mb-2 opacity-20" />
                  <p
                    className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
                      isLight ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    No vehicles declared for this visit
                  </p>
                </div>
              )}
            </SplitSection>
          </div>
        </SectionCard>
      </div>

      {/* Personnel Registry (Auxiliary) */}
      <div>
        <SectionCard isLight={isLight}>
          <div className="p-3">
            <SplitSection
              title="Visiting People"
              icon={Users}
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
                <div
                  className={`border border-dashed rounded-2xl p-5 text-center ${
                    isLight ? "border-gray-200" : "border-white/10"
                  }`}
                >
                  <Users size={28} className="mx-auto mb-2 opacity-20" />
                  <p
                    className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
                      isLight ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    No additional visitors
                  </p>
                </div>
              )}
            </SplitSection>
          </div>
        </SectionCard>
      </div>

      {/* Material Intake Protocol */}
      <div>
        <SectionCard
          isLight={isLight}
          darkClassName="bg-[var(--color-bg-default)]"
        >
          <div className="p-3">
            <SplitSection
              title="Items Carried"
              icon={Package}
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
                      className={`grid grid-cols-1 md:grid-cols-3 gap-4 p-4 md:p-5 border rounded-[24px] group/item hover:border-primary/20 transition-all ${
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
                      <Field
                        label="Description"
                        value={item.description || "—"}
                        icon={Briefcase}
                        isLight={isLight}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div
                  className={`border border-dashed rounded-2xl p-5 text-center ${
                    isLight ? "border-gray-200" : "border-white/10"
                  }`}
                >
                  <Package size={28} className="mx-auto mb-2 opacity-20" />
                  <p
                    className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
                      isLight ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
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
