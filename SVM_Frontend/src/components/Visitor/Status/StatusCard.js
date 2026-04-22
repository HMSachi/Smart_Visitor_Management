import React from 'react';
import { ShieldCheck, Clock, XCircle, Zap } from 'lucide-react';

const StatusCard = ({ status }) => {
    const config = {
        'step1_pending': { 
            color: 'text-primary', 
            bg: 'bg-primary/10', 
            border: 'border-primary/20', 
            label: 'Reviewing by Contact Person', 
            icon: Clock,
            desc: 'Sent to Contact Person for initial verification.'
        },
        'step1_approved': { 
            color: 'text-blue-500', 
            bg: 'bg-blue-500/10', 
            border: 'border-blue-500/20', 
            label: 'Approved by Contact Person', 
            icon: ShieldCheck,
            desc: 'Secondary verification needed.'
        },
        'step2_pending': { 
            color: 'text-primary', 
            bg: 'bg-primary/10', 
            border: 'border-primary/20', 
            label: 'Pending Admin Approval', 
            icon: Zap,
            desc: 'Sent to Administrator for final authorization.'
        },
        'fully_approved': { 
            color: 'text-green-500', 
            bg: 'bg-green-500/10', 
            border: 'border-green-500/20', 
            label: 'Access Approved', 
            icon: ShieldCheck,
            desc: 'Your visitor pass is ready.'
        },
        'rejected': { 
            color: 'text-primary', 
            bg: 'bg-primary/20', 
            border: 'border-primary/40', 
            label: 'Request Declined', 
            icon: XCircle,
            desc: 'Access authorization failed.'
        }
    };

    const current = config[status] || config.step1_pending;
    const Icon = current.icon;

    return (
        <div className="relative p-6 bg-white/[0.01] border border-white/5 rounded-xl transition-all duration-300">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-left flex-col md:flex-row">
                    <div className={`w-10 h-10 rounded-lg ${current.bg} border ${current.border} flex items-center justify-center ${current.color}`}>
                        <Icon size={18} />
                    </div>
                    <div>
                        <span className={`text-[12px] font-bold uppercase tracking-widest ${current.color} mb-1 block`}>Current Status</span>
                        <h2 className="text-base font-bold text-white uppercase tracking-tight mb-0.5">
                            {current.label}
                        </h2>
                        <p className="text-gray-500 text-[13px] font-bold uppercase tracking-wider">{current.desc}</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StatusCard;
