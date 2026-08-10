import { Schema, model } from "mongoose";
import { customAlphabet } from "nanoid";

const generateInviteCode = customAlphabet(
  "ABCDEFGHJKLMNPQRSTUVWXYZ23456789",
  6,
);

const roomSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    avtar: { type: String, default: "" },
    maxMembers: { type: Number, default: 5 },

    inviteCode: {
      type: String,
      unique: true,
      default: () => generateInviteCode(),
    },
  },
  { timestamps: true },
);

export const Room = model("Room", roomSchema);
