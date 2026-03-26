import React from 'react';

const StatusTimeline = ({ currentStage }) => {
    const stages = [
        { id: 'submitted', label: 'Request Submitted', time: 'MAR 24, 10:45 AM', status: 'completed' },
        { id: 'review', label: 'Under MAS Review', time: 'MAR 24, 11:02 AM', status: 'active' },
        { id: 'verification', label: 'Identity Verification', time: 'PENDING', status: 'upcoming' },
        { id: 'authorized', label: 'Access Authorized', time: 'PENDING', status: 'upcoming' }
    ];

    return (
        <div className="space-y-12 relative">
            {/* Vertical Line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-[1px] bg-white/5"></div>
            
            {stages.map((stage, idx) => (
                <div key={stage.id} className="relative pl-12 group">
                    {/* Node */}
                    <div className={`absolute left-0 top-1 w-[24px] h-[24px] border-2 transition-all duration-500 ${ stage.status === 'completed' ? 'bg-mas-red border-mas-red' : stage.status === 'active' ? 'bg-charcoal-900 border-mas-red animate-pulse shadow-[0_0_15px_#C8102E]' : 'bg-charcoal-900 border-white/20 group-hover:border-white/40 shadow-sm' }`}>
                        {stage.status === 'completed' && (
                            <svg className="w-4 h-4 text-white mx-auto mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </div>

                    <div>
                        <h4 className={`uppercase mb-1 ${ stage.status === 'upcoming' ? 'text-gray-400' : 'text-white' }`}>
                            {stage.label}
                        </h4>
                        <p className={`uppercase ${ stage.status === 'active' ? 'text-mas-red' : 'text-charcoal-400' } ${stage.status === 'upcoming' ? 'text-gray-500' : 'text-gray-300'}`}>
                            {stage.time}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatusTimeline;
