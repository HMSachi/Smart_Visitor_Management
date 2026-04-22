import React from 'react';
import Header from '../../../components/Admin/Layout/Header';
import OverviewPanels from '../../../components/Admin/Dashboard/OverviewPanels';
import { LayoutDashboard, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="flex flex-col min-w-0 bg-[var(--color-bg-default)] min-h-screen">
      <Header />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto space-y-6 animate-fade-in">

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-primary shrink-0"
                style={{ background: 'var(--color-primary-low)', border: '1px solid rgba(200,16,46,0.2)' }}
              >
                <LayoutDashboard size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[var(--color-text-primary)] leading-tight m-0">
                  Dashboard Overview
                </h1>
                <p className="text-[var(--color-text-secondary)] text-sm mt-0.5">
                  Live summary of visitor activity and system status
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Live indicator */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#22C55E' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Live
              </span>

              <button
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all text-sm font-medium"
                style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border-soft)' }}
              >
                <RefreshCw size={14} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <OverviewPanels />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
