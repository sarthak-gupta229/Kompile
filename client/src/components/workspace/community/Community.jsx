import React, { useState } from "react";
import { LayoutList, Diamond, Zap } from "lucide-react";
import Leaderboard from "./Leaderboard";
import { useLeaderboard } from "../../hooks/useLeaderboard";

const tabs = [
  {
    key: "totalQuestions",
    label: "Total Questions",
    icon: LayoutList,
    valueLabel: "Questions",
  },
  {
    key: "leetcodeRating",
    label: "Leetcode Rating",
    icon: Diamond,
    valueLabel: "LC Rating",
  },
  {
    key: "codeforcesRating",
    label: "Codeforces Rating",
    icon: Zap,
    valueLabel: "CF Rating",
  },
];

function Community() {
  const [selectedTab, setSelectedTab] = useState("totalQuestions");

  const activeTab = tabs.find((t) => t.key === selectedTab);

  const { entries, page, loading, error, hasMore, nextPage, prevPage } =
    useLeaderboard({ scope: "global", metric: selectedTab, limit: 20 });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Leaderboard</h1>

        <div className="flex items-center gap-2">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSelectedTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                selectedTab === key
                  ? "bg-[#ff9d3c] text-black shadow-lg shadow-orange-500/20"
                  : "bg-[#111111] border border-gray-800 text-gray-400 hover:border-gray-600 hover:text-gray-200"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <Leaderboard
        data={entries}
        valueLabel={activeTab?.valueLabel ?? "Score"}
        loading={loading}
        error={error}
      />

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={prevPage}
          disabled={page <= 1 || loading}
          className="px-4 py-2 rounded-lg bg-[#111111] border border-gray-800 text-gray-400
                     disabled:opacity-30 hover:border-gray-600 hover:text-gray-200 transition-all cursor-pointer"
        >
          ← Prev
        </button>
        <span className="text-gray-400 text-sm">Page {page}</span>
        <button
          onClick={nextPage}
          disabled={!hasMore || loading}
          className="px-4 py-2 rounded-lg bg-[#111111] border border-gray-800 text-gray-400
                     disabled:opacity-30 hover:border-gray-600 hover:text-gray-200 transition-all cursor-pointer"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default Community;
