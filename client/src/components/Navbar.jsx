import { Link, NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth.api";
import { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "../context/UserContext.jsx";
import {
  User,
  Settings,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

const navLinkCls = ({ isActive }) =>
  isActive
    ? "text-orange-500 font-semibold drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] transition"
    : "text-gray-300 hover:text-white transition";

function Navbar() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const handleLogout = async () => {
    setDropdownOpen(false);
    setMobileOpen(false);
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      logout();
      navigate("/login");
    }
  };

  const isLoggedIn = user && user.email;

  const initials = (() => {
    if (user?.firstName && user?.lastName)
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    if (user?.name) return user.name.slice(0, 2).toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return "U";
  })();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    {
      icon: User,
      label: "Profile",
      to: `/workspace/profile/${user?.username ?? ""}`,
    },
    { icon: Settings, label: "Settings", to: "/user_data" },
    { icon: LayoutDashboard, label: "Workspace", to: "/workspace" },
  ];

  const navLinks = [
    { label: "Home", to: "/", end: true },
    { label: "Event Tracker", to: "/events" },
    { label: "Company Wise Kit", to: "/company" },
    { label: "Workspace", to: "/workspace" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-black/50 backdrop-blur-md border-b border-gray-800/60 px-6 py-3 flex items-center justify-between h-18 z-50">
      <Link to="/" className="flex items-center gap-2 box-border">
        <img
          src="/assets/face-removebg-preview 1.png"
          alt="logo image"
          className="w-auto h-15"
        />
        <h2 className="text-white font-black text-3xl">
          Kom<span className="text-orange-500">pile</span>
        </h2>
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-8 text-sm">
        {navLinks.map(({ label, to, end }) => (
          <NavLink key={to} to={to} end={end} className={navLinkCls}>
            {label}
          </NavLink>
        ))}

        {isLoggedIn ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 px-2 py-1 rounded-full border border-gray-700 hover:border-orange-500/60 bg-[#1a1a1a] hover:bg-[#222] transition-all duration-200 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                {initials}
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 group-hover:text-white transition-all duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-[#111111] border border-gray-800 rounded-xl shadow-2xl shadow-black/60 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-3 border-b border-gray-800">
                  <p className="text-white text-sm font-semibold truncate">
                    {user.firstName
                      ? `${user.firstName} ${user.lastName}`
                      : user.name || "User"}
                  </p>
                  <p className="text-gray-500 text-xs truncate mt-0.5">
                    {user.email}
                  </p>
                </div>

                <div className="py-1">
                  {menuItems.map(({ icon: Icon, label, to }) => (
                    <button
                      key={to}
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate(to);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-150 group"
                    >
                      <Icon className="w-4 h-4 text-gray-500 group-hover:text-orange-400 transition-colors duration-150" />
                      {label}
                    </button>
                  ))}
                </div>

                <div className="border-t border-gray-800 py-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all duration-150 group"
                  >
                    <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="px-5 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-orange-500/30"
          >
            Login
          </Link>
        )}
      </div>

      {/* Hamburger button — mobile only */}
      <button
        className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-gray-700 bg-[#1a1a1a] text-gray-300 hover:text-white hover:border-orange-500/60 transition-all"
        onClick={() => setMobileOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden absolute top-full left-0 w-full bg-black/70 backdrop-blur-md border-b border-gray-800/60 shadow-2xl shadow-black/60 flex flex-col px-6 py-4 gap-1 z-40"
          style={{ animation: "slideDownMobile 0.2s ease" }}
        >
          <style>{`
            @keyframes slideDownMobile {
              from { opacity: 0; transform: translateY(-8px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          {navLinks.map(({ label, to, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "text-orange-500 bg-orange-500/8"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          <div className="my-2 border-t border-gray-800" />

          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold shadow-md shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold truncate">
                    {user.firstName
                      ? `${user.firstName} ${user.lastName}`
                      : user.name || "User"}
                  </p>
                  <p className="text-gray-500 text-xs truncate">{user.email}</p>
                </div>
              </div>

              {menuItems.map(({ icon: Icon, label, to }) => (
                <button
                  key={to}
                  onClick={() => {
                    setMobileOpen(false);
                    navigate(to);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all group"
                >
                  <Icon className="w-4 h-4 text-gray-500 group-hover:text-orange-400 transition-colors" />
                  {label}
                </button>
              ))}

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-lg transition-all mt-1 group"
              >
                <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                Log Out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="mt-1 w-full text-center px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-all shadow-md"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
