import React from 'react';
import Header from '../../../components/Security_Officer/Layout/Header';
import SecurityScannerDashboard from '../../../components/Security_Officer/Dashboard/SecurityScannerDashboard';

const SecurityDashboard = () => {
    return (
        <div className="flex flex-col min-w-0 h-full">
            <Header title="Security Dashboard" />
            <div className="flex-1 overflow-y-auto">
                <SecurityScannerDashboard />
            </div>
        </div>
    );
};

export default SecurityDashboard;
