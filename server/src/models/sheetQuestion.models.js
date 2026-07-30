import { Schema, model } from "mongoose";

const sheetQuestionSchema = new Schema(
  {
    sheetId: {
      type: Schema.Types.ObjectId,
      ref: "Sheet",
      required: true,
    },
    topicId: {
      type: Schema.Types.ObjectId,
      ref: "SheetTopic",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "",
    },
    platform: {
      type: String,
      default: "",
    },
    links: {
      primary: { type: String, default: "" },
      leetcode: { type: String, default: "" },
      gfg: { type: String, default: "" },
      article: { type: String, default: "" },
      video: { type: String, default: "" },
    },
    order: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

sheetQuestionSchema.index({ sheetId: 1, topicId: 1, order: 1 });

export const SheetQuestion = model("SheetQuestion", sheetQuestionSchema);
