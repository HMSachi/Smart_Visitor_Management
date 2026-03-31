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
        <div className="max-w-6xl mx-auto px-6 py-4 text-white bg-mas-dark-900 min-h-screen">
            {/* Page Header */}
            <header className="mb-2 flex flex-col md:flex-row md:items-end justify-between gap-2">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-[2px] bg-mas-red" />
                        <span className="text-mas-red font-medium uppercase tracking-[0.4em] text-[8px]">Security Node</span>
                    </div>
                    <h1 className="text-lg md:text-xl font-medium uppercase tracking-tight leading-tight">
                        Live <span className="text-mas-red">Tracking</span>
                    </h1>
                    <p className="text-gray-300 text-[9px] uppercase font-medium tracking-[0.2em] mt-1">Clearance Monitor [V.4.2.1]</p>
                </div>

                <div className="hidden md:flex items-center gap-4 px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl">
                    <Activity size={24} className="text-mas-red" />
                    <div>
                        <p className="text-white text-[10px] font-medium uppercase tracking-widest">Protocol Active</p>
                        <p className="text-gray-300 text-[9px] uppercase font-medium tracking-widest animate-pulse">Syncing Facility Data...</p>
                    </div>
                </div>
            </header>

            <div className="flex flex-col gap-4">
                <main className="space-y-4">
                    {/* Status Overview Card */}
                    <StatusCard status={currentStatus} />
                    
                    {/* Timeline Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-[2rem] relative overflow-hidden group shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-mas-red/5 rounded-full blur-3xl -mr-24 -mt-24 transition-all duration-700" />
                        
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="p-2 rounded-xl bg-mas-red/10 border border-mas-red/20 text-mas-red">
                                <FileText size={16} />
                            </div>
                            <div>
                                <h2 className="text-base font-medium text-white uppercase tracking-tight">Clearance Timeline</h2>
                                <p className="text-gray-300 text-[9px] font-medium uppercase tracking-[0.2em]">Deployment Protocol Progress</p>
                            </div>
                        </div>

                        <StatusTimeline currentStage={currentStatus} />
                    </motion.div>

                    {/* Simulation Console - Modernized */}
                    <div className="bg-black/40 border border-white/5 p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-mas-red/20 transition-all">
                        <div className="flex items-center gap-6">
                            <div className="p-3 bg-white/5 rounded-xl text-gray-500 group-hover:text-mas-red transition-colors">
                                <Terminal size={20} />
                            </div>
                            <div>
                                <span className="text-[10px] text-gray-500 uppercase font-medium tracking-widest mb-1 block">Simulation Terminal: <span className="text-white font-mono">[SIM_AUTH_NODE]</span></span>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-mas-red animate-pulse" />
                                    <span className="text-[9px] text-gray-400 font-medium uppercase tracking-[0.2em]">Bypassing Primary Auth...</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 opacity-70 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => dispatch(setStatus('step1_approved'))}
                                className="px-5 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-[9px] font-medium uppercase tracking-widest text-gray-400 hover:text-mas-red hover:border-mas-red/40 hover:bg-mas-red/5 transition-all"
                            >
                                Simulate Step 1
                            </button>
                            <button 
                                onClick={() => dispatch(setStatus('fully_approved'))}
                                className="px-5 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-[9px] font-medium uppercase tracking-widest text-gray-400 hover:text-green-500 hover:border-green-500/40 hover:bg-green-500/5 transition-all"
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
            <div className="mt-4 pt-4 border-t border-white/[0.03] flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex gap-6 items-center flex-1">
                    <div className="hidden md:flex flex-col items-end border-r border-white/10 pr-6">
                        <span className="text-[9px] text-gray-400 font-medium uppercase tracking-[0.3em]">Status Code</span>
                        <span className="text-[11px] text-white font-mono">{currentStatus.toUpperCase()}</span>
                    </div>
                    <div className="max-w-md">
                        <p className="text-gray-400 text-[10px] font-medium uppercase tracking-[0.3em] mb-2">Protocol Insight</p>
                        <p className="text-white text-xs font-medium uppercase tracking-wider leading-relaxed">"{getStatusMessage()}"</p>
                    </div>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    {currentStatus !== 'fully_approved' && (
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.location.href='/request-step-2'} 
                            className="flex-1 md:flex-none px-10 py-5 bg-mas-red text-white text-xs font-medium uppercase tracking-[0.2em] rounded-2xl shadow-[0_20px_40px_rgba(200,16,46,0.3)] hover:shadow-[0_20px_60px_rgba(200,16,46,0.5)] transition-all animate-pulse"
                        >
                            Fill Form 02
                        </motion.button>
                    )}
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.href='/home'} 
                        className="flex-1 md:flex-none px-10 py-5 bg-white/[0.03] border border-white/10 text-white text-xs font-medium uppercase tracking-[0.2em] rounded-2xl hover:bg-white/[0.07] transition-all flex items-center justify-center gap-3"
                    >
                        <ArrowLeft size={16} /> Hub
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default StatusMain;
