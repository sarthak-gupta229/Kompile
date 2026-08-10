import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../../context/UserContext.jsx";
import DonutChart from "./../DonutChart.jsx";
import HeatmapComponent from "./../HeatmapComponent.jsx";
import DSATopicChart from "./../DSATopicChart.jsx";

function UserStats({ allStats, techStack }) {
  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="w-full bg-black rounded-xl border border-[#2e2e2e] p-3 flex flex-col">
          <h2 className="text-sm font-semibold text-[#3ad353] uppercase tracking-wide mb-2">
            My Consistency
          </h2>
          <div className="w-full flex items-center justify-center overflow-x-auto">
            <HeatmapComponent
              startDate={
                new Date(new Date().setFullYear(new Date().getFullYear() - 1))
              }
              endDate={new Date()}
              values={allStats?.heatmap || []}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-between w-full items-stretch">
          {/* Total Questions + Total Active Days stacked vertically in one card */}
          <div className="w-1/3 bg-black rounded-xl border border-[#2e2e2e] p-5 text-white flex flex-col items-center justify-center gap-4">
            <div className="flex flex-col items-center">
              <h1 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide text-center">
                Total Questions
              </h1>
              <h1 className="text-4xl font-bold mt-1">
                {allStats?.totalQuestions ?? "-"}
              </h1>
            </div>

            <div className="w-full h-px bg-[#2e2e2e]" />

            <div className="flex flex-col items-center">
              <h1 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide text-center">
                Total Active Days
              </h1>
              <h1 className="text-4xl font-bold mt-1">
                {allStats?.totalActiveDays ?? "-"}
              </h1>
            </div>
          </div>

          {/* Empty placeholder */}
          <div className="w-1/3 bg-black rounded-xl border border-[#2e2e2e] p-3 text-white flex flex-col">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3 shrink-0">
              My Skills
            </h2>
            <div
              className="flex flex-wrap gap-1.5 overflow-y-auto pr-1"
              style={{
                maxHeight: "160px",
                scrollbarWidth: "thin",
                scrollbarColor: "#3f3f3f transparent",
              }}
            >
              {techStack && techStack.length > 0 ? (
                techStack.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#f89f1b]/10 text-[#f89f1b] border border-[#f89f1b]/25 shrink-0"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-zinc-500 text-sm">No data</span>
              )}
            </div>
          </div>

          <div className="w-1/3 bg-black rounded-xl border border-[#2e2e2e] p-5 text-white flex flex-col min-h-0">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3 shrink-0">
              Languages
            </h2>
            <div
              className="flex flex-col gap-2 overflow-y-auto pr-1"
              style={{
                maxHeight: "160px",
                scrollbarWidth: "thin",
                scrollbarColor: "#3f3f3f transparent",
              }}
            >
              {allStats?.languages?.slice().map((lang) => (
                <div
                  key={lang.name}
                  className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/5 shrink-0"
                >
                  <span className="text-sm font-medium text-zinc-300 truncate mr-2">
                    {lang.name}
                  </span>
                  <span className="text-sm font-bold text-white shrink-0">
                    {lang.count}
                  </span>
                </div>
              )) ?? <span className="text-zinc-500 text-sm">No data</span>}
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-between w-full">
          <div className="w-1/2 bg-black rounded-xl border border-[#2e2e2e] p-5 text-white flex gap-5 items-center">
            <div className="flex flex-col items-center justify-center shrink-0 pr-5 border-r border-[#2e2e2e]">
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide text-center whitespace-nowrap">
                Total Contests
              </h2>
              <span className="text-5xl font-bold mt-2">
                {allStats?.contests?.totalAttended ?? "-"}
              </span>
            </div>

            <div className="flex flex-col gap-2 flex-1">
              {(allStats?.contests?.byPlatform ?? []).map((item) => {
                const platformKey = item.platform?.toLowerCase();
                const logoMap = {
                  leetcode: "/assets/platformLogos/leetcode-logo.png",
                  codeforces: "/assets/platformLogos/codeforces-logo.png",
                  geeksforgeeks: "/assets/platformLogos/GeeksForGeeks.png",
                };
                const logo = logoMap[platformKey];
                const displayName =
                  platformKey === "leetcode"
                    ? "LeetCode"
                    : platformKey === "codeforces"
                      ? "CodeForces"
                      : platformKey === "codechef"
                        ? "CodeChef"
                        : platformKey === "geeksforgeeks"
                          ? "GeeksForGeeks"
                          : item.platform;

                return (
                  <div
                    key={item._id || item.platform}
                    className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/5"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {logo ? (
                        <img
                          src={logo}
                          alt={displayName}
                          className="w-5 h-5 object-contain rounded-sm shrink-0"
                        />
                      ) : (
                        <span className="text-lg leading-none shrink-0">
                          👨‍🍳
                        </span>
                      )}
                      <span className="text-sm font-medium text-zinc-300 truncate">
                        {displayName}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-white shrink-0 ml-2">
                      {item.attended}
                    </span>
                  </div>
                );
              })}
              {(!allStats?.contests?.byPlatform ||
                allStats.contests.byPlatform.length === 0) && (
                <span className="text-zinc-500 text-sm">No data</span>
              )}
            </div>
          </div>
          <div className="w-1/2 bg-black rounded-xl border border-[#2e2e2e] p-5 text-white flex flex-col">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-4">
              Problems Solved
            </h2>
            <div className="flex items-center gap-6 flex-1">
              <DonutChart
                easy={allStats?.difficulty?.easy ?? 0}
                medium={allStats?.difficulty?.medium ?? 0}
                hard={allStats?.difficulty?.hard ?? 0}
              />

              <div className="flex flex-col gap-3 flex-1">
                {[
                  {
                    label: "Easy",
                    key: 1,
                    color: "text-green-500",
                    bg: "bg-green-500/10",
                  },
                  {
                    label: "Medium",
                    key: 2,
                    color: "text-[#f89f1b]",
                    bg: "bg-[#f89f1b]/10",
                  },
                  {
                    label: "Hard",
                    key: 3,
                    color: "text-red-500",
                    bg: "bg-red-500/10",
                  },
                ].map(({ label, key, color, bg }) => (
                  <div
                    key={label}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg ${bg}`}
                  >
                    <span className={`text-sm font-semibold ${color}`}>
                      {label}
                    </span>
                    <span className="text-sm font-bold text-white">{}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <DSATopicChart allTopicData={allStats?.topicAnalysis || []} />
      </div>
    </>
  );
}

export default UserStats;
