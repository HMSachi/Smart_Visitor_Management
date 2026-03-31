import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, ClipboardCheck, Package, Users, CheckCircle2, Clock } from 'lucide-react';
import VisitorGroup from './Step2/VisitorGroup';
import EquipmentDeclaration from './Step2/EquipmentDeclaration';
import Phase1Summary from './Step2/Phase1Summary';
import { updateVisitorRequestStep2 } from '../../../services/visitorRequestService';
import { 
    updateField, 
    addVisitor, 
    removeVisitor, 
    updateVisitorDetail,
    addEquipment,
    removeEquipment,
    updateEquipmentDetail,
    setStatus
} from '../../../reducers/visitorSlice';

const Step2Main = () => {
    const dispatch = useDispatch();
    const visitorState = useSelector(state => state.visitor);
    const { 
        visitors, 
        equipment, 
        status, 
        requestRef 
    } = visitorState;

    const [isConfirmed, setIsConfirmed] = useState(false);

    // Prepare summary from all fields in state (including step 1)
    const step1Summary = {
        fullName: visitorState.fullName,
        nic: visitorState.nic,
        email: visitorState.email,
        date: visitorState.visitDate,
        purpose: visitorState.purpose,
        visitors: visitorState.visitorCount,
        areas: visitorState.selectedAreas || []
    };

    const handleAddVisitor = () => {
        dispatch(addVisitor());
    };

    const handleRemoveVisitor = (id) => {
        dispatch(removeVisitor(id));
    };

    const handleAddEquipment = () => {
        dispatch(addEquipment());
    };

    const handleRemoveEquipment = (id) => {
        dispatch(removeEquipment(id));
    };

    const handleUpdateVisitor = (id, field, value) => {
        dispatch(updateVisitorDetail({ id, field, value }));
    };

    const handleUpdateEquipment = (id, field, value) => {
        dispatch(updateEquipmentDetail({ id, field, value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(setStatus('submitting'));
        setTimeout(() => {
            updateVisitorRequestStep2(requestRef, {
                visitors,
                equipment,
            });
            dispatch(setStatus('step2_pending'));
            window.location.href = '/status';
        }, 2000);
    };

    if (status === 'step2_pending') {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-6 bg-mas-dark-900 border-t border-white/[0.03]">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-xl w-full bg-white/[0.03] border border-white/10 p-10 md:p-14 text-center rounded-[2.5rem] shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-mas-red to-transparent" />
                    
                    <div className="w-20 h-20 bg-mas-red/10 border border-mas-red/20 rounded-3xl mx-auto mb-10 flex items-center justify-center text-mas-red">
                        <ShieldCheck size={40} className="animate-pulse" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight mb-4 italic italic">Under Final Review</h2>
                    <p className="text-gray-500 text-[10px] font-medium uppercase tracking-[0.2em] mb-12 leading-relaxed">
                        Detailed documentation has been received. <br />
                        <span className="text-white">Clearance protocol: Active</span>
                    </p>

                    <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 mb-12 text-left relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <div className="flex items-center gap-3">
                                <Clock size={16} className="text-mas-red" />
                                <span className="text-gray-400 text-[10px] font-medium uppercase tracking-widest">Node Priority</span>
                            </div>
                            <span className="text-white text-[10px] font-medium uppercase tracking-widest bg-mas-red px-3 py-1 rounded-full italic">High Clearance</span>
                        </div>
                        <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '75%' }}
                                transition={{ duration: 2, ease: "easeOut" }}
                                className="h-full bg-mas-red shadow-[0_0_15px_rgba(200,16,46,0.6)]"
                            />
                        </div>
                        <p className="mt-4 text-[9px] text-gray-600 font-medium uppercase tracking-widest">Synchronizing secure facility parameters...</p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button 
                            onClick={() => window.location.href = '/status'}
                            className="w-full py-5 bg-mas-red text-white font-medium uppercase text-xs tracking-widest rounded-2xl shadow-[0_20px_40px_rgba(200,16,46,0.2)] hover:shadow-[0_20px_50px_rgba(200,16,46,0.4)] transition-all flex items-center justify-center gap-3"
                        >
                            Digital Pass <ArrowRight size={18} />
                        </button>
                        <button 
                            onClick={() => window.location.href = '/home'}
                            className="w-full py-5 bg-white/[0.03] border border-white/10 text-white font-medium uppercase text-xs tracking-widest rounded-2xl hover:bg-white/[0.07] transition-all"
                        >
                            Return to Hub
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-12 text-white bg-mas-dark-900 border-t border-white/[0.03]">
            {/* Phase Header */}
            <div className="mb-20 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                <div>
                    <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                        <div className="w-10 h-[2.5px] bg-mas-red" />
                        <span className="text-mas-red font-medium uppercase tracking-[0.4em] text-[10px]">Phase 02 / 02</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-none italic">
                        Detailed <span className="text-mas-red">Clearance</span>
                    </h1>
                    <p className="text-gray-500 text-[10px] uppercase font-medium tracking-[0.2em] mt-2">Verification & Asset Declaration</p>
                </div>

                <div className="flex items-center gap-4 px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl">
                    <ClipboardCheck size={24} className="text-mas-red" />
                    <div>
                        <p className="text-white text-[10px] font-medium uppercase tracking-widest">Protocol Sync</p>
                        <p className="text-gray-500 text-[9px] uppercase font-medium tracking-widest italic">Encrypted Secure Node</p>
                    </div>
                </div>
            </div>

            {/* Progress Visualization */}
            <div className="mb-24 relative px-2">
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: '50%' }}
                        animate={{ width: '100%' }}
                        className="h-full bg-mas-red shadow-[0_0_20px_rgba(200,16,46,0.6)]"
                    />
                </div>
                <div className="absolute top-1/2 left-0 w-3 h-3 bg-mas-red rounded-full -translate-y-1/2 shadow-[0_0_10px_#C8102E]" />
                <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-mas-red rounded-full -translate-y-1/2 shadow-[0_0_10px_#C8102E]" />
                <div className="absolute top-1/2 right-0 w-3 h-3 bg-mas-red rounded-full -translate-y-1/2 shadow-[0_0_10px_#C8102E]" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-32">
                <div className="relative group">
                    <VisitorGroup visitors={visitors} onAdd={handleAddVisitor} onRemove={handleRemoveVisitor} onChange={handleUpdateVisitor} />
                </div>
                
                <div className="relative group border-t border-white/[0.03] pt-24">
                    <EquipmentDeclaration items={equipment} onAdd={handleAddEquipment} onRemove={handleRemoveEquipment} onChange={handleUpdateEquipment} />
                </div>
                
                <div className="relative group border-t border-white/[0.03] pt-24">
                    <Phase1Summary summary={step1Summary} />
                </div>

                {/* Modern Confirmation Action */}
                <div className="space-y-12">
                    <motion.div 
                        whileHover={{ scale: 1.01 }}
                        className="relative p-8 md:p-12 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex items-start gap-8 group/conf cursor-pointer"
                        onClick={() => setIsConfirmed(!isConfirmed)}
                    >
                        <div className={`mt-1 min-w-[24px] h-6 flex items-center justify-center rounded-lg border-2 transition-all duration-300 ${
                            isConfirmed ? 'bg-mas-red border-mas-red shadow-[0_0_15px_rgba(200,16,46,0.4)]' : 'border-white/10 group-hover/conf:border-mas-red/40'
                        }`}>
                            {isConfirmed && <CheckCircle2 size={14} className="text-white" />}
                        </div>
                        <div>
                            <p className="text-[11px] md:text-sm text-gray-400 font-medium uppercase tracking-widest leading-relaxed group-hover/conf:text-gray-300 transition-colors">
                                I verify that all group details and declarations provided above are <span className="text-white italic underline underline-offset-4 decoration-mas-red/40">accurate and authentic</span>. 
                                <br /><br />
                                <span className="text-gray-600 text-[10px]">Unauthorized equipment or undisclosed personnel may result in immediate clearance revocation and facility blacklist.</span>
                            </p>
                        </div>
                    </motion.div>

                    <div className="pt-8 pb-32 text-center">
                        <motion.button 
                            whileHover={isConfirmed ? { scale: 1.02 } : {}}
                            whileTap={isConfirmed ? { scale: 0.98 } : {}}
                            type="submit"
                            disabled={!isConfirmed || status === 'submitting'}
                            className="relative group w-full md:w-auto px-24 py-8 bg-mas-red text-white font-medium uppercase text-sm tracking-[0.3em] rounded-2xl shadow-[0_20px_60px_rgba(200,16,46,0.2)] hover:shadow-[0_20px_80px_rgba(200,16,46,0.4)] transition-all overflow-hidden disabled:opacity-10 disabled:cursor-not-allowed"
                        >
                            <div className="relative z-10 flex items-center justify-center gap-4">
                                {status === 'submitting' ? (
                                    <>
                                        <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Synchronizing Pass...</span>
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck size={20} />
                                        <span>Finalize Detailed Clearance</span>
                                    </>
                                )}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        </motion.button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Step2Main;
