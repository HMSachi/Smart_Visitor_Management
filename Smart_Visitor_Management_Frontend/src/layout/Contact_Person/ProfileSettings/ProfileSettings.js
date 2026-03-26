import React from 'react';
import Sidebar from '../../../components/Contact_Person/Layout/Sidebar';
import Header from '../../../components/Contact_Person/Layout/Header';
import ProfileForm from '../../../components/Contact_Person/Profile/ProfileForm';
import { UserCircle, ShieldCheck } from 'lucide-react';

const ProfileSettings = () => {
    return (
        <div className="flex min-h-screen bg-mas-black overflow-x-hidden text-white">
            <Sidebar />
            
            <main className="flex-1 ml-72 flex flex-col min-w-0 bg-[#0A0A0B]">
                <Header title="Profile Settings" />

                <div className="p-12 space-y-12 animate-fade-in">
                    <div className="flex items-end justify-between border-b border-mas-border pb-8">
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <UserCircle size={14} className="text-mas-red" />
                                <span className="text-mas-red uppercase">Node Configuration</span>
                                <div className="h-[1px] w-12 bg-mas-red"></div>
                            </div>
                            <h1 className="uppercase text-white flex items-center gap-6">
                                Profile Settings
                                <div className="p-3 mas-glass border-white/10 bg-white/5 inline-flex">
                                    <ShieldCheck size={24} className="text-mas-text-dim" />
                                </div>
                            </h1>
                        </div>
                    </div>

                    <div className="mas-glass border-mas-border p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-mas-red/5 blur-[120px]"></div>
                        <ProfileForm />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfileSettings;
