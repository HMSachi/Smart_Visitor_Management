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
            className={`relative p-6 md:p-8 bg-white/[0.03] border border-white/10 rounded-[2rem] overflow-hidden group shadow-2xl transition-all duration-500`}
        >
            {/* Status Glow Overlay */}
            <div className={`absolute -right-32 -bottom-32 w-80 h-80 ${current.bg.replace('/10', '/5')} rounded-full blur-[100px] transition-colors duration-1000`}></div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                <div className="flex items-center gap-8 text-center md:text-left flex-col md:flex-row">
                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl ${current.bg} border ${current.border} flex items-center justify-center ${current.color} shadow-2xl`}>
                        <Icon size={24} className={status === 'step1_pending' || status === 'step2_pending' ? 'animate-pulse' : ''} />
                    </div>
                    <div>
                        <span className={`text-[8px] font-medium uppercase tracking-[0.4em] ${current.color} mb-2 block`}>Live Protocol Status</span>
                        <h2 className="text-xl md:text-2xl font-medium text-white uppercase tracking-tight mb-1">
                            {current.label}
                        </h2>
                        <p className="text-gray-300 text-[9px] font-medium uppercase tracking-widest">{current.desc}</p>
                    </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4 text-center md:text-right w-full md:w-auto flex flex-col justify-center items-center md:items-end">
                    <span className="text-gray-400 text-[8px] font-medium uppercase tracking-[0.3em] block mb-1">Internal Priority</span>
                    <div className="flex items-center justify-center md:justify-end gap-2">
                        <span className="text-white text-base font-medium uppercase tracking-widest tabular-nums">High Node</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-mas-red shadow-[0_0_8px_#C8102E] animate-ping" />
                    </div>
                    {status === 'step1_approved' || status === 'step1_pending' ? (
                        <button 
                            onClick={() => window.location.href='/request-step-2'}
                            className="mt-6 w-full px-6 py-3 bg-mas-red text-white text-[10px] font-medium uppercase tracking-widest rounded-xl shadow-[0_10px_20px_rgba(200,16,46,0.3)] hover:shadow-[0_10px_30px_rgba(200,16,46,0.5)] transition-all animate-pulse"
                        >
                            Proceed to Form 02
                        </button>
                    ) : (
                        <p className="mt-4 text-[8px] text-gray-400 font-medium uppercase tracking-widest">Target Facility: MAS Holdings</p>
                    )}
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
