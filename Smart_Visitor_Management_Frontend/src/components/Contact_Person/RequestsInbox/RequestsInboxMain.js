import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RequestsTable from './RequestsTable';

const dummyRequests = [
  {
    id: 'REQ-001',
    batchId: 'BATCH-2026-001',
    name: 'ADITHYA BANDARA',
    contactPerson: 'SAMAN KUMARA',
    date: '2026-03-25',
    timeIn: '08:30 AM',
    areas: ['MAIN RECEPTION', 'ADMIN BLOCK'],
    status: 'Approved',
    members: [{}, {}], 
  },
  {
    id: 'REQ-002',
    batchId: 'BATCH-2026-002',
    name: 'KASUN PERERA',
    contactPerson: 'NIMALI SILVA',
    date: '2026-03-25',
    timeIn: '09:15 AM',
    areas: ['ADMIN BLOCK'],
    status: 'Pending',
    members: [],
  },
  {
    id: 'REQ-003',
    batchId: 'BATCH-2026-003',
    name: 'SARAH JENKINS',
    contactPerson: 'ROHIT SHARMA',
    date: '2026-03-24',
    timeIn: '10:00 AM',
    areas: ['IT DEPARTMENT', 'DATA CENTER'],
    status: 'Checked Out',
    members: [{}],
  }
];

const RequestsInboxMain = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredRequests = dummyRequests.filter(req => 
        req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.batchId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleReview = (requestId) => {
        navigate('/contact_person/request-review', {
            state: { requestId },
        });
    };

    return (
        <div className="p-12 space-y-8 animate-fade-in">
            <RequestsTable requests={filteredRequests} searchTerm={searchTerm} setSearchTerm={setSearchTerm} onReview={handleReview} />
        </div>
    );
};

export default RequestsInboxMain;
