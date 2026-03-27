import React from 'react';

const SystemStatusNode = () => {
  return (
    <div className="bg-[#0F0F10] border border-white/5 p-12 flex flex-col items-center justify-center">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]"></div>
        <span className="text-white uppercase tracking-wider">System Core Operational</span>
      </div>
      <p className="text-mas-text-dim uppercase max-w-md text-center text-sm leading-relaxed">
        All security protocols are active. Synchronization with MAS-HQ nodes is complete. No critical alerts pending in the current cycle.
      </p>
    </div>
  );
};

export default SystemStatusNode;
