import React from 'react';
import { CheckCircle, XCircle, Clock, Info, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const NotificationList = ({ notifications }) => {
    return (
        <div className="space-y-4">
            {notifications.map((notif, index) => (
                <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-[#121214] p-6 rounded-3xl border transition-all hover:border-white/10 cursor-pointer group shadow-xl relative overflow-hidden ${notif.unread ? 'border-mas-red/20' : 'border-white/5'}`}
                >
                    {notif.unread && (
                        <div className="absolute top-0 left-0 w-1 h-full bg-mas-red shadow-[0_0_15px_#C8102E]"></div>
                    )}

                    <div className="flex items-center gap-6">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500 border bg-mas-red/10 text-mas-red border-mas-red/20 group-hover:scale-110 shadow-lg shrink-0`}>
                            {notif.type === 'approval' ? <CheckCircle size={18} /> :
                                notif.type === 'rejection' ? <XCircle size={18} /> :
                                    notif.type === 'pending' ? <Clock size={18} /> : <Info size={18} />}
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <h4 className={`text-[11px] font-black tracking-[0.1em] uppercase ${notif.unread ? 'text-white' : 'text-mas-text-dim opacity-60 group-hover:opacity-100 transition-opacity'}`}>
                                    {notif.title}
                                </h4>
                                <span className="text-mas-text-dim text-[9px] font-black uppercase tracking-widest opacity-40">
                                    {notif.time}
                                </span>
                            </div>
                            <p className={`text-[13px] font-medium leading-relaxed ${notif.unread ? 'text-white/90' : 'text-mas-text-dim/70 group-hover:text-mas-text-dim transition-colors'}`}>
                                {notif.message}
                            </p>
                        </div>
                        <div className={`p-2 rounded-lg bg-white/[0.02] border border-white/5 opacity-0 group-hover:opacity-100 transition-all ${notif.unread ? 'text-mas-red' : 'text-mas-text-dim'}`}>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default NotificationList;
