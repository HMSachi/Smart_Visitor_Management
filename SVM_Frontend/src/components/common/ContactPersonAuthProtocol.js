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
    <div className="flex items-center gap-2">
      <div className="w-[3px] h-3.5 bg-primary rounded-full"></div>
      <div className="flex items-center gap-1.5">
        {Icon && <Icon size={13} className="text-primary/70" />}
        <h3
          className={`text-[11px] font-bold uppercase tracking-[0.1em] ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
        >
          {title}
        </h3>
      </div>
    </div>
    {description && (
      <p
        className={`text-[9px] leading-relaxed mb-1 tracking-[0.05em] ${isLight ? "text-gray-400" : "text-white/30"}`}
      >
        {description}
      </p>
    )}
    <div className="w-full">{children}</div>
  </div>
);

const SectionCard = ({ children, isLight, darkClassName = "" }) => (
  <div
    className={`rounded-[12px] border overflow-hidden ${isLight
        ? "bg-white border-gray-200"
        : `bg-black/25 border-white/10 ${darkClassName}`
      }`}
  >
    {children}
  </div>
);

const Field = ({ label, value, icon: Icon, isLight }) => (
  <div className="group/field flex flex-col gap-1">
    <div className="flex items-center gap-1.5 px-0.5">
      {Icon && (
        <Icon
          size={11}
          className="text-primary/50 group-hover/field:text-primary transition-colors"
        />
      )}
      <label
        className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-white/40"}`}
      >
        {label}
      </label>
    </div>
    <div
      className={`px-3 py-1.5 rounded-lg border transition-all duration-300 ${isLight
          ? "bg-gray-50/30 border-gray-100 text-[#1A1A1A]"
          : "bg-black/20 border-white/5 text-white"
        }`}
    >
      <p className="text-[11px] font-medium tracking-wide">
        {value || "No data"}
      </p>
    </div>
  </div>
);

const SimpleTable = ({ columns, data, isLight }) => (
  <div className={`overflow-x-auto rounded-xl border ${isLight ? "border-gray-100" : "border-white/5"}`}>
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className={`border-b ${isLight ? "bg-gray-50/50 border-gray-100" : "bg-black/20 border-white/5"}`}>
          {columns.map((col, idx) => (
            <th key={idx} className={`py-2 px-4 text-[9px] font-bold tracking-[0.2em] uppercase ${isLight ? "text-gray-400" : "text-white/30"}`}>
              <div className="flex items-center gap-2">
                {col.icon && <col.icon size={11} className="text-primary/60" />}
                {col.label}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIdx) => (
          <tr key={rowIdx} className={`border-b last:border-b-0 transition-colors ${isLight ? "border-gray-50 hover:bg-gray-50/30" : "border-white/[0.02] hover:bg-white/[0.01]"}`}>
            {columns.map((col, colIdx) => (
              <td key={colIdx} className={`py-2 px-4 text-[11px] font-medium tracking-tight ${isLight ? "text-[#1A1A1A]" : "text-white/90"}`}>
                {row[col.key] || "—"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ContactPersonAuthProtocol = ({
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

  if (!visitor) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-0 w-full px-0 space-y-1.5"
    >
      {/* Visitor Profile Matrix */}
        <SectionCard isLight={isLight}>
          <div className="p-3 md:p-5">
            <SplitSection
              title="Visitor details"
              icon={User}
              isLight={isLight}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
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

      <SectionCard isLight={isLight}>
        <div className="p-3 md:p-5">
          <SplitSection
            title="Places to visit"
            icon={MapPin}
            isLight={isLight}
          >
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
                      className={`px-4 py-2.5 border rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm group/zone ${isLight
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
                  ))
                ) : (
                  <div className="col-span-full border border-dashed border-white/10 p-4 rounded-xl text-center">
                    <p className="text-gray-300/80 uppercase text-[9px] font-bold tracking-[0.18em]">
                      No places selected
                    </p>
                  </div>
                )}
              </div>
            </SplitSection>
          </div>
        </SectionCard>

      <SectionCard isLight={isLight}>
        <div className="p-3 md:p-5">
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
                  className={`border border-dashed rounded-2xl p-6 text-center ${isLight ? "border-gray-100 bg-gray-50/30" : "border-white/10"
                    }`}
                >
                  <Car size={28} className="mx-auto mb-2 opacity-20" />
                  <p
                    className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isLight ? "text-gray-400" : "text-gray-500"
                      }`}
                  >
                    NO VEHICLES DECLARED FOR THIS VISIT
                  </p>
                </div>
              )}
            </SplitSection>
          </div>
        </SectionCard>

      <SectionCard isLight={isLight}>
        <div className="p-3 md:p-5">
          <SplitSection
            title="Additional Visitors"
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
                  className={`border border-dashed rounded-2xl p-6 text-center ${isLight ? "border-gray-100 bg-gray-50/30" : "border-white/10"
                    }`}
                >
                  <Users size={28} className="mx-auto mb-2 opacity-20" />
                  <p
                    className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isLight ? "text-gray-400" : "text-gray-500"
                      }`}
                  >
                    NO ADDITIONAL VISITORS DETECTED
                  </p>
                </div>
              )}
            </SplitSection>
          </div>
        </SectionCard>

      <SectionCard isLight={isLight}>
        <div className="p-3 md:p-5">
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
                    { label: "Description", key: "description", icon: Info }
                  ]}
                  data={itemsCarried}
                />
              ) : (
                <div
                  className={`border border-dashed rounded-2xl p-6 text-center ${isLight ? "border-gray-100 bg-gray-50/30" : "border-white/10"
                    }`}
                >
                  <Package size={28} className="mx-auto mb-2 opacity-20" />
                  <p
                    className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isLight ? "text-gray-400" : "text-gray-500"
                      }`}
                  >
                    NO ITEMS DECLARED FOR THIS VISIT
                  </p>
                </div>
              )}
            </SplitSection>
          </div>
        </SectionCard>
    </motion.div>
  );
};

export default ContactPersonAuthProtocol;
