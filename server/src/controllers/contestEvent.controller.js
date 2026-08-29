import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ContestEvent } from "../models/contestEvent.models.js";
import { fetchAndStoreContests } from "../services/contestEvent.service.js";

export const getContestEvents = asyncHandler(async (req, res) => {
  const now = new Date();
  const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const defaultEnd = new Date(
    now.getFullYear(),
    now.getMonth() + 2,
    0,
    23,
    59,
    59,
  );

  const start = req.query.start ? new Date(req.query.start) : defaultStart;
  const end = req.query.end ? new Date(req.query.end) : defaultEnd;

  const events = await ContestEvent.find({
    start: { $gte: start, $lte: end },
  })
    .sort({ start: 1 })
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, events, "Contest events fetched"));
});

export const syncContestEvents = asyncHandler(async (req, res) => {
  const count = await fetchAndStoreContests();
  return res
    .status(200)
    .json(new ApiResponse(200, { upserted: count }, "Contest sync complete"));
});

export const getTodayContests = asyncHandler(async (req, res) => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
  );

  const events = await ContestEvent.find({
    start: { $gte: startOfDay, $lte: endOfDay },
  })
    .sort({ start: 1 })
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, events, "Today's contests fetched"));
});
