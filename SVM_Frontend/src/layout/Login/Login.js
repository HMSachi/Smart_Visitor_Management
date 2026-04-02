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
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { GetLogin } from "../../actions/LoginAction";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    isLoading: reduxLoading,
    error: reduxError,
    user,
  } = useSelector((state) => state.login);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (user) {
      // Success logic remains same
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setLocalError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");
    dispatch(GetLogin());

    setTimeout(() => {
      const { email, password } = formData;

      // In a real scenario, the backend would return the user role
      // Mocking logic for different users
      if (password === "123456") {
        if (email === "admin@company.com") navigate("/admin-dashboard");
        else if (email === "contact@company.com")
          navigate("/contact_person/dashboard");
        else if (email === "security@company.com")
          navigate("/security-dashboard");
        else if (email === "visitor@company.com") navigate("/home");
        else
          setLocalError(
            "Access denied. No role profile found for this identifier.",
          );
      } else {
        setLocalError("Invalid security access code. Authentication failed.");
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col md:flex-row relative overflow-hidden font-sans selection:bg-mas-red/30">
      {/* AI Background Particles & Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden circuit-grid opacity-70" />
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: "100%" }}
            animate={{
              opacity: [0, 0.4, 0],
              y: "-100%",
              x: `${(Math.random() - 0.5) * 50}px`,
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
            className="absolute bg-white/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
            }}
          />
        ))}
      </div>

      {/* Top/Left Branding Panel */}
      <div className="relative z-10 flex flex-col w-full md:w-[45%] lg:w-[40%] items-center justify-center p-6 md:p-12 py-12 md:py-0 bg-black/40 backdrop-blur-sm border-b md:border-b-0 md:border-r border-white/5">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-[0px] blur-[150px] bg-mas-red/10 opacity-30 animate-pulse-glow"
          style={{ animationDuration: "8s" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative text-center flex flex-col items-center max-w-sm"
        >
          <div className="relative mb-8 group">
            <motion.img
              src="/logo_mas.png"
              alt="MAS Logo"
              className="h-[120px] w-auto filter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            />
            <div className="absolute -inset-8 border border-mas-red/10 rounded-full animate-ping opacity-10" />
          </div>

          <h1 className="text-4xl font-bold tracking-[0.2em] mb-4 metallic-text uppercase leading-tight">
            CHANGE IS COURAGE
          </h1>

          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-mas-red to-transparent mb-6 opacity-90" />

          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-[0.4em] text-white/90 uppercase">
              MAS ACCESS
            </h2>
            <p className="text-[13px] text-blue-400/50 tracking-[0.4em] font-medium uppercase glow-text-blue">
              Secure Intelligent Access System
            </p>
          </div>
        </motion.div>

        {/* Bottom Status Info */}
        <div className="absolute bottom-12 left-12 right-12 flex justify-between items-center opacity-30">
          <div className="flex flex-col gap-1.5">
            <div className="h-[1px] w-6 bg-blue-500" />
            <span className="text-[7px] font-medium tracking-[0.25em] uppercase">
              SYSTEM.ACTIVE
            </span>
          </div>
          <div className="flex flex-col gap-1.5 items-end">
            <div className="h-[1px] w-6 bg-mas-red" />
            <span className="text-[7px] font-medium tracking-[0.25em] uppercase">
              PROTO.4.0.5
            </span>
          </div>
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10 bg-[#050505]/40 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md relative"
        >
          {/* Floating Glass Card */}
          <div className="glass-card rounded-none p-8 md:p-12 border border-white/5 relative overflow-hidden backdrop-blur-2xl w-full">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-mas-red/30 to-transparent" />

            <div className="mb-10 text-center">
              <h3 className="text-2xl font-bold mb-1 letter-spacing-wide tracking-[0.2em] uppercase">
                LOGIN PORTAL
              </h3>
              <p className="text-gray-300 text-[12px] tracking-[0.3em] uppercase opacity-90">
                SECURE ENTERPRISE AUTHENTICATION
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="group space-y-2">
                <label className="text-[14px] font-medium tracking-[0.25em] text-white/30 uppercase ml-1">
                  IDENTIFIER PROTOCOL
                </label>
                <TextField
                  fullWidth
                  name="email"
                  type="email"
                  required
                  variant="outlined"
                  value={formData.email}
                  onChange={handleInputChange}
                  autoComplete="new-email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={16} color="rgba(255, 255, 255, 0.35)" />
                      </InputAdornment>
                    ),
                    className:
                      "rounded-none bg-black/60 border-white/5 text-xs text-white uppercase font-medium tracking-widest transition-all focus-within:bg-black group-hover:border-white/10",
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "rgba(57, 55, 55, 0.34)" },
                      "&:hover fieldset": {
                        borderColor: "rgba(149, 138, 138, 0.1)",
                      },
                      "&.Mui-focused fieldset": { borderColor: "#C8102E" },
                    },
                  }}
                />
              </div>

              <div className="group space-y-2">
                <label className="text-[14px] font-medium tracking-[0.25em] text-white/30 uppercase ml-1">
                  SECURITY ACCESS CODE
                </label>
                <TextField
                  fullWidth
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  variant="outlined"
                  value={formData.password}
                  onChange={handleInputChange}
                  autoComplete="new-password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={16} color="rgba(255,255,255,0.1)" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          size="small"
                          sx={{ color: "rgba(255,255,255,0.1)" }}
                        >
                          {showPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                    className:
                      "rounded-none bg-black/60 border-white/5 text-xs text-white tracking-widest transition-all focus-within:bg-black group-hover:border-white/10",
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "rgba(255,255,255,0.05)" },
                      "&:hover fieldset": {
                        borderColor: "rgba(255,255,255,0.1)",
                      },
                      "&.Mui-focused fieldset": { borderColor: "#C8102E" },
                    },
                  }}
                />
              </div>

              <div className="flex justify-between items-center px-1">
                <button
                  type="button"
                  className="text-[14px] font-medium tracking-[0.2em] text-blue-500/40 hover:text-blue-400 uppercase transition-colors"
                >
                  Recover Keys
                </button>
                <button
                  type="button"
                  className="text-[14px] font-medium tracking-[0.2em] text-mas-red/40 hover:text-mas-red uppercase transition-colors"
                >
                  Visitor Link
                </button>
              </div>

              <AnimatePresence>
                {(localError || reduxError) && (
                  <motion.p
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-mas-red text-[12px] text-center font-medium tracking-widest uppercase py-2 bg-mas-red/5 rounded-none border border-mas-red/20"
                  >
                    {localError || reduxError}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={reduxLoading}
                className="w-full bg-mas-red hover:bg-[#B0060E] py-5 rounded-[0px] text-[13px] font-medium tracking-[0.3em] uppercase flex items-center justify-center gap-3 transition-all relative overflow-hidden shadow-[0_10px_30px_rgba(200,16,46,0.2)]"
              >
                {reduxLoading ? (
                  <CircularProgress size={16} color="inherit" strokeWidth={6} />
                ) : (
                  <>
                    AUTHENTICATE ACCESS
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white animate-pulse" />
                  </>
                )}
              </motion.button>
            </form>
          </div>

          <div className="mt-8 text-center">
            <span className="text-[14px] font-medium tracking-[0.4em] text-white/10 uppercase">
              Global Data Security Encrypted • v4.2.1
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
