import { Schema, model } from "mongoose";

const contestEventSchema = new Schema(
  {
    externalId: { type: Number, required: true, unique: true },
    event: { type: String, required: true },
    resource: { type: String, required: true },
    host: { type: String, default: "" },
    href: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    duration: { type: Number, default: 0 },
  },
  { timestamps: true },
);

contestEventSchema.index({ start: 1 });
contestEventSchema.index({ resource: 1, start: 1 });

export const ContestEvent = model("ContestEvent", contestEventSchema);
