import React from 'react';
import Sidebar from '../../../components/Contact_Person/Layout/Sidebar';
import Header from '../../../components/Contact_Person/Layout/Header';
import VisitorHistoryComponent from '../../../components/Contact_Person/VisitorHistory/VisitorHistory';

const VisitorHistory = () => {
    return (
        <div className="flex bg-secondary overflow-hidden text-white h-screen w-full">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 bg-[var(--color-bg-default)] overflow-y-auto">
                <Header title="Archived Records" />
                <VisitorHistoryComponent />
            </div>
        </div>
    );
};

export default VisitorHistory;
