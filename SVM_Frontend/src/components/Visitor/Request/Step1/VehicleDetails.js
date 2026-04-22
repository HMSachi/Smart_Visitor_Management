import React from "react";
import { Car, Hash } from "lucide-react";

const VehicleDetails = ({ data, onChange }) => {
  return (
    <section className="animate-fade-in stagger-item">
      <div className="flex flex-col md:flex-row items-center gap-3 md:gap-2 mb-6">
        <div className="text-primary">
          <Car size={15} />
        </div>
        <h3 className="text-sm font-bold text-white uppercase tracking-[0.16em] mb-0">
          Vehicle details
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        {/* Vehicle Type */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.18em] flex flex-col md:flex-row items-center gap-3 md:gap-2 px-1">
            Vehicle type
          </label>
          <div className="relative">
            <input
              type="text"
              name="vehicleType"
              value={data.vehicleType}
              onChange={onChange}
              placeholder="Car, van, or motorbike"
              className="w-full bg-white/[0.03] border border-white/20 rounded-none px-4 py-3 text-[12px] text-white/90 focus:outline-none focus:border-primary/60 transition-all placeholder:text-gray-600 font-medium"
            />
          </div>
        </div>

        {/* Plate Number */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.18em] flex flex-col md:flex-row items-center gap-3 md:gap-2 px-1">
            Plate number
          </label>
          <div className="relative">
            <input
              type="text"
              name="plateNumber"
              value={data.plateNumber}
              onChange={onChange}
              placeholder="Example: WP-CAD-1234"
              className="w-full bg-white/[0.03] border border-white/20 rounded-none px-4 py-3 text-[12px] text-white/90 focus:outline-none focus:border-primary/60 transition-all placeholder:text-gray-600 font-medium"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VehicleDetails;
