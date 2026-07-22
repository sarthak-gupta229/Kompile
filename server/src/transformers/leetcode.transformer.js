export const transformLeetcodeResponse = ({
  user,
  contest,
  recentSubmissions = [],
}) => {
  const acStats = user.submitStats?.acSubmissionNum || [];

  const getCount = (difficulty) =>
    acStats.find((s) => s.difficulty === difficulty)?.count || 0;

  const totalQuestions = getCount("All");
  const easySolved = getCount("Easy");
  const mediumSolved = getCount("Medium");
  const hardSolved = getCount("Hard");

  const tagBuckets = user.tagProblemCounts || {};
  const allTags = [
    ...(tagBuckets.fundamental || []),
    ...(tagBuckets.intermediate || []),
    ...(tagBuckets.advanced || []),
  ];

  const topicAnalysis = allTags
    .filter((t) => t.problemsSolved > 0)
    .sort((a, b) => b.problemsSolved - a.problemsSolved)
    .map((t) => ({ topic: t.tagName, count: t.problemsSolved }));

  // submissionCalendar is a JSON string: { "<unix_timestamp>": count, ... }
  const rawCalendar = user.userCalendar?.submissionCalendar;
  const heatmap = rawCalendar
    ? Object.entries(JSON.parse(rawCalendar)).map(([ts, count]) => ({
        date: new Date(Number(ts) * 1000),
        count,
      }))
    : [];

  const languages = (user.languageProblemCount || [])
    .filter((l) => l.problemsSolved > 0)
    .sort((a, b) => b.problemsSolved - a.problemsSolved)
    .map((l) => ({ name: l.languageName, count: l.problemsSolved }));

  const recentAcSubmissions = recentSubmissions.map((s) => ({
    id: s.id,
    title: s.title,
    titleSlug: s.titleSlug,
    solvedAt: new Date(Number(s.timestamp) * 1000),
  }));

  return {
    profileUrl: `https://leetcode.com/${user.username}`,
    avatarUrl: user.profile?.userAvatar || null,
    stats: {
      totalQuestions,
      easySolved,
      mediumSolved,
      hardSolved,
      activeDays: user.userCalendar?.totalActiveDays || 0,
      contestRating: contest?.rating ?? null,
      contestsAttended: contest?.attendedContestsCount || 0,
    },
    topicAnalysis,
    languages,
    heatmap,
    recentAcSubmissions,
  };
};
