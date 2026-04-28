import React from 'react';
import { Car, Plus, X, Save, Edit2, Loader2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const VehicleDetails = ({ vehicles, onAdd, onRemove, onChange, onSave, savingId }) => {
    return (
        <section className="animate-fade-in stagger-item">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-primary rounded-full" />
                    <div>
                        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-0 flex items-center gap-2">
                            <Car size={16} className="text-primary" /> Vehicle Details
                        </h2>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-none hover:bg-primary hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.2em] group"
                >
                    <Plus size={14} />
                    Add Vehicle
                </button>
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {vehicles.map((vehicle) => (
                        <div
                            key={vehicle.id}
                            className={`relative grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-none border transition-all duration-300 ${
                                vehicle.isConfirmed
                                    ? 'bg-green-500/5 border-green-500/20'
                                    : 'bg-white/[0.02] border-white/5'
                            }`}
                        >
                            <div className="md:col-span-5 space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                                    Type
                                </label>
                                <input
                                    type="text"
                                    placeholder="E.G. CAR, VAN"
                                    disabled={vehicle.isConfirmed}
                                    value={vehicle.vehicleType}
                                    onChange={(e) => onChange(vehicle.id, 'vehicleType', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-2.5 text-[11px] text-white focus:border-primary/50 outline-none disabled:opacity-50"
                                />
                            </div>

                            <div className="md:col-span-5 space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                                    Plate Number
                                </label>
                                <input
                                    type="text"
                                    placeholder="WP CAS 1234"
                                    disabled={vehicle.isConfirmed}
                                    value={vehicle.plateNumber}
                                    onChange={(e) => onChange(vehicle.id, 'plateNumber', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-2.5 text-[11px] text-white focus:border-primary/50 outline-none disabled:opacity-50"
                                />
                            </div>

                            <div className="md:col-span-2 flex items-end justify-end gap-2 pb-0.5">
                                <button
                                    type="button"
                                    onClick={() => onSave(vehicle.id)}
                                    disabled={savingId === vehicle.id}
                                    title={vehicle.isConfirmed ? 'Edit Vehicle' : 'Save Vehicle'}
                                    className={`p-2.5 transition-all disabled:opacity-50 ${
                                        vehicle.isConfirmed
                                            ? 'text-green-400 hover:text-white'
                                            : 'text-primary hover:scale-110'
                                    }`}
                                >
                                    {savingId === vehicle.id
                                        ? <Loader2 size={18} className="animate-spin" />
                                        : vehicle.isConfirmed
                                            ? <Edit2 size={16} />
                                            : <Save size={18} />
                                    }
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onRemove(vehicle.id)}
                                    className="p-2.5 text-gray-700 hover:text-red-500 transition-all hover:scale-110"
                                    title="Remove Vehicle"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </AnimatePresence>

                {vehicles.length === 0 && (
                    <div className="p-10 border border-dashed border-white/5 rounded-none flex flex-col items-center justify-center text-center bg-white/[0.01]">
                        <Car size={32} className="text-white/10 mb-4" />
                        <p className="text-gray-500 text-[11px] font-bold uppercase tracking-widest leading-relaxed">No vehicles declared for this visit.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default VehicleDetails;
