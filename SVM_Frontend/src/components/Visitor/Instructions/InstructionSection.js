import React from "react";
import { motion } from "framer-motion";
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
          ? "bg-mas-red/10 border-mas-red/20"
          : "bg-white/[0.01] border-white/5"
      }`}
    >

      <div className="flex items-center gap-3 mb-6">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isWarning
              ? "bg-mas-red text-white"
              : "bg-white/10 text-white"
          }`}
        >
          <DisplayIcon size={16} />
        </div>
        <div>
          <h3
            className={`text-sm font-bold uppercase tracking-wider ${
              isWarning ? "text-mas-red" : "text-white"
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
                  ? "text-mas-red"
                  : "text-gray-700"
              }`}
            >
              •
            </div>
            <span
              className={`text-[13px] font-bold leading-relaxed uppercase tracking-widest ${
                isWarning
                  ? "text-mas-red/80"
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
