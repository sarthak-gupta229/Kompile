import mongoose, { Schema, model } from "mongoose";

const userSheetProgressSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sheetId: {
      type: Schema.Types.ObjectId,
      ref: "Sheet",
      required: true,
    },
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "SheetQuestion",
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    bookmarked: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true },
);

userSheetProgressSchema.index({ userId: 1, questionId: 1 }, { unique: true });

userSheetProgressSchema.index({ userId: 1, sheetId: 1 });

export const UserSheetProgress = model(
  "UserSheetProgress",
  userSheetProgressSchema,
);
