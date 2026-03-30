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
        <div className="max-w-6xl mx-auto px-6 py-12 text-white bg-mas-dark-900 min-h-screen">
            {/* Page Header */}
            <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-[2.5px] bg-mas-red" />
                        <span className="text-mas-red font-black uppercase tracking-[0.4em] text-[10px]">Security Node</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none italic">
                        Live <span className="text-mas-red">Tracking</span>
                    </h1>
                    <p className="text-gray-500 text-[10px] uppercase font-black tracking-[0.2em] mt-2">Clearance Monitor [V.4.2.1]</p>
                </div>

                <div className="hidden md:flex items-center gap-4 px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl">
                    <Activity size={24} className="text-mas-red" />
                    <div>
                        <p className="text-white text-[10px] font-black uppercase tracking-widest">Protocol Active</p>
                        <p className="text-gray-500 text-[9px] uppercase font-bold tracking-widest italic animate-pulse">Syncing Facility Data...</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <main className="lg:col-span-2 space-y-8">
                    {/* Status Overview Card */}
                    <StatusCard status={currentStatus} />
                    
                    {/* Timeline Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/[0.02] border border-white/5 p-10 md:p-14 rounded-[2.5rem] relative overflow-hidden group shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-mas-red/5 rounded-full blur-3xl -mr-32 -mt-32 transition-all duration-700" />
                        
                        <div className="flex items-center gap-4 mb-14 relative z-10">
                            <div className="p-3 rounded-xl bg-mas-red/10 border border-mas-red/20 text-mas-red">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white uppercase tracking-tight italic">Clearance Timeline</h2>
                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Deployment Protocol Progress</p>
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
                                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1 block">Simulation Terminal: <span className="text-white font-mono">[SIM_AUTH_NODE]</span></span>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-mas-red animate-pulse" />
                                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em]">Bypassing Primary Auth...</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 opacity-20 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => dispatch(setStatus('step1_approved'))}
                                className="px-5 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-mas-red hover:border-mas-red/40 hover:bg-mas-red/5 transition-all"
                            >
                                Simulate Step 1
                            </button>
                            <button 
                                onClick={() => dispatch(setStatus('fully_approved'))}
                                className="px-5 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-green-500 hover:border-green-500/40 hover:bg-green-500/5 transition-all"
                            >
                                Simulate Final
                            </button>
                        </div>
                    </div>
                </main>

                <aside className="lg:sticky lg:top-12">
                    <NotificationPanel />
                </aside>
            </div>

            {/* Footer Summary Actions */}
            <div className="mt-24 pt-12 border-t border-white/[0.03] flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex gap-6 items-center flex-1">
                    <div className="hidden md:flex flex-col items-end border-r border-white/10 pr-6">
                        <span className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.3em]">Status Code</span>
                        <span className="text-[11px] text-white font-mono italic">{currentStatus.toUpperCase()}</span>
                    </div>
                    <div className="max-w-md">
                        <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Protocol Insight</p>
                        <p className="text-white text-xs font-bold uppercase tracking-wider leading-relaxed italic">"{getStatusMessage()}"</p>
                    </div>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    {currentStatus === 'step1_approved' && (
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.location.href='/request-step-2'} 
                            className="flex-1 md:flex-none px-10 py-5 bg-mas-red text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_20px_40px_rgba(200,16,46,0.3)] hover:shadow-[0_20px_60px_rgba(200,16,46,0.5)] transition-all animate-pulse"
                        >
                            Finalize Form 02
                        </motion.button>
                    )}
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.href='/home'} 
                        className="flex-1 md:flex-none px-10 py-5 bg-white/[0.03] border border-white/10 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white/[0.07] transition-all flex items-center justify-center gap-3"
                    >
                        <ArrowLeft size={16} /> Hub
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default StatusMain;
