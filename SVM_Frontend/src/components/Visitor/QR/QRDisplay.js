import React from 'react';
import { motion } from 'framer-motion';
import { User, Shield, MapPin, Calendar, QrCode } from 'lucide-react';

const QRDisplay = ({ visitorData }) => {
    return (
        <div className="relative bg-white flex flex-col items-center rounded-xl overflow-hidden shadow-xl">
            {/* Pass Header */}
            <div className="w-full bg-background p-6 flex justify-between items-center border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white">
                        <Shield size={14} />
                    </div>
                    <div>
                        <p className="text-[12px] font-bold text-white uppercase tracking-widest leading-tight">MAS HOLDINGS</p>
                        <p className="text-[14px] font-bold text-gray-700 uppercase tracking-widest">ACCESS NODE 01</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[14px] font-bold text-primary uppercase tracking-widest">SECURITY_ACTIVE</p>
                </div>
            </div>

            {/* QR Section */}
            <div className="p-8 flex flex-col items-center w-full">
                <div className="relative group/qr p-3 bg-gray-50 rounded-xl border border-gray-100 transition-colors">
                    <div className="w-48 h-48 relative overflow-hidden flex items-center justify-center p-2 bg-white rounded-lg shadow-sm">
                        <div className="absolute inset-0 flex flex-wrap gap-1 p-2 opacity-90">
                            {[...Array(64)].map((_, i) => (
                                <div key={i} className={`w-[11%] h-[11%] ${Math.random() > 0.4 ? 'bg-black' : 'bg-transparent'}`} />
                            ))}
                        </div>
                        
                        {/* Minimal Scan Line */}
                        <motion.div 
                            animate={{ top: ['0%', '100%'], opacity: [0, 0.5, 0.5, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                            className="absolute left-0 w-full h-[1px] bg-primary z-20" 
                        />
                        
                        <div className="absolute inset-0 flex items-center justify-center z-30">
                            <div className="w-10 h-10 bg-white p-1.5 rounded-lg shadow-sm border border-gray-100 flex items-center justify-center">
                                <Shield size={20} className="text-primary" />
                            </div>
                        </div>
                    </div>
                </div>
                <p className="mt-4 text-[14px] font-bold text-gray-400 uppercase tracking-widest">SCAN AT TERMINAL</p>
            </div>

            {/* Holder Information */}
            <div className="w-full px-8 pb-8 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 mb-1">
                            <User size={10} className="text-primary" />
                            <span className="text-[14px] font-bold text-gray-400 uppercase tracking-widest">Holder</span>
                        </div>
                        <p className="text-[12px] font-bold text-black uppercase tracking-tight truncate">{visitorData.name}</p>
                    </div>
                    <div className="space-y-0.5 text-right">
                        <div className="flex items-center gap-1.5 mb-1 justify-end">
                            <Calendar size={10} className="text-primary" />
                            <span className="text-[14px] font-bold text-gray-400 uppercase tracking-widest">Date</span>
                        </div>
                        <p className="text-[12px] font-bold text-black uppercase tracking-tight">{visitorData.date}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 mb-1">
                            <QrCode size={10} className="text-primary" />
                            <span className="text-[14px] font-bold text-gray-400 uppercase tracking-widest">Clearance</span>
                        </div>
                        <p className="text-[13px] font-bold text-gray-700 font-mono tracking-tight">{visitorData.refId}</p>
                    </div>
                    <div className="space-y-0.5 text-right">
                        <div className="flex items-center gap-1.5 mb-1 justify-end">
                            <MapPin size={10} className="text-primary" />
                            <span className="text-[14px] font-bold text-gray-400 uppercase tracking-widest">Zone</span>
                        </div>
                        <p className="text-[13px] font-bold text-primary uppercase bg-primary/5 px-2 py-0.5 rounded tracking-tighter">
                            {visitorData.zone}
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Security Strips */}
            <div className="w-full flex h-1.5">
                <div className="flex-1 bg-primary" />
                <div className="flex-1 bg-background" />
                <div className="flex-1 bg-primary" />
                <div className="flex-1 bg-background" />
                <div className="flex-1 bg-primary" />
            </div>
        </div>
    );
};

export default QRDisplay;
