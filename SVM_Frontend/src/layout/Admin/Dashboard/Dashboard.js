import React from 'react';
import Header from '../../../components/Admin/Layout/Header';
import DashboardMain from '../../../components/Admin/Dashboard/Dashboard';

const Dashboard = () => {
  return (
    <div className="flex flex-col min-w-0 bg-[var(--color-bg-default)] min-h-screen">
      <Header />
      <div className="p-4 md:p-8">
        <DashboardMain />
      </div>
    </div>
  );
};

export default Dashboard;
