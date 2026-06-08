import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useThemeMode } from '../../../theme/ThemeModeContext';
import { ArrowRight, CalendarCheck, Clock, User, Mail, Briefcase } from 'lucide-react';

const WelcomeSection = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.login);
  const { themeMode } = useThemeMode();
  const isLight = themeMode === 'light';

  const [visitorProfile, setVisitorProfile] = useState(null);

  useEffect(() => {
    const profileStr = localStorage.getItem("visitor_profile");
    if (profileStr) {
      try {
        setVisitorProfile(JSON.parse(profileStr));
      } catch (e) {
        console.error("Failed to parse visitor profile", e);
      }
    }
  }, []);

  const visitorName = visitorProfile?.VV_Name || visitorProfile?.Visitor_Name || visitorProfile?.Name;
  const isVisitor = user?.ResultSet?.[0]?.VA_Role === 'Visitor' || visitorProfile !== null;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-[68px]">
      {/* Background image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/main.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: '50% 30%',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay */}
        <div className={`absolute inset-0 ${isLight ? 'bg-white/40' : 'bg-black/60'}`} />
        {/* Left gradient */}
        <div
          className={`absolute inset-y-0 left-0 w-full lg:w-3/5 bg-gradient-to-r ${isLight ? 'from-white/90 via-white/50 to-transparent' : 'from-black/90 via-black/50 to-transparent'}`}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 py-16">
        <div className="max-w-2xl">
          {/* Eyebrow tag */}
          <div className="mb-6">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase"
              style={{
                background: 'rgba(200,16,46,0.15)',
                border: '1px solid rgba(200,16,46,0.3)',
                color: '#C8102E',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              MAS Holdings — Visitor Portal
            </span>
          </div>

          {/* Headline */}
          <h1
            className={`font-black leading-[1.1] tracking-tight mb-6 m-0 p-0 ${isLight ? 'text-[var(--color-text-primary)]' : 'text-white'}`}
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)' }}
          >
            {visitorName ? (
              <>Welcome, {visitorName}<br /></>
            ) : (
              <>Book Your Visit<br /></>
            )}
            <span className="text-primary">{visitorName ? 'To Your Portal' : 'Fast & Securely'}</span>
          </h1>

          {/* Subtext */}
          <p
            className={`text-base sm:text-lg font-medium leading-relaxed mb-6 max-w-xl ${isLight ? 'text-[var(--color-text-secondary)]' : 'text-white/75'}`}
          >
            A simple, smart, and secure way to request access to{' '}
            <span className="text-primary font-bold">MAS Holdings</span> facilities.
            Get in, get checked, and get going — in minutes.
          </p>

          {/* Visitor Details (if available) */}
          {visitorProfile && (
            <div className={`p-4 rounded-xl mb-8 flex flex-col sm:flex-row gap-4 sm:gap-8 ${isLight ? 'bg-white/60 border border-gray-200' : 'bg-white/10 border border-white/10 backdrop-blur-md'}`}>
              {(visitorProfile.VV_Email || visitorProfile.Email) && (
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-primary" />
                  <span className={`text-[13px] font-medium ${isLight ? 'text-[var(--color-text-primary)]' : 'text-white/90'}`}>
                    {visitorProfile.VV_Email || visitorProfile.Email}
                  </span>
                </div>
              )}
              {(visitorProfile.VV_Company || visitorProfile.Company) && (
                <div className="flex items-center gap-2">
                  <Briefcase size={16} className="text-primary" />
                  <span className={`text-[13px] font-medium ${isLight ? 'text-[var(--color-text-primary)]' : 'text-white/90'}`}>
                    {visitorProfile.VV_Company || visitorProfile.Company}
                  </span>
                </div>
              )}
              {(visitorProfile.VV_NIC_Passport_NO || visitorProfile.NIC) && (
                <div className="flex items-center gap-2">
                  <User size={16} className="text-primary" />
                  <span className={`text-[13px] font-medium ${isLight ? 'text-[var(--color-text-primary)]' : 'text-white/90'}`}>
                    {visitorProfile.VV_NIC_Passport_NO || visitorProfile.NIC}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 mb-10">
            {[
              { icon: CalendarCheck, label: 'Instant Request' },
              { icon: Clock, label: 'Real-time Status' },
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${isLight ? 'text-[var(--color-text-primary)] bg-white/70' : 'text-white/80 bg-white/10'}`}
                style={{ backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                <Icon size={14} className="text-primary" />
                {label}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {isVisitor ? (
              <button
                onClick={() => navigate('/visitor/my-requests')}
                className="flex items-center justify-center gap-1.5 px-8 py-4 rounded-2xl text-white font-bold text-[15px] transition-all active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, var(--color-primary), #A60D26)',
                  boxShadow: '0 6px 24px rgba(200,16,46,0.4)',
                }}
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                My Visit Requests
                <ArrowRight size={18} />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
