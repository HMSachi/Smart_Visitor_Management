import React, { useState } from 'react';
import VisitorOverview from '../../components/Request/Step1/VisitorOverview';
import VisitInformation from '../../components/Request/Step1/VisitInformation';
import VehicleDetails from '../../components/Request/Step1/VehicleDetails';
import AreasToVisit from '../../components/Request/Step1/AreasToVisit';

const Step1Request = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        nic: '',
        contact: '',
        email: '',
        visitDate: '',
        purpose: '',
        purposeOther: '',
        isCompanyRelated: false,
        visitorCount: 1,
        vehicleNumber: '',
        vehicleType: 'Car',
        selectedAreas: []
    });

    const [status, setStatus] = useState(null); // 'submitting', 'sent', 'rejected'

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleToggle = (name) => {
        setFormData(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const handleCountChange = (delta) => {
        setFormData(prev => ({ ...prev, visitorCount: Math.max(1, prev.visitorCount + delta) }));
    };

    const toggleArea = (areaId) => {
        setFormData(prev => ({
            ...prev,
            selectedAreas: prev.selectedAreas.includes(areaId)
                ? prev.selectedAreas.filter(id => id !== areaId)
                : [...prev.selectedAreas, areaId]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('submitting');
        setTimeout(() => {
            setStatus('sent');
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
                    <h2 className="text-2xl font-display font-black uppercase tracking-tight mb-4">Request Sent for Approval</h2>
                    <p className="text-gray-300 font-light text-sm mb-12 uppercase tracking-widest leading-loose">
                        Your basic clearance request has been dispatched to the MAS Security Node. <br /> Reference: <span className="text-mas-red">MAS-VAS-PENDING</span>
                    </p>
                    <button 
                        onClick={() => window.location.href = '/status'}
                        className="px-12 py-4 bg-mas-red text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#A60D26] shadow-[0_0_20px_rgba(200,16,46,0.3)] transition-all"
                    >
                        Track My Status
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-charcoal-900 pt-32 pb-24 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-16">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] uppercase tracking-[0.4em] font-black text-mas-red">01 / 02</span>
                        <span className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-100">Basic Information</span>
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
                    <AreasToVisit selectedAreas={formData.selectedAreas} onToggle={toggleArea} />

                    {/* Submit Button */}
                    <div className="pt-24 text-center">
                        <button 
                            type="submit"
                            disabled={status === 'submitting'}
                            className="bg-mas-red text-white px-24 py-6 text-[12px] font-black uppercase tracking-[0.4em] hover:shadow-[0_0_40px_rgba(200,16,46,0.3)] transform hover:scale-105 transition-all relative group overflow-hidden disabled:opacity-50"
                        >
                            <span className="relative z-10">
                                {status === 'submitting' ? 'PROCESING DATA...' : 'Submit Request for Approval'}
                            </span>
                            <div className="absolute top-0 right-0 h-full w-0 bg-white/10 group-hover:w-full transition-all duration-700"></div>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Step1Request;
