import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { DailyMission } from "../models/dailyMission.models.js";

export const createMission = asyncHandler(async (req, res) => {
  const { title, priority, tags } = req.body;

  const mission = await DailyMission.create({
    userId: req.user._id,
    title,
    priority,
    tags,
  });

  return res.status(201).json(new ApiResponse(201, mission, "Mission created"));
});

export const getMissions = asyncHandler(async (req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const missions = await DailyMission.find({
    userId: req.user._id,
    $or: [
      { status: "pending" },
      { status: "completed", completedAt: { $gte: startOfToday } },
    ],
  }).sort({ status: 1, createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, missions, "Missions fetched"));
});

export const toggleMission = asyncHandler(async (req, res) => {
  const { missionId } = req.params;
  const mission = await DailyMission.findOne({
    _id: missionId,
    userId: req.user._id,
  });

  if (!mission) {
    throw new ApiError(404, "Mission not found");
  }
  if (mission.status == "completed") {
    mission.status = "pending";
    mission.completedAt = null;
  } else {
    mission.status = "completed";
    mission.completedAt = new Date();
  }

  await mission.save();

  return res
    .status(200)
    .json(new ApiResponse(200, mission, "Mission toggled successfully"));
});

export const deleteMission = asyncHandler(async (req, res) => {
  const { missionId } = req.params;
  const mission = await DailyMission.findOneAndDelete({
    _id: missionId,
    userId: req.user._id,
  });

  if (!mission) {
    throw new ApiError(404, "Mission not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Mission deleted successfully"));
});
