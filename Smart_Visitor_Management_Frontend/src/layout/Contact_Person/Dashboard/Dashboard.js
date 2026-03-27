import React from 'react';
import Sidebar from '../../../components/Contact_Person/Layout/Sidebar';
import Header from '../../../components/Contact_Person/Layout/Header';
import MetricsGrid from '../../../components/Contact_Person/Dashboard/MetricsGrid';
import { PerformanceAnalytics } from '../../../components/Contact_Person/Dashboard/DashboardElements';

const Dashboard = () => {
    return (
        <div className="flex min-h-screen bg-mas-black overflow-x-hidden text-white">
            <Sidebar />
            
            <main className="flex-1 ml-72 flex flex-col min-w-0 bg-[#0A0A0B]">
                <Header title="Command Overview" />

                <div className="p-12 space-y-12 animate-fade-in">
                    <PerformanceAnalytics />
                    <MetricsGrid />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
