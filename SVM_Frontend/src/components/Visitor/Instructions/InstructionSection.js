import React from "react";
import { AlertTriangle, Info } from "lucide-react";

const InstructionSection = ({
  title,
  items,
  type = "info",
  icon: Icon,
  delay = 0,
}) => {
  const isWarning = type === "warning";

  // Fallback icon if none provided
  const DisplayIcon = Icon || (isWarning ? AlertTriangle : Info);

  return (
    <div
      className={`p-6 rounded-xl transition-all duration-300 border ${
        isWarning
          ? "bg-primary/10 border-primary/20"
          : "bg-white/[0.01] border-white/5"
      }`}
    >

      <div className="flex items-center gap-3 mb-6">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isWarning
              ? "bg-primary text-white"
              : "bg-white/10 text-white"
          }`}
        >
          <DisplayIcon size={16} />
        </div>
        <div>
          <h3
            className={`text-sm font-bold uppercase tracking-wider ${
              isWarning ? "text-primary" : "text-white"
            }`}
          >
            {title}
          </h3>
        </div>
      </div>

      <ul className="space-y-3">
        {items.map((item, idx) => (
          <li
            key={idx}
            className="flex items-start"
          >
            <div
              className={`mt-1.5 mr-3 shrink-0 flex items-center justify-center text-[13px] ${
                isWarning
                  ? "text-primary"
                  : "text-gray-700"
              }`}
            >
              •
            </div>
            <span
              className={`text-[13px] font-bold leading-relaxed uppercase tracking-widest ${
                isWarning
                  ? "text-primary/80"
                  : "text-gray-500"
              }`}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InstructionSection;
