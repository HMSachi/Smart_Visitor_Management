import React from 'react';
import { ShieldAlert, Info, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RejectionAlertPanel = ({ visitor }) => {
    if (!visitor) return (
        <div className="h-full mas-glass border-mas-border border-dashed p-12 flex flex-col items-center justify-center gap-4 text-center">
            <Info size={32} className="text-white/10" />
            <p className="text-mas-text-dim uppercase opacity-30">Select a record to view rejection audit log</p>
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
             <div className="mas-glass border-mas-red/30 p-10 bg-mas-red/[0.02] relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-mas-red/5 rounded-full blur-3xl"></div>
                
                <div className="flex items-center gap-4 mb-8">
                    <ShieldAlert size={18} className="text-mas-red" />
                    <h3 className="uppercase text-white underline underline-offset-8 decoration-mas-red/30">Protocol Violation Audit</h3>
                </div>

                <div className="space-y-4 mb-10">
                    <p className="text-mas-text-dim uppercase mb-1">Root Cause Determination</p>
                    <div className="p-4 bg-mas-red/10 border border-mas-red/20">
                        <p className="uppercase text-mas-red">{visitor.reason}</p>
                    </div>
                </div>

                <div className="space-y-4">
                     <p className="text-mas-text-dim uppercase mb-1 flex items-center gap-3">
                        <MessageSquare size={14} />
                        Internal Observations
                     </p>
                     <div className="p-8 bg-white/[0.02] border border-white/5">
                        <p className="text-white uppercase leading-6">
                            "{visitor.comments || 'No additional comments provided for this rejection node.'}"
                        </p>
                     </div>
                </div>
             </div>

             <div className="p-8 border border-white/5 bg-white/[0.01]">
                <div className="flex justify-between items-center uppercase">
                    <span className="text-mas-text-dim">Status Code</span>
                    <span className="text-mas-red">R-BLOCK-4291</span>
                </div>
             </div>
        </motion.div>
    );
};

export default RejectionAlertPanel;
