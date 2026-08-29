import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GridComponent from "../../components/GridComponent";
import { registerUser } from "../../api/auth.api";
import toast from "react-hot-toast";
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
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
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
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const ProfileIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#f97316"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const BookIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#f97316"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const TrophyIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#f97316"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="22 4 12 14.01 9 11.01" />
    <path d="M7 21h10M12 17v4" />
    <path d="M3 7V5h18v2a9 9 0 0 1-9 9 9 9 0 0 1-9-9z" />
  </svg>
);

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await registerUser({
        username: form.username,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirm,
      });

      sessionStorage.setItem("pendingVerificationEmail", form.email);
      toast.success("Account created! Please check your email to verify your account.");
      navigate("/verify-email");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed. Please try again.";
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <ProfileIcon />,
      title: "All in One Coding Profile",
      desc: "Centralize your achievements across platforms into a single, high-contrast dashboard.",
    },
    {
      icon: <BookIcon />,
      title: "Follow Popular Sheets",
      desc: "Stay organized with curated data structures and algorithms sheets from the community.",
    },
    {
      icon: <TrophyIcon />,
      title: "Contest Tracker",
      desc: "Never miss a deadline with automated alerts and precision tracking for every major competition.",
    },
  ];

  const inputCls =
    "w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:border-orange-500 transition-colors";

  return (
    <GridComponent>
      <div className="min-h-screen flex flex-col font-sans relative">
        {/* Digital Rain background */}
        <DigitalRain
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0.2,
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
        <nav className="relative z-50 flex items-center justify-between px-6 md:px-8 py-4 border-b border-white/[0.07]">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate("/")}
              className="text-white flex items-center p-1 cursor-pointer bg-transparent border-none"
            >
              <ArrowLeft />
            </button>
            <span className="text-white font-extrabold text-xl tracking-tight">
              Kom<span className="text-orange-500">pile</span>
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link
              to="/login"
              className="bg-orange-500 text-white px-4 md:px-5 py-2 rounded-lg font-semibold text-sm md:text-[15px] no-underline hover:bg-orange-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-orange-500 font-medium text-sm md:text-[15px] no-underline"
            >
              Sign Up
            </Link>
          </div>
        </nav>

        <div className="relative z-50 flex flex-1">
          <div className="flex flex-col justify-center items-center w-full md:w-[48%] px-6 sm:px-10 md:px-16 lg:px-20 py-6 md:py-8">
            <div className="w-full max-w-sm md:max-w-none">
              <h1 className="text-white text-3xl md:text-[38px] font-extrabold mb-1.5 tracking-tight">
                Create account
              </h1>
              <p className="text-gray-400 text-sm mb-5">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-500 font-medium no-underline hover:text-blue-400 transition-colors"
                >
                  Sign in here
                </Link>
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-gray-300 text-sm flex items-center gap-1">
                    Username
                    <span className="text-orange-500 text-xs font-bold">*</span>
                  </label>
                  <input
                    id="name"
                    name="username"
                    type="text"
                    required
                    autoComplete="username"
                    placeholder="Enter your username"
                    value={form.username}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="reg-email" className="text-gray-300 text-sm flex items-center gap-1">
                    Email address
                    <span className="text-orange-500 text-xs font-bold">*</span>
                  </label>
                  <input
                    id="reg-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Enter email address"
                    value={form.email}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="reg-password"
                    className="text-gray-300 text-sm flex items-center gap-1"
                  >
                    Password
                    <span className="text-orange-500 text-xs font-bold">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="reg-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      placeholder="Create a password"
                      value={form.password}
                      onChange={handleChange}
                      className={`${inputCls} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors bg-transparent border-none flex items-center cursor-pointer"
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="reg-confirm"
                    className="text-gray-300 text-sm flex items-center gap-1"
                  >
                    Confirm password
                    <span className="text-orange-500 text-xs font-bold">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="reg-confirm"
                      name="confirm"
                      type={showConfirm ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      placeholder="Re-enter your password"
                      value={form.confirm}
                      onChange={handleChange}
                      className={`${inputCls} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors bg-transparent border-none flex items-center cursor-pointer"
                    >
                      {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}
                <button
                  id="register-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-base rounded-xl py-2.5 mt-1 cursor-pointer border-none transition-all duration-200 shadow-lg shadow-orange-500/20"
                >
                  {loading ? "Creating account..." : "Create account"}
                </button>

               
                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px bg-[#2e2e2e]" />
                  <span className="text-zinc-500 text-xs">or</span>
                  <div className="flex-1 h-px bg-[#2e2e2e]" />
                </div>

              
                <a
                  id="google-signup"
                  href={`${import.meta.env.VITE_API_BASE_URL?.replace("/api/v1", "") ?? "http://localhost:8000"}/api/v1/auth/google`}
                  className="w-full flex items-center justify-center gap-3 bg-[#1c1c1c] hover:bg-[#252525] border border-[#2e2e2e] hover:border-[#444] text-white font-medium text-sm rounded-xl py-2.5 transition-all duration-200 cursor-pointer no-underline"
                >
                  <svg width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  Sign up with Google
                </a>
              </form>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-500 text-xs leading-relaxed mb-1.5">
                By signing in or creating an account, you are agreeing to our{" "}
                <span className="text-blue-500">
                  Terms &amp; Conditions
                </span>{" "}
                and our{" "}
                <span className="text-blue-500">
                  Privacy Policy
                </span>
                .
              </p>
              <p className="text-gray-500 text-xs">
                © 2024 Kompile.&nbsp;&nbsp;&nbsp;
                <span className="underline cursor-pointer">
                  Contact Support
                </span>
              </p>
            </div>
          </div>

          <div className="hidden md:flex flex-1 flex-col items-center justify-center px-10 lg:px-16 py-8 relative overflow-hidden">
            <div
              className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(160,80,10,0.45) 0%, transparent 68%)",
              }}
            />

            <img
              src="/assets/logos/hi_logo.png"
              alt="Kompile mascot"
              className="w-36 h-auto relative z-10 mb-3"
            />

            <h2 className="text-white text-xl font-bold text-center mb-2 relative z-10">
              Welcome to Kompile
            </h2>
            <p className="text-gray-400 text-xs text-center leading-relaxed max-w-[300px] mb-6 relative z-10">
              Your high-performance utility for technical excellence and
              precision retrieval.
            </p>

            <div className="flex flex-col gap-2.5 w-full max-w-[400px] relative z-10">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="bg-[#1a1a1a] border border-white/[0.07] rounded-xl py-2.5 px-3.5 flex items-start gap-3.5"
                >
                  <div className="bg-orange-500/10 rounded-lg w-10 h-10 shrink-0 flex items-center justify-center">
                    {f.icon}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm mb-1">
                      {f.title}
                    </div>
                    <div className="text-gray-400 text-xs leading-snug">
                      {f.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </GridComponent>
  );
}

export default Register;
