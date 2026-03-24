import React from 'react';
import { useSelector } from 'react-redux';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, Users } from 'lucide-react';

const TotalVisitsCard = () => {
  const { totalVisits, history } = useSelector(state => state.dashboard);

  return (
    <div className="glass rounded-2xl p-6 border border-white/5 hover:border-primary/30 transition-all duration-500 group relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500" />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-white/50 text-sm font-medium uppercase tracking-wider mb-1">Total Visits</p>
          <h2 className="text-4xl font-black text-white tracking-tight">
            {totalVisits.toLocaleString()}
          </h2>
        </div>
        <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
          <Users size={24} />
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-6 relative z-10">
        <div className="flex items-center text-success bg-success/10 px-2 py-1 rounded-lg text-xs font-bold">
          <TrendingUp size={14} className="mr-1" />
          +12.5%
        </div>
        <span className="text-white/30 text-xs font-medium italic">vs last month</span>
      </div>

      {/* Chart */}
      <div className="h-24 w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history}>
            <defs>
              <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
              cursor={{ stroke: 'rgba(99, 102, 241, 0.4)', strokeWidth: 2 }}
            />
            <Area 
              type="monotone" 
              dataKey="visits" 
              stroke="#6366f1" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorVisits)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Micro-interaction on hover */}
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary group-hover:w-full transition-all duration-700" />
    </div>
  );
};

export default TotalVisitsCard;
