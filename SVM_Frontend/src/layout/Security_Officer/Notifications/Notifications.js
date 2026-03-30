import React from 'react';
import Sidebar from '../../../components/Security_Officer/Layout/Sidebar';
import Header from '../../../components/Security_Officer/Layout/Header';
import Notifications from '../../../components/Security_Officer/Notifications/Notifications';

const SecurityNotifications = () => {
    return (
        <div className="flex bg-mas-black overflow-hidden text-white h-screen w-full">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 bg-[#0A0A0B] overflow-hidden">
                <Header title="Security Alert Terminal" />
                <div className="flex-1 overflow-y-auto">
                    <Notifications />
                </div>
            </div>
        </div>
    );
};

export default SecurityNotifications;
