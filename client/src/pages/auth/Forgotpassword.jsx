import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import GridComponent from "../../components/GridComponent";
import { forgotPassword, resetPassword } from "../../api/auth.api";
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

const KeyIcon = () => (
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
    <circle cx="7.5" cy="15.5" r="5.5" />
    <path d="m21 2-9.6 9.6" />
    <path d="m15.5 7.5 3 3L22 7l-3-3" />
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
    style={{ animation: "fp-spin 1s linear infinite" }}
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

const EyeIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

const STATUS = {
  REQUEST: "request",
  SENT: "sent",
  RESET_FORM: "reset_form",
  RESET_SUCCESS: "reset_success",
  RESET_ERROR: "reset_error",
};

export default function Forgotpassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [status, setStatus] = useState(
    token ? STATUS.RESET_FORM : STATUS.REQUEST
  );
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (token) {
      setStatus(STATUS.RESET_FORM);
    } else {
      setStatus(STATUS.REQUEST);
    }
  }, [token]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(() => {
      setResendCooldown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);

  const handleRequestReset = async (e) => {
    if (e) e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      await forgotPassword({ email: email.trim() });
      setStatus(STATUS.SENT);
      setResendCooldown(60);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to send reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    if (e) e.preventDefault();

    if (!newPassword) {
      toast.error("Please enter your new password");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ resetToken: token, newPassword });
      setStatus(STATUS.RESET_SUCCESS);
      toast.success("Password reset successfully!");
    } catch (err) {
      setStatus(STATUS.RESET_ERROR);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Token is invalid or expired."
      );
    } finally {
      setLoading(false);
    }
  };

  const panels = {
    [STATUS.REQUEST]: {
      icon: <KeyIcon />,
      iconBg: "rgba(249,115,22,0.08)",
      title: "Forgot password?",
      subtitle:
        "No worries! Enter your registered email address and we'll send you a password reset link.",
      body: (
        <form onSubmit={handleRequestReset} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 text-left">
            <label htmlFor="fp-email" className="text-gray-300 text-sm font-medium">
              Email address
            </label>
            <input
              id="fp-email"
              type="email"
              required
              autoFocus
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          <button
            id="fp-submit-btn"
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl py-2.5 cursor-pointer border-none transition-all duration-200 shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 mt-1"
          >
            {loading ? (
              <>
                <span
                  className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full"
                  style={{ animation: "fp-spin 0.8s linear infinite" }}
                />
                Sending link…
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full text-xs text-gray-400 hover:text-white transition-colors py-1 cursor-pointer bg-transparent border-none"
          >
            Return to sign in
          </button>
        </form>
      ),
    },

    [STATUS.SENT]: {
      icon: <MailIcon />,
      iconBg: "rgba(249,115,22,0.08)",
      title: "Check your inbox",
      subtitle: `We've sent a password reset link to ${email || "your email"}. Click the link inside to set a new password.`,
      body: (
        <div className="flex flex-col gap-3">
          <button
            id="fp-resend-btn"
            onClick={handleRequestReset}
            disabled={loading || resendCooldown > 0}
            className="w-full flex items-center justify-center gap-2 bg-[#1c1c1c] hover:bg-[#242424] disabled:opacity-50 disabled:cursor-not-allowed border border-[#2e2e2e] hover:border-orange-500/50 text-white font-semibold text-sm rounded-xl py-2.5 cursor-pointer transition-all duration-200"
          >
            {loading ? (
              <>
                <span
                  className="inline-block w-4 h-4 border-2 border-white/20 border-t-orange-500 rounded-full"
                  style={{ animation: "fp-spin 0.8s linear infinite" }}
                />
                Sending…
              </>
            ) : resendCooldown > 0 ? (
              `Resend in ${resendCooldown}s`
            ) : (
              <>
                <RefreshIcon />
                Resend reset email
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-semibold text-sm rounded-xl py-2.5 cursor-pointer border-none transition-all duration-200 shadow-lg shadow-orange-500/20"
          >
            Back to Login
          </button>

          <p className="text-gray-500 text-xs text-center mt-1">
            Didn't receive the email? Check your{" "}
            <span className="text-gray-400">spam/junk</span> folder.
          </p>
        </div>
      ),
    },

    [STATUS.RESET_FORM]: {
      icon: <KeyIcon />,
      iconBg: "rgba(249,115,22,0.08)",
      title: "Set new password",
      subtitle: "Please create a strong password containing at least 6 characters.",
      body: (
        <form onSubmit={handleResetPassword} className="flex flex-col gap-4 text-left">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="fp-new-password" className="text-gray-300 text-sm font-medium">
              New Password
            </label>
            <div className="relative">
              <input
                id="fp-new-password"
                type={showPassword ? "text" : "password"}
                required
                autoFocus
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:border-orange-500 transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors bg-transparent border-none cursor-pointer"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="fp-confirm-password" className="text-gray-300 text-sm font-medium">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="fp-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:border-orange-500 transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors bg-transparent border-none cursor-pointer"
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <button
            id="fp-reset-btn"
            type="submit"
            disabled={loading || !newPassword || !confirmPassword}
            className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl py-2.5 cursor-pointer border-none transition-all duration-200 shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 mt-1"
          >
            {loading ? (
              <>
                <span
                  className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full"
                  style={{ animation: "fp-spin 0.8s linear infinite" }}
                />
                Resetting password…
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      ),
    },

    [STATUS.RESET_SUCCESS]: {
      icon: <CheckCircleIcon />,
      iconBg: "rgba(34,197,94,0.08)",
      title: "Password reset complete!",
      subtitle:
        "Your password has been updated successfully. You can now sign in with your new credentials.",
      body: (
        <button
          id="fp-go-login"
          onClick={() => navigate("/login")}
          className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-semibold text-sm rounded-xl py-2.5 cursor-pointer border-none transition-all duration-200 shadow-lg shadow-orange-500/20"
        >
          Continue to Sign In
        </button>
      ),
    },

    [STATUS.RESET_ERROR]: {
      icon: <XCircleIcon />,
      iconBg: "rgba(239,68,68,0.08)",
      title: "Invalid or expired link",
      subtitle:
        "This password reset link is invalid or has already expired. Please request a new link.",
      body: (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              navigate("/forgot-password");
              setStatus(STATUS.REQUEST);
            }}
            className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-semibold text-sm rounded-xl py-2.5 cursor-pointer border-none transition-all duration-200 shadow-lg shadow-orange-500/20"
          >
            Request New Reset Link
          </button>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full text-xs text-gray-400 hover:text-white transition-colors py-1 cursor-pointer bg-transparent border-none"
          >
            Return to sign in
          </button>
        </div>
      ),
    },
  };

  const panel = panels[status] || panels[STATUS.REQUEST];

  return (
    <GridComponent>
      <style>{`
        @keyframes fp-spin { to { transform: rotate(360deg); } }
        @keyframes fp-fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fp-card { animation: fp-fadeUp 0.45s cubic-bezier(.22,1,.36,1) both; }
      `}</style>
      <Toaster position="top-right" reverseOrder={false} />

      <div className="min-h-screen flex flex-col font-sans relative">
        {/* Digital Rain background */}
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
              id="fp-back-btn"
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

        {/* Main Content */}
        <div className="relative z-50 flex flex-1 items-center justify-center px-4 py-12">
          <div className="fp-card w-full max-w-md relative">
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

              {/* Action / Form */}
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