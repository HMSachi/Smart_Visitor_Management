import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import VisitorOverview from './Step1/VisitorOverview';
import VehicleDetails from './Step1/VehicleDetails';
import { createVisitorRequest } from '../../../services/visitorRequestService';
import { GetAdministratorById } from '../../../actions/AdministratorAction';
import { GetAllVisitors } from '../../../actions/VisitorAction';
import { 
    updateField, 
    setStatus, 
    setRequestRef 
} from '../../../reducers/visitorSlice';

const Step1Main = () => {
    const dispatch = useDispatch();
    const formData = useSelector(state => state.visitor);
    const { status, requestRef } = formData;
    const user = useSelector(state => state.login.user);
    const { administrators } = useSelector(state => state.administrator);
    const { visitorsByCP: visitorList } = useSelector(state => state.visitorManagement);
    
    // Authenticated credentials
    const authUser = user?.ResultSet?.[0];
    const userEmail = authUser?.VA_Email;
    const adminId = authUser?.VA_Admin_id;

    // Fetch both Administrator and Global Visitor records to join data
    useEffect(() => {
        if (authUser?.VA_Role === 'Visitor' && adminId) {
            dispatch(GetAdministratorById(adminId));
            dispatch(GetAllVisitors());
        }
    }, [dispatch, authUser, adminId]);

    // Pre-fill logic for new field names
    useEffect(() => {
        if (visitorList && visitorList.length > 0 && userEmail) {
            const visitorRecord = visitorList.find(v => (v.VV_Email || '').toLowerCase() === userEmail.toLowerCase());
            
            if (visitorRecord) {
                if (!formData.fullName) dispatch(updateField({ name: 'fullName', value: visitorRecord.VV_Name }));
                if (!formData.nic) dispatch(updateField({ name: 'nic', value: visitorRecord.VV_NIC_Passport_NO }));
                if (!formData.phoneNumber) dispatch(updateField({ name: 'phoneNumber', value: visitorRecord.VV_Phone }));
                if (!formData.emailAddress) dispatch(updateField({ name: 'emailAddress', value: visitorRecord.VV_Email }));
                if (!formData.representingCompany) dispatch(updateField({ name: 'representingCompany', value: visitorRecord.VV_Company }));
                return;
            }
        }

        if (administrators && administrators.length > 0) {
            const admin = administrators[0];
            if (!formData.fullName) dispatch(updateField({ name: 'fullName', value: admin.VA_Name }));
            if (!formData.emailAddress) dispatch(updateField({ name: 'emailAddress', value: admin.VA_Email }));
        }
    }, [dispatch, visitorList, administrators, userEmail, formData.fullName, formData.nic, formData.phoneNumber, formData.emailAddress, formData.representingCompany]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        dispatch(updateField({ 
            name, 
            value: type === 'checkbox' ? checked : value 
        }));
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
            <div className="min-h-[60vh] flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white/[0.02] border border-white/5 p-10 text-center rounded-none shadow-2xl relative">
                    <div className="absolute top-0 left-0 w-[2px] h-full bg-primary" />
                    <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-none mx-auto mb-8 flex items-center justify-center text-primary">
                        <ShieldCheck size={32} />
                    </div>
                    
                    <h2 className="text-xl font-bold text-white uppercase tracking-[0.2em] mb-3">Identity Verified</h2>
                    <p className="text-gray-500 text-[12px] font-medium uppercase tracking-[0.3em] mb-10 leading-relaxed">
                        Access record established for <span className="text-white font-semibold">{requestRef}</span>
                    </p>

                    <div className="flex flex-col gap-4">
                        <button 
                            onClick={() => window.location.href = '/status'}
                            className="w-full py-4 bg-primary text-white font-bold uppercase text-[12px] tracking-[0.3em] hover:bg-primary/90 transition-all flex items-center justify-center gap-3"
                        >
                            Track Status <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-2 pb-12 text-white bg-black">
            {/* Header Section */}
            <div className="mb-14 flex items-center justify-between border-b border-white/5 pb-10">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-primary font-black text-[11px] uppercase tracking-[0.4em] opacity-70">Phase 01 / 02</span>
                    </div>
                    <h1 className="text-4xl font-black uppercase tracking-tight mb-2 leading-none">
                        Visitor Registration
                    </h1>
                    <p className="text-gray-500 text-[12px] uppercase font-bold tracking-[0.4em] opacity-80">Facility Access Clearance Request</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-24">
                <VisitorOverview data={formData} onChange={handleInputChange} />
                
                <div className="border-t border-white/5 pt-16">
                    <VehicleDetails data={formData} onChange={handleInputChange} />
                </div>

                {/* Action Footer */}
                <div className="pt-16 border-t border-white/5 flex flex-col sm:flex-row gap-6 items-center justify-center">
                    <button 
                        type="button"
                        onClick={() => window.location.href = '/home'}
                        className="w-full sm:w-auto px-16 h-16 bg-white/[0.03] border border-white/10 text-gray-400 font-black uppercase text-[12px] tracking-[0.3em] hover:bg-white/5 hover:text-white transition-all transition-all"
                    >
                        SUBMIT ACCESS REQUEST
                    </button>
                    
                    <button 
                        type="submit"
                        disabled={status === 'submitting'}
                        className="w-full sm:w-auto px-20 h-16 bg-primary hover:bg-primary-hover text-white font-black uppercase text-[12px] tracking-[0.3em] shadow-2xl shadow-primary/20 transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
                    >
                        {status === 'submitting' ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <ShieldCheck size={18} className="group-hover:scale-110 transition-transform" />
                                ACCEPT
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Step1Main;
