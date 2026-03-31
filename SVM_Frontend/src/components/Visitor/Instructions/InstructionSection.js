import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Info } from 'lucide-react';

const InstructionSection = ({ title, items, type = 'info', icon: Icon, delay = 0 }) => {
    const isWarning = type === 'warning';
    
    // Fallback icon if none provided
    const DisplayIcon = Icon || (isWarning ? AlertTriangle : Info);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className={`p-10 md:p-12 rounded-[2.5rem] relative overflow-hidden group shadow-2xl transition-all duration-500 border ${ 
                isWarning 
                ? 'bg-mas-red/10 border-mas-red/20 hover:border-mas-red/40' 
                : 'bg-white/[0.02] border-white/5 hover:border-white/10' 
            }`}
        >
            {/* Background Decor */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-700 ${
                isWarning ? 'bg-mas-red/20 group-hover:bg-mas-red/40' : 'bg-white/5 group-hover:bg-white/10'
            }`} />

            <div className="flex items-center gap-4 mb-10 relative z-10">
                <div className={`p-3 rounded-xl flex items-center justify-center ${
                    isWarning ? 'bg-mas-red text-white shadow-[0_0_15px_#C8102E]' : 'bg-white/10 text-white'
                }`}>
                    <DisplayIcon size={20} className={isWarning ? 'animate-pulse' : ''} />
                </div>
                <div>
                    <h3 className={`text-xl font-medium uppercase tracking-tight italic ${ 
                        isWarning ? 'text-mas-red' : 'text-white' 
                    }`}>
                        {title}
                    </h3>
                    <p className={`text-[9px] font-medium uppercase tracking-[0.2em] ${isWarning ? 'text-mas-red/60' : 'text-gray-500'}`}>
                        Protocol Category
                    </p>
                </div>
            </div>

            <ul className="space-y-6 relative z-10">
                {items.map((item, idx) => (
                    <motion.li 
                        key={idx}
                        whileHover={{ x: 5 }}
                        className="flex items-start group/item cursor-default"
                    >
                        <div className={`mt-1.5 mr-4 shrink-0 transition-transform duration-300 group-hover/item:scale-125 flex items-center justify-center ${ 
                            isWarning ? 'text-mas-red' : 'text-gray-600 group-hover/item:text-white' 
                        }`}>
                            •
                        </div>
                        <span className={`text-[11px] font-medium leading-relaxed tracking-wide uppercase ${
                            isWarning ? 'text-mas-red/80 group-hover/item:text-mas-red' : 'text-gray-400 group-hover/item:text-gray-200'
                        } transition-colors`}>
                            {item}
                        </span>
                    </motion.li>
                ))}
            </ul>
        </motion.div>
    );
};

export default InstructionSection;
