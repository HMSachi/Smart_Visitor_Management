import React from 'react';
import Sidebar from '../../../components/Security_Officer/Layout/Sidebar';
import Header from '../../../components/Security_Officer/Layout/Header';
import VerificationComponent from '../../../components/Security_Officer/Verification/Verification';

const Verification = () => {
    return (
        <div className="flex min-h-screen bg-mas-black overflow-x-hidden text-white">
            <Sidebar />
            <main className="flex-1 ml-72 flex flex-col min-w-0 bg-[#0A0A0B]">
                <Header title="Credential Verification" />
                <VerificationComponent />
            </main>
        </div>
    );
};

export default Verification;
