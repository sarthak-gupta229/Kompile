const getRatingDifficulty = (rating) => {
  if (rating >= 800 && rating <= 1200) return "Easy";
  if (rating >= 1300 && rating <= 1700) return "Medium";
  if (rating >= 1800) return "Hard";
  return null;
};

export const transformCodeforcesResponse = (raw) => {
  const {
    profile,
    totalQuestions,
    totalActiveDays,
    calendar,
    maxStreak,
    currentStreak,
    contestSummary,
    topicWise,
    ratingWise,
  } = raw;

  const heatmap = Object.entries(calendar || {})
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([date, count]) => ({ date: new Date(date), count }));

  const ratingHistory = (contestSummary?.ratingPoints || []).map((p) => ({
    contestName: p.contestName,
    rank: p.rank,
    oldRating: p.oldRating,
    newRating: p.newRating,
    date: p.date,
  }));

  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  (ratingWise || []).forEach(({ rating, count }) => {
    const difficulty = getRatingDifficulty(rating);
    if (difficulty) difficultyCounts[difficulty] += count;
  });

  const difficultyWise = [
    { difficulty: "Easy", count: difficultyCounts.Easy },
    { difficulty: "Medium", count: difficultyCounts.Medium },
    { difficulty: "Hard", count: difficultyCounts.Hard },
  ];

  return {
    profileUrl: `https://codeforces.com/profile/${profile.handle}`,
    avatarUrl: profile.titlePhoto || profile.avatar || null,
    stats: {
      totalQuestions,
      activeDays: totalActiveDays,
      maxStreak,
      currentStreak,
      contestRating: contestSummary?.currentRating ?? 0,
      maxRating: contestSummary?.maxRating ?? null,
      rankTitle: contestSummary?.rankTitle ?? null,
      contestsAttended: contestSummary?.totalContests ?? 0,
      lastContest: contestSummary?.lastContest ?? null,
      easySolved: difficultyCounts.Easy,
      mediumSolved: difficultyCounts.Medium,
      hardSolved: difficultyCounts.Hard,
    },
    topicAnalysis: (topicWise || []).map(({ tag, count }) => ({
      topic: tag,
      count,
    })),
    ratingWise: ratingWise || [],
    difficultyWise,
    ratingHistory,
    heatmap,
  };
};
