import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { VisitorIdentification, VisitParameters, VehicleConfiguration, GroupMembers, EquipmentManifest, DocumentReview } from './ReviewSections';
import ReviewActions from './ReviewActions';
import RejectionModal from './RejectionModal';
import ApprovalModal from './ApprovalModal';
import { ArrowLeft } from 'lucide-react';
import { ApproveVisitRequest, GetVisitRequestById, GetVisitRequestsByCP, UpdateVisitRequest } from '../../../actions/VisitRequestAction';

const normalizeStatus = (status) => {
    const s = (status || '').toString().trim().toUpperCase();
    if (s === 'A' || s === 'APPROVED') return 'APPROVED';
    if (s === 'R' || s === 'REJECTED') return 'REJECTED';
    if (s === 'C' || s === 'CHECKED OUT' || s === 'CHECKED_OUT') return 'CHECKED OUT';
    return 'PENDING';
};

const toReviewModel = (request) => {
    if (!request) return null;

    return {
        id: request.VVR_Request_id,
        status: normalizeStatus(request.VVR_Status),
        fullName: request.VV_Name || request.VVR_Visitor_Name || `Visitor ${request.VVR_Visitor_id || ''}`,
        nic: request.VV_NIC_Passport_NO || 'N/A',
        contact: request.VV_Phone || 'N/A',
        email: request.VV_Email || 'N/A',
        visitDate: request.VVR_Visit_Date,
        purpose: request.VVR_Purpose,
        purposeOther: '',
        isCompanyRelated: false,
        additionalVisitors: [],
        selectedAreas: request.VVR_Places_to_Visit ? [request.VVR_Places_to_Visit] : [],
        vehicleNumber: request.VV_Vehicle_Number || '',
        vehicleType: request.VV_Vehicle_Type || '',
        equipment: [],
        uploadedFile: '',
    };
};

const RequestReviewMain = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const selectedId = location.state?.requestId;

    const { visitRequestsByCP, visitRequests } = useSelector((state) => state.visitRequestsState);
    const [requestData, setRequestData] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [rejectionComment, setRejectionComment] = useState('');
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [approvalComment, setApprovalComment] = useState('');

    useEffect(() => {
        if (!selectedId) return;
        dispatch(GetVisitRequestById(selectedId));
    }, [dispatch, selectedId]);

    const apiRequest = useMemo(() => {
        if (!selectedId) return null;

        const fromCpList = (visitRequestsByCP || []).find(
            (item) => String(item?.VVR_Request_id) === String(selectedId),
        );
        if (fromCpList) return fromCpList;

        const fromById = Array.isArray(visitRequests)
            ? visitRequests.find((item) => String(item?.VVR_Request_id) === String(selectedId))
            : null;

        return fromById || null;
    }, [selectedId, visitRequestsByCP, visitRequests]);

    useEffect(() => {
        setRequestData(toReviewModel(apiRequest));
    }, [apiRequest]);

    const confirmApprove = async () => {
        if (!apiRequest?.VVR_Request_id) {
            alert('No request found for approval.');
            return;
        }

        await dispatch(UpdateVisitRequest({
            VVR_Request_id: apiRequest.VVR_Request_id,
            VVR_Visit_Date: apiRequest.VVR_Visit_Date,
            VVR_Places_to_Visit: apiRequest.VVR_Places_to_Visit,
            VVR_Purpose: apiRequest.VVR_Purpose,
            VVR_Contact_person_id: apiRequest.VVR_Contact_person_id,
            approvalComment,
        }));

        if (apiRequest?.VVR_Contact_person_id) {
            dispatch(GetVisitRequestsByCP(apiRequest.VVR_Contact_person_id));
        }

        alert('Request updated successfully.');
        setShowApproveModal(false);
        navigate('/contact_person/requests-inbox');
    };

    const confirmReject = async () => {
        if (!rejectionComment.trim()) {
            alert('Detailed observations are required for rejection.');
            return;
        }

        if (!apiRequest?.VVR_Request_id) {
            alert('No request found for rejection.');
            return;
        }

        await dispatch(ApproveVisitRequest(apiRequest.VVR_Request_id, 'R'));
        if (apiRequest?.VVR_Contact_person_id) {
            dispatch(GetVisitRequestsByCP(apiRequest.VVR_Contact_person_id));
        }

        alert(`Request Rejected: ${rejectionReason}`);
        setShowRejectModal(false);
        navigate('/contact_person/requests-inbox');
    };

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-[var(--color-bg-default)]/50 relative overflow-x-hidden">
            <div className="p-4 md:p-10 space-y-4 md:space-y-8 animate-fade-in relative z-10 max-w-7xl mx-auto w-full">
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
                            <span className="text-white font-mono text-sm tracking-widest font-medium">#{requestData?.id || selectedId || 'ALPHA-000'}</span>
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
