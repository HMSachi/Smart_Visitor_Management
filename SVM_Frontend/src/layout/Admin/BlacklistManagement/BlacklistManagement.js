import React from 'react';

import Header from '../../../components/Admin/Layout/Header';
import BlacklistManagementMain from '../../../components/Admin/BlacklistManagement/BlacklistManagement';

const BlacklistManagement = () => {
  return (
    <div className="flex flex-col min-w-0 bg-[var(--color-bg-default)] min-h-screen">
        <Header />
        <BlacklistManagementMain />
    </div>
  );
};

export default BlacklistManagement;
