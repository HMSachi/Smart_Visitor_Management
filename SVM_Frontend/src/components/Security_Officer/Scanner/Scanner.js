import React from 'react';
import LiveFeed from './LiveFeed';

const ScannerMain = () => {
    return (
        <div className="flex-1 flex flex-col w-full min-h-0 p-4 md:p-6 lg:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-primary/5 blur-[150px] pointer-events-none" />
            <LiveFeed />
        </div>
    );
};

export default ScannerMain;
