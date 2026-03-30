import React from 'react';
import VerificationPanel from './VerificationPanel';

const VerificationMain = () => {
    return (
        <div className="p-12 space-y-12 animate-fade-in">
            <div className="flex items-end justify-between border-b border-mas-border pb-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="h-[2px] w-12 bg-mas-red"></div>
                        <span className="text-mas-red uppercase">Identity Validation Node</span>
                    </div>
                    <h1 className="uppercase">Verification Log</h1>
                </div>
                <div className="text-right space-y-2">
                     <p className="text-mas-text-dim uppercase">Entry Ref ID</p>
                     <p className="text-white">VER-SYNC-4291</p>
                </div>
            </div>

            <VerificationPanel />
        </div>
    );
};

export default VerificationMain;
