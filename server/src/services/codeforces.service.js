import { ApiError } from "../utils/api-error.js";


const CF_BASE = "https://codeforces.com/api";

export const fetchCodeforcesData = async function (username) {
  const [statusRes, ratingRes, infoRes] = await Promise.all([
    fetch(`${CF_BASE}/user.status?handle=${username}&from=1&count=100000`),
    fetch(`${CF_BASE}/user.rating?handle=${username}`),
    fetch(`${CF_BASE}/user.info?handles=${username}`),
  ]);

  const [status, rating, info] = await Promise.all(
    [statusRes, ratingRes, infoRes].map((r) => r.json()),
  );

  if (status.status !== "OK")
    throw new ApiError(404, status.comment || "Invalid username");

  const profileData = info.result?.[0] ?? null;

  if (!profileData) throw new ApiError(404, "User not found");

  return {
    submissions: status.result,
    contestHistory: rating.result,
    profile: info.result[0],
  };
};

function getSolvedAndActiveDays(submissions) {
  const solvedProblems = new Map();
  const activeDays = new Set();

  submissions.forEach((sub) => {
    const date = new Date(sub.creationTimeSeconds * 1000)
      .toISOString()
      .split("T")[0];
    activeDays.add(date);

    if (sub.verdict === "OK") {
      const key = `${sub.problem.contestId}-${sub.problem.index}`;
      if (!solvedProblems.has(key)) {
        solvedProblems.set(key, sub.problem);
      }
    }
  });

  return {
    totalQuestions: solvedProblems.size,
    totalActiveDays: activeDays.size,
    solvedProblems,
  };
}

function buildSubmissionCalendar(submissions) {
  const calendar = {};

  submissions.forEach((sub) => {
    const date = new Date(sub.creationTimeSeconds * 1000)
      .toISOString()
      .split("T")[0];
    calendar[date] = (calendar[date] || 0) + 1;
  });

  const sortedDates = Object.keys(calendar).sort();
  let maxStreak = 0,
    currentStreak = 0,
    streak = 0;
  let prevDate = null;

  sortedDates.forEach((dateStr) => {
    const date = new Date(dateStr);
    if (prevDate) {
      const diffDays = (date - prevDate) / (1000 * 60 * 60 * 24);
      streak = diffDays === 1 ? streak + 1 : 1;
    } else {
      streak = 1;
    }
    maxStreak = Math.max(maxStreak, streak);
    prevDate = date;
  });

  const today = new Date().toISOString().split("T")[0];
  const lastActive = sortedDates[sortedDates.length - 1];
  const daysSinceLastActive = lastActive
    ? (new Date(today) - new Date(lastActive)) / (1000 * 60 * 60 * 24)
    : Infinity;
  currentStreak = daysSinceLastActive <= 1 ? streak : 0;

  return {
    calendar,
    maxStreak,
    currentStreak,
    totalActiveDays: sortedDates.length,
  };
}

const CF_RANKS = [
  { max: 1199, title: "Newbie" },
  { max: 1399, title: "Pupil" },
  { max: 1599, title: "Specialist" },
  { max: 1899, title: "Expert" },
  { max: 2099, title: "Candidate Master" },
  { max: 2299, title: "Master" },
  { max: 2399, title: "International Master" },
  { max: 2599, title: "Grandmaster" },
  { max: 2999, title: "International Grandmaster" },
  { max: Infinity, title: "Legendary Grandmaster" },
];

function getContestSummary(contestHistory) {
  if (!contestHistory.length) return null;

  const ratingPoints = contestHistory.map((c) => ({
    contestName: c.contestName,
    rank: c.rank,
    oldRating: c.oldRating,
    newRating: c.newRating,
    date: new Date(c.ratingUpdateTimeSeconds * 1000),
  }));

  const currentRating = ratingPoints[ratingPoints.length - 1].newRating;
  const maxRating = Math.max(...ratingPoints.map((p) => p.newRating));
  const rankTitle = CF_RANKS.find((r) => currentRating <= r.max).title;
  const last = ratingPoints[ratingPoints.length - 1];

  return {
    totalContests: ratingPoints.length,
    currentRating,
    maxRating,
    rankTitle,
    lastContest: { name: last.contestName, date: last.date, rank: last.rank },
    ratingPoints,
  };
}

function getDistributions(solvedProblems) {
  const tagCounts = {};
  const ratingCounts = {};

  solvedProblems.forEach((problem) => {
    (problem.tags || []).forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });

    if (problem.rating) {
      const bucket = Math.floor(problem.rating / 100) * 100;
      ratingCounts[bucket] = (ratingCounts[bucket] || 0) + 1;
    }
  });

  const topicWise = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({ tag, count }));

  const ratingWise = Object.entries(ratingCounts)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([rating, count]) => ({ rating: Number(rating), count }));

  return { topicWise, ratingWise };
}

async function getFullCFStats(handle) {
  const { submissions, contestHistory, profile } = await fetchCFData(handle);
  const { totalQuestions, totalActiveDays, solvedProblems } =
    getSolvedAndActiveDays(submissions);
  const { calendar, maxStreak, currentStreak } =
    buildSubmissionCalendar(submissions);
  const contestSummary = getContestSummary(contestHistory);
  const { topicWise, ratingWise } = getDistributions(solvedProblems);

  return {
    profile,
    totalQuestions,
    totalActiveDays,
    calendar,
    maxStreak,
    currentStreak,
    contestSummary,
    topicWise,
    ratingWise,
  };
}

export { getFullCFStats };
