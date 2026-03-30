import React from 'react';
import QR from '../../../components/Visitor/QR/QR';

const QRPage = () => {
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
            
            <QR />
        </div>
    );
};

export default QRPage;
