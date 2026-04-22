import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';
import { Activity, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ActiveVisitorsCard = () => {
  const { activeVisitors } = useSelector(state => state.admin.metrics);
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    let start = displayCount;
    const end = activeVisitors;
    if (start === end) return;
    const totalFrames = 60;
    let counter = 0;
    const timer = setInterval(() => {
      counter++;
      const progress = counter / totalFrames;
      setDisplayCount(Math.round(start + (end - start) * progress));
      if (counter === totalFrames) clearInterval(timer);
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [activeVisitors]);

  const data = Array.from({ length: 12 }, (_, i) => ({
    val: Math.floor(Math.random() * 50) + 10,
    active: i === 11,
  }));

  return (
    <div
      className="group relative overflow-hidden cursor-pointer h-full"
      style={{
        background: 'var(--color-bg-paper)',
        border: '1px solid var(--color-border-soft)',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-card)',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      {/* Background decoration */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-30 blur-3xl group-hover:opacity-50 transition-all" style={{ background: 'rgba(200,16,46,0.15)' }} />

      {/* Header */}
      <div className="flex items-start justify-between mb-5 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <p className="text-[var(--color-text-secondary)] text-[12.5px] font-medium">Currently On-Site</p>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={displayCount}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex items-baseline gap-2"
            >
              <span className="text-3xl font-bold text-[var(--color-text-primary)]">{displayCount}</span>
              <span className="text-primary text-sm font-semibold">visitors</span>
            </motion.div>
          </AnimatePresence>
        </div>

        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white"
          style={{ background: 'rgba(200,16,46,0.1)', border: '1px solid rgba(200,16,46,0.2)' }}
        >
          <Users size={20} strokeWidth={2} />
        </div>
      </div>

      {/* Chart section */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[var(--color-text-secondary)] text-[12px] font-medium">Hourly Traffic</p>
          <div className="flex items-center gap-1.5 text-green-500 text-[12px] font-semibold">
            <Activity size={12} />
            Stable
          </div>
        </div>
        <div className="h-16 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap="20%">
              <Bar dataKey="val" radius={[3, 3, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === data.length - 1 ? 'var(--color-primary)' : 'rgba(255,255,255,0.06)'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700 bg-primary" />
    </div>
  );
};

export default ActiveVisitorsCard;
