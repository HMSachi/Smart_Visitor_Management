import React from 'react';
import Sidebar from '../../../components/Security_Officer/Layout/Sidebar';
import Header from '../../../components/Security_Officer/Layout/Header';
import LogsHistoryComponent from '../../../components/Security_Officer/LogsHistory/LogsHistory';

const LogsHistory = () => {
    return (
        <div className="flex bg-secondary overflow-hidden text-white h-screen w-full">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 bg-[var(--color-bg-default)] overflow-hidden">
                <Header title="Movement Logs History" />
                <div className="flex-1 overflow-y-auto">
                    <LogsHistoryComponent />
                </div>
            </div>
        </div>
    );
};

export default LogsHistory;
