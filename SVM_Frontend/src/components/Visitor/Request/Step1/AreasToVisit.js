import React from 'react';
import { Building2, Briefcase, Factory, Package, Coffee, Map } from 'lucide-react';

const AreasToVisit = ({ selectedAreas, onToggle }) => {
    const areasList = [
        { id: 'reception', name: 'Reception', icon: Building2 },
        { id: 'office', name: 'Corporate', icon: Briefcase },
        { id: 'factory', name: 'Production', icon: Factory },
        { id: 'warehouse', name: 'Logistics', icon: Package },
        { id: 'canteen', name: 'Dining', icon: Coffee }
    ];

    return (
        <section className="animate-fade-in stagger-item">
            <div className="flex items-center gap-3 mb-6">
                <div className="text-primary">
                    <Map size={14} />
                </div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-0 !mb-0 transition-all">Access Zones</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {areasList.map((area) => (
                    <div 
                        key={area.id}
                        onClick={() => onToggle(area.id)}
                        className={`group relative py-4 px-3 rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-2 ${
                            selectedAreas.includes(area.id) 
                            ? 'bg-primary border-primary' 
                            : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]'
                        }`}
                    >
                        <div className={`transition-all duration-300 ${
                            selectedAreas.includes(area.id) ? 'text-white' : 'text-gray-500 group-hover:text-primary'
                        }`}>
                            <area.icon size={18} />
                        </div>
                        <span className={`text-[13px] font-semibold uppercase tracking-widest transition-colors ${
                            selectedAreas.includes(area.id) ? 'text-white' : 'text-gray-500 group-hover:text-white'
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
