import React, { useEffect, useState } from 'react';
import { Clock, CheckSquare, XCircle, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GetVisitRequestsByCP } from '../../../actions/VisitRequestAction';
import ContactPersonService from '../../../services/ContactPersonService';

const Panel = ({ label, value, color, hoverBorder, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={onClick}
      className="bg-white relative overflow-hidden flex flex-col justify-center items-center group cursor-pointer transition-all duration-500 py-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
      style={{ border: "1px solid #f0f0f0", borderRadius: "16px" }}
    >
      <div className="flex flex-col items-center justify-center space-y-3 relative z-10 w-full">
        <p className={`text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.15em] ${color}`}>
          {label}
        </p>
        <h3 className={`text-4xl sm:text-5xl font-black ${color}`}>
          {value}
        </h3>
      </div>
      <div className={`absolute bottom-0 left-0 h-[4px] w-0 ${hoverBorder} group-hover:w-full transition-all duration-700`}></div>
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
            { label: 'In Progress', value: pending.toString(), color: 'text-blue-500', hoverBorder: 'bg-blue-500', filter: 'P' },
            { label: 'Approved', value: accepted.toString(), color: 'text-green-500', hoverBorder: 'bg-green-500', filter: 'A' },
            { label: 'Rejected/Cancelled', value: rejected.toString(), color: 'text-red-500', hoverBorder: 'bg-red-500', filter: 'R' },
            { label: 'Sent to Admin', value: sent.toString(), color: 'text-orange-500', hoverBorder: 'bg-orange-500', filter: 'SENT' },
        ];
    };

    const stats = calculateStats();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 mt-2">
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
