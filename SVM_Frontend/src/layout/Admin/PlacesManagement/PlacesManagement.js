import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Snackbar, Alert, CircularProgress,
} from "@mui/material";
import { MapPin, Plus, Edit, ToggleLeft, ToggleRight, Search, Hash } from "lucide-react";
import Header from "../../../components/Admin/Layout/Header";
import { useThemeMode } from "../../../theme/ThemeModeContext";
import { AddPlace, GetAllPlaces, UpdatePlace, UpdatePlaceStatus } from "../../../actions/PlacesAction";

const PlacesManagement = () => {
  const [placeName, setPlaceName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [editPlaceName, setEditPlaceName] = useState("");

  const user = useSelector((state) => state.login.user);
  const { places, loading } = useSelector((state) => state.placesState);
  const dispatch = useDispatch();
  const { themeMode } = useThemeMode();
  const isLight = themeMode === "light";

  useEffect(() => { dispatch(GetAllPlaces()); }, [dispatch]);

  const filteredPlaces = (places || []).filter((p) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    const name = (p.VAIL_Item_Name || p.Item_Name || "").toLowerCase();
    const id = String(p.VAIL_Item_List_ID || p.Item_List_ID || "");
    return name.includes(q) || id.includes(q);
  });

  const notify = (message, severity = "success") => setNotification({ open: true, message, severity });

  const handleAddPlace = async (e) => {
    e.preventDefault();
    if (!placeName.trim()) { notify("Please enter a place name", "error"); return; }
    try {
      setIsSubmitting(true);
      const adminId = user?.ResultSet?.[0]?.VA_Admin_id || 3;
      const pUid = user?.ResultSet?.[0]?.P_UID || "admin";
      await dispatch(AddPlace({ VA_Admin_id: adminId, VAIL_Item_Name: placeName, P_UID: pUid }));
      notify("Place added successfully");
      setPlaceName("");
    } catch (error) {
      notify("Failed to add place", "error");
    } finally { setIsSubmitting(false); }
  };

  const handleOpenEdit = (place) => {
    setSelectedPlace(place);
    setEditPlaceName(place.VAIL_Item_Name || place.Item_Name || "");
    setEditModalOpen(true);
  };

  const handleUpdatePlace = async () => {
    if (!editPlaceName.trim()) { notify("Please enter a valid place name", "error"); return; }
    try {
      setIsSubmitting(true);
      const pUid = user?.ResultSet?.[0]?.P_UID || "admin";
      const placeId = selectedPlace.VAIL_Item_List_ID || selectedPlace.Item_List_ID || selectedPlace.Id;
      await dispatch(UpdatePlace({ VAIL_Item_List_ID: placeId, VAIL_Item_Name: editPlaceName, P_UID: pUid }));
      notify("Place updated successfully");
      setEditModalOpen(false);
      setSelectedPlace(null);
      setEditPlaceName("");
    } catch (error) {
      notify("Failed to update place", "error");
    } finally { setIsSubmitting(false); }
  };

  const handleToggleStatus = async (place) => {
    try {
      setIsSubmitting(true);
      const placeId = place.VAIL_Item_List_ID || place.Item_List_ID || place.Id;
      const currentStatus = (place.VAIL_Status || place.Status || "A").toString().trim().toUpperCase();
      const newStatus = currentStatus === "A" ? "I" : "A";
      const pUid = user?.ResultSet?.[0]?.P_UID || "admin";
      await dispatch(UpdatePlaceStatus(placeId, newStatus, pUid));
      notify(`Place ${newStatus === "A" ? "activated" : "deactivated"} successfully`);
    } catch (error) {
      notify("Failed to update status", "error");
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="flex flex-col min-w-0 bg-[var(--color-bg-default)] min-h-screen">
      <Header title="Places Management" />

      <div className="flex-1 p-3 sm:p-4 md:p-8 overflow-y-auto w-full animate-fade-in-slow relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        <div className="max-w-none mx-auto">
          {/* Toolbar */}
          <header className="mb-6 flex flex-col xl:flex-row justify-between items-center gap-6 relative z-10 px-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary shadow-xl backdrop-blur-md">
                <MapPin size={22} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Facility Locations
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
                    {filteredPlaces.length} {filteredPlaces.length === 1 ? "Place" : "Places"}
                  </span>
                  <span className="text-[10px] text-[var(--color-text-dim)] uppercase tracking-widest font-medium">
                    Management Portal
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-center shrink-0 w-full xl:w-auto">
              {/* Search Box - Rounded Style */}
              <div className="relative w-full sm:w-64 group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search
                    size={14}
                    className="text-[var(--color-text-dim)] group-focus-within:text-primary transition-colors"
                  />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter locations..."
                  className="w-full bg-[var(--color-bg-paper)] border border-[var(--color-border-soft)] text-[var(--color-text-primary)] text-[13px] rounded-full py-2 pl-9 pr-4 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-[var(--color-text-dim)]"
                />
              </div>

              {/* Add Form Inline */}
              <form
                onSubmit={handleAddPlace}
                className="flex gap-2 w-full sm:w-auto p-1.5 bg-[var(--color-surface-1)] border border-[var(--color-border-soft)] rounded-[12px] backdrop-blur-md"
              >
                <input
                  type="text"
                  value={placeName}
                  onChange={(e) => setPlaceName(e.target.value)}
                  placeholder="Add new facility..."
                  disabled={isSubmitting}
                  className="bg-transparent text-[13px] text-[var(--color-text-primary)] focus:outline-none px-3 w-full sm:w-[200px] placeholder:text-[var(--color-text-dim)]"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !placeName.trim()}
                  className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 h-8 rounded-[8px] text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                  <Plus size={14} />
                  {isSubmitting ? "..." : "Add"}
                </button>
              </form>
            </div>
          </header>

          {/* Table Container */}
          <div className="bg-[var(--color-bg-paper)] border border-white/5 rounded-[5px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            {loading ? (
              <div className="p-20 flex flex-col items-center justify-center">
                <CircularProgress size={24} className="text-primary mb-4" />
                <p className="text-[var(--color-text-dim)] text-[12px] uppercase tracking-[0.3em]">
                  Syncing data...
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
                <Table stickyHeader aria-label="places table">
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
                          width: "15%",
                        }}
                        className="text-[var(--color-text-secondary)] font-normal text-[12px] tracking-[0.3em] uppercase whitespace-nowrap bg-inherit"
                      >
                        Location ID
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "8px 24px",
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                        }}
                        className="text-[var(--color-text-secondary)] font-normal text-[12px] tracking-[0.3em] uppercase whitespace-nowrap bg-inherit"
                      >
                        Facility Name
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          padding: "8px 24px",
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                          width: "20%",
                        }}
                        className="text-[var(--color-text-secondary)] font-normal text-[12px] tracking-[0.3em] uppercase whitespace-nowrap bg-inherit"
                      >
                        Status
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          padding: "8px 24px",
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                          width: "15%",
                        }}
                        className="text-primary font-normal text-[12px] tracking-[0.3em] uppercase whitespace-nowrap bg-inherit"
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="divide-y divide-white/[0.04]">
                    {filteredPlaces.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          align="center"
                          className="py-12 text-[var(--color-text-dim)] uppercase tracking-widest text-[12px]"
                        >
                          {searchTerm
                            ? "No matches found"
                            : "No records available"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPlaces.map((place, index) => {
                        const placeId =
                          place.VAIL_Item_List_ID ||
                          place.Item_List_ID ||
                          place.Id ||
                          index + 1;
                        const placeNameVal =
                          place.VAIL_Item_Name || place.Item_Name || "Unnamed";
                        const status = (
                          place.VAIL_Status ||
                          place.Status ||
                          "A"
                        )
                          .toString()
                          .trim()
                          .toUpperCase();
                        const isActive = status === "A";

                        return (
                          <TableRow
                            key={placeId}
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
                                <span>{placeId}</span>
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
                              {placeNameVal}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{
                                padding: "8px 24px",
                                borderBottom: "none",
                              }}
                            >
                              <button
                                onClick={() => handleToggleStatus(place)}
                                disabled={isSubmitting}
                                className={`svm-status-pill transition-colors cursor-pointer ${
                                  isActive
                                    ? "svm-status-pill--success hover:bg-green-500/20"
                                    : "svm-status-pill--danger hover:bg-primary/20"
                                }`}
                              >
                                {isActive ? "ACTIVE" : "INACTIVE"}
                              </button>
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{
                                padding: "8px 24px",
                                borderBottom: "none",
                              }}
                            >
                              <div className="flex items-center justify-end gap-1">
                                <IconButton
                                  onClick={() => handleToggleStatus(place)}
                                  size="small"
                                  disabled={isSubmitting}
                                  sx={{
                                    color: isActive ? "#22c55e" : "#ef4444",
                                  }}
                                >
                                  {isActive ? (
                                    <ToggleRight size={18} />
                                  ) : (
                                    <ToggleLeft size={18} />
                                  )}
                                </IconButton>
                                <IconButton
                                  onClick={() => handleOpenEdit(place)}
                                  size="small"
                                  className="text-white/40 hover:text-white p-1"
                                >
                                  <Edit size={16} />
                                </IconButton>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onClose={() => { setEditModalOpen(false); setSelectedPlace(null); }} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>Edit Place</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Place Name" fullWidth variant="outlined"
            value={editPlaceName} onChange={(e) => setEditPlaceName(e.target.value)}
            disabled={isSubmitting} sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => { setEditModalOpen(false); setSelectedPlace(null); }} color="inherit" disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleUpdatePlace} variant="contained" color="primary" disabled={isSubmitting || !editPlaceName.trim()}>
            {isSubmitting ? "Updating..." : "Update Place"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={notification.open} autoHideDuration={6000} onClose={() => setNotification({ ...notification, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert onClose={() => setNotification({ ...notification, open: false })} severity={notification.severity} sx={{ width: "100%", borderRadius: 2 }} elevation={6} variant="filled">
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PlacesManagement;
