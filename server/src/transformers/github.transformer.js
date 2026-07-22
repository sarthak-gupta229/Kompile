const computeStreaks = (days) => {
  let max = 0,
    current = 0,
    running = 0;
  for (const day of days) {
    if (day.contributionCount > 0) {
      running += 1;
      max = Math.max(max, running);
    } else {
      running = 0;
    }
  }

  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].contributionCount > 0) current += 1;
    else break;
  }
  return { maxStreak: max, currentStreak: current };
};

export const transformGithubResponse = (raw) => {
  const repos = raw.repositories?.nodes || [];

  // aggregate language bytes across all repos
  const langBytes = {};
  let totalBytes = 0;
  for (const repo of repos) {
    for (const edge of repo.languages?.edges || []) {
      langBytes[edge.node.name] = (langBytes[edge.node.name] || 0) + edge.size;
      totalBytes += edge.size;
    }
  }

  const languages = Object.entries(langBytes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, size]) => ({
      name,
      percentage: totalBytes ? Math.round((size / totalBytes) * 100) : 0,
    }));

  const stars = repos.reduce((sum, r) => sum + (r.stargazerCount || 0), 0);

  const calendar = raw.contributionsCollection?.contributionCalendar;
  const days = calendar?.weeks?.flatMap((w) => w.contributionDays) || [];

  const { maxStreak, currentStreak } = computeStreaks(days);
  const activeDays = days.filter((d) => d.contributionCount > 0).length;

  return {
    profileUrl: `https://github.com/${raw.login}`,
    avatarUrl: raw.avatarUrl,
    stats: {
      totalContributions: calendar?.totalContributions || 0,
      activeDays,
      maxStreak,
      currentStreak,
      stars,
      commits: raw.contributionsCollection?.totalCommitContributions || 0,
      prs: raw.pullRequests?.totalCount || 0,
      issues: raw.issues?.totalCount || 0,
    },
    languages,
    heatmap: days.map((d) => ({ date: d.date, count: d.contributionCount })),
  };
};
