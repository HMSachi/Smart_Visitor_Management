import { Octagon,  ArrowRight } from 'lucide-react';
import { useThemeMode } from '../../../theme/ThemeModeContext';

const RejectionTable = ({ requests, onSelect }) => {
    const { themeMode } = useThemeMode();
    const isLight = themeMode === "light";

    return (
        <div className={`border rounded-3xl overflow-hidden shadow-xl sm:overflow-visible p-4 sm:p-0 transition-all duration-500 ${
            isLight ? "bg-white border-gray-200 shadow-gray-200/50" : "bg-black/40 border-white/10 shadow-black/50"
        }`}>
            
<div className="overflow-x-auto w-full max-w-full pb-4">
<table className="w-full text-left border-separate border-spacing-y-4 sm:border-spacing-y-0 sm:border-collapse min-w-0 sm:min-w-[700px] block sm:table">
                <thead className="hidden sm:table-header-group font-normal text-[12px]">
                    <tr className={`border-b text-[12px] font-normal uppercase tracking-[0.3em] transition-colors ${
                        isLight ? "bg-[#F8F9FA] border-gray-100 text-gray-400" : "bg-white/5 border-white/10 text-white/40"
                    }`}>
                        <th className="px-8 py-2 font-normal text-[12px]">ID</th>
                        <th className="px-8 py-2 font-normal text-[12px]">Visitor</th>
                        <th className="px-8 py-2 text-center font-normal text-[12px]">Date</th>
                        <th className="px-8 py-2 text-left font-normal text-[12px]">Reason</th>
                        <th className="px-8 py-2 text-right font-normal text-[12px]">Details</th>
                    </tr>
                </thead>
                <tbody className="block sm:table-row-group">
                    {requests.map((req) => (
                        <tr key={req.id} 
                            onClick={() => onSelect(req)}
                            className={`group transition-all block sm:table-row border-b sm:border-none p-6 sm:p-0 cursor-pointer ${
                                isLight 
                                    ? "bg-white hover:bg-[#F8F9FA]/50 border-gray-50" 
                                    : "bg-transparent hover:bg-white/5 border-white/5"
                            }`} 
                        >
                            <td className={`block sm:table-cell px-2 sm:px-8 py-1 border-b sm:border-none last:border-none ${isLight ? "border-gray-50" : "border-white/5"}`}>
                                <span className="text-[12px] font-normal tracking-[0.3em] text-primary/60 uppercase block sm:hidden mb-3 text-left">ID</span>
                                <span className={`font-normal text-[12px] tracking-wide ${isLight ? "text-[#1A1A1A]" : "text-white"}`}>#{req.id}</span>
                            </td>
                            <td className={`block sm:table-cell px-2 sm:px-8 py-1 border-b sm:border-none last:border-none ${isLight ? "border-gray-50" : "border-white/5"}`}>
                                <span className="text-[12px] font-normal tracking-[0.3em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Visitor</span>
                                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20 text-[12px] font-normal">
                                        {req.name[0]}
                                    </div>
                                    <span className={`uppercase font-normal text-[12px] ${isLight ? "text-[#1A1A1A]" : "text-white"}`}>{req.name}</span>
                                </div>
                            </td>
                            <td className={`block sm:table-cell px-2 sm:px-8 py-1 border-b sm:border-none last:border-none text-center ${isLight ? "border-gray-50" : "border-white/5"}`}>
                                <span className="text-[12px] font-normal tracking-[0.3em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Date</span>
                                <span className={`uppercase text-[12px] font-normal ${isLight ? "text-gray-600" : "text-white/60"}`}>{req.date}</span>
                            </td>
                            <td className={`block sm:table-cell px-2 sm:px-8 py-1 border-b sm:border-none last:border-none text-left ${isLight ? "border-gray-50" : "border-white/5"}`}>
                                <span className="text-[12px] font-normal tracking-[0.3em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Reason</span>
                                <div className="inline-flex flex-col md:flex-row items-center gap-4 md:gap-2 px-2 py-0.5 rounded-md border border-primary/20 bg-primary/10 text-primary uppercase text-[9px] font-normal tracking-widest break-words">
                                    <Octagon size={10} />
                                    {req.reason}
                                </div>
                            </td>
                            <td className="block sm:table-cell px-2 sm:px-8 py-1 text-left sm:text-right font-normal text-[12px]">
                                <span className="text-[12px] font-normal tracking-[0.2em] text-primary/60 uppercase block sm:hidden mb-3 text-left">Details</span>
                                <button className={`inline-flex flex-col md:flex-row items-center gap-4 md:gap-2 text-[10px] font-normal tracking-[0.2em] uppercase transition-colors group/btn ${isLight ? "text-gray-500 hover:text-primary" : "text-white/40 hover:text-primary"}`}>
                                    VIEW
                                    <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
</div>

        </div>
    );
};

export default RejectionTable;
