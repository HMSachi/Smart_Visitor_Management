import React from 'react';
import { Truck, Hash, Car } from 'lucide-react';

const VehicleDetails = ({ data, onChange }) => {
    return (
        <section className="animate-fade-in stagger-item">
            <div className="flex items-center gap-4 mb-10">
                <div className="p-3 rounded-xl bg-mas-red/10 border border-mas-red/20 text-mas-red">
                    <Car size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tight">Access Vehicle</h2>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Logistics & Entry Node</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/[0.02] border border-white/5 p-8 rounded-3xl">
                {/* Vehicle Number */}
                <div className="relative group/field">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block group-focus-within/field:text-mas-red transition-colors">
                        Registration Number
                    </label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/field:text-mas-red transition-colors">
                            <Hash size={18} />
                        </div>
                        <input 
                            type="text"
                            name="vehicleNumber"
                            value={data.vehicleNumber}
                            onChange={onChange}
                            placeholder="WP ABC-0000"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-mas-red/50 transition-all placeholder-gray-700 uppercase tracking-widest"
                        />
                    </div>
                </div>

                {/* Vehicle Type */}
                <div className="relative group/field">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block group-focus-within/field:text-mas-red transition-colors">
                        Vessel Category
                    </label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/field:text-mas-red transition-colors pointer-events-none">
                            <Truck size={18} />
                        </div>
                        <select 
                            name="vehicleType"
                            value={data.vehicleType}
                            onChange={onChange}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-mas-red/50 transition-all appearance-none uppercase tracking-wider cursor-pointer"
                        >
                            <option value="Car" className="bg-mas-dark-800">Car / Sedan</option>
                            <option value="Van" className="bg-mas-dark-800">Van / SUV</option>
                            <option value="Truck" className="bg-mas-dark-800">Heavy Truck</option>
                            <option value="Other" className="bg-mas-dark-800">Other Vessel</option>
                        </select>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VehicleDetails;
