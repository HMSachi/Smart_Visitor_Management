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
          <header className="mb-6 flex flex-col xl:flex-row justify-between items-center gap-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center text-primary shadow-md">
                <MapPin size={18} strokeWidth={1.8} />
              </div>
              <div>
                <h2 className={`text-sm font-semibold tracking-wide uppercase ${isLight ? "text-gray-800" : "text-white"}`}>
                  Facility Locations
                </h2>
                <p className={`text-[9px] tracking-[0.2em] uppercase font-medium mt-0.5 ${isLight ? "text-gray-400" : "text-white/40"}`}>
                  {filteredPlaces.length} {filteredPlaces.length === 1 ? "place" : "places"} registered
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 items-center shrink-0 w-full xl:w-auto">
              {/* Search */}
              <div className={`flex items-center border transition-all rounded-[8px] px-3 h-9 min-w-[220px] w-full sm:w-[280px] group shadow-sm ${isLight ? "bg-white border-gray-200 hover:border-primary/20 focus-within:border-primary/40" : "bg-black/40 border-white/10 focus-within:border-primary"}`}>
                <Search size={14} className={`transition-colors mr-2 ${isLight ? "text-gray-400 group-focus-within:text-primary" : "text-white/20 group-focus-within:text-primary"}`} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search places..."
                  className={`bg-transparent text-[13px] focus:outline-none w-full tracking-wide ${isLight ? "text-[#1A1A1A] placeholder:text-gray-400" : "text-white placeholder:text-white/20"}`}
                />
              </div>

              {/* Add Form Inline */}
              <form onSubmit={handleAddPlace} className="flex gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={placeName}
                  onChange={(e) => setPlaceName(e.target.value)}
                  placeholder="New place name..."
                  disabled={isSubmitting}
                  className={`border transition-all rounded-[8px] px-3 h-9 text-[13px] focus:outline-none w-full sm:w-[200px] shadow-sm ${isLight ? "bg-white border-gray-200 text-[#1A1A1A] placeholder:text-gray-400 focus:border-primary/40" : "bg-black/40 border-white/10 text-white placeholder:text-white/20 focus:border-primary"}`}
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !placeName.trim()}
                  className="flex items-center justify-center gap-1 bg-primary hover:bg-primary-hover text-white px-3 h-9 rounded-[8px] text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95 group shrink-0 disabled:opacity-50"
                >
                  <Plus size={14} className="group-hover:rotate-90 transition-transform" />
                  {isSubmitting ? "Adding..." : "Add"}
                </button>
              </form>
            </div>
          </header>

          {/* Table */}
          <div className={`${isLight ? "bg-white border-gray-100" : "bg-[var(--color-bg-paper)] border-white/8"} border rounded-2xl overflow-hidden shadow-xl relative hover:border-white/12 transition-colors duration-300`}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent pointer-events-none"></div>
            {loading ? (
              <div className="p-8 md:p-20 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 border-4 border-white/5 border-t-primary rounded-full animate-spin mb-6"></div>
                <p className={`text-[13px] uppercase tracking-[0.3em] font-medium ${isLight ? "text-gray-400" : "text-gray-300"}`}>Loading places...</p>
              </div>
            ) : filteredPlaces.length === 0 ? (
              <div className="p-8 md:p-20 text-center">
                <p className={`text-[13px] uppercase tracking-[0.3em] font-medium ${isLight ? "text-gray-400" : "text-gray-300"}`}>
                  {searchTerm ? "No places match your search." : "No places found. Add one above."}
                </p>
              </div>
            ) : (
              <TableContainer component={Paper} className="bg-transparent border-none z-10 relative"
                sx={{ maxHeight: "calc(100vh - 16rem)", overflow: "auto" }}>
                <Table stickyHeader aria-label="places table">
                  <TableHead>
                    <TableRow sx={{ height: "24px", backgroundColor: isLight ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.03)" }}>
                      {["ID", "Place Name", "Status", "Actions"].map((label, i) => (
                        <TableCell key={label}
                          align={label === "Actions" ? "right" : label === "Status" ? "center" : "left"}
                          sx={{ padding: "4px 16px", borderBottom: isLight ? "1px solid rgba(0,0,0,0.05)" : "1px solid rgba(255,255,255,0.08)" }}
                          className={`${isLight ? "text-gray-500" : "text-white/40"} font-normal text-[12px] tracking-[0.2em] uppercase whitespace-nowrap`}
                        >
                          {label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPlaces.map((place, index) => {
                      const placeId = place.VAIL_Item_List_ID || place.Item_List_ID || place.Id || index + 1;
                      const placeNameVal = place.VAIL_Item_Name || place.Item_Name || "Unnamed";
                      const status = (place.VAIL_Status || place.Status || "A").toString().trim().toUpperCase();
                      const isActive = status === "A";

                      return (
                        <TableRow key={placeId}
                          sx={{
                            "&:hover": { backgroundColor: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)" },
                            height: "28px",
                            opacity: isActive ? 1 : 0.55,
                            transition: "all 0.2s ease",
                          }}
                        >
                          <TableCell sx={{ padding: "3px 16px" }}
                            className={`${isLight ? "text-gray-800" : "text-white/80"} font-normal text-[12px]`}>
                            <div className="flex items-center gap-1">
                              <Hash size={10} className="text-primary/40" />
                              <span>{placeId}</span>
                            </div>
                          </TableCell>
                          <TableCell sx={{ padding: "3px 16px" }}
                            className={`font-medium text-[12px] ${isActive ? (isLight ? "text-gray-900" : "text-white") : (isLight ? "text-gray-400" : "text-white/40")}`}>
                            {placeNameVal}
                          </TableCell>
                          <TableCell align="center" sx={{ padding: "3px 16px" }}>
                            <button
                              onClick={() => handleToggleStatus(place)}
                              disabled={isSubmitting}
                              title={isActive ? "Click to deactivate" : "Click to activate"}
                              className={`svm-status-pill transition-colors cursor-pointer ${isActive ? "svm-status-pill--success hover:bg-green-500/20" : "svm-status-pill--danger hover:bg-primary/20"}`}
                            >
                              {isActive ? "ACTIVE" : "INACTIVE"}
                            </button>
                          </TableCell>
                          <TableCell align="right" sx={{ padding: "3px 16px" }}>
                            <IconButton
                              onClick={() => handleToggleStatus(place)}
                              size="small"
                              disabled={isSubmitting}
                              title={isActive ? "Deactivate" : "Activate"}
                              sx={{ color: isActive ? "#22c55e" : "#ef4444", mr: 0.5 }}
                            >
                              {isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                            </IconButton>
                            <IconButton
                              onClick={() => handleOpenEdit(place)}
                              size="small"
                              className={`${isLight ? "text-gray-400 hover:text-primary" : "text-white/40 hover:text-white"} p-1`}
                            >
                              <Edit size={14} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
