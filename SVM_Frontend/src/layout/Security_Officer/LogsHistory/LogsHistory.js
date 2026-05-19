import React from 'react';
import Header from '../../../components/Security_Officer/Layout/Header';
import LogsHistoryComponent from '../../../components/Security_Officer/LogsHistory/LogsHistory';

const LogsHistory = () => {
    return (
        <div className="flex flex-col min-w-0 h-full">
            <Header title="Movement Logs History" />
            <div className="flex-1 overflow-y-auto">
                <LogsHistoryComponent />
            </div>
        </div>
    );
};

export default LogsHistory;
