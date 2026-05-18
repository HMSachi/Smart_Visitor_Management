import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { History, LogIn, LogOut, Shield } from 'lucide-react';

const AccessLogs = () => {
    const { accessLogs: logs } = useSelector((state) => state.security);

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
            <td className="px-2.5 md:px-6 py-1.5 text-[var(--color-text-secondary)] font-mono font-normal text-[12px]">
                {log.timestamp}
            </td>
            <td className="px-2.5 md:px-6 py-1.5 font-normal text-[12px]">
                <span className="text-[var(--color-text-primary)] text-sm font-bold">
                    {log.visitorName}
                </span>
            </td>
            <td className="px-2.5 md:px-6 py-1.5 font-normal text-[12px]">
                <div className="flex items-center gap-2 text-[var(--color-text-secondary)] text-xs">
                    {getActionIcon(log.action)}
                    {log.action}
                </div>
            </td>
            <td className="px-2.5 md:px-6 py-1.5 text-[var(--color-text-secondary)] font-normal text-[12px]">
                <div className="flex items-center gap-2">
                    <Shield size={14} className="opacity-75" />
                    {log.location}
                </div>
            </td>
            <td className="px-2.5 md:px-6 py-1.5 text-center font-normal text-[12px]">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border shadow-sm inline-block ${getStatusColor(log.status)}`}>
                    {log.status}
                </span>
            </td>
            <td className="px-2.5 md:px-6 py-1.5 text-right font-normal text-[12px]">
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
            className="bg-[var(--color-bg-paper)] border border-[var(--color-border-soft)] rounded-[10px] p-6 hover:border-[var(--color-border-medium)] transition-all duration-500 shadow-2xl group relative overflow-hidden"
        >
            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary group-hover:w-full transition-all duration-700 shadow-[0_0_10px_var(--color-primary)] z-20"></div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 relative z-10">
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
                        <tr className="bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] text-[12px] uppercase tracking-[0.2em] font-normal border-b border-[var(--color-border-soft)] sticky top-0">
                            <th className="px-2.5 md:px-6 py-1.5 font-normal text-[12px]">Timestamp</th>
                            <th className="px-2.5 md:px-6 py-1.5 font-normal text-[12px]">Visitor Name</th>
                            <th className="px-2.5 md:px-6 py-1.5 font-normal text-[12px]">Action</th>
                            <th className="px-2.5 md:px-6 py-1.5 font-normal text-[12px]">Location</th>
                            <th className="px-2.5 md:px-6 py-1.5 text-center font-normal text-[12px]">Status</th>
                            <th className="px-2.5 md:px-6 py-1.5 text-right font-normal text-[12px]">Method</th>
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
