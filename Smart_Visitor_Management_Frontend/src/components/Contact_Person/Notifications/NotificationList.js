import React from 'react';
import { Bell, CheckCircle, XCircle, Clock, Info, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const NotificationList = ({ notifications }) => {
    return (
        <div className="space-y-4">
            {notifications.map((notif, index) => (
                <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`mas-glass p-6 border-l-4 transition-all hover:bg-white/[0.03] cursor-pointer group ${notif.unread ? 'border-mas-red bg-mas-red/[0.02]' : 'border-white/10 opacity-70'}`}
                >
                    <div className="flex items-start gap-6">
                        <div className={`p-3 mas-glass border-white/5 ${notif.unread ? 'bg-mas-red text-white' : 'bg-white/5 text-mas-text-dim'}`}>
                            {notif.type === 'approval' ? <CheckCircle size={14} /> : 
                             notif.type === 'rejection' ? <XCircle size={14} /> : 
                             notif.type === 'pending' ? <Clock size={14} /> : <Info size={14} />}
                        </div>
                        
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className={`uppercase ${notif.unread ? 'text-white' : 'text-mas-text-dim group-hover:text-white'}`}>
                                    {notif.title}
                                </h4>
                                <span className="text-mas-text-dim uppercase">
                                    {notif.time}
                                </span>
                            </div>
                            <p className="text-mas-text-dim uppercase">
                                {notif.message}
                            </p>
                        </div>

                        <div className={`opacity-0 group-hover:opacity-100 transition-all ${notif.unread ? 'text-mas-red' : 'text-mas-text-dim'}`}>
                            <ArrowRight size={16} />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default NotificationList;
