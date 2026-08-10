import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { User } from "../models/user.models.js";
import { PlatformProfile } from "../models/user.models.js";
import { fetchGithubRawData } from "../services/github.service.js";
import { transformGithubResponse } from "../transformers/github.transformer.js";
import { fetchCodeforcesData } from "../services/codeforces.service.js";
import { fetchLeetcodeRawData } from "../services/leetcode.service.js";
import { transformLeetcodeResponse } from "../transformers/leetcode.transformer.js";
import { transformCodeforcesResponse } from "../transformers/codeforces.transformer.js";
import { recomputeUserStats } from "../services/userStats.service.js";

const getPlatformUsername = (user, platformName) => {
  const entry = user.connectedPlatforms?.find(
    (p) => p.platform?.toLowerCase() === platformName.toLowerCase(),
  );
  if (entry?.username) return entry.username;

  if (platformName === "leetcode" && user.leetcodeUsername)
    return user.leetcodeUsername;
  if (platformName === "codeforces" && user.codeforcesUsername)
    return user.codeforcesUsername;
  if (platformName === "github" && user.githubUsername)
    return user.githubUsername;

  return null;
};

const syncPlatform = async ({
  userId,
  platform,
  username,
  fetchRaw,
  transform,
}) => {
  let transformed;

  try {
    const raw = await fetchRaw(username);
    transformed = transform(raw);
  } catch (err) {
    await PlatformProfile.findOneAndUpdate(
      { userId, platform },
      { $set: { syncStatus: "failed", lastSyncedAt: new Date() } },
      { upsert: true },
    );
    throw err;
  }

  return PlatformProfile.findOneAndUpdate(
    { userId, platform },
    {
      $set: {
        handle: username,
        ...transformed,
        lastSyncedAt: new Date(),
        syncStatus: "success",
      },
    },
    { upsert: true, returnDocument: "after" },
  );
};

export const syncGithubProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  const githubUsername = getPlatformUsername(user, "github");
  if (!githubUsername) {
    throw new ApiError(400, "No GitHub username connected for this user");
  }

  const profile = await syncPlatform({
    userId: user._id,
    platform: "github",
    username: githubUsername,
    fetchRaw: fetchGithubRawData,
    transform: transformGithubResponse,
  });
  await recomputeUserStats(user._id);
  return res
    .status(200)
    .json(new ApiResponse(200, profile, "GitHub profile synced"));
});

export const syncLeetcodeProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  const leetcodeUsername = getPlatformUsername(user, "leetcode");
  if (!leetcodeUsername) {
    throw new ApiError(400, "No LeetCode username connected for this user");
  }

  const profile = await syncPlatform({
    userId: user._id,
    platform: "leetcode",
    username: leetcodeUsername,
    fetchRaw: fetchLeetcodeRawData,
    transform: transformLeetcodeResponse,
  });
  await recomputeUserStats(user._id);
  return res
    .status(200)
    .json(new ApiResponse(200, profile, "LeetCode profile synced"));
});

export const syncCodeforcesProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  const codeforcesUsername = getPlatformUsername(user, "codeforces");
  if (!codeforcesUsername) {
    throw new ApiError(400, "No Codeforces username connected for this user");
  }

  const profile = await syncPlatform({
    userId: user._id,
    platform: "codeforces",
    username: codeforcesUsername,
    fetchRaw: fetchCodeforcesData,
    transform: transformCodeforcesResponse,
  });
  await recomputeUserStats(user._id);
  return res
    .status(200)
    .json(new ApiResponse(200, profile, "Codeforces profile synced"));
});

export const syncAllProfiles = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  const promises = [];

  const leetcodeUsername = getPlatformUsername(user, "leetcode");
  if (leetcodeUsername) {
    promises.push(
      syncPlatform({
        userId: user._id,
        platform: "leetcode",
        username: leetcodeUsername,
        fetchRaw: fetchLeetcodeRawData,
        transform: transformLeetcodeResponse,
      }),
    );
  }

  const codeforcesUsername = getPlatformUsername(user, "codeforces");
  if (codeforcesUsername) {
    promises.push(
      syncPlatform({
        userId: user._id,
        platform: "codeforces",
        username: codeforcesUsername,
        fetchRaw: fetchCodeforcesData,
        transform: transformCodeforcesResponse,
      }),
    );
  }

  const githubUsername = getPlatformUsername(user, "github");
  if (githubUsername) {
    promises.push(
      syncPlatform({
        userId: user._id,
        platform: "github",
        username: githubUsername,
        fetchRaw: fetchGithubRawData,
        transform: transformGithubResponse,
      }),
    );
  }

  if (promises.length === 0) {
    throw new ApiError(400, "No platforms connected for this user");
  }

  const results = await Promise.allSettled(promises);

  const failed = results.filter((r) => r.status === "rejected");
  if (failed.length > 0) {
    console.error(
      "Some platform syncs failed:",
      failed.map((f) => f.reason),
    );
  }

  await recomputeUserStats(user._id);

  return res
    .status(200)
    .json(
      new ApiResponse(200, null, "All platform profiles synced successfully"),
    );
});

export const getUserStats = asyncHandler(async (req, res) => {
  const username = req.params.username || req.query.username;
  let user;
  if (username) {
    user = await User.findOne({ username });
  } else if (req.user?._id) {
    user = await User.findById(req.user._id);
  }
  if (!user) throw new ApiError(404, "User not found");

  if (!user.stats || !user.stats.lastSyncedAt) {
    await recomputeUserStats(user._id);
    user = await User.findById(user._id);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { stats: user.stats }, "User stats fetched"));
});

export const getSpecificPlatformData = asyncHandler(async (req, res) => {
  const { platform } = req.params;
  const username = req.params.username || req.query.username;

  const VALID_PLATFORMS = ["leetcode", "codeforces", "github"];
  if (!VALID_PLATFORMS.includes(platform)) {
    throw new ApiError(
      400,
      `Invalid platform. Must be one of: ${VALID_PLATFORMS.join(", ")}`,
    );
  }

  let user;
  if (username) {
    user = await User.findOne({ username });
  } else if (req.user?._id) {
    user = await User.findById(req.user._id);
  }

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const platformUsername = getPlatformUsername(user, platform);

  if (!platformUsername) {
    throw new ApiError(404, `No ${platform} username connected for this user.`);
  }

  let profile = await PlatformProfile.findOne({
    userId: user._id,
    platform,
  });

  if (
    !profile ||
    profile.syncStatus !== "success" ||
    profile.handle !== platformUsername ||
    !profile.stats?.activeDays
  ) {
    const platformConfig = {
      leetcode: {
        fetchRaw: fetchLeetcodeRawData,
        transform: transformLeetcodeResponse,
      },
      codeforces: {
        fetchRaw: fetchCodeforcesData,
        transform: transformCodeforcesResponse,
      },
      github: {
        fetchRaw: fetchGithubRawData,
        transform: transformGithubResponse,
      },
    };

    const config = platformConfig[platform];
    if (config) {
      try {
        profile = await syncPlatform({
          userId: user._id,
          platform,
          username: platformUsername,
          fetchRaw: config.fetchRaw,
          transform: config.transform,
        });
        await recomputeUserStats(user._id);
      } catch (err) {
        console.error(
          `Auto-sync failed for ${platform} (${platformUsername}):`,
          err?.message || err,
        );
      }
    }
  }

  if (!profile || profile.syncStatus === "failed") {
    throw new ApiError(
      404,
      `Failed to fetch ${platform} profile stats for username '${platformUsername}'.`,
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { profile },
        `${platform} profile data fetched successfully`,
      ),
    );
});
