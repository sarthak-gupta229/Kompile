import React from "react";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { Star, GitCommit, GitPullRequest, AlertCircle } from "lucide-react";
import getGithubStats from "../../api/githubApi";
import HeatmapComponent from "../../components/HeatmapComponent";

function GithubData() {
  const [githubData, setGithubData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useContext(UserContext);
  const username = user?.connectedPlatforms?.find(p => p.platform === "github")?.username;
  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }
    const fetchGithubStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getGithubStats(username);
        console.log(data);
        setGithubData(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchGithubStats();
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
        No GitHub username set. Please add your GitHub username in Settings.
      </div>
    );
  }

  if (error || !githubData) {
    return (
      <div className="flex justify-center items-center w-full h-48 bg-[#151515] rounded-xl border border-[#2e2e2e] mb-5 text-red-500">
        Failed to load GitHub data. Please check your token or try again later.
      </div>
    );
  }

  const weeks = githubData.contributionsCollection?.contributionCalendar?.weeks;

  const activeDays =
    weeks
      ?.flatMap((week) => week.contributionDays)
      .filter((day) => day.contributionCount > 0) || [];

  const totalActiveDays = activeDays.length;

  const repos = githubData.repositories?.nodes || [];
  const stars = repos.reduce(
    (acc, repo) => acc + (repo.stargazerCount || 0),
    0,
  );
  const commits =
    githubData.contributionsCollection?.totalCommitContributions || 0;
  const prs = githubData.pullRequests?.totalCount || 0;
  const issues = githubData.issues?.totalCount || 0;

  const languageMap = {};
  let totalSize = 0;
  repos.forEach((repo) => {
    repo.languages?.edges.forEach((edge) => {
      if (!languageMap[edge.node.name]) {
        languageMap[edge.node.name] = {
          name: edge.node.name,
          color: edge.node.color || "#ccc",
          size: 0,
        };
      }
      languageMap[edge.node.name].size += edge.size;
      totalSize += edge.size;
    });
  });

  const languageArray = Object.values(languageMap).sort(
    (a, b) => b.size - a.size,
  );

  let topLanguages = languageArray.slice(0, 5);
  const othersSize = languageArray
    .slice(5)
    .reduce((acc, lang) => acc + lang.size, 0);
  if (othersSize > 0) {
    topLanguages.push({
      name: "Others",
      color: "#ededed",
      size: othersSize,
    });
  }

  topLanguages = topLanguages.map((lang) => ({
    ...lang,
    percentage: totalSize > 0 ? ((lang.size / totalSize) * 100).toFixed(1) : 0,
  }));

  const heatmapValues =
    weeks
      ?.flatMap((week) => week.contributionDays)
      .map((day) => ({
        date: day.date,
        count: day.contributionCount,
      })) || [];

  const startDate =
    heatmapValues.length > 0 ? heatmapValues[0].date : new Date();
  const endDate =
    heatmapValues.length > 0
      ? heatmapValues[heatmapValues.length - 1].date
      : new Date();

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex gap-5 w-full items-stretch mb-5">
          <div className="w-1/4 bg-black rounded-xl border border-[#2e2e2e] p-5 text-white flex flex-col items-center justify-center">
            <h1 className="text-xl font-semibold text-zinc-400">
              Total Contributions
            </h1>
            <h1 className="text-2xl font-bold">
              {githubData.contributionsCollection?.contributionCalendar
                ?.totalContributions || 0}
            </h1>
          </div>

          <div className="w-1/4 bg-black rounded-xl border border-[#2e2e2e] p-5 text-white flex flex-col items-center justify-center">
            <h1 className="text-xl font-semibold text-zinc-400">
              Total Active Days
            </h1>
            <h1 className="text-2xl font-bold">{totalActiveDays}</h1>
          </div>
          {/* heatmap */}
          <div className="w-2/4 bg-black rounded-xl border border-[#2e2e2e] p-5 flex flex-col overflow-hidden">
            <h1 className="text-xl font-bold text-zinc-300 mb-4 tracking-wider uppercase">
              Submission Heatmap
            </h1>
            <div className="flex-1 w-full flex items-center justify-center -mt-2">
              <HeatmapComponent
                values={heatmapValues}
                startDate={new Date(startDate)}
                endDate={new Date(endDate)}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-5 w-full">
          <div className="flex-1 bg-black rounded-xl border border-[#2e2e2e] p-6 text-white mb-5 flex flex-col gap-4">
            <h1 className="text-xl font-bold text-zinc-300">Languages</h1>

            <div className="flex h-4 w-full rounded-full overflow-hidden mt-4">
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

            <div className="grid grid-cols-2 gap-y-4 gap-x-4 mt-6">
              {topLanguages.map((lang, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
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

          <div className="flex-1 bg-black rounded-xl border border-[#2e2e2e] p-6 text-white mb-5 flex flex-col gap-4">
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
