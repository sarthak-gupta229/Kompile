# Kompile — Database PRD

**Owner:** Sarthak Gupta
**Database:** MongoDB
**Status:** Draft v1
**Last updated:** July 2026

---

## 1. Purpose

This document defines the MongoDB data model for Kompile — a developer profile aggregator with DSA sheet tracking, company-wise question kits, and community/rooms features. It covers all collections, their schemas, relationships, indexes, and the read/write flows that depend on them.

## 2. Scope

Covers three product areas:
1. **Platform Profiles** — aggregated stats from LeetCode, Codeforces, GitHub
2. **Sheets & Company Kits** — shared question banks with per-user progress tracking
3. **Community** — friends, rooms, leaderboards (total + weekly)

## 3. Design principles

- **Shared master data, sparse user data.** Questions (sheet questions, company questions) are stored once and referenced by ID. User-specific state (completed, starred) is stored in separate "progress" collections, and only a document is written when a user actually interacts with a question — never pre-populated for the full question list.
- **Upsert over insert** for anything synced from external APIs (`platformProfiles`), keyed by a unique compound index so re-syncing never creates duplicates.
- **Denormalized aggregate stats** on `platformProfiles` for fast profile-page reads — no on-the-fly recomputation from raw submission history.
- **Snapshot table for time-series needs.** Running totals can't answer "how much this week" — `dailyActivitySnapshot` exists solely to make weekly leaderboards possible.

---

## 4. Collections overview

| # | Collection | Purpose | Written by |
|---|---|---|---|
| 1 | `users` | Core account/auth/profile data | Auth flow, profile edits |
| 2 | `platformProfiles` | Synced stats per user per platform | Sync jobs (LeetCode/Codeforces/GitHub) |
| 3 | `sheets` | Metadata for DSA sheets (Striver A2Z, Love Babbar) | Admin/seed script |
| 4 | `sheetQuestions` | Shared question list per sheet | Admin/seed script |
| 5 | `userSheetProgress` | Per-user completion state on sheet questions | User checking off a question |
| 6 | `companies` | Metadata for company kits (Google, Amazon, etc.) | Admin/seed script |
| 7 | `companyQuestions` | Shared question list per company | Admin/seed script |
| 8 | `userCompanyProgress` | Per-user completion/star state on company questions | User checking off / starring a question |
| 9 | `friendRequests` | Friend connections between users | Search & connect flow |
| 10 | `rooms` | Group/room metadata | Room creation |
| 11 | `roomMembers` | Membership + role per room | Join/create room |
| 12 | `dailyActivitySnapshot` | Daily delta of questions solved, per user | Nightly cron |

---

## 5. Schema definitions

### 5.1 `users`
Existing collection — auth boilerplate plus profile fields (name, bio, socials, about tags). Not redefined here; referenced by `userId` throughout.

---

### 5.2 `platformProfiles`

One document per user per platform.

```js
{
  userId: ObjectId,          // ref users
  platform: "leetcode" | "codeforces" | "github",
  handle: String,
  profileUrl: String,
  avatarUrl: String,

  stats: {
    // leetcode / codeforces
    totalQuestions: Number,
    contestRating: Number,
    contestsAttended: Number,
    easySolved: Number,
    mediumSolved: Number,
    hardSolved: Number,
    activeDays: Number,

    // github-specific
    totalContributions: Number,
    maxStreak: Number,
    currentStreak: Number,
    stars: Number,
    commits: Number,
    prs: Number,
    issues: Number,
  },

  languages: [{ name: String, percentage: Number }],   // github only
  topicAnalysis: [{ topic: String, count: Number }],   // leetcode only
  heatmap: [{ date: Date, count: Number }],

  lastSyncedAt: Date,
  syncStatus: "success" | "failed" | "pending",
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:** unique compound `{ userId: 1, platform: 1 }`

**Write pattern:** `findOneAndUpdate({ userId, platform }, { $set: {...} }, { upsert: true })` — never insert directly, always upsert to prevent duplicate profile docs across syncs.

---

### 5.3 `sheets`

```js
{
  name: String,          // "Strivers A2Z DSA Sheet"
  slug: String,
  description: String,
  totalQuestions: Number,
  source: String
}
```

### 5.4 `sheetQuestions`

```js
{
  sheetId: ObjectId,     // ref sheets
  title: String,
  difficulty: String,
  platform: String,
  link: String,
  topic: String,
  order: Number
}
```

**Indexes:** `{ sheetId: 1, order: 1 }`

### 5.5 `userSheetProgress`

Sparse — one doc only when a user marks a question, not pre-populated.

```js
{
  userId: ObjectId,
  sheetId: ObjectId,
  questionId: ObjectId,   // ref sheetQuestions
  completed: Boolean,
  completedAt: Date
}
```

**Indexes:** unique compound `{ userId: 1, questionId: 1 }`

**Read pattern:** progress count = `countDocuments({ userId, sheetId, completed: true })`, not a scan of all 445 questions.

---

### 5.6 `companies`

```js
{
  name: String,          // "Google"
  slug: String,
  logo: String,
  description: String,
  totalQuestions: Number
}
```

### 5.7 `companyQuestions`

```js
{
  companyId: ObjectId,   // ref companies
  title: String,
  platform: String,
  difficulty: String,
  popularity: "very hot" | "hot" | "warm" | "cold",
  tags: [String],
  link: String
}
```

**Indexes:** `{ companyId: 1 }`, `{ companyId: 1, difficulty: 1 }`

### 5.8 `userCompanyProgress`

```js
{
  userId: ObjectId,
  companyId: ObjectId,
  questionId: ObjectId,   // ref companyQuestions
  completed: Boolean,
  starred: Boolean,
  completedAt: Date
}
```

**Indexes:** unique compound `{ userId: 1, questionId: 1 }`

**Note:** kept as a separate collection from `userSheetProgress` rather than unified, since the two features already diverge in fields (`starred`, popularity filtering vs. ordered steps) and reference disjoint question pools.

---

### 5.9 `friendRequests`

```js
{
  requester: ObjectId,    // ref users
  recipient: ObjectId,    // ref users
  status: "pending" | "accepted" | "rejected",
  createdAt: Date
}
```

**Indexes:** unique compound `{ requester: 1, recipient: 1 }`, `{ recipient: 1, status: 1 }`

**Note:** no separate `friendships` collection — an accepted friendship is queried as `friendRequests.find({ status: "accepted", $or: [{requester: userId}, {recipient: userId}] })`.

### 5.10 `rooms`

```js
{
  name: String,
  slug: String,
  createdBy: ObjectId,    // ref users
  avatar: String,
  maxMembers: Number,     // e.g. 5
  inviteCode: String,     // short unique code, e.g. nanoid
  createdAt: Date
}
```

### 5.11 `roomMembers`

```js
{
  roomId: ObjectId,       // ref rooms
  userId: ObjectId,       // ref users
  role: "admin" | "member",
  joinedAt: Date
}
```

**Indexes:** unique compound `{ roomId: 1, userId: 1 }`, `{ userId: 1 }` (for "which rooms is this user in")

### 5.12 `dailyActivitySnapshot`

```js
{
  userId: ObjectId,
  date: Date,                    // truncated to day
  questionsSolvedToday: Number
}
```

**Indexes:** unique compound `{ userId: 1, date: 1 }`

**Write pattern:** nightly cron diffs today's summed `platformProfiles.stats.totalQuestions` against yesterday's stored total per user, writes the delta. This is the only collection weekly leaderboards read from.

---

## 6. Key read flows

### 6.1 Profile page (Image: Profile Tracker)
```js
PlatformProfile.find({ userId }).lean()
```
Single query, group by `platform` client-side for tabs.

### 6.2 Sheet progress (Image: My Sheets)
```js
SheetQuestion.find({ sheetId })                          // full list
UserSheetProgress.find({ userId, sheetId, completed: true }) // solved set
```

### 6.3 Room leaderboard — total questions
```js
RoomMember.find({ roomId }).populate("userId")
PlatformProfile.aggregate([
  { $match: { userId: { $in: userIds } } },
  { $group: { _id: "$userId", totalQuestions: { $sum: "$stats.totalQuestions" } } },
  { $sort: { totalQuestions: -1 } }
])
```

### 6.4 Room leaderboard — weekly questions
```js
DailyActivitySnapshot.aggregate([
  { $match: { userId: { $in: userIds }, date: { $gte: sevenDaysAgo } } },
  { $group: { _id: "$userId", weeklyTotal: { $sum: "$questionsSolvedToday" } } },
  { $sort: { weeklyTotal: -1 } }
])
```

### 6.5 Global ranking (Codolio-style)
Same as 6.3/6.4 without the `userId: { $in: userIds }` filter, paginated with `$skip`/`$limit`.

---

## 7. Sync flow (platformProfiles)

1. **Trigger** — manual refresh or nightly cron.
2. **Fetch** — hit platform API (LeetCode GraphQL / Codeforces REST / GitHub REST+GraphQL) using stored `handle`.
3. **Transform** — platform-specific function (`transformLeetcodeResponse`, `transformCodeforcesResponse`, `transformGithubResponse`) normalizes into the common `stats` / `languages` / `topicAnalysis` / `heatmap` shape.
4. **Upsert** — write via `findOneAndUpdate` with `upsert: true` on `{ userId, platform }`.
5. **Failure handling** — on error, set `syncStatus: "failed"` and update `lastSyncedAt` rather than leaving stale silent data.

---

## 8. Open questions / future decisions

- Should `userSheetProgress` and `userCompanyProgress` be unified into a generic `userProgress` collection if a third progress-tracked feature is added?
- Overlapping questions between sheets and company kits (e.g. "Two Sum" appears in both) are currently tracked as independent progress — deliberate, not a bug, but worth revisiting if users request cross-feature sync.
- Global ranking (`Codolio Score`) computation formula not yet defined — needs its own spec once the weighting between DSA/CP/dev activity is decided.
