import React from 'react';
import { UserX, Trash2, Plus, Search } from 'lucide-react';

const BlacklistTable = () => {
  const blacklist = [
    { id: 1, name: 'Malith Gunawardena', docId: '199234567V', reason: 'Unauthorized entry attempt', addedBy: 'Sujith (Sec)', date: '22 Mar, 2026' },
    { id: 2, name: 'James Wilson', docId: 'P9876543', reason: 'Abusive behavior', addedBy: 'Admin Portal', date: '15 Mar, 2026' },
  ];

  return (
    <div className="mas-glass h-full flex flex-col border-white/5 overflow-hidden">
      <div className="p-8 border-b border-white/5 flex justify-between items-center bg-mas-dark/40">
        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">Security Blacklist</h2>
          <p className="text-[10px] text-mas-text-dim uppercase tracking-widest mt-1 font-bold">Restricted access nodes</p>
        </div>
        <button className="mas-button-primary scale-90 origin-right flex items-center gap-2">
          <Plus size={16} strokeWidth={3} /> Add Entity
        </button>
      </div>

      <div className="p-4 bg-white/5 border-b border-white/5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-mas-text-dim" size={12} />
          <input 
            type="text" 
            placeholder="SEARCH ENTITY BY NIC / PASSPORT..." 
            className="mas-input w-full pl-10 pr-4 py-2 bg-mas-dark/50 placeholder:text-[8px] placeholder:tracking-[0.2em] placeholder:font-black"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 sticky top-0 bg-mas-dark z-10">
              <th className="px-6 py-4 text-[9px] uppercase tracking-[0.2em] font-black text-mas-text-dim">Entity / ID</th>
              <th className="px-6 py-4 text-[9px] uppercase tracking-[0.2em] font-black text-mas-text-dim">Restriction Logic</th>
              <th className="px-6 py-4 text-[9px] uppercase tracking-[0.2em] font-black text-mas-text-dim text-right font-black">Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {blacklist.map((item) => (
              <tr key={item.id} className="group hover:bg-mas-red/5 transition-all">
                <td className="px-6 py-5">
                  <p className="text-[11px] font-black text-white uppercase tracking-tight">{item.name}</p>
                  <p className="text-[9px] text-mas-red mt-1 font-bold tracking-widest">{item.docId}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-[11px] text-white/80 font-medium leading-tight mb-1">{item.reason}</p>
                  <p className="text-[9px] text-mas-text-dim uppercase tracking-tighter font-bold">Logged by {item.addedBy} • {item.date}</p>
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="p-2 border border-white/10 text-mas-text-dim hover:text-mas-red hover:border-mas-red transition-all">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-white/5 bg-mas-dark/30">
        <div className="flex items-center gap-3 text-mas-red">
          <div className="w-1.5 h-1.5 bg-mas-red rounded-full animate-pulse shadow-[0_0_5px_#C8102E]"></div>
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">{blacklist.length} Restricted nodes currently active</span>
        </div>
      </div>
    </div>
  );
};

export default BlacklistTable;
