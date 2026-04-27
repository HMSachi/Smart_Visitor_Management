import React from 'react';
import ProfileForm from './ProfileForm';
import { UserCircle, ShieldCheck } from 'lucide-react';

const ProfileSettingsMain = () => {
    return (
        <div className="p-6 md:p-12 space-y-6 md:space-y-12 animate-fade-in">
            <div className="flex items-end justify-between border-b border-mas-border pb-8">
                <div>
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-4 mb-4">
                        <UserCircle size={14} className="text-primary" />
                        <span className="text-primary uppercase">Node Configuration</span>
                        <div className="h-[1px] w-12 bg-primary"></div>
                    </div>
                    <h1 className="uppercase text-white flex flex-col md:flex-row items-center gap-4 md:gap-6">
                        Profile Settings
                        <div className="p-3 mas-glass border-white/10 bg-white/5 inline-flex">
                            <ShieldCheck size={24} className="text-gray-300" />
                        </div>
                    </h1>
                </div>
            </div>

            <div className="mas-glass border-mas-border p-6 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px]"></div>
                <ProfileForm />
            </div>
        </div>
    );
};

export default ProfileSettingsMain;
