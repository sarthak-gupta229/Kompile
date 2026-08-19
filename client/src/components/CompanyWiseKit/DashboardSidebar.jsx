import { 
  LayoutDashboard, 
  BookOpen, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Home,
  MessageSquare,
  Award,
  Zap
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

export function DashboardSidebar({ isCollapsed, setIsCollapsed }) {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: BookOpen, label: 'Question Tracker' },
    { icon: BarChart3, label: 'Analytics' },
    { icon: Zap, label: 'Premium Kits' },
    { icon: MessageSquare, label: 'Experiences' },
    { icon: Award, label: 'Certificates' },
  ];

  return (
    <div 
      className={cn(
        "fixed left-0 top-18 h-[calc(100vh-4.5rem)] bg-[#0f0f0f] border-r border-gray-800 transition-all duration-300 z-40 flex flex-col",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Sidebar Items */}
      <div className="flex-1 py-6 space-y-2 px-3">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            className={cn(
              "flex items-center gap-4 w-full p-3 rounded-xl transition-all duration-200 group",
              item.active 
                ? "bg-orange-500/10 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.1)]" 
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon className={cn("w-5 h-5", item.active ? "text-orange-500" : "group-hover:text-white")} />
            {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
          </button>
        ))}
      </div>

      {/* Footer / Settings */}
      <div className="p-3 border-t border-gray-800">
        <button className="flex items-center gap-4 w-full p-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-200">
          <Settings className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium text-sm">Settings</span>}
        </button>
        
        {/* Collapse Toggle */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="mt-4 flex items-center justify-center w-full p-2 rounded-lg text-gray-500 hover:text-white transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
