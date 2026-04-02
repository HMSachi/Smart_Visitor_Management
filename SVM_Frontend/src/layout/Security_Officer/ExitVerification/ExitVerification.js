import React from 'react';
import Sidebar from '../../../components/Security_Officer/Layout/Sidebar';
import Header from '../../../components/Security_Officer/Layout/Header';
import ExitVerificationComponent from '../../../components/Security_Officer/ExitVerification/ExitVerification';

const ExitVerification = () => {
    return (
        <div className="flex bg-secondary overflow-hidden text-white h-screen w-full">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 bg-[var(--color-bg-default)] overflow-hidden">
                <Header title="Terminal Exit Clearance" />
                <div className="flex-1 overflow-y-auto">
                    <ExitVerificationComponent />
                </div>
            </div>
        </div>
    );
};

export default ExitVerification;
