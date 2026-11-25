# Kompile

Kompile brings competitive programming profiles, DSA practice, interview preparation, and room contests into one workspace.

## Features

### Profile Tracker

- Combine LeetCode, Codeforces, and GitHub stats in a public profile with activity heatmaps, problem counts by difficulty, topic and language breakdowns, competitive ratings, and GitHub contribution stats.
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
- **Integrations** include LeetCode GraphQL, Codeforces REST, GitHub GraphQL, CLIST for contest listings, and Resend for email.

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

Open **Workspace → Admin panel** after signing in. In **Import Sheets**, download the CSV template for a new sheet or export an existing sheet before editing it. Keep existing question IDs to preserve completions and bookmarks. **Manage Sheets** lists published sheets and lets Super Admins delete them.
