import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Clock } from 'lucide-react';
import VisitorGroup from './Step2/VisitorGroup';
import EquipmentDeclaration from './Step2/EquipmentDeclaration';
import { updateVisitorRequestStep2 } from '../../../services/visitorRequestService';
import { 
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
            <div className="min-h-[80vh] flex items-center justify-center p-6 bg-background border-t border-white/5">
                <div className="max-w-xl w-full bg-white/[0.02] border border-white/5 p-6 md:p-12 text-center rounded-2xl shadow-xl">
                    <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl mx-auto mb-8 flex items-center justify-center text-primary">
                        <ShieldCheck size={24} />
                    </div>
                    
                    <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-3">Under Final Review</h2>
                    <p className="text-gray-500 text-[13px] font-bold uppercase tracking-widest mb-10 leading-relaxed">
                        Detailed documentation synchronized. <br />
                        <span className="text-primary/80">Clearance protocol active</span>
                    </p>

                    <div className="bg-white/[0.01] border border-white/5 rounded-xl p-6 mb-10 text-left">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <Clock size={14} className="text-primary" />
                                <span className="text-gray-500 text-[12px] font-bold uppercase tracking-widest">Protocol Priority</span>
                            </div>
                            <span className="text-white text-[12px] font-bold uppercase tracking-widest bg-primary/20 border border-primary/20 px-2 py-0.5 rounded">High Node</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '75%' }}
                                transition={{ duration: 2, ease: "easeOut" }}
                                className="h-full bg-primary"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={() => window.location.href = '/status'}
                            className="compact-btn !w-full !py-4"
                        >
                            Digital Pass <ArrowRight size={14} className="ml-2" />
                        </button>
                        <button 
                            onClick={() => window.location.href = '/home'}
                            className="px-6 py-3 bg-white/[0.03] border border-white/10 text-white text-[13px] font-bold uppercase tracking-widest rounded-lg hover:bg-white/[0.07] transition-all"
                        >
                            Return to Hub
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-2 pb-12 text-white bg-black">
            {/* Phase Header */}
            <div className="mb-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-10">
                <div>
                    <h1 className="text-[24px] md:text-[24px] font-bold uppercase tracking-tight">
                        Detailed <span className="text-primary">Clearance</span>
                    </h1>
                    <p className="text-gray-500 text-[12px] uppercase font-bold tracking-[0.4em] opacity-80 mt-1">Personnel & Asset Declaration Node</p>
                </div>

            </div>

            {/* Progress Visualization */}
            <div className="mb-12 relative">
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: '50%' }}
                        animate={{ width: '100%' }}
                        className="h-full bg-primary"
                    />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-12">
                <div className="relative group">
                    <VisitorGroup visitors={visitors} onAdd={handleAddVisitor} onRemove={handleRemoveVisitor} onChange={handleUpdateVisitor} />
                </div>
                
                <div className="relative group pt-12 border-t border-white/5">
                    <EquipmentDeclaration items={equipment} onAdd={handleAddEquipment} onRemove={handleRemoveEquipment} onChange={handleUpdateEquipment} />
                </div>
                
                <div className="space-y-10 pt-6">
                    <div className="pt-8 pb-20 text-center">
                        <button 
                            type="submit"
                            disabled={status === 'submitting'}
                            className="compact-btn !w-full md:!w-auto !px-20 !py-5"
                        >
                            {status === 'submitting' ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Synchronizing Pass...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <ShieldCheck size={18} />
                                    <span>Submit</span>
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Step2Main;
