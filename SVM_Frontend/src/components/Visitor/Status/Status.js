import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Activity, Shield, ArrowLeft, Terminal, LayoutDashboard, FileText } from 'lucide-react';
import StatusCard from './StatusCard';
import StatusTimeline from './StatusTimeline';
import NotificationPanel from './NotificationPanel';
import { setStatus } from '../../../reducers/visitorSlice';

const StatusMain = () => {
    const dispatch = useDispatch();
    const { status } = useSelector(state => state.visitor);
    const currentStatus = status || 'step1_pending';

    const getStatusMessage = () => {
        switch (currentStatus) {
            case 'step1_pending': return 'Basic clearance request is under review. Standard protocols active.';
            case 'step1_approved': return 'Primary authorization granted. Please finalize detailed documentation for access.';
            case 'step2_pending': return 'Detailed documentation synchronized. Final facility security clearance in progress.';
            case 'fully_approved': return 'Access parameters finalized. Your digital facility pass is now active.';
            default: return 'Standard review protocols are currently high priority.';
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 pt-2 pb-8 text-white bg-mas-dark-900 min-h-screen">
            {/* Page Header */}
            <header className="mb-8 flex items-center justify-between border-b border-white/5 pb-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-mas-red font-bold text-[9px] uppercase tracking-widest">System Node 01</span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold uppercase tracking-tight">
                        Live <span className="text-mas-red">Tracking</span>
                    </h1>
                    <p className="text-gray-500 text-[10px] uppercase font-semibold tracking-wider mt-0.5">Clearance Monitor V.4.2.1</p>
                </div>

                <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/[0.02] border border-white/5 rounded-lg">
                    <Activity size={14} className="text-mas-red" />
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Protocol Active</span>
                </div>
            </header>

            <div className="flex flex-col gap-6">
                <main className="space-y-6">
                    {/* Status Overview Card */}
                    <StatusCard status={currentStatus} />
                    
                    {/* Timeline Card */}
                    <div className="bg-white/[0.01] border border-white/5 p-6 rounded-xl">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="text-mas-red">
                                <FileText size={14} />
                            </div>
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-0 !mb-0">Clearance Timeline</h3>
                        </div>

                        <StatusTimeline currentStage={currentStatus} />
                    </div>

                    {/* Admin Actions (New Compact style) */}
                    <div className="bg-white/[0.01] border border-white/5 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-white/[0.03] rounded-lg text-gray-600">
                                <Terminal size={14} />
                            </div>
                            <div>
                                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest block mb-1">SIM_AUTH_NODE</span>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-mas-red/40" />
                                    <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Protocol Override Active</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => dispatch(setStatus('step1_approved'))}
                                className="px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-[9px] font-bold uppercase tracking-widest text-gray-500 hover:text-white hover:bg-mas-red/20 transition-all"
                            >
                                Simulate Step 1
                            </button>
                            <button 
                                onClick={() => dispatch(setStatus('fully_approved'))}
                                className="px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-[9px] font-bold uppercase tracking-widest text-gray-500 hover:text-white hover:bg-green-500/20 transition-all"
                            >
                                Simulate Final
                            </button>
                        </div>
                    </div>
                </main>

                <section className="w-full">
                    <NotificationPanel status={currentStatus} />
                </section>
            </div>

            {/* Footer Summary Actions */}
            <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex gap-6 items-center flex-1">
                    <div className="hidden md:flex flex-col items-end border-r border-white/10 pr-6">
                        <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Status Code</span>
                        <span className="text-[11px] text-white font-mono">{currentStatus.toUpperCase()}</span>
                    </div>
                    <div className="max-w-md">
                        <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest mb-1">Protocol Insight</p>
                        <p className="text-white/80 text-[11px] font-semibold uppercase tracking-wider leading-relaxed">"{getStatusMessage()}"</p>
                    </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    {currentStatus !== 'fully_approved' && (
                        <button 
                            onClick={() => window.location.href='/request-step-2'} 
                            className="compact-btn !px-10"
                        >
                            Next Phase
                        </button>
                    )}
                    <button 
                        onClick={() => window.location.href='/home'} 
                        className="px-6 py-3 bg-white/[0.03] border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-white/[0.07] transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={14} /> Hub
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatusMain;
