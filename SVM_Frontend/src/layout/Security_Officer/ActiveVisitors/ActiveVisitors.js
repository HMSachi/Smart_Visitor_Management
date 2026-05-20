import React from 'react';
import Header from '../../../components/Security_Officer/Layout/Header';
import ActiveVisitorsComponent from '../../../components/Security_Officer/ActiveVisitors/ActiveVisitors';
import { Users } from 'lucide-react';

const ActiveVisitors = () => {
  return (
    <div className="flex flex-col min-w-0 bg-[var(--color-bg-default)] min-h-screen">
      <Header />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full animate-fade-in">
        <div className="max-w-[1600px] mx-auto">
          {/* Page Header */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-primary shrink-0"
              style={{ background: 'var(--color-primary-low)', border: '1px solid rgba(200,16,46,0.2)' }}
            >
              <Users size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--color-text-primary)] leading-tight m-0">
                Active & Left Visitors
              </h1>
              <p className="text-[var(--color-text-secondary)] text-sm mt-0.5">
                Monitor currently checked-in and departed visitors on the premises in real-time
              </p>
            </div>
          </div>

          <div className="p-0 min-h-[600px]">
            <ActiveVisitorsComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveVisitors;
