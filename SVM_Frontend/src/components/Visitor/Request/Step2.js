import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ShieldCheck,
    ArrowRight,
    CheckCircle2,
    AlertCircle,
    Loader2
} from 'lucide-react';
import VehicleDetails from './Step2/VehicleDetails';
import VisitorGroup from './Step2/VisitorGroup';
import EquipmentDeclaration from './Step2/EquipmentDeclaration';
import {
    addVehicle,
    removeVehicle,
    updateVehicleDetail,
    toggleVehicleConfirmed,
    markVehicleSavedVisitor,
    addVisitor,
    removeVisitor,
    updateVisitorDetail,
    toggleVisitorConfirmed,
    markVisitorSaved,
    addEquipment,
    removeEquipment,
    updateEquipmentDetail,
    toggleEquipmentConfirmed,
    markEquipmentSaved,
    setStatus,
    setError,
    setSubmitting
} from '../../../reducers/visitorSlice';
import { validateNIC, validatePhone } from '../../../utils/validation';
import { AddVehicle } from '../../../actions/VehicleAction';
import { AddVisitGroup } from '../../../actions/VisitGroupAction';
import { AddItem } from '../../../actions/ItemCarriedAction';

const Step2Main = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const visitorState = useSelector(state => state.visitor);
    const {
        vehicles,
        visitors,
        equipment,
        status,
        requestId,
        isSubmitting,
        error: reduxError
    } = visitorState;

    const [showFinalSuccess, setShowFinalSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    // Saving spinners — track which row is currently in-flight
    const [vehicleSavingId, setVehicleSavingId] = useState(null);
    const [visitorSavingId, setVisitorSavingId] = useState(null);
    const [equipmentSavingId, setEquipmentSavingId] = useState(null);

    // Ensure at least one blank row exists per section
    useEffect(() => {
        if (!vehicles.length) dispatch(addVehicle());
        if (!visitors.length) dispatch(addVisitor());
        if (!equipment.length) dispatch(addEquipment());
    }, [dispatch]);

    // ── VEHICLES ──────────────────────────────────────────────────────────────
    const handleVehicleSave = async (vehicleId) => {
        const vehicle = vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return;

        if (vehicle.isConfirmed) {
            dispatch(toggleVehicleConfirmed(vehicleId));   // toggle to edit mode
            return;
        }
        if (!vehicle.plateNumber?.trim()) {
            alert('Please enter a plate number before saving.');
            return;
        }
        if (!requestId) {
            alert('Visit request not found. Please go back to Step 1.');
            return;
        }

        setVehicleSavingId(vehicleId);
        try {
            await dispatch(AddVehicle({
                VV_Vehicle_Type: vehicle.vehicleType || 'Car',
                VV_Vehicle_Number: vehicle.plateNumber,
                VVR_Request_id: requestId,
            }));
            dispatch(markVehicleSavedVisitor(vehicleId));
        } catch (err) {
            console.error('Failed to save vehicle:', err);
            alert('Failed to save vehicle. Please try again.');
        } finally {
            setVehicleSavingId(null);
        }
    };

    const handleAddVehicle = async () => {
        const unsaved = vehicles.find(v => !v.isConfirmed && v.plateNumber?.trim());
        if (unsaved) await handleVehicleSave(unsaved.id);
        dispatch(addVehicle());
    };

    // ── ADDITIONAL VISITORS ───────────────────────────────────────────────────
    const handleVisitorSave = async (visitorId) => {
        const person = visitors.find(v => v.id === visitorId);
        if (!person) return;

        if (person.isConfirmed) {
            dispatch(toggleVisitorConfirmed(visitorId));   // toggle to edit mode
            return;
        }
        if (!person.fullName?.trim()) {
            alert('Please enter a name before saving.');
            return;
        }

        const nicErr = validateNIC(person.nic);
        if (nicErr) {
            alert(nicErr);
            return;
        }

        const phoneErr = validatePhone(person.contact);
        if (phoneErr) {
            alert(phoneErr);
            return;
        }
        
        if (!requestId) {
            alert('Visit request not found. Please go back to Step 1.');
            return;
        }

        setVisitorSavingId(visitorId);
        try {
            await dispatch(AddVisitGroup({
                VVG_Visitor_Name: person.fullName,
                VVG_NIC_Passport_Number: person.nic || 'N/A',
                VVG_Designation: person.contact || 'N/A',
                VVG_Status: 'A',
                VVR_Request_id: requestId,
            }));
            dispatch(markVisitorSaved(visitorId));
        } catch (err) {
            console.error('Failed to save visitor:', err);
            alert('Failed to save visitor. Please try again.');
        } finally {
            setVisitorSavingId(null);
        }
    };

    const handleAddVisitor = async () => {
        const unsaved = visitors.find(v => !v.isConfirmed && v.fullName?.trim());
        if (unsaved) await handleVisitorSave(unsaved.id);
        dispatch(addVisitor());
    };

    // ── EQUIPMENT / ITEMS ─────────────────────────────────────────────────────
    const handleEquipmentSave = async (itemId) => {
        const item = equipment.find(e => e.id === itemId);
        if (!item) return;

        if (item.isConfirmed) {
            dispatch(toggleEquipmentConfirmed(itemId));   // toggle to edit mode
            return;
        }
        if (!item.itemName?.trim()) {
            alert('Please enter an item name before saving.');
            return;
        }
        if (!requestId) {
            alert('Visit request not found. Please go back to Step 1.');
            return;
        }

        setEquipmentSavingId(itemId);
        try {
            await dispatch(AddItem({
                VVR_Request_id: requestId,
                VIC_Item_Name: item.itemName,
                VIC_Quantity: item.quantity || '1',
                VIC_Designation: item.description || 'N/A',
            }));
            dispatch(markEquipmentSaved(itemId));
        } catch (err) {
            console.error('Failed to save item:', err);
            alert('Failed to save item. Please try again.');
        } finally {
            setEquipmentSavingId(null);
        }
    };

    const handleAddEquipment = async () => {
        const unsaved = equipment.find(e => !e.isConfirmed && e.itemName?.trim());
        if (unsaved) await handleEquipmentSave(unsaved.id);
        dispatch(addEquipment());
    };

    // ── FINAL SUBMIT (skips already-saved rows to avoid duplicates) ───────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!requestId) {
            alert('No Request ID found. Please go back to Step 1.');
            navigate('/request-step-1');
            return;
        }

        dispatch(setSubmitting(true));
        setShowError(false);

        try {
            // Vehicles not yet saved row-by-row
            for (const v of vehicles) {
                if (v.plateNumber && v.isConfirmed && !v.isSavedToServer) {
                    await dispatch(AddVehicle({
                        VV_Vehicle_Type: v.vehicleType || 'Car',
                        VV_Vehicle_Number: v.plateNumber,
                        VVR_Request_id: requestId,
                    }));
                }
            }

            // Additional visitors not yet saved row-by-row
            for (const p of visitors) {
                if (p.fullName && p.isConfirmed && !p.isSavedToServer) {
                    await dispatch(AddVisitGroup({
                        VVG_Visitor_Name: p.fullName,
                        VVG_NIC_Passport_Number: p.nic || 'N/A',
                        VVG_Designation: p.contact || 'N/A',
                        VVG_Status: 'A',
                        VVR_Request_id: requestId,
                    }));
                }
            }

            // Items not yet saved row-by-row
            for (const item of equipment) {
                if (item.itemName && item.isConfirmed && !item.isSavedToServer) {
                    await dispatch(AddItem({
                        VVR_Request_id: requestId,
                        VIC_Item_Name: item.itemName,
                        VIC_Quantity: item.quantity || '1',
                        VIC_Designation: item.description || 'N/A',
                    }));
                }
            }

            setShowFinalSuccess(true);
            setTimeout(() => navigate('/status'), 3000);

        } catch (err) {
            console.error('Failed to save logistics:', err);
            dispatch(setError(err.message));
            setShowError(true);
        } finally {
            dispatch(setSubmitting(false));
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-20 text-white bg-black min-h-screen relative">

            {/* Step Indicator */}
            <div className="flex items-center gap-6 mb-12 px-2">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center border border-green-500/30">
                        <CheckCircle2 size={16} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500">Core Info</span>
                </div>
                <div className="h-[1px] w-12 bg-white/10" />
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-[12px]">2</div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Details</span>
                </div>
            </div>

            {/* Success Popup */}
            {showFinalSuccess && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl animate-fade-in" />
                    <div className="relative bg-[#0A0A0A] p-12 rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-white/5 flex flex-col items-center text-center max-w-md w-full animate-scale-in">
                        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mb-8 shadow-[0_20px_50px_rgba(34,197,94,0.2)]">
                            <ShieldCheck size={48} className="animate-pulse" />
                        </div>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 italic">REQUEST FINALIZED</h3>
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.25em] leading-relaxed mb-10">
                            Your complete visit dossier has been synchronized.<br />Redirecting to security status hub...
                        </p>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 animate-progress-fast" />
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-16">
                <VehicleDetails
                    vehicles={vehicles}
                    onAdd={handleAddVehicle}
                    onRemove={(id) => dispatch(removeVehicle(id))}
                    onChange={(id, field, value) => dispatch(updateVehicleDetail({ id, field, value }))}
                    onSave={handleVehicleSave}
                    savingId={vehicleSavingId}
                />

                <VisitorGroup
                    visitors={visitors}
                    onAdd={handleAddVisitor}
                    onRemove={(id) => dispatch(removeVisitor(id))}
                    onChange={(id, field, value) => dispatch(updateVisitorDetail({ id, field, value }))}
                    onSave={handleVisitorSave}
                    savingId={visitorSavingId}
                />

                <EquipmentDeclaration
                    items={equipment}
                    onAdd={handleAddEquipment}
                    onRemove={(id) => dispatch(removeEquipment(id))}
                    onChange={(id, field, value) => dispatch(updateEquipmentDetail({ id, field, value }))}
                    onSave={handleEquipmentSave}
                    savingId={equipmentSavingId}
                />

                <div className="pt-12 pb-20 flex flex-col sm:flex-row gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/request-step-1')}
                        className="flex-1 py-6 bg-white/5 border border-white/10 text-white hover:bg-white/10 text-[13px] font-black uppercase tracking-[0.4em] rounded-none transition-all flex items-center justify-center gap-4"
                    >
                        <ArrowRight size={20} className="rotate-180" /> BACK TO CORE DETAILS
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-[2] py-6 bg-white text-black hover:bg-gray-100 text-[13px] font-black uppercase tracking-[0.4em] rounded-none transition-all active:scale-[0.98] flex items-center justify-center gap-4 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>SYNCHRONIZING... <Loader2 size={20} className="animate-spin" /></>
                        ) : (
                            <>FINALIZE REGISTRATION <ArrowRight size={20} /></>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Step2Main;
