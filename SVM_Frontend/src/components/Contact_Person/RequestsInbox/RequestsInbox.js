import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import RequestsTable from './RequestsTable';
import { setSearchTerm, setStatusFilter, setSelectedRequest } from '../../../reducers/contactPersonSlice';

const RequestsInboxMain = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Get state from Redux
    const { requests, searchTerm, statusFilter } = useSelector(state => state.contactPortal);

    // Derived filtered requests
    const filteredRequests = requests.filter(req => {
        const matchesSearch = req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             req.batchId.toLowerCase().includes(searchTerm.toLowerCase());
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
        <div className="p-4 sm:p-8 animate-fade-in">
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
