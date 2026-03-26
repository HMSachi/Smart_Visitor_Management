import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Download, Filter, Search, Calendar, User, Briefcase, FileText } from 'lucide-react';

const HistoryTable = ({ history }) => {
    const [expandedRow, setExpandedRow] = useState(null);

    return (
        <div className="mas-glass border-mas-border overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-mas-border bg-white/[0.02]">
                        <th className="px-8 py-6 uppercase text-mas-text-dim w-16"></th>
                        <th className="px-8 py-6 uppercase text-mas-text-dim">Visitor</th>
                        <th className="px-8 py-6 uppercase text-mas-text-dim">Visit Date</th>
                        <th className="px-8 py-6 uppercase text-mas-text-dim">Access Category</th>
                        <th className="px-8 py-6 uppercase text-mas-text-dim">Final Status</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((item) => (
                        <React.Fragment key={item.id}>
                            <tr 
                                className={`border-b border-mas-border group cursor-pointer transition-all ${expandedRow === item.id ? 'bg-mas-red/[0.02]' : 'hover:bg-white/[0.03]'}`}
                                onClick={() => setExpandedRow(expandedRow === item.id ? null : item.id)}
                            >
                                <td className="px-8 py-6">
                                    {expandedRow === item.id ? <ChevronUp size={16} className="text-mas-red" /> : <ChevronDown size={16} className="text-mas-text-dim group-hover:text-white" />}
                                </td>
                                <td className="px-8 py-6">
                                    <span className="uppercase text-white">{item.visitor}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="uppercase text-mas-text-dim">{item.date}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="uppercase text-white/60">{item.category}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-4 py-1 border uppercase ${item.status === 'Approved' ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-mas-red border-mas-red/20 bg-mas-red/5'}`}>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                            {expandedRow === item.id && (
                                <tr>
                                    <td colSpan="5" className="bg-white/[0.01] border-b border-mas-border p-12">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 animate-slide-down">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <User size={14} className="text-mas-red" />
                                                    <span className="uppercase text-white">Personnel Data</span>
                                                </div>
                                                <div className="p-4 bg-[#0F0F10] border border-white/5 space-y-2">
                                                    <p className="text-mas-text-dim uppercase">NIC Number</p>
                                                    <p className="text-white uppercase">N-9428103X</p>
                                                </div>
                                                <div className="p-4 bg-[#0F0F10] border border-white/5 space-y-2">
                                                    <p className="text-mas-text-dim uppercase">Protocol Sync ID</p>
                                                    <p className="text-white uppercase">#SYNC-4281</p>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <Briefcase size={14} className="text-mas-red" />
                                                    <span className="uppercase text-white">Mission Profile</span>
                                                </div>
                                                <div className="p-4 bg-[#0F0F10] border border-white/5 space-y-2">
                                                    <p className="text-mas-text-dim uppercase">Designated Host</p>
                                                    <p className="text-white uppercase">Sachi (HR)</p>
                                                </div>
                                                <div className="p-4 bg-[#0F0F10] border border-white/5 space-y-2">
                                                    <p className="text-mas-text-dim uppercase">Visit Duration</p>
                                                    <p className="text-white uppercase">02 Hours 15 Mins</p>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                 <div className="flex items-center gap-2 mb-4">
                                                    <FileText size={14} className="text-mas-red" />
                                                    <span className="uppercase text-white">System Notes</span>
                                                </div>
                                                <div className="p-6 bg-mas-red/[0.03] border border-mas-red/20">
                                                     <p className="text-white/80 uppercase">
                                                        "Entry verified through primary biometric point. All assets cleared by security node 04."
                                                     </p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HistoryTable;
