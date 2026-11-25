import { User, PlatformProfile } from "../models/user.models.js";
import { UserSheetProgress } from "../models/userSheetProgress.models.js";
import { UserCompanyProgress } from "../models/userCompanyProgress.models.js";
import { Sheet } from "../models/sheet.models.js";
import { SheetQuestion } from "../models/sheetQuestion.models.js";
import { SheetTopic } from "../models/sheetTopic.models.js";
import { RoomContestSolve } from "../models/roomContest.models.js";
import { RoomMember } from "../models/roomMember.models.js";

export const directoryFields = "username fullname email avatar.url role isEmailVerified createdAt";
export const profileFields = `${directoryFields} authProvider bio country techStack education socialLinks connectedPlatforms.platform connectedPlatforms.username connectedPlatforms.isVerified connectedPlatforms.connectedAt stats`;

export function groupCompletions(Model, userIds) {
  return Model.aggregate([
    { $match: { userId: { $in: userIds }, completed: true } },
    { $group: { _id: "$userId", count: { $sum: 1 }, latest: { $max: "$completedAt" } } },
  ]);
}

export async function overview() {
  const now = Date.now();
  const week = new Date(now - 7 * 86_400_000);
  const month = new Date(now - 30 * 86_400_000);
  const [totalUsers, sheets, sheetCounts, companyCompleted, [active]] = await Promise.all([
    User.countDocuments(),
    Sheet.find({ deletedAt: null }).select("name totalQuestions").sort({ name: 1 }).lean(),
    UserSheetProgress.aggregate([
      { $match: { completed: true } },
      { $group: { _id: "$sheetId", completed: { $sum: 1 } } },
    ]),
    UserCompanyProgress.countDocuments({ completed: true }),
    UserSheetProgress.aggregate([
      { $match: { completed: true, completedAt: { $gte: month } } },
      { $project: { userId: 1, completedAt: 1 } },
      { $unionWith: { coll: UserCompanyProgress.collection.name, pipeline: [
        { $match: { completed: true, completedAt: { $gte: month } } },
        { $project: { userId: 1, completedAt: 1 } },
      ] } },
      { $group: { _id: "$userId", latest: { $max: "$completedAt" } } },
      { $group: { _id: null, last30Days: { $sum: 1 }, last7Days: {
        $sum: { $cond: [{ $gte: ["$latest", week] }, 1, 0] },
      } } },
    ]),
  ]);
  const bySheet = new Map(sheetCounts.map((row) => [String(row._id), row.completed]));
  return {
    totalUsers,
    last7Days: active?.last7Days ?? 0,
    last30Days: active?.last30Days ?? 0,
    totalCompleted: sheetCounts.reduce((sum, row) => sum + row.completed, companyCompleted),
    sheets: sheets.map((sheet) => {
      const completed = bySheet.get(String(sheet._id)) ?? 0;
      const possible = sheet.totalQuestions * totalUsers;
      return { ...sheet, completed, completionRate: possible ? completed / possible : 0 };
    }),
  };
}

export async function userProgress(userId) {
  const [sheets, topics, totals, counts, company, platforms, rooms, [contestTotals]] = await Promise.all([
    Sheet.find({ deletedAt: null }).select("name totalQuestions").sort({ name: 1 }).lean(),
    SheetTopic.find().select("sheetId parentTopicId name").sort({ order: 1 }).lean(),
    SheetQuestion.aggregate([{ $group: { _id: "$topicId", total: { $sum: 1 } } }]),
    UserSheetProgress.aggregate([
      { $match: { userId, $or: [{ completed: true }, { bookmarked: true }] } },
      { $lookup: { from: SheetQuestion.collection.name, localField: "questionId", foreignField: "_id", as: "question" } },
      { $unwind: "$question" },
      { $group: {
        _id: { topic: "$question.topicId", difficulty: "$question.difficulty" },
        completed: { $sum: { $cond: ["$completed", 1, 0] } },
        bookmarked: { $sum: { $cond: ["$bookmarked", 1, 0] } },
      } },
    ]),
    UserCompanyProgress.countDocuments({ userId, completed: true }),
    PlatformProfile.find({ userId }).select("platform handle profileUrl avatarUrl stats languages topicAnalysis heatmap recentAcSubmissions lastSyncedAt syncStatus").lean(),
    RoomMember.find({ userId }).select("roomId role joinedAt").populate("roomId", "name").lean(),
    RoomContestSolve.aggregate([
      { $match: { userId } },
      { $group: { _id: null, solved: { $sum: 1 }, points: { $sum: "$points" } } },
    ]),
  ]);
  const totalsByTopic = new Map(totals.map(({ _id, total }) => [String(_id), total]));
  const summaryByTopic = new Map();
  for (const { _id, completed, bookmarked } of counts) {
    const key = String(_id.topic);
    const summary = summaryByTopic.get(key) ?? { completed: 0, bookmarked: 0, difficulty: {} };
    summary.completed += completed;
    summary.bookmarked += bookmarked;
    summary.difficulty[_id.difficulty || "unrated"] = completed;
    summaryByTopic.set(key, summary);
  }
  const topicsBySheet = new Map();
  for (const topic of topics) {
    const key = String(topic.sheetId);
    const list = topicsBySheet.get(key) ?? [];
    list.push({
      ...topic,
      total: totalsByTopic.get(String(topic._id)) ?? 0,
      ...(summaryByTopic.get(String(topic._id)) ?? { completed: 0, bookmarked: 0, difficulty: {} }),
    });
    topicsBySheet.set(key, list);
  }
  return {
    sheets: sheets.map((sheet) => {
      const topics = topicsBySheet.get(String(sheet._id)) ?? [];
      return {
        ...sheet, topics,
        completed: topics.reduce((sum, topic) => sum + topic.completed, 0),
        bookmarked: topics.reduce((sum, topic) => sum + topic.bookmarked, 0),
      };
    }),
    company, platforms, rooms,
    contests: { solved: contestTotals?.solved ?? 0, points: contestTotals?.points ?? 0 },
  };
}

const activityQueries = {
  sheets: (userId) => UserSheetProgress.find({ userId, $or: [{ completed: true }, { bookmarked: true }] })
    .select("sheetId questionId completed completedAt bookmarked updatedAt")
    .populate("sheetId", "name").populate("questionId", "title difficulty"),
  companies: (userId) => UserCompanyProgress.find({ userId, completed: true })
    .select("companyId questionId completedAt").populate("companyId", "name").populate("questionId", "title difficulty"),
  contests: (userId) => RoomContestSolve.find({ userId })
    .select("contestId questionId submittedAt points").populate("contestId", "title roomId questions").populate("questionId", "title difficulty"),
};

export async function userActivity(userId, kind, page, limit) {
  const query = activityQueries[kind](userId);
  const sort = kind === "contests" ? { submittedAt: -1 } : { updatedAt: -1 };
  const rows = await query.sort({ ...sort, _id: -1 }).skip((page - 1) * limit).limit(limit + 1).lean();
  const entries = rows.slice(0, limit).map((row) => {
    if (kind === "contests" && row.contestId) {
      const { questions, ...contest } = row.contestId;
      return { ...row, contestId: contest, questionId: questions.find((question) =>
        String(question.questionId) === String(row.questionId?._id ?? row.questionId)) ?? row.questionId };
    }
    return row;
  });
  return { entries, hasMore: rows.length > limit };
}
