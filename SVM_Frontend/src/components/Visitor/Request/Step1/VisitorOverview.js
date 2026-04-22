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

const VisitorOverview = ({ data, onChange }) => {
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
    <section className="animate-fade-in px-2 sm:px-3">
      <div className="flex flex-col md:flex-row items-center gap-3 md:gap-3 mb-6 border-l-4 border-primary pl-4 sm:pl-5">
        <div className="text-primary">
          <User size={18} />
        </div>
        <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-[0.2em] mb-0">
          Visitor details
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 px-1 sm:px-2">
        {fields.map((field) => (
          <div key={field.name} className="space-y-2.5">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.18em] flex flex-col md:flex-row items-center gap-3 md:gap-2">
              <field.icon size={13} className="text-primary/70" />
              {field.label}
            </label>
            <div className="relative group">
              <input
                type={field.type}
                name={field.name}
                value={data[field.name]}
                onChange={onChange}
                required
                placeholder={field.placeholder}
                className="w-full bg-white/[0.03] border border-white/10 rounded-none px-4 py-3 text-[12px] text-white/90 focus:outline-none focus:border-primary/50 transition-all placeholder:text-gray-600 font-medium [color-scheme:dark]"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VisitorOverview;
