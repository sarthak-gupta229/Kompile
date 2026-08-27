import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import GridComponent from "../../components/GridComponent";
import { verifyEmail, resendEmailVerification } from "../../api/auth.api";
import toast, { Toaster } from "react-hot-toast";
import DigitalRain from "../../components/DigitalRain";

const ArrowLeft = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const MailIcon = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#f97316"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#22c55e"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const XCircleIcon = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ef4444"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6M9 9l6 6" />
  </svg>
);

const LoaderIcon = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#f97316"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ animation: "ev-spin 1s linear infinite" }}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const RefreshIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);

const STATUS = {
  IDLE: "idle",
  VERIFYING: "verifying",
  SUCCESS: "success",
  ERROR: "error",
};

function ResendButton({ resending, cooldown, onResend }) {
  const disabled = resending || cooldown > 0;
  return (
    <button
      id="ev-resend-btn"
      onClick={onResend}
      disabled={disabled}
      className="w-full flex items-center justify-center gap-2 bg-[#1c1c1c] hover:bg-[#242424] disabled:opacity-50 disabled:cursor-not-allowed border border-[#2e2e2e] hover:border-orange-500/50 text-white font-semibold text-sm rounded-xl py-2.5 cursor-pointer transition-all duration-200"
    >
      {resending ? (
        <>
          <span
            className="inline-block w-4 h-4 border-2 border-white/20 border-t-orange-500 rounded-full"
            style={{ animation: "ev-spin 0.8s linear infinite" }}
          />
          Sending…
        </>
      ) : cooldown > 0 ? (
        `Resend in ${cooldown}s`
      ) : (
        <>
          <RefreshIcon />
          Resend verification email
        </>
      )}
    </button>
  );
}

export default function EmailVerification() {
  const { token } = useParams();
  const navigate = useNavigate();
  // Read the email that was stored in sessionStorage during registration.
  // The user is NOT authenticated at this point.
  const [pendingEmail] = useState(
    () => sessionStorage.getItem("pendingVerificationEmail") || "",
  );
  const [status, setStatus] = useState(token ? STATUS.VERIFYING : STATUS.IDLE);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const verificationAttempted = useRef(false);

  useEffect(() => {
    if (!token) return;
    if (verificationAttempted.current) return;
    verificationAttempted.current = true;

    const doVerify = async () => {
      try {
        await verifyEmail(token);
        // Clear the stored email — verification is done.
        sessionStorage.removeItem("pendingVerificationEmail");
        setStatus(STATUS.SUCCESS);
      } catch (err) {
        setStatus(STATUS.ERROR);
      }
    };
    doVerify();
  }, [token]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(
      () => setResendCooldown((c) => Math.max(0, c - 1)),
      1000,
    );
    return () => clearInterval(id);
  }, [resendCooldown]);

  const handleResend = async () => {
    if (resending || resendCooldown > 0) return;
    if (!pendingEmail) {
      toast.error(
        "Could not determine your email. Please try signing up again.",
      );
      return;
    }
    setResending(true);
    try {
      await resendEmailVerification(pendingEmail);
      toast.success("Verification email sent! Check your inbox.");
      setResendCooldown(60);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to resend. Please try again.",
      );
    } finally {
      setResending(false);
    }
  };

  const panels = {
    [STATUS.VERIFYING]: {
      icon: <LoaderIcon />,
      iconBg: "rgba(249,115,22,0.08)",
      title: "Verifying your email…",
      subtitle: "Please wait while we confirm your email address.",
      body: null,
    },
    [STATUS.SUCCESS]: {
      icon: <CheckCircleIcon />,
      iconBg: "rgba(34,197,94,0.08)",
      title: "Email verified!",
      subtitle: "Your account is now active. You can now log in to Kompile.",
      body: (
        <button
          id="ev-go-login"
          onClick={() => navigate("/login")}
          className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-semibold text-sm rounded-xl py-2.5 cursor-pointer border-none transition-all duration-200 shadow-lg shadow-orange-500/20"
        >
          Continue to Login
        </button>
      ),
    },
    [STATUS.ERROR]: {
      icon: <XCircleIcon />,
      iconBg: "rgba(239,68,68,0.08)",
      title: "Link expired or already used",
      subtitle:
        "This can happen if you requested a new verification email — the old link is replaced. Click below to get a fresh link.",
      body: (
        <ResendButton
          resending={resending}
          cooldown={resendCooldown}
          onResend={handleResend}
        />
      ),
    },
    [STATUS.IDLE]: {
      icon: <MailIcon />,
      iconBg: "rgba(249,115,22,0.08)",
      title: "Check your inbox",
      subtitle:
        "We sent a verification link to your email. Click it to activate your account.",
      body: (
        <div className="flex flex-col gap-3">
          <ResendButton
            resending={resending}
            cooldown={resendCooldown}
            onResend={handleResend}
          />
          <p className="text-gray-500 text-xs text-center">
            Remember to check your{" "}
            <span className="text-gray-400">spam / junk</span> folder too.
          </p>
        </div>
      ),
    },
  };

  const panel = panels[status];

  return (
    <GridComponent>
      <style>{`
        @keyframes ev-spin { to { transform: rotate(360deg); } }
        @keyframes ev-fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ev-card { animation: ev-fadeUp 0.45s cubic-bezier(.22,1,.36,1) both; }
      `}</style>
      <Toaster position="top-right" reverseOrder={false} />

      <div className="min-h-screen flex flex-col font-sans relative">
        <DigitalRain
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0.45,
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
        {/* Navbar */}
        <nav className="relative z-50 flex items-center justify-between px-6 md:px-8 py-4 border-b border-white/[0.07]">
          <div className="flex items-center gap-2.5">
            <button
              id="ev-back-btn"
              onClick={() => navigate(-1)}
              className="text-white flex items-center p-1 cursor-pointer bg-transparent border-none hover:text-orange-400 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft />
            </button>
            <Link
              to="/"
              className="text-white font-extrabold text-xl tracking-tight no-underline"
            >
              Kom<span className="text-orange-500">pile</span>
            </Link>
          </div>
          <div className="flex items-center gap-5">
            <Link
              to="/login"
              className="bg-orange-500 text-white px-4 md:px-5 py-2 rounded-lg font-semibold text-sm no-underline hover:bg-orange-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-orange-500 font-medium text-sm no-underline hover:text-orange-400 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </nav>

        {/* Main */}
        <div className="relative z-50 flex flex-1 items-center justify-center px-4 py-12">
          <div className="ev-card w-full max-w-md relative">
            {/* Glow */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full blur-3xl"
              style={{
                width: 340,
                height: 260,
                background:
                  "radial-gradient(circle, rgba(160,80,10,0.38) 0%, transparent 70%)",
                zIndex: 0,
              }}
            />

            {/* Card */}
            <div className="relative z-10 bg-[#111111] border border-white/[0.07] rounded-2xl p-8 flex flex-col items-center gap-6 shadow-2xl shadow-black/60">
              {/* Icon */}
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center transition-colors duration-300"
                style={{ background: panel.iconBg }}
              >
                {panel.icon}
              </div>

              {/* Text */}
              <div className="text-center">
                <h1 className="text-white text-2xl font-extrabold tracking-tight mb-2">
                  {panel.title}
                </h1>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                  {panel.subtitle}
                </p>
              </div>

              {/* Action */}
              {panel.body && (
                <>
                  <div className="w-full h-px bg-white/[0.06]" />
                  <div className="w-full">{panel.body}</div>
                </>
              )}

              {/* Footer */}
              <p className="text-gray-600 text-xs text-center">
                Need help?{" "}
                <span className="text-orange-500 cursor-pointer hover:text-orange-400 transition-colors">
                  Contact Support
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </GridComponent>
  );
}
