import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip,
} from "@mui/material";
import { MapPin, Plus, Edit, ToggleLeft, ToggleRight } from "lucide-react";
import { AddPlace, GetAllPlaces, UpdatePlace, UpdatePlaceStatus } from "../../../actions/PlacesAction";

const PlacesManagement = () => {
  const [placeName, setPlaceName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [editPlaceName, setEditPlaceName] = useState("");

  const user = useSelector((state) => state.login.user);
  const { places, loading } = useSelector((state) => state.placesState);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetAllPlaces());
  }, [dispatch]);

  const handleAddPlace = async (e) => {
    e.preventDefault();
    if (!placeName.trim()) {
      setNotification({
        open: true,
        message: "Please enter a place name",
        severity: "error",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const adminId = user?.ResultSet?.[0]?.VA_Admin_id || 3;
      const pUid = user?.ResultSet?.[0]?.P_UID || "admin";

      const placeData = {
        VA_Admin_id: adminId,
        VAIL_Item_Name: placeName,
        P_UID: pUid,
      };

      const response = await dispatch(AddPlace(placeData));

      // More lenient validation matching the action's success criteria
      const isSuccess = response && (
        response.ResultCode === "1000" || 
        response.Status === "Success" || 
        response.Status === "OK" ||
        response.ResultSet ||
        Object.keys(response).length > 0
      );

      if (isSuccess) {
        setNotification({
          open: true,
          message: "Place added successfully",
          severity: "success",
        });
        setPlaceName("");
      } else {
        setNotification({
          open: true,
          message: response?.ResultMessage || response?.Message || "Failed to add place",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error adding place:", error);
      setNotification({
        open: true,
        message: "An error occurred while adding the place",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEdit = (place) => {
    setSelectedPlace(place);
    // Adjust field names based on actual backend response
    setEditPlaceName(place.VAIL_Item_Name || place.Item_Name || place.Name || "");
    setEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    setEditModalOpen(false);
    setSelectedPlace(null);
    setEditPlaceName("");
  };

  const handleUpdatePlace = async () => {
    if (!editPlaceName.trim()) {
      setNotification({
        open: true,
        message: "Please enter a valid place name",
        severity: "error",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const pUid = user?.ResultSet?.[0]?.P_UID || "admin";
      
      // Adjust ID field based on actual backend response
      const placeId = selectedPlace.VAIL_Item_List_ID || selectedPlace.Item_List_ID || selectedPlace.Id || selectedPlace.ID;

      const placeData = {
        VAIL_Item_List_ID: placeId,
        VAIL_Item_Name: editPlaceName,
        P_UID: pUid,
      };

      const response = await dispatch(UpdatePlace(placeData));

      // More lenient validation matching the action's success criteria
      const isSuccess = response && (
        response.ResultCode === "1000" || 
        response.Status === "Success" || 
        response.Status === "OK" ||
        response.ResultSet ||
        Object.keys(response).length > 0
      );

      if (isSuccess) {
        setNotification({
          open: true,
          message: "Place updated successfully",
          severity: "success",
        });
        handleCloseEdit();
      } else {
        setNotification({
          open: true,
          message: response?.ResultMessage || response?.Message || "Failed to update place",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error updating place:", error);
      setNotification({
        open: true,
        message: error.message || "An error occurred while updating the place",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (place) => {
    try {
      setIsSubmitting(true);
      const placeId = place.VAIL_Item_List_ID || place.Item_List_ID || place.Id || place.ID;
      const currentStatus = (place.VAIL_Status || place.Status || 'A').toString().trim().toUpperCase();
      const newStatus = currentStatus === 'A' ? 'I' : 'A';
      const pUid = user?.ResultSet?.[0]?.P_UID || "admin";

      await dispatch(UpdatePlaceStatus(placeId, newStatus, pUid));

      setNotification({
        open: true,
        message: `Place ${newStatus === 'A' ? 'activated' : 'deactivated'} successfully`,
        severity: "success",
      });
    } catch (error) {
      console.error("Error toggling place status:", error);
      setNotification({
        open: true,
        message: "Failed to update place status",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1000, margin: "0 auto" }}>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MapPin size={24} />
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary" }}>
            Places Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add and manage places to visit within the facility.
          </Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Add New Place
        </Typography>
        <form onSubmit={handleAddPlace}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }, gap: 3 }}>
            <TextField
              fullWidth
              label="Place Name"
              variant="outlined"
              value={placeName}
              onChange={(e) => setPlaceName(e.target.value)}
              placeholder="e.g. Main Lobby, HR Department, Server Room"
              disabled={isSubmitting}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              disabled={isSubmitting || !placeName.trim()}
              startIcon={<Plus size={20} />}
              sx={{ height: "100%" }}
            >
              {isSubmitting ? "Adding..." : "Add Place"}
            </Button>
          </Box>
        </form>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          All Places
        </Typography>
        
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : places && places.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Place Name</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {places.map((place, index) => {
                  const placeId = place.VAIL_Item_List_ID || place.Item_List_ID || place.Id || place.ID || index + 1;
                  const placeNameVal = place.VAIL_Item_Name || place.Item_Name || place.Name || "Unnamed Place";
                  const placeStatus = (place.VAIL_Status || place.Status || 'A').toString().trim().toUpperCase();
                  const isActive = placeStatus === 'A';
                  
                  return (
                    <TableRow key={placeId} hover sx={{ opacity: isActive ? 1 : 0.6 }}>
                      <TableCell>{placeId}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{placeNameVal}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={isActive ? "Active" : "Inactive"}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            bgcolor: isActive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                            color: isActive ? '#22c55e' : '#ef4444',
                            border: `1px solid ${isActive ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton 
                          onClick={() => handleToggleStatus(place)}
                          size="small"
                          disabled={isSubmitting}
                          title={isActive ? "Deactivate" : "Activate"}
                          sx={{ color: isActive ? '#22c55e' : '#ef4444', mr: 0.5 }}
                        >
                          {isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                        </IconButton>
                        <IconButton 
                          color="primary" 
                          onClick={() => handleOpenEdit(place)}
                          size="small"
                        >
                          <Edit size={18} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ p: 3, textAlign: "center", color: "text.secondary", bgcolor: "background.default", borderRadius: 2 }}>
            <Typography>No places found. Add a new place above.</Typography>
          </Box>
        )}
      </Paper>

      <Dialog open={editModalOpen} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>Edit Place</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Place Name"
            type="text"
            fullWidth
            variant="outlined"
            value={editPlaceName}
            onChange={(e) => setEditPlaceName(e.target.value)}
            disabled={isSubmitting}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseEdit} color="inherit" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpdatePlace} 
            variant="contained" 
            color="primary"
            disabled={isSubmitting || !editPlaceName.trim()}
          >
            {isSubmitting ? "Updating..." : "Update Place"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%", borderRadius: 2 }}
          elevation={6}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PlacesManagement;
