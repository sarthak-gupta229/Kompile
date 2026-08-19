import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import GridComponent from "../../components/GridComponent";
import { loginUser } from "../../api/auth.api";
import { Toaster, toast } from "react-hot-toast";

// icons
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

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const { login } = useContext(UserContext);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({
        email: form.email,
        password: form.password,
      });
      if (response.statusCode === 200) {
        toast.success(response.message || "Logged in successfully!");
        login(response.data.user);
        navigate(`/workspace/profile/${response.data.user.username}`);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed. Please try again.";
      toast.error(message);
      console.log(error);
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

  return (
    <GridComponent>
      <div className="min-h-screen flex flex-col font-sans">
        <Toaster position="top-right" reverseOrder={false} />
        <nav className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-white/[0.07]">
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
              className="text-orange-500 font-medium text-sm md:text-[15px] no-underline"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-orange-500 text-white px-4 md:px-5 py-2 rounded-lg font-semibold text-sm md:text-[15px] no-underline hover:bg-orange-600 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </nav>

        <div className="flex flex-1">
          <div className="flex flex-col justify-start md:justify-center w-full md:w-[48%] px-6 sm:px-10 md:px-16 lg:px-20 py-6 md:py-8">
            <div>
              <h1 className="text-white text-3xl md:text-[38px] font-extrabold mb-1.5 tracking-tight">
                Sign in
              </h1>
              <p className="text-gray-400 text-sm mb-5">
                Don't have an account yet?{" "}
                <Link
                  to="/register"
                  className="text-blue-500 font-medium no-underline hover:text-blue-400 transition-colors"
                >
                  Sign up here
                </Link>
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-gray-300 text-sm">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter email address"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-gray-300 text-sm">
                      Password
                    </label>
                    <span className="text-orange-500 text-sm">
                      Forgot password?
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl px-4 py-2.5 pr-12 text-white text-sm placeholder-gray-600 outline-none focus:border-orange-500 transition-colors"
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

                <button
                  id="login-submit"
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-semibold text-base rounded-xl py-2.5 mt-1 cursor-pointer border-none transition-all duration-200 shadow-lg shadow-orange-500/20"
                >
                  Sign in
                </button>

                <p className="text-center text-gray-400 text-sm mt-1">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-orange-500 font-semibold no-underline hover:text-orange-400 transition-colors"
                  >
                    Sign up
                  </Link>
                </p>
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

export default Login;
