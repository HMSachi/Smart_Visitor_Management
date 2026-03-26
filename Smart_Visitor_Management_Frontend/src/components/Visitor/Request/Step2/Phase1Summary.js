import React from 'react';

const Phase1Summary = ({ summary }) => {
    return (
        <section className="bg-white/[0.02] border border-white/5 p-12">
            <div className="flex items-center space-x-6 mb-12">
                <div className="w-8 h-[1px] bg-mas-red"></div>
                <h2 className="text-white uppercase">Phase 1 Summary</h2>
            </div>
            <div className="space-y-6">
                {[
                    { label: 'VISIT DATE', value: summary.date },
                    { label: 'PURPOSE', value: summary.purpose },
                    { label: 'VISITORS', value: summary.visitors },
                    { label: 'FACILITY ZONES', value: summary.areas.join(', ') }
                ].map((item) => (
                    <div key={item.label} className="flex justify-between items-end border-b border-white/5 pb-4">
                        <span className="text-gray-300 uppercase">{item.label}</span>
                        <span className="text-white uppercase">{item.value}</span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Phase1Summary;
