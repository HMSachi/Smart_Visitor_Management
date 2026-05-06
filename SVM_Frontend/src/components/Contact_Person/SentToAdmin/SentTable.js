import React from 'react';
import {  CheckCircle, XCircle,  Activity } from 'lucide-react';

const ProgressionTimeline = ({ status }) => {
    const steps = [
        { label: 'Submission', done: true },
        { label: 'CP Review', done: true },
        { label: 'Admin Node', current: status === 'Under Review', done: status === 'Approved' || status === 'Declined' },
        { label: 'Finalization', current: status === 'Approved' || status === 'Declined', done: false }
    ];

    return (
        <div className="flex items-center w-full max-w-md gap-4">
            {steps.map((step, i) => (
                <React.Fragment key={i}>
                    <div className="flex flex-col items-center gap-2">
                        <div className={`w-3 h-3 rounded-full border-2 ${step.done ? 'bg-green-500 border-green-500 shadow-[0_0_10px_#22c55e]' : step.current ? 'bg-primary border-primary animate-pulse shadow-[0_0_10px_var(--color-primary)]' : 'bg-transparent border-[var(--color-border-soft)]'}`}></div>
                        <span className={`uppercase font-bold text-[10px] tracking-widest ${step.done ? 'text-green-500' : step.current ? 'text-primary' : 'text-[var(--color-text-dim)]'}`}>{step.label}</span>
                    </div>
                    {i < steps.length - 1 && (
                        <div className={`h-[1px] flex-1 ${step.done ? 'bg-green-500' : 'bg-[var(--color-border-soft)]'}`}></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

const SentTable = ({ requests }) => {
    return (
        <div className="bg-[var(--color-bg-paper)] border border-[var(--color-border-soft)] rounded-3xl overflow-hidden shadow-xl shadow-black/20 animate-fade-in overflow-x-auto">
            
<div className="overflow-x-auto w-full max-w-full pb-4">
<table className="w-full text-left border-collapse text-[13px]">
                <thead>
                    <tr className="bg-[var(--color-surface-1)] border-b border-[var(--color-border-soft)] text-[var(--color-text-dim)] font-normal uppercase tracking-[0.3em] text-[12px]">
                        <th className="px-6 py-2 whitespace-nowrap font-normal text-[12px]">Forward ID</th>
                        <th className="px-6 py-2 whitespace-nowrap font-normal text-[12px]">Visitor Name</th>
                        <th className="px-6 py-2 whitespace-nowrap font-normal text-[12px]">Timeline</th>
                        <th className="px-6 py-2 whitespace-nowrap font-normal text-[12px]">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((req) => (
                        <tr key={req.id} className="border-b border-[var(--color-border-soft)] bg-[var(--color-bg-paper)] hover:bg-[var(--color-surface-1)]/60 transition-all font-normal text-[12px]">
                            <td className="px-6 py-2 whitespace-nowrap font-normal text-[12px]">
                                <span className="text-[var(--color-text-primary)]">#{req.id}</span>
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap font-normal text-[12px]">
                                <div className="flex flex-col">
                                    <span className="uppercase text-[var(--color-text-primary)] mb-0.5">{req.name}</span>
                                    <span className="text-[var(--color-text-dim)] uppercase text-[9px] tracking-widest font-normal">Awaiting Admin Response</span>
                                </div>
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap font-normal text-[12px]">
                                <ProgressionTimeline status={req.status} />
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap font-normal text-[12px]">
                                <div className={`inline-flex flex-col md:flex-row items-center gap-4 md:gap-3 px-3 py-0.5 border uppercase text-[9px] ${req.status === 'Approved' ? 'text-green-500 border-green-500/20 bg-green-500/5' : req.status === 'Declined' ? 'text-primary border-primary/20 bg-primary/5' : 'text-blue-400 border-blue-400/20 bg-blue-400/5 animate-pulse'}`}>
                                    {req.status === 'Approved' ? <CheckCircle size={10} /> : req.status === 'Declined' ? <XCircle size={10} /> : <Activity size={10} />}
                                    {req.status}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
</div>

        </div>
    );
};

export default SentTable;
