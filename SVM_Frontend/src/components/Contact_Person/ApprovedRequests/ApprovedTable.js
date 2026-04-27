import { Clock, UserCheck, ArrowRight } from 'lucide-react';
import { useThemeMode } from '../../../theme/ThemeModeContext';

const ApprovedTable = ({ requests, onQuickView }) => {
    const { themeMode } = useThemeMode();
    const isLight = themeMode === "light";

    const getAdminStatusStyle = (status) => {
        if (status === 'Pending Dispatch') {
            return 'text-primary bg-primary/10 border-primary/20';
        }
        return 'text-green-500 bg-green-500/10 border-green-500/20';
    };

    return (
        <div className={`border rounded-3xl overflow-hidden shadow-xl sm:overflow-visible p-4 sm:p-0 transition-all duration-500 ${
            isLight ? "bg-white border-gray-200 shadow-gray-200/50" : "bg-black/40 border-white/10 shadow-black/50"
        }`}>
            
<div className="overflow-x-auto w-full max-w-full pb-4">
<table className="w-full text-left border-separate border-spacing-y-4 sm:border-spacing-y-0 sm:border-collapse min-w-0 sm:min-w-[700px] block sm:table">
                <thead className="hidden sm:table-header-group">
                    <tr className={`border-b text-[13px] font-bold uppercase tracking-[0.2em] transition-colors ${
                        isLight ? "bg-[#F8F9FA] border-gray-100 text-gray-400" : "bg-white/5 border-white/10 text-white/40"
                    }`}>
                        <th className="px-8 py-3 w-24">Request ID</th>
                        <th className="px-8 py-3">Visitor Name</th>
                        <th className="px-8 py-3 text-center">Visit Date</th>
                        <th className="px-8 py-3 text-center">Status</th>
                        <th className="px-8 py-3 text-right">Details</th>
                    </tr>
                </thead>
                <tbody className="block sm:table-row-group">
                    {requests.map((req) => (
                        <tr key={req.id} 
                            className={`group transition-all block sm:table-row border-b sm:border-none p-6 sm:p-0 ${
                                isLight 
                                    ? "bg-white hover:bg-[#F8F9FA]/50 border-gray-50" 
                                    : "bg-transparent hover:bg-white/5 border-white/5"
                            }`}
                        >
                            <td className={`block sm:table-cell px-2 sm:px-8 py-4 sm:py-5 border-b sm:border-none last:border-none ${isLight ? "border-gray-50" : "border-white/5"}`}>
                                <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Request ID</span>
                                <span className={`font-medium text-[13px] tracking-widest font-bold ${isLight ? "text-[#1A1A1A]" : "text-white"}`}>#{req.id}</span>
                            </td>
                             <td className={`block sm:table-cell px-2 sm:px-8 py-4 sm:py-5 border-b sm:border-none last:border-none uppercase tracking-wide ${isLight ? "border-gray-50" : "border-white/5"}`}>
                                <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Visitor Name</span>
                                <p className={`text-[13px] font-bold ${isLight ? "text-[#1A1A1A]" : "text-white"}`}>{req.name}</p>
                            </td>
                            <td className={`block sm:table-cell px-2 sm:px-8 py-4 sm:py-5 border-b sm:border-none last:border-none text-center ${isLight ? "border-gray-50" : "border-white/5"}`}>
                                <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Visit Date</span>
                                <div className="flex flex-col items-center justify-center gap-1">
                                    <div className={`text-[13px] font-bold ${isLight ? "text-[#1A1A1A]" : "text-white/80"}`}>
                                        {req.date}
                                    </div>
                                </div>
                            </td>
                            <td className={`block sm:table-cell px-2 sm:px-8 py-4 sm:py-5 text-left sm:text-center border-b sm:border-none last:border-none ${isLight ? "border-gray-50" : "border-white/5"}`}>
                                <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Status</span>
                                <div className={`inline-flex flex-col md:flex-row items-center gap-4 md:gap-2 px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-widest ${getAdminStatusStyle(req.adminStatus)}`}>
                                    {req.adminStatus}
                                </div>
                            </td>
                            <td className="block sm:table-cell px-2 sm:px-8 py-4 sm:py-5 text-left sm:text-right">
                                <span className="text-[13px] font-bold tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Details</span>
                                <button
                                    onClick={() => onQuickView(req)}
                                    className={`inline-flex flex-col md:flex-row items-center gap-4 md:gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors group ${isLight ? "text-gray-500 hover:text-primary" : "text-white/40 hover:text-primary"}`}
                                >
                                    View
                                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {requests.length === 0 && (
                        <tr>
                            <td colSpan="5" className="px-8 py-20 text-center text-gray-300 uppercase text-xs tracking-[0.3em] font-medium opacity-30">
                                NO APPROVED PROTOCOLS FOUND
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
</div>

        </div>
    );
};

export default ApprovedTable;
