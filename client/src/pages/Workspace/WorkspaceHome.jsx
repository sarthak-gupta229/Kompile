import React from "react";
import LoginCalendar from "./LoginCalendar";
import DailyMissions from "./DailyMissions";
import MyWorkspace from "../../components/workspace/MyWorkspace";

export default function WorkspaceHome() {
  return (
    // Full-height row so center stays fixed and right sidebar scrolls
    <div className="flex flex-col lg:flex-row gap-6" style={{ height: "calc(100vh - 72px - 64px)" }}>
      {/* Center — fixed, no scroll */}
      <div className="flex-1 min-w-0 overflow-hidden flex flex-col gap-6">
        {/* Welcome Banner */}
        <div className="bg-[#111111] border border-white/[0.08] rounded-2xl py-6 px-7 shadow-xl flex items-center flex-shrink-0">
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Welcome To Your WorkSpace!
          </h1>
        </div>

        <MyWorkspace />
      </div>

      {/* Right sidebar — scrollable */}
      <div className="w-full lg:w-80 flex-shrink-0 overflow-y-auto pb-6 custom-scrollbar flex flex-col gap-6">
        <LoginCalendar />
        <DailyMissions />
      </div>
    </div>
  );
}
