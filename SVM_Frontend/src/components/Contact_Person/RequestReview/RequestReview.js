import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import PersonnelAuthProtocol from '../../../components/common/PersonnelAuthProtocol';
import RejectionModal from './RejectionModal';
import ApprovalModal from './ApprovalModal';
import { ArrowLeft } from 'lucide-react';
import { ApproveVisitRequest, GetVisitRequestById, GetVisitRequestsByCP, UpdateVisitRequest } from '../../../actions/VisitRequestAction';
import VisitorService from '../../../services/VisitorService';
import VehicleService from '../../../services/VehicleService';
import { useThemeMode } from '../../../theme/ThemeModeContext';
import VisitorGroup from '../../Visitor/Request/Step1/VisitorGroup';
import ItemsCarried from '../../Visitor/Request/Step1/ItemsCarried';
import VisitGroupService from '../../../services/VisitGroupService';
import ItemCarriedService from '../../../services/ItemCarriedService';

const normalizeStatus = (status) => {
    const s = (status || '').toString().trim().toUpperCase();
    if (s === 'A' || s === 'APPROVED') return 'Admin Approved';
    if (s === 'R' || s === 'REJECTED') return 'Rejected';
    if (s === 'C' || s === 'CHECKED OUT' || s === 'CHECKED_OUT') return 'Checked Out';
    if (s === 'ACCEPTED') return 'Accepted by Visitor';
    if (s === 'SENT' || s === 'SENT_TO_ADMIN') return 'Accepted by Contact Person';
    return 'Sent to Visitor';
};

const toReviewModel = (request, visitorRecord, vehicleRecord) => {
    if (!request) return null;

    const visitor = visitorRecord || request;
    const vehicle = vehicleRecord || request;

    return {
        id: request.VVR_Request_id,
        status: normalizeStatus(request.VVR_Status),
        fullName: visitor?.VV_Name || request.VVR_Visitor_Name || `Visitor ${request.VVR_Visitor_id || ''}`,
        nic: visitor?.VV_NIC_Passport_NO || 'N/A',
        phoneNumber: visitor?.VV_Phone || 'N/A',
        emailAddress: visitor?.VV_Email || 'N/A',
        representingCompany: visitor?.VV_Company || 'N/A',
        visitorClassification: visitor?.VV_Visitor_Type || 'N/A',
        proposedVisitDate: request.VVR_Visit_Date ? request.VVR_Visit_Date.split("T")[0] : '',
        purposeOfVisitation: request.VVR_Purpose || 'N/A',
        selectedAreas: request.VVR_Places_to_Visit ? request.VVR_Places_to_Visit.split("|") : [],
        plateNumber: vehicle?.VV_Vehicle_Number || '',
        vehicleType: vehicle?.VV_Vehicle_Type || '',
        additionalVisitors: [], // Currently not linked in CP view state
        equipment: [], // Currently not linked in CP view state
    };
};

const RequestReviewMain = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const selectedId = location.state?.requestId;
    const selectedRequestData = location.state?.requestData;

    const { visitRequestsByCP, visitRequests } = useSelector((state) => state.visitRequestsState);
    const { themeMode } = useThemeMode();
    const isLight = themeMode === "light";
    const [requestData, setRequestData] = useState(null);
    const [visitorRecord, setVisitorRecord] = useState(null);
    const [vehicleRecord, setVehicleRecord] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [rejectionComment, setRejectionComment] = useState('');
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [approvalComment, setApprovalComment] = useState('');

    const [visitorGroupMembers, setVisitorGroupMembers] = useState([]);
    const [itemsCarried, setItemsCarried] = useState([]);

    const handleAddVisitor = () => {
        // In review mode, we don't necessarily allow adding unless it's an edit view
        const newId = visitorGroupMembers.length > 0 ? Math.max(...visitorGroupMembers.map(v => v.id || 0)) + 1 : 1;
        setVisitorGroupMembers([...visitorGroupMembers, { id: newId, fullName: '', nic: '', contact: '' }]);
    };
    const handleRemoveVisitor = (id) => {
        setVisitorGroupMembers(visitorGroupMembers.filter(v => v.id !== id));
    };
    const handleUpdateVisitor = (id, field, value) => {
        setVisitorGroupMembers(visitorGroupMembers.map(v => v.id === id ? { ...v, [field]: value } : v));
    };

    const handleAddItem = () => {
        const newId = itemsCarried.length > 0 ? Math.max(...itemsCarried.map(i => i.id || 0)) + 1 : 1;
        setItemsCarried([...itemsCarried, { id: newId, itemName: '', quantity: '' }]);
    };
    const handleRemoveItem = (id) => {
        setItemsCarried(itemsCarried.filter(i => i.id !== id));
    };
    const handleUpdateItem = (id, field, value) => {
        setItemsCarried(itemsCarried.map(i => i.id === id ? { ...i, [field]: value } : i));
    };

    useEffect(() => {
        if (!selectedId) return;
        dispatch(GetVisitRequestById(selectedId));
    }, [dispatch, selectedId]);

    const apiRequest = useMemo(() => {
        if (selectedRequestData) return selectedRequestData;
        if (!selectedId) return null;

        const fromCpList = (visitRequestsByCP || []).find(
            (item) => String(item?.VVR_Request_id) === String(selectedId),
        );
        if (fromCpList) return fromCpList;

        const fromById = Array.isArray(visitRequests)
            ? visitRequests.find((item) => String(item?.VVR_Request_id) === String(selectedId))
            : null;

        return fromById || null;
    }, [selectedId, selectedRequestData, visitRequestsByCP, visitRequests]);

    useEffect(() => {
        let cancelled = false;

        const loadRelatedRecords = async () => {
            if (!apiRequest) {
                setVisitorRecord(null);
                setVehicleRecord(null);
                return;
            }

            try {
                if (apiRequest?.VVR_Visitor_id) {
                    const visitorResponse = await VisitorService.GetVisitorById(apiRequest.VVR_Visitor_id);
                    const visitorPayload = visitorResponse?.data?.ResultSet || visitorResponse?.data || null;
                    const visitor = Array.isArray(visitorPayload) ? visitorPayload[0] : visitorPayload;
                    if (!cancelled) {
                        setVisitorRecord(visitor || null);
                    }
                } else if (!cancelled) {
                    setVisitorRecord(null);
                }

                const vehicleResponse = await VehicleService.GetAllVehicles();
                const allVehicles = vehicleResponse?.data?.ResultSet || vehicleResponse?.data || [];
                const matchedVehicle = (Array.isArray(allVehicles) ? allVehicles : []).find(
                    (item) => String(item?.VVR_Request_id) === String(apiRequest?.VVR_Request_id),
                );

                if (!cancelled) {
                    setVehicleRecord(matchedVehicle || null);
                }

                // Load Visitor Group Members
                const groupResponse = await VisitGroupService.GetAllVisitGroup();
                const allGroupMembers = groupResponse?.data?.ResultSet || groupResponse?.data || [];
                const matchedMembers = (Array.isArray(allGroupMembers) ? allGroupMembers : [])
                    .filter(item => String(item?.VVR_Request_id) === String(apiRequest?.VVR_Request_id))
                    .map(m => ({
                        id: m.VVG_id,
                        fullName: m.VVG_Visitor_Name,
                        nic: m.VVG_NIC_Passport_Number,
                        contact: m.VVG_Designation // Using designation as contact field mapping
                    }));
                
                if (!cancelled) {
                    setVisitorGroupMembers(matchedMembers);
                }

                // Load Items Carried
                const itemsResponse = await ItemCarriedService.GetAllItemsCarried();
                const allItems = itemsResponse?.data?.ResultSet || itemsResponse?.data || [];
                const matchedItems = (Array.isArray(allItems) ? allItems : [])
                    .filter(item => String(item?.VVR_Request_id) === String(apiRequest?.VVR_Request_id))
                    .map(i => ({
                        id: i.VIC_Item_id,
                        itemName: i.VIC_Item_Name,
                        quantity: i.VIC_Quantity
                    }));
                
                if (!cancelled) {
                    setItemsCarried(matchedItems);
                }
            } catch (error) {
                if (!cancelled) {
                    setVisitorRecord(null);
                    setVehicleRecord(null);
                }
                console.error('Error loading related request review data:', error);
            }
        };

        loadRelatedRecords();

        return () => {
            cancelled = true;
        };
    }, [apiRequest]);

    useEffect(() => {
        setRequestData(toReviewModel(apiRequest, visitorRecord, vehicleRecord));
    }, [apiRequest, visitorRecord, vehicleRecord]);

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
            VVR_Status: 'SENT',
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
        <div className={`flex-1 p-4 md:p-6 space-y-4 animate-fade-in-slow overflow-y-auto relative transition-colors duration-500 ${isLight ? "bg-[#F8F9FA]" : "bg-[var(--color-bg-default)]"}`}>
            <div className="max-w-[1700px] mx-auto relative z-10 w-full">

                <div className="space-y-6">
                    <PersonnelAuthProtocol 
                        visitor={requestData} 
                        onBack={() => navigate('/contact_person/requests-inbox')}
                        onAction={(visitor, type) => {
                            if (type === 'Approve') setShowApproveModal(true);
                            if (type === 'Reject') setShowRejectModal(true);
                        }}
                    />

                    <div className={`mt-8 p-6 border rounded-3xl ${isLight ? "bg-white border-gray-200 shadow-sm" : "bg-black/40 border-white/10"}`}>
                        <VisitorGroup 
                            visitors={visitorGroupMembers}
                            onAdd={handleAddVisitor}
                            onRemove={handleRemoveVisitor}
                            onChange={handleUpdateVisitor}
                            isLight={isLight}
                        />
                    </div>

                    <div className={`mt-8 p-6 border rounded-3xl ${isLight ? "bg-white border-gray-200 shadow-sm" : "bg-black/40 border-white/10"}`}>
                        <ItemsCarried 
                            items={itemsCarried}
                            onAdd={handleAddItem}
                            onRemove={handleRemoveItem}
                            onChange={handleUpdateItem}
                            isLight={isLight}
                        />
                    </div>
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
        </div>
    );
};

export default RequestReviewMain;
