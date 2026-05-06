import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { useThemeMode } from "../../theme/ThemeModeContext";

const ThemeToggleButton = ({ className = "" }) => {
  const { themeMode, toggleThemeMode } = useThemeMode();

  return (
    <Tooltip title={themeMode === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
      <IconButton
        onClick={toggleThemeMode}
        aria-label="Toggle theme mode"
        size="small"
        className={className}
        sx={{
          color: "var(--color-text-primary)",
          backgroundColor: "transparent",
          border: "none",
          "&:hover": {
            backgroundColor: "transparent",
            color: "var(--color-primary)",
          },
        }}
      >
        {themeMode === "dark" ? <LightModeOutlinedIcon fontSize="small" /> : <DarkModeOutlinedIcon fontSize="small" />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggleButton;
