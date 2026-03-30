import React from 'react';
import { motion } from 'framer-motion';
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
            <div className="flex items-center gap-4 mb-10">
                <div className="p-3 rounded-xl bg-mas-red/10 border border-mas-red/20 text-mas-red">
                    <Map size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tight">Access Zones</h2>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Authorized Parameters</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {areasList.map((area) => (
                    <motion.div 
                        key={area.id}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onToggle(area.id)}
                        className={`group relative p-6 md:p-8 rounded-[2rem] border transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-4 ${
                            selectedAreas.includes(area.id) 
                            ? 'bg-mas-red border-mas-red shadow-[0_15px_30px_rgba(200,16,46,0.3)]' 
                            : 'bg-white/[0.03] border-white/10 hover:border-mas-red/40 hover:bg-white/[0.05]'
                        }`}
                    >
                        <div className={`transition-all duration-300 ${
                            selectedAreas.includes(area.id) ? 'text-white scale-110' : 'text-gray-500 group-hover:text-mas-red'
                        }`}>
                            <area.icon size={28} />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                            selectedAreas.includes(area.id) ? 'text-white' : 'text-gray-500 group-hover:text-white'
                        }`}>
                            {area.name}
                        </span>
                        
                        {/* Selected Indicator Dot */}
                        {selectedAreas.includes(area.id) && (
                            <motion.div 
                                layoutId="indicator"
                                className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full animate-pulse" 
                            />
                        )}
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default AreasToVisit;
