import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TextField,
  InputAdornment,
} from "@mui/material";
import { Server, CheckCircle, ShieldCheck, Link2 } from "lucide-react";
import { useThemeMode } from "../../theme/ThemeModeContext";

const ServerConfig = () => {
  const { themeMode } = useThemeMode();
  
  const [url, setUrl] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedUrl = localStorage.getItem("backend_url");
    if (savedUrl) {
      setUrl(savedUrl);
    }
  }, []);

  const isLightMode = themeMode === "light";
  
  // Design Tokens mirroring Login Page
  const leftPanelBackground = isLightMode
    ? "rgba(255,255,255,0.72)"
    : "rgba(17,17,20,0.35)";
  const loginCardBackground = isLightMode
    ? "rgba(255,255,255,0.86)"
    : "rgba(17,17,20,0.85)";
  const loginCardBorder = isLightMode
    ? "rgba(17,24,39,0.08)"
    : "rgba(255,255,255,0.07)";
  const inputBackground = isLightMode
    ? "rgba(17,24,39,0.03)"
    : "rgba(255,255,255,0.03)";
  const inputBorder = isLightMode
    ? "rgba(17,24,39,0.12)"
    : "rgba(255,255,255,0.08)";
  const inputBorderHover = isLightMode
    ? "rgba(17,24,39,0.2)"
    : "rgba(255,255,255,0.15)";
  const inputTextColor = isLightMode ? "var(--color-text-primary)" : "#F1F1F3";
  const inputIconColor = isLightMode
    ? "rgba(17,24,39,0.45)"
    : "rgba(255,255,255,0.3)";
  const pageBackgroundImage = isLightMode
    ? "/login_bg_light.svg"
    : "/login_bg_dark.svg";
  const pageBackgroundOverlay = isLightMode
    ? "linear-gradient(126deg, rgba(252,254,255,0.6) 0%, rgba(240,246,252,0.36) 54%, rgba(231,239,249,0.64) 100%)"
    : "linear-gradient(126deg, rgba(4,8,13,0.68) 0%, rgba(6,10,15,0.44) 54%, rgba(11,16,24,0.73) 100%)";
  const vignetteOverlay = isLightMode
    ? "radial-gradient(110% 88% at 78% 10%, rgba(200,16,46,0.12) 0%, rgba(200,16,46,0) 54%), radial-gradient(120% 90% at 22% 92%, rgba(47,107,154,0.1) 0%, rgba(47,107,154,0) 55%), radial-gradient(130% 110% at 50% 50%, rgba(26,38,54,0) 55%, rgba(26,38,54,0.2) 100%)"
    : "radial-gradient(110% 88% at 78% 10%, rgba(200,16,46,0.22) 0%, rgba(200,16,46,0) 54%), radial-gradient(120% 90% at 22% 92%, rgba(47,107,154,0.2) 0%, rgba(47,107,154,0) 55%), radial-gradient(130% 110% at 50% 50%, rgba(4,8,13,0) 55%, rgba(4,8,13,0.44) 100%)";

  const handleInputChange = (e) => {
    setUrl(e.target.value);
    setIsSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim() !== "") {
      localStorage.setItem("backend_url", url.trim());
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      backgroundColor: inputBackground,
      "& fieldset": { borderColor: inputBorder },
      "&:hover fieldset": { borderColor: inputBorderHover },
      "&.Mui-focused fieldset": {
        borderColor: "var(--color-primary)",
        boxShadow: "0 0 0 3px rgba(200,16,46,0.12)",
      },
    },
    "& .MuiInputBase-input": {
      color: inputTextColor,
      fontSize: "14px",
      padding: "14px 16px",
    },
    "& .MuiInputAdornment-root svg": { color: inputIconColor },
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-default)] text-white flex flex-col lg:flex-row relative overflow-hidden">
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `${pageBackgroundOverlay}, url(${pageBackgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: vignetteOverlay }}
      />
      
      {/* Animated Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none circuit-grid"
        style={{ opacity: isLightMode ? 0.34 : 0.56 }}
      />
      
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: "105%" }}
            animate={{ opacity: [0, 0.35, 0], y: "-10%" }}
            transition={{
              duration: 10 + Math.random() * 8,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
            className="absolute rounded-full bg-white/30"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
            }}
          />
        ))}
      </div>

      {/* ── Left Branding Panel ── */}
      <div
        className="relative z-10 flex flex-col w-full lg:w-[46%] xl:w-[42%] items-center justify-center px-8 py-16 lg:py-0 backdrop-blur-sm border-b lg:border-b-0 lg:border-r"
        style={{
          background: leftPanelBackground,
          borderColor: "var(--color-border-soft)",
        }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[130px] bg-primary/10 opacity-40 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative text-center flex flex-col items-center max-w-sm w-full"
        >
          {/* Logo */}
          <div className="relative mb-10">
            <motion.img
              src="/logo_mas.png"
              alt="MAS Logo"
              className="h-[100px] sm:h-[120px] w-auto filter drop-shadow-[0_0_20px_rgba(200,16,46,0.25)]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              onError={(e) => {
                // Fallback icon if logo image not found on this route
                e.target.style.display = 'none';
              }}
            />
          </div>

          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-semibold tracking-widest uppercase">
              <Server size={12} />
              System Configuration
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-3 text-white leading-tight">
            Backend Setup
          </h1>
          <p className="text-sm text-white/50 tracking-wide max-w-xs leading-relaxed">
            Configure the API Server URL to allow the application to connect to the backend services.
          </p>
        </motion.div>
      </div>

      {/* ── Right Config Panel ── */}
      <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-12 lg:py-0 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="w-full max-w-md"
        >
          <div
            className="relative w-full overflow-hidden"
            style={{
              background: loginCardBackground,
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: `1px solid ${loginCardBorder}`,
              borderRadius: "20px",
              padding: "2.5rem 2rem",
              color: "var(--color-text-primary)",
            }}
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
                Server Connection
              </h2>
              <p className="text-sm text-white/45">
                Specify the backend API URL.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/60 tracking-wider uppercase block">
                  Backend URL
                </label>
                <TextField
                  fullWidth
                  name="url"
                  type="text"
                  required
                  variant="outlined"
                  value={url}
                  onChange={handleInputChange}
                  placeholder="https://api.yourdomain.com"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Link2 size={16} />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />
              </div>

              <AnimatePresence>
                {isSaved && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/25 text-green-500 text-sm"
                  >
                    <CheckCircle size={15} className="shrink-0" />
                    <span>Server URL saved successfully!</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full flex items-center justify-center gap-3 py-[14px] rounded-xl font-semibold text-sm text-white tracking-wide transition-all"
                style={{
                  background: "linear-gradient(135deg, #C8102E 0%, #A60D26 100%)",
                  boxShadow: "0 4px 20px rgba(200,16,46,0.35)",
                }}
              >
                Save Configuration
                <ShieldCheck size={16} />
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ServerConfig;
