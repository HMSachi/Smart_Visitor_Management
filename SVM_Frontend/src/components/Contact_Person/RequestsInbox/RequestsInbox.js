import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Eye, Search } from 'lucide-react';
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

    const { searchTerm, statusFilter } = useSelector(state => state.contactPortal);
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
            };
        });
    }, [visitRequestsByCP, user]);

    const sourceRequests = mappedRequests;

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

    const handleReview = (requestId) => {
        dispatch(setSelectedRequest(requestId));
        navigate('/contact_person/request-review', {
            state: { requestId },
        });
    };

    return (
        <div className="p-4 md:p-8 animate-fade-in-slow relative max-w-[1600px] mx-auto w-full">
            {isLoading && <p className="text-xs tracking-[0.2em] text-gray-300 uppercase">Loading requests...</p>}
            {!!error && <p className="text-xs tracking-[0.2em] text-primary uppercase">{error}</p>}

            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/[0.03] pb-6 gap-6 relative z-10">
                <div>
                    <h1 className="text-white uppercase px-1 text-2xl font-bold tracking-tight">
                        REQUESTS INBOX
                    </h1>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
                    <div className="flex items-center bg-black/40 border border-white/10 hover:border-white/20 transition-colors rounded-xl px-4 py-3 min-w-[300px]">
                        <Search size={16} className="text-gray-400 mr-3" />
                        <input
                            type="text"
                            placeholder="Search Visitor..."
                            className="bg-transparent text-[13px] text-white focus:outline-none w-full"
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    </div>

                    <div className="relative min-w-[180px] w-full sm:w-auto">
                        <select
                            value={statusFilter}
                            onChange={(e) => handleFilterChange(e.target.value)}
                            className="w-full pl-4 pr-10 py-3 bg-black/40 border border-white/10 hover:border-white/20 rounded-xl text-[13px] font-medium text-white uppercase tracking-widest transition-all cursor-pointer outline-none appearance-none"
                        >
                            <option value="All">ALL STATUS</option>
                            <option value="Pending">PENDING</option>
                            <option value="Approved">APPROVED</option>
                            <option value="Rejected">REJECTED</option>
                            <option value="Checked Out">CHECKED OUT</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300 border-l border-white/10 pl-3">
                            <Eye size={12} />
                        </div>
                    </div>
                </div>
            </header>

            <RequestsTable
                requests={filteredRequests}
                onReview={handleReview}
            />
        </div>
    );
};

export default RequestsInboxMain;
