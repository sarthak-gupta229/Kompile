import { Schema, model } from "mongoose";

const userCompanyProgressSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "CompanyQuestion",
      required: true,
    },
    completed: { type: Boolean, default: true },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

userCompanyProgressSchema.index({ userId: 1, questionId: 1 }, { unique: true });
userCompanyProgressSchema.index({ userId: 1, companyId: 1 });

export const UserCompanyProgress = model(
  "UserCompanyProgress",
  userCompanyProgressSchema,
);
