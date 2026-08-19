import { Schema, model } from "mongoose";

const dailyMissionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    priority: {
      type: String,
      enum: ["High Priority", "Medium", "Low"],
      default: "Medium",
    },
    tags: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

dailyMissionSchema.index({ userId: 1, status: 1 });

export const DailyMission = model("DailyMission", dailyMissionSchema);
