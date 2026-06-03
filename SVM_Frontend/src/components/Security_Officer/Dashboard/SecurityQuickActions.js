import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, LogOut, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActionButton = ({ icon: Icon, label, description, onClick, index }) => {
    return (
        <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            onClick={onClick}
            className="group relative overflow-hidden bg-[var(--color-bg-paper)] border border-[var(--color-border-soft)] rounded-[10px] p-5 md:p-6 hover:border-[var(--color-border-medium)] transition-all duration-500 shadow-2xl cursor-pointer w-full min-h-[110px] flex flex-col justify-center"
        >
            {/* Background glow effect */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500"></div>

            {/* Content */}
            <div className="flex justify-between items-start relative z-10 w-full text-left">
                <div className="pr-4 flex-1">
                    <h3 className="text-[var(--color-text-primary)] text-[14px] md:text-[16px] font-bold tracking-tight group-hover:text-primary transition-colors mb-1.5">
                        {label}
                    </h3>
                    <p className="text-[var(--color-text-secondary)] text-[11px] opacity-80 leading-relaxed group-hover:opacity-100 transition-opacity">
                        {description}
                    </p>
                </div>
                <div className="p-2.5 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-all duration-500 shrink-0 border-0">
                    <Icon className="text-primary group-hover:scale-110 transition-transform" size={18} strokeWidth={2.5} />
                </div>
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
        //     label: 'Approve Entry',
        //     description: 'Allow visitor to enter',
        //     onClick: () => navigate('/security_officer/entry-approval'),
        // },
        {
            icon: LogOut,
            label: 'Record Exit',
            description: 'Scan departing visitors',
            onClick: () => navigate('/security_officer/exit-verification'),
        },
        {
            icon: Users,
            label: 'Active Visitors',
            description: 'View currently on-premise visitors',
            onClick: () => navigate('/Security_Officer/active-visitors'),
        },

    ];

    return (
        <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                <div>
                    <h2 className="text-[var(--color-text-primary)] text-[13px] md:text-[14px] font-bold uppercase tracking-[0.4em]">Quick Actions</h2>
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
