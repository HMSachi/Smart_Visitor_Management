import React from 'react';

const ReportsAndLogsMain = () => {
  return (
    <div className="flex-1 p-8 overflow-y-auto w-full">
      <div className="max-w-[1600px] mx-auto">
        <header className="mb-6 flex justify-between items-end border-b border-white/[0.03] pb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-[2px] bg-mas-red"></div>
              <span className="text-mas-red uppercase tracking-wider text-xs font-semibold">Command Center</span>
            </div>
            <h1 className="text-white uppercase px-1 text-2xl font-bold tracking-tight">
              Reports & Logs
            </h1>
          </div>
        </header>

        <div className="p-20 text-center bg-[#0F0F10] border border-white/5">
          <h2 className="uppercase text-gray-300 text-xl tracking-widest">Reports & Logs</h2>
          <p className="mt-4 text-mas-red uppercase text-sm tracking-wider">Experimental Module Node - Under Construction</p>
        </div>
      </div>
    </div>
  );
};

export default ReportsAndLogsMain;
