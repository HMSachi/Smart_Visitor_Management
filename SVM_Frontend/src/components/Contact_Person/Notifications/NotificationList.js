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
                    className={`transition-all hover:bg-white/[0.01] flex flex-col sm:flex-row items-start sm:items-center bg-[#161618] sm:bg-transparent border border-white/5 sm:border-none rounded-2xl sm:rounded-none mb-4 sm:mb-0 p-5 sm:px-8 sm:py-5 group relative ${notif.unread ? 'border-primary/20 border-l-mas-red border-l-4' : 'border-white/5'}`}
                >
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-4 w-full">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 border ${notif.unread ? 'bg-primary text-white border-primary' : 'bg-primary/10 text-primary border-primary/20'} group-hover:shadow-[0_0_15px_rgba(200,16,46,0.2)] shrink-0`}>
                            {notif.type === 'approval' ? <CheckCircle size={16} /> :
                                notif.type === 'rejection' ? <XCircle size={16} /> :
                                    notif.type === 'pending' ? <Clock size={16} /> : <Info size={16} />}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                                <h4 className={`text-[13px] font-bold tracking-widest uppercase ${notif.unread ? 'text-white' : 'text-gray-300 opacity-90'}`}>
                                    {notif.title}
                                </h4>
                                <span className="text-gray-300 text-[14px] font-medium uppercase tracking-[0.2em] opacity-70">
                                    {notif.time}
                                </span>
                            </div>
                            <p className="text-gray-300 text-[14px] font-medium leading-relaxed truncate opacity-80 group-hover:opacity-100 transition-opacity">
                                {notif.message}
                            </p>
                        </div>

                        <div className="hidden sm:flex p-2 rounded-xl border border-white/5 text-gray-500 group-hover:text-white group-hover:border-white/20 transition-all">
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default NotificationList;
