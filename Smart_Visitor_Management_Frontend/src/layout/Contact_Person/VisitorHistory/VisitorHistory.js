import React from 'react';
import Sidebar from '../../../components/Contact_Person/Layout/Sidebar';
import Header from '../../../components/Contact_Person/Layout/Header';
import VisitorHistory from '../../../components/Contact_Person/VisitorHistory/VisitorHistory';

const VisitorHistory = () => {
    return (
        <div className="flex min-h-screen bg-mas-black overflow-x-hidden text-white">
            <Sidebar />
            <main className="flex-1 ml-72 flex flex-col min-w-0 bg-[#0A0A0B]">
                <Header title="Archived Records" />
                <VisitorHistory />
            </main>
        </div>
    );
};

export default VisitorHistory;
