import React from 'react';
import QRDisplay from '../../components/QR/QRDisplay';

const QRPage = () => {
    const visitorData = {
        name: 'SACHINTHA DESHAN',
        date: 'MAR 25, 2026',
        refId: 'MAS-VAS-092283',
        zone: 'CORPORATE SECTOR A'
    };

    return (
        <div className="min-h-screen bg-charcoal-900 flex items-center justify-center p-6 pt-32 pb-24 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="grid grid-cols-12 h-full gap-1">
                    {[...Array(144)].map((_, i) => (
                        <div key={i} className="border border-white/10 aspect-square"></div>
                    ))}
                </div>
            </div>

            <div className="max-w-md w-full animate-fade-in relative z-10">
                <div className="text-center mb-12">
                    <span className="text-[11px] uppercase tracking-[0.6em] font-black text-mas-red block mb-4">Secured Digital Pass</span>
                    <h1 className="text-3xl font-display font-black text-white uppercase tracking-tighter">Your Access Key</h1>
                </div>

                <div className="glass-panel p-2 bg-white/5 border-white/10 mb-12 shadow-[0_0_80px_rgba(0,0,0,0.5)]">
                    <QRDisplay visitorData={visitorData} />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <button className="py-5 bg-mas-red text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#A60D26] transition-all hover:shadow-[0_0_30px_rgba(200,16,46,0.3)] transform hover:scale-105 active:scale-95">
                        Download QR
                    </button>
                    <button onClick={() => window.print()} className="py-5 bg-charcoal-800 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-charcoal-700 transition-all border-mas-red/20">
                        Print Pass
                    </button>
                </div>

                <div className="mt-16 bg-mas-red/5 border border-mas-red/10 p-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-mas-red animate-ping"></div>
                        <p className="text-[9px] text-gray-300 uppercase tracking-widest leading-loose font-bold">
                            Present this Pass at the <span className="text-white">Main Security Terminal</span> upon arrival.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRPage;
