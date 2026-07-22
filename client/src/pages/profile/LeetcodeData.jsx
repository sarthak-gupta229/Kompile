import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/UserContext.jsx";
import fetchUserTopicStats from "../../api/leetcodeApi.js";
import DonutChart from "../../components/DonutChart.jsx";
import HeatmapComponent from "../../components/HeatmapComponent.jsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LabelList,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const INITIAL_VISIBLE = 10;

function DSATopicChart({ allTopicData }) {
  const [showAll, setShowAll] = useState(false);
  const visibleData = showAll
    ? allTopicData
    : allTopicData.slice(0, INITIAL_VISIBLE);

  return (
    <div className="w-full mt-5 bg-black rounded-xl border border-[#2e2e2e] p-5 text-white">
      <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-5">
        DSA Topic Analysis
      </h2>
      <ResponsiveContainer width="100%" height={visibleData.length * 36}>
        <BarChart
          layout="vertical"
          data={visibleData}
          margin={{ top: 0, right: 40, left: 10, bottom: 0 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="topic"
            width={140}
            tick={{ fill: "#a1a1aa", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
            contentStyle={{
              background: "#1a1a1a",
              border: "1px solid #2e2e2e",
              borderRadius: 8,
              color: "#fff",
            }}
            formatter={(value) => [value, "Solved"]}
          />
          <Bar dataKey="count" fill="#3b6fd4" radius={[0, 4, 4, 0]}>
            <LabelList
              dataKey="count"
              position="inside"
              fill="white"
              fontSize={11}
              fontWeight="bold"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {allTopicData.length > INITIAL_VISIBLE && (
        <button
          onClick={() => setShowAll((prev) => !prev)}
          className="mt-4 w-full text-center text-blue-400 hover:text-blue-300 text-sm font-semibold underline underline-offset-2 transition-colors"
        >
          {showAll
            ? "Show less ↑"
            : `Show more (${allTopicData.length - INITIAL_VISIBLE} more) ↓`}
        </button>
      )}
    </div>
  );
}

function LeetcodeData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [heatMap, setHeatMap] = useState({});

  const { user } = useContext(UserContext);
  const username = user?.connectedPlatforms?.find(
    (p) => p.platform === "leetcode",
  )?.username;

  useEffect(() => {
    const loadData = async () => {
      if (!username) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const result = await fetchUserTopicStats(username);
      console.log(result);
      setData(result);

      if (result?.userCalendar?.submissionCalendar) {
        const calendarData = JSON.parse(result.userCalendar.submissionCalendar);
        const formattedHeatMap = [];

        Object.entries(calendarData).forEach(([timestamp, count]) => {
          const date = new Date(Number(timestamp) * 1000);
          const formattedDate = date.toISOString().split("T")[0];
          formattedHeatMap.push({ date: formattedDate, count });
        });
        setHeatMap(formattedHeatMap);
      }
      setLoading(false);
    };
    loadData();
  }, [username]);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-48 bg-[#151515] rounded-xl border border-[#2e2e2e] mb-5">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-zinc-300"></div>
      </div>
    );
  }

  if (!username) {
    return (
      <div className="flex justify-center items-center w-full h-48 bg-[#151515] rounded-xl border border-[#2e2e2e] mb-5 text-zinc-400">
        No LeetCode username set. Please add your LeetCode username in Settings.
      </div>
    );
  }

  return (
    <>
      <div className="w-full bg-black rounded-xl border border-[#2e2e2e] p-3 flex flex-col mb-5">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-2">
          Submission Heatmap
        </h2>
        <div className="w-full flex items-center justify-center overflow-x-auto">
          {heatMap.length > 0 && (
            <HeatmapComponent
              startDate={
                new Date(new Date().setFullYear(new Date().getFullYear() - 1))
              }
              endDate={new Date()}
              values={heatMap}
            />
          )}
        </div>
      </div>

      <div className="flex gap-5 justify-between w-full items-stretch mb-5">
        <div className="w-1/3 bg-black rounded-xl border border-[#2e2e2e] p-5 text-white flex flex-col items-center justify-center">
          <h1 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide text-center">
            Total Questions
          </h1>
          <h1 className="text-4xl font-bold mt-2">
            {data?.submitStats?.acSubmissionNum?.[0]?.count ?? "—"}
          </h1>
        </div>

        <div className="w-1/3 bg-black rounded-xl border border-[#2e2e2e] p-5 text-white flex flex-col items-center justify-center">
          <h1 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide text-center">
            Total Active Days
          </h1>
          <h1 className="text-4xl font-bold mt-2">
            {data?.userCalendar?.totalActiveDays ?? "—"}
          </h1>
        </div>

        <div className="w-1/3 bg-black rounded-xl border border-[#2e2e2e] p-5 text-white flex flex-col">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">
            Languages
          </h2>
          <div className="flex flex-col gap-2 flex-1 justify-center">
            {data?.languageStats?.matchedUser?.languageProblemCount
              ?.slice(0, 5)
              .map((lang) => (
                <div
                  key={lang.languageName}
                  className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/5"
                >
                  <span className="text-sm font-medium text-zinc-300">
                    {lang.languageName}
                  </span>
                  <span className="text-sm font-bold text-white">
                    {lang.problemsSolved}
                  </span>
                </div>
              )) ?? <span className="text-zinc-500 text-sm">No data</span>}
          </div>
        </div>
      </div>

      <div className="flex gap-5 justify-between w-full mt-5">
        <div className="w-1/2 bg-black rounded-xl border border-[#2e2e2e] p-5 text-white flex justify-around items-center">
          <div className="flex flex-col items-center">
            <h1 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
              Contest Rating
            </h1>
            <h1 className="text-4xl font-bold mt-2 text-[#f89f1b]">
              {data?.contestRanking?.rating
                ? Math.round(data.contestRanking.rating)
                : "—"}
            </h1>
          </div>
          <div className="w-px h-12 bg-[#2e2e2e]" />
          <div className="flex flex-col items-center">
            <h1 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
              Contests Attended
            </h1>
            <h1 className="text-4xl font-bold mt-2">
              {data?.contestRanking?.attendedContestsCount ?? "—"}
            </h1>
          </div>
        </div>
        <div className="w-1/2 bg-black rounded-xl border border-[#2e2e2e] p-5 text-white flex flex-col">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-4">
            DSA Problems Solved
          </h2>
          <div className="flex items-center gap-6 flex-1">
            <DonutChart
              easy={data?.submitStats?.acSubmissionNum?.[1]?.count ?? 0}
              medium={data?.submitStats?.acSubmissionNum?.[2]?.count ?? 0}
              hard={data?.submitStats?.acSubmissionNum?.[3]?.count ?? 0}
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
                  <span className="text-sm font-bold text-white">
                    {data?.submitStats?.acSubmissionNum[key]?.count ?? 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {data?.tagProblemCounts &&
        (() => {
          const allTopicData = [
            ...data.tagProblemCounts.fundamental,
            ...data.tagProblemCounts.intermediate,
            ...data.tagProblemCounts.advanced,
          ]
            .filter((t) => t.problemsSolved > 0)
            .sort((a, b) => b.problemsSolved - a.problemsSolved)
            .map((t) => ({ topic: t.tagName, count: t.problemsSolved }));

          return <DSATopicChart allTopicData={allTopicData} />;
        })()}
    </>
  );
}

export default LeetcodeData;
