import { useLocation, useNavigate } from "react-router-dom";

export default function MobileBlocker() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Only block mobile on workspace routes
  const isWorkspace = pathname.startsWith("/workspace");

  if (!isWorkspace) return null;

  return (
    <>
      <style>{`
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
          animation: mbFadeIn 0.3s ease;
        }

        @media (max-width: 1279px) {
          .mobile-blocker-overlay {
            display: flex;
          }
        }

        @keyframes mbFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @keyframes mbSlideUp {
          from { opacity: 0; margin-top: 28px; }
          to   { opacity: 1; margin-top: 0px;  }
        }

        .mobile-blocker-card {
          position: relative;
          background: linear-gradient(135deg, rgba(24,24,24,0.97) 0%, rgba(10,10,10,0.99) 100%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 48px 32px 48px;
          max-width: 360px;
          width: calc(100vw - 48px);
          text-align: center;
          box-shadow: 0 0 0 1px rgba(255,100,0,0.15), 0 32px 80px rgba(0,0,0,0.8);
          animation: mbSlideUp 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
        }

        .mobile-blocker-back {
          position: absolute;
          top: 16px;
          left: 16px;
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 6px 12px 6px 8px;
          color: rgba(255,255,255,0.6);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }

        .mobile-blocker-back:hover {
          background: rgba(255,100,0,0.12);
          border-color: rgba(255,100,0,0.3);
          color: #ff6400;
        }

        .mobile-blocker-glow {
          position: absolute;
          top: -80px;
          left: 50%;
          transform: translateX(-50%);
          width: 280px;
          height: 280px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,100,0,0.22) 0%, transparent 70%);
          filter: blur(40px);
          pointer-events: none;
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

      {/* Overlay is the flex centering container — card is just a child */}
      <div className="mobile-blocker-overlay">
        <div className="mobile-blocker-card">
          <div className="mobile-blocker-glow" />

          {/* Back arrow */}
          <button
            className="mobile-blocker-back"
            onClick={() => navigate("/")}
            aria-label="Go back to home"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>

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
