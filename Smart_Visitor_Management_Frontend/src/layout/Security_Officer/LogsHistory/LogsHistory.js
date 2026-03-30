import React from 'react';
import Sidebar from '../../../components/Security_Officer/Layout/Sidebar';
import Header from '../../../components/Security_Officer/Layout/Header';
import LogsHistoryComponent from '../../../components/Security_Officer/LogsHistory/LogsHistory';

const LogsHistory = () => {
    return (
        <div className="flex min-h-screen bg-mas-black overflow-x-hidden text-white">
            <Sidebar />
            <main className="flex-1 ml-72 flex flex-col min-w-0 bg-[#0A0A0B]">
                <Header title="Movement Logs History" />
                <LogsHistoryComponent />
            </main>
        </div>
    );
};

export default LogsHistory;
