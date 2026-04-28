import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { History, LogIn, LogOut, Shield } from 'lucide-react';

const AccessLogs = () => {
    const [logs, setLogs] = useState([
        { id: 1, timestamp: '10:45 AM', visitorName: 'John Doe', action: 'Entry', location: 'Gate 1', status: 'Success', method: 'Badge Scan' },
        { id: 2, timestamp: '10:32 AM', visitorName: 'Sarah Smith', action: 'Entry', location: 'Gate 2', status: 'Success', method: 'QR Code' },
        { id: 3, timestamp: '10:15 AM', visitorName: 'Michael Chen', action: 'Exit', location: 'Gate 1', status: 'Success', method: 'QR Verification' },
        { id: 4, timestamp: '09:58 AM', visitorName: 'Emma Wilson', action: 'Entry', location: 'Gate 3', status: 'Failed', method: 'Badge Scan' },
        { id: 5, timestamp: '09:45 AM', visitorName: 'James Brown', action: 'Entry', location: 'Gate 2', status: 'Success', method: 'Badge Scan' },
    ]);

    const getActionIcon = (action) => {
        return action === 'Entry' ? <LogIn size={14} /> : <LogOut size={14} />;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Success': return 'text-green-500 bg-green-500/10 border-green-500/20';
            case 'Failed': return 'text-primary bg-primary/10 border-primary/20';
            case 'Pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            default: return 'text-[var(--color-text-secondary)] bg-[var(--color-surface-1)] border-[var(--color-border-soft)]';
        }
    };

    const LogRow = ({ log, index }) => (
        <motion.tr
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="group hover:bg-primary/5 transition-all border-b border-[var(--color-border-soft)]"
        >
            <td className="px-4 md:px-6 py-3 text-[var(--color-text-secondary)] text-xs font-mono">
                {log.timestamp}
            </td>
            <td className="px-4 md:px-6 py-3">
                <span className="text-[var(--color-text-primary)] text-sm font-bold">
                    {log.visitorName}
                </span>
            </td>
            <td className="px-4 md:px-6 py-3">
                <div className="flex items-center gap-2 text-[var(--color-text-secondary)] text-xs">
                    {getActionIcon(log.action)}
                    {log.action}
                </div>
            </td>
            <td className="px-4 md:px-6 py-3 text-[var(--color-text-secondary)] text-xs">
                <div className="flex items-center gap-2">
                    <Shield size={14} className="opacity-75" />
                    {log.location}
                </div>
            </td>
            <td className="px-4 md:px-6 py-3 text-center">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border shadow-sm inline-block ${getStatusColor(log.status)}`}>
                    {log.status}
                </span>
            </td>
            <td className="px-4 md:px-6 py-3 text-right">
                <span className="text-[var(--color-text-secondary)] text-xs opacity-75">
                    {log.method}
                </span>
            </td>
        </motion.tr>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[var(--color-surface-1)] border border-[var(--color-border-soft)] rounded-2xl p-6 hover:border-primary/20 transition-all duration-300"
        >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                <div>
                    <h2 className="text-[var(--color-text-primary)] text-lg md:text-xl font-bold tracking-tight flex items-center gap-3">
                        <History size={20} className="text-primary" />
                        Access Logs
                    </h2>
                    <p className="text-[var(--color-text-secondary)] text-xs opacity-75 mt-1 uppercase tracking-[0.2em]">Entry & exit transaction history</p>
                </div>
                <button className="mt-4 md:mt-0 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all text-xs font-bold uppercase tracking-wide">
                    Export Report
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] text-[12px] uppercase tracking-[0.2em] font-bold border-b border-[var(--color-border-soft)] sticky top-0">
                            <th className="px-4 md:px-6 py-3">Timestamp</th>
                            <th className="px-4 md:px-6 py-3">Visitor Name</th>
                            <th className="px-4 md:px-6 py-3">Action</th>
                            <th className="px-4 md:px-6 py-3">Location</th>
                            <th className="px-4 md:px-6 py-3 text-center">Status</th>
                            <th className="px-4 md:px-6 py-3 text-right">Method</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border-soft)]">
                        {logs.map((log, index) => (
                            <LogRow key={log.id} log={log} index={index} />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer Stats */}
            <div className="mt-6 pt-6 border-t border-[var(--color-border-soft)] grid grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <p className="text-[var(--color-text-secondary)] text-[10px] uppercase font-bold tracking-widest mb-2">
                        Total Transactions
                    </p>
                    <p className="text-2xl font-bold text-[var(--color-text-primary)]">{logs.length}</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 }}
                    className="text-center"
                >
                    <p className="text-[var(--color-text-secondary)] text-[10px] uppercase font-bold tracking-widest mb-2">
                        Successful
                    </p>
                    <p className="text-2xl font-bold text-green-500">{logs.filter(l => l.status === 'Success').length}</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-center"
                >
                    <p className="text-[var(--color-text-secondary)] text-[10px] uppercase font-bold tracking-widest mb-2">
                        Failed
                    </p>
                    <p className="text-2xl font-bold text-primary">{logs.filter(l => l.status === 'Failed').length}</p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AccessLogs;
