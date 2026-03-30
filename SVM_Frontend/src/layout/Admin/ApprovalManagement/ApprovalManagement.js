import React from 'react';

import Header from '../../../components/Admin/Layout/Header';
import ApprovalManagementMain from '../../../components/Admin/ApprovalManagement/ApprovalManagement';

const ApprovalManagement = () => {
  return (
    <div className="flex flex-col min-w-0 bg-[#0A0A0B] min-h-screen">
        <Header />
        <ApprovalManagementMain />
    </div>
  );
};

export default ApprovalManagement;
