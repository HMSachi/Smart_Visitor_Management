import React, { useState } from "react";
import Header from "../../../components/Admin/Layout/Header";
import OverviewPanels from "../../../components/Admin/Dashboard/OverviewPanels";
import ActiveVisitorsCard from "../../../components/Admin/Dashboard/ActiveVisitorsCard";
import AlertsSection from "../../../components/Admin/Dashboard/AlertsSection";
import QuickAccessHub from "../../../components/Admin/Dashboard/QuickAccessHub";
import TotalVisitsCard from "../../../components/Admin/Dashboard/TotalVisitsCard";
import SystemStatusNode from "../../../components/Admin/Dashboard/SystemStatusNode";
import { LayoutDashboard, TrendingUp, Settings, BarChart3, CheckSquare, ShieldAlert, UserX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { FetchAdminDashboardMetrics } from "../../../actions/AdminDashboardAction";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    dispatch(FetchAdminDashboardMetrics());
    
    // Refresh dashboard every 30 seconds
    const interval = setInterval(() => {
      dispatch(FetchAdminDashboardMetrics());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleQuickAccess = (section) => {
    const routes = {
      approvals: "/admin/approval-management",
      security: "/admin/security-monitoring",
      blacklist: "/admin/blacklist-management",
    };
    if (routes[section]) {
      navigate(routes[section]);
    }
  };

  return (
    <div className="flex flex-col min-w-0 bg-[var(--color-bg-default)] min-h-screen">
      <Header />

      <div className="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7 overflow-y-auto">
        <div className="max-w-none mx-auto space-y-6">
          {/* Page Header - Professional Title Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 flex-shrink-0 mt-0.5"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(200,16,46,0.9), rgba(200,16,46,0.7))",
                  boxShadow: "0 4px 15px rgba(200,16,46,0.3)",
                }}
              >
                <BarChart3 size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] leading-tight m-0">
                  Dashboard
                </h1>
                <p className="text-[var(--color-text-secondary)] text-xs mt-1">
                  Real-time system overview and metrics
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/admin/all-users")}
              className="px-5 py-2.5 border border-[var(--color-border-soft)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 flex items-center gap-2 whitespace-nowrap shadow-sm active:scale-95"
              style={{ borderRadius: '12px' }}
            >
              <Settings size={16} />
              <span className="text-sm font-medium">View Users</span>
            </button>
          </div>

          {/* Key Metrics - Stats Grid */}
          <section>
            <OverviewPanels />
          </section>

          {/* Quick Access Hub */}
          <section>
            <div className="flex items-center gap-3 mb-4 px-1">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(200,16,46,0.8), rgba(200,16,46,0.6))",
                }}
              >
                <TrendingUp size={16} strokeWidth={2} />
              </div>
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)] m-0">
                Quick Access
              </h2>
            </div>
            <QuickAccessHub setActiveTab={handleQuickAccess} />
          </section>

          {/* Main Analytics Section */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              {/* Active Visitors - Full width on mobile, 2/3 on desktop */}
              <div className="md:col-span-2 lg:col-span-2">
                <ActiveVisitorsCard />
              </div>

              {/* Alerts - Full width on mobile, 1/3 on desktop */}
              <div className="md:col-span-2 lg:col-span-1 lg:row-span-2">
                <AlertsSection />
              </div>

              {/* Total Visits - Full width on mobile, 1/2 on tablet, 1/3 on desktop */}
              <div className="md:col-span-1">
                <TotalVisitsCard />
              </div>

              {/* System Status - Full width on mobile, 1/2 on tablet, 1/3 on desktop */}
              <div className="md:col-span-1">
                <SystemStatusNode />
              </div>
            </div>
          </section>

          {/* Admin Management Sections - Professional Footer */}
          <section className="mt-8 pt-6 border-t border-[var(--color-border-soft)]">
            <div className="flex items-center gap-3 mb-5 px-1">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(200,16,46,0.8), rgba(200,16,46,0.6))",
                }}
              >
                <LayoutDashboard size={16} strokeWidth={2} />
              </div>
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)] m-0">
                Admin Modules
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Approval Management */}
              <div
                onClick={() => navigate("/admin/approval-management")}
                role="button"
                tabIndex="0"
                className="group relative overflow-hidden p-8 border border-[var(--color-border-soft)] hover:border-primary/50 transition-all duration-500 text-left hover:scale-[1.03] active:scale-[0.98] shadow-sm hover:shadow-xl cursor-pointer"
                style={{
                  background: "var(--color-bg-paper)",
                  borderRadius: "32px !important",
                  borderRadius: "32px", // standard for browsers that don't like !important in inline style
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(200,16,46,0.05), transparent)",
                  }}
                />
                <div className="relative z-10">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 text-white transition-all duration-300 group-hover:scale-110"
                    style={{ background: "rgba(200,16,46,0.15)" }}
                  >
                    <CheckSquare size={16} />
                  </div>
                  <h3 className="font-semibold text-[var(--color-text-primary)] text-[12.5px] mb-0.5 group-hover:text-primary transition-colors">
                    Approval Management
                  </h3>
                  <p className="text-[var(--color-text-secondary)] text-[11px] leading-relaxed">
                    Review and process visitor approval requests
                  </p>
                </div>
              </div>

              {/* Security Monitoring */}
              <div
                onClick={() => navigate("/admin/security-monitoring")}
                role="button"
                tabIndex="0"
                className="group relative overflow-hidden p-8 border border-[var(--color-border-soft)] hover:border-primary/50 transition-all duration-500 text-left hover:scale-[1.03] active:scale-[0.98] shadow-sm hover:shadow-xl cursor-pointer"
                style={{
                  background: "var(--color-bg-paper)",
                  borderRadius: "32px !important",
                  borderRadius: "32px",
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(200,16,46,0.05), transparent)",
                  }}
                />
                <div className="relative z-10">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 text-white transition-all duration-300 group-hover:scale-110"
                    style={{ background: "rgba(200,16,46,0.15)" }}
                  >
                    <ShieldAlert size={16} />
                  </div>
                  <h3 className="font-semibold text-[var(--color-text-primary)] text-[12.5px] mb-0.5 group-hover:text-primary transition-colors">
                    Security Monitoring
                  </h3>
                  <p className="text-[var(--color-text-secondary)] text-[11px] leading-relaxed">
                    Monitor system security and access logs
                  </p>
                </div>
              </div>

              {/* Blacklist Management */}
              <div
                onClick={() => navigate("/admin/blacklist-management")}
                role="button"
                tabIndex="0"
                className="group relative overflow-hidden p-8 border border-[var(--color-border-soft)] hover:border-primary/50 transition-all duration-500 text-left hover:scale-[1.03] active:scale-[0.98] shadow-sm hover:shadow-xl cursor-pointer"
                style={{
                  background: "var(--color-bg-paper)",
                  borderRadius: "32px !important",
                  borderRadius: "32px",
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(200,16,46,0.05), transparent)",
                  }}
                />
                <div className="relative z-10">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 text-white transition-all duration-300 group-hover:scale-110"
                    style={{ background: "rgba(200,16,46,0.15)" }}
                  >
                    <UserX size={16} />
                  </div>
                  <h3 className="font-semibold text-[var(--color-text-primary)] text-[12.5px] mb-0.5 group-hover:text-primary transition-colors">
                    Restricted List
                  </h3>
                  <p className="text-[var(--color-text-secondary)] text-[11px] leading-relaxed">
                    Manage and maintain blocked visitor lists
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
