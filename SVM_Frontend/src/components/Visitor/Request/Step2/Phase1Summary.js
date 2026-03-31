import React from 'react';
import { ClipboardCheck, Calendar, Info, Users, MapPin } from 'lucide-react';

const Phase1Summary = ({ summary }) => {
    return (
        <section className="animate-fade-in stagger-item">
            <div className="flex items-center gap-4 mb-10">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-mas-red">
                    <ClipboardCheck size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white uppercase tracking-tight">Security Profile Recap</h2>
                    <p className="text-gray-500 text-[10px] font-medium uppercase tracking-[0.2em]">Synchronized Parameters</p>
                </div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden group">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-mas-red/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-mas-red/10 transition-all duration-700" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 relative z-10">
                    {[
                        { label: 'Deployment Date', value: summary.date, icon: Calendar },
                        { label: 'Strategic Purpose', value: summary.purpose, icon: Info },
                        { label: 'Delegation Size', value: `${summary.visitors} Persons`, icon: Users }
                    ].map((item) => (
                        <div key={item.label} className="group/item">
                            <div className="flex items-center gap-3 mb-3">
                                <item.icon size={14} className="text-mas-red/60 group-hover/item:text-mas-red transition-colors" />
                                <span className="text-[10px] font-medium uppercase tracking-widest text-gray-500">{item.label}</span>
                            </div>
                            <div className="pl-7">
                                <span className="text-white text-sm font-medium uppercase tracking-wider">{item.value || 'NOT DECLARED'}</span>
                            </div>
                        </div>
                    ))}

                    <div className="md:col-span-2 group/item">
                        <div className="flex items-center gap-3 mb-5">
                            <MapPin size={14} className="text-mas-red/60 group-hover/item:text-mas-red transition-colors" />
                            <span className="text-[10px] font-medium uppercase tracking-widest text-gray-500">Authorized Facility Zones</span>
                        </div>
                        <div className="pl-7 flex flex-wrap gap-3">
                            {(summary.areas || []).length > 0 ? (
                                (summary.areas || []).map((area) => (
                                    <span key={area} className="px-4 py-2 bg-mas-red/10 border border-mas-red/20 text-mas-red text-[10px] font-medium uppercase tracking-widest rounded-xl italic">
                                        {area}
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-700 text-[10px] font-medium uppercase tracking-widest italic">No Zones Designated</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/[0.03] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-mas-red animate-pulse" />
                        <span className="text-[9px] font-medium text-gray-600 uppercase tracking-[0.3em]">Integrity Check Passed</span>
                    </div>
                    <span className="text-[9px] font-medium text-gray-800 uppercase tracking-[0.3em]">MAS ACCESS PROTOCOL</span>
                </div>
            </div>
        </section>
    );
};

export default Phase1Summary;
