import React from 'react';
import Header from '../../../components/Security_Officer/Layout/Header';
import Notifications from '../../../components/Security_Officer/Notifications/Notifications';

const SecurityNotifications = () => {
    return (
        <div className="flex flex-col min-w-0 h-full">
            <Header title="Security Alert Terminal" />
            <div className="flex-1 overflow-y-auto">
                <Notifications />
            </div>
        </div>
    );
};

export default SecurityNotifications;
