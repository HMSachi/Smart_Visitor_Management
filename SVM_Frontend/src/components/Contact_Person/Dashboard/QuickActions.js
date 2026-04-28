import React from "react";
import { motion } from "framer-motion";
import { Plus, Inbox, Send, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickActionButton = ({
  icon: Icon,
  label,
  description,
  onClick,
  index,
}) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className="group relative overflow-hidden h-full min-h-[100px] sm:min-h-[110px] md:min-h-[120px] bg-[var(--color-surface-1)] border border-[var(--color-border-soft)] rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 hover:border-primary/40 transition-all duration-500 flex flex-col justify-between"
    >
      {/* Background glow effect */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
        <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-2 sm:mb-3 md:mb-4 group-hover:bg-primary/20 transition-all duration-300">
            <Icon
              className="text-primary group-hover:scale-110 transition-transform"
              size={20}
              strokeWidth={2}
            />
          </div>
          <h3 className="text-[var(--color-text-primary)] font-bold text-xs sm:text-sm md:text-base tracking-wide mb-1 text-left leading-tight">
            {label}
          </h3>
        </div>
        <p className="text-[var(--color-text-secondary)] text-[10px] sm:text-xs opacity-75 text-left leading-tight">
          {description}
        </p>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary group-hover:w-full transition-all duration-700 shadow-[0_0_10px_var(--color-primary)]"></div>
    </motion.button>
  );
};

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: Plus,
      label: "New Request",
      description: "Create a new visitor authorization request",
      onClick: () => navigate("/contact_person/new-request"),
    },
    {
      icon: Inbox,
      label: "View Inbox",
      description: "Check pending requests and responses",
      onClick: () => navigate("/contact_person/requests-inbox"),
    },
    {
      icon: Send,
      label: "Sent Requests",
      description: "Review submitted requests and status",
      onClick: () => navigate("/contact_person/sent-to-admin"),
    },
    {
      icon: Users,
      label: "All Visitors",
      description: "Manage visitor information database",
      onClick: () => navigate("/contact_person/visitor-history"),
    },
  ];

  return (
    <div className="space-y-2 sm:space-y-3 md:space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4">
        <div>
          <h2 className="text-[var(--color-text-primary)] text-sm sm:text-base md:text-lg font-bold tracking-tight">
            Quick Actions
          </h2>
          <p className="text-[var(--color-text-secondary)] text-[9px] sm:text-[10px] opacity-75 mt-0.5 sm:mt-1 uppercase tracking-[0.15em]">
            Common tasks at your fingertips
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {actions.map((action, index) => (
          <QuickActionButton key={index} {...action} index={index} />
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
