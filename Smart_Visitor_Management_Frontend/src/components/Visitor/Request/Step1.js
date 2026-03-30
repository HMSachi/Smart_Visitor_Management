import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
} from '../../../reducers/visitor/visitorSlice';

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
            dispatch(setStatus('sent'));
        }, 1500);
    };

    if (status === 'sent') {
        return (
            <div className="min-h-screen bg-charcoal-900 flex items-center justify-center p-6">
                <div className="max-w-md w-full glass-panel p-12 text-center border-mas-red/20 animate-fade-in text-white transition-all duration-1000">
                    <div className="w-16 h-16 bg-mas-red/20 border border-mas-red mx-auto mb-8 flex items-center justify-center">
                        <svg className="w-8 h-8 text-mas-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="uppercase mb-4">Request Sent for Approval</h2>
                    <p className="text-gray-300 mb-12 uppercase">
                        Your basic clearance request has been dispatched to the MAS Security Node. <br /> Reference: <span className="text-mas-red">{requestRef}</span>
                    </p>
                    <button 
                        onClick={() => window.location.href = '/status'}
                        className="px-12 py-4 bg-mas-red text-white uppercase hover:bg-[#A60D26] shadow-[0_0_20px_rgba(200,16,46,0.3)] transition-all"
                    >
                        Track My Status
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto text-white">
            {/* Progress Bar */}
            <div className="mb-16">
                <div className="flex justify-between items-center mb-4">
                    <span className="uppercase text-mas-red">01 / 02</span>
                    <span className="uppercase text-gray-100">Basic Information</span>
                </div>
                <div className="h-[2px] w-full bg-white/10 relative">
                    <div className="absolute top-0 left-0 h-full bg-mas-red w-1/2 transition-all duration-1000 shadow-[0_0_10px_#C8102E]"></div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-20">
                <VisitorOverview data={formData} onChange={handleInputChange} />
                <VisitInformation 
                    data={formData} 
                    onChange={handleInputChange} 
                    onToggle={handleToggle} 
                    onCountChange={handleCountChange} 
                />
                <VehicleDetails data={formData} onChange={handleInputChange} />
                <AreasToVisit selectedAreas={formData.selectedAreas} onToggle={handleToggleArea} />

                {/* Submit Button */}
                <div className="pt-24 text-center">
                    <button 
                        type="submit"
                        disabled={status === 'submitting'}
                        className="bg-mas-red text-white px-24 py-6 uppercase hover:shadow-[0_0_40px_rgba(200,16,46,0.3)] transform hover:scale-105 transition-all relative group overflow-hidden disabled:opacity-50"
                    >
                        <span className="relative z-10">
                            {status === 'submitting' ? 'PROCESING DATA...' : 'Submit Request for Approval'}
                        </span>
                        <div className="absolute top-0 right-0 h-full w-0 bg-white/10 group-hover:w-full transition-all duration-700"></div>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Step1Main;
