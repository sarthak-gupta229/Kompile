export default function MobileBlocker() {
  return (
    <>
      <style>{`
        /* Hidden on desktop (≥1280px) */
        .mobile-blocker-overlay {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 9999;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(20px) saturate(0.5);
          -webkit-backdrop-filter: blur(20px) saturate(0.5);
          animation: fadeInBlocker 0.35s ease;
        }

        /* Show on any screen narrower than 1280px */
        @media (max-width: 1279px) {
          .mobile-blocker-overlay {
            display: flex;
          }
        }

        @keyframes fadeInBlocker {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @keyframes slideUpBlocker {
          from { opacity: 0; transform: translateY(28px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .mobile-blocker-glow {
          position: absolute;
          width: 340px;
          height: 340px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,100,0,0.25) 0%, transparent 70%);
          filter: blur(40px);
          pointer-events: none;
        }

        .mobile-blocker-card {
          position: relative;
          background: linear-gradient(135deg, rgba(24,24,24,0.95) 0%, rgba(10,10,10,0.98) 100%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 48px 40px;
          max-width: 360px;
          width: 88%;
          text-align: center;
          box-shadow: 0 0 0 1px rgba(255,100,0,0.15), 0 32px 80px rgba(0,0,0,0.8);
          animation: slideUpBlocker 0.4s cubic-bezier(0.34,1.56,0.64,1);
        }

        .mobile-blocker-icon-wrap {
          width: 64px;
          height: 64px;
          margin: 0 auto 24px;
          border-radius: 18px;
          background: linear-gradient(135deg, rgba(255,100,0,0.2), rgba(255,60,0,0.08));
          border: 1px solid rgba(255,100,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-blocker-title {
          margin: 0 0 12px;
          font-size: 22px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.3px;
          line-height: 1.25;
        }

        .mobile-blocker-body {
          margin: 0 0 28px;
          font-size: 14px;
          color: rgba(255,255,255,0.5);
          line-height: 1.65;
        }

        .mobile-blocker-body strong {
          color: rgba(255,255,255,0.85);
          font-weight: 500;
        }

        .mobile-blocker-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,100,0,0.35), transparent);
          margin-bottom: 20px;
        }

        .mobile-blocker-hint {
          margin: 0;
          font-size: 12px;
          color: rgba(255,255,255,0.28);
          letter-spacing: 0.3px;
        }
      `}</style>

      <div className="mobile-blocker-overlay">
        <div className="mobile-blocker-glow" />

        <div className="mobile-blocker-card">
          <div className="mobile-blocker-icon-wrap">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ff6400"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>

          <h2 className="mobile-blocker-title">Desktop Only</h2>

          <p className="mobile-blocker-body">
            This website is not designed for mobile or tablet devices. Please
            switch to a <strong>desktop or laptop</strong> for the best
            experience.
          </p>

          <div className="mobile-blocker-divider" />

          <p className="mobile-blocker-hint">Minimum screen width: 1280px</p>
        </div>
      </div>
    </>
  );
}
