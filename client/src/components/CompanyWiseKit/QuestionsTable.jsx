import React from "react";
import {
  Search,
  Flame,
  ArrowUpRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "../../lib/utils";

export function QuestionsTable({
  data = [],
  onToggle,
  difficulty,
  onDifficultyChange,
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  pagination,
  onPageChange,
}) {
  const getDifficultyColor = (d) => {
    switch (d) {
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
      return { label: "WARM", color: "text-yellow-500", bg: "bg-yellow-500/10" };
    return { label: "COLD", color: "text-blue-500", bg: "bg-blue-500/10" };
  };

  return (
    <div className="space-y-6">
      {/* Filters bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0f0f0f] border border-gray-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-[#1a1a1a] border border-gray-800 rounded-xl py-2 pl-10 pr-4 text-sm text-gray-300 outline-none focus:border-orange-500/50 transition-all duration-200 w-64"
            />
          </div>

          <select
            value={difficulty}
            onChange={(e) => onDifficultyChange(e.target.value)}
            className="bg-[#1a1a1a] border border-gray-800 rounded-xl py-2 px-4 text-sm text-gray-300 outline-none focus:border-orange-500/50 transition-all duration-200 appearance-none cursor-pointer"
          >
            <option value="">All Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-[#1a1a1a] border border-gray-800 rounded-xl py-2 px-4 text-sm text-gray-300 outline-none focus:border-orange-500/50 transition-all duration-200 appearance-none cursor-pointer"
          >
            <option value="frequency">Sort: Frequency</option>
            <option value="acceptanceRate">Sort: Acceptance Rate</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <span>
            Showing {data.length}
            {pagination ? ` of ${pagination.totalMatched}` : ""} questions
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden bg-[#0f0f0f] border border-gray-800 rounded-3xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-[#1a1a1a]/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Question
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Popularity
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Topics
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                  Done
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {data.map((q) => {
                const pop = getPopularityBadge(q.frequency);
                return (
                  <tr
                    key={q._id}
                    className={cn(
                      "group transition-colors",
                      q.completed
                        ? "bg-green-500/[0.03]"
                        : "hover:bg-white/[0.02]",
                    )}
                  >
                    <td className="px-6 py-4">
                      <a
                        href={q.link || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "font-medium hover:text-orange-500 transition-colors flex items-center gap-1.5",
                          q.completed ? "text-gray-500 line-through" : "text-gray-200",
                        )}
                      >
                        {q.title}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-[10px] font-black border tracking-wider",
                          getDifficultyColor(q.difficulty),
                        )}
                      >
                        {q.difficulty?.toUpperCase()}
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
                        <span className={cn("text-[10px] font-bold", pop.color)}>
                          {pop.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {(q.topics ?? []).slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded-md bg-white/5 border border-gray-800 text-[10px] text-gray-400 font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onToggle?.(q._id)}
                        className={cn(
                          "p-1.5 rounded-lg transition-all",
                          q.completed
                            ? "text-green-500 bg-green-500/10 hover:bg-green-500/20"
                            : "text-gray-500 hover:text-green-400 hover:bg-green-500/10",
                        )}
                        title={q.completed ? "Mark as incomplete" : "Mark as complete"}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="p-6 border-t border-gray-800 flex items-center justify-center gap-4">
            <button
              disabled={pagination.page <= 1}
              onClick={() => onPageChange((p) => p - 1)}
              className="p-2 rounded-lg bg-white/5 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 disabled:opacity-30 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-400">
              Page {pagination.page} / {pagination.totalPages}
            </span>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange((p) => p + 1)}
              className="p-2 rounded-lg bg-white/5 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 disabled:opacity-30 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
