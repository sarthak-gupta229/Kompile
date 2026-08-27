import DonutChart from "./../DonutChart.jsx";
import HeatmapComponent from "./../HeatmapComponent.jsx";
import DSATopicChart from "./../DSATopicChart.jsx";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";

const CF_RANKS = [
  { max: 1199, title: "Newbie", color: "#808080" },
  { max: 1399, title: "Pupil", color: "#008000" },
  { max: 1599, title: "Specialist", color: "#03a89e" },
  { max: 1899, title: "Expert", color: "#0000ff" },
  { max: 2099, title: "Candidate Master", color: "#aa00aa" },
  { max: 2299, title: "Master", color: "#ff8c00" },
  { max: 2399, title: "International Master", color: "#ff8c00" },
  { max: 2599, title: "Grandmaster", color: "#ff0000" },
  { max: 2999, title: "International Grandmaster", color: "#ff0000" },
  { max: Infinity, title: "Legendary Grandmaster", color: "#ff0000" },
];

function getRankInfo(rating) {
  if (rating == null || rating === 0)
    return { title: "Unrated", color: "#888" };
  return CF_RANKS.find((r) => rating <= r.max) || CF_RANKS[CF_RANKS.length - 1];
}

function Codeforces({ CodeforcesData, userName }) {
  if (!userName) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 w-full h-56 bg-[#0d0d0d] rounded-xl border border-[#2e2e2e]">
        <img src="/assets/platformLogos/codeforces-logo.png" alt="Codeforces" className="w-10 h-10 opacity-40" />
        <div className="text-center">
          <p className="text-zinc-300 font-medium text-sm mb-1">No Codeforces username set</p>
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

  if (!CodeforcesData) {
    return (
      <div className="flex justify-center items-center w-full h-48 bg-[#151515] rounded-xl border border-[#2e2e2e] mb-5 text-zinc-400">
        No Codeforces profile stats found for this user.
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="w-full bg-black rounded-xl border border-[#2e2e2e] p-5 flex flex-col overflow-hidden">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide ">
            Submission Heatmap
          </h2>
          <div className="flex-1 w-full flex items-center justify-center -mt-2">
            <HeatmapComponent
              values={CodeforcesData?.heatmap || []}
              startDate={
                new Date(new Date().setFullYear(new Date().getFullYear() - 1))
              }
              endDate={new Date()}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-between w-full items-stretch">
          <div className="w-1/3 bg-black rounded-xl border border-[#2e2e2e] p-5 text-white flex flex-col items-center justify-center">
            <h1 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide text-center">
              Total Questions
            </h1>
            <h1 className="text-4xl font-bold mt-2">
              {CodeforcesData?.stats?.totalQuestions ?? "-"}
            </h1>
          </div>

          <div className="w-1/3 bg-black rounded-xl border border-[#2e2e2e] p-5 text-white flex flex-col items-center justify-center">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3 text-center">
              Title
            </h2>
            <div className="flex flex-col flex-1 justify-center text-center">
              {(() => {
                const rank = getRankInfo(CodeforcesData?.stats?.contestRating);
                return (
                  <h1
                    className="text-4xl font-bold leading-tight "
                    style={{ color: rank.color }}
                  >
                    {rank.title}
                  </h1>
                );
              })()}
            </div>
          </div>
          <div className="w-1/3 bg-black rounded-xl border border-[#2e2e2e] p-5 text-white flex flex-col items-center justify-center">
            <h1 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide text-center">
              Total Active Days
            </h1>
            <h1 className="text-4xl font-bold mt-2">
              {CodeforcesData?.stats.activeDays ?? "—"}
            </h1>
          </div>
        </div>

        <div className="flex gap-3 justify-between w-full">
          <div className="w-1/2 bg-black rounded-xl border border-[#2e2e2e] p-5 text-white flex justify-around items-center">
            <div className="flex flex-col items-center">
              <h1 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
                Contest Rating
              </h1>
              <h1 className="text-4xl font-bold mt-2 text-[#f89f1b]">
                {CodeforcesData?.stats.contestRating ?? "-"}
              </h1>
            </div>
            <div className="w-px h-12 bg-[#2e2e2e]" />
            <div className="flex flex-col items-center">
              <h1 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
                Contests Attended
              </h1>
              <h1 className="text-4xl font-bold mt-2">
                {CodeforcesData?.stats.contestsAttended ?? "-"}
              </h1>
            </div>
          </div>
          <div className="w-1/2 bg-black rounded-xl border border-[#2e2e2e] p-5 text-white flex flex-col">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-4">
              DSA Problems Solved
            </h2>
            <div className="flex items-center gap-6 flex-1">
              <DonutChart
                easy={CodeforcesData?.stats.easySolved ?? 0}
                medium={CodeforcesData?.stats.mediumSolved ?? 0}
                hard={CodeforcesData?.stats.hardSolved ?? 0}
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
                ].map(({ label, color, bg }) => (
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
        <DSATopicChart allTopicData={CodeforcesData?.topicAnalysis || []} />
      </div>
    </>
  );
}

export default Codeforces;
