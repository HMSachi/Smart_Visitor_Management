import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, MapPin, Clock, Shield } from 'lucide-react';

const ActiveVisitors = () => {
    const [visitors, setVisitors] = useState([
        { id: 1, name: 'John Doe', location: 'Building A - Floor 2', duration: '2 hrs 15 mins', badge: '#4521', status: 'approved' },
        { id: 2, name: 'Sarah Smith', location: 'Building B - Reception', duration: '1 hr 40 mins', badge: '#4522', status: 'approved' },
        { id: 3, name: 'Michael Chen', location: 'Building A - Conference Room', duration: '45 mins', badge: '#4523', status: 'approved' },
        { id: 4, name: 'Emma Wilson', location: 'Building C - Lab', duration: '30 mins', badge: '#4524', status: 'approved' },
        { id: 5, name: 'James Brown', location: 'Building A - Waiting Area', duration: '15 mins', badge: '#4525', status: 'pending' },
    ]);

    const VisitorRow = ({ visitor, index }) => (
        <motion.tr
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="group hover:bg-primary/5 transition-all border-b border-[var(--color-border-soft)]"
        >
            <td className="px-4 md:px-6 py-3">
                <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${
                        visitor.status === 'approved' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-yellow-500 shadow-[0_0_8px_#f59e0b]'
                    }`}></div>
                    <span className="text-[var(--color-text-primary)] text-sm font-bold">
                        {visitor.name}
                    </span>
                </div>
            </td>
            <td className="px-4 md:px-6 py-3 text-[var(--color-text-secondary)] text-xs flex items-center gap-2">
                <MapPin size={14} className="opacity-75" />
                {visitor.location}
            </td>
            <td className="px-4 md:px-6 py-3 text-[var(--color-text-secondary)] text-xs">
                <div className="flex items-center gap-2">
                    <Clock size={14} className="opacity-75" />
                    {visitor.duration}
                </div>
            </td>
            <td className="px-4 md:px-6 py-3 text-center">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border shadow-sm ${
                    visitor.status === 'approved'
                        ? 'text-green-500 bg-green-500/10 border-green-500/20'
                        : 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
                }`}>
                    {visitor.status}
                </span>
            </td>
            <td className="px-4 md:px-6 py-3 text-right">
                <span className="text-[var(--color-text-secondary)] text-xs font-mono">{visitor.badge}</span>
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
                        <Users size={20} className="text-primary" />
                        Active Visitors On-Premise
                    </h2>
                    <p className="text-[var(--color-text-secondary)] text-xs opacity-75 mt-1 uppercase tracking-[0.2em]">
                        Real-time visitor tracking ({visitors.length} present)
                    </p>
                </div>
                <div className="flex items-center gap-2 mt-4 md:mt-0">
                    <Shield size={18} className="text-green-500" />
                    <span className="text-sm font-bold text-[var(--color-text-primary)]">All Secure</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] text-[12px] uppercase tracking-[0.2em] font-bold border-b border-[var(--color-border-soft)] sticky top-0">
                            <th className="px-4 md:px-6 py-3">Visitor Name</th>
                            <th className="px-4 md:px-6 py-3">Location</th>
                            <th className="px-4 md:px-6 py-3">Duration</th>
                            <th className="px-4 md:px-6 py-3 text-center">Status</th>
                            <th className="px-4 md:px-6 py-3 text-right">Badge ID</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border-soft)]">
                        {visitors.map((visitor, index) => (
                            <VisitorRow key={visitor.id} visitor={visitor} index={index} />
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default ActiveVisitors;
