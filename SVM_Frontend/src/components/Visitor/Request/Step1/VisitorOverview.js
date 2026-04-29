import React from "react";
import {
  User,
  CreditCard,
  Phone,
  Mail,
  Building,
  Briefcase,
  MapPin,
  CalendarDays,
  MessageCircle,
} from "lucide-react";

const VisitorOverview = ({ data, onChange, errors = {} }) => {
  const fields = [
    {
      name: "fullName",
      label: "Your name",
      type: "text",
      placeholder: "John Smith",
      icon: User,
    },
    {
      name: "nic",
      label: "ID or passport number",
      type: "text",
      placeholder: "Enter your ID number",
      icon: CreditCard,
    },
    {
      name: "emailAddress",
      label: "Email address",
      type: "email",
      placeholder: "name@example.com",
      icon: Mail,
    },
    {
      name: "phoneNumber",
      label: "Phone number",
      type: "tel",
      placeholder: "+94 7X XXX XXXX",
      icon: Phone,
    },
    {
      name: "representingCompany",
      label: "Company or group",
      type: "text",
      placeholder: "Company name",
      icon: Building,
    },
    {
      name: "visitorClassification",
      label: "Visitor type",
      type: "text",
      placeholder: "Guest, contractor, or supplier",
      icon: Briefcase,
    },
    {
      name: "proposedVisitDate",
      label: "Visit date",
      type: "date",
      placeholder: "",
      icon: CalendarDays,
    },
    {
      name: "purposeOfVisitation",
      label: "Why are you visiting?",
      type: "text",
      placeholder: "For a meeting, delivery, or other reason",
      icon: MessageCircle,
    },
    {
      name: "visitingArea",
      label: "Where will you visit?",
      type: "text",
      placeholder: "Example: production floor",
      icon: MapPin,
    },
  ];

  return (
    <section className="animate-fade-in px-1 sm:px-2">
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-2 mb-4 border-l-4 border-primary pl-3 sm:pl-4">
        <div className="text-primary">
          <User size={15} />
        </div>
        <h3 className="text-[12px] sm:text-sm font-black text-white uppercase tracking-[0.18em] mb-0">
          Visitor details
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 px-0.5 sm:px-1">
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.16em] flex flex-col md:flex-row items-center gap-2 md:gap-2">
              <field.icon size={11} className="text-primary/70" />
              {field.label}
            </label>
            <div className="relative group">
              <input
                type={field.type}
                name={field.name}
                value={data[field.name]}
                onChange={(e) => {
                  let { value } = e.target;
                  // Real-time filtering based on field requirements
                  if (field.name === "fullName") {
                    value = value.replace(/[^A-Za-z\s]/g, "");
                  } else if (field.name === "phoneNumber" || field.name === "nic") {
                    value = value.replace(/[^0-9]/g, "");
                  }
                  
                  // Create a synthetic event or just call onChange with modified value
                  const syntheticEvent = {
                    target: {
                      name: field.name,
                      value: value
                    }
                  };
                  onChange(syntheticEvent);
                }}
                aria-invalid={Boolean(errors[field.name])}
                aria-describedby={
                  errors[field.name] ? `${field.name}-error` : undefined
                }
                placeholder={field.placeholder}
                className={`w-full bg-white/[0.03] rounded-none px-3.5 py-2.5 text-[11px] text-white/90 focus:outline-none transition-all placeholder:text-gray-600 font-medium [color-scheme:dark] ${errors[field.name] ? "border border-red-500/70 focus:border-red-400" : "border border-white/10 focus:border-primary/50"}`}
              />
            </div>
            {errors[field.name] && (
              <p
                id={`${field.name}-error`}
                className="text-[10px] text-red-400 font-medium leading-snug"
              >
                {errors[field.name]}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default VisitorOverview;
