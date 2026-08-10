import React from "react";
import { Trophy, Medal, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AVATAR_COLORS = [
  { bg: "#3b2f6b", text: "#a78bfa" }, // violet
  { bg: "#1e3a5f", text: "#60a5fa" }, // blue
  { bg: "#1a4731", text: "#4ade80" }, // green
  { bg: "#4a1a2c", text: "#f472b6" }, // pink
  { bg: "#4a2a00", text: "#fb923c" }, // orange
  { bg: "#1e3a3a", text: "#2dd4bf" }, // teal
  { bg: "#3b1f1f", text: "#f87171" }, // red
  { bg: "#2d2a00", text: "#facc15" }, // yellow
];

function getInitials(username = "") {
  const parts = username.trim().split(/[_\-\s]+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return username.slice(0, 2).toUpperCase();
}

function getColor(username = "") {
  const idx =
    [...username].reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function InitialsAvatar({ username, size = "sm", borderClass = "" }) {
  const initials = getInitials(username);
  const { bg, text } = getColor(username);
  const sizeClass =
    size === "lg"
      ? "w-24 h-24 text-2xl"
      : size === "md"
        ? "w-14 h-14 text-base"
        : "w-8 h-8 text-xs";
  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center font-bold shrink-0 border-2 ${borderClass}`}
      style={{ backgroundColor: bg, color: text, borderColor: text + "55" }}
    >
      {initials}
    </div>
  );
}

const rankConfig = {
  1: {
    icon: Trophy,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/30",
  },
  2: {
    icon: Medal,
    color: "text-gray-300",
    bg: "bg-gray-300/10",
    border: "border-gray-300/20",
  },
  3: {
    icon: Award,
    color: "text-amber-600",
    bg: "bg-amber-600/10",
    border: "border-amber-600/30",
  },
};

function RankBadge({ rank }) {
  const config = rankConfig[rank];
  if (config) {
    const Icon = config.icon;
    return (
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center border ${config.bg} ${config.border}`}
      >
        <Icon size={18} className={config.color} />
      </div>
    );
  }
  return (
    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#1e1e1e] border border-gray-800">
      <span className="text-sm font-bold text-gray-400">#{rank}</span>
    </div>
  );
}

function Leaderboard({
  data = [],
  valueLabel = "Score",
  loading = false,
  error = null,
  className = "",
}) {
  const navigate = useNavigate();
  if (loading) {
    return (
      <div className={`px-6 pb-6 ${className}`}>
        <div className="flex items-center justify-center h-64 text-gray-500 text-sm animate-pulse">
          Loading leaderboard…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`px-6 pb-6 ${className}`}>
        <div className="flex items-center justify-center h-64 text-red-400 text-sm">
          {error}
        </div>
      </div>
    );
  }

  const rows = data;

  return (
    <div className={`px-6 pb-6 ${className}`}>
      {/* Top 3  */}
      <div className="grid grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto items-end">
        {[rows[1], rows[0], rows[2]].map((user, i) => {
          if (!user) return null;
          const actualRank = i === 0 ? 2 : i === 1 ? 1 : 3;
          const config = rankConfig[actualRank];
          const Icon = config.icon;
          return (
            <div
              key={user.userId}
              className={`relative flex flex-col items-center rounded-xl border ${config.border} bg-[#111111] ${
                actualRank === 1
                  ? "gap-3 p-8 pt-10 scale-105 shadow-2xl shadow-yellow-500/10"
                  : "gap-2 p-6 pt-8"
              }`}
            >
              {actualRank === 1 && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                  <span className="text-6xl">👑</span>
                </div>
              )}
              <InitialsAvatar
                username={user.username}
                size={actualRank === 1 ? "lg" : "md"}
              />
              <span
                className={`font-bold ${actualRank === 1 ? "text-sm" : "text-xs"} ${config.color}`}
              >
                <Icon
                  size={actualRank === 1 ? 14 : 12}
                  className="inline mr-1"
                />
                #{actualRank}
              </span>
              <span
                className={`text-white font-semibold truncate max-w-full text-center ${
                  actualRank === 1 ? "text-base" : "text-sm"
                }`}
              >
                {user.username}
              </span>
              <span
                className={`font-bold ${actualRank === 1 ? "text-sm" : "text-xs"} ${config.color}`}
              >
                {user.value} {valueLabel}
              </span>
            </div>
          );
        })}
      </div>

      <div className="bg-[#111111] border border-gray-800 rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 px-5 py-3 border-b border-gray-800 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <div className="col-span-1">Rank</div>
          <div className="col-span-7">User</div>
          <div className="col-span-4 text-right">{valueLabel}</div>
        </div>

        <div className="divide-y divide-gray-800/60">
          {rows.map((user, idx) => (
            <div
              key={user.userId}
              onClick={() => navigate(`/workspace/profile/${user.username}`)}
              className={`grid grid-cols-12 px-5 py-3.5 items-center transition-colors duration-150 hover:bg-white/[0.02] group cursor-pointer ${
                idx < 3 ? "bg-white/[0.01]" : ""
              }`}
            >
              <div className="col-span-1">
                <RankBadge rank={user.rank} />
              </div>

              <div className="col-span-7 flex items-center gap-3">
                <InitialsAvatar username={user.username} size="sm" />
                <span className="text-white font-medium text-sm group-hover:text-orange-400 transition-colors">
                  {user.username}
                </span>
              </div>

              <div className="col-span-4 text-right">
                <span
                  className={`text-sm font-bold ${
                    user.rank === 1
                      ? "text-yellow-400"
                      : user.rank === 2
                        ? "text-gray-300"
                        : user.rank === 3
                          ? "text-amber-600"
                          : "text-gray-300"
                  }`}
                >
                  {user.value.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
