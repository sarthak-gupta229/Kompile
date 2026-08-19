import { Schema, model } from "mongoose";

const userLoginLogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true },
);

userLoginLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export const UserLoginLog = model("UserLoginLog", userLoginLogSchema);
