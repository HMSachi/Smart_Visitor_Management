import React from 'react';
import { Clock, CheckCircle, XCircle, ChevronRight, Activity } from 'lucide-react';

const ProgressionTimeline = ({ status }) => {
    const steps = [
        { label: 'Submission', done: true },
        { label: 'CP Review', done: true },
        { label: 'Admin Node', current: status === 'Under Review', done: status === 'Approved' || status === 'Rejected' },
        { label: 'Finalization', current: status === 'Approved' || status === 'Rejected', done: false }
    ];

    return (
        <div className="flex items-center w-full max-w-md gap-4">
            {steps.map((step, i) => (
                <React.Fragment key={i}>
                    <div className="flex flex-col items-center gap-2">
                        <div className={`w-3 h-3 rounded-full border-2 ${step.done ? 'bg-green-500 border-green-500 shadow-[0_0_10px_#22c55e]' : step.current ? 'bg-mas-red border-mas-red animate-pulse shadow-[0_0_10px_#C8102E]' : 'bg-transparent border-white/20'}`}></div>
                        <span className={`uppercase ${step.done ? 'text-green-500' : step.current ? 'text-white' : 'text-mas-text-dim'}`}>{step.label}</span>
                    </div>
                    {i < steps.length - 1 && (
                        <div className={`h-[1px] flex-1 ${step.done ? 'bg-green-500' : 'bg-white/10'}`}></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

const SentTable = ({ requests }) => {
    return (
        <div className="mas-glass border-mas-border overflow-x-auto overflow-y-hidden custom-scrollbar">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-mas-border bg-white/[0.02]">
                        <th className="px-6 py-6 uppercase text-mas-text-dim whitespace-nowrap">Forward ID</th>
                        <th className="px-6 py-6 uppercase text-mas-text-dim whitespace-nowrap">Visitor Node</th>
                        <th className="px-6 py-6 uppercase text-mas-text-dim whitespace-nowrap">Progression Matrix</th>
                        <th className="px-6 py-6 uppercase text-mas-text-dim whitespace-nowrap">Current Status</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((req) => (
                        <tr key={req.id} className="border-b border-mas-border group hover:bg-white/[0.03] transition-all">
                            <td className="px-6 py-6 whitespace-nowrap">
                                <span className="text-mas-text-dim group-hover:text-white transition-colors">#{req.id}</span>
                            </td>
                            <td className="px-6 py-6 whitespace-nowrap">
                                <div className="flex flex-col">
                                    <span className="uppercase text-white mb-1">{req.name}</span>
                                    <span className="text-mas-text-dim uppercase text-xs">Target: Unit 08A</span>
                                </div>
                            </td>
                            <td className="px-6 py-6 whitespace-nowrap">
                                <ProgressionTimeline status={req.status} />
                            </td>
                            <td className="px-6 py-6 whitespace-nowrap">
                                <div className={`inline-flex items-center gap-3 px-4 py-1.5 border uppercase ${req.status === 'Approved' ? 'text-green-500 border-green-500/20 bg-green-500/5' : req.status === 'Rejected' ? 'text-mas-red border-mas-red/20 bg-mas-red/5' : 'text-blue-400 border-blue-400/20 bg-blue-400/5 animate-pulse'}`}>
                                    {req.status === 'Approved' ? <CheckCircle size={12} /> : req.status === 'Rejected' ? <XCircle size={12} /> : <Activity size={12} />}
                                    {req.status}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SentTable;
