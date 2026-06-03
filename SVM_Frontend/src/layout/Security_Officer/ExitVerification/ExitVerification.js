import React from 'react';
import Header from '../../../components/Security_Officer/Layout/Header';
import ExitVerificationComponent from '../../../components/Security_Officer/ExitVerification/ExitVerification';

const ExitVerification = () => {
    return (
        <div className="flex flex-col min-w-0 h-full">
            <Header title="Terminal Exit Clearance" />
            <div className="flex-1 overflow-y-auto">
                <ExitVerificationComponent />
            </div>
        </div>
    );
};

export default ExitVerification;
