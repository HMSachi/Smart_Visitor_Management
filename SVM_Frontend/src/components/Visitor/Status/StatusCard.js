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
        <div className="relative p-6 bg-white/[0.01] border border-white/5 rounded-xl transition-all duration-300">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6 text-center md:text-left flex-col md:flex-row">
                    <div className={`w-10 h-10 rounded-lg ${current.bg} border ${current.border} flex items-center justify-center ${current.color}`}>
                        <Icon size={18} />
                    </div>
                    <div>
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${current.color} mb-1 block`}>Clearance Status</span>
                        <h2 className="text-base font-bold text-white uppercase tracking-tight mb-0.5">
                            {current.label}
                        </h2>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">{current.desc}</p>
                    </div>
                </div>

                <div className="px-5 py-3 border-l border-white/5 text-center md:text-right w-full md:w-auto flex flex-col justify-center items-center md:items-end">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-gray-600 text-[9px] font-bold uppercase tracking-widest">Node Node</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-mas-red/40" />
                    </div>
                    <span className="text-white text-[11px] font-bold uppercase tracking-widest tabular-nums italic">MAS CORE 01</span>
                    
                    {status === 'step1_approved' ? (
                        <button 
                            onClick={() => window.location.href='/request-step-2'}
                            className="compact-btn mt-4 !w-full md:!w-auto"
                        >
                            Complete Phase 2
                        </button>
                    ) : (
                        <p className="mt-2 text-[9px] text-gray-700 font-bold uppercase tracking-widest">Facility: MAS HOLDINGS</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatusCard;
