import React from 'react';
import Header from '../../../components/Admin/Layout/Header';
import BlacklistTable from "../../../components/Admin/BlacklistManagement/BlacklistTable";

const BlacklistManagement = () => {
  return (
    <div className="flex flex-col min-w-0 bg-[var(--color-bg-default)] min-h-screen">
      <Header />
      
      <div className="flex-1 p-4 md:p-10 overflow-y-auto w-full bg-[var(--color-bg-default)] relative">
        {/* Global Operational Background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none opacity-50"></div>

        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="p-0 min-h-[600px]">
            <BlacklistTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlacklistManagement;
