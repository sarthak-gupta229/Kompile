import { Schema, model } from "mongoose";

const companySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    logo: { type: String, default: "" },
    description: { type: String, default: "" },
    totalQuestions: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Company = model("Company", companySchema);
