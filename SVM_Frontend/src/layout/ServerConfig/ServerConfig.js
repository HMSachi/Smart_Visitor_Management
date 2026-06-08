import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Home, ShieldCheck, Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useThemeMode } from "../../theme/ThemeModeContext";
import VisitorProfileTokenService from "../../services/VisitorProfileTokenService";
import VisitorAccessTokenService from "../../services/VisitorAccessTokenService";
import VisitorService from "../../services/VisitorService";

const getResultSet = (response) => {
  const data = response?.data?.ResultSet || response?.data || response;
  if (!data) return null;
  return Array.isArray(data) ? data[0] : data;
};

const ServerConfig = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || searchParams.get("VVPT_Token");
  const { themeMode } = useThemeMode();
  const isLightMode = themeMode === "light";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const leftPanelBackground = isLightMode
    ? "rgba(255,255,255,0.72)"
    : "rgba(17,17,20,0.35)";
  const welcomeCardBackground = isLightMode
    ? "rgba(255,255,255,0.86)"
    : "rgba(17,17,20,0.85)";
  const welcomeCardBorder = isLightMode
    ? "rgba(17,24,39,0.08)"
    : "rgba(255,255,255,0.07)";
  const pageBackgroundImage = isLightMode
    ? "/login_bg_light.svg"
    : "/login_bg_dark.svg";
  const pageBackgroundOverlay = isLightMode
    ? "linear-gradient(126deg, rgba(252,254,255,0.6) 0%, rgba(240,246,252,0.36) 54%, rgba(231,239,249,0.64) 100%)"
    : "linear-gradient(126deg, rgba(4,8,13,0.68) 0%, rgba(6,10,15,0.44) 54%, rgba(11,16,24,0.73) 100%)";
  const vignetteOverlay = isLightMode
    ? "radial-gradient(110% 88% at 78% 10%, rgba(200,16,46,0.12) 0%, rgba(200,16,46,0) 54%), radial-gradient(120% 90% at 22% 92%, rgba(47,107,154,0.1) 0%, rgba(47,107,154,0) 55%), radial-gradient(130% 110% at 50% 50%, rgba(26,38,54,0) 55%, rgba(26,38,54,0.2) 100%)"
    : "radial-gradient(110% 88% at 78% 10%, rgba(200,16,46,0.22) 0%, rgba(200,16,46,0) 54%), radial-gradient(120% 90% at 22% 92%, rgba(47,107,154,0.2) 0%, rgba(47,107,154,0) 55%), radial-gradient(130% 110% at 50% 50%, rgba(4,8,13,0) 55%, rgba(4,8,13,0.44) 100%)";

  /**
   * Try to validate token as a visitor PROFILE token first.
   * Returns the profile record on success, null on failure.
   */
  const tryProfileToken = async (tokenValue) => {
    try {
      const response = await VisitorProfileTokenService.ValidateProfileToken(tokenValue);
      return getResultSet(response) || null;
    } catch {
      return null;
    }
  };

  /**
   * Try to validate token as an admin ACCESS token (VVAT_Token).
   * Looks up the token record, extracts visitor ID, then fetches full visitor profile.
   * Returns a profile-shaped object on success, null on failure.
   */
  const tryAccessToken = async (tokenValue) => {
    try {
      const tokenRecord = await VisitorAccessTokenService.GetTokenByValue(tokenValue);
      if (!tokenRecord) return null;

      const visitorId =
        tokenRecord.VV_Visitor_id ||
        tokenRecord.Visitor_id ||
        tokenRecord.VisitorId;

      if (!visitorId) return null;

      // Check the token is still active
      const status = String(tokenRecord.VVAT_Status || "").trim().toUpperCase();
      if (status === "E" || status === "EXPIRED") {
        throw new Error("This access token has already expired. Please contact the admin.");
      }

      // Try to fetch the full visitor record so we have name, email, etc.
      let visitorName = tokenRecord.VV_Name || tokenRecord.Visitor_Name || null;
      let visitorEmail = tokenRecord.VV_Email || tokenRecord.Visitor_Email || null;

      if (!visitorName) {
        try {
          const visRes = await VisitorService.GetVisitorById(visitorId);
          const vr = getResultSet(visRes);
          if (vr) {
            visitorName = vr.VV_Name || vr.Visitor_Name || null;
            visitorEmail = vr.VV_Email || vr.Email || null;
          }
        } catch {
          // non-critical — carry on without full profile
        }
      }

      // Return a profile-shaped record compatible with what MyRequests.js expects
      return {
        VV_Visitor_id: visitorId,
        Visitor_id: visitorId,
        VV_Name: visitorName || `Visitor #${visitorId}`,
        VV_Email: visitorEmail || "",
        // flag so other parts of the app know this came from an access token
        _source: "access_token",
        _accessTokenRecord: tokenRecord,
      };
    } catch (err) {
      throw err; // re-throw so handleContinue can surface expired-token message
    }
  };

  const handleContinue = async () => {
    if (!token) {
      navigate("/home");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1️⃣ Try as a profile token first (contact-person flow)
      let profile = await tryProfileToken(token);

      if (profile) {
        localStorage.setItem("visitor_profile_token", token);
        localStorage.setItem("visitor_profile", JSON.stringify(profile));
        navigate("/home");
        return;
      }

      // 2️⃣ Profile token not found — try as an admin-issued access token
      const accessProfile = await tryAccessToken(token);

      if (accessProfile) {
        // Store visitor profile so MyRequests.js can load visit requests
        localStorage.setItem("visitor_profile_token", token);
        localStorage.setItem("visitor_profile", JSON.stringify(accessProfile));
        // Navigate directly to the visitor's requests page
        navigate("/visitor/my-requests");
        return;
      }

      // Neither worked
      setError("Invalid or expired link. Please contact the admin for a new link.");
    } catch (err) {
      setError(
        err?.message ||
          "Invalid or expired link. Please contact the admin for a new link."
      );
    } finally {
      setLoading(false);
    }
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
      <div
        className="absolute inset-0 z-0 pointer-events-none circuit-grid"
        style={{ opacity: isLightMode ? 0.34 : 0.56 }}
      />

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
          <div className="relative mb-10">
            <motion.img
              src="/logo_mas.png"
              alt="MAS Logo"
              className="h-[100px] sm:h-[120px] w-auto filter drop-shadow-[0_0_20px_rgba(200,16,46,0.25)]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>

          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-semibold tracking-widest">
              <ShieldCheck size={12} />
              Visitor Portal
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-3 text-white leading-tight">
            Welcome
          </h1>
          <p className="text-sm text-white/50 tracking-wide max-w-xs leading-relaxed">
            Continue to the MAS visitor home page to start your visit process.
          </p>
        </motion.div>
      </div>

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
              background: welcomeCardBackground,
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: `1px solid ${welcomeCardBorder}`,
              borderRadius: "20px",
              padding: "2.5rem 2rem",
              color: "var(--color-text-primary)",
            }}
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
                MAS Visitor Portal
              </h2>
              <p className="text-sm text-white/45">
                {token
                  ? "Your visit has been approved. Press continue to view your visit requests."
                  : "Press continue to load the visitor home page."}
              </p>
              {error && (
                <p className="text-red-400 text-xs mt-3 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 leading-relaxed">
                  {error}
                </p>
              )}
            </div>

            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/25 text-primary flex items-center justify-center">
                <Home size={28} />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={handleContinue}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-[14px] rounded-xl font-semibold text-sm text-white tracking-wide transition-all disabled:opacity-70"
              style={{
                background: "linear-gradient(135deg, #C8102E 0%, #A60D26 100%)",
                boxShadow: "0 4px 20px rgba(200,16,46,0.35)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ServerConfig;
