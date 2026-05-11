import React from "react";

export const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-start gap-3 mb-4">
    <div className="w-1 h-8 bg-primary rounded-full shrink-0 mt-0.5"></div>
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-2">
        <Icon size={14} className="text-primary" />
        <h3 className="text-[12px] font-normal capitalize tracking-[0.15em] text-text-primary">
          {title}
        </h3>
      </div>
      {subtitle && (
        <p className="text-[12px] font-normal text-text-secondary capitalize tracking-widest">
          {subtitle}
        </p>
      )}
    </div>
  </div>
);

export const InputField = ({ label, name, type = "text", placeholder, value, onChange, error, icon: Icon, disabled = false, list }) => (
  <div className="space-y-1.5">
    <label className="text-[12px] font-normal text-text-secondary capitalize tracking-[0.15em] flex items-center gap-1.5 px-0.5">
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
      className={`w-full bg-background-paper border rounded-lg px-3 py-1.5 text-[12px] font-normal text-text-primary transition-all placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-primary/5 disabled:bg-background-alt disabled:text-text-dim disabled:cursor-not-allowed ${
        error ? "border-red-500" : "border-border-soft focus:border-primary/50"
      }`}
    />
    {error && <p className="text-[12px] text-red-500 font-normal px-0.5 capitalize">{error}</p>}
  </div>
);
