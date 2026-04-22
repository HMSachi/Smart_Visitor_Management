import React from 'react';
import Header from '../../../components/Admin/Layout/Header';
import BlacklistTable from "../../../components/Admin/BlacklistManagement/BlacklistTable";

const BlacklistManagement = () => {
  return (
    <div className="flex flex-col min-w-0 bg-[var(--color-bg-default)] min-h-screen">
      <Header />

      <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full animate-fade-in-slow relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

        <div className="max-w-[1600px] mx-auto relative z-10">
          <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/[0.03] pb-6 gap-6 relative z-10">
            <div className="bg-[var(--color-surface-1)] border-l-4 border-primary p-6 py-4 rounded-r-2xl backdrop-blur-sm w-full md:w-auto shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_var(--color-primary)]"></div>
                <span className="text-[var(--color-text-primary)] text-[14px] font-bold uppercase tracking-[0.4em]">Enforcement Registry</span>
              </div>
              <p className="text-[var(--color-text-secondary)] text-[11px] uppercase font-bold tracking-[0.25em] opacity-80 leading-relaxed">
                Management of restricted identities and security blocklists
              </p>
            </div>
          </header>
          <div className="p-0 min-h-[600px]">
            <BlacklistTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlacklistManagement;
