import React from 'react';

const AreasToVisit = ({ selectedAreas, onToggle }) => {
    const areasList = [
        { id: 'reception', name: 'Main Reception', icon: '🏢' },
        { id: 'office', name: 'Corporate Office', icon: '💼' },
        { id: 'factory', name: 'Production Floor', icon: '🏭' },
        { id: 'warehouse', name: 'Logistics Hub', icon: '📦' },
        { id: 'canteen', name: 'Dining Area', icon: '☕' }
    ];

    return (
        <section className="stagger-item">
            <div className="flex items-center space-x-6 mb-12">
                <div className="w-8 h-[1px] bg-mas-red"></div>
                <h2 className="text-xl font-display font-black text-white uppercase tracking-widest">Areas to Visit</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {areasList.map((area) => (
                    <div 
                        key={area.id}
                        onClick={() => onToggle(area.id)}
                        className={`p-6 border transition-all cursor-pointer group/area ${
                            selectedAreas.includes(area.id)
                                ? 'bg-mas-red border-mas-red'
                                : 'bg-white/5 border-white/5 hover:border-mas-red/40'
                        }`}
                    >
                        <div className="text-2xl mb-4 grayscale group-hover/area:grayscale-0 transition-all">{area.icon}</div>
                        <span className={`text-[9px] uppercase tracking-[0.1em] font-bold block ${
                            selectedAreas.includes(area.id) ? 'text-white' : 'text-gray-300'
                        }`}>
                            {area.name}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AreasToVisit;
