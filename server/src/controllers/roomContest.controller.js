import { isObjectIdOrHexString } from "mongoose";
import { RoomContest, RoomContestSolve } from "../models/roomContest.models.js";
import { RoomMember } from "../models/roomMember.models.js";
import { Sheet } from "../models/sheet.models.js";
import { SheetTopic } from "../models/sheetTopic.models.js";
import { SheetQuestion } from "../models/sheetQuestion.models.js";
import { fetchRecentLeetcodeAccepted } from "../services/leetcode.service.js";
import {
  contestStandings,
  difficulties,
  findContestSubmission,
  leetcodeSlug,
} from "../services/roomContest.service.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const sheetSlugs = ["love-babbar-450", "master-dsa-gfg-leetcode", "advanced-dsa-zero-to-hero"];
const minute = 60_000;
const verificationWindow = 3 * minute;

function verificationDeadline(contest) {
  return new Date(Math.min(+contest.verificationEndsAt, +contest.endsAt + verificationWindow));
}

async function requireMembership({ params: { roomId }, user }, permission) {
  const membership = await RoomMember.findOne({ roomId, userId: user._id }).lean();
  if (!membership) throw new ApiError(403, "You are not a member of this room.");
  if (permission && membership.role !== "admin") {
    if (permission === "admin" || !membership.canCreateContests) {
      throw new ApiError(403, "You do not have permission to perform this action.");
    }
  }
  return membership;
}

async function getContest({ roomId, contestId }) {
  if (!isObjectIdOrHexString(contestId)) throw new ApiError(400, "Invalid contest ID.");
  const contest = await RoomContest.findOne({ _id: contestId, roomId }).lean();
  if (!contest) throw new ApiError(404, "Contest not found.");
  return contest;
}

async function getCatalog(questionIds) {
  const sheets = await Sheet.find({ slug: { $in: sheetSlugs }, deletedAt: null }).select("name slug").lean();
  const filter = { sheetId: { $in: sheets.map(({ _id }) => _id) } };
  if (questionIds) filter._id = { $in: questionIds };
  const rows = await SheetQuestion.find(filter)
    .select("sheetId topicId title difficulty links")
    .sort({ title: 1 })
    .lean();
  const questions = rows.flatMap((row) => {
    const slug = leetcodeSlug(row.links?.leetcode) ?? leetcodeSlug(row.links?.primary);
    return slug ? [{
      questionId: row._id,
      sheetId: row.sheetId,
      topicId: row.topicId,
      title: row.title,
      slug,
      difficulty: difficulties.includes(row.difficulty) ? row.difficulty : null,
    }] : [];
  });
  return { sheets, questions };
}

function summary(contest) {
  const { _id, title, startsAt, endsAt, points, questionCount } = contest;
  const verificationEndsAt = verificationDeadline(contest);
  return { _id, title, startsAt, endsAt, verificationEndsAt, points, questionCount };
}

export const listRoomContests = asyncHandler(async (req, res) => {
  const membership = await requireMembership(req);
  const contests = await RoomContest.aggregate([
    { $match: { roomId: membership.roomId } },
    { $sort: { startsAt: -1 } },
    { $project: { title: 1, startsAt: 1, endsAt: 1, verificationEndsAt: 1, points: 1, questionCount: { $size: "$questions" } } },
  ]);
  return res.json(new ApiResponse(200, { contests: contests.map(summary), serverNow: Date.now() }));
});

export const getContestCatalog = asyncHandler(async (req, res) => {
  await requireMembership(req, "creator");
  const { sheets, questions } = await getCatalog();
  const topics = await SheetTopic.find({ sheetId: { $in: sheets.map(({ _id }) => _id) } })
    .select("sheetId parentTopicId name")
    .sort({ order: 1 })
    .lean();
  return res.json(new ApiResponse(200, { sheets, topics, questions }));
});

export const setContestPermission = asyncHandler(async (req, res) => {
  await requireMembership(req, "admin");
  const { roomId, userId } = req.params;
  const { canCreateContests } = req.body ?? {};
  if (!isObjectIdOrHexString(userId) || typeof canCreateContests !== "boolean") {
    throw new ApiError(400, "A member ID and contest permission are required.");
  }
  const result = await RoomMember.updateOne(
    { roomId, userId, role: "member" },
    { $set: { canCreateContests } },
  );
  if (!result.matchedCount) throw new ApiError(404, "Room member not found.");
  return res.json(new ApiResponse(200, { userId, canCreateContests }));
});

export const createRoomContest = asyncHandler(async (req, res) => {
  await requireMembership(req, "creator");
  const { title, startsAt, durationMinutes, questionCount, points, questions } = req.body ?? {};
  if (typeof title !== "string" || !title.trim() || title.trim().length > 120) {
    throw new ApiError(400, "Enter a contest title of 1 to 120 characters.");
  }
  if (!Number.isSafeInteger(durationMinutes) || durationMinutes < 1) {
    throw new ApiError(400, "Choose a positive duration in whole minutes.");
  }
  const start = new Date(typeof startsAt === "string" ? startsAt : NaN);
  const end = new Date(+start + durationMinutes * minute);
  const verificationEndsAt = new Date(+end + verificationWindow);
  if (!(+start > Date.now()) || !Number.isFinite(+verificationEndsAt)) {
    throw new ApiError(400, "Choose a valid contest window that starts in the future.");
  }
  if (!difficulties.every((level) => Number.isSafeInteger(points?.[level]) && points[level] >= 0)) {
    throw new ApiError(400, "Enter zero or a positive whole number for every difficulty.");
  }
  if (!Number.isSafeInteger(questionCount) || questionCount < 1 ||
      !Array.isArray(questions) || questions.length !== questionCount ||
      !questions.every((question) => typeof question?.questionId === "string" && isObjectIdOrHexString(question.questionId))) {
    throw new ApiError(400, "Select exactly the configured number of questions.");
  }
  if (!difficulties.every((level) => Number.isSafeInteger(points[level] * questionCount))) {
    throw new ApiError(400, "Choose smaller point values.");
  }

  const { questions: catalog } = await getCatalog(questions.map(({ questionId }) => questionId));
  const available = new Map(catalog.map((question) => [String(question.questionId), question]));
  const selectedSlugs = new Set();
  const selection = questions.map(({ questionId, difficulty }) => {
    const question = available.get(questionId.toLowerCase());
    if (!question || selectedSlugs.has(question.slug)) {
      throw new ApiError(400, "Choose distinct LeetCode questions from the contest sheets.");
    }
    selectedSlugs.add(question.slug);
    const level = question.difficulty ?? difficulty;
    if (!difficulties.includes(level)) {
      throw new ApiError(400, `Choose a difficulty for ${question.title}.`);
    }
    return { ...question, difficulty: level };
  });
  if (+start <= Date.now()) throw new ApiError(400, "Choose a future start time.");

  const contest = await RoomContest.create({
    roomId: req.params.roomId,
    createdBy: req.user._id,
    title: title.trim(),
    startsAt: start,
    endsAt: end,
    verificationEndsAt,
    points: Object.fromEntries(difficulties.map((level) => [level, points[level]])),
    questions: selection,
  });
  return res.status(201).json(new ApiResponse(201, {
    contest: summary({ ...contest.toObject(), questionCount }),
  }));
});

function canEndContest(membership, contest, userId) {
  return membership.role === "admin" || contest.createdBy.equals(userId);
}

export const endRoomContest = asyncHandler(async (req, res) => {
  const membership = await requireMembership(req);
  const contest = await getContest(req.params);
  if (!canEndContest(membership, contest, req.user._id)) {
    throw new ApiError(403, "Only a room admin or the contest creator can end this contest.");
  }

  const endedAt = new Date();
  const updated = await RoomContest.findOneAndUpdate(
    { _id: contest._id, roomId: contest.roomId, startsAt: { $lte: endedAt }, endsAt: { $gt: endedAt } },
    { $set: { endsAt: endedAt, verificationEndsAt: new Date(+endedAt + verificationWindow) } },
    { returnDocument: "after" },
  ).lean();
  if (!updated) throw new ApiError(409, "Only a live contest can be ended.");

  return res.json(new ApiResponse(200, {
    contest: summary({ ...updated, questionCount: updated.questions.length }),
    serverNow: Date.now(),
  }));
});

export const getContestLeaderboard = asyncHandler(async (req, res) => {
  const membership = await requireMembership(req);
  const contest = await getContest(req.params);
  const serverNow = Date.now();
  const solves = serverNow < +contest.startsAt
    ? []
    : await RoomContestSolve.find({ contestId: contest._id }).lean();
  res.set("Cache-Control", "private, no-store");
  return res.json(new ApiResponse(200, {
    contest: summary({ ...contest, questionCount: contest.questions.length }),
    questions: serverNow < +contest.startsAt ? [] : contest.questions,
    standings: contestStandings(solves),
    canEndContest: canEndContest(membership, contest, req.user._id),
    verifiedQuestionIds: solves
      .filter(({ userId }) => userId.equals(req.user._id))
      .map(({ questionId }) => questionId),
    serverNow,
  }));
});

export const verifyContestSolve = asyncHandler(async (req, res) => {
  await requireMembership(req);
  const contest = await getContest(req.params);
  const question = contest.questions.find(({ questionId }) => String(questionId) === req.params.questionId);
  if (!question) throw new ApiError(404, "Contest question not found.");

  const key = { contestId: contest._id, userId: req.user._id, questionId: question.questionId };
  const verified = () => res.json(new ApiResponse(200, { questionId: question.questionId }));
  const now = Date.now();
  if (now < +contest.startsAt || now >= +verificationDeadline(contest)) {
    throw new ApiError(409, "Contest verification is closed.");
  }
  if (await RoomContestSolve.exists(key)) return verified();

  const username = req.user.connectedPlatforms?.find(
    (platform) => platform.platform?.toLowerCase() === "leetcode",
  )?.username ?? req.user.leetcodeUsername;
  if (!username) throw new ApiError(400, "Connect your LeetCode username in your profile first.");

  const submissions = await fetchRecentLeetcodeAccepted(username);
  const currentContest = await getContest(req.params);
  if (Date.now() >= +verificationDeadline(currentContest)) {
    throw new ApiError(409, "Contest verification is closed.");
  }
  const submission = findContestSubmission(submissions, question.slug, currentContest.startsAt, currentContest.endsAt);
  if (!submission) throw new ApiError(422, "No matching accepted solve from the contest window was found in your recent submissions.");
  try {
    await RoomContestSolve.updateOne(key, {
      $setOnInsert: {
        ...key,
        ...submission,
        leetcodeUsername: username.toLowerCase(),
        username: req.user.username,
        points: contest.points[question.difficulty],
      },
    }, { upsert: true, timestamps: { updatedAt: false } });
  } catch (error) {
    if (error.code !== 11000) throw error;
    if (!await RoomContestSolve.exists(key)) {
      throw new ApiError(409, "This LeetCode account already verified this question in the contest.");
    }
  }
  return verified();
});
