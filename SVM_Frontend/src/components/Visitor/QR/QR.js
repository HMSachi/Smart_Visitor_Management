import React from 'react';
import { motion } from 'framer-motion';
import { Download, Printer, Share2, ShieldCheck, ArrowLeft, Smartphone } from 'lucide-react';
import QRDisplay from './QRDisplay';

const QRMain = () => {
    const visitorData = {
        name: 'SACHINTHA DESHAN',
        date: 'MAR 25, 2026',
        refId: 'MAS-VAS-092283',
        zone: 'CORPORATE SECTOR A'
    };

    return (
        <div className="max-w-md mx-auto px-6 py-12 bg-mas-dark-900 min-h-screen flex flex-col items-center">
            {/* Header Section */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-10 h-[2.5px] bg-mas-red" />
                    <span className="text-mas-red font-black uppercase tracking-[0.4em] text-[10px]">Access Granted</span>
                </div>
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none italic">
                    Digital <span className="text-mas-red">Pass</span>
                </h1>
                <p className="text-gray-500 text-[10px] uppercase font-black tracking-[0.2em] mt-2">Facility Access Key [ID: {visitorData.refId}]</p>
            </motion.div>

            {/* Digital Pass Card Container */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="w-full relative z-10 mb-12 group"
            >
                <div className="absolute inset-0 bg-mas-red/20 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-700" />
                <div className="relative bg-white/[0.03] border border-white/10 p-2 rounded-[3.5rem] shadow-2xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
                    <QRDisplay visitorData={visitorData} />
                </div>
            </motion.div>

            {/* Action Grid */}
            <div className="grid grid-cols-2 gap-4 w-full mb-12">
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center gap-3 py-5 bg-mas-red text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-[0_15px_30px_rgba(200,16,46,0.2)] hover:shadow-[0_15px_40px_rgba(200,16,46,0.4)] transition-all"
                >
                    <Download size={16} /> Save Pass
                </motion.button>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.print()} 
                    className="flex items-center justify-center gap-3 py-5 bg-white/[0.03] border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/[0.07] transition-all"
                >
                    <Printer size={16} /> Print Pass
                </motion.button>
            </div>

            {/* Security Notice Footer */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="w-full bg-white/[0.02] border border-white/5 p-8 rounded-3xl"
            >
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-mas-red/10 border border-mas-red/20 flex items-center justify-center text-mas-red shrink-0">
                        <Smartphone size={20} className="animate-pulse" />
                    </div>
                    <div>
                        <p className="text-white text-[11px] font-black uppercase tracking-widest mb-1 italic">Facility Access Instructions</p>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                            Present this encrypted Pass at the <span className="text-white">Main Security Gate Node</span> for biometric & scanning protocols.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Return Button */}
            <motion.button 
                whileHover={{ x: -10 }}
                onClick={() => window.location.href='/status'}
                className="mt-12 flex items-center gap-3 text-gray-600 hover:text-mas-red text-[10px] font-black uppercase tracking-widest transition-colors"
            >
                <ArrowLeft size={16} /> Back to Status Node
            </motion.button>
        </div>
    );
};

export default QRMain;
