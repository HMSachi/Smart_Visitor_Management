import React from "react";
import { Users, User, CreditCard, Phone, Plus, X } from "lucide-react";
import { AnimatePresence } from "framer-motion";

const VisitorGroup = ({ visitors, onAdd, onRemove, onChange, isLight }) => {
  return (
    <section className="animate-fade-in stagger-item grid grid-cols-1 gap-3 xl:grid-cols-[190px_minmax(0,1fr)]">
      <div className="xl:sticky xl:top-28 self-start">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-1.5 h-8 bg-primary rounded-full"></div>
          <Users size={14} className="text-primary/70" />
          <h3
            className={`text-[10px] font-semibold uppercase tracking-[0.18em] mb-0 ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
          >
            People visiting
          </h3>
        </div>
        <p
          className={`text-[9px] leading-5 uppercase tracking-[0.16em] mb-4 ${isLight ? "text-gray-400" : "text-white/40"}`}
        >
          Additional people accompanying the visit.
        </p>
        <button
          type="button"
          onClick={onAdd}
          className={`flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-none hover:bg-primary hover:text-white transition-all text-[9px] font-semibold uppercase tracking-[0.18em] group`}
        >
          <Plus
            size={12}
            className="group-hover:scale-110 transition-transform"
          />
          Add person
        </button>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {visitors.map((visitor) => (
            <div
              key={visitor.id}
              className="relative grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3 pt-3 border-t border-white/8 first:border-0 first:pt-0"
            >
              {visitors.length > 0 && (
                <button
                  type="button"
                  onClick={() => onRemove(visitor.id)}
                  className="absolute -right-2 top-0 p-2 text-gray-500 hover:text-primary transition-all md:top-6"
                  title="Remove Visitor"
                >
                  <X size={16} />
                </button>
              )}

              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-[9px] font-semibold text-gray-500 uppercase tracking-[0.18em] flex items-center gap-2 px-1">
                  Full name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="fullName"
                    value={visitor.fullName}
                    onChange={(e) =>
                      onChange(visitor.id, "fullName", e.target.value)
                    }
                    placeholder="e.g. John Doe"
                    className={`w-full rounded-none px-3 py-2 text-[10px] focus:outline-none transition-all font-medium ${
                      isLight
                        ? "bg-white border border-gray-200 text-[#1A1A1A] focus:border-primary placeholder:text-gray-400"
                        : "bg-white/[0.03] border border-white/20 text-white/90 focus:border-primary/60 placeholder:text-gray-600"
                    }`}
                  />
                </div>
              </div>

              {/* NIC / Passport */}
              <div className="space-y-2">
                <label className="text-[9px] font-semibold text-gray-500 uppercase tracking-[0.18em] flex items-center gap-2 px-1">
                  ID or passport number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="nic"
                    value={visitor.nic}
                    onChange={(e) =>
                      onChange(visitor.id, "nic", e.target.value)
                    }
                    placeholder="Enter ID or passport number"
                    className={`w-full rounded-none px-3 py-2 text-[10px] focus:outline-none transition-all font-medium ${
                      isLight
                        ? "bg-white border border-gray-200 text-[#1A1A1A] focus:border-primary placeholder:text-gray-400"
                        : "bg-white/[0.03] border border-white/20 text-white/90 focus:border-primary/60 placeholder:text-gray-600"
                    }`}
                  />
                </div>
              </div>

              {/* Contact Number */}
              <div className="space-y-2 pr-4 md:pr-5">
                <label className="text-[9px] font-semibold text-gray-500 uppercase tracking-[0.18em] flex items-center gap-2 px-1">
                  Phone number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="contact"
                    value={visitor.contact}
                    onChange={(e) =>
                      onChange(visitor.id, "contact", e.target.value)
                    }
                    placeholder="e.g. +94 7X XXX XXXX"
                    className={`w-full rounded-none px-3 py-2 text-[10px] focus:outline-none transition-all font-medium ${
                      isLight
                        ? "bg-white border border-gray-200 text-[#1A1A1A] focus:border-primary placeholder:text-gray-400"
                        : "bg-white/[0.03] border border-white/20 text-white/90 focus:border-primary/60 placeholder:text-gray-600"
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </AnimatePresence>

        {visitors.length === 0 && (
          <div className="p-6 border-2 border-dashed border-white/10 rounded-none flex flex-col items-center justify-center text-center mt-3">
            <Users size={20} className="text-gray-600 mb-2.5" />
            <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-[0.18em] mb-3">
              No additional people added yet.
            </p>
            <button
              type="button"
              onClick={onAdd}
              className={`px-5 py-2.5 rounded-none font-semibold uppercase tracking-[0.18em] text-[10px] transition-all ${
                isLight
                  ? "bg-white border border-primary/20 text-primary hover:bg-primary hover:text-white"
                  : "bg-white/[0.03] border border-white/20 text-white hover:bg-primary hover:border-primary"
              }`}
            >
              Add person
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default VisitorGroup;
