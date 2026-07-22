import { PlatformProfile } from "../models/user.models.js";
import { User } from "../models/user.models.js";

export const recomputeUserStats = async (userId) => {
  const profiles = await PlatformProfile.find({ userId }).lean();

  const combined = {
    totalQuestions: 0,
    totalActiveDays: 0,
    difficulty: { easy: 0, medium: 0, hard: 0 },
    contests: { totalAttended: 0, byPlatform: [] },
    topicAnalysis: [],
    languages: [],
    heatmap: [],
    lastSyncedAt: new Date(),
  };

  const topicMap = new Map();
  const heatmapMap = new Map();
  const languageMap = new Map();

  for (const profile of profiles) {
    const s = profile.stats || {};

    combined.totalQuestions += s.totalQuestions || 0;
    combined.totalActiveDays += s.activeDays || 0;
    combined.difficulty.easy += s.easySolved || 0;
    combined.difficulty.medium += s.mediumSolved || 0;
    combined.difficulty.hard += s.hardSolved || 0;

    if (s.contestsAttended) {
      combined.contests.totalAttended += s.contestsAttended;
      combined.contests.byPlatform.push({
        platform: profile.platform,
        attended: s.contestsAttended,
        rating: s.contestRating ?? null,
      });
    }

    for (const t of profile.topicAnalysis || []) {
      topicMap.set(t.topic, (topicMap.get(t.topic) || 0) + t.count);
    }

    for (const day of profile.heatmap || []) {
      const key = new Date(day.date).toISOString().slice(0, 10);
      heatmapMap.set(key, (heatmapMap.get(key) || 0) + day.count);
    }

    for (const lang of profile.languages || []) {
      languageMap.set(lang.name, (languageMap.get(lang.name) || 0) + (lang.problemsSolved ?? 0));
    }
  }

  combined.topicAnalysis = [...topicMap.entries()]
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count);

  combined.heatmap = [...heatmapMap.entries()]
    .map(([date, count]) => ({ date: new Date(date), count }))
    .sort((a, b) => a.date - b.date);

  combined.languages = [...languageMap.entries()]
    .map(([name, problemsSolved]) => ({ name, problemsSolved }))
    .sort((a, b) => b.problemsSolved - a.problemsSolved);

  await User.findByIdAndUpdate(userId, { $set: { stats: combined } });
};
