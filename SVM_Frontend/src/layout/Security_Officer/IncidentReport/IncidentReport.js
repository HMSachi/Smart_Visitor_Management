import React from 'react';
import Sidebar from '../../../components/Security_Officer/Layout/Sidebar';
import Header from '../../../components/Security_Officer/Layout/Header';
import IncidentReportComponent from '../../../components/Security_Officer/IncidentReport/IncidentReport';

const IncidentReport = () => {
    return (
        <div className="flex bg-secondary overflow-hidden text-white h-screen w-full">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 bg-[var(--color-bg-default)] overflow-hidden">
                <Header title="Tactical Incident Logging" />
                <div className="flex-1 overflow-y-auto">
                    <IncidentReportComponent />
                </div>
            </div>
        </div>
    );
};

export default IncidentReport;
