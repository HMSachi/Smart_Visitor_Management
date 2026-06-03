import React from 'react';
import Header from '../../../components/Security_Officer/Layout/Header';
import VerificationComponent from '../../../components/Security_Officer/Verification/Verification';

const Verification = () => {
    return (
        <div className="flex flex-col min-w-0 h-full">
            <Header title="Credential Verification" />
            <div className="flex-1 overflow-y-auto">
                <VerificationComponent />
            </div>
        </div>
    );
};

export default Verification;
