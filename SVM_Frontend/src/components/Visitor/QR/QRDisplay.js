import React from 'react';
import { motion } from 'framer-motion';
import { User, Shield, MapPin, Calendar, QrCode } from 'lucide-react';

const QRDisplay = ({ visitorData }) => {
    return (
        <div className="relative bg-white flex flex-col items-center rounded-[3rem] overflow-hidden shadow-2xl">
            {/* Pass Header */}
            <div className="w-full bg-mas-dark-900 p-8 flex justify-between items-center border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-mas-red rounded-lg flex items-center justify-center text-white">
                        <Shield size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] font-medium text-white uppercase tracking-[0.2em] italic leading-tight">MAS Holdings</p>
                        <p className="text-[8px] font-medium text-gray-500 uppercase tracking-widest">Access Node 01</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[8px] font-medium text-mas-red uppercase tracking-widest animate-pulse">Security Active</p>
                    <p className="text-[10px] font-medium text-white uppercase tracking-tighter italic">Facility Pass</p>
                </div>
            </div>

            {/* QR Section */}
            <div className="p-10 flex flex-col items-center w-full">
                <div className="relative group/qr p-4 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 hover:border-mas-red/40 transition-colors">
                    {/* QR Content Mockup */}
                    <div className="w-56 h-56 md:w-64 md:h-64 relative overflow-hidden flex items-center justify-center p-2 bg-white rounded-xl shadow-sm">
                        <div className="absolute inset-0 flex flex-wrap gap-1 p-2 opacity-90">
                            {[...Array(64)].map((_, i) => (
                                <div key={i} className={`w-[11%] h-[11%] ${Math.random() > 0.4 ? 'bg-black' : 'bg-transparent'}`} />
                            ))}
                        </div>
                        
                        {/* High-Tech Scan Line */}
                        <motion.div 
                            animate={{ top: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                            className="absolute left-0 w-full h-[2px] bg-mas-red shadow-[0_0_15px_#C8102E] z-20" 
                        />
                        
                        {/* Center Logo Placeholder */}
                        <div className="absolute inset-0 flex items-center justify-center z-30">
                            <div className="w-12 h-12 bg-white p-2 rounded-lg shadow-lg border border-gray-100 flex items-center justify-center">
                                <Shield size={24} className="text-mas-red" />
                            </div>
                        </div>
                    </div>
                </div>
                <p className="mt-6 text-[9px] font-medium text-gray-400 uppercase tracking-[0.4em]">Scan at Terminal</p>
            </div>

            {/* Holder Information */}
            <div className="w-full px-10 pb-10 space-y-6">
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                            <User size={12} className="text-mas-red" />
                            <span className="text-[9px] font-medium text-gray-400 uppercase tracking-widest">Authorized Holder</span>
                        </div>
                        <p className="text-sm font-medium text-black uppercase tracking-tight truncate">{visitorData.name}</p>
                    </div>
                    <div className="space-y-1 text-right">
                        <div className="flex items-center gap-2 mb-1 justify-end">
                            <Calendar size={12} className="text-mas-red" />
                            <span className="text-[9px] font-medium text-gray-400 uppercase tracking-widest">Access Date</span>
                        </div>
                        <p className="text-sm font-medium text-black uppercase tracking-tight">{visitorData.date}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-4 border-t border-gray-100">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                            <QrCode size={12} className="text-mas-red" />
                            <span className="text-[9px] font-medium text-gray-400 uppercase tracking-widest">Clearance ID</span>
                        </div>
                        <p className="text-[11px] font-medium text-gray-700 font-mono">{visitorData.refId}</p>
                    </div>
                    <div className="space-y-1 text-right">
                        <div className="flex items-center gap-2 mb-1 justify-end">
                            <MapPin size={12} className="text-mas-red" />
                            <span className="text-[9px] font-medium text-gray-400 uppercase tracking-widest">Secure Zone</span>
                        </div>
                        <p className="text-[10px] font-medium text-mas-red uppercase bg-mas-red/5 px-3 py-1 rounded-lg inline-block italic">
                            {visitorData.zone}
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Security Strips */}
            <div className="w-full flex h-1.5">
                <div className="flex-1 bg-mas-red" />
                <div className="flex-1 bg-mas-dark-900" />
                <div className="flex-1 bg-mas-red" />
                <div className="flex-1 bg-mas-dark-900" />
                <div className="flex-1 bg-mas-red" />
            </div>
        </div>
    );
};

export default QRDisplay;
