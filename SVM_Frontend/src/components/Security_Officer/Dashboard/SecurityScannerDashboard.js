import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { BrowserMultiFormatReader } from "@zxing/browser";
import visitLogService from "../../../services/VisitLogService";
import { isSecureQrPayload, decodeSecureQrPayload } from "../../../utils/secureQrPayload";
import { 
  Users, 
  LogOut, 
  FileText, 
  Clock, 
  RefreshCw, 
  CheckCircle2, 
  XCircle,
  Scan
} from "lucide-react";

const SecurityScannerDashboard = () => {
  const [visitorsInside, setVisitorsInside] = useState([]);
  const [totalLogs, setTotalLogs] = useState([]);
  const [stats, setStats] = useState({
    insideNow: 0,
    checkedOut: 0,
    totalLogs: 0,
    latestLog: "None",
    lastSync: new Date().toLocaleTimeString()
  });

  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const videoRef = useRef(null);
  const codeReaderRef = useRef(new BrowserMultiFormatReader());
  const controlsRef = useRef(null);

  const loadData = async () => {
    try {
      const [insideRes, allLogsRes] = await Promise.all([
        visitLogService.GetVisitorsInside(),
        visitLogService.GetAllVisitLogs()
      ]);

      const insideData = insideRes?.data || [];
      const allLogsData = allLogsRes?.data || [];
      
      setVisitorsInside(insideData);
      setTotalLogs(allLogsData);

      const checkedOutList = allLogsData.filter(log => log.VVL_Check_Out_Time);
      const latest = allLogsData.length > 0 
        ? allLogsData[allLogsData.length - 1].VVL_Accessed_Areas || "Latest Scan" 
        : "None";

      setStats({
        insideNow: insideData.length,
        checkedOut: checkedOutList.length,
        totalLogs: allLogsData.length,
        latestLog: latest,
        lastSync: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError("Failed to load dashboard data.");
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData();
    }, 30000); // Auto refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const startScanner = async () => {
    try {
      setIsScanning(true);
      setError(null);
      setScanResult(null);
      setSuccessMsg(null);
      
      const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
      const selectedDeviceId = videoInputDevices.length > 0 ? videoInputDevices[0].deviceId : undefined;
      
      if (!selectedDeviceId) {
        throw new Error("No video input devices found.");
      }

      controlsRef.current = await codeReaderRef.current.decodeFromVideoDevice(
        selectedDeviceId, 
        videoRef.current, 
        (result, err) => {
          if (result) {
            handleScanSuccess(result.getText());
          }
          if (err && err.name !== "NotFoundException") {
            console.error(err);
          }
        }
      );
    } catch (err) {
      console.error(err);
      setError("Camera initialization failed. Please check permissions.");
      setIsScanning(false);
    }
  };

  const stopScanner = () => {
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }
    setIsScanning(false);
  };

  const handleScanSuccess = async (text) => {
    stopScanner();
    setScanResult(text);
    
    let passId = text;
    try {
      if (isSecureQrPayload(text)) {
        const decoded = await decodeSecureQrPayload(text);
        passId = decoded.id;
      } else if (text.startsWith("{")) {
        // Handle JSON payload like {"type":"token","token":"123"}
        const parsed = JSON.parse(text);
        passId = parsed.token || parsed.id || text;
      }
    } catch (e) {
      console.warn("Failed to parse QR code as secure payload or JSON, using raw text", e);
    }

    try {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      const expiry = today.toISOString().split('.')[0];
      
      await visitLogService.AddVisitLog(passId, "General Entry", expiry);
      setSuccessMsg(`Check-in successful for Pass ID: ${passId}`);
      loadData(); // refresh
    } catch (err) {
      console.error("Check-in failed:", err);
      setError("Failed to process check-in for the scanned code.");
    }
  };

  const handleManualCheckOut = async (visit) => {
    try {
      const outTime = new Date().toISOString().split('.')[0];
      await visitLogService.UpdateVisitLog(
        visit.VVL_Visit_id,
        visit.VVL_Pass_id,
        visit.VVL_Accessed_Areas,
        outTime
      );
      setSuccessMsg(`Check-out successful for Pass ID: ${visit.VVL_Pass_id}`);
      loadData();
    } catch (err) {
      console.error("Check-out failed:", err);
      setError("Failed to process check-out.");
    }
  };

  const calculateDuration = (inTime) => {
    if (!inTime) return "Unknown";
    const start = new Date(inTime);
    const now = new Date();
    const diffMs = now - start;
    if (diffMs < 0) return "Just now";
    
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security Dashboard</h1>
          <p className="text-sm text-gray-500">Check visitors in and out easily</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
          <button onClick={loadData} className="flex items-center gap-2 hover:text-primary transition-colors">
            <RefreshCw size={14} className="text-primary" />
            <span className="font-medium">Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users} title="Inside Now" value={stats.insideNow} color="bg-blue-50 text-blue-600" />
        <StatCard icon={LogOut} title="Checked Out" value={stats.checkedOut} color="bg-green-50 text-green-600" />
        <StatCard icon={FileText} title="Total Logs" value={stats.totalLogs} color="bg-purple-50 text-purple-600" />
        <StatCard icon={Scan} title="Latest Log" value={stats.latestLog} color="bg-orange-50 text-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Scanner Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Scan size={20} className="text-primary" />
                QR Scanner
              </h2>
            </div>
            
            <div className="p-4 flex-1 flex flex-col items-center justify-center">
              <div className="relative w-full aspect-square bg-gray-900 rounded-xl overflow-hidden mb-4 flex items-center justify-center">
                <video 
                  ref={videoRef} 
                  className={`w-full h-full object-cover ${!isScanning ? 'hidden' : ''}`}
                />
                {!isScanning && (
                  <div className="text-gray-500 flex flex-col items-center">
                    <Scan size={48} className="mb-2 opacity-50" />
                    <span>Camera is turned off</span>
                  </div>
                )}
              </div>
              
              {!isScanning ? (
                <button 
                  onClick={startScanner}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-xl transition-colors"
                >
                  Start Scanning
                </button>
              ) : (
                <button 
                  onClick={stopScanner}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-xl transition-colors"
                >
                  Stop Scanning
                </button>
              )}

              {/* Messages */}
              {error && (
                <div className="mt-4 w-full p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-start gap-2">
                  <XCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              {successMsg && (
                <div className="mt-4 w-full p-3 bg-green-50 text-green-700 text-sm rounded-lg flex items-start gap-2">
                  <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active Visitors List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Users size={20} className="text-primary" />
                People Inside Now
              </h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {visitorsInside.length} active
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
              {visitorsInside.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 p-8">
                  <Users size={48} className="mb-4 opacity-20" />
                  <p>No active visitors inside.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {visitorsInside.map((visit) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={visit.VVL_Visit_id} 
                      className="bg-gray-50 hover:bg-gray-100 transition-colors p-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Pass ID: {visit.VVL_Pass_id}</span>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                            <Clock size={14} className="text-blue-500" />
                            <span className="font-medium text-gray-700">In:</span> {new Date(visit.VVL_Created_Date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                            <RefreshCw size={14} className="text-orange-500" />
                            <span className="font-medium text-gray-700">Time spent:</span> {calculateDuration(visit.VVL_Created_Date)}
                          </span>
                          <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                            <FileText size={14} className="text-green-500" />
                            <span className="font-medium text-gray-700">Area:</span> {visit.VVL_Accessed_Areas || "N/A"}
                          </span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleManualCheckOut(visit)}
                        className="w-full sm:w-auto bg-white border border-gray-200 hover:border-red-300 hover:bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Check Out
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityScannerDashboard;
