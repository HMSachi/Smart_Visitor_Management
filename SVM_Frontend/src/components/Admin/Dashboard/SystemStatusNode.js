import React from 'react';

const SystemStatusNode = () => {
  return (
    <div className="bg-[var(--color-bg-paper)] border border-white/5 p-4 md:p-10 h-full rounded-[32px] flex flex-col items-center justify-center relative overflow-hidden group shadow-2xl animate-fade-in-slow">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-full border border-white/5 flex items-center justify-center bg-white/[0.02] shadow-inner">
          <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_20px_#22c55e] animate-pulse"></div>
        </div>
        <div className="absolute -inset-4 border border-primary/10 rounded-full animate-[spin_10s_linear_infinite]"></div>
      </div>

      <div className="text-center space-y-4">
        <h3 className="text-white text-[12px] font-bold capitalize tracking-[0.3em]">Operational Integrity</h3>
        <p className="text-gray-300 text-[13px] font-medium capitalize tracking-widest leading-relaxed opacity-80 max-w-xs mx-auto">
          All security protocols are active. Synchronization with MAS-HQ nodes is complete. No critical anomalies detected in the current cycle.
        </p>
      </div>

      <div className="mt-8 pt-8 border-t border-white/5 w-full flex justify-around">
        <div className="text-center">
          <p className="text-gray-300 text-[14px] font-medium capitalize tracking-widest opacity-30 mb-1">Node 01</p>
          <p className="text-green-500 text-[12px] font-medium capitalize tracking-widest">Active</p>
        </div>
        <div className="text-center">
          <p className="text-gray-300 text-[14px] font-medium capitalize tracking-widest opacity-30 mb-1">Sync Hub</p>
          <p className="text-green-500 text-[12px] font-medium capitalize tracking-widest">Stable</p>
        </div>
      </div>
    </div>
  );
};

export default SystemStatusNode;
