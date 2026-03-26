import React from 'react';

const VisitInformation = ({ data, onChange, onToggle, onCountChange }) => {
    return (
        <section className="animate-fade-in stagger-item">
            <div className="flex items-center space-x-6 mb-12">
                <div className="w-8 h-[1px] bg-mas-red"></div>
                <h2 className="text-white uppercase">Visit Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                <div className="relative group/field">
                    <label className="uppercase text-gray-300 mb-3 block">Visit Date</label>
                    <input 
                        type="date"
                        name="visitDate"
                        value={data.visitDate}
                        onChange={onChange}
                        required
                        className="w-full bg-transparent border-b border-white/5 py-4 text-white focus:outline-none focus:border-mas-red transition-all appearance-none [color-scheme:dark]"
                    />
                </div>
                <div className="relative group/field">
                    <label className="uppercase text-gray-300 mb-3 block">Purpose of Visit</label>
                    <select 
                        name="purpose"
                        value={data.purpose}
                        onChange={onChange}
                        required
                        className="w-full bg-transparent border-b border-white/5 py-4 text-white focus:outline-none focus:border-mas-red transition-all appearance-none uppercase"
                    >
                        <option value="" className="bg-charcoal-900">Select Purpose</option>
                        <option value="business" className="bg-charcoal-900">Business Meeting</option>
                        <option value="maintenance" className="bg-charcoal-900">System Maintenance</option>
                        <option value="audit" className="bg-charcoal-900">Site Audit</option>
                        <option value="other" className="bg-charcoal-900">Other</option>
                    </select>
                </div>
                <div className="flex items-center justify-between py-6 border-b border-white/5">
                    <label className="uppercase text-gray-300">Related to Company?</label>
                    <button 
                        type="button"
                        onClick={() => onToggle('isCompanyRelated')}
                        className={`w-12 h-6 flex items-center p-1 transition-colors ${data.isCompanyRelated ? 'bg-mas-red' : 'bg-white/10'}`}
                    >
                        <div className={`w-4 h-4 bg-white transform transition-transform ${data.isCompanyRelated ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                </div>
                <div className="relative group/field">
                    <label className="uppercase text-gray-300 mb-3 block">Number of Visitors</label>
                    <div className="flex items-center space-x-12 py-3 border-b border-white/5">
                        <button type="button" onClick={() => onCountChange(-1)} className="text-white hover:text-mas-red">-</button>
                        <span className="text-white w-8 text-center">{data.visitorCount}</span>
                        <button type="button" onClick={() => onCountChange(1)} className="text-white hover:text-mas-red">+</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VisitInformation;
