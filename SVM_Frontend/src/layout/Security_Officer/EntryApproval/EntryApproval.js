import React from "react";
import Sidebar from "../../../components/Security_Officer/Layout/Sidebar";
import Header from "../../../components/Security_Officer/Layout/Header";
import EntryApprovalComponent from "../../../components/Security_Officer/EntryApproval/EntryApproval";

const EntryApproval = () => {
  return (
    <div className="security-theme-root flex bg-secondary overflow-hidden text-white h-screen w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-[var(--color-bg-default)] overflow-hidden">
        <Header title="Visitor Requests" />
        <div className="flex-1 overflow-y-auto">
          <EntryApprovalComponent />
        </div>
      </div>
    </div>
  );
};

export default EntryApproval;
