import { Schema, model } from "mongoose";

const companyQuestionSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    title: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    frequency: { type: Number, default: 0 },
    acceptanceRate: { type: Number, default: 0 },
    link: { type: String, default: "" },
    topics: [{ type: String }],
  },
  { timestamps: true },
);

companyQuestionSchema.index({ companyId: 1, frequency: -1 });
companyQuestionSchema.index({ companyId: 1, difficulty: 1 });

export const CompanyQuestion = model("CompanyQuestion", companyQuestionSchema);

