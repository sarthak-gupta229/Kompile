import axios from "axios";
import { ContestEvent } from "../models/contestEvent.models.js";

const ALLOWED_PLATFORMS = [
  "codeforces.com",
  "leetcode.com",
  "codechef.com",
  "atcoder.jp",
  "hackerrank.com",
  "geeksforgeeks.org",
];

export const fetchAndStoreContests = async () => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(
    now.getFullYear(),
    now.getMonth() + 2,
    0,
    23,
    59,
    59,
  );

  const startStr = monthStart.toISOString().slice(0, 19);
  const endStr = monthEnd.toISOString().slice(0, 19);

  let response;
  try {
    response = await axios.get("https://clist.by/api/v4/contest/", {
      params: {
        username: process.env.CLIST_USERNAME,
        api_key: process.env.CLIST_API_KEY,
        start__gte: startStr,
        start__lte: endStr,
        order_by: "start",
        limit: 500,
      },
      timeout: 15000,
    });
  } catch (err) {
    console.error("Failed to fetch contests from clist.by:", err.message);
    throw err;
  }

  const contests = response.data?.objects || [];

  const filtered = contests.filter((c) =>
    ALLOWED_PLATFORMS.includes(c.resource),
  );

  let upsertedCount = 0;
  for (const c of filtered) {
    await ContestEvent.findOneAndUpdate(
      { externalId: c.id },
      {
        $set: {
          event: c.event,
          resource: c.resource,
          host: c.host || "",
          href: c.href,
          start: new Date(c.start.endsWith("Z") ? c.start : c.start + "Z"),
          end: new Date(c.end.endsWith("Z") ? c.end : c.end + "Z"),
          duration: c.duration || 0,
        },
      },
      { upsert: true },
    );
    upsertedCount += 1;
  }

  console.log(`Contest sync: upserted ${upsertedCount} events`);
  return upsertedCount;
};
