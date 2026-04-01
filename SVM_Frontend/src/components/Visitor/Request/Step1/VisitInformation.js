import React from 'react';
import { Calendar, Info, Users, Building2, Minus, Plus } from 'lucide-react';

const VisitInformation = ({ data, onChange, onToggle, onCountChange }) => {
    return (
        <section className="animate-fade-in stagger-item">
            <div className="flex items-center gap-3 mb-6">
                <div className="text-mas-red">
                    <Info size={14} />
                </div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-0 !mb-0 transition-all">Visit Logistics</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 px-4 py-6 rounded-xl border border-white/5 bg-white/[0.01]">
                {/* Visit Date */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-gray-500 uppercase tracking-widest block">
                        Planned Date
                    </label>
                    <div className="relative">
                        <input 
                            type="date"
                            name="visitDate"
                            value={data.visitDate}
                            onChange={onChange}
                            required
                            className="compact-input w-full [color-scheme:dark]"
                        />
                    </div>
                </div>

                {/* Purpose of Visit */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-gray-500 uppercase tracking-widest block">
                        Nature of Visit
                    </label>
                    <div className="relative">
                        <select 
                            name="purpose"
                            value={data.purpose}
                            onChange={onChange}
                            required
                            className="compact-input w-full cursor-pointer"
                        >
                            <option value="">Select Purpose</option>
                            <option value="business">Business Meeting</option>
                            <option value="maintenance">System Maintenance</option>
                            <option value="audit">Audit/Inspection</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                {/* Person to Visit (New) */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-gray-500 uppercase tracking-widest block">
                        Person to Visit / Host
                    </label>
                    <div className="relative">
                        <input 
                            type="text"
                            name="hostPerson"
                            value={data.hostPerson || ''}
                            onChange={onChange}
                            placeholder="Enter Name"
                            className="compact-input w-full"
                        />
                    </div>
                </div>

                {/* Company Related Toggle */}
                <div className="flex items-center justify-between px-5 py-3 rounded-xl border border-white/5 bg-white/[0.01]">
                    <div className="flex flex-col">
                        <label className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">Corporate Business?</label>
                        <span className="text-[10px] text-gray-600 font-medium tracking-tight">MAS Holdings Related</span>
                    </div>
                    <button 
                        type="button"
                        onClick={() => onToggle('isCompanyRelated')}
                        className={`w-10 h-5 flex items-center p-0.5 rounded-full transition-all duration-500 ${data.isCompanyRelated ? 'bg-mas-red' : 'bg-white/10'}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${data.isCompanyRelated ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </button>
                </div>

                {/* Visitor Count */}
                <div className="flex items-center justify-between px-5 py-3 rounded-xl border border-white/5 bg-white/[0.01]">
                    <div className="flex flex-col">
                        <label className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">Delegation Size</label>
                        <span className="text-[10px] text-gray-600 font-medium tracking-tight">Total persons entering</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            type="button" 
                            onClick={(e) => { e.preventDefault(); onCountChange(-1); }}
                            className="w-7 h-7 rounded border border-white/10 bg-white/[0.03] flex items-center justify-center text-gray-500 hover:text-white transition-all active:scale-90"
                        >
                            <Minus size={14} />
                        </button>
                        <span className="text-white font-medium text-sm w-4 text-center">{data.visitorCount}</span>
                        <button 
                            type="button" 
                            onClick={(e) => { e.preventDefault(); onCountChange(1); }}
                            className="w-7 h-7 rounded border border-white/10 bg-white/[0.03] flex items-center justify-center text-gray-500 hover:text-white transition-all active:scale-90"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VisitInformation;
