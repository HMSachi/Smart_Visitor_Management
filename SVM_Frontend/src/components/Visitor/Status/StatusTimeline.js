import React from "react";
import { Check } from "lucide-react";

const StatusTimeline = ({ currentStage }) => {
  // Logic to determine status based on currentStage
  const getStatus = (id) => {
    const order = [
      "submitted",
      "step1_pending",
      "step1_approved",
      "step2_pending",
      "fully_approved",
    ];
    const currentIndex = order.indexOf(currentStage);
    const stageIndex = order.indexOf(id);

    if (stageIndex < currentIndex) return "completed";
    if (stageIndex === currentIndex) return "active";
    return "upcoming";
  };

  // Helper for missing icons in previous thought, using standard lucide
  const stagesFixed = [
    {
      id: "submitted",
      label: "Request Submitted",
      time: "Awaiting primary review",
    },
    {
      id: "step1_pending",
      label: "Reviewing by Contact Person",
      time: "In progress",
    },
    {
      id: "step2_pending",
      label: "Final approval",
      time: "Under review",
    },
    {
      id: "fully_approved",
      label: "Access Ready",
      time: "Pass active",
    },
  ];

  return (
    <div className="space-y-4 relative ml-1">
      {/* Thinner Vertical Line */}
      <div className="absolute left-[6px] top-2 bottom-2 w-[1px] bg-white/5 opacity-50"></div>

      {stagesFixed.map((stage, idx) => {
        const status = getStatus(stage.id);
        return (
          <div key={stage.id} className="relative pl-7">
            {/* Minimal Node */}
            <div
              className={`absolute left-0 top-1 w-3 h-3 rounded-full border transition-all duration-300 z-10 ${
                status === "completed"
                  ? "bg-primary border-primary"
                  : status === "active"
                    ? "bg-background-paper border-primary"
                    : "bg-background border-white/10"
              }`}
            >
              {status === "completed" && (
                <div className="w-full h-full flex items-center justify-center">
                  <Check size={8} className="text-white" strokeWidth={4} />
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <h4
                className={`text-[12px] font-bold uppercase tracking-widest transition-colors ${
                  status === "upcoming"
                    ? "text-gray-600"
                    : status === "active"
                      ? "text-primary"
                      : "text-white"
                }`}
              >
                {stage.label}
              </h4>
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-3">
                <span
                  className={`text-[11px] font-bold uppercase tracking-[0.05em] ${
                    status === "active" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {stage.time}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatusTimeline;
