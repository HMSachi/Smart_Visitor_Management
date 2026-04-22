import React from 'react';
import { Link } from 'react-router-dom';
import WelcomeSection from './WelcomeSection';

const HomeMain = () => {
  return (
    <div className="bg-[var(--color-bg-default)]">
      <WelcomeSection />

      {/* Footer */}
      <footer
        className="py-8 px-6"
        style={{ background: 'var(--color-bg-paper)', borderTop: '1px solid var(--color-border-soft)' }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <img src="/logo_mas.png" alt="MAS Logo" className="h-5 w-auto opacity-60" />
            <p className="text-[var(--color-text-dim)] text-[12px] font-medium">
              Smart Visitor Portal · MAS Holdings
            </p>
          </div>

          <p className="text-[var(--color-text-dim)] text-[12px]">
            © {new Date().getFullYear()} MAS Holdings. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <Link to="/privacy" className="text-[12px] text-[var(--color-text-dim)] hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-[12px] text-[var(--color-text-dim)] hover:text-primary transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeMain;
