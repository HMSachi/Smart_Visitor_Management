import React from 'react';
import Header from '../../../components/Security_Officer/Layout/Header';
import ActiveVisitorsComponent from '../../../components/Security_Officer/ActiveVisitors/ActiveVisitors';

const ActiveVisitors = () => {
  return (
    <div className="flex flex-col min-w-0 bg-[var(--color-bg-default)] min-h-screen">
      <Header title="Active & Left Visitors" />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full animate-fade-in">
        <div className="max-w-[1600px] mx-auto">

          <div className="p-0 min-h-[600px]">
            <ActiveVisitorsComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveVisitors;
