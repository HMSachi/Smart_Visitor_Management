import React from 'react';
import QRDisplay from './QRDisplay';

const QRMain = () => {
    const visitorData = {
        name: 'SACHINTHA DESHAN',
        date: 'MAR 25, 2026',
        refId: 'MAS-VAS-092283',
        zone: 'CORPORATE SECTOR A'
    };

    return (
        <div className="max-w-md w-full animate-fade-in relative z-10">
            <div className="text-center mb-12">
                <span className="uppercase text-mas-red block mb-4">Secured Digital Pass</span>
                <h1 className="text-white uppercase">Your Access Key</h1>
            </div>

            <div className="glass-panel p-2 bg-white/5 border-white/10 mb-12 shadow-[0_0_80px_rgba(0,0,0,0.5)]">
                <QRDisplay visitorData={visitorData} />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <button className="py-5 bg-mas-red text-white uppercase hover:bg-[#A60D26] transition-all hover:shadow-[0_0_30px_rgba(200,16,46,0.3)] transform hover:scale-105 active:scale-95">
                    Download QR
                </button>
                <button onClick={() => window.print()} className="py-5 bg-charcoal-800 border border-white/10 text-white uppercase hover:bg-charcoal-700 transition-all border-mas-red/20">
                    Print Pass
                </button>
            </div>

            <div className="mt-16 bg-mas-red/5 border border-mas-red/10 p-6">
                <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-mas-red animate-ping"></div>
                    <p className="text-gray-300 uppercase">
                        Present this Pass at the <span className="text-white">Main Security Terminal</span> upon arrival.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QRMain;
