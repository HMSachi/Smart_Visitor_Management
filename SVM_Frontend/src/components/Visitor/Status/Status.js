import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Activity,
  Shield,
  ArrowLeft,
  Terminal,
  LayoutDashboard,
  FileText,
} from "lucide-react";
import StatusCard from "./StatusCard";
import StatusTimeline from "./StatusTimeline";
import NotificationPanel from "./NotificationPanel";
import { setStatus } from "../../../reducers/visitorSlice";

const StatusMain = () => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.visitor);
  const currentStatus = status || "step1_pending";

  const getStatusMessage = () => {
    switch (currentStatus) {
      case "step1_pending":
        return "Basic clearance request is under review. Standard protocols active.";
      case "step1_approved":
        return "Primary authorization granted. Please finalize detailed documentation for access.";
      case "step2_pending":
        return "Detailed documentation synchronized. Final facility security clearance in progress.";
      case "fully_approved":
        return "Access parameters finalized. Your digital facility pass is now active.";
      default:
        return "Standard review protocols are currently high priority.";
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-5 pt-2 pb-6 text-white bg-background min-h-screen">
      {/* Page Header */}
      <header className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-2 mb-1.5">
            <span className="text-primary font-bold text-[12px] uppercase tracking-widest">
              Facility Access
            </span>
          </div>
          <h1 className="text-lg md:text-xl font-bold uppercase tracking-tight">
            Request <span className="text-primary">Status</span>
          </h1>
          <p className="text-gray-500 text-[12px] uppercase font-semibold tracking-wider mt-0.5">
            Track your visitation progress
          </p>
        </div>

        <div className="hidden md:flex flex-col md:flex-row items-center gap-3 md:gap-2 px-3 py-1.5 bg-white/[0.02] border border-white/5 rounded-lg">
          <Activity size={13} className="text-primary" />
          <span className="text-gray-400 text-[12px] font-bold uppercase tracking-widest">
            In Progress
          </span>
        </div>
      </header>

      <div className="flex flex-col gap-4">
        <main className="space-y-4">
          {/* Status Overview Card */}
          <StatusCard status={currentStatus} />

          {/* Timeline Card */}
          <div className="bg-white/[0.01] border border-white/5 p-4 sm:p-5 rounded-xl">
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-2 mb-5">
              <div className="text-primary">
                <FileText size={13} />
              </div>
              <h3 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-0 !mb-0">
                Pass Progress
              </h3>
            </div>

            <StatusTimeline currentStage={currentStatus} />
          </div>
        </main>
      </div>

      {/* Footer Summary Actions */}
      <div className="mt-6 pt-4 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-3 w-full md:w-auto">
          <button
            onClick={() => (window.location.href = "/home")}
            className="px-5 py-2.5 bg-white/[0.03] border border-white/10 text-white text-[12px] font-bold uppercase tracking-widest rounded-lg hover:bg-white/[0.07] transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={13} /> Hub
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusMain;
