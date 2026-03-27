import React from 'react';
import Sidebar from '../../../components/Admin/Layout/Sidebar';
import Header from '../../../components/Admin/Layout/Header';
import DashboardMain from '../../../components/Admin/Dashboard/DashboardMain';

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-mas-black overflow-x-hidden">
      <Sidebar activeTab="dashboard" />
      <main className="flex-1 ml-72 flex flex-col min-w-0 bg-[#0A0A0B]">
        <Header />
        <DashboardMain />
      </main>
    </div>
  );
};

export default Dashboard;
