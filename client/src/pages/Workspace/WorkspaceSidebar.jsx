import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  Users,
  Briefcase,
  Settings,
  ChevronLeft,
  ChevronRight,
  Layers,
  BarChart2,
  DoorOpen,
  ShieldCheck,
} from "lucide-react";
import { cn } from "../../lib/utils";

const linkCls = ({ isActive }) =>
  cn(
    "flex items-center gap-3.5 w-full px-3 py-2.5 rounded-xl transition-all duration-200 group text-sm font-medium",
    isActive
      ? "bg-orange-500/10 text-orange-500 shadow-[inset_0_0_0_1px_rgba(249,115,22,0.25)]"
      : "text-gray-400 hover:bg-white/5 hover:text-white",
  );

export default function WorkspaceSidebar({ collapsed, setCollapsed }) {
  const { user } = useContext(UserContext);
  const { pathname } = useLocation();

  const navItems = [
    { icon: Home, label: "Home", to: "/workspace" },
    {
      icon: BarChart2,
      label: "Profile Tracker",
      to: `/workspace/profile/${user?.username ?? ""}`,
    },
    { icon: FileText, label: "My Sheets", to: "/workspace/sheets" },
    { icon: Users, label: "Community", to: "/workspace/community" },
    { icon: DoorOpen, label: "Rooms", to: "/workspace/room" },
    {
      icon: Briefcase,
      label: "Company-Wise Kit",
      to: "/workspace/company-kit",
    },
  ];
  if (["admin", "superAdmin"].includes(user?.role)) {
    navItems.push({ icon: ShieldCheck, label: "Admin panel", to: "/workspace/admin" });
  }
  return (
    <>
      <details key={pathname} className="mx-3 mt-3 rounded-xl border border-gray-800 bg-[#0f0f0f] text-white sm:mx-5 xl:hidden">
        <summary className="min-h-11 cursor-pointer px-4 py-3 text-sm font-semibold">
          Workspace navigation
        </summary>
        <nav aria-label="Workspace" className="grid gap-1 border-t border-gray-800 p-2 sm:grid-cols-2">
          {[...navItems, { icon: Settings, label: "Settings", to: "/user_data" }].map(
            ({ icon: Icon, label, to }) => (
              <NavLink key={to} to={to} className={linkCls} end>
                <Icon className="size-[18px] shrink-0" aria-hidden="true" />
                {label}
              </NavLink>
            ),
          )}
        </nav>
      </details>
      <aside
        className={cn(
          "fixed left-0 top-[72px] h-[calc(100vh-72px)] bg-[#0f0f0f] border-r border-gray-800 hidden xl:flex flex-col z-40 transition-all duration-300",
          collapsed ? "w-[68px]" : "w-60",
        )}
      >
        {!collapsed && (
          <div className="px-4 pt-5 pb-2">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-gray-500 uppercase">
              <Layers className="w-3 h-3" />
              Workspace
            </div>
          </div>
        )}

        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ icon: Icon, label, to }) => (
            <NavLink key={to} to={to} className={linkCls} end>
              <Icon className="w-[18px] h-[18px] shrink-0 transition-colors" />
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-gray-800 p-2 space-y-0.5">
          <NavLink
            to="/user_data"
            className={linkCls}
            title={collapsed ? "Settings" : undefined}
          >
            <Settings className="w-[18px] h-[18px] shrink-0 group-hover:rotate-45 transition-transform duration-300" />
            {!collapsed && <span>Settings</span>}
          </NavLink>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? "Expand" : "Collapse"}
            className="flex items-center justify-center w-full py-2 rounded-xl text-gray-500 hover:text-orange-400 hover:bg-orange-500/5 transition-all duration-200"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <div className="flex items-center gap-1.5 text-xs">
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse</span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
