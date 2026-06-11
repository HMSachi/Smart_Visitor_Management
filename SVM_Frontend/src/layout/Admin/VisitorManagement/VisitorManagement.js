import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  GetAllVisitors,
  GetVisitorById,
  ToggleVisitorStatus,
} from "../../../actions/VisitorAction";
import Header from "../../../components/Admin/Layout/Header";
import {
  Search,
  RefreshCw,
  AlertCircle,
  Users,
  Hash,
} from "lucide-react";
import PageSpinner from "../../../components/common/PageSpinner";

const VisitorManagement = () => {
  const dispatch = useDispatch();
  const { visitors, isLoading, error } = useSelector(
    (state) => state.visitorManagement,
  );

  const [searchId, setSearchId] = useState("");

  useEffect(() => {
    const fetchData = () => {
      dispatch(GetAllVisitors());
    };

    fetchData();

    // Polling: Refresh visitor registry every 30 seconds
    const intervalId = setInterval(fetchData, 30000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchId.trim() !== "") {
      dispatch(GetVisitorById(searchId));
    } else {
      dispatch(GetAllVisitors());
    }
  };

  const handleToggleStatus = (visitor) => {
    const statusValue = (visitor.VV_Status || "")
      .toString()
      .trim()
      .toUpperCase();
    const isActive = statusValue === "ACTIVE" || statusValue === "A";

    const newStatus = isActive ? "I" : "A";
    dispatch(ToggleVisitorStatus(visitor.VV_Visitor_id, newStatus));
  };

  return (
    <div className="flex flex-col min-w-0 bg-[var(--color-bg-default)] min-h-screen">
      <Header title="Visitor Database" />

      <div className="flex-1 p-3 sm:p-4 md:p-8 overflow-y-auto w-full animate-fade-in-slow relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        <div className="max-w-none mx-auto">
          {/* Enhanced Toolbar Header */}
          <header className="mb-6 flex flex-col xl:flex-row justify-between items-center gap-6 relative z-10 px-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary shadow-xl backdrop-blur-md">
                <Users size={22} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Visitor Registry
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
                    {visitors?.length || 0} Records
                  </span>
                  <span className="text-[10px] text-[var(--color-text-dim)] uppercase tracking-widest font-medium">
                    Global Visitor Log
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-center shrink-0 w-full xl:w-auto">
              {/* Search Box - Rounded Style */}
              <form onSubmit={handleSearch} className="relative w-full sm:w-80 group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search
                    size={14}
                    className="text-[var(--color-text-dim)] group-focus-within:text-primary transition-colors"
                  />
                </div>
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="ID, Name or Credential..."
                  className="w-full bg-[var(--color-bg-paper)] border border-white/10 text-white text-[13px] rounded-full py-2 pl-9 pr-10 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-white/20 shadow-inner"
                />
                {searchId && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchId("");
                      dispatch(GetAllVisitors());
                    }}
                    className="absolute inset-y-0 right-3 flex items-center text-[var(--color-text-dim)] hover:text-white transition-colors"
                  >
                    <RefreshCw size={14} className="animate-spin-slow" />
                  </button>
                )}
              </form>
            </div>
          </header>

          <div className="bg-[var(--color-bg-paper)] border border-white/5 rounded-[5px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            {isLoading ? (
              <div className="p-20 flex flex-col items-center justify-center text-center">
                <PageSpinner size={40} color="var(--color-primary)" />
              </div>
            ) : error ? (
              <div className="p-20 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20 text-primary">
                  <AlertCircle size={24} />
                </div>
                <p className="text-primary text-[12px] font-bold uppercase tracking-widest leading-relaxed">
                  System Sync Error:<br/>{error}
                </p>
              </div>
            ) : (
              <TableContainer
                component={Paper}
                className="bg-transparent border-none z-10 relative"
                sx={{
                  maxHeight: "600px",
                  minHeight: "400px",
                  overflow: "auto",
                }}
              >
                <Table stickyHeader aria-label="visitors table">
                  <TableHead>
                    <TableRow
                      sx={{
                        height: "24px",
                        backgroundColor: "var(--color-bg-paper)",
                      }}
                    >
                      <TableCell
                        sx={{
                          padding: "8px 24px",
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                          width: "8%",
                        }}
                        className="text-[var(--color-text-secondary)] font-normal text-[12px] tracking-[0.3em] uppercase whitespace-nowrap bg-[var(--color-bg-paper)]"
                      >
                        ID
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "8px 24px",
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                        }}
                        className="text-[var(--color-text-secondary)] font-normal text-[12px] tracking-[0.3em] uppercase whitespace-nowrap bg-[var(--color-bg-paper)]"
                      >
                        Visitor Identity
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "8px 24px",
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                        }}
                        className="text-[var(--color-text-secondary)] font-normal text-[12px] tracking-[0.3em] uppercase whitespace-nowrap bg-[var(--color-bg-paper)]"
                      >
                        Credentials
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "8px 24px",
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                        }}
                        className="text-[var(--color-text-secondary)] font-normal text-[12px] tracking-[0.3em] uppercase whitespace-nowrap bg-[var(--color-bg-paper)]"
                      >
                        Organization
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "8px 24px",
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                          width: "20%",
                        }}
                        className="text-[var(--color-text-secondary)] font-normal text-[12px] tracking-[0.3em] uppercase whitespace-nowrap bg-[var(--color-bg-paper)]"
                      >
                        Destination
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          padding: "8px 24px",
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                          width: "12%",
                        }}
                        className="text-primary font-normal text-[12px] tracking-[0.3em] uppercase whitespace-nowrap bg-[var(--color-bg-paper)]"
                      >
                        Status
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="divide-y divide-white/[0.04]">
                    {visitors && visitors.length > 0 ? (
                      [...visitors]
                        .sort(
                          (a, b) =>
                            (b.VV_Visitor_id || 0) - (a.VV_Visitor_id || 0),
                        )
                        .map((visitor) => {
                        const isActive =
                          (visitor.VV_Status || "")
                            .toString()
                            .trim()
                            .toUpperCase() === "A" ||
                          (visitor.VV_Status || "")
                            .toString()
                            .trim()
                            .toUpperCase() === "ACTIVE";
                        return (
                          <TableRow
                            key={visitor.VV_Visitor_id}
                            sx={{
                              "&:hover": {
                                backgroundColor: "rgba(255,255,255,0.02)",
                              },
                              height: "28px",
                              transition: "all 0.2s ease",
                            }}
                          >
                            <TableCell
                              sx={{
                                padding: "8px 24px",
                                borderBottom: "none",
                              }}
                              className="text-white align-middle font-normal text-[12px]"
                            >
                              <div className="flex items-center gap-1">
                                <Hash size={10} className="text-primary/40" />
                                <span>{visitor.VV_Visitor_id}</span>
                              </div>
                            </TableCell>
                            <TableCell
                              sx={{
                                padding: "8px 24px",
                                borderBottom: "none",
                              }}
                              className={`font-normal align-middle transition-colors text-[12px] ${
                                isActive ? "text-white" : "text-white/40 line-through"
                              }`}
                            >
                              {visitor.VV_Name || "-"}
                            </TableCell>
                            <TableCell
                              sx={{
                                padding: "8px 24px",
                                borderBottom: "none",
                              }}
                              className={`font-normal align-middle transition-colors text-[12px] ${
                                isActive ? "text-white/70" : "text-white/20"
                              }`}
                            >
                              {visitor.VV_NIC_Passport_NO || "-"}
                            </TableCell>
                            <TableCell
                              sx={{
                                padding: "8px 24px",
                                borderBottom: "none",
                              }}
                              className={`font-normal align-middle transition-colors text-[12px] ${
                                isActive ? "text-white/70" : "text-white/20"
                              }`}
                            >
                              {visitor.VV_Company || "-"}
                            </TableCell>
                            <TableCell
                              sx={{
                                padding: "8px 24px",
                                borderBottom: "none",
                              }}
                              className={`font-normal align-middle transition-colors text-[12px] ${
                                isActive ? "text-white/70" : "text-white/20"
                              }`}
                            >
                              {visitor.VV_Visiting_places || "-"}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{
                                padding: "8px 24px",
                                borderBottom: "none",
                              }}
                            >
                              <button
                                onClick={() => handleToggleStatus(visitor)}
                                disabled={isLoading}
                                className={`svm-status-pill transition-colors cursor-pointer ${
                                  isActive
                                    ? "svm-status-pill--success hover:bg-green-500/20"
                                    : "svm-status-pill--danger hover:bg-primary/20"
                                }`}
                              >
                                {isActive ? "ACTIVE" : "INACTIVE"}
                              </button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          align="center"
                          className="py-12 text-[var(--color-text-dim)] uppercase tracking-widest text-[12px]"
                        >
                          No visitor records detected
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorManagement;
