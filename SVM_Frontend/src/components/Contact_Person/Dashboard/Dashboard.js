import React from 'react';
import MetricsGrid from './MetricsGrid';
import RecentRequests from './RecentRequests';
import { PerformanceAnalytics, NodeConfiguration } from './DashboardElements';

const DashboardMain = () => {
    return (
        <div className="p-4 sm:p-8 md:p-10 space-y-6 md:space-y-10 animate-fade-in-slow">
            <PerformanceAnalytics />

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
                <div className="xl:col-span-3 space-y-10">
                    <MetricsGrid />
                    <RecentRequests />
                </div>
                <div className="xl:col-span-1">
                    <NodeConfiguration />
                </div>
            </div>
        </div>
    );
};

export default DashboardMain;
