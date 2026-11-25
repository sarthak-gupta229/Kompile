import express, { Router } from "express";
import mongoose from "mongoose";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { requireAdmin, requireSuperAdmin } from "../middlewares/admin.middleware.js";
import { User, PlatformProfile } from "../models/user.models.js";
import { AdminRoleChange } from "../models/adminRoleChange.models.js";
import { UserSheetProgress } from "../models/userSheetProgress.models.js";
import { UserCompanyProgress } from "../models/userCompanyProgress.models.js";
import { Sheet } from "../models/sheet.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { directoryFields, profileFields, groupCompletions, overview, userProgress, userActivity } from "../services/adminProgress.service.js";
import { planSheetImport, publishSheet, sheetCsv, sheetPreview, sheetTemplate } from "../services/adminSheets.service.js";

const router = Router();
const pageSize = 25;
router.use(verifyJWT, requireAdmin, express.json({ limit: "1mb" }));

function getPage(value = "1") {
  if (typeof value !== "string" || !/^[1-9]\d{0,5}$/.test(value)) {
    throw new ApiError(400, "Invalid page number.");
  }
  return Number(value);
}

function objectId(value) {
  if (!mongoose.isObjectIdOrHexString(value)) throw new ApiError(400, "Invalid ID.");
  return new mongoose.Types.ObjectId(value);
}

const send = (res, data) => res.json(new ApiResponse(200, data));

router.get("/overview", asyncHandler(async (_req, res) => send(res, await overview())));

router.get("/users", asyncHandler(async (req, res) => {
  const page = getPage(req.query.page);
  const search = typeof req.query.search === "string" ? req.query.search.trim().slice(0, 120) : "";
  const filter = search
    ? { $or: ["fullname", "username", "email"].map((field) => ({ [field]: {
        $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i",
      } })) }
    : {};
  const [users, total] = await Promise.all([
    User.find(filter).select(`${directoryFields} stats.totalQuestions stats.totalActiveDays stats.contests.totalAttended connectedPlatforms.platform connectedPlatforms.username`).sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * pageSize).limit(pageSize).lean(),
    User.countDocuments(filter),
  ]);
  const ids = users.map(({ _id }) => _id);
  const [sheetRows, companyRows, profiles] = await Promise.all([
    groupCompletions(UserSheetProgress, ids), groupCompletions(UserCompanyProgress, ids),
    PlatformProfile.find({ userId: { $in: ids }, platform: { $in: ["leetcode", "codeforces"] } })
      .select("userId platform handle stats.contestRating").lean(),
  ]);
  const sheets = new Map(sheetRows.map((row) => [String(row._id), row]));
  const companies = new Map(companyRows.map((row) => [String(row._id), row]));
  const ratings = new Map(profiles.map((profile) => [`${profile.userId}:${profile.platform}`, profile]));
  const entries = users.map(({ stats, connectedPlatforms, ...user }) => {
    const sheet = sheets.get(String(user._id));
    const company = companies.get(String(user._id));
    const latest = Math.max(+sheet?.latest || 0, +company?.latest || 0);
    const platforms = (connectedPlatforms ?? []).filter(({ username }) => username?.trim());
    const ratingFor = (platform) => {
      const profile = ratings.get(`${user._id}:${platform}`);
      return profile && platforms.some((entry) =>
        entry.platform === platform && entry.username.trim().toLowerCase() === profile.handle?.toLowerCase())
        ? profile.stats?.contestRating ?? null : null;
    };
    return { ...user, role: user.role ?? "user", sheetsCompleted: sheet?.count ?? 0,
      companyCompleted: company?.count ?? 0, latestPractice: latest ? new Date(latest) : null,
      totalQuestions: stats?.totalQuestions ?? 0, totalContests: stats?.contests?.totalAttended ?? 0,
      totalActiveDays: stats?.totalActiveDays ?? 0,
      leetcodeRating: ratingFor("leetcode"), codeforcesRating: ratingFor("codeforces"),
      platforms: Array.from(new Map(platforms.map(({ platform, username }) =>
        [platform, { platform, username: username.trim() }],
      )).values()),
    };
  });
  send(res, { entries, page, total, hasMore: page * pageSize < total });
}));

router.get("/users/:userId", asyncHandler(async (req, res) => {
  const id = objectId(req.params.userId);
  const user = await User.findById(id).select(profileFields).lean();
  if (!user) throw new ApiError(404, "User not found.");
  send(res, { user: { ...user, role: user.role ?? "user" }, progress: await userProgress(id) });
}));

router.get("/users/:userId/activity/:kind", asyncHandler(async (req, res) => {
  const id = objectId(req.params.userId);
  const { kind } = req.params;
  if (!["sheets", "companies", "contests"].includes(kind)) throw new ApiError(400, "Invalid activity type.");
  send(res, await userActivity(id, kind, getPage(req.query.page), pageSize));
}));

router.patch("/users/:userId/role", requireSuperAdmin, asyncHandler(async (req, res) => {
  const id = objectId(req.params.userId);
  const { role } = req.body ?? {};
  if (!["admin", "user"].includes(role)) throw new ApiError(400, "Choose Admin or User.");
  const changed = await mongoose.connection.transaction(async (session) => {
    const account = await User.findById(id).select("role").session(session);
    if (!account) throw new ApiError(404, "User not found.");
    if (account.role === "superAdmin") throw new ApiError(403, "The Super Admin role cannot be modified here.");
    const previous = account.role ?? "user";
    if (previous === role) return false;
    await User.updateOne({ _id: id }, { $set: { role } }, { session, runValidators: true });
    await AdminRoleChange.create([{ actorId: req.user._id, userId: id, fromRole: previous, toRole: role }], { session });
    return true;
  });
  send(res, { changed, role });
}));

router.get("/role-changes", requireSuperAdmin, asyncHandler(async (req, res) => {
  const page = getPage(req.query.page);
  const rows = await AdminRoleChange.find().sort({ createdAt: -1, _id: -1 })
    .skip((page - 1) * pageSize).limit(pageSize + 1)
    .populate("actorId", "username").populate("userId", "username").lean();
  send(res, { entries: rows.slice(0, pageSize), hasMore: rows.length > pageSize });
}));

router.get("/sheets", asyncHandler(async (_req, res) => {
  send(res, await Sheet.find({ deletedAt: null }).select("name slug description totalQuestions").sort({ name: 1 }).lean());
}));
router.get("/sheets/template", (_req, res) => res.type("text/csv").send(sheetTemplate()));
router.get("/sheets/:sheetId/csv", asyncHandler(async (req, res) => {
  const sheet = await Sheet.findOne({ _id: objectId(req.params.sheetId), deletedAt: null }).select("slug").lean();
  if (!sheet) throw new ApiError(404, "Sheet not found.");
  res.type("text/csv").send(await sheetCsv(sheet));
}));
router.post("/sheets/preview", asyncHandler(async (req, res) => {
  send(res, sheetPreview(await planSheetImport(req.body ?? {})));
}));
router.post("/sheets/publish", asyncHandler(async (req, res) => {
  send(res, await publishSheet(req.body ?? {}));
}));
router.delete("/sheets/:sheetId", requireSuperAdmin, asyncHandler(async (req, res) => {
  const sheetId = objectId(req.params.sheetId);
  const result = await Sheet.updateOne(
    { _id: sheetId, deletedAt: null },
    { $set: { deletedAt: new Date() } },
  );
  if (!result.matchedCount) throw new ApiError(404, "Sheet not found.");
  send(res, { sheetId });
}));

export default router;
