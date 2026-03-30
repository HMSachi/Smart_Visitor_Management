import React from 'react';
import Sidebar from '../../../components/Security_Officer/Layout/Sidebar';
import Header from '../../../components/Security_Officer/Layout/Header';
import ActiveVisitorsComponent from '../../../components/Security_Officer/ActiveVisitors/ActiveVisitors';

const ActiveVisitors = () => {
    return (
        <div className="flex bg-mas-black overflow-hidden text-white h-screen w-full">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 bg-[#0A0A0B] overflow-y-auto">
                <Header title="Live Personnel Tracking" />
                <ActiveVisitorsComponent />
            </div>
        </div>
    );
};

export default ActiveVisitors;
