import React from 'react';

const QRDisplay = ({ visitorData }) => {
    return (
        <div className="relative group p-8 bg-white flex flex-col items-center">
            {/* QR Code Placeholder with Scan Animation */}
            <div className="w-64 h-64 bg-gray-100 flex items-center justify-center relative overflow-hidden mb-8 shadow-inner">
                {/* Visual QR Pattern (Mockup) */}
                <div className="absolute inset-4 border-[12px] border-black opacity-90 p-1 flex flex-wrap gap-1">
                    {[...Array(64)].map((_, i) => (
                        <div key={i} className={`w-3 h-3 ${Math.random() > 0.5 ? 'bg-black' : 'bg-transparent'}`}></div>
                    ))}
                </div>
                
                {/* Scan Line Animation */}
                <div className="absolute top-0 left-0 w-full h-1 bg-mas-red shadow-[0_0_15px_#C8102E] animate-[scan_3s_ease-in-out_infinite]"></div>
                
                {/* Corner markers */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-8 border-l-8 border-black"></div>
                <div className="absolute top-0 right-0 w-12 h-12 border-t-8 border-r-8 border-black"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-8 border-l-8 border-black"></div>
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-8 border-r-8 border-black"></div>
            </div>

            <div className="w-full space-y-4 border-t border-gray-100 pt-8">
                <div className="flex justify-between items-end">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Authorized Holder</span>
                    <span className="text-sm font-display font-black text-black tracking-tight">{visitorData.name}</span>
                </div>
                <div className="flex justify-between items-end">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Security ID</span>
                    <span className="text-[10px] font-mono font-bold text-black">{visitorData.refId}</span>
                </div>
                <div className="flex justify-between items-end">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Valid Zone</span>
                    <span className="text-[10px] font-black text-mas-red bg-mas-red/5 px-3 py-1 uppercase">{visitorData.zone}</span>
                </div>
            </div>
            
            <style jsx>{`
                @keyframes scan {
                    0%, 100% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default QRDisplay;
