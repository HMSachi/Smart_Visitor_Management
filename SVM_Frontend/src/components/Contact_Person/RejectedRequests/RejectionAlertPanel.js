import React from 'react';
import { ShieldAlert, Info, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { useThemeMode } from '../../../theme/ThemeModeContext';

const RejectionAlertPanel = ({ visitor }) => {
    const { themeMode } = useThemeMode();
    const isLight = themeMode === "light";

    if (!visitor) return (
        <div className={`h-full border border-dashed p-6 md:p-12 flex flex-col items-center justify-center gap-4 text-center rounded-[32px] ${isLight ? "bg-white border-gray-200 shadow-sm" : "bg-white/5 border-white/10"}`}>
            <Info size={32} className={`${isLight ? "text-gray-200" : "text-white/10"}`} />
            <p className={`uppercase opacity-30 ${isLight ? "text-[#1A1A1A]" : "text-gray-300"}`}>Select a record to view rejection audit log</p>
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 md:space-y-8"
        >
             <div className={`p-4 md:p-10 border rounded-[32px] relative overflow-hidden transition-all duration-500 shadow-xl ${isLight ? "bg-white border-gray-200 shadow-gray-200/50" : "bg-black/40 border-primary/30"}`}>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
                
                <div className="flex items-center gap-4 mb-8">
                    <ShieldAlert size={18} className="text-primary" />
                    <h3 className={`uppercase underline underline-offset-8 decoration-primary/30 ${isLight ? "text-[#1A1A1A]" : "text-white"}`}>Protocol Violation Audit</h3>
                </div>

                <div className="space-y-4 mb-10">
                    <p className={`uppercase mb-1 ${isLight ? "text-gray-500" : "text-gray-300"}`}>Root Cause Determination</p>
                    <div className="p-4 bg-primary/10 border border-primary/20">
                        <p className="uppercase text-primary">{visitor.reason}</p>
                    </div>
                </div>

                <div className="space-y-4">
                     <p className={`uppercase mb-1 flex items-center gap-3 ${isLight ? "text-gray-500" : "text-gray-300"}`}>
                        <MessageSquare size={14} />
                        Internal Observations
                     </p>
                     <div className={`p-8 border ${isLight ? "bg-gray-50 border-gray-100" : "bg-white/[0.02] border-white/5"}`}>
                        <p className={`uppercase leading-6 ${isLight ? "text-[#1A1A1A]" : "text-white font-medium"}`}>
                            "{visitor.comments || 'No additional comments provided for this rejection node.'}"
                        </p>
                     </div>
                </div>
             </div>

             <div className={`p-8 border rounded-2xl ${isLight ? "bg-white border-gray-100" : "border-white/5 bg-white/[0.01]"}`}>
                <div className="flex justify-between items-center uppercase text-[12px] font-bold tracking-widest">
                    <span className={isLight ? "text-gray-400" : "text-gray-300"}>Status Code</span>
                    <span className="text-primary font-mono">R-BLOCK-4291</span>
                </div>
             </div>
        </motion.div>
    );
};

export default RejectionAlertPanel;
