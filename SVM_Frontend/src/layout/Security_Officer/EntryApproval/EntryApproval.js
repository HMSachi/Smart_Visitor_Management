import React from "react";
import Header from "../../../components/Security_Officer/Layout/Header";
import EntryApprovalComponent from "../../../components/Security_Officer/EntryApproval/EntryApproval";

const EntryApproval = () => {
  return (
    <div className="flex flex-col min-w-0 h-full">
      <Header title="Visitor Requests" />
      <div className="flex-1 overflow-y-auto">
        <EntryApprovalComponent />
      </div>
    </div>
  );
};

export default EntryApproval;
