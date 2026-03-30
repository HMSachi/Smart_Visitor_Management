import React from 'react';
import ApprovalChecklist from './ApprovalChecklist';
import { ShieldCheck } from 'lucide-react';

const EntryApprovalMain = () => {
    return (
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
    );
};

export default EntryApprovalMain;
