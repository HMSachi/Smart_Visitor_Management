import React from 'react';
import { Car, Hash } from 'lucide-react';

const VehicleDetails = ({ data, onChange }) => {
    return (
        <section className="animate-fade-in stagger-item">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-3 mb-8">
                <div className="text-primary">
                    <Car size={16} />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] mb-0">Vehicle Logistics</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Vehicle Type */}
                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] flex flex-col md:flex-row items-center gap-4 md:gap-2 px-1">
                        VEHICLE TYPE
                    </label>
                    <div className="relative">
                        <input 
                            type="text"
                            name="vehicleType"
                            value={data.vehicleType}
                            onChange={onChange}
                            placeholder="E.G. CAR, VAN"
                            className="w-full bg-white/[0.03] border border-white/20 rounded-none px-4 py-4 text-[13px] text-white/90 focus:outline-none focus:border-primary/60 transition-all placeholder:text-gray-600 font-medium"
                        />
                    </div>
                </div>

                {/* Plate Number */}
                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] flex flex-col md:flex-row items-center gap-4 md:gap-2 px-1">
                        PLATE NUMBER
                    </label>
                    <div className="relative">
                        <input 
                            type="text"
                            name="plateNumber"
                            value={data.plateNumber}
                            onChange={onChange}
                            placeholder="E.G. WP-CAD-1234"
                            className="w-full bg-white/[0.03] border border-white/20 rounded-none px-4 py-4 text-[13px] text-white/90 focus:outline-none focus:border-primary/60 transition-all placeholder:text-gray-600 font-medium"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VehicleDetails;
