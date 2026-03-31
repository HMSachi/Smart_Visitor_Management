import React from 'react';
import { Calendar, Info, Users, Building2, Minus, Plus } from 'lucide-react';

const VisitInformation = ({ data, onChange, onToggle, onCountChange }) => {
    return (
        <section className="animate-fade-in stagger-item">
            <div className="flex items-center gap-4 mb-10">
                <div className="p-3 rounded-xl bg-mas-red/10 border border-mas-red/20 text-mas-red">
                    <Info size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white uppercase tracking-tight">Visit Details</h2>
                    <p className="text-gray-500 text-[10px] font-medium uppercase tracking-[0.2em]">Purpose & Logistics</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/[0.02] border border-white/5 p-8 rounded-3xl">
                {/* Visit Date */}
                <div className="relative group/field">
                    <label className="text-[10px] font-medium uppercase tracking-widest text-gray-500 mb-2 block group-focus-within/field:text-mas-red transition-colors">
                        Planned Date
                    </label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/field:text-mas-red transition-colors">
                            <Calendar size={18} />
                        </div>
                        <input 
                            type="date"
                            name="visitDate"
                            value={data.visitDate}
                            onChange={onChange}
                            required
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-mas-red/50 transition-all [color-scheme:dark]"
                        />
                    </div>
                </div>

                {/* Purpose of Visit */}
                <div className="relative group/field">
                    <label className="text-[10px] font-medium uppercase tracking-widest text-gray-500 mb-2 block group-focus-within/field:text-mas-red transition-colors">
                        Nature of Visit
                    </label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/field:text-mas-red transition-colors pointer-events-none">
                            <Building2 size={18} />
                        </div>
                        <select 
                            name="purpose"
                            value={data.purpose}
                            onChange={onChange}
                            required
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-mas-red/50 transition-all appearance-none uppercase tracking-wider cursor-pointer"
                        >
                            <option value="" className="bg-mas-dark-800">Select Purpose</option>
                            <option value="business" className="bg-mas-dark-800">Business Meeting</option>
                            <option value="maintenance" className="bg-mas-dark-800">System Maintenance</option>
                            <option value="audit" className="bg-mas-dark-800">Site Audit</option>
                            <option value="other" className="bg-mas-dark-800">Other</option>
                        </select>
                    </div>
                </div>

                {/* Company Related Toggle */}
                <div className="flex items-center justify-between p-6 bg-white/[0.03] border border-white/10 rounded-2xl group/toggle">
                    <div className="flex flex-col">
                        <label className="text-[10px] font-medium uppercase tracking-widest text-white group-hover:text-mas-red transition-colors">Corporate Business?</label>
                        <span className="text-[9px] text-gray-500 font-medium uppercase tracking-wider">Related to MAS operations</span>
                    </div>
                    <button 
                        type="button"
                        onClick={() => onToggle('isCompanyRelated')}
                        className={`w-14 h-7 flex items-center p-1 rounded-full transition-all duration-500 ${data.isCompanyRelated ? 'bg-mas-red shadow-[0_0_15px_rgba(200,16,46,0.4)]' : 'bg-white/10'}`}
                    >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-lg transform transition-transform duration-300 ${data.isCompanyRelated ? 'translate-x-7' : 'translate-x-0'}`}></div>
                    </button>
                </div>

                {/* Visitor Count */}
                <div className="flex items-center justify-between p-6 bg-white/[0.03] border border-white/10 rounded-2xl">
                    <div className="flex flex-col">
                        <label className="text-[10px] font-medium uppercase tracking-widest text-white">Delegation Size</label>
                        <span className="text-[9px] text-gray-500 font-medium uppercase tracking-wider">Total persons entering</span>
                    </div>
                    <div className="flex items-center gap-6 bg-mas-dark-900/50 p-2 rounded-xl border border-white/5">
                        <button 
                            type="button" 
                            onClick={(e) => { e.preventDefault(); onCountChange(-1); }}
                            className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/[0.03] hover:bg-mas-red hover:text-white text-gray-400 transition-all border border-white/5"
                        >
                            <Minus size={16} />
                        </button>
                        <span className="text-white font-medium text-lg w-6 text-center tabular-nums">{data.visitorCount}</span>
                        <button 
                            type="button" 
                            onClick={(e) => { e.preventDefault(); onCountChange(1); }}
                            className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/[0.03] hover:bg-mas-red hover:text-white text-gray-400 transition-all border border-white/5"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VisitInformation;
