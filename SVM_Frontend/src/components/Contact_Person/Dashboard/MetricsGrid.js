import React, { useEffect, useState } from 'react';
import { Clock, CheckSquare, XCircle, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GetVisitRequestsByCP } from '../../../actions/VisitRequestAction';
import ContactPersonService from '../../../services/ContactPersonService';

const Panel = ({ icon, label, value, trend, onClick }) => {
  const Icon = icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={onClick}
      className="bg-[var(--color-bg-paper)] border border-[var(--color-border-soft)] p-2.5 sm:p-3.5 md:p-4 rounded-xl flex flex-col justify-between group cursor-pointer hover:border-primary/20 transition-all duration-500 relative overflow-hidden shadow-md h-full"
    >
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all"></div>

      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-[var(--color-text-dim)] text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] mb-1 sm:mb-2 group-hover:text-primary transition-opacity">{label}</p>
          <h3 className="text-[var(--color-text-primary)] text-lg sm:text-xl md:text-2xl font-black tracking-tighter group-hover:text-primary transition-colors">{value}</h3>
        </div>
        <div className="p-2.5 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-border-soft)] group-hover:border-primary/40 group-hover:bg-primary/5 transition-all duration-500 shadow-sm">
          <Icon className="text-primary group-hover:scale-110 transition-transform" size={16} strokeWidth={2.5} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary group-hover:w-full transition-all duration-700 shadow-[0_0_10px_var(--color-primary)]"></div>
    </motion.div>
  );
};

const MetricsGrid = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
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
            return s === 'SENT' || s === 'SENT_TO_ADMIN' || s === 'ESCALATED';
        }).length;

        return [
            { label: 'Pending Requests', value: pending.toString(), icon: Clock, trend: 'Awaiting Action', filter: 'P' },
            { label: 'Accepted Forms', value: accepted.toString(), icon: CheckSquare, trend: 'Clearance Granted', filter: 'A' },
            { label: 'Declined Forms', value: rejected.toString(), icon: XCircle, trend: 'Access Denied', filter: 'R' },
            { label: 'Sent to Admin', value: sent.toString(), icon: Send, trend: 'Escalated', filter: 'SENT' },
        ];
    };

    const stats = calculateStats();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
            {stats.map((stat, i) => (
                <Panel 
                    key={i} 
                    {...stat} 
                    onClick={() => navigate('/contact_person/visit-requests', { state: { initialFilter: stat.filter } })}
                />
            ))}
        </div>
    );
};

export default MetricsGrid;
