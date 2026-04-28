import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Shield, Zap, Server, RefreshCw } from 'lucide-react';

const SecurityStatus = () => {
    const [systemHealth, setSystemHealth] = useState(95);
    const [responseTime, setResponseTime] = useState(120);
    const [gateStatus, setGateStatus] = useState('all_operational');
    const [cameraStatus, setCameraStatus] = useState('all_online');

    const StatCard = ({ icon: Icon, label, value, unit, color, status }) => (
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
            <div className="flex items-baseline gap-2">
                <span className="text-[var(--color-text-primary)] text-2xl font-bold">
                    {value}
                </span>
                {unit && <span className="text-[var(--color-text-secondary)] text-xs opacity-75">{unit}</span>}
            </div>
            {status && (
                <p className="text-[10px] text-[var(--color-text-secondary)] mt-2 opacity-75">
                    {status}
                </p>
            )}
        </motion.div>
    );

    const healthStatus = systemHealth >= 95 ? 'Optimal' : systemHealth >= 80 ? 'Good' : 'Warning';
    const healthColor = systemHealth >= 95 ? 'text-green-500' : systemHealth >= 80 ? 'text-yellow-500' : 'text-primary';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
        >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                <div>
                    <h2 className="text-[var(--color-text-primary)] text-lg md:text-xl font-bold tracking-tight flex items-center gap-3">
                        <Shield size={20} className="text-primary" />
                        Security System Status
                    </h2>
                    <p className="text-[var(--color-text-secondary)] text-xs opacity-75 mt-1 uppercase tracking-[0.2em]">Infrastructure & gateway health</p>
                </div>
                <div className={`px-4 py-2 rounded-lg bg-${healthColor === 'text-green-500' ? 'green' : healthColor === 'text-yellow-500' ? 'yellow' : 'primary'}/10 border border-${healthColor === 'text-green-500' ? 'green' : healthColor === 'text-yellow-500' ? 'yellow' : 'primary'}/20`}>
                    <span className={`text-sm font-bold uppercase tracking-wide ${healthColor}`}>
                        {healthStatus}
                    </span>
                </div>
            </div>

            {/* Overall System Health Progress */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-[var(--color-surface-1)] border border-[var(--color-border-soft)] rounded-2xl p-6"
            >
                <div className="mb-4">
                    <div className="flex justify-between items-baseline mb-3">
                        <span className="text-[var(--color-text-primary)] text-sm font-bold uppercase tracking-[0.2em]">
                            System Integrity
                        </span>
                        <span className={`text-2xl font-bold ${healthColor}`}>
                            {systemHealth}%
                        </span>
                    </div>
                    <div className="h-3 bg-[var(--color-border-soft)] rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${systemHealth}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: 'easeInOut' }}
                            className={`h-full rounded-full ${
                                systemHealth >= 95
                                    ? 'bg-gradient-to-r from-green-500 to-green-400 shadow-[0_0_10px_#22c55e]'
                                    : systemHealth >= 80
                                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 shadow-[0_0_10px_#f59e0b]'
                                    : 'bg-gradient-to-r from-primary to-primary/70 shadow-[0_0_10px_var(--color-primary)]'
                            }`}
                        />
                    </div>
                </div>
                <p className="text-[var(--color-text-secondary)] text-xs opacity-75 uppercase tracking-widest">
                    Last checked: Just now
                </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    icon={Zap}
                    label="Response Time"
                    value={responseTime}
                    unit="ms"
                    color="text-primary"
                    status="Optimal performance"
                />
                <StatCard
                    icon={Server}
                    label="Entry Gates"
                    value="4/4"
                    color="text-green-500"
                    status="All operational"
                />
                <StatCard
                    icon={Activity}
                    label="Cameras"
                    value="12/12"
                    color="text-green-500"
                    status="All online"
                />
                <StatCard
                    icon={RefreshCw}
                    label="Data Sync"
                    value="✓"
                    color="text-green-500"
                    status="Synchronized"
                />
            </div>

            {/* Detailed Status */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-[var(--color-surface-1)] border border-[var(--color-border-soft)] rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                <div>
                    <h4 className="text-[var(--color-text-primary)] font-bold mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]"></div>
                        Entry Point Status
                    </h4>
                    <div className="space-y-2">
                        {['Gate 1', 'Gate 2', 'Gate 3', 'Gate 4'].map((gate) => (
                            <motion.div
                                key={gate}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="flex items-center justify-between p-3 bg-[var(--color-bg-primary)] rounded-lg border border-[var(--color-border-soft)]"
                            >
                                <span className="text-[var(--color-text-secondary)] text-sm">{gate}</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_6px_#22c55e]"></div>
                                    <span className="text-[10px] text-green-500 font-bold">Operational</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className="text-[var(--color-text-primary)] font-bold mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]"></div>
                        Security Features
                    </h4>
                    <div className="space-y-2">
                        {['Badge Scanning', 'QR Verification', 'Face Recognition', 'Visitor Log'].map((feature) => (
                            <motion.div
                                key={feature}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="flex items-center justify-between p-3 bg-[var(--color-bg-primary)] rounded-lg border border-[var(--color-border-soft)]"
                            >
                                <span className="text-[var(--color-text-secondary)] text-sm">{feature}</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_6px_#22c55e]"></div>
                                    <span className="text-[10px] text-green-500 font-bold">Active</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default SecurityStatus;
