import React from 'react';
import Sidebar from '../../../components/Contact_Person/Layout/Sidebar';
import Header from '../../../components/Contact_Person/Layout/Header';
import SentToAdminComponent from '../../../components/Contact_Person/SentToAdmin/SentToAdmin';

const SentToAdmin = () => {
    return (
        <div className="flex bg-mas-black overflow-hidden text-white h-screen w-full">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 bg-[#0A0A0B] overflow-y-auto">
                <Header title="Forwarded to Admin" />
                <SentToAdminComponent />
            </div>
        </div>
    );
};

export default SentToAdmin;
