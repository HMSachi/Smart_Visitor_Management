import React from 'react';
import Sidebar from '../../../components/Contact_Person/Layout/Sidebar';
import Header from '../../../components/Contact_Person/Layout/Header';
import ApprovedRequestsMain from '../../../components/Contact_Person/ApprovedRequests/ApprovedRequests';

const ApprovedRequests = () => {
    return (
        <div className="flex min-h-screen bg-mas-black overflow-x-hidden text-white">
            <Sidebar />
            <main className="flex-1 ml-72 flex flex-col min-w-0 bg-[#0A0A0B]">
                <Header title="Approved Requests" />
                <ApprovedRequestsMain />
            </main>
        </div>
    );
};

export default ApprovedRequests;
