import React from 'react';
import Sidebar from '../../../components/Security_Officer/Layout/Sidebar';
import Header from '../../../components/Security_Officer/Layout/Header';
import LiveFeed from '../../../components/Security_Officer/Scanner/LiveFeed';

const Scanner = () => {
    return (
        <div className="flex min-h-screen bg-mas-black overflow-x-hidden text-white">
            <Sidebar />
            
            <main className="flex-1 ml-72 flex flex-col min-w-0 bg-[#0A0A0B]">
                <Header title="Tactical QR Scanner" />

                <div className="flex-1 flex flex-col items-center justify-center p-12 relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-mas-red/5 blur-[150px] pointer-events-none"></div>

                    <LiveFeed />
                </div>
            </main>
        </div>
    );
};

export default Scanner;
