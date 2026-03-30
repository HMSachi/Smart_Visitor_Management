import React from 'react';
import Sidebar from '../../../components/Security_Officer/Layout/Sidebar';
import Header from '../../../components/Security_Officer/Layout/Header';
import VerificationComponent from '../../../components/Security_Officer/Verification/Verification';

const Verification = () => {
    return (
        <div className="flex bg-mas-black overflow-hidden text-white h-screen w-full">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 bg-[#0A0A0B] overflow-y-auto">
                <Header title="Credential Verification" />
                <VerificationComponent />
            </div>
        </div>
    );
};

export default Verification;
