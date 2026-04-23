import React from "react";
import { Car, Hash } from "lucide-react";

const VehicleDetails = ({ data, onChange, isLight }) => {
  return (
    <section className="animate-fade-in stagger-item">
      <div className="flex items-center gap-2 mb-3">
        <div className="text-primary">
          <Car size={14} />
        </div>
        <h3
          className={`text-[12px] font-bold uppercase tracking-[0.18em] mb-0 ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
        >
          Vehicle Details
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
        {/* Vehicle Type */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.18em] flex items-center gap-2 px-1">
            VEHICLE TYPE
          </label>
          <div className="relative">
            <input
              type="text"
              name="vehicleType"
              value={data.vehicleType}
              onChange={onChange}
              placeholder="E.G. CAR, VAN"
              className={`w-full rounded-none px-3.5 py-2 text-[11px] focus:outline-none transition-all font-medium ${
                isLight
                  ? "bg-white border border-gray-200 text-[#1A1A1A] focus:border-primary placeholder:text-gray-400"
                  : "bg-white/[0.03] border border-white/20 text-white/90 focus:border-primary/60 placeholder:text-gray-600"
              }`}
            />
          </div>
        </div>

        {/* Plate Number */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.18em] flex items-center gap-2 px-1">
            PLATE NUMBER
          </label>
          <div className="relative">
            <input
              type="text"
              name="plateNumber"
              value={data.plateNumber}
              onChange={onChange}
              placeholder="E.G. WP-CAD-1234"
              className={`w-full rounded-none px-3.5 py-2 text-[11px] focus:outline-none transition-all font-medium ${
                isLight
                  ? "bg-white border border-gray-200 text-[#1A1A1A] focus:border-primary placeholder:text-gray-400"
                  : "bg-white/[0.03] border border-white/20 text-white/90 focus:border-primary/60 placeholder:text-gray-600"
              }`}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VehicleDetails;
