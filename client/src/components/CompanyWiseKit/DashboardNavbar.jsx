import { Search, Sparkles } from 'lucide-react';

export function DashboardNavbar() {
  return (
    <div className="fixed top-18 left-0 right-0 h-16 bg-[#0f0f0f]/80 backdrop-blur-md border-b border-gray-800 z-30 flex items-center justify-between px-6 transition-all duration-300">

      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search questions, topics or companies..." 
            className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl py-2 pl-10 pr-4 text-sm text-gray-300 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all duration-200"
          />
        </div>
      </div>

  
      <div className="flex items-center gap-4">
        <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all duration-200 shadow-lg shadow-orange-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          UPGRADE PREMIUM
        </button>
        
        <div className="h-8 w-[1px] bg-gray-800 mx-2 hidden sm:block"></div>
        
        {/* <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-[#0f0f0f]"></span>
        </button> */}

        {/* <button className="flex items-center gap-2 p-1 pr-3 rounded-full bg-white/5 hover:bg-white/10 border border-gray-800 transition-all duration-200 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xs shadow-inner">
            JD
          </div>
          <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">John Doe</span>
        </button> */}
      </div>
    </div>
  );
}
