import React, { useState, useMemo } from "react";
import UserStats from "../Profile/subprofiles/UserStats.jsx";

// Generate realistic dummy heatmap activity over the last 365 days
function generateDummyHeatmap() {
  const values = [];
  const now = new Date();

  for (let i = 365; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];

    // Create clusters of high activity matching the screenshot pattern
    const dayOfWeek = d.getDay();
    const daysAgo = i;

    let count = 0;
    // Heavy activity in recent months (daysAgo between 60 and 300)
    if (daysAgo >= 30 && daysAgo <= 280) {
      const rand = Math.random();
      if (rand > 0.2) {
        // High submission days
        if (rand > 0.8) count = Math.floor(Math.random() * 5) + 8; // 8-12
        else if (rand > 0.5) count = Math.floor(Math.random() * 4) + 4; // 4-7
        else count = Math.floor(Math.random() * 3) + 1; // 1-3
      }
    } else if (daysAgo < 30) {
      if (Math.random() > 0.4) {
        count = Math.floor(Math.random() * 5) + 1;
      }
    } else {
      if (Math.random() > 0.75) {
        count = Math.floor(Math.random() * 3) + 1;
      }
    }

    values.push({ date: dateStr, count });
  }
  return values;
}

const DUMMY_SKILLS = [
  "C++",
  "Python",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Express.js",
  "PostgreSQL",
  "Prisma",
  "Docker",
  "Tailwind CSS",
];

export default function LandingUserStats() {
  const [activeTab, setActiveTab] = useState("allStats");

  const dummyHeatmap = useMemo(() => generateDummyHeatmap(), []);

  const dummyAllStats = useMemo(
    () => ({
      totalQuestions: 1458,
      totalActiveDays: 193,
      heatmap: dummyHeatmap,
      languages: [
        { name: "C++", count: "" },
        { name: "JavaScript", count: "" },
        { name: "Python", count: "" },
        { name: "CSS", count: "" },
      ],
      contests: {
        totalAttended: 37,
        byPlatform: [
          { platform: "codeforces", attended: 24, _id: "cf" },
          { platform: "leetcode", attended: 13, _id: "lc" },
        ],
      },
      difficulty: {
        easy: 528,
        medium: 735,
        hard: 182,
      },
    }),
    [dummyHeatmap],
  );

  return (
    <div className="w-full max-w-5xl mx-auto bg-[#141414] rounded-2xl border border-white/[0.08] p-6 text-white shadow-2xl backdrop-blur-sm">
      {/* Tab Navigation Header */}
      <div className="flex border-b border-[#2e2e2e] mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab("allStats")}
          className={`px-5 py-2 text-sm font-medium transition-all duration-200 border-b-2 -mb-px cursor-pointer ${
            activeTab === "allStats"
              ? "border-[#f89f1b] text-[#f89f1b]"
              : "border-transparent text-[#888] hover:text-white"
          }`}
        >
          All Stats
        </button>
        <button
          onClick={() => setActiveTab("leetcode")}
          className={`px-5 py-2 text-sm font-medium transition-all duration-200 border-b-2 -mb-px cursor-pointer ${
            activeTab === "leetcode"
              ? "border-[#f89f1b] text-[#f89f1b]"
              : "border-transparent text-[#888] hover:text-white"
          }`}
        >
          LeetCode
        </button>
        <button
          onClick={() => setActiveTab("codeforces")}
          className={`px-5 py-2 text-sm font-medium transition-all duration-200 border-b-2 -mb-px cursor-pointer ${
            activeTab === "codeforces"
              ? "border-[#f89f1b] text-[#f89f1b]"
              : "border-transparent text-[#888] hover:text-white"
          }`}
        >
          Codeforces
        </button>
        <button
          onClick={() => setActiveTab("github")}
          className={`px-5 py-2 text-sm font-medium transition-all duration-200 border-b-2 -mb-px cursor-pointer ${
            activeTab === "github"
              ? "border-[#f89f1b] text-[#f89f1b]"
              : "border-transparent text-[#888] hover:text-white"
          }`}
        >
          GitHub
        </button>
      </div>

      {/* Main Stats Content */}
      <div className="w-full">
        <UserStats
          allStats={dummyAllStats}
          techStack={DUMMY_SKILLS}
          showTopicAnalysis={false}
        />
      </div>
    </div>
  );
}
