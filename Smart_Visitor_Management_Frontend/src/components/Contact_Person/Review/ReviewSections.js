import React from 'react';
import { ChevronDown, ChevronUp, User, MapPin, Car, Users, Briefcase, FileText } from 'lucide-react';

const SectionHeader = ({ id, label, icon: Icon, isOpen, onToggle }) => (
    <div 
        onClick={() => onToggle(id)}
        className={`flex items-center justify-between p-8 cursor-pointer border-l-4 transition-all duration-300 ${isOpen ? 'bg-white/[0.04] border-mas-red border-b border-mas-border' : 'bg-transparent border-transparent hover:bg-white/[0.02]'}`}
    >
        <div className="flex items-center gap-6">
            <div className={`p-4 ${isOpen ? 'bg-mas-red text-white' : 'bg-white/5 text-mas-text-dim'}`}>
                <Icon size={20} />
            </div>
            <div>
                <h3 className="uppercase text-white underline underline-offset-8 decoration-mas-red/20">{label}</h3>
                <p className="text-mas-text-dim uppercase mt-1">Verification Section {id.toUpperCase()}</p>
            </div>
        </div>
        {isOpen ? <ChevronUp size={18} className="text-mas-red" /> : <ChevronDown size={18} className="text-mas-text-dim" />}
    </div>
);

export const VisitorIdentification = ({ isOpen, onToggle }) => (
    <div className="mas-glass border-mas-border overflow-hidden">
        <SectionHeader id="visitor" label="Visitor Primary Identity" icon={User} isOpen={isOpen} onToggle={onToggle} />
        {isOpen && (
            <div className="p-12 grid grid-cols-2 gap-12 bg-white/[0.01]">
                <div className="space-y-2">
                    <label className="text-mas-text-dim uppercase">Full Name</label>
                    <p className="uppercase text-white">John Alexander Doe</p>
                </div>
                <div className="space-y-2">
                    <label className="text-mas-text-dim uppercase">Identification (ID/Passport)</label>
                    <p className="uppercase text-white">N-9428103X</p>
                </div>
                <div className="space-y-2">
                    <label className="text-mas-text-dim uppercase">Email Address</label>
                    <p className="uppercase text-white">john.doe@external.com</p>
                </div>
                <div className="space-y-2">
                    <label className="text-mas-text-dim uppercase">Mobile Contact</label>
                    <p className="uppercase text-white">+94 77 123 4567</p>
                </div>
            </div>
        )}
    </div>
);

export const VisitParameters = ({ isOpen, onToggle }) => (
    <div className="mas-glass border-mas-border overflow-hidden">
        <SectionHeader id="visit" label="Visit Parameters & Areas" icon={MapPin} isOpen={isOpen} onToggle={onToggle} />
        {isOpen && (
            <div className="p-12 grid grid-cols-2 gap-12 bg-white/[0.01]">
                <div className="space-y-2">
                    <label className="text-mas-text-dim uppercase">Visit Category / Purpose</label>
                    <p className="uppercase text-white">Operational Audit</p>
                </div>
                <div className="space-y-2">
                    <label className="text-mas-text-dim uppercase">Visit Date & Duration</label>
                    <p className="uppercase text-white">October 28, 2024 (4 Hours)</p>
                </div>
                <div className="space-y-2 lg:col-span-2">
                    <label className="text-mas-text-dim uppercase block mb-2">Requested Access Zones</label>
                    <div className="flex gap-4">
                         <span className="px-3 py-1 bg-white/5 border border-white/10 text-white uppercase text-xs">Production Area 08</span>
                         <span className="px-3 py-1 bg-white/5 border border-white/10 text-white uppercase text-xs">Main Lobby</span>
                    </div>
                </div>
            </div>
        )}
    </div>
);

export const VehicleConfiguration = ({ isOpen, onToggle }) => (
    <div className="mas-glass border-mas-border overflow-hidden">
        <SectionHeader id="vehicle" label="Vehicle Configuration" icon={Car} isOpen={isOpen} onToggle={onToggle} />
        {isOpen && (
            <div className="p-12 grid grid-cols-2 gap-12 bg-white/[0.01]">
                <div className="space-y-2">
                    <label className="text-mas-text-dim uppercase">Vehicle No & Type</label>
                    <p className="uppercase text-white">WP CAB - 4281 (Car)</p>
                </div>
                <div className="space-y-2">
                    <label className="text-mas-text-dim uppercase">Vehicle Entry Policy</label>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="uppercase text-white">Verified Entry Requested</span>
                    </div>
                </div>
            </div>
        )}
    </div>
);

export const GroupMembers = ({ isOpen, onToggle }) => (
    <div className="mas-glass border-mas-border overflow-hidden">
        <SectionHeader id="group" label="Accompanying Group Members" icon={Users} isOpen={isOpen} onToggle={onToggle} />
        {isOpen && (
            <div className="p-12 bg-white/[0.01]">
                <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-8 py-3 border-b border-mas-border">
                        <span className="text-mas-text-dim uppercase">Member Name</span>
                        <span className="text-mas-text-dim uppercase">NIC / Passport</span>
                        <span className="text-mas-text-dim uppercase">Contact</span>
                    </div>
                    {[
                        { name: 'Sarah Jenkins', id: 'N-8291039V', contact: '+94 77 987 6543' },
                        { name: 'Michael Chen', id: 'P-12345678', contact: '+1 415 555 0198' }
                    ].map((member, idx) => (
                        <div key={idx} className="grid grid-cols-3 gap-8 py-3 border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                            <span className="uppercase text-white">{member.name}</span>
                            <span className="uppercase text-white">{member.id}</span>
                            <span className="uppercase text-white">{member.contact}</span>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
);

export const EquipmentManifest = ({ isOpen, onToggle }) => (
    <div className="mas-glass border-mas-border overflow-hidden">
        <SectionHeader id="equipment" label="Equipment & Asset Manifest" icon={Briefcase} isOpen={isOpen} onToggle={onToggle} />
        {isOpen && (
            <div className="p-12 bg-white/[0.01]">
                <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-8 py-3 border-b border-mas-border">
                        <span className="col-span-4 text-mas-text-dim uppercase">Asset Item</span>
                        <span className="col-span-2 text-mas-text-dim uppercase">Qty</span>
                        <span className="col-span-6 text-mas-text-dim uppercase">Description / Serial No</span>
                    </div>
                    {[
                        { item: 'MacBook Pro 16"', qty: '02', desc: 'SN: C02YJ0Q5JGH7, C02XJ0P5JGH8' },
                        { item: 'Fluke Network Tester', qty: '01', desc: 'Hardware Diagnostics Toolkit' }
                    ].map((equip, idx) => (
                        <div key={idx} className="grid grid-cols-12 gap-8 py-3 border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                            <span className="col-span-4 uppercase text-white truncate">{equip.item}</span>
                            <span className="col-span-2 uppercase text-white">{equip.qty}</span>
                            <span className="col-span-6 uppercase text-white truncate">{equip.desc}</span>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
);

export const DocumentReview = ({ isOpen, onToggle }) => (
    <div className="mas-glass border-mas-border overflow-hidden">
        <SectionHeader id="docs" label="Uploaded Identification" icon={FileText} isOpen={isOpen} onToggle={onToggle} />
        {isOpen && (
            <div className="p-12 bg-white/[0.01] flex items-center gap-8">
                <div className="w-24 h-24 bg-white/5 border border-white/10 flex items-center justify-center">
                    <FileText size={32} className="text-mas-text-dim" />
                </div>
                <div className="space-y-2 flex-1">
                    <p className="text-white uppercase">ID_PASSPORT_JDOE.PDF</p>
                    <p className="text-mas-text-dim uppercase">2.4 MB • Verified by Auto-Scan</p>
                    <button className="text-mas-red uppercase underline underline-offset-4 decoration-mas-red/50 hover:decoration-mas-red transition-all mt-2 cursor-pointer">
                        View Document
                    </button>
                </div>
            </div>
        )}
    </div>
);
