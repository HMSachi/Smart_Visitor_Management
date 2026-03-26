import React from 'react';
import Sidebar from '../../../components/Security_Officer/Layout/Sidebar';
import Header from '../../../components/Security_Officer/Layout/Header';
import SecurityMetrics from '../../../components/Security_Officer/Dashboard/SecurityMetrics';
import { Shield, Zap, Activity, Clock } from 'lucide-react';

const SecurityDashboard = () => {
    return (
        <div className="flex min-h-screen bg-mas-black overflow-x-hidden text-white">
            <Sidebar />
            
            <main className="flex-1 ml-72 flex flex-col min-w-0 bg-[#0A0A0B]">
                <Header title="Security Command center" />

                <div className="p-12 space-y-12 animate-fade-in">
                    {/* Hero Section */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-mas-border pb-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Zap size={14} className="text-mas-red" />
                                <span className="text-mas-red uppercase">Primary Security Node</span>
                                <div className="h-[1px] w-12 bg-mas-red"></div>
                            </div>
                            <h1 className="uppercase text-white flex items-center gap-6">
                                Dashboard
                                <div className="p-4 mas-glass border-mas-red/20 bg-mas-red/[0.03]">
                                    <Shield size={32} className="text-mas-red" />
                                </div>
                            </h1>
                        </div>

                        <div className="flex items-center gap-12 mas-glass p-8 border-white/5">
                             <div className="space-y-2">
                                 <p className="text-mas-text-dim uppercase">Command Status</p>
                                 <div className="flex items-center gap-3">
                                     <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                                     <p className="text-white">NORMAL OPERATIONS</p>
                                 </div>
                             </div>
                             <div className="h-10 w-px bg-white/10"></div>
                             <div className="space-y-2">
                                 <p className="text-mas-text-dim uppercase">Station ID</p>
                                 <p className="text-white">NODE-08-MAIN</p>
                             </div>
                        </div>
                    </div>

                    <SecurityMetrics />

                    {/* Operational Overview */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                         <div className="mas-glass p-12 border-mas-border space-y-8 relative overflow-hidden">
                             <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-4">
                                     <Activity size={18} className="text-mas-red" />
                                     <h3 className="uppercase text-white">Recent Activity Node</h3>
                                 </div>
                                 <button className="text-mas-text-dim uppercase hover:text-white transition-colors underline decoration-mas-red underline-offset-8">View Full Log</button>
                             </div>
                             <div className="space-y-6">
                                 {[
                                     { time: '12:45:01', action: 'Identity Sync Success', sub: 'Visitor John Doe | VER-4291', status: 'COMPLETED' },
                                     { time: '12:30:15', action: 'QR Protocol Initiated', sub: 'Personnel Emma Watson', status: 'COMPLETED' },
                                     { time: '12:15:30', action: 'Manual Override Logged', sub: 'Admin ID: 8812 - Node 04', status: 'FLAGGED' },
                                 ].map((log, i) => (
                                     <div key={i} className="flex items-center justify-between p-6 bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all">
                                         <div className="flex items-center gap-8">
                                             <span className="text-mas-red">{log.time}</span>
                                             <div>
                                                 <p className="uppercase text-white mb-1.5">{log.action}</p>
                                                 <p className="text-mas-text-dim uppercase">{log.sub}</p>
                                             </div>
                                         </div>
                                         <span className={`px-3 py-1 border ${log.status === 'FLAGGED' ? 'border-mas-red text-mas-red' : 'border-mas-text-dim/20 text-mas-text-dim'}`}>{log.status}</span>
                                     </div>
                                 ))}
                             </div>
                         </div>

                         <div className="mas-glass p-12 border-mas-border space-y-8 relative overflow-hidden">
                             <div className="flex items-center gap-4 mb-8">
                                 <Clock size={18} className="text-mas-red" />
                                 <h3 className="uppercase text-white">Facility Load Tracking</h3>
                             </div>
                             <div className="space-y-8">
                                 <div className="space-y-4">
                                     <div className="flex justify-between items-end">
                                         <span className="text-white uppercase">Production Area Load</span>
                                         <span className="text-mas-red">78%</span>
                                     </div>
                                     <div className="h-1.5 w-full bg-white/5">
                                         <div className="h-full bg-mas-red shadow-[0_0_15px_rgba(200,16,46,0.5)]" style={{ width: '78%' }}></div>
                                     </div>
                                 </div>
                                 <div className="space-y-4">
                                     <div className="flex justify-between items-end">
                                         <span className="text-white uppercase">Office Block Capacity</span>
                                         <span className="text-white">42%</span>
                                     </div>
                                     <div className="h-1.5 w-full bg-white/5">
                                         <div className="h-full bg-white/20" style={{ width: '42%' }}></div>
                                     </div>
                                 </div>
                                 <div className="pt-8 grid grid-cols-2 gap-8 border-t border-white/5">
                                     <div>
                                         <p className="text-mas-text-dim uppercase mb-1">Total Entry (24h)</p>
                                         <p className="text-white">412</p>
                                     </div>
                                     <div>
                                         <p className="text-mas-text-dim uppercase mb-1">Current Alerts</p>
                                         <p className="text-mas-red">02</p>
                                     </div>
                                 </div>
                             </div>
                         </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SecurityDashboard;
