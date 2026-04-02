import React from 'react';
import Sidebar from '../../../components/Contact_Person/Layout/Sidebar';
import Header from '../../../components/Contact_Person/Layout/Header';
import RejectedRequestsComponent from '../../../components/Contact_Person/RejectedRequests/RejectedRequests';

const RejectedRequests = () => {
    return (
        <div className="flex bg-secondary overflow-hidden text-white h-screen w-full">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 bg-[var(--color-bg-default)] overflow-y-auto">
                <Header title="Rejected Requests" />
                <RejectedRequestsComponent />
            </div>
        </div>
    );
};

export default RejectedRequests;
