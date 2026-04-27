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
        <div className="max-w-md mx-auto px-6 pt-2 pb-12 bg-background min-h-screen flex flex-col items-center">
            {/* Header Section */}
            <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="w-6 h-[1px] bg-primary/50" />
                    <span className="text-primary font-bold uppercase tracking-widest text-[12px]">Access Granted</span>
                </div>
                <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
                    Digital <span className="text-primary">Pass</span>
                </h1>
                <p className="text-gray-600 text-[13px] uppercase font-bold tracking-widest mt-1">ID: {visitorData.refId}</p>
            </div>

            {/* Digital Pass Card Container */}
            <div className="w-full mb-10">
                <div className="bg-white/[0.02] border border-white/5 p-2 rounded-2xl shadow-xl overflow-hidden">
                    <QRDisplay visitorData={visitorData} />
                </div>
            </div>

            {/* Action Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full mb-10">
                <button 
                    className="compact-btn !w-full"
                >
                    <Download size={14} /> Save
                </button>
                <button 
                    onClick={() => window.print()} 
                    className="px-6 py-3 bg-white/[0.03] border border-white/10 text-white text-[13px] font-bold uppercase tracking-widest rounded-lg hover:bg-white/[0.07] transition-all flex items-center justify-center gap-2"
                >
                    <Printer size={14} /> Print
                </button>
            </div>

            {/* Security Notice Footer */}
            <div className="w-full bg-white/[0.02] border border-white/5 p-6 rounded-xl">
                <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Smartphone size={16} />
                    </div>
                    <div>
                        <p className="text-white text-[13px] font-bold uppercase tracking-widest mb-1">Instructions</p>
                        <p className="text-gray-600 text-[13px] font-bold uppercase tracking-widest leading-relaxed">
                            Present this Pass at the <span className="text-gray-400">Main Security Gate</span>.
                        </p>
                    </div>
                </div>
            </div>

            {/* Return Button */}
            <button 
                onClick={() => window.location.href='/status'}
                className="mt-10 flex flex-col md:flex-row items-center gap-4 md:gap-2 text-gray-700 hover:text-primary text-[13px] font-bold uppercase tracking-widest transition-colors"
            >
                <ArrowLeft size={14} /> Back to Status
            </button>
        </div>
    );
};

export default QRMain;
