import React from 'react';
import { AlertOctagon, Upload, Send } from 'lucide-react';

const IncidentReportMain = () => {
    return (
        <div className="p-12 space-y-12 animate-fade-in text-white">
            <div className="flex items-end justify-between border-b border-mas-border pb-8">
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <AlertOctagon size={14} className="text-mas-red" />
                        <span className="text-mas-red uppercase">Reporting Node</span>
                        <div className="h-[1px] w-12 bg-mas-red"></div>
                    </div>
                    <h1 className="uppercase text-white flex items-center gap-6">
                        Incident Report
                    </h1>
                </div>
            </div>

            <div className="max-w-4xl mas-glass p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-mas-red/5 blur-[120px]"></div>
                
                <div className="relative z-10 space-y-12">
                    {/* Visitor Auto-fill Section */}
                    <section className="space-y-6">
                        <h3 className="text-mas-red uppercase mb-6">Subject Identification</h3>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-mas-text-dim uppercase">Personnel Name</label>
                                <input 
                                    type="text" 
                                    defaultValue="John Doe"
                                    className="mas-input w-full bg-white/[0.02] border-white/5 focus:border-mas-red"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-mas-text-dim uppercase">Reference Node ID</label>
                                <input 
                                    type="text" 
                                    defaultValue="VER-SYNC-4291"
                                    className="mas-input w-full bg-white/[0.02] border-white/5 focus:border-mas-red"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="space-y-8 pt-10 border-t border-white/5">
                        <h3 className="text-mas-red uppercase mb-6">Protocol Breach Details</h3>
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-mas-text-dim uppercase">Issue Type</label>
                                <select className="mas-input w-full bg-[#121212] border-white/10 text-white uppercase cursor-pointer px-4">
                                    <option>ASSET MISMATCH / MISSING ITEM</option>
                                    <option>UNAUTHORIZED LOCATION ACCESS</option>
                                    <option>IDENTITY DISCREPANCY</option>
                                    <option>EQUIPMENT DAMAGE REPORT</option>
                                    <option>SECURITY BEHAVIOR PROTOCOL VIOLATION</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-mas-text-dim uppercase">Detailed Incident Description</label>
                                <textarea 
                                    placeholder="DESCRIBE THE LOGICAL SEQUENCE OF THE BREACH..."
                                    className="mas-input w-full min-h-[180px] bg-white/[0.01] border-white/10 p-6 uppercase"
                                ></textarea>
                            </div>
                        </div>
                    </section>

                    {/* Evidence Upload */}
                    <section className="space-y-6 pt-10 border-t border-white/5">
                        <h3 className="text-mas-red uppercase">Evidence Artifacts</h3>
                        <div className="border-2 border-dashed border-white/5 hover:border-mas-red/30 transition-all p-12 flex flex-col items-center justify-center gap-6 bg-white/[0.01] group cursor-pointer">
                            <div className="p-4 bg-mas-dark border border-white/10 group-hover:scale-110 transition-transform">
                                <Upload size={24} className="text-mas-text-dim group-hover:text-mas-red" />
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-white uppercase">Select files or drag and drop</p>
                                <p className="text-mas-text-dim uppercase">Max Size: 25MB • SEC-ENCRYPTED</p>
                            </div>
                        </div>
                    </section>

                    <div className="pt-12 border-t border-mas-border">
                        <button className="flex items-center gap-6 px-16 py-5 bg-mas-red text-white uppercase shadow-[0_0_50px_rgba(200,16,46,0.3)] hover:scale-105 transition-all w-full md:w-auto">
                            <Send size={18} />
                            Transmit Incident Log
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncidentReportMain;
