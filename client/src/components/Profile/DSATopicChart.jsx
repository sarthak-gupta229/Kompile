import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LabelList,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

function DSATopicChart({ allTopicData }) {
  const INITIAL_VISIBLE = 10;
  const [showAll, setShowAll] = useState(false);
  const visibleData = showAll
    ? allTopicData
    : allTopicData.slice(0, INITIAL_VISIBLE);

  return (
    <div className="w-full bg-black rounded-xl border border-[#2e2e2e] p-5 text-white">
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

export default DSATopicChart;
