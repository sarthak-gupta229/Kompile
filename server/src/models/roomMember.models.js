import { Schema, model } from "mongoose";
const roomMemberSchema = new Schema(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

roomMemberSchema.index({ roomId: 1, userId: 1 }, { unique: true });
roomMemberSchema.index({ userId: 1 });

export const RoomMember = model("RoomMember", roomMemberSchema);

