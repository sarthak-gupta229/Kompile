import React from "react";
import LoginCalendar from "./LoginCalendar";
import DailyMissions from "./DailyMissions";
import MyWorkspace from "../../components/workspace/MyWorkspace";

export default function WorkspaceHome() {
  return (
    <div>
      {/* Two-column layout: main content (left) + widgets (right) */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left / center — Welcome banner + My Workspace stats & sheets */}
        <div className="flex-1 min-w-0 w-full flex flex-col gap-6">
          {/* Welcome Banner */}
          <div className="bg-[#111111] border border-white/[0.08] rounded-2xl py-6 px-7 shadow-xl flex items-center">
            <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              Welcome To Your WorkSpace!
            </h1>
          </div>

          <MyWorkspace />
        </div>

        {/* Right sidebar — Calendar + Daily Missions stacked */}
        <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
          <LoginCalendar />
          <DailyMissions />
        </div>
      </div>
    </div>
  );
}

