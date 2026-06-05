import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CalendarCheck,
  Clock,
  Loader2,
  Mail,
  User,
} from "lucide-react";
import VisitorProfileTokenService from "../../../services/VisitorProfileTokenService";
import VisitorService from "../../../services/VisitorService";
import { updateField } from "../../../reducers/visitorSlice";

const getResultSet = (response) => {
  const data = response?.data?.ResultSet || response?.data || response;
  if (!data) return null;
  return Array.isArray(data) ? data[0] : data;
};

const getField = (source, fields, fallback = "") => {
  if (!source) return fallback;
  const value = fields
    .map((field) => source[field])
    .find((item) => item !== undefined && item !== null && item !== "");
  return value ?? fallback;
};

const isActiveStatus = (value) => {
  const status = String(value || "").trim().toUpperCase();
  return status === "A" || status === "ACTIVE" || status === "VALID";
};

const mapVisitorToForm = (visitor) => ({
  fullName: getField(visitor, ["VV_Name", "Visitor_Name", "Name"]),
  nic: getField(visitor, ["VV_NIC_Passport_NO", "NIC", "NIC_Passport_NO"]),
  phoneNumber: getField(visitor, ["VV_Phone", "Phone", "Mobile"]),
  emailAddress: getField(visitor, ["VV_Email", "Email"]),
  representingCompany: getField(visitor, ["VV_Company", "Company"]),
  visitorClassification: getField(visitor, ["VV_Visitor_Type", "Visitor_Type"]),
  visitingArea: getField(visitor, ["VV_Visiting_places", "Visiting_places"]),
});

const ProfileToken = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = searchParams.get("token") || searchParams.get("VVPT_Token") || "";

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [visitor, setVisitor] = useState(null);

  const visitorName = useMemo(
    () => getField(visitor, ["VV_Name", "Visitor_Name", "Name"], "Visitor"),
    [visitor],
  );

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setStatus("invalid");
        setMessage("Profile token is missing from this link.");
        return;
      }

      try {
        setStatus("loading");
        setMessage("");

        const validationResponse =
          await VisitorProfileTokenService.ValidateProfileToken(token);
        const tokenRecord = getResultSet(validationResponse);

        const tokenStatus = getField(tokenRecord, ["VVPT_Status", "Status"], "A");
        if (!tokenRecord || !isActiveStatus(tokenStatus)) {
          setStatus("invalid");
          setMessage("This profile link is invalid or expired.");
          return;
        }

        const visitorId = getField(tokenRecord, [
          "VV_Visitor_id",
          "Visitor_id",
          "VisitorId",
        ]);

        let visitorRecord = tokenRecord;
        if (visitorId) {
          try {
            const visitorResponse = await VisitorService.GetVisitorById(visitorId);
            visitorRecord = getResultSet(visitorResponse) || tokenRecord;
          } catch (visitorErr) {
            console.warn("Could not load visitor details from token:", visitorErr);
          }
        }

        const normalizedVisitor = {
          ...visitorRecord,
          VV_Visitor_id: getField(visitorRecord, ["VV_Visitor_id"], visitorId),
          VV_Contact_person_id: getField(visitorRecord, ["VV_Contact_person_id", "Contact_person_id"]),
        };

        setVisitor(normalizedVisitor);

        const mappedFields = mapVisitorToForm(normalizedVisitor);
        Object.entries(mappedFields).forEach(([name, value]) => {
          if (value) dispatch(updateField({ name, value }));
        });

        localStorage.setItem("visitor_profile_token", token);
        localStorage.setItem("visitor_profile", JSON.stringify(normalizedVisitor));
        setStatus("valid");
      } catch (err) {
        setStatus("invalid");
        setMessage(
          err?.response?.data?.Message ||
            err?.message ||
            "This profile link could not be validated.",
        );
      }
    };

    validateToken();
  }, [dispatch, token]);

  const handleContinue = () => {
    navigate("/home");
  };

  if (status === "valid") {
    return (
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[var(--color-bg-default)] pt-[68px]">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/main.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "50% 30%",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-y-0 left-0 w-full lg:w-3/5 bg-gradient-to-r from-black/90 via-black/55 to-transparent" />
        </div>

        <div className="relative z-10 w-full px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 py-16">
          <div className="max-w-2xl">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-[11px] font-semibold tracking-widest">
                <CheckCircle2 size={13} />
                Verified Profile
              </span>
            </div>

            <h1
              className="font-black leading-[1.1] tracking-tight mb-6 m-0 p-0 text-white"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)" }}
            >
              Welcome, {visitorName}
              <br />
              <span className="text-primary">Visitor Portal</span>
            </h1>

            <p className="text-base sm:text-lg font-medium leading-relaxed mb-8 max-w-xl text-white/75">
              Your visitor profile has been verified. Continue to the MAS
              Visitor Portal home page to manage your visit.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mb-8">
              <div className="p-3 rounded-[10px] bg-white/10 border border-white/15 backdrop-blur text-left">
                <div className="flex items-center gap-2 text-[11px] text-white/50 tracking-widest mb-1">
                  <User size={13} className="text-primary" /> Identity
                </div>
                <p className="text-[13px] text-white">
                  {getField(visitor, ["VV_NIC_Passport_NO", "NIC"], "N/A")}
                </p>
              </div>
              <div className="p-3 rounded-[10px] bg-white/10 border border-white/15 backdrop-blur text-left">
                <div className="flex items-center gap-2 text-[11px] text-white/50 tracking-widest mb-1">
                  <Mail size={13} className="text-primary" /> Email
                </div>
                <p className="text-[13px] text-white truncate">
                  {getField(visitor, ["VV_Email", "Email"], "N/A")}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-10">
              {[
                { icon: CalendarCheck, label: "Instant Request" },
                { icon: Clock, label: "Real-time Status" },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-white/80 bg-white/10 border border-white/15"
                  style={{ backdropFilter: "blur(8px)" }}
                >
                  <Icon size={14} className="text-primary" />
                  {label}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={handleContinue}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-[10px] text-white font-bold text-[15px] transition-all active:scale-95"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-primary), #A60D26)",
                boxShadow: "0 6px 24px rgba(200,16,46,0.4)",
              }}
            >
              Continue
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-default)] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-xl bg-[var(--color-bg-paper)] border border-[var(--color-border-soft)] rounded-[16px] shadow-2xl overflow-hidden">
        <div className="h-1 bg-primary" />
        <div className="p-8 sm:p-10 text-center">
          {status === "loading" && (
            <>
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto mb-6">
                <Loader2 size={28} className="animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                Validating Profile Link
              </h1>
              <p className="text-[13px] text-[var(--color-text-secondary)]">
                Please wait while we check your visitor profile token.
              </p>
            </>
          )}

          {status === "invalid" && (
            <>
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={30} />
              </div>
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                Invalid Or Expired Link
              </h1>
              <p className="text-[13px] text-[var(--color-text-secondary)] leading-6 max-w-md mx-auto">
                {message || "This visitor profile link is no longer active. Please contact the host or administrator for a new link."}
              </p>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProfileToken;
