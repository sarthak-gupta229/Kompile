import React from "react";
import { Link } from "react-router-dom";
import { Star, GitCommit, GitPullRequest, AlertCircle, Settings } from "lucide-react";
import HeatmapComponent from "./../HeatmapComponent";

const languageColors = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Python: "#3572A5",
  "C++": "#f34b7d",
  C: "#555555",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Shell: "#89e051",
};

function GithubData({ githubData, userName }) {
  if (!userName) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 w-full h-56 bg-[#0d0d0d] rounded-xl border border-[#2e2e2e]">
        <img src="/assets/platformLogos/github-logo.png" alt="GitHub" className="w-10 h-10 opacity-40" />
        <div className="text-center">
          <p className="text-zinc-300 font-medium text-sm mb-1">No GitHub username set</p>
          <p className="text-zinc-500 text-xs">Connect your account to track your progress</p>
        </div>
        <Link
          to="/user_data?tab=platforms"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#f89f1b] hover:bg-[#e08e10] text-black text-sm font-semibold transition-colors"
        >
          <Settings size={14} />
          Add in Settings
        </Link>
      </div>
    );
  }

  if (!githubData) {
    return (
      <div className="flex justify-center items-center w-full h-48 bg-[#151515] rounded-xl border border-[#2e2e2e] mb-5 text-zinc-400">
        No GitHub stats found. Try syncing your profile.
      </div>
    );
  }

  const { stats, languages = [], heatmap = [] } = githubData;

  const totalContributions = stats?.totalContributions ?? 0;
  const totalActiveDays = stats?.activeDays ?? 0;
  const stars = stats?.stars ?? 0;
  const commits = stats?.commits ?? 0;
  const prs = stats?.prs ?? 0;
  const issues = stats?.issues ?? 0;

  const topLanguages = languages.map((lang) => ({
    name: lang.name,
    percentage: lang.percentage,
    color: languageColors[lang.name] || "#888888",
  }));

  const heatmapValues = heatmap || [];
  const startDate =
    heatmapValues.length > 0
      ? heatmapValues[0].date
      : new Date(new Date().setFullYear(new Date().getFullYear() - 1));

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="w-full bg-black rounded-xl border border-[#2e2e2e] p-5 flex flex-col overflow-hidden">
          <h1 className="text-xl font-bold text-zinc-300 mb-4 tracking-wider uppercase">
            Submission Heatmap
          </h1>
          <div className="w-full flex items-center justify-center">
            <HeatmapComponent
              values={heatmapValues}
              startDate={new Date(startDate)}
              endDate={new Date()}
            />
          </div>
        </div>

        <div className="flex gap-4 w-full">
          <div className="flex-1 bg-black rounded-xl border border-[#2e2e2e] p-5 text-white flex flex-col items-center justify-center">
            <h1 className="text-xl font-semibold text-zinc-400">
              Total Contributions
            </h1>
            <h1 className="text-3xl font-bold mt-2">{totalContributions}</h1>
          </div>

          <div className="flex-1 bg-black rounded-xl border border-[#2e2e2e] p-5 text-white flex flex-col items-center justify-center">
            <h1 className="text-xl font-semibold text-zinc-400">
              Total Active Days
            </h1>
            <h1 className="text-3xl font-bold mt-2">{totalActiveDays}</h1>
          </div>
        </div>

        <div className="flex gap-4 w-full">
          <div className="flex-1 bg-black rounded-xl border border-[#2e2e2e] p-6 text-white flex flex-col gap-4">
            <h1 className="text-xl font-bold text-zinc-300">Languages</h1>

            <div className="flex h-4 w-full rounded-full overflow-hidden mt-2">
              {topLanguages.map((lang, idx) => (
                <div
                  key={idx}
                  style={{
                    width: `${lang.percentage}%`,
                    backgroundColor: lang.color,
                  }}
                  className="h-full"
                  title={`${lang.name} ${lang.percentage}%`}
                />
              ))}
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-4 mt-4">
              {topLanguages.map((lang, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: lang.color }}
                  />
                  <span className="text-sm font-semibold text-zinc-300">
                    {lang.name}
                  </span>
                  <span className="text-sm text-zinc-500">
                    {lang.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-black rounded-xl border border-[#2e2e2e] p-6 text-white flex flex-col gap-4">
            <h1 className="text-xl font-bold text-zinc-300">Stats</h1>

            <div className="flex flex-col gap-5 mt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Star className="text-yellow-400 fill-yellow-400" size={20} />
                  <span className="text-zinc-300 font-semibold text-lg">
                    Stars
                  </span>
                </div>
                <span className="text-white font-bold text-lg">{stars}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GitCommit className="text-orange-500" size={20} />
                  <span className="text-zinc-300 font-semibold text-lg">
                    Commits
                  </span>
                </div>
                <span className="text-white font-bold text-lg">{commits}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GitPullRequest className="text-green-500" size={20} />
                  <span className="text-zinc-300 font-semibold text-lg">
                    PRs
                  </span>
                </div>
                <span className="text-white font-bold text-lg">{prs}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="text-red-500" size={20} />
                  <span className="text-zinc-300 font-semibold text-lg">
                    Issues
                  </span>
                </div>
                <span className="text-white font-bold text-lg">{issues}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GithubData;
