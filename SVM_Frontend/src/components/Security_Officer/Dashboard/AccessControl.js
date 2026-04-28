import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, LogOut, TrendingUp, AlertTriangle } from 'lucide-react';

const AccessControl = () => {
    const [stats, setStats] = useState({
        entriesApproved: 24,
        exitsVerified: 22,
        pendingApprovals: 3,
        rejectedAttempts: 2,
    });

    const StatBox = ({ label, value, icon: Icon, trend, color }) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-[var(--color-bg-primary)] border border-[var(--color-border-soft)] rounded-xl p-4 hover:border-primary/20 transition-all duration-300 group"
        >
            <div className="flex items-center justify-between mb-3">
                <span className="text-[var(--color-text-secondary)] text-[11px] font-bold uppercase tracking-[0.2em]">
                    {label}
                </span>
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/15 transition-all">
                    <Icon size={16} className={color} strokeWidth={2} />
                </div>
            </div>
            <div className="flex items-baseline justify-between">
                <span className="text-[var(--color-text-primary)] text-2xl font-bold">
                    {value}
                </span>
                {trend && (
                    <span className="text-green-500 text-xs font-bold flex items-center gap-1">
                        <TrendingUp size={12} /> {trend}
                    </span>
                )}
            </div>
        </motion.div>
    );

    const AccessTimeline = () => {
        const timeline = [
            { time: '09:15 AM', action: 'Entry Approved', visitor: 'John Doe', status: 'approved' },
            { time: '09:32 AM', action: 'Entry Approved', visitor: 'Sarah Smith', status: 'approved' },
            { time: '10:05 AM', action: 'Exit Verified', visitor: 'Michael Chen', status: 'exited' },
            { time: '10:28 AM', action: 'Entry Rejected', visitor: 'Unknown Badge', status: 'rejected' },
        ];

        return (
            <div className="mt-6 pt-6 border-t border-[var(--color-border-soft)]">
                <h4 className="text-[var(--color-text-primary)] text-sm font-bold mb-4 uppercase tracking-wide">Today's Access Log</h4>
                <div className="space-y-2">
                    {timeline.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex items-center justify-between p-3 bg-[var(--color-bg-primary)] rounded-lg border border-[var(--color-border-soft)] text-[11px]"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-[var(--color-text-secondary)] font-bold">{item.time}</span>
                                <div className={`w-2 h-2 rounded-full ${
                                    item.status === 'approved' ? 'bg-green-500' :
                                    item.status === 'exited' ? 'bg-blue-500' :
                                    'bg-primary'
                                }`}></div>
                                <span className="text-[var(--color-text-secondary)]">{item.action}</span>
                            </div>
                            <span className="text-[var(--color-text-secondary)] opacity-75">{item.visitor}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[var(--color-surface-1)] border border-[var(--color-border-soft)] rounded-2xl p-6 hover:border-primary/20 transition-all duration-300"
        >
            <div className="mb-6">
                <h2 className="text-[var(--color-text-primary)] text-lg md:text-xl font-bold tracking-tight">Access Control</h2>
                <p className="text-[var(--color-text-secondary)] text-xs opacity-75 mt-1 uppercase tracking-[0.2em]">Entry & exit statistics</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatBox
                    label="Entries Approved"
                    value={stats.entriesApproved}
                    icon={LogIn}
                    trend="+3 today"
                    color="text-green-500"
                />
                <StatBox
                    label="Exits Verified"
                    value={stats.exitsVerified}
                    icon={LogOut}
                    trend="+2 today"
                    color="text-blue-500"
                />
                <StatBox
                    label="Pending Approvals"
                    value={stats.pendingApprovals}
                    icon={LogIn}
                    color="text-yellow-500"
                />
                <StatBox
                    label="Rejected Attempts"
                    value={stats.rejectedAttempts}
                    icon={AlertTriangle}
                    color="text-primary"
                />
            </div>

            <AccessTimeline />
        </motion.div>
    );
};

export default AccessControl;
