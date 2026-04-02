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
            <div className="min-h-[80vh] flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white/[0.02] border border-white/5 p-10 text-center rounded-2xl shadow-xl">
                    <div className="w-16 h-16 bg-mas-red/10 border border-mas-red/20 rounded-2xl mx-auto mb-8 flex items-center justify-center text-mas-red">
                        <CheckCircle2 size={32} />
                    </div>
                    
                    <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-3">Request Dispatched</h2>
                    <p className="text-gray-500 text-[14px] font-medium uppercase tracking-widest mb-8 leading-relaxed">
                        Your clearance request is being processed.
                        <br /> Ref: <span className="text-white font-semibold">{requestRef}</span>
                    </p>

                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={() => window.location.href = '/status'}
                            className="w-full py-4 bg-mas-red text-white font-semibold uppercase text-[14px] tracking-widest rounded-xl hover:bg-mas-red-hover transition-all"
                        >
                            Track Clearance
                        </button>
                        <button 
                            onClick={() => window.location.href = '/home'}
                            className="w-full py-4 bg-white/[0.02] border border-white/10 text-white font-semibold uppercase text-[14px] tracking-widest rounded-xl hover:bg-white/[0.05] transition-all"
                        >
                            Return Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 pt-2 pb-12 text-white">
            {/* Header Section */}
            <div className="mb-10 flex items-center justify-between border-b border-white/5 pb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-mas-red font-bold text-[13px] uppercase tracking-widest">Phase 01 / 02</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-1">
                        Visitor <span className="text-mas-red">Registration</span>
                    </h1>
                    <p className="text-gray-500 text-[14px] uppercase font-medium tracking-wider">Facility Access Clearance Request</p>
                </div>
            </div>

            {/* Thinner Progress Indicator */}
            <div className="mb-12 px-2">
                <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-mas-red w-1/2" />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
                <VisitorOverview data={formData} onChange={handleInputChange} />
                
                <div className="border-t border-white/5 pt-10">
                    <VisitInformation 
                        data={formData} 
                        onChange={handleInputChange} 
                        onToggle={handleToggle} 
                        onCountChange={handleCountChange} 
                    />
                </div>

                <div className="border-t border-white/5 pt-10">
                    <VehicleDetails data={formData} onChange={handleInputChange} />
                </div>

                <div className="border-t border-white/5 pt-10">
                    <AreasToVisit selectedAreas={formData.selectedAreas} onToggle={handleToggleArea} />
                </div>

                {/* Minimal Submit Action */}
                <div className="pt-12 pb-24 border-t border-white/5">
                    <button 
                        type="submit"
                        disabled={status === 'submitting'}
                        className="compact-btn !w-full md:!w-auto !px-16 !py-4 flex items-center justify-center gap-3 mx-auto"
                    >
                        {status === 'submitting' ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Verifying...</span>
                            </>
                        ) : (
                            <>
                                <ShieldCheck size={16} />
                                <span>Submit Access Request</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Step1Main;
