import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, XCircle, AlertTriangle, Zap } from 'lucide-react';

const StatusCard = ({ status }) => {
    const config = {
        'step1_pending': { 
            color: 'text-mas-red', 
            bg: 'bg-mas-red/10', 
            border: 'border-mas-red/20', 
            label: 'PHASE 1 REVIEW', 
            icon: Clock,
            desc: 'Primary protocol initialization active.'
        },
        'step1_approved': { 
            color: 'text-blue-500', 
            bg: 'bg-blue-500/10', 
            border: 'border-blue-500/20', 
            label: 'PHASE 1 AUTHORIZED', 
            icon: ShieldCheck,
            desc: 'Secondary documentation required.'
        },
        'step2_pending': { 
            color: 'text-mas-red', 
            bg: 'bg-mas-red/10', 
            border: 'border-mas-red/20', 
            label: 'FINAL CLEARANCE', 
            icon: Zap,
            desc: 'Detailed verification in progress.'
        },
        'fully_approved': { 
            color: 'text-green-500', 
            bg: 'bg-green-500/10', 
            border: 'border-green-500/20', 
            label: 'FACILITY AUTHORIZED', 
            icon: ShieldCheck,
            desc: 'Digital pass is now synchronized.'
        },
        'rejected': { 
            color: 'text-mas-red', 
            bg: 'bg-mas-red/20', 
            border: 'border-mas-red/40', 
            label: 'ACCESS DENIED', 
            icon: XCircle,
            desc: 'Security clearance failure detected.'
        }
    };

    const current = config[status] || config.step1_pending;
    const Icon = current.icon;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative p-10 md:p-14 bg-white/[0.03] border border-white/10 rounded-[2.5rem] overflow-hidden group shadow-2xl transition-all duration-500`}
        >
            {/* Status Glow Overlay */}
            <div className={`absolute -right-32 -bottom-32 w-80 h-80 ${current.bg.replace('/10', '/5')} rounded-full blur-[100px] transition-colors duration-1000`}></div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                <div className="flex items-center gap-8 text-center md:text-left flex-col md:flex-row">
                    <div className={`w-20 h-20 md:w-24 md:h-24 rounded-3xl ${current.bg} border ${current.border} flex items-center justify-center ${current.color} shadow-2xl`}>
                        <Icon size={40} className={status === 'step1_pending' || status === 'step2_pending' ? 'animate-pulse' : ''} />
                    </div>
                    <div>
                        <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${current.color} mb-3 block`}>Live Protocol Status</span>
                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic mb-2">
                            {current.label}
                        </h2>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{current.desc}</p>
                    </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-3xl px-10 py-8 text-center md:text-right w-full md:w-auto">
                    <span className="text-gray-500 text-[9px] font-black uppercase tracking-[0.3em] block mb-2">Internal Priority</span>
                    <div className="flex items-center justify-center md:justify-end gap-3">
                        <span className="text-white text-lg font-black uppercase tracking-widest tabular-nums italic">High Node</span>
                        <div className="w-2 h-2 rounded-full bg-mas-red shadow-[0_0_10px_#C8102E] animate-ping" />
                    </div>
                    <p className="mt-4 text-[8px] text-gray-700 font-bold uppercase tracking-widest">Target Facility: MAS Holdings</p>
                </div>
            </div>
            
            {/* Progress Bar Shimmer */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/[0.03]">
                <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                    className="w-1/3 h-full bg-gradient-to-r from-transparent via-mas-red/20 to-transparent" 
                />
            </div>
        </motion.div>
    );
};

export default StatusCard;
