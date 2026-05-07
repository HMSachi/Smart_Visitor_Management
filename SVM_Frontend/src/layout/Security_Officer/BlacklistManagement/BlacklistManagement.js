import React from 'react';
import Header from '../../../components/Security_Officer/Layout/Header';
import BlacklistTable from "../../../components/Admin/BlacklistManagement/BlacklistTable";

const BlacklistManagement = () => {
  return (
    <div className="flex flex-col min-w-0 bg-[var(--color-bg-default)] min-h-screen">
      <Header />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full animate-fade-in">
        <div className="max-w-[1600px] mx-auto">
          {/* Page Header */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-primary shrink-0"
              style={{ background: 'var(--color-primary-low)', border: '1px solid rgba(200,16,46,0.2)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="17" x2="22" y1="8" y2="13"/><line x1="22" x2="17" y1="8" y2="13"/></svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--color-text-primary)] leading-tight m-0">
                Restricted Visitor List
              </h1>
              <p className="text-[var(--color-text-secondary)] text-sm mt-0.5">
                Manage blocked persons and access restrictions
              </p>
            </div>
          </div>

          <div className="p-0 min-h-[600px]">
            <BlacklistTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlacklistManagement;
