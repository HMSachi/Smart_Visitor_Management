import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock, Shield } from 'lucide-react';

const SecurityAlerts = () => {
    const [alerts, setAlerts] = useState([
        { id: 1, type: 'warning', title: 'Unauthorized Badge Scan', description: 'Badge not recognized at Entry Gate 2', time: '5 mins ago', severity: 'high' },
        { id: 2, type: 'info', title: 'Entry Approved', description: 'Visitor cleared by Contact Person', time: '12 mins ago', severity: 'normal' },
        { id: 3, type: 'warning', title: 'QR Code Mismatch', description: 'QR scan failed verification check', time: '28 mins ago', severity: 'medium' },
        { id: 4, type: 'success', title: 'Visitor Exited', description: 'All visitors verified and exited', time: '1 hour ago', severity: 'normal' },
    ]);

    const getAlertIcon = (type) => {
        switch (type) {
            case 'warning': return AlertTriangle;
            case 'success': return CheckCircle;
            case 'info': return Clock;
            default: return Shield;
        }
    };

    const getAlertColor = (severity) => {
        switch (severity) {
            case 'high': return 'text-primary bg-primary/10 border-primary/20';
            case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case 'normal': return 'text-green-500 bg-green-500/10 border-green-500/20';
            default: return 'text-[var(--color-text-secondary)] bg-[var(--color-surface-1)] border-[var(--color-border-soft)]';
        }
    };

    const AlertCard = ({ alert, index }) => {
        const Icon = getAlertIcon(alert.type);
        return (
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 border rounded-lg flex items-start gap-4 hover:border-primary/30 transition-all group ${getAlertColor(alert.severity)}`}
            >
                <Icon size={18} className="flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                    <h4 className="text-[var(--color-text-primary)] text-sm font-bold">
                        {alert.title}
                    </h4>
                    <p className="text-[var(--color-text-secondary)] text-xs opacity-75 mt-1">
                        {alert.description}
                    </p>
                </div>
                <span className="text-[var(--color-text-secondary)] text-xs whitespace-nowrap opacity-75">
                    {alert.time}
                </span>
            </motion.div>
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
                <h2 className="text-[var(--color-text-primary)] text-lg md:text-xl font-bold tracking-tight flex items-center gap-3">
                    <AlertTriangle size={20} className="text-primary" />
                    Security Alerts
                </h2>
                <p className="text-[var(--color-text-secondary)] text-xs opacity-75 mt-1 uppercase tracking-[0.2em]">Real-time security events</p>
            </div>

            <div className="space-y-3">
                {alerts.map((alert, index) => (
                    <AlertCard key={alert.id} alert={alert} index={index} />
                ))}
            </div>
        </motion.div>
    );
};

export default SecurityAlerts;
