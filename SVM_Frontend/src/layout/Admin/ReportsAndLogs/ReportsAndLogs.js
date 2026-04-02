import React from 'react';

import Header from '../../../components/Admin/Layout/Header';
import ReportsAndLogsMain from '../../../components/Admin/ReportsAndLogs/ReportsAndLogs';

const ReportsAndLogs = () => {
  return (
    <div className="flex flex-col min-w-0 bg-[var(--color-bg-default)] min-h-screen">
        <Header />
        <ReportsAndLogsMain />
    </div>
  );
};

export default ReportsAndLogs;
