import React, { useState } from "react";
import Header from "../../../components/Admin/Layout/Header";
import OverviewPanels from "../../../components/Admin/Dashboard/OverviewPanels";
import QuickAccessHub from "../../../components/Admin/Dashboard/QuickAccessHub";
import { TrendingUp, Settings, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { FetchAdminDashboardMetrics } from "../../../actions/AdminDashboardAction";
import { GetAllAdministrator } from "../../../actions/AdministratorAction";
import { GetAllContactPersons } from "../../../actions/ContactPersonAction";
import { GetAllVisitors } from "../../../actions/VisitorAction";
import { GetAllVisitRequests } from "../../../actions/VisitRequestAction";
import { GetAllBlacklist } from "../../../actions/BlacklistAction";
import DashboardCharts from "../../../components/Admin/Dashboard/DashboardCharts";
import PageSpinner from "../../../components/common/PageSpinner";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(null);
  const liveDataAvailable = useSelector(state => state.admin.metrics.liveDataAvailable);

  useEffect(() => {
    dispatch(GetAllAdministrator());
    dispatch(GetAllContactPersons());
    dispatch(GetAllVisitors());
    dispatch(GetAllVisitRequests());
    dispatch(GetAllBlacklist());
    dispatch(FetchAdminDashboardMetrics());
    
    // Refresh dashboard every 30 seconds
    const interval = setInterval(() => {
      dispatch(GetAllAdministrator());
      dispatch(GetAllContactPersons());
      dispatch(GetAllVisitors());
      dispatch(GetAllVisitRequests());
      dispatch(GetAllBlacklist());
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

      <div className="flex-1 px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-5 overflow-y-auto">
        <div className="max-w-none mx-auto space-y-4">
          {/* Page Header - Professional Title Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(200,16,46,0.9), rgba(200,16,46,0.7))",
                  boxShadow: "0 4px 12px rgba(200,16,46,0.2)",
                }}
              >
                <BarChart3 size={16} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-[16px] font-bold text-[var(--color-text-primary)] leading-tight m-0">
                  Dashboard
                </h1>
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
          {liveDataAvailable === null ? (
            <div className="flex flex-col items-center justify-center py-10" style={{ background: 'var(--color-bg-paper)', borderRadius: '24px', border: '1px solid var(--color-border-soft)' }}>
              <PageSpinner size={40} color="var(--color-primary)" />
            </div>
          ) : (
            <>
              <section>
                <DashboardCharts />
              </section>

              <section>
                <OverviewPanels />
              </section>
            </>
          )}

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
                <TrendingUp size={16} strokeWidth={2.5} />
              </div>
              <h2 className="text-[16px] font-bold text-[var(--color-text-primary)] m-0">
                Quick Access
              </h2>
            </div>
            <QuickAccessHub setActiveTab={handleQuickAccess} />
          </section>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
