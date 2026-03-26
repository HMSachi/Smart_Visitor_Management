import React, { useState } from 'react';
import Sidebar from '../../../components/Security_Officer/Layout/Sidebar';
import Header from '../../../components/Security_Officer/Layout/Header';
import { ClipboardList, Briefcase, AlertTriangle, Check,  ShieldCheck } from 'lucide-react';

const ExitVerification = () => {
    const [checks, setChecks] = useState({
        equipment: false,
        noItems: false
    });

    const equipmentList = [
        { id: 1, name: 'Laptop (MacBook Pro)', status: 'Verified' },
        { id: 2, name: 'Camera (DSLR)', status: 'Missing', mismatch: true },
    ];

    const toggleCheck = (id) => {
        setChecks(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const hasMismatch = equipmentList.some(item => item.mismatch);
    const allChecked = Object.values(checks).every(v => v);

    return (
        <div className="flex min-h-screen bg-mas-black overflow-x-hidden text-white">
            <Sidebar />
            
            <main className="flex-1 ml-72 flex flex-col min-w-0 bg-[#0A0A0B]">
                <Header title="Terminal Exit Clearance" />

                <div className="p-12 space-y-12 animate-fade-in">
                    <div className="flex items-end justify-between border-b border-mas-border pb-8">
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <ClipboardList size={14} className="text-mas-red" />
                                <span className="text-mas-red uppercase">Exit Protocol Node</span>
                            </div>
                            <h1 className="uppercase">Exit Verification</h1>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Equipment Verification Panel */}
                        <div className="space-y-8">
                            <div className="mas-glass p-10 border-mas-border space-y-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <Briefcase size={80} />
                                </div>
                                
                                <section className="space-y-6">
                                    <h3 className="text-mas-red uppercase">Declared Asset Checklist</h3>
                                    <div className="space-y-4">
                                        {equipmentList.map((item) => (
                                            <div key={item.id} className={`p-6 border flex items-center justify-between transition-all ${item.mismatch ? 'bg-mas-red/5 border-mas-red/30' : 'bg-white/[0.02] border-white/5'}`}>
                                                <div className="flex items-center gap-6">
                                                    <div className={`w-8 h-8 flex items-center justify-center border ${item.mismatch ? 'bg-mas-red text-white border-mas-red' : 'bg-green-500/10 text-green-500 border-green-500'}`}>
                                                        {item.mismatch ? <AlertTriangle size={16} /> : <Check size={16} />}
                                                    </div>
                                                    <span className={`uppercase ${item.mismatch ? 'text-mas-red' : 'text-white'}`}>{item.name}</span>
                                                </div>
                                                <span className={`uppercase ${item.mismatch ? 'text-mas-red' : 'text-mas-text-dim'}`}>{item.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {hasMismatch && (
                                    <div className="p-6 bg-mas-red/10 border border-mas-red/20 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <AlertTriangle size={16} className="text-mas-red" />
                                            <span className="uppercase text-white">Asset Mismatch Warning</span>
                                        </div>
                                        <p className="text-mas-text-dim uppercase leading-6">
                                            The registered DSLR Camera was not scanned during the exit protocol. Report incident if item is missing.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Checklist & Approval Panel */}
                        <div className="space-y-8">
                             <div className="mas-glass p-10 border-mas-border space-y-8">
                                 <h3 className="text-mas-red uppercase">Final Integrity Check</h3>
                                 <div className="space-y-4">
                                    {[
                                        { id: 'equipment', label: 'All Registered Assets Verified', desc: 'Confirm physical inspection of all declared equipment.' },
                                        { id: 'noItems', label: 'No Unauthorized Material', desc: 'Verify personnel are not carrying prohibited company items.' }
                                    ].map((item) => (
                                        <div 
                                            key={item.id}
                                            onClick={() => toggleCheck(item.id)}
                                            className={`p-6 mas-glass border-white/5 flex items-center gap-6 cursor-pointer transition-all hover:bg-white/[0.03] ${checks[item.id] ? 'bg-mas-red/5 border-mas-red/20' : ''}`}
                                        >
                                            <div className={`w-6 h-6 flex items-center justify-center border ${checks[item.id] ? 'bg-mas-red border-mas-red text-white' : 'bg-black border-white/10 text-mas-text-dim'}`}>
                                                {checks[item.id] && <Check size={14} strokeWidth={4} />}
                                            </div>
                                            <div>
                                                <p className="uppercase text-white">{item.label}</p>
                                                <p className="text-mas-text-dim uppercase mt-1">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                 </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <button className="py-5 border-2 border-mas-red text-mas-red uppercase hover:bg-mas-red hover:text-white transition-all flex items-center justify-center gap-4">
                                    <ShieldCheck size={18} strokeWidth={3} />
                                    Report Issue
                                </button>
                                <button 
                                    disabled={!allChecked}
                                    className={`py-5 uppercase flex items-center justify-center gap-4 transition-all ${allChecked ? 'bg-mas-red text-white shadow-[0_0_50px_rgba(200,16,46,0.3)]' : 'bg-white/5 text-white/20 border border-white/5 grayscale pointer-events-none'}`}
                                >
                                    <Check size={18} strokeWidth={3} />
                                    Confirm Exit
                                </button>
                             </div>

                             <div className="p-6 mas-glass border-mas-red/20 flex flex-col items-center text-center space-y-2">
                                 <span className="uppercase text-mas-red">Guardian Node Log</span>
                                 <p className="text-mas-text-dim uppercase">All exit movements are recorded for auditing purposes</p>
                             </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ExitVerification;
