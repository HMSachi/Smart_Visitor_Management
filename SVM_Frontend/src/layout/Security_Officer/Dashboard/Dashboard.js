import React from 'react';
import Header from '../../../components/Security_Officer/Layout/Header';
import Dashboard from '../../../components/Security_Officer/Dashboard/Dashboard';

const SecurityDashboard = () => {
    return (
        <div className="flex flex-col min-w-0 h-full">
            <Header  />
            <div className="flex-1 overflow-y-auto">
                <Dashboard />
            </div>
        </div>
    );
};

export default SecurityDashboard;
