import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Contact_Person/Layout/Sidebar';
import Header from '../../../components/Contact_Person/Layout/Header';
import { VisitorIdentification, VisitParameters, VehicleConfiguration, GroupMembers, EquipmentManifest, DocumentReview } from '../../../components/Contact_Person/Review/ReviewSections';
import ReviewActions from '../../../components/Contact_Person/Review/ReviewActions';
import RejectionModal from '../../../components/Contact_Person/Review/RejectionModal';
import { ArrowLeft } from 'lucide-react';

const RequestReview = () => {
    const navigate = useNavigate();
    const [openSections, setOpenSections] = useState({
        visitor: true,
        visit: true,
        vehicle: false,
        group: false,
        equipment: false,
        docs: false
    });
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [rejectionComment, setRejectionComment] = useState('');

    const toggleSection = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleApprove = () => {
        alert('Request Approved & Sent to Admin');
        navigate('/contact_person/requests-inbox');
    };

    const confirmReject = () => {
        alert(`Request Rejected: ${rejectionReason}`);
        setShowRejectModal(false);
        navigate('/contact_person/requests-inbox');
    };

    return (
        <div className="flex min-h-screen bg-mas-black overflow-x-hidden text-white">
            <Sidebar />
            
            <main className="flex-1 ml-72 flex flex-col min-w-0 bg-[#0A0A0B] relative">
                <Header title="Request Review" />

                <div className="p-12 space-y-12 animate-fade-in relative z-10">
                    {/* Top Header */}
                    <div className="flex items-center justify-between border-b border-mas-border pb-8">
                        <button 
                            onClick={() => navigate('/contact_person/requests-inbox')}
                            className="flex items-center gap-3 text-mas-text-dim uppercase hover:text-white transition-colors group"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Return to Inbox
                        </button>
                        <div className="flex items-center gap-8">
                            <div className="flex flex-col items-end">
                                <span className="text-mas-text-dim uppercase mb-1">Current Sync Status</span>
                                <div className="flex items-center gap-2">
                                     <div className="w-1.5 h-1.5 rounded-full bg-mas-red animate-pulse"></div>
                                     <span className="uppercase text-mas-red">Pending Node Approval</span>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-mas-border"></div>
                            <span className="text-white">#VR-2024-001</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                        <div className="lg:col-span-2 space-y-4">
                            <VisitorIdentification isOpen={openSections.visitor} onToggle={toggleSection} />
                            <VisitParameters isOpen={openSections.visit} onToggle={toggleSection} />
                            <VehicleConfiguration isOpen={openSections.vehicle} onToggle={toggleSection} />
                            <GroupMembers isOpen={openSections.group} onToggle={toggleSection} />
                            <EquipmentManifest isOpen={openSections.equipment} onToggle={toggleSection} />
                            <DocumentReview isOpen={openSections.docs} onToggle={toggleSection} />
                        </div>

                        <div>
                            <ReviewActions onApprove={handleApprove} onReject={() => setShowRejectModal(true)} />
                        </div>
                    </div>
                </div>

                <RejectionModal 
                    isOpen={showRejectModal} 
                    onClose={() => setShowRejectModal(false)}
                    onConfirm={confirmReject}
                    reason={rejectionReason}
                    setReason={setRejectionReason}
                    comment={rejectionComment}
                    setComment={setRejectionComment}
                />

                {/* Decorative background logo */}
                <img 
                    src="/logo_mas.png" 
                    alt="" 
                    className="fixed -bottom-20 -right-20 h-96 w-auto opacity-[0.02] pointer-events-none select-none z-0"
                />
            </main>
        </div>
    );
};

export default RequestReview;
