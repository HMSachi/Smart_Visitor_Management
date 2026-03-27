import React from 'react';
import Sidebar from '../../../components/Contact_Person/Layout/Sidebar';
import Header from '../../../components/Contact_Person/Layout/Header';
import ProfileSettingsMain from '../../../components/Contact_Person/ProfileSettings/ProfileSettingsMain';

const ProfileSettings = () => {
    return (
        <div className="flex min-h-screen bg-mas-black overflow-x-hidden text-white">
            <Sidebar />
            <main className="flex-1 ml-72 flex flex-col min-w-0 bg-[#0A0A0B]">
                <Header title="Profile Settings" />
                <ProfileSettingsMain />
            </main>
        </div>
    );
};

export default ProfileSettings;
