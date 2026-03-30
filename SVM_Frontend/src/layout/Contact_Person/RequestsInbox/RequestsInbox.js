import React from 'react';
import Sidebar from '../../../components/Contact_Person/Layout/Sidebar';
import Header from '../../../components/Contact_Person/Layout/Header';
import RequestsInboxComponent from '../../../components/Contact_Person/RequestsInbox/RequestsInbox';

const RequestsInbox = () => {
    return (
        <div className="flex bg-mas-black overflow-hidden text-white h-screen w-full">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 bg-[#0A0A0B] overflow-y-auto">
                <Header title="Requests Inbox" />
                <RequestsInboxComponent />
            </div>
        </div>
    );
};

export default RequestsInbox;
