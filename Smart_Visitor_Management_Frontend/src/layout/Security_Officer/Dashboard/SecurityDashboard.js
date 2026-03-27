import React from 'react';
import Sidebar from '../../../components/Security_Officer/Layout/Sidebar';
import Header from '../../../components/Security_Officer/Layout/Header';
import SecurityMetrics from '../../../components/Security_Officer/Dashboard/SecurityMetrics';
import { Shield, Zap } from 'lucide-react';

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


                </div>
            </main>
        </div>
    );
};

export default SecurityDashboard;
