import React from 'react';
import Sidebar from '../../../components/Security_Officer/Layout/Sidebar';
import Header from '../../../components/Security_Officer/Layout/Header';
import LogsHistoryComponent from '../../../components/Security_Officer/LogsHistory/LogsHistory';

const LogsHistory = () => {
    return (
        <div className="flex bg-mas-black overflow-hidden text-white h-screen w-full">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 bg-[#0A0A0B] overflow-y-auto">
                <Header title="Movement Logs History" />
                <LogsHistoryComponent />
            </div>
        </div>
    );
};

export default LogsHistory;
