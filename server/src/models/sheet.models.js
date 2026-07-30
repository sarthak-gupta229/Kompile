import mongoose, { model, Schema } from "mongoose";

const sheetSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
    totalQuestions: {
      type: Number,
      default: 0,
    },
    source: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export const Sheet = model("Sheet", sheetSchema);
