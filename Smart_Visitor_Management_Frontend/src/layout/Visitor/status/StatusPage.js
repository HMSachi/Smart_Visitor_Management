import React from 'react';
import StatusCard from '../../../components/Visitor/Status/StatusCard';
import StatusTimeline from '../../../components/Visitor/Status/StatusTimeline';
import NotificationPanel from '../../../components/Visitor/Status/NotificationPanel';

const StatusPage = () => {
    return (
        <div className="min-h-screen bg-charcoal-900 pt-32 pb-24 px-6 overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <header className="mb-16">
                    <span className="uppercase text-mas-red block mb-3">Live Tracking</span>
                    <h1 className="text-white uppercase">Clearance Status</h1>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                    <div className="lg:col-span-2 space-y-12">
                        <StatusCard status="review" />
                        
                        <div className="glass-panel p-12">
                            <div className="flex items-center space-x-6 mb-12">
                                <div className="w-8 h-[1px] bg-mas-red"></div>
                                <h2 className="text-white uppercase">Clearance Timeline</h2>
                            </div>
                            <StatusTimeline currentStage="review" />
                        </div>
                    </div>

                    <div className="lg:h-full">
                        <NotificationPanel />
                    </div>
                </div>

                <div className="mt-16 flex flex-col md:flex-row items-center justify-between border-t border-white/5 pt-12">
                    <div className="mb-8 md:mb-0">
                        <p className="text-gray-500 uppercase mb-2">Inquiry node</p>
                        <p className="text-white">"Standard review protocols are currently high priority."</p>
                    </div>
                    <div className="flex space-x-8">
                        <button onClick={() => window.location.href='/request-step-2'} className="px-10 py-4 bg-white/5 border border-white/10 text-mas-red uppercase hover:border-mas-red/50 hover:bg-white/10 transition-all">Detailed Verification Required</button>
                        <button onClick={() => window.location.href='/home'} className="px-10 py-4 bg-mas-red text-white uppercase hover:bg-[#A60D26] transition-all">Back to Portal</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatusPage;
