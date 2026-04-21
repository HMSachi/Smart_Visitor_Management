import React from 'react';
import Sidebar from '../../../components/Contact_Person/Layout/Sidebar';
import Header from '../../../components/Contact_Person/Layout/Header';
import DashboardMain from '../../../components/Contact_Person/Dashboard/Dashboard';

const Dashboard = () => {
    return (
        <div className="contact-theme-root flex bg-[var(--color-bg-default)] overflow-hidden text-[var(--color-text-primary)] h-screen w-full">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 bg-[var(--color-bg-default)] overflow-y-auto">
                <Header title="Command Overview" />
                <DashboardMain />
            </div>
        </div>
    );
};

export default Dashboard;
