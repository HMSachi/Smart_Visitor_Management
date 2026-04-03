import React from 'react';
import { User, MapPin, Car, Briefcase, AlertTriangle, CheckCircle2 } from 'lucide-react';

const VerificationPanel = () => {
    const visitorData = {
        name: 'John Doe',
        nic: '199042813V',
        count: 1,
        date: 'Oct 26, 2024',
        areas: ['Production Area 08', 'Main Office'],
        vehicle: { number: 'WP-CAS-4291', type: 'Car' },
        equipment: ['Laptop (MacBook Pro)', 'Camera (DSLR)'],
        mismatch: true,
        mismatchField: 'Vehicle Details'
    };

    return (
        <div className="flex flex-col gap-12 w-full max-w-4xl mx-auto">
            {/* Details Panel */}
            <div className="flex flex-col gap-12">
                    {/* Visitor Main */}
                    <div className="mas-glass p-4 md:p-10 border-mas-border space-y-10 relative overflow-hidden h-full">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <User size={120} />
                    </div>
                    
                    <section className="space-y-6">
                        <h3 className="text-primary uppercase mb-6">Visitor Identity</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <p className="text-gray-300 uppercase">Full Personnel Name</p>
                                <p className="uppercase text-white">{visitorData.name}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-gray-300 uppercase">NIC / Identity Ref</p>
                                <p className="uppercase text-white">{visitorData.nic}</p>
                            </div>
                        </div>
                    </section>

                    <section className="pt-10 border-t border-white/5 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-primary uppercase">Access Protocol</h3>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="uppercase text-green-500">Pre-Approved</span>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {visitorData.areas.map((area, i) => (
                                    <div key={i} className="px-5 py-2 bg-white/[0.03] border border-white/10 uppercase text-white flex items-center gap-3">
                                        <MapPin size={12} className="text-primary" />
                                        {area}
                                    </div>
                                ))}
                            </div>
                    </section>
                    </div>

                    {/* Equipment & Vehicle */}
                    <div className="flex flex-col gap-8 h-full">
                    <div className="mas-glass p-4 md:p-10 border-mas-border relative overflow-hidden group flex-1">
                        <div className="flex items-center gap-4 mb-8">
                            <Car size={18} className="text-primary" />
                            <h3 className="uppercase text-white">Vehicle Manifest</h3>
                        </div>
                        <div className="space-y-4">
                            <p className="text-gray-300 uppercase">Authorized Record</p>
                            <div className="p-4 bg-mas-dark border-l-2 border-primary flex justify-between items-center">
                                <span className="uppercase text-white">{visitorData.vehicle.number}</span>
                                <span className="text-gray-300 uppercase">{visitorData.vehicle.type}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mas-glass p-4 md:p-10 border-mas-border relative overflow-hidden group flex-1">
                            <div className="flex items-center gap-4 mb-8">
                            <Briefcase size={18} className="text-primary" />
                            <h3 className="uppercase text-white">Asset Registry</h3>
                        </div>
                        <div className="space-y-4">
                            {visitorData.equipment.map((item, i) => (
                                <div key={i} className="p-4 bg-white/[0.02] border border-white/5 flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-primary opacity-30"></div>
                                    <span className="uppercase text-white/80">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    </div>
            </div>

            {/* Validation Status Panel */}
            <div className="h-fit space-y-4 md:space-y-8">
                    <div className={`mas-glass p-6 md:p-12 lg:py-24 border-2 relative overflow-hidden ${visitorData.mismatch ? 'border-primary shadow-[inset_0_0_50px_rgba(200,16,46,0.1)]' : 'border-green-500/30'}`}>
                        <div className="flex flex-col items-center text-center space-y-4 md:space-y-8 max-w-2xl mx-auto">
                            <div className={`w-24 h-24 flex items-center justify-center rounded-none border-2 p-4 animate-pulse ${visitorData.mismatch ? 'border-primary text-primary' : 'border-green-500 text-green-500'}`}>
                                {visitorData.mismatch ? <AlertTriangle size={48} /> : <CheckCircle2 size={48} />}
                            </div>
                            
                            <div className="space-y-2">
                                <h3 className={`uppercase text-2xl ${visitorData.mismatch ? 'text-primary' : 'text-green-500'}`}>
                                    {visitorData.mismatch ? 'PROTOCOL BREACH' : 'AUTHENTICATION SUCCESS'}
                                </h3>
                                <p className="text-gray-300 uppercase">
                                    {visitorData.mismatch ? `Mismatch detected at node: ${visitorData.mismatchField}` : 'Primary and Tactical nodes in sync'}
                                </p>
                            </div>

                            {visitorData.mismatch && (
                                <div className="w-full p-6 bg-primary/5 border border-primary/20 space-y-4 text-left">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 rounded-full bg-primary"></div>
                                        <span className="uppercase text-white">Manual Counter-Check Required</span>
                                    </div>
                                    <p className="text-gray-300 uppercase leading-6 decoration-white/10 underline underline-offset-4 decoration-dashed">
                                    Actual vehicle number plate does not match the registered manifest node in Step 2.
                                    </p>
                                </div>
                            )}

                            <button 
                            onClick={() => window.location.href = '/Security_Officer/entry-approval'}
                            className={`w-full py-5 text-lg uppercase transition-all ${visitorData.mismatch ? 'bg-primary text-white shadow-[0_0_30px_rgba(200,16,46,0.2)]' : 'bg-green-600 text-white shadow-[0_0_30px_rgba(34,197,94,0.2)]'}`}
                            >
                                Proceed to Final Approval
                            </button>
                        </div>
                    </div>

                    <div className="p-8 mas-glass border-white/5 bg-white/[0.01] flex justify-between items-center">
                        <span className="uppercase text-gray-300">Tactical Node: NODE-SEC-08</span>
                        <span className="uppercase text-gray-300">Uptime: 04:21:09</span>
                    </div>
            </div>
        </div>
    );
};

export default VerificationPanel;
