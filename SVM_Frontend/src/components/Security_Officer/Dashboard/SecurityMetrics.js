import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { QrCode, ShieldCheck, Users, AlertTriangle, Activity, Zap, TrendingUp, TrendingDown, Target } from 'lucide-react';

const iconMap = {
    QrCode,
    ShieldCheck,
    Users,
    AlertTriangle,
    Activity,
    Zap,
    Target
};

const SecurityMetrics = () => {
    const { metrics } = useSelector(state => state.security);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
            {metrics.map((stat, i) => {
                const Icon = iconMap[stat.iconName] || ShieldCheck;
                const isRed = stat.color === 'text-mas-red';

                return (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-[#121214] border border-white/5 p-6 sm:p-8 md:p-9 rounded-[32px] hover:border-mas-red/30 transition-all duration-700 group shadow-2xl relative overflow-hidden cursor-crosshair min-w-0"
                    >
                        {/* Strategic Background Detail */}
                        <div className="absolute -right-8 -bottom-8 opacity-[0.02] group-hover:opacity-[0.08] transition-opacity duration-700 group-hover:scale-110 pointer-events-none">
                            <Icon size={140} strokeWidth={1} />
                        </div>

                        <div className="space-y-8 relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl bg-white/[0.02] border border-white/5 ${isRed ? 'text-mas-red shadow-[0_0_15px_rgba(200,16,46,0.1)]' : 'text-white'} group-hover:scale-110 transition-transform duration-500`}>
                                        <Icon size={18} strokeWidth={2} />
                                    </div>
                                    <span className="text-mas-text-dim/40 uppercase text-[10px] font-black tracking-[0.3em] group-hover:text-white/60 transition-colors truncate max-w-[120px]">{stat.label}</span>
                                </div>
                                <div className="flex gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                                    <div className={`w-1 h-1 rounded-full ${isRed ? 'bg-mas-red' : 'bg-white'}`}></div>
                                    <div className="w-1 h-1 rounded-full bg-white/20"></div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex items-end justify-between">
                                    <p className={`text-3xl md:text-4xl font-black italic tracking-tighter ${isRed ? 'text-mas-red' : 'text-white'} group-hover:scale-[1.02] origin-left transition-transform duration-500`}>
                                        {stat.value}
                                    </p>
                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-lg bg-white/[0.02] border border-white/5 ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-mas-red'} group-hover:bg-white/5 transition-all flex-shrink-0`}>
                                        {stat.trend.startsWith('+') ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                        <span className="text-[10px] font-black tracking-widest">{stat.trend}</span>
                                    </div>
                                </div>
                                <div className="h-[1px] w-full bg-white/[0.03] overflow-hidden rounded-full">
                                    <motion.div
                                        initial={{ x: '-100%' }}
                                        animate={{ x: '0%' }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                        className={`h-full w-full ${isRed ? 'bg-mas-red shadow-[0_0_8px_#C8102E]' : 'bg-white/40'}`}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <p className="text-mas-text-dim/10 text-[8px] font-black uppercase tracking-[0.4em]">Node_Intelligence_Metric</p>
                                <div className="flex gap-1.5 items-center">
                                    <Activity size={10} className={`${isRed ? 'text-mas-red/40' : 'text-mas-text-dim/20'} animate-pulse`} />
                                    <span className="text-mas-text-dim/10 text-[8px] font-black tracking-widest font-mono italic">SYNC:OK</span>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Corner Accent */}
                        <div className={`absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl ${isRed ? 'from-mas-red/20' : 'from-white/10'} to-transparent transition-opacity opacity-0 group-hover:opacity-100`}></div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default SecurityMetrics;
