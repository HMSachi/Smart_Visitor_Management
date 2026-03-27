import React from 'react';
import { useSelector } from 'react-redux';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, Users } from 'lucide-react';

const TotalVisitsCard = () => {
  const { totalVisits, history } = useSelector(state => state.dashboard);

  return (
    <div className="mas-glass p-8 group relative overflow-hidden animate-shine cursor-pointer border-white/[0.05] shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-500">
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <p className="text-mas-text-dim uppercase mb-2">Total Visits</p>
          <h2 className="text-white">
            {totalVisits.toLocaleString()}
          </h2>
        </div>
        <div className="p-4 bg-mas-red/10 text-mas-red border border-mas-red/20 group-hover:bg-mas-red group-hover:text-white transition-all duration-500">
          <Users size={24} strokeWidth={2.5} />
        </div>
      </div>

      <div className="flex items-center space-x-3 mb-8 relative z-10">
        <div className="flex items-center text-green-500 bg-green-500/10 px-2 py-1 border border-green-500/20 uppercase">
          <TrendingUp size={14} className="mr-1.5" />
          +12.5%
        </div>
        <span className="text-mas-text-dim uppercase">vs last month</span>
      </div>

      {/* Chart */}
      <div className="h-28 w-full relative z-10 -ml-2">
        <ResponsiveContainer width="105%" height="100%">
          <AreaChart data={history}>
            <defs>
              <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C8102E" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#C8102E" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip 
              contentStyle={{ backgroundColor: '#0F0F10', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '0' }}
              itemStyle={{ color: '#fff' }}
              cursor={{ stroke: '#C8102E', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area 
              type="monotone" 
              dataKey="visits" 
              stroke="#C8102E" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorVisits)" 
              animationDuration={2500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Subtle indicator */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-mas-red group-hover:w-full transition-all duration-1000" />
    </div>
  );
};

export default TotalVisitsCard;
