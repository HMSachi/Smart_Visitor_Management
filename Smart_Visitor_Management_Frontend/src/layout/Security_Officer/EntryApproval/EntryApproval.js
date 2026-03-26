import React from 'react';
import Sidebar from '../../../components/Security_Officer/Layout/Sidebar';
import Header from '../../../components/Security_Officer/Layout/Header';
import ApprovalChecklist from '../../../components/Security_Officer/EntryApproval/ApprovalChecklist';
import { ShieldCheck } from 'lucide-react';

const EntryApproval = () => {
    return (
        <div className="flex min-h-screen bg-mas-black overflow-x-hidden text-white">
            <Sidebar />
            
            <main className="flex-1 ml-72 flex flex-col min-w-0 bg-[#0A0A0B]">
                <Header title="Tactical Entry Control" />

                <div className="p-12 space-y-12 animate-fade-in">
                    <div className="flex items-end justify-between border-b border-mas-border pb-8">
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <ShieldCheck size={14} className="text-mas-red" />
                                <span className="text-mas-red uppercase">Final Clearance Node</span>
                            </div>
                            <h1 className="uppercase">Entry Authorization</h1>
                        </div>
                    </div>

                    <ApprovalChecklist />
                </div>
            </main>
        </div>
    );
};

export default EntryApproval;
