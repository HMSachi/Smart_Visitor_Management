import React from 'react';
import LiveFeed from './LiveFeed';

const ScannerMain = () => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-12 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[150px] pointer-events-none"></div>

            <LiveFeed />
        </div>
    );
};

export default ScannerMain;
