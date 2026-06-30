import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  FileText,
  Users,
  Briefcase,
  Star,
  Settings,
  ChevronLeft,
  ChevronRight,
  Layers,
} from "lucide-react";
import { cn } from "../../lib/utils";

const navItems = [
  { icon: Home,     label: "Home",           to: "/workspace" },
  { icon: FileText, label: "My Sheets",      to: "/workspace/sheets" },
  { icon: Users,    label: "Community",      to: "/workspace/community" },
  { icon: Briefcase,label: "Company-Wise Kit",to: "/workspace/company-kit" },
  { icon: Star,     label: "Bookmarks",      to: "/workspace/bookmarks" },
];

const linkCls = ({ isActive }) =>
  cn(
    "flex items-center gap-3.5 w-full px-3 py-2.5 rounded-xl transition-all duration-200 group text-sm font-medium",
    isActive
      ? "bg-orange-500/10 text-orange-500 shadow-[inset_0_0_0_1px_rgba(249,115,22,0.25)]"
      : "text-gray-400 hover:bg-white/5 hover:text-white",
  );

export default function WorkspaceSidebar({ collapsed, setCollapsed }) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-[72px] h-[calc(100vh-72px)] bg-[#0f0f0f] border-r border-gray-800 flex flex-col z-40 transition-all duration-300",
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
        <button className="flex items-center gap-3.5 w-full px-3 py-2.5 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-200 text-sm font-medium group">
          <Settings className="w-[18px] h-[18px] shrink-0 group-hover:rotate-45 transition-transform duration-300" />
          {!collapsed && <span>Settings</span>}
        </button>

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
  );
}
