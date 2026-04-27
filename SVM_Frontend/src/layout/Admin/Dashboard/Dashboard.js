import React from "react";
import Header from "../../../components/Admin/Layout/Header";
import OverviewPanels from "../../../components/Admin/Dashboard/OverviewPanels";
import { LayoutDashboard } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="flex flex-col min-w-0 bg-[var(--color-bg-default)] min-h-screen">
      <Header />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto space-y-6 animate-fade-in">
          {/* Page Header */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-primary shrink-0"
              style={{
                background: "var(--color-primary-low)",
                border: "1px solid rgba(200,16,46,0.2)",
              }}
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

          {/* Stats Grid */}
          <OverviewPanels />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
