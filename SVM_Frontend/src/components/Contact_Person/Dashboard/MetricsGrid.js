import React, { useEffect, useState } from 'react';
import { Clock, CheckSquare, XCircle, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { GetVisitRequestsByCP } from '../../../actions/VisitRequestAction';
import ContactPersonService from '../../../services/ContactPersonService';


const Panel = ({ icon, label, value, trend }) => {
  const Icon = icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white border border-gray-200 p-6 rounded-[24px] flex flex-col justify-between group cursor-pointer hover:border-primary/20 transition-all duration-500 relative overflow-hidden shadow-xl shadow-gray-200/50 h-full"
    >
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all"></div>

      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-gray-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-4 group-hover:text-primary transition-opacity">{label}</p>
          <h3 className="text-[#1A1A1A] text-2xl font-black tracking-tighter group-hover:text-primary transition-colors">{value}</h3>
        </div>
        <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 group-hover:border-primary/40 group-hover:bg-primary/5 transition-all duration-500 shadow-sm">
          <Icon className="text-primary group-hover:scale-110 transition-transform" size={18} strokeWidth={2.5} />
        </div>
      </div>



      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary group-hover:w-full transition-all duration-700 shadow-[0_0_10px_var(--color-primary)]"></div>
    </motion.div>
  );
};

const MetricsGrid = () => {
    const dispatch = useDispatch();
    const { visitRequestsByCP } = useSelector(state => state.visitRequestsState);
    const user = useSelector(state => state.login.user);
    const userEmail = user?.ResultSet?.[0]?.VA_Email;
    const [cpId, setCpId] = useState(null);

    // Dynamic ID Resolution
    useEffect(() => {
        const loadContactPersonId = async () => {
            try {
                const response = await ContactPersonService.GetAllContactPersons();
                const contactPersons = response?.data?.ResultSet || [];
                const match = contactPersons.find(
                    (cp) => cp?.VCP_Email?.trim().toLowerCase() === userEmail?.trim().toLowerCase()
                );
                if (match?.VCP_Contact_person_id) {
                    setCpId(match.VCP_Contact_person_id);
                } else {
                    setCpId(user?.ResultSet?.[0]?.VCP_Contact_person_id || null);
                }
            } catch (err) {
                setCpId(user?.ResultSet?.[0]?.VCP_Contact_person_id || null);
            }
        };

        if (userEmail) loadContactPersonId();
        else setCpId(user?.ResultSet?.[0]?.VCP_Contact_person_id || null);
    }, [userEmail, user]);

    // Fetch Latest Data
    useEffect(() => {
        if (cpId) {
            dispatch(GetVisitRequestsByCP(cpId));
        }
    }, [dispatch, cpId]);

    // Calculate Dynamic Stats
    const calculateStats = () => {
        if (!visitRequestsByCP) return [];

        const pending = visitRequestsByCP.filter(req => {
            const s = (req.VVR_Status || "").toString().trim().toUpperCase();
            return s === 'P' || s === 'PENDING';
        }).length;

        const accepted = visitRequestsByCP.filter(req => {
            const s = (req.VVR_Status || "").toString().trim().toUpperCase();
            return s === 'A' || s === 'APPROVED' || s === 'ACCEPTED' || s === 'SUCCESS';
        }).length;

        const rejected = visitRequestsByCP.filter(req => {
            const s = (req.VVR_Status || "").toString().trim().toUpperCase();
            return s === 'R' || s === 'REJECTED';
        }).length;

        const sent = visitRequestsByCP.filter(req => {
            const s = (req.VVR_Status || "").toString().trim().toUpperCase();
            return s === 'SENT' || s === 'ESCALATED';
        }).length;

        return [
            { label: 'Pending Requests', value: pending.toString(), icon: Clock, trend: 'Awaiting Action' },
            { label: 'Accepted Forms', value: accepted.toString(), icon: CheckSquare, trend: 'Clearance Granted' },
            { label: 'Rejected Forms', value: rejected.toString(), icon: XCircle, trend: 'Access Denied' },
            { label: 'Sent to Admin', value: sent.toString(), icon: Send, trend: 'Escalated' },
        ];
    };

    const stats = calculateStats();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
                <Panel key={i} {...stat} />
            ))}
        </div>
    );
};

export default MetricsGrid;
