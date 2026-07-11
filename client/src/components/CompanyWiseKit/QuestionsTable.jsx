import React, { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Star,
  ExternalLink,
  Filter,
  Flame,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  MoreVertical,
} from "lucide-react";
import { cn } from "../../lib/utils";

const TOPICS = [
  "Array",
  "String",
  "DP",
  "Greedy",
  "Tree",
  "Graph",
  "Linked List",
  "Math",
  "Stack",
];

export function QuestionsTable({ data = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("All Time Favourite");
  const [completedIds, setCompletedIds] = useState(new Set());

  const toggleCompleted = (id) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredData = useMemo(() => {
    return data
      .filter((q) => {
        const matchesSearch = q.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesDifficulty =
          difficultyFilter === "All" || q.difficulty === difficultyFilter;
        return matchesSearch && matchesDifficulty;
      })
      .slice(0, 50);
  }, [data, searchTerm, difficultyFilter]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "Hard":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getPopularityBadge = (freq) => {
    const f = parseFloat(freq);
    if (f > 80)
      return { label: "VERY HOT", color: "text-red-500", bg: "bg-red-500/10" };
    if (f > 60)
      return { label: "HOT", color: "text-orange-500", bg: "bg-orange-500/10" };
    if (f > 40)
      return {
        label: "WARM",
        color: "text-yellow-500",
        bg: "bg-yellow-500/10",
      };
    return { label: "COLD", color: "text-blue-500", bg: "bg-blue-500/10" };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0f0f0f] border border-gray-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#1a1a1a] border border-gray-800 rounded-xl py-2 pl-10 pr-4 text-sm text-gray-300 outline-none focus:border-orange-500/50 transition-all duration-200 w-64"
            />
          </div>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="bg-[#1a1a1a] border border-gray-800 rounded-xl py-2 px-4 text-sm text-gray-300 outline-none focus:border-orange-500/50 transition-all duration-200 appearance-none cursor-pointer"
          >
            <option value="All">All Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select className="bg-[#1a1a1a] border border-gray-800 rounded-xl py-2 px-4 text-sm text-gray-300 outline-none focus:border-orange-500/50 transition-all duration-200 appearance-none cursor-pointer">
            <option>All Platforms</option>
            <option>LeetCode</option>
            <option>GeeksForGeeks</option>
            <option>HackerRank</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <span>Showing {filteredData.length} questions</span>
          <div className="h-4 w-[1px] bg-gray-800 mx-2"></div>
          <button className="flex items-center gap-2 hover:text-white transition-colors">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>

      <div className="overflow-hidden bg-[#0f0f0f] border border-gray-800 rounded-3xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-[#1a1a1a]/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Question
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Platform
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Popularity
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filteredData.map((q, idx) => {
                const pop = getPopularityBadge(q.frequency);
                return (
                  <tr
                    key={q.id}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button className="text-gray-600 hover:text-orange-500 transition-colors">
                          <Star className="w-4 h-4" />
                        </button>
                        <a
                          href={q.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-200 font-medium hover:text-orange-500 transition-colors flex items-center gap-1.5"
                        >
                          {q.title}
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-black border border-gray-800 flex items-center justify-center p-1">
                          <img
                            src="https://leetcode.com/static/images/LeetCode_logo_rvs.png"
                            alt="LC"
                            className="w-full h-auto"
                          />
                        </div>
                        <span className="text-xs text-gray-400 font-medium">
                          LeetCode
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-[10px] font-black border tracking-wider",
                          getDifficultyColor(q.difficulty),
                        )}
                      >
                        {q.difficulty.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={cn(
                          "flex items-center gap-1.5 px-2 py-1 rounded-lg w-fit",
                          pop.bg,
                        )}
                      >
                        <Flame className={cn("w-3.5 h-3.5", pop.color)} />
                        <span
                          className={cn("text-[10px] font-bold", pop.color)}
                        >
                          {pop.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-white/5 border border-gray-800 text-[10px] text-gray-400 font-medium">
                          {TOPICS[idx % TOPICS.length]}
                        </span>
                        {idx % 3 === 0 && (
                          <span className="px-2 py-0.5 rounded-md bg-white/5 border border-gray-800 text-[10px] text-gray-400 font-medium">
                            {TOPICS[(idx + 2) % TOPICS.length]}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleCompleted(q.id)}
                          className={`p-1.5 rounded-lg transition-all ${
                            completedIds.has(q.id)
                              ? "text-green-500 bg-green-500/10 hover:bg-green-500/20"
                              : "text-gray-500 hover:text-green-400 hover:bg-green-500/10"
                          }`}
                          title={
                            completedIds.has(q.id)
                              ? "Mark as incomplete"
                              : "Mark as complete"
                          }
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-gray-800 flex items-center justify-center">
          <button className="px-6 py-2 rounded-xl bg-white/5 border border-gray-800 text-gray-300 text-sm font-bold hover:bg-white/10 hover:border-gray-700 transition-all duration-200">
            Load More Questions
          </button>
        </div>
      </div>
    </div>
  );
}
