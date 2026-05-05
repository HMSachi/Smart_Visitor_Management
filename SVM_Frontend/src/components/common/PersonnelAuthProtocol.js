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

const SimpleTable = ({ columns, data, isLight }) => (
  <div className={`overflow-x-auto rounded-lg border shadow-sm ${isLight ? "border-gray-200" : "border-white/10"}`}>
    <table className="w-full text-left border-collapse min-w-max">
      <thead>
        <tr className={`border-b ${isLight ? "bg-gray-50 border-gray-200" : "bg-black/40 border-white/10"}`}>
          {columns.map((col, idx) => (
            <th key={idx} className={`p-2.5 text-[11px] font-semibold ${isLight ? "text-gray-500" : "text-white/60"}`}>
              <div className="flex items-center gap-1.5">
                {col.icon && <col.icon size={11} className="text-primary/40" />}
                {col.label}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIdx) => (
          <tr key={rowIdx} className={`border-b last:border-b-0 ${isLight ? "border-gray-100 hover:bg-gray-50/50" : "border-white/5 hover:bg-white/[0.02]"}`}>
            {columns.map((col, colIdx) => (
              <td key={colIdx} className={`p-2.5 px-3 text-[12px] font-medium ${isLight ? "text-[#1A1A1A]" : "text-white/90"}`}>
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
                <SimpleTable
                  isLight={isLight}
                  columns={[
                    { label: "Vehicle Registration Number", key: "plateNumber", icon: Car },
                    { label: "Vehicle Type", key: "vehicleType", icon: Hash }
                  ]}
                  data={vehiclesList}
                />
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
                <SimpleTable
                  isLight={isLight}
                  columns={[
                    { label: "Full Name", key: "fullName", icon: User },
                    { label: "NIC / Passport Number", key: "nic", icon: Hash },
                    { label: "Designation / Contact", key: "contact", icon: Phone }
                  ]}
                  data={groupMembers}
                />
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
                <SimpleTable
                  isLight={isLight}
                  columns={[
                    { label: "Item Name", key: "itemName", icon: Package },
                    { label: "Quantity", key: "quantity", icon: Hash },
                    { label: "Description", key: "description", icon: Briefcase }
                  ]}
                  data={itemsCarried}
                />
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
