import React from 'react';

const VehicleDetails = ({ data, onChange }) => {
    return (
        <section className="stagger-item">
            <div className="flex items-center space-x-6 mb-12">
                <div className="w-8 h-[1px] bg-mas-red"></div>
                <h2 className="text-white uppercase">Vehicle Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                <div className="relative group/field">
                    <label className="uppercase text-gray-300 mb-3 block">Vehicle Number</label>
                    <input 
                        type="text"
                        name="vehicleNumber"
                        value={data.vehicleNumber}
                        onChange={onChange}
                        placeholder="WP ABC-0000"
                        className="w-full bg-transparent border-b border-white/5 py-4 text-white focus:outline-none focus:border-mas-red transition-all placeholder-gray-400"
                    />
                </div>
                <div className="relative group/field">
                    <label className="uppercase text-gray-300 mb-3 block">Vehicle Type</label>
                    <select 
                        name="vehicleType"
                        value={data.vehicleType}
                        onChange={onChange}
                        className="w-full bg-transparent border-b border-white/5 py-4 text-white focus:outline-none focus:border-mas-red transition-all appearance-none uppercase"
                    >
                        <option value="Car" className="bg-charcoal-900">Car</option>
                        <option value="Van" className="bg-charcoal-900">Van</option>
                        <option value="Truck" className="bg-charcoal-900">Truck</option>
                        <option value="Other" className="bg-charcoal-900">Other</option>
                    </select>
                </div>
            </div>
        </section>
    );
};

export default VehicleDetails;
