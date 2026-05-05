import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, LogOut, Users, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActionButton = ({ icon: Icon, label, description, onClick, index }) => {
    return (
        <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            onClick={onClick}
            className="group relative overflow-hidden h-full min-h-[140px] md:min-h-[160px] bg-[var(--color-surface-1)] border border-[var(--color-border-soft)] rounded-2xl p-6 hover:border-primary/40 transition-all duration-500 flex flex-col justify-between"
        >
            {/* Background glow effect */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500"></div>
            
            {/* Content */}
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all duration-300">
                        <Icon className="text-primary group-hover:scale-110 transition-transform" size={24} strokeWidth={2} />
                    </div>
                    <h3 className="text-[var(--color-text-primary)] font-bold text-sm tracking-wide mb-1 text-left">
                        {label}
                    </h3>
                </div>
                <p className="text-[var(--color-text-secondary)] text-xs opacity-75 text-left leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary group-hover:w-full transition-all duration-700 shadow-[0_0_10px_var(--color-primary)]"></div>
        </motion.button>
    );
};

const SecurityQuickActions = () => {
    const navigate = useNavigate();

    const actions = [
        // {
        //     icon: CheckCircle,
        //     label: 'Entry Approval',
        //     description: 'Approve visitor entry to facility',
        //     onClick: () => navigate('/security_officer/entry-approval'),
        // },
        {
            icon: LogOut,
            label: 'Exit Verification',
            description: 'Verify and record visitor exit',
            onClick: () => navigate('/security_officer/exit-verification'),
        },
        {
            icon: Users,
            label: 'Active Visitors',
            description: 'View currently on-premise visitors',
            onClick: () => navigate('/security_officer/active-visitors'),
        },
        {
            icon: AlertCircle,
            label: 'Incident Report',
            description: 'File security incident report',
            onClick: () => navigate('/security_officer/incident-report'),
        },
    ];

    return (
        <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                <div>
                    <h2 className="text-[var(--color-text-primary)] text-lg md:text-xl font-bold tracking-tight">Quick Actions</h2>
                    <p className="text-[var(--color-text-secondary)] text-xs opacity-75 mt-1 uppercase tracking-[0.2em]">Critical security operations</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {actions.map((action, index) => (
                    <QuickActionButton key={index} {...action} index={index} />
                ))}
            </div>
        </div>
    );
};

export default SecurityQuickActions;
