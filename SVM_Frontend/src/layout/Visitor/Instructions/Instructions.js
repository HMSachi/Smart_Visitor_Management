import React from 'react';
import Instructions from '../../../components/Visitor/Instructions/Instructions';

const InstructionsPage = () => {
    return (
        <div className="min-h-screen bg-charcoal-900 pt-32 pb-24 px-6 overflow-hidden">
            <Instructions />
            
            {/* Background Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-20 mix-blend-overlay">
                <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                    <filter id="noise">
                        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noise)" />
                </svg>
            </div>
        </div>
    );
};

export default InstructionsPage;
