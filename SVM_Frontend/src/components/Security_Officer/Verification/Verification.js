import React from 'react';
import VerificationPanel from './VerificationPanel';

const VerificationMain = () => {
    return (
        <div className="p-6 md:p-12 space-y-6 md:space-y-12 animate-fade-in">
            <div className="flex items-end justify-between border-b border-mas-border pb-8">
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-4">
                        <div className="h-[2px] w-12 bg-primary"></div>
                        <span className="text-primary uppercase">Identity Validation Node</span>
                    </div>
                    <h1 className="uppercase">Verification Log</h1>
                </div>
                <div className="text-right space-y-2">
                     <p className="text-gray-300 uppercase">Entry Ref ID</p>
                     <p className="text-white">VER-SYNC-4291</p>
                </div>
            </div>

            <VerificationPanel />
        </div>
    );
};

export default VerificationMain;
