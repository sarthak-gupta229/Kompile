# Kompile

Kompile brings competitive programming profiles, DSA practice, interview preparation, and room contests into one workspace.

## Features

### Profile Tracker

- Combine LeetCode, Codeforces, GeeksforGeeks, and GitHub stats in a public profile with activity heatmaps, problem counts by difficulty, topic and language breakdowns, competitive ratings, and GitHub contribution stats.
- Your first visit to your own profile each day automatically syncs connected platforms that have yet to sync successfully that day. The daily check uses your browser’s time zone and skips platforms without a saved username. You can also sync manually and see which platform failed if a sync runs into an error.
- Update your bio, education, skills, social links, and platform usernames in account settings. Profile editing and platform setup controls are available to the owner.
- Open the Kompile Card for a compact summary of your developer profile and activity.

### Practice and workspace

- Track progress through Striver A2Z, Love Babbar, Master DSA, and Advanced DSA. Browse by topic, mark questions complete, and bookmark questions for review.
- Practice with company-wise question kits for employers such as Google, Amazon, Meta, and Microsoft. Search and filter questions, sort by frequency, track completion, and review topic and difficulty analytics.
- Review recent practice activity and saved questions, manage daily missions with priorities and completion tracking, and see your sign-in history on the workspace calendar.

### Contest Tracker

- Browse upcoming programming contests in a calendar and event list. Open the original contest page to learn more or register, and see in-app alerts for contests happening today.

### Community and rooms

- Compare total solved questions, LeetCode ratings, and Codeforces ratings on the community and room leaderboards.
- Create rooms or join with an invite code. Each room shows its admins, who can grant or revoke contest creation access for individual members.
- Schedule a room contest by setting its start time, duration, question count, and points per Easy, Medium, and Hard solve. Any difficulty can award zero points.
- Select LeetCode questions from Love Babbar, Master DSA, and Advanced DSA. Filter by sheet, topic, or difficulty, search by title, and open questions in a new tab while selecting them.
- Questions unlock when the contest starts. A room admin or the contest creator can end a live contest early.
- Use **Verify solve** to check the 10 most recent accepted submissions for your saved LeetCode username. Each question scores once, and only submissions made during the contest qualify. Verification stays open for three minutes after the contest ends.
- Follow the contest leaderboard as verified points come in. It refreshes every 15 seconds while scoring is open, and tied scores favor the member who reached the score earlier. The room’s **Contest Points** leaderboard adds each member’s verified points across all contests in that room.

### Accounts and display

- Sign in with Google or email and password. Email accounts support verification, password changes, and password recovery.
- Use the workspace on desktop, tablet, or phone. On smaller screens, workspace navigation collapses and room leaderboards and contest forms adapt to the viewport.

## Tech stack

- **Frontend** uses React, Vite, React Router, Tailwind CSS, Axios, and Lucide.
- **Backend** uses Node.js, Express, MongoDB, and Mongoose. Authentication uses JWTs, HttpOnly cookies, bcrypt, and Passport for Google sign-in.
- **Integrations** include LeetCode GraphQL, Codeforces REST, GeeksforGeeks profile data, GitHub GraphQL, CLIST for contest listings, and Resend for email.

## Getting started

Use Node.js 22.12 or later, npm, and a local or hosted MongoDB instance.

```bash
git clone https://github.com/sarthak-gupta229/Kompile.git
cd Kompile
```

Copy the environment templates from the repository root.

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Fill in the server credentials in `server/.env` and register the configured callback URL in your Google OAuth client. The client template points to the local API.

Install dependencies and start the server and client in separate terminals from the repository root.

```bash
# Terminal 1
cd server
npm ci
npm run dev
```

```bash
# Terminal 2
cd client
npm ci
npm run dev
```

Open [localhost:5173](http://localhost:5173). On a fresh database, run `npm run seed:master-dsa` and `npm run seed:companies` from `server` to import the bundled Master DSA, Advanced DSA, and company question data. The Love Babbar and Striver A2Z migrations read from existing MongoDB source collections.

## Admin panel

Platform Admins can review user profiles and practice progress, view aggregate activity, and publish DSA sheets from CSV. A Super Admin can also grant and revoke Admin access and review the role history.

Admin role changes and sheet publishing use MongoDB transactions. Use MongoDB Atlas or a MongoDB replica set for these operations. After creating and verifying your Kompile account, run this command from the server directory with the email for that account.

```bash
npm run admin:bootstrap -- you@example.com
```

Open **Workspace → Admin panel** after signing in. In **Import Sheets**, download the CSV template for a new sheet or export an existing sheet before editing it. Keep existing question IDs to preserve completions and bookmarks. **Manage Sheets** lists published sheets and lets Super Admins delete them after typing the exact sheet name.

## Routes

### Browser pages

| Access | Path | Page |
|---|---|---|
| Public | `/` | Landing page. Signed-in users go to the Workspace dashboard |
| Public | `/dashboard` | Standalone dashboard page |
| Public | `/events`, `/company` | Contest calendar and company kit overview |
| Public | `/profile/:username` | Public Profile Tracker |
| Auth flow | `/login`, `/register`, `/forgot-password`, `/forgot-password/:token`, `/reset-password/:token` | Sign-in, registration, and password recovery |
| Auth flow | `/verify-email`, `/verify-email/:token`, `/oauth-success` | Email and Google sign-in callbacks |
| Signed in | `/workspace`, `/user_data` | Workspace dashboard and account settings |
| Signed in | `/profile`, `/workspace/profile`, `/workspace/profile/:username` | Profile Tracker |
| Signed in | `/workspace/sheets`, `/workspace/sheets/:slug`, `/workspace/bookmarks` | Sheet list, sheet detail, and bookmarks |
| Signed in | `/workspace/sheets/love-babbar-450/:topicSlug` | Love Babbar topic details |
| Signed in | `/workspace/company-kit`, `/workspace/company-kit/:companySlug` | Company kits and question lists. `/company/:companySlug` redirects to the workspace kit |
| Signed in | `/workspace/community`, `/workspace/room` | Community leaderboard and room list |
| Room member | `/workspace/room/:roomId` | Room leaderboards and contests |
| Admin or Super Admin | `/workspace/admin`, `/workspace/admin/users`, `/workspace/admin/users/:userId` | Admin overview, user directory, and user reports |
| Admin or Super Admin | `/workspace/admin/sheets`, `/workspace/admin/sheets/manage` | Import Sheets and Manage Sheets |
| Super Admin | `/workspace/admin/role-changes` | Role-change history |

### Backend API

Paths below are relative to `/api/v1`. Signed-in endpoints use the session cookie or a bearer access token. Room and admin endpoints also check the relevant membership or role.

| Area | Endpoints | Access |
|---|---|---|
| Health and events | `GET /healthcheck`, `GET /events/contests`, `GET /events/contests/today`, `POST /events/contests/sync` | Public |
| Accounts | `POST /auth/register`, `POST /auth/login`, `POST /auth/resend-email-verification`, `GET /auth/verify-email/:verificationToken`, `POST /auth/forgot-password`, `POST /auth/reset-password/:resetToken`, `GET /auth/google`, `GET /auth/google/callback` | Public auth flows |
| Sessions | `POST /auth/refresh-token`, `POST /auth/logout`, `GET /auth/current-user`, `POST /auth/change-password`, `GET /auth/me/login-history` | Refresh token for refresh; signed in for the rest |
| Public profiles | `GET /users/profile/:username`, `GET /users/get-basic-info/:username`, `GET /platforms/stats/:username`, `GET /platforms/:platform/:username` | Public |
| Own profile | `GET /users/get-basic-info`, `PUT /users/update-basic-info`, `GET /users/stats`, `GET /platforms/stats`, `GET /platforms/:platform`, `POST /platforms/sync/:platform` | Signed in. Sync accepts `leetcode`, `codeforces`, `github`, `gfg`, or `all` |
| DSA sheets | `GET /sheets`, `GET /sheets/:slug`, `GET /sheets/bookmarks`, `PATCH /sheets/:sheetId/questions/:questionId/toggle`, `PATCH /sheets/:sheetId/questions/:questionId/bookmark` | Signed in |
| Company kits | `GET /companies`, `GET /companies/:companyId/questions`, `GET /companies/:companyId/topics`, `POST /companies/:companyId/questions/:questionId/toggle` | Signed in |
| Daily missions | `GET /missions`, `POST /missions/create`, `PATCH /missions/toggle/:missionId`, `DELETE /missions/delete/:missionId` | Signed in |
| Rooms | `POST /rooms`, `POST /rooms/join-room`, `GET /rooms/mine`, `GET /rooms/:roomId`, `POST /rooms/:roomId/leave` | Signed in. Room detail and exit require membership |
| Leaderboards | `GET /leaderboard/leaderboard`, `GET /leaderboard/rooms/:roomId/leaderboard` | Signed in. Room leaderboard requires membership and supports `metric=contestPoints` |
| Room contests | `GET /rooms/:roomId/contests`, `GET /rooms/:roomId/contests/:contestId/leaderboard`, `POST /rooms/:roomId/contests/:contestId/questions/:questionId/verify` | Room member |
| Contest management | `POST /rooms/:roomId/contests`, `GET /rooms/:roomId/contests/catalog`, `POST /rooms/:roomId/contests/:contestId/end`, `PATCH /rooms/:roomId/members/:userId/contest-permission` | Room admins manage creator access. Admins and delegated creators can create contests and browse the catalog. Admins and the contest creator can end a live contest |
| Admin reports | `GET /admin/overview`, `GET /admin/users`, `GET /admin/users/:userId`, `GET /admin/users/:userId/activity/:kind` | Admin or Super Admin. Activity kinds are `sheets`, `companies`, and `contests` |
| Admin sheets | `GET /admin/sheets`, `GET /admin/sheets/template`, `GET /admin/sheets/:sheetId/csv`, `POST /admin/sheets/preview`, `POST /admin/sheets/publish` | Admin or Super Admin |
| Super Admin | `PATCH /admin/users/:userId/role`, `GET /admin/role-changes`, `DELETE /admin/sheets/:sheetId` | Super Admin |

See the [database reference](kompile-database-prd.md) for collections, indexes, and data flows.
