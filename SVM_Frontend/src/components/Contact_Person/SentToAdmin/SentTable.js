import React from 'react';
import {  CheckCircle, XCircle,  Activity } from 'lucide-react';

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
                        <div className={`w-3 h-3 rounded-full border-2 ${step.done ? 'bg-green-500 border-green-500 shadow-[0_0_10px_#22c55e]' : step.current ? 'bg-primary border-primary animate-pulse shadow-[0_0_10px_var(--color-primary)]' : 'bg-transparent border-gray-300'}`}></div>
                        <span className={`uppercase font-bold text-[10px] tracking-widest ${step.done ? 'text-green-500' : step.current ? 'text-primary' : 'text-gray-400'}`}>{step.label}</span>
                    </div>
                    {i < steps.length - 1 && (
                        <div className={`h-[1px] flex-1 ${step.done ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

const SentTable = ({ requests }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50 animate-fade-in overflow-x-auto">
            <table className="w-full text-left border-collapse text-[13px]">
                <thead>
                    <tr className="bg-[#F8F9FA] border-b border-gray-100 text-gray-400 font-bold uppercase tracking-[0.2em]">
                        <th className="px-6 py-4 whitespace-nowrap">Forward ID</th>
                        <th className="px-6 py-4 whitespace-nowrap">Visitor Name</th>
                        <th className="px-6 py-4 whitespace-nowrap">Timeline</th>
                        <th className="px-6 py-4 whitespace-nowrap">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((req) => (
                        <tr key={req.id} className="border-b border-gray-50 bg-white hover:bg-[#F8F9FA]/50 transition-all font-bold">
                            <td className="px-6 py-6 whitespace-nowrap">
                                <span className="text-[#1A1A1A]">#{req.id}</span>
                            </td>
                            <td className="px-6 py-6 whitespace-nowrap">
                                <div className="flex flex-col">
                                    <span className="uppercase text-[#1A1A1A] mb-1">{req.name}</span>
                                    <span className="text-gray-500 uppercase text-[11px] tracking-widest font-bold">Awaiting Admin Response</span>
                                </div>
                            </td>
                            <td className="px-6 py-6 whitespace-nowrap">
                                <ProgressionTimeline status={req.status} />
                            </td>
                            <td className="px-6 py-6 whitespace-nowrap">
                                <div className={`inline-flex items-center gap-3 px-4 py-1.5 border uppercase ${req.status === 'Approved' ? 'text-green-500 border-green-500/20 bg-green-500/5' : req.status === 'Rejected' ? 'text-primary border-primary/20 bg-primary/5' : 'text-blue-400 border-blue-400/20 bg-blue-400/5 animate-pulse'}`}>
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
