import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import RequestsTable from './RequestsTable';
import { setSearchTerm, setStatusFilter, setSelectedRequest } from '../../../reducers/contactPersonSlice';
import { GetVisitRequestsByCP } from '../../../actions/VisitRequestAction';
import ContactPersonService from '../../../services/ContactPersonService';

const mapStatus = (status) => {
    const normalized = (status || '').toString().trim().toUpperCase();
    if (normalized === 'A' || normalized === 'APPROVED') return 'Approved';
    if (normalized === 'R' || normalized === 'REJECTED') return 'Rejected';
    if (normalized === 'C' || normalized === 'CHECKED OUT' || normalized === 'CHECKED_OUT') return 'Checked Out';
    return 'Pending';
};

const formatDateOnly = (value) => {
    if (!value) return 'N/A';
    const raw = String(value);
    if (raw.includes('T')) return raw.split('T')[0];
    return raw;
};

const RequestsInboxMain = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [cpId, setCpId] = useState(null);
    
    const { requests, searchTerm, statusFilter } = useSelector(state => state.contactPortal);
    const { visitRequestsByCP, isLoading, error } = useSelector((state) => state.visitRequestsState);
    const user = useSelector((state) => state.login.user);
    const userEmail = user?.ResultSet?.[0]?.VA_Email;

    useEffect(() => {
        const loadContactPersonId = async () => {
            try {
                const response = await ContactPersonService.GetAllContactPersons();
                const contactPersons = response?.data?.ResultSet || [];
                const match = contactPersons.find(
                    (cp) =>
                        cp?.VCP_Email?.trim().toLowerCase() ===
                        userEmail?.trim().toLowerCase(),
                );

                if (match?.VCP_Contact_person_id) {
                    setCpId(match.VCP_Contact_person_id);
                    return;
                }

                setCpId(user?.ResultSet?.[0]?.VCP_Contact_person_id || null);
            } catch (err) {
                console.error('Error loading contact person:', err);
                setCpId(user?.ResultSet?.[0]?.VCP_Contact_person_id || null);
            }
        };

        if (userEmail) {
            loadContactPersonId();
        } else {
            setCpId(user?.ResultSet?.[0]?.VCP_Contact_person_id || null);
        }
    }, [userEmail, user]);

    useEffect(() => {
        if (!cpId) return;
        dispatch(GetVisitRequestsByCP(cpId));
    }, [dispatch, cpId]);

    const mappedRequests = useMemo(() => {
        return (visitRequestsByCP || []).map((req) => {
            const requestId = req?.VVR_Request_id;
            const visitorName = req?.VV_Name || req?.VVR_Visitor_Name || `VISITOR ${req?.VVR_Visitor_id || 'UNKNOWN'}`;
            const cpName = req?.VCP_Name || user?.ResultSet?.[0]?.VA_Name || 'CONTACT PERSON';

            return {
                id: String(requestId || ''),
                batchId: req?.VVR_Batch_id || `BATCH-${requestId || 'N/A'}`,
                name: visitorName,
                contactPerson: cpName,
                date: formatDateOnly(req?.VVR_Visit_Date),
                timeIn: req?.VVR_Visit_Time || 'N/A',
                areas: [req?.VVR_Places_to_Visit || 'N/A'],
                status: mapStatus(req?.VVR_Status),
                members: [],
                rawRequest: req,
            };
        });
    }, [visitRequestsByCP, user]);

    const sourceRequests = mappedRequests.length > 0 ? mappedRequests : requests;

    const filteredRequests = sourceRequests.filter(req => {
        const matchesSearch = req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             req.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             req.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleSearchChange = (term) => {
        dispatch(setSearchTerm(term));
    };

    const handleFilterChange = (status) => {
        dispatch(setStatusFilter(status));
    };

    const handleReview = (requestItem) => {
        const requestId = requestItem?.id;
        dispatch(setSelectedRequest(requestId));
        navigate('/contact_person/request-review', {
            state: {
                requestId,
                requestData: requestItem?.rawRequest || null,
            },
        });
    };

    return (
        <div className="p-4 sm:p-8 animate-fade-in space-y-4">
            {isLoading && <p className="text-xs tracking-[0.2em] text-gray-300 uppercase">Loading requests...</p>}
            {!!error && <p className="text-xs tracking-[0.2em] text-primary uppercase">{error}</p>}
            <RequestsTable 
                requests={filteredRequests} 
                searchTerm={searchTerm} 
                setSearchTerm={handleSearchChange} 
                statusFilter={statusFilter}
                setStatusFilter={handleFilterChange}
                onReview={handleReview} 
            />
        </div>
    );
};

export default RequestsInboxMain;
