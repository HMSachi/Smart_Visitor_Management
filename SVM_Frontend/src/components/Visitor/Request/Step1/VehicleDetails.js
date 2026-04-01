import React from 'react';
import { Truck, Hash, Car } from 'lucide-react';

const VehicleDetails = ({ data, onChange }) => {
    return (
        <section className="animate-fade-in stagger-item">
            <div className="flex items-center gap-3 mb-6">
                <div className="text-mas-red">
                    <Car size={14} />
                </div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-0 !mb-0 transition-all">Vehicle Logistics</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 px-4 py-6 rounded-xl border border-white/5 bg-white/[0.01]">
                {/* Vehicle Number */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-gray-500 uppercase tracking-widest block">
                        Registration Number
                    </label>
                    <div className="relative">
                        <input 
                            type="text"
                            name="vehicleNumber"
                            value={data.vehicleNumber}
                            onChange={onChange}
                            placeholder="WP ABC-0000"
                            className="compact-input w-full uppercase tracking-widest"
                        />
                    </div>
                </div>

                {/* Vehicle Type */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-gray-500 uppercase tracking-widest block">
                        Vehicle Category
                    </label>
                    <div className="relative">
                        <select 
                            name="vehicleType"
                            value={data.vehicleType}
                            onChange={onChange}
                            className="compact-input w-full cursor-pointer"
                        >
                            <option value="Car">Car / Sedan</option>
                            <option value="Van">Van / SUV</option>
                            <option value="Truck">Heavy Truck</option>
                            <option value="Other">Other Category</option>
                        </select>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VehicleDetails;
