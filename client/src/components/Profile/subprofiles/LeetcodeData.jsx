import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../../context/UserContext.jsx";
import DonutChart from "./../DonutChart.jsx";
import HeatmapComponent from "./../HeatmapComponent.jsx";
import DSATopicChart from "./../DSATopicChart.jsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LabelList,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

function LeetcodeData({ LeetcodeData, userName }) {
  if (!userName) {
    return (
      <div className="flex justify-center items-center w-full h-48 bg-[#151515] rounded-xl border border-[#2e2e2e] mb-5 text-zinc-400">
        No GitHub username set. Please add your GitHub username in Settings.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="w-full bg-black rounded-xl border border-[#2e2e2e] p-3 flex flex-col">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-2">
          Submission Heatmap
        </h2>
        <div className="w-full flex items-center justify-center overflow-x-auto">
          <HeatmapComponent
            startDate={
              new Date(new Date().setFullYear(new Date().getFullYear() - 1))
            }
            endDate={new Date()}
            values={LeetcodeData?.heatmap}
          />
        </div>
      </div>

      <div className="flex gap-3 justify-between w-full items-stretch">
        <div className="w-1/3 bg-black rounded-xl border border-[#2e2e2e] p-5 text-white flex flex-col items-center justify-center">
          <h1 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide text-center">
            Total Questions
          </h1>
          <h1 className="text-4xl font-bold mt-2">
            {LeetcodeData?.stats.totalQuestions}
          </h1>
        </div>

        <div className="w-1/3 bg-black rounded-xl border border-[#2e2e2e] p-5 text-white flex flex-col items-center justify-center">
          <h1 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide text-center">
            Total Active Days
          </h1>
          <h1 className="text-4xl font-bold mt-2">
            {LeetcodeData?.stats.activeDays}
          </h1>
        </div>

        <div className="w-1/3 bg-black rounded-xl border border-[#2e2e2e] p-5 text-white flex flex-col">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">
            Languages
          </h2>
          <div className="flex flex-col gap-2 flex-1 justify-center">
            {LeetcodeData?.languages?.slice(0, 3).map((lang) => (
              <div
                key={lang.name}
                className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/5"
              >
                <span className="text-sm font-medium text-zinc-300">
                  {lang.name}
                </span>
                <span className="text-sm font-bold text-white">
                  {lang.count}
                </span>
              </div>
            )) ?? <span className="text-zinc-500 text-sm">No data</span>}
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-between w-full">
        <div className="w-1/2 bg-black rounded-xl border border-[#2e2e2e] p-5 text-white flex justify-around items-center">
          <div className="flex flex-col items-center">
            <h1 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
              Contest Rating
            </h1>
            <h1 className="text-4xl font-bold mt-2 text-[#f89f1b]">
              {Math.round(LeetcodeData?.stats.contestRating) ?? "-"}
            </h1>
          </div>
          <div className="w-px h-12 bg-[#2e2e2e]" />
          <div className="flex flex-col items-center">
            <h1 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
              Contests Attended
            </h1>
            <h1 className="text-4xl font-bold mt-2">
              {LeetcodeData?.stats.contestsAttended ?? "—"}
            </h1>
          </div>
        </div>
        <div className="w-1/2 bg-black rounded-xl border border-[#2e2e2e] p-5 text-white flex flex-col">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-4">
            DSA Problems Solved
          </h2>
          <div className="flex items-center gap-6 flex-1">
            <DonutChart
              easy={LeetcodeData?.stats.easySolved ?? 0}
              medium={LeetcodeData?.stats.mediumSolved ?? 0}
              hard={LeetcodeData?.stats.hardSolved ?? 0}
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

      <DSATopicChart allTopicData={LeetcodeData?.topicAnalysis || []} />
    </div>
  );
}

export default LeetcodeData;
