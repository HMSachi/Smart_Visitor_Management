import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { VisitorIdentification, VisitParameters, VehicleConfiguration, GroupMembers, EquipmentManifest, DocumentReview } from './ReviewSections';
import ReviewActions from './ReviewActions';
import RejectionModal from './RejectionModal';
import ApprovalModal from './ApprovalModal';
import { ArrowLeft } from 'lucide-react';
import { getAllVisitorRequests, getVisitorRequestById, updateVisitorRequestStatus } from '../../../services/visitorRequestService';

const RequestReviewMain = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [requestData, setRequestData] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [rejectionComment, setRejectionComment] = useState('');
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [approvalComment, setApprovalComment] = useState('');

    useEffect(() => {
        const selectedId = location.state?.requestId;
        const selectedRequest = selectedId
            ? getVisitorRequestById(selectedId)
            : getAllVisitorRequests()[0] || null;
        setRequestData(selectedRequest);
    }, [location.state]);

    const confirmApprove = () => {
        if (requestData?.id) {
            updateVisitorRequestStatus(requestData.id, 'Approved', {
                comment: approvalComment,
            });
        }
        alert('Request Approved & Sent to Admin');
        setShowApproveModal(false);
        navigate('/contact_person/requests-inbox');
    };

    const confirmReject = () => {
        if (!rejectionComment.trim()) {
            alert('Detailed observations are required for rejection.');
            return;
        }

        if (requestData?.id) {
            updateVisitorRequestStatus(requestData.id, 'Rejected', {
                reason: rejectionReason,
                comment: rejectionComment,
            });
        }
        alert(`Request Rejected: ${rejectionReason}`);
        setShowRejectModal(false);
        navigate('/contact_person/requests-inbox');
    };

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-[var(--color-bg-default)]/50 relative overflow-x-hidden">
            <div className="p-10 space-y-8 animate-fade-in relative z-10 max-w-7xl mx-auto w-full">
                {/* Top Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-4">
                    <div>
                        <button
                            onClick={() => navigate('/contact_person/requests-inbox')}
                            className="flex items-center gap-3 text-gray-300 text-[13px] font-medium uppercase tracking-[0.2em] hover:text-white transition-colors group mb-4"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            Return to Command Center
                        </button>
                        <div className="flex items-center gap-4">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_var(--color-primary)] animate-pulse"></div>
                            <span className="text-primary text-[14px] font-medium uppercase tracking-[0.3em]">Personnel Authorization Protocol</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 bg-white/[0.02] border border-white/5 p-4 px-6 rounded-2xl backdrop-blur-md shadow-2xl">
                        <div className="text-right">
                            <p className="text-gray-300 text-[12px] uppercase font-medium tracking-widest mb-1 opacity-80">Entry Reference</p>
                            <span className="text-white font-mono text-sm tracking-widest font-medium">#{requestData?.id || 'ALPHA-000'}</span>
                        </div>
                        <div className="h-10 w-[1px] bg-white/10"></div>
                        <div className="text-right">
                            <p className="text-gray-300 text-[12px] uppercase font-medium tracking-widest mb-1 opacity-80">Sync Status</p>
                            <span className="text-primary text-[13px] font-medium uppercase tracking-widest">{requestData?.status || 'PENDING_NODE'}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <VisitorIdentification request={requestData} />
                    <VisitParameters request={requestData} />
                    <VehicleConfiguration request={requestData} />
                    <GroupMembers request={requestData} />
                    <EquipmentManifest request={requestData} />
                    <DocumentReview request={requestData} />
                </div>

                <div className="pt-6">
                    <ReviewActions onApprove={() => setShowApproveModal(true)} onReject={() => setShowRejectModal(true)} />
                </div>
            </div>

            <ApprovalModal
                isOpen={showApproveModal}
                onClose={() => setShowApproveModal(false)}
                onConfirm={confirmApprove}
                comment={approvalComment}
                setComment={setApprovalComment}
            />

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
        </div>
    );
};

export default RequestReviewMain;
