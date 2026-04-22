import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  TextField,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
import { GetLogin } from "../../actions/LoginAction";
import { useThemeMode } from "../../theme/ThemeModeContext";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { themeMode } = useThemeMode();
  const {
    isLoading: reduxLoading,
    error: reduxError,
    user,
  } = useSelector((state) => state.login);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const isLightMode = themeMode === "light";
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

  useEffect(() => {
    if (user) {
      if (user.ResultSet && user.ResultSet.length > 0) {
        const role = user.ResultSet[0].VA_Role;
        if (role === "Admin") navigate("/admin-dashboard");
        else if (role === "Contact_Person")
          navigate("/contact_person/dashboard");
        else if (role === "Security") navigate("/security-dashboard");
        else if (role === "Visitor") navigate("/home");
        else
          setLocalError("Access denied. Your account role is not recognised.");
      } else {
        setLocalError("Incorrect email or password. Please try again.");
      }
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setLocalError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");
    dispatch(GetLogin(formData.email, formData.password));
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
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 pointer-events-none circuit-grid opacity-60" />
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
        {/* Glow blur */}
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
            />
          </div>

          {/* Tag line */}
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-semibold tracking-widest uppercase">
              <ShieldCheck size={12} />
              Secure Access Portal
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-3 text-white leading-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-white/50 tracking-wide max-w-xs leading-relaxed">
            Sign in to manage visitor access, security monitoring, and approvals
            in one place.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {["Visitor Management", "QR Verification", "Real-time Alerts"].map(
              (f) => (
                <span
                  key={f}
                  className="text-[11px] text-white/40 bg-white/[0.04] border border-white/[0.07] px-3 py-1 rounded-full"
                >
                  {f}
                </span>
              ),
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Right Login Panel ── */}
      <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-12 lg:py-0 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="w-full max-w-md"
        >
          {/* Card */}
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
            {/* Top gradient line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            {/* Form heading */}
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
                Sign In
              </h2>
              <p className="text-sm text-white/45">
                Enter your email and password to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/60 tracking-wider uppercase block">
                  Email Address
                </label>
                <TextField
                  fullWidth
                  name="email"
                  type="email"
                  required
                  variant="outlined"
                  value={formData.email}
                  onChange={handleInputChange}
                  autoComplete="email"
                  placeholder="you@company.com"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={16} />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/60 tracking-wider uppercase block">
                  Password
                </label>
                <TextField
                  fullWidth
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  variant="outlined"
                  value={formData.password}
                  onChange={handleInputChange}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={16} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          size="small"
                          sx={{ color: "rgba(255,255,255,0.3)" }}
                        >
                          {showPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />
              </div>

              {/* Error */}
              <AnimatePresence>
                {(localError || reduxError) && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-primary/10 border border-primary/25 text-primary text-sm"
                  >
                    <ShieldCheck size={15} className="shrink-0" />
                    <span>{localError || reduxError}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={reduxLoading}
                className="w-full flex items-center justify-center gap-3 py-[14px] rounded-xl font-semibold text-sm text-white tracking-wide transition-all"
                style={{
                  background: reduxLoading
                    ? "rgba(200,16,46,0.5)"
                    : "linear-gradient(135deg, #C8102E 0%, #A60D26 100%)",
                  boxShadow: "0 4px 20px rgba(200,16,46,0.35)",
                }}
              >
                {reduxLoading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <>
                    Sign In to Your Account
                    <ArrowRight size={16} />
                  </>
                )}
              </motion.button>
            </form>

            {/* Footer note */}
            <p className="mt-6 text-center text-[11px] text-white/25 leading-relaxed">
              MAS Holdings Visitor Access System · Secure &amp; Encrypted
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
