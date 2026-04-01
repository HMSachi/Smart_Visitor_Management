import React from 'react';
import { ClipboardCheck, Calendar, Info, Users, MapPin } from 'lucide-react';

const Phase1Summary = ({ summary }) => {
    return (
        <section className="stagger-item">
            <div className="flex items-center gap-3 mb-8">
                <div className="text-mas-red">
                    <ClipboardCheck size={16} />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-0">Profile Summary</h2>
                    <p className="text-gray-600 text-[9px] font-bold uppercase tracking-widest">Initial Parameters</p>
                </div>
            </div>

            <div className="bg-white/[0.01] border border-white/5 p-8 rounded-xl relative overflow-hidden group">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 relative z-10">
                    {[
                        { label: 'Date', value: summary.date, icon: Calendar },
                        { label: 'Purpose', value: summary.purpose, icon: Info },
                        { label: 'Size', value: `${summary.visitors} Persons`, icon: Users }
                    ].map((item) => (
                        <div key={item.label} className="group/item">
                            <div className="flex items-center gap-2 mb-2">
                                <item.icon size={12} className="text-mas-red/60" />
                                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600">{item.label}</span>
                            </div>
                            <div className="pl-5">
                                <span className="text-gray-300 text-[12px] font-bold uppercase tracking-tight">{item.value || 'NOT_DECLARED'}</span>
                            </div>
                        </div>
                    ))}

                    <div className="md:col-span-2 group/item">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin size={12} className="text-mas-red/60" />
                            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600">Authorized Zones</span>
                        </div>
                        <div className="pl-5 flex flex-wrap gap-2">
                            {(summary.areas || []).length > 0 ? (
                                (summary.areas || []).map((area) => (
                                    <span key={area} className="px-3 py-1 bg-mas-red/10 border border-mas-red/20 text-mas-red text-[9px] font-bold uppercase tracking-widest rounded-lg">
                                        {area}
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-800 text-[10px] font-bold uppercase tracking-widest italic">No Zones Designated</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-mas-red/40" />
                        <span className="text-[8px] font-bold text-gray-700 uppercase tracking-widest">Integrity Check Active</span>
                    </div>
                    <span className="text-[8px] font-bold text-gray-800 uppercase tracking-widest">MAS_ACCESS_PROTOCOL</span>
                </div>
            </div>
        </section>
    );
};

export default Phase1Summary;
