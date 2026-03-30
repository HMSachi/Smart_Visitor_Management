import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import VisitorOverview from './Step1/VisitorOverview';
import VisitInformation from './Step1/VisitInformation';
import VehicleDetails from './Step1/VehicleDetails';
import AreasToVisit from './Step1/AreasToVisit';
import { createVisitorRequest } from '../../../services/visitorRequestService';
import { 
    updateField, 
    toggleArea, 
    updateVisitorCount, 
    setStatus, 
    setRequestRef 
} from '../../../reducers/visitorSlice';

const Step1Main = () => {
    const dispatch = useDispatch();
    const formData = useSelector(state => state.visitor);
    const { status, requestRef } = formData;

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        dispatch(updateField({ 
            name, 
            value: type === 'checkbox' ? checked : value 
        }));
    };

    const handleToggle = (name) => {
        dispatch(updateField({ name, value: !formData[name] }));
    };

    const handleCountChange = (delta) => {
        dispatch(updateVisitorCount(delta));
    };

    const handleToggleArea = (areaId) => {
        dispatch(toggleArea(areaId));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(setStatus('submitting'));
        setTimeout(() => {
            const createdRequest = createVisitorRequest(formData);
            if (createdRequest?.id) {
                dispatch(setRequestRef(createdRequest.id));
            }
            dispatch(setStatus('step1_pending'));
        }, 2000);
    };

    if (status === 'step1_pending') {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-6 bg-mas-dark-900">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white/[0.03] border border-white/10 p-10 md:p-14 text-center rounded-[2.5rem] shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-mas-red to-transparent" />
                    
                    <div className="w-20 h-20 bg-mas-red/10 border border-mas-red/20 rounded-3xl mx-auto mb-10 flex items-center justify-center text-mas-red">
                        <CheckCircle2 size={40} className="animate-bounce" />
                    </div>
                    
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4 italic">Request Dispatched</h2>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-10 leading-relaxed">
                        Your clearance request is being processed by <span className="text-white">MAS Security Node</span>.
                        <br /> Ref: <span className="text-mas-red font-black">{requestRef}</span>
                    </p>

                    <div className="flex flex-col gap-4">
                        <button 
                            onClick={() => window.location.href = '/status'}
                            className="w-full py-5 bg-mas-red text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-[0_20px_40px_rgba(200,16,46,0.2)] hover:shadow-[0_20px_50px_rgba(200,16,46,0.4)] transition-all flex items-center justify-center gap-3"
                        >
                            Track Clearance <ArrowRight size={18} />
                        </button>
                        <button 
                            onClick={() => window.location.href = '/home'}
                            className="w-full py-5 bg-white/[0.03] border border-white/10 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-white/[0.07] transition-all"
                        >
                            Return to Portal
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-12 text-white bg-mas-dark-900">
            {/* Header / Info Section */}
            <div className="mb-16 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                    <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                        <div className="w-10 h-[2.5px] bg-mas-red" />
                        <span className="text-mas-red font-black uppercase tracking-[0.4em] text-[10px]">Phase 01 / 02</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-2 italic">
                        Visitor <span className="text-mas-red">Registration</span>
                    </h1>
                    <p className="text-gray-500 text-[10px] uppercase font-black tracking-[0.2em]">Required for enterprise facility access</p>
                </div>

                <div className="flex items-center gap-4 px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl">
                    <Clock size={20} className="text-mas-red" />
                    <div className="text-left">
                        <p className="text-white text-[10px] font-black uppercase tracking-widest">Est. Processing</p>
                        <p className="text-gray-500 text-[9px] uppercase font-bold tracking-widest">15 - 30 Minutes</p>
                    </div>
                </div>
            </div>

            {/* Progress Visualization */}
            <div className="mb-24 relative px-2">
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '50%' }}
                        className="h-full bg-mas-red shadow-[0_0_20px_rgba(200,16,46,0.6)]"
                    />
                </div>
                <div className="absolute top-1/2 left-0 w-3 h-3 bg-mas-red rounded-full -translate-y-1/2 shadow-[0_0_10px_#C8102E]" />
                <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-mas-red rounded-full -translate-y-1/2 shadow-[0_0_10px_#C8102E]" />
                <div className="absolute top-1/2 left-[100%] w-3 h-3 bg-white/10 rounded-full -translate-y-1/2" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-32">
                <div className="relative group">
                    <VisitorOverview data={formData} onChange={handleInputChange} />
                </div>
                
                <div className="relative group border-t border-white/[0.03] pt-24">
                    <VisitInformation 
                        data={formData} 
                        onChange={handleInputChange} 
                        onToggle={handleToggle} 
                        onCountChange={handleCountChange} 
                    />
                </div>

                <div className="relative group border-t border-white/[0.03] pt-24">
                    <VehicleDetails data={formData} onChange={handleInputChange} />
                </div>

                <div className="relative group border-t border-white/[0.03] pt-24">
                    <AreasToVisit selectedAreas={formData.selectedAreas} onToggle={handleToggleArea} />
                </div>

                {/* Modern Submit Action */}
                <div className="pt-20 pb-32 text-center">
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={status === 'submitting'}
                        className="relative group w-full md:w-auto px-20 py-7 bg-mas-red text-white font-black uppercase text-sm tracking-[0.3em] rounded-2xl shadow-[0_20px_60px_rgba(200,16,46,0.25)] hover:shadow-[0_20px_80px_rgba(200,16,46,0.4)] transition-all overflow-hidden disabled:opacity-50"
                    >
                        <div className="relative z-10 flex items-center justify-center gap-4">
                            {status === 'submitting' ? (
                                <>
                                    <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Syncing Pulse...</span>
                                </>
                            ) : (
                                <>
                                    <ShieldCheck size={20} />
                                    <span>Initialize Access Request</span>
                                </>
                            )}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    </motion.button>
                </div>
            </form>
        </div>
    );
};

export default Step1Main;
