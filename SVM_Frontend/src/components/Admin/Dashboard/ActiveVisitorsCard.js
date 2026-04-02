import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';
import { Activity, Zap, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ActiveVisitorsCard = () => {
  const { activeVisitors } = useSelector(state => state.admin.metrics);
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    let start = displayCount;
    const end = activeVisitors;
    if (start === end) return;
    let totalDuration = 1000;
    let frameDuration = 1000 / 60;
    let totalFrames = Math.round(totalDuration / frameDuration);
    let counter = 0;
    const timer = setInterval(() => {
      counter++;
      const progress = counter / totalFrames;
      const currentCount = Math.round(start + (end - start) * progress);
      setDisplayCount(currentCount);
      if (counter === totalFrames) clearInterval(timer);
    }, frameDuration);
    return () => clearInterval(timer);
  }, [activeVisitors]);

  const data = Array.from({ length: 12 }, (_, i) => ({
    val: Math.floor(Math.random() * 50) + 10,
    active: i === 11
  }));

  return (
    <div className="mas-glass p-8 group relative overflow-hidden animate-shine cursor-pointer border-white/[0.05] shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-500">
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <div className="flex items-center space-x-3 mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <p className="text-gray-300 uppercase">Protocols Active</p>
          </div>
          <AnimatePresence mode="wait">
            <motion.h2 
              key={displayCount}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-white flex items-baseline"
            >
              {displayCount}
              <span className="text-primary ml-3 uppercase">Nodes</span>
            </motion.h2>
          </AnimatePresence>
        </div>
        <div className="p-4 bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-white group-hover:shadow-[0_0_20px_rgba(200,16,46,0.4)] transition-all duration-500">
          <Zap size={24} fill="currentColor" />
        </div>
      </div>

      <div className="space-y-6 relative z-10">
        <div className="flex justify-between items-end border-b border-white/5 pb-2">
          <p className="text-white/80 uppercase">Traffic Density</p>
          <div className="flex items-center text-green-500 uppercase">
            <Activity size={12} className="mr-1.5" />
            STABLE
          </div>
        </div>
        
        <div className="h-20 w-full opacity-90 group-hover:opacity-100 transition-all">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <Bar dataKey="val">
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === data.length - 1 ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-all">
        <ShieldCheck size={120} className="text-white" />
      </div>
    </div>
  );
};

export default ActiveVisitorsCard;
