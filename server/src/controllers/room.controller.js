import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { Room } from "../models/room.models.js";
import { RoomMember } from "../models/roomMember.models.js";
import {
  createRoomWithAdmin,
  joinRoomByCode,
  leaveRoom,
} from "../services/room.service.js";

export const createRoom = asyncHandler(async (req, res) => {
  const { name, avatar, maxMembers } = req.body;

  const room = await createRoomWithAdmin({
    name,
    avatar,
    maxMembers,
    userId: req.user._id,
  });
  return res
    .status(201)
    .json(new ApiResponse(200, { room }, "room created successfully"));
});

export const joinRoom = asyncHandler(async (req, res) => {
  const { inviteCode } = req.body;
  const room = await joinRoomByCode({ inviteCode, userId: req.user._id });
  return res
    .status(200)
    .json(new ApiResponse(200, { room }, "Room joined successfully"));
});

export const getMyRooms = asyncHandler(async (req, res) => {
  const memberships = await RoomMember.find({ userId: req.user._id })
    .populate("roomId")
    .lean();

  const rooms = await Promise.all(
    memberships.map(async (m) => {
      const memberCount = await RoomMember.countDocuments({
        roomId: m.roomId._id,
      });
      return { ...m.roomId, role: m.role, memberCount };
    }),
  );
  return res
    .status(200)
    .json(new ApiResponse(200, { rooms }, "Rooms fetched successfully"));
});

export const leaveRoomHandler = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  await leaveRoom({ roomId, userId: req.user._id });

  return res.status(200).json(new ApiResponse(200, {}, "Left room"));
});

export const getRoomDetail = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  const membership = await RoomMember.findOne({ roomId, userId: req.user._id });
  if (!membership) throw new ApiError(403, "You are not a member of this room");

  const room = await Room.findById(roomId).lean();

  if (!room) throw new ApiError(404, "Room not found");

  const members = await RoomMember.find({ roomId })
    .populate("userId", "username avatar")
    .lean();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        room,
        members: members.map((m) => ({
          userId: m.userId._id,
          username: m.userId.username,
          avatar: m.userId.avatar,
          role: m.role,
          joinedAt: m.joinedAt,
        })),
      },
      "Room detail fetched",
    ),
  );
});
