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

  return {
    profileUrl: `https://codeforces.com/profile/${profile.handle}`,
    avatarUrl: profile.titlePhoto || profile.avatar || null,
    stats: {
      totalQuestions,
      activeDays: totalActiveDays,
      maxStreak,
      currentStreak,
      currentRating: contestSummary?.currentRating ?? null,
      maxRating: contestSummary?.maxRating ?? null,
      rankTitle: contestSummary?.rankTitle ?? null,
      contestsAttended: contestSummary?.totalContests ?? 0,
      lastContest: contestSummary?.lastContest ?? null,
    },
    topicAnalysis: (topicWise || []).map(({ tag, count }) => ({
      topic: tag,
      count,
    })),
    ratingWise: ratingWise || [],
    ratingHistory,
    heatmap,
  };
};
