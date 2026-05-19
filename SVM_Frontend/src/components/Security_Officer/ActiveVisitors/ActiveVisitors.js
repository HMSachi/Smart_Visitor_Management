import React, { useState, useEffect } from 'react';
import { Users, Clock, Search, ExternalLink, Shield, Activity, Zap, MapPin, Target, RefreshCw, Filter, MoreHorizontal, ChevronRight, Globe, AlertCircle, ChevronDown, ChevronUp, Car, Phone, Building, FileText, Calendar, LogIn, LogOut, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GatePassService from '../../../services/GatePassService';

const ActiveVisitorsMain = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [expandedVisitor, setExpandedVisitor] = useState(null);
    const [activeTab, setActiveTab] = useState('active'); // 'active' or 'left'
    const [visitorsList, setVisitorsList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(timer);
    }, []);

    const getTodayDateKey = () => new Date().toISOString().slice(0, 10);
    
    const getTodayScanHistory = (passId) => {
        const dateKey = getTodayDateKey();
        const raw = localStorage.getItem(`svm.scanLog.${passId}.${dateKey}`);
        return raw ? JSON.parse(raw) : [];
    };

    const fetchVisitors = async () => {
        setIsLoading(true);
        try {
            const response = await GatePassService.GetAllGatePasses();
            let allPasses = response.data || [];
            if (!Array.isArray(allPasses)) {
                allPasses = allPasses.ResultSet || [];
            }
            
            const todayKey = getTodayDateKey();
            const mapped = allPasses.map(pass => {
                const history = getTodayScanHistory(pass.VGP_Pass_id);
                let currentStatus = pass.VGP_Status || "Pending";
                let entryTime = pass.VGP_Issue_Date ? new Date(pass.VGP_Issue_Date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "N/A";
                let exitTime = "N/A";
                let remarks = "";
                
                if (history && history.length > 0) {
                    const lastScan = history[history.length - 1];
                    currentStatus = lastScan.type === "CHECK_IN" ? "IN" : "OUT";
                    
                    const checkInScan = history.find(h => h.type === "CHECK_IN");
                    if (checkInScan) {
                        entryTime = new Date(checkInScan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                    }
                    const checkOutScan = history.find(h => h.type === "CHECK_OUT");
                    if (checkOutScan) {
                        exitTime = new Date(checkOutScan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                        remarks = checkOutScan.remarks || "";
                    }
                }
                
                return {
                    id: pass.VGP_Pass_id,
                    name: pass.Visitor_Name || pass.VV_Name || "Unknown Visitor",
                    nic: pass.Visitor_NIC || pass.VV_NIC_Passport_NO || "N/A",
                    date: pass.VGP_Issue_Date ? pass.VGP_Issue_Date.slice(0, 10) : todayKey,
                    entryTime: entryTime,
                    exitTime: exitTime,
                    areas: pass.VGP_Visiting_Area ? [pass.VGP_Visiting_Area] : ["Main Premises"],
                    status: currentStatus === "IN" ? "Active" : currentStatus === "OUT" ? "Left" : "Pending",
                    ref: `SEC-${pass.VGP_Pass_id}`,
                    node: pass.VGP_Node || "GATE_01",
                    vehicle: pass.Visitor_Vehicle_No || pass.VV_Vehicle_No || "N/A (Walk-in)",
                    phone: pass.Visitor_Phone || pass.VV_Phone || "N/A",
                    company: pass.Visitor_Company || pass.VV_Company || "N/A",
                    purpose: pass.VVR_Purpose || pass.VVR_Visiting_Purpose || "N/A",
                    remarks: remarks
                };
            });

            // Filter down to only visitors who checked in/out today or are currently IN/OUT
            const relevant = mapped.filter(v => 
                v.status === "Active" || v.status === "Left"
            );

            setVisitorsList(relevant);
        } catch (err) {
            console.error("Error fetching gate passes:", err);
            setVisitorsList([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVisitors();
    }, []);

    const triggerSync = async () => {
        setIsSyncing(true);
        await fetchVisitors();
        setIsSyncing(false);
    };

    const toggleExpand = (id) => {
        setExpandedVisitor(expandedVisitor === id ? null : id);
    };

    const activeCount = visitorsList.filter(v => v.status === 'Active').length;
    const leftCount = visitorsList.filter(v => v.status === 'Left').length;

    const filteredVisitors = visitorsList.filter(v => {
        const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              v.ref.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === 'active' ? v.status === 'Active' : v.status === 'Left';
        return matchesSearch && matchesTab;
    });

    const getLatestEvent = () => {
        if (visitorsList.length === 0) return { val: 'N/A', detail: 'NO EVENTS TODAY' };
        
        // Find latest active visitor or left visitor
        const activeOnly = visitorsList.filter(v => v.status === 'Active');
        if (activeOnly.length > 0) {
            const latest = activeOnly[activeOnly.length - 1];
            return {
                val: `${latest.ref} | ${latest.name.split(' ')[0]}`,
                detail: `${latest.node} | ${latest.entryTime}`
            };
        }
        return { val: 'N/A', detail: 'NO ACTIVE VISITORS' };
    };
    
    const latestEvent = getLatestEvent();

    return (
        <div className="space-y-6 animate-fade-in-slow text-white">
            {/* ── Toolbar ── */}
            <header className="flex flex-col xl:flex-row justify-between items-center gap-6 relative z-10 px-1">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary shadow-xl backdrop-blur-md">
                        <Users size={22} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            {activeTab === 'active' ? 'Active On-Premises' : 'Departed Visitors'}
                        </h2>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
                                {activeTab === 'active' ? activeCount : leftCount} {(activeTab === 'active' ? activeCount : leftCount) === 1 ? 'Visitor' : 'Visitors'}
                            </span>
                            <span className="text-[10px] text-[var(--color-text-dim)] uppercase tracking-widest font-medium">
                                Registry Logs Today
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-center shrink-0 w-full xl:w-auto">
                    {/* Search Box - Rounded Style */}
                    <div className="relative w-full sm:w-80 group">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Search
                                size={14}
                                className="text-[var(--color-text-dim)] group-focus-within:text-primary transition-colors"
                            />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter visitors by name or ID..."
                            className="w-full bg-[var(--color-bg-paper)] border border-white/10 text-white text-[13px] rounded-full py-2 pl-9 pr-4 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-white/20 shadow-inner"
                        />
                    </div>

                    <button
                        onClick={triggerSync}
                        disabled={isSyncing}
                        className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 h-10 rounded-full text-[12px] font-bold uppercase tracking-[0.1em] transition-all shadow-[0_8px_20px_-4px_rgba(255,107,0,0.4)] active:scale-95 group shrink-0 cursor-pointer"
                    >
                        <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
                        Sync Registry
                    </button>
                    
                    <div className="hidden lg:flex flex-col text-right pl-4 border-l border-white/5 shrink-0">
                        <p className="text-gray-300/60 text-[11px] font-normal uppercase tracking-widest leading-none mb-1">Sync Time</p>
                        <p className="text-white text-xs font-mono font-medium tracking-wider">{currentTime}</p>
                    </div>
                </div>
            </header>

            {/* Tabs Selector */}
            <div className="flex gap-4 border-b border-white/5 pb-2">
                <button
                    onClick={() => setActiveTab('active')}
                    className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 border cursor-pointer ${
                        activeTab === 'active'
                            ? 'bg-green-500/10 border-green-500/30 text-green-400'
                            : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    On Premises ({activeCount})
                </button>
                <button
                    onClick={() => setActiveTab('left')}
                    className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 border cursor-pointer ${
                        activeTab === 'left'
                            ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                            : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                    Left Premises ({leftCount})
                </button>
            </div>

            {/* Personnel Table Matrix */}
            <div className="bg-[var(--color-bg-paper)] border border-white/5 rounded-[5px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                <div className="overflow-x-auto w-full max-w-full pb-4">
                    {isLoading ? (
                        <div className="p-20 text-center space-y-4">
                            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
                            <p className="text-[11px] text-[var(--color-text-dim)] uppercase tracking-widest font-bold">Synchronizing registry...</p>
                        </div>
                    ) : filteredVisitors.length === 0 ? (
                        <div className="p-20 text-center space-y-4">
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-gray-500">
                                <Users size={24} />
                            </div>
                            <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">No Visitors Listed</p>
                            <p className="text-[11px] text-gray-500 max-w-xs mx-auto leading-relaxed">No personnel match this security monitoring protocol at this time.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-inherit">
                                    <th className="px-6 py-4 uppercase text-[var(--color-text-secondary)] border-b border-white/5 font-normal tracking-[0.3em] text-[12px] whitespace-nowrap">Visitor Information</th>
                                    <th className="px-6 py-4 uppercase text-[var(--color-text-secondary)] border-b border-white/5 font-normal tracking-[0.3em] text-[12px] whitespace-nowrap">Time Log</th>
                                    <th className="px-6 py-4 uppercase text-[var(--color-text-secondary)] border-b border-white/5 font-normal tracking-[0.3em] text-[12px] whitespace-nowrap">Visiting Area</th>
                                    <th className="px-6 py-4 uppercase text-[var(--color-text-secondary)] border-b border-white/5 font-normal tracking-[0.3em] text-[12px] text-center whitespace-nowrap">Status</th>
                                    <th className="px-6 py-4 uppercase text-primary border-b border-white/5 font-normal tracking-[0.3em] text-[12px] text-right whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                <AnimatePresence mode='popLayout'>
                                    {filteredVisitors.map((v) => (
                                        <React.Fragment key={v.id}>
                                            <motion.tr
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.01)' }}
                                                className={`group transition-all cursor-pointer ${expandedVisitor === v.id ? 'bg-white/[0.02]' : ''}`}
                                                onClick={() => toggleExpand(v.id)}
                                            >
                                                <td className="px-6 py-4 align-middle">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative overflow-visible">
                                                            <div className="w-8 h-8 rounded-lg bg-[#0D0D0E] border border-white/10 flex items-center justify-center text-primary text-[12px] font-normal group-hover:border-primary transition-all duration-300">
                                                                {v.name.split(' ').map(n => n[0]).join('')}
                                                            </div>
                                                            <div className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-[#0D0D0E] ${
                                                                v.status === 'Active' ? 'bg-green-500' : 'bg-orange-500'
                                                            }`}></div>
                                                        </div>
                                                        <div>
                                                            <p className="text-[13px] font-medium text-white tracking-wide group-hover:text-primary transition-colors duration-300">{v.name}</p>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <Target size={10} className="text-primary opacity-90" />
                                                                <p className="text-[var(--color-text-dim)] text-[10px] font-normal tracking-widest uppercase">{v.ref}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 align-middle">
                                                    <div className="space-y-0.5">
                                                        <div className="flex items-center gap-1.5 text-[12px]">
                                                            <LogIn size={12} className="text-green-500 opacity-70 shrink-0" />
                                                            <span className="text-white font-normal tracking-widest">IN: {v.entryTime}</span>
                                                        </div>
                                                        {v.status === 'Left' && (
                                                            <div className="flex items-center gap-1.5 text-[12px]">
                                                                <LogOut size={12} className="text-orange-500 opacity-70 shrink-0" />
                                                                <span className="text-orange-400 font-normal tracking-widest">OUT: {v.exitTime}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 align-middle text-[12px]">
                                                    <div className="flex flex-wrap gap-1.5 max-w-[280px]">
                                                        {v.areas.map((area, i) => (
                                                            <span key={i} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300 text-[10px] font-normal uppercase tracking-widest group-hover:border-primary/40 group-hover:text-white transition-all duration-300">
                                                                {area}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 align-middle text-center text-[12px]">
                                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 border rounded-md uppercase text-[10px] font-normal tracking-wider bg-white/[0.02]">
                                                        {v.status === 'Active' ? (
                                                            <>
                                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div>
                                                                <span className="text-green-500">Active On-Premise</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full shadow-[0_0_8px_#f97316]"></div>
                                                                <span className="text-orange-400">Departed</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 align-middle text-right text-[12px]">
                                                    <button onClick={(e) => { e.stopPropagation(); toggleExpand(v.id); }} className={`p-2 mas-glass border-white/5 text-white/70 hover:text-white hover:border-primary/40 transition-all rounded-lg shadow-lg cursor-pointer ${expandedVisitor === v.id ? 'bg-primary border-primary text-white' : 'hover:bg-primary/5'}`}>
                                                        {expandedVisitor === v.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                                    </button>
                                                </td>
                                            </motion.tr>
                                            {expandedVisitor === v.id && (
                                                <motion.tr
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="bg-[var(--color-bg-default)] border-b border-white/5"
                                                >
                                                    <td colSpan="5" className="px-0 py-0 font-normal text-[12px]">
                                                        <div className="p-6 pl-24 bg-gradient-to-br from-[var(--color-bg-default)] to-[#0E0E10] shadow-inner relative overflow-hidden">
                                                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
                                                            <div className="w-1 h-12 bg-primary rounded-full absolute left-10 top-6"></div>
 
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                                                                <div className="space-y-1">
                                                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                                                        <Car size={12} className="text-primary" />
                                                                        <span className="text-[11px] font-normal uppercase tracking-wider">Vehicle Number</span>
                                                                    </div>
                                                                    <p className="text-white text-[12px] font-normal tracking-wide">{v.vehicle}</p>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                                                        <Phone size={12} className="text-primary" />
                                                                        <span className="text-[11px] font-normal uppercase tracking-wider">Phone Number</span>
                                                                    </div>
                                                                    <p className="text-white text-[12px] tracking-wide">{v.phone}</p>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                                                        <Building size={12} className="text-primary" />
                                                                        <span className="text-[11px] font-normal uppercase tracking-wider">Company / Organization</span>
                                                                    </div>
                                                                    <p className="text-white text-[12px] font-normal tracking-wide">{v.company}</p>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                                                        <FileText size={12} className="text-primary" />
                                                                        <span className="text-[11px] font-normal uppercase tracking-wider">Visiting Purpose</span>
                                                                    </div>
                                                                    <p className="text-white text-[12px] font-normal tracking-wide">{v.purpose}</p>
                                                                </div>
 
                                                                {v.remarks && (
                                                                    <div className="col-span-1 md:col-span-2 lg:col-span-4 p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 space-y-1.5 mt-2">
                                                                        <div className="flex items-center gap-2 text-orange-400">
                                                                            <MessageSquare size={12} />
                                                                            <span className="text-[11px] font-normal uppercase tracking-wider">Checkout Remarks</span>
                                                                        </div>
                                                                        <p className="text-white text-[12px] font-normal tracking-wide italic">"{v.remarks}"</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
 
            {/* Standard Analytics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Latest Gate Scan', val: latestEvent.val, detail: latestEvent.detail, icon: Zap, color: 'mas-red' },
                    { label: 'Personnel Distribution', val: `${activeCount} On-Premise | ${leftCount} Departed`, detail: `${activeCount + leftCount} TOTAL VISITORS TODAY`, icon: Shield, color: 'white' },
                    { label: 'Database Status', val: 'Connected', detail: 'System Sync: 100%', icon: RefreshCw, color: 'white' },
                    { label: 'Security Level', val: 'Enforced', detail: 'Secure Core Active', icon: Globe, color: 'mas-red' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -4 }}
                        className="p-6 mas-glass border-white/5 bg-[var(--color-bg-paper)]/40 rounded-[5px] space-y-4 group hover:border-primary/20 transition-all duration-300"
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-[var(--color-text-dim)] text-[11px] font-normal uppercase tracking-wider">{stat.label}</p>
                            <stat.icon size={14} className={stat.color === 'mas-red' ? 'text-primary' : 'text-gray-400'} />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-white text-[13px] font-semibold uppercase tracking-wider">{stat.val}</p>
                            <p className="text-[var(--color-text-dim)] text-[10px] font-normal uppercase tracking-wider">{stat.detail}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ActiveVisitorsMain;
