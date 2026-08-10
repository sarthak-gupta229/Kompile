import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { buildLeaderboard } from "../services/leaderboard.service.js";
import { RoomMember } from "../models/roomMember.models.js";

export const getGlobalLeaderboard = asyncHandler(async (req, res) => {
  const { metric = "totalQuestions", page = 1, limit = 20 } = req.query;

  const leaderboard = await buildLeaderboard({
    metric,
    page: Number(page),
    limit: Number(limit),
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, leaderboard, "Leaderboard fetched successfully"),
    );
});

export const getRoomLeaderboard = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { metric = "totalQuestions" } = req.query;

  const isMember = await RoomMember.findOne({ roomId, userId: req.user._id });
  if (!isMember) {
    throw new ApiError(403, "You are not a member of this room");
  }

  const members = await RoomMember.find({ roomId }).select("userId").lean();
  const memberIds = members.map((member) => member.userId);

  const leaderboard = await buildLeaderboard({
    metric,
    userIds: memberIds,
    page: 1,
    limit: memberIds.length || 1,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, leaderboard, "Leaderboard fetched successfully"),
    );
});
