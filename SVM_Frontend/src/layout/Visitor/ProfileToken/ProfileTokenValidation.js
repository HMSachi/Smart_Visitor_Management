import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AlertCircle, Loader2, ShieldCheck } from "lucide-react";
import VisitorProfileTokenService from "../../../services/VisitorProfileTokenService";

const ProfileTokenValidation = () => {
  const navigate = useNavigate();
  const { token: routeToken } = useParams();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("validating");

  const token = useMemo(
    () => routeToken || searchParams.get("token") || searchParams.get("VVPT_Token") || "",
    [routeToken, searchParams],
  );

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setStatus("invalid");
        return;
      }

      try {
        const response = await VisitorProfileTokenService.ValidateProfileToken(token);
        if (VisitorProfileTokenService.isValidationSuccess(response)) {
          setStatus("valid");
          navigate("/home", { replace: true, state: { profileToken: token } });
          return;
        }
        setStatus("invalid");
      } catch (err) {
        console.error("Profile token validation failed:", err);
        setStatus("invalid");
      }
    };

    validateToken();
  }, [navigate, token]);

  if (status === "validating") {
    return (
      <div className="min-h-screen bg-[var(--color-bg-default)] flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <Loader2 size={22} className="text-green-500 animate-spin" />
          </div>
          <div>
            <p className="text-white text-[13px] font-medium tracking-widest capitalize">
              Validating visitor link
            </p>
            <p className="text-gray-400 text-[11px] mt-2 tracking-wide">
              Please wait while your access link is checked.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-default)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-[var(--color-bg-paper)] border border-white/10 rounded-[16px] p-6 text-center shadow-xl">
        <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
          {status === "valid" ? (
            <ShieldCheck size={24} className="text-green-500" />
          ) : (
            <AlertCircle size={24} className="text-primary" />
          )}
        </div>
        <h1 className="text-white text-[14px] font-medium tracking-widest capitalize">
          Invalid or expired link
        </h1>
        <p className="text-gray-400 text-[11px] leading-relaxed tracking-wide mt-3">
          This visitor profile link is no longer valid. Please contact your host or request a new approval link.
        </p>
        <button
          type="button"
          onClick={() => navigate("/login", { replace: true })}
          className="mt-5 w-full py-2 bg-primary hover:bg-[#A00D25] text-white text-[11px] font-medium tracking-widest rounded-[10px] transition-colors"
        >
          Back To Login
        </button>
      </div>
    </div>
  );
};

export default ProfileTokenValidation;
