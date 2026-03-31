import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertCircle, Search, Plus, Filter, Download, Activity, Clock } from 'lucide-react';
import BlacklistTable from './BlacklistTable';

const BlacklistManagementMain = () => {


  return (
    <div className="flex-1 p-10 overflow-y-auto w-full bg-[#0A0A0B] relative">
      {/* Global Operational Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-mas-red/5 rounded-full blur-[120px] pointer-events-none opacity-50"></div>

      <div className="max-w-[1600px] mx-auto relative z-10">


        <div className="p-0 min-h-[600px]">
          <BlacklistTable />
        </div>
      </div>
    </div>
  );
};

export default BlacklistManagementMain;
