import React from "react";

export const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-start gap-3 mb-4">
    <div className="w-1 h-8 bg-[#C8102E] rounded-full shrink-0 mt-0.5"></div>
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-2">
        <Icon size={14} className="text-[#C8102E]" />
        <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-[#0A1D37]">
          {title}
        </h3>
      </div>
      {subtitle && (
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
          {subtitle}
        </p>
      )}
    </div>
  </div>
);

export const InputField = ({ label, name, type = "text", placeholder, value, onChange, error, icon: Icon, disabled = false, list }) => (
  <div className="space-y-1.5">
    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em] flex items-center gap-1.5 px-0.5">
      {Icon && <Icon size={11} />} {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      list={list}
      className={`w-full bg-white border rounded-lg px-3 py-2 text-[12px] font-medium transition-all placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/5 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${
        error ? "border-red-500" : "border-gray-200 focus:border-primary/50"
      }`}
    />
    {error && <p className="text-[8px] text-red-500 font-bold px-0.5 uppercase">{error}</p>}
  </div>
);
