import React from 'react';
import Header from '../../../components/Contact_Person/Layout/Header';
import DashboardMain from '../../../components/Contact_Person/Dashboard/Dashboard';

const Dashboard = () => {
    return (
        <div className="flex flex-col min-w-0 h-full">
            <Header title="Contact Person Hub"/>
            <DashboardMain />
        </div>
    );
};

export default Dashboard;
