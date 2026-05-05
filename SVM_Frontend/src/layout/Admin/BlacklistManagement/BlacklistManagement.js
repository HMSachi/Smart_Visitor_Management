import React from 'react';
import Header from '../../../components/Admin/Layout/Header';
import BlacklistTable from "../../../components/Admin/BlacklistManagement/BlacklistTable";

const BlacklistManagement = () => {
  return (
    <div className="flex flex-col min-w-0 bg-[var(--color-bg-default)] min-h-screen">
      <Header title="Restricted Visitor List" subtitle="Manage blocked persons and access restrictions" />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full animate-fade-in">
        <div className="max-w-[1600px] mx-auto">

          <div className="p-0 min-h-[600px]">
            <BlacklistTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlacklistManagement;
