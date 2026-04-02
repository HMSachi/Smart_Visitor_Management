import React from 'react';

import Header from '../../../components/Admin/Layout/Header';
import UserManagementMain from '../../../components/Admin/UserManagement/UserManagement';

const UserManagement = () => {
  return (
    <div className="flex flex-col min-w-0 bg-[var(--color-bg-default)] min-h-screen">
        <Header />
        <UserManagementMain />
    </div>
  );
};

export default UserManagement;
