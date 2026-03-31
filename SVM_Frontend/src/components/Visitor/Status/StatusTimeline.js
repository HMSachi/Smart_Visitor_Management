import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Circle } from 'lucide-react';

const StatusTimeline = ({ currentStage }) => {
    // Logic to determine status based on currentStage
    const getStatus = (id) => {
        const order = ['submitted', 'step1_pending', 'step1_approved', 'step2_pending', 'fully_approved'];
        const currentIndex = order.indexOf(currentStage);
        const stageIndex = order.indexOf(id);

        if (stageIndex < currentIndex) return 'completed';
        if (stageIndex === currentIndex) return 'active';
        return 'upcoming';
    };

const stages = [];

    // Helper for missing icons in previous thought, using standard lucide
    const stagesFixed = [
        { id: 'submitted', label: 'Protocol Initialized', time: 'MAR 24, 10:45 AM', icon: Check },
        { id: 'step1_pending', label: 'Primary Authorization', time: 'Under MAS Review', icon: Clock },
        { id: 'step2_pending', label: 'Detailed Clearance', time: 'Verification Phase', icon: Clock },
        { id: 'fully_approved', label: 'Access Granted', time: 'Digital Pass Ready', icon: Check }
    ];

    return (
        <div className="space-y-8 relative px-2">
            {/* High-Tech Vertical Line */}
            <div className="absolute left-[15px] top-4 bottom-4 w-[1px] bg-gradient-to-b from-mas-red via-white/10 to-white/5 opacity-50"></div>
            
            {stagesFixed.map((stage, idx) => {
                const status = getStatus(stage.id);
                return (
                    <motion.div 
                        key={stage.id} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative pl-14 group"
                    >
                        {/* Node Architecture */}
                        <div className={`absolute left-0 top-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-700 z-10 ${ 
                            status === 'completed' 
                            ? 'bg-mas-red border-mas-red shadow-[0_0_15px_rgba(200,16,46,0.4)]' 
                            : status === 'active' 
                            ? 'bg-mas-dark-800 border-mas-red animate-pulse shadow-[0_0_20px_#C8102E]' 
                            : 'bg-mas-dark-900 border-white/10 group-hover:border-white/30' 
                        }`}>
                            {status === 'completed' ? (
                                <Check size={14} className="text-white" strokeWidth={4} />
                            ) : status === 'active' ? (
                                <div className="w-2 h-2 bg-mas-red rounded-full" />
                            ) : (
                                <Circle size={8} className="text-gray-800" fill="currentColor" />
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <h4 className={`text-[11px] font-normal uppercase tracking-[0.2em] transition-colors ${ 
                                status === 'upcoming' ? 'text-gray-400' : status === 'active' ? 'text-mas-red underline underline-offset-4 decoration-mas-red/20' : 'text-white' 
                            }`}>
                                {stage.label}
                            </h4>
                             <div className="flex items-center gap-3">
                                <span className={`text-[9px] font-normal uppercase tracking-widest ${ 
                                    status === 'active' ? 'text-mas-red' : 'text-gray-300' 
                                }`}>
                                    {status === 'active' ? 'NODE ACTIVE' : stage.time}
                                </span>
                                {status === 'completed' && (
                                    <span className="text-[8px] font-medium text-mas-red/80 uppercase tracking-tighter">Verified</span>
                                )}
                            </div>
                        </div>

                        {/* Hover Detail Card Overlay (Integrated Below) */}
                        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 max-h-0 group-hover:max-h-20 overflow-hidden pointer-events-none hidden md:block">
                            <div className="bg-white/[0.03] border border-white/10 p-4 rounded-xl backdrop-blur-md inline-block">
                                <p className="text-[9px] text-gray-400 uppercase font-medium tracking-widest mb-1">Target Module</p>
                                <p className="text-white text-[10px] font-normal">Facility Clearance Section {idx + 1}</p>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default StatusTimeline;
