import React from 'react';
import MetricsGrid from './MetricsGrid';
import { PerformanceAnalytics } from './DashboardElements';

const DashboardMain = () => {
    return (
        <div className="p-12 space-y-12 animate-fade-in">
            <PerformanceAnalytics />
            <MetricsGrid />
        </div>
    );
};

export default DashboardMain;
