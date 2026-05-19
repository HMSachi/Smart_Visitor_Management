import React from 'react';
import Header from '../../../components/Security_Officer/Layout/Header';
import IncidentReportComponent from '../../../components/Security_Officer/IncidentReport/IncidentReport';

const IncidentReport = () => {
    return (
        <div className="flex flex-col min-w-0 h-full">
            <Header title="Tactical Incident Logging" />
            <div className="flex-1 overflow-y-auto">
                <IncidentReportComponent />
            </div>
        </div>
    );
};

export default IncidentReport;
