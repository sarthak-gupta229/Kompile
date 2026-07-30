import mongoose, { model, Schema } from "mongoose";

const sheetTopicSchema = new Schema(
  {
    sheetId: {
      type: Schema.Types.ObjectId,
      ref: "Sheet",
      required: true,
    },
    parentTopicId: {
      type: Schema.Types.ObjectId,
      ref: "SheetTopic",
      default: null,
    },
    code: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);
sheetTopicSchema.index({ sheetId: 1, parentTopicId: 1, order: 1 });
export const SheetTopic = model("SheetTopic", sheetTopicSchema);
