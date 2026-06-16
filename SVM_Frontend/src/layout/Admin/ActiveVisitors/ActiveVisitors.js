import React from 'react';
import Header from '../../../components/Admin/Layout/Header';
import ActiveVisitorsComponent from '../../../components/Security_Officer/ActiveVisitors/ActiveVisitors';

const AdminActiveVisitors = ({ defaultTab = "inside" }) => {
  return (
    <div className="flex flex-col min-w-0 bg-[var(--color-bg-default)] min-h-screen">
      <Header title={defaultTab === "inside" ? "Inside Visitors" : "All Visitor Logs"} />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full animate-fade-in">
        <div className="max-w-[1600px] mx-auto">
          <div className="p-0 min-h-[600px]">
            <ActiveVisitorsComponent defaultTab={defaultTab} isAdmin={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminActiveVisitors;
