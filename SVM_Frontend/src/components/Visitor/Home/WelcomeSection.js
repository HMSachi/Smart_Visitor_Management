import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useThemeMode } from '../../../theme/ThemeModeContext';
import { ArrowRight, CalendarCheck, Clock } from 'lucide-react';

const WelcomeSection = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.login);
  const { themeMode } = useThemeMode();
  const isVisitor = user?.ResultSet?.[0]?.VA_Role === 'Visitor';
  const isLight = themeMode === 'light';

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
            Book Your Visit<br />
            <span className="text-primary">Fast &amp; Securely</span>
          </h1>

          {/* Subtext */}
          <p
            className={`text-base sm:text-lg font-medium leading-relaxed mb-10 max-w-xl ${isLight ? 'text-[var(--color-text-secondary)]' : 'text-white/75'}`}
          >
            A simple, smart, and secure way to request access to{' '}
            <span className="text-primary font-bold">MAS Holdings</span> facilities.
            Get in, get checked, and get going — in minutes.
          </p>

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
                className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-white font-bold text-[15px] transition-all active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, var(--color-primary), #A60D26)',
                  boxShadow: '0 6px 24px rgba(200,16,46,0.4)',
                }}
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                My Visit Requests
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                onClick={() => navigate('/request-step-1')}
                className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-white font-bold text-[15px] transition-all active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, var(--color-primary), #A60D26)',
                  boxShadow: '0 6px 24px rgba(200,16,46,0.4)',
                }}
              >
                Request a Visit
                <ArrowRight size={18} />
              </button>
            )}

            <button
              onClick={() => navigate('/status')}
              className={`flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-[15px] transition-all active:scale-95 ${isLight ? 'bg-white/80 text-gray-800' : 'bg-white/10 text-white'}`}
              style={{ backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              Check Visit Status
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
