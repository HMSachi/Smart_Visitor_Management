import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';
import { Activity, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ActiveVisitorsCard = () => {
  const { activeVisitors } = useSelector(state => state.dashboard);
  const [displayCount, setDisplayCount] = useState(0);

  // Animate count update
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

      if (counter === totalFrames) {
        clearInterval(timer);
      }
    }, frameDuration);

    return () => clearInterval(timer);
  }, [activeVisitors]);

  // Mock data for mini bar chart
  const data = Array.from({ length: 12 }, (_, i) => ({
    val: Math.floor(Math.random() * 50) + 10,
    active: i === 11
  }));

  return (
    <div className="glass rounded-2xl p-6 border border-white/5 hover:border-neon-blue/30 transition-all duration-500 group relative overflow-hidden">
      {/* Neon Highlight */}
      <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-neon-blue/10 rounded-full blur-3xl group-hover:bg-neon-blue/20 transition-all duration-500" />

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            <p className="text-white/50 text-sm font-medium uppercase tracking-wider">Live Now</p>
          </div>
          <AnimatePresence mode="wait">
            <motion.h2 
              key={displayCount}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-5xl font-black text-white tracking-tight flex items-baseline"
            >
              {displayCount}
              <span className="text-lg font-bold text-neon-blue ml-2 uppercase tracking-tighter neon-text">Visitors</span>
            </motion.h2>
          </AnimatePresence>
        </div>
        <div className="p-3 rounded-xl bg-neon-blue/10 text-neon-blue group-hover:shadow-[0_0_15px_rgba(0,242,255,0.4)] transition-all duration-300">
          <Zap size={24} fill="currentColor" />
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="flex justify-between items-end">
          <p className="text-xs font-bold text-white/30 uppercase tracking-widest">Occupancy Trend</p>
          <div className="flex items-center text-neon-blue text-xs font-bold">
            <Activity size={14} className="mr-1" />
            Stable
          </div>
        </div>
        
        <div className="h-16 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <Bar dataKey="val" radius={[2, 2, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === data.length - 1 ? '#00f2ff' : 'rgba(255,255,255,0.1)'} 
                    className={index === data.length - 1 ? 'animate-pulse' : ''}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Modern minimal graph line indicator */}
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Zap size={80} className="text-neon-blue" />
      </div>
    </div>
  );
};

export default ActiveVisitorsCard;
