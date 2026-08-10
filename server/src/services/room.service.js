import { Room } from "../models/room.models.js";
import { RoomMember } from "../models/roomMember.models.js";
import { ApiError } from "../utils/api-error.js";

export const createRoomWithAdmin = async ({
  name,
  avatar,
  maxMembers,
  userId,
}) => {
  const room = await Room.create({
    name,
    avatar,
    maxMembers,
    createdBy: userId,
  });

  await RoomMember.create({ roomId: room._id, userId, role: "admin" });
  return room;
};

export const joinRoomByCode = async ({ inviteCode, userId }) => {
  const room = await Room.findOne({ inviteCode });
  if (!room) throw new ApiError(404, "Invalid invite code");

  const alreadyMember = await RoomMember.findOne({ roomId: room._id, userId });
  if (alreadyMember)
    throw new ApiError(400, "You are already a member of this room");

  const memberCount = await RoomMember.countDocuments({ roomId: room._id });
  if (memberCount >= room.maxMembers) {
    throw new ApiError(400, "This room is full");
  }

  await RoomMember.create({ roomId: room._id, userId, role: "member" });
  return room;
};

export const leaveRoom = async ({ roomId, userId }) => {
  const membership = await RoomMember.findOne({ roomId, userId });
  if (!membership) throw new ApiError(404, "You are not a member of this room");

  if (membership.role === "admin") {
    const otherAdmins = await RoomMember.countDocuments({
      roomId,
      role: "admin",
      userId: { $ne: userId },
    });
    const totalMembers = await RoomMember.countDocuments({ roomId });

    if (otherAdmins === 0 && totalMembers > 1) {
      throw new ApiError(
        400,
        "You are the only admin. Promote another member before leaving.",
      );
    }

    if (totalMembers === 1) {
      await Room.findByIdAndDelete(roomId);
    }
  }

  await membership.deleteOne();
};
