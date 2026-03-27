import React from 'react';
import Sidebar from '../../../components/Security_Officer/Layout/Sidebar';
import Header from '../../../components/Security_Officer/Layout/Header';
import ExitVerificationMain from '../../../components/Security_Officer/ExitVerification/ExitVerificationMain';

const ExitVerification = () => {
    return (
        <div className="flex min-h-screen bg-mas-black overflow-x-hidden text-white">
            <Sidebar />
            <main className="flex-1 ml-72 flex flex-col min-w-0 bg-[#0A0A0B]">
                <Header title="Terminal Exit Clearance" />
                <ExitVerificationMain />
            </main>
        </div>
    );
};

export default ExitVerification;
