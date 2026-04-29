import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock, TrendingDown, ShieldCheck } from 'lucide-react';

const IncidentMonitoring = () => {
    const { incidents = [] } = useSelector((state) => state.security);

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high': return 'text-primary bg-primary/10 border-primary/20';
            case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case 'low': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            default: return 'text-[var(--color-text-secondary)] bg-[var(--color-surface-1)] border-[var(--color-border-soft)]';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'resolved': return <CheckCircle size={16} className="text-green-500" />;
            case 'investigating': return <Clock size={16} className="text-yellow-500" />;
            case 'pending_action': return <AlertTriangle size={16} className="text-primary" />;
            default: return null;
        }
    };

    const IncidentCard = ({ incident, index }) => (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className={`border rounded-lg p-4 hover:border-primary/30 transition-all group ${getSeverityColor(incident.severity)}`}
        >
            <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                    <h4 className="text-[var(--color-text-primary)] text-sm font-bold mb-1">
                        {incident.type}
                    </h4>
                    <p className="text-[var(--color-text-secondary)] text-xs opacity-75 mb-2">
                        {incident.description}
                    </p>
                    <div className="flex items-center gap-4 flex-wrap">
                        <span className="text-[10px] text-[var(--color-text-secondary)] opacity-75 flex items-center gap-1">
                            <Clock size={12} /> {incident.timestamp}
                        </span>
                        <span className="text-[10px] text-[var(--color-text-secondary)] opacity-75">
                            📍 {incident.location}
                        </span>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    {getStatusIcon(incident.status)}
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-text-secondary)]">
                        {incident.status.replace('_', ' ')}
                    </span>
                </div>
            </div>
        </motion.div>
    );

    const totalIncidents = incidents.length;
    const resolvedCount = incidents.filter(i => i.status === 'resolved').length;
    const resolutionRate = totalIncidents > 0 ? Math.round((resolvedCount / totalIncidents) * 100) : 100;

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
                        <AlertTriangle size={20} className="text-primary" />
                        Incident Monitoring
                    </h2>
                    <p className="text-[var(--color-text-secondary)] text-xs opacity-75 mt-1 uppercase tracking-[0.2em]">Security incidents today</p>
                </div>
                <div className="flex items-center gap-3 mt-4 md:mt-0 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <TrendingDown size={16} className="text-green-500" />
                    <div>
                        <p className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest">Resolution Rate</p>
                        <p className="text-lg font-bold text-green-500">{resolutionRate}%</p>
                    </div>
                </div>
            </div>

            <div className="space-y-3 mb-6">
                {incidents.length > 0 ? (
                    incidents.map((incident, index) => (
                        <IncidentCard key={incident.id} incident={incident} index={index} />
                    ))
                ) : (
                    <div className="py-12 flex flex-col items-center justify-center border border-dashed border-[var(--color-border-soft)] rounded-xl bg-white/[0.01]">
                        <ShieldCheck size={48} className="text-green-500/20 mb-4" />
                        <p className="text-[var(--color-text-secondary)] text-sm font-medium">No security incidents reported today</p>
                        <p className="text-[var(--color-text-dim)] text-[10px] uppercase tracking-widest mt-1">All systems clear</p>
                    </div>
                )}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[var(--color-border-soft)]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <p className="text-[var(--color-text-secondary)] text-[10px] uppercase font-bold tracking-widest mb-2">
                        Total Incidents
                    </p>
                    <p className="text-2xl font-bold text-[var(--color-text-primary)]">{totalIncidents}</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 }}
                    className="text-center"
                >
                    <p className="text-[var(--color-text-secondary)] text-[10px] uppercase font-bold tracking-widest mb-2">
                        Resolved
                    </p>
                    <p className="text-2xl font-bold text-green-500">{resolvedCount}</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-center"
                >
                    <p className="text-[var(--color-text-secondary)] text-[10px] uppercase font-bold tracking-widest mb-2">
                        Pending Action
                    </p>
                    <p className="text-2xl font-bold text-primary">{totalIncidents - resolvedCount}</p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default IncidentMonitoring;
