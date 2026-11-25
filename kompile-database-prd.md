# Kompile database

Kompile uses MongoDB with Mongoose. Model definitions live in [server/src/models](server/src/models). Collection names below are the MongoDB names.

## Collections

| Collection | Stored data | Key indexes |
|---|---|---|
| `users` | Account, profile, connected handles, cached aggregate stats, platform role, and daily auto-sync timestamp | Unique username and email. Partial unique index on `role` for `superAdmin` |
| `platformprofiles` | Per-platform handle, profile metadata, ratings and stats, language and topic breakdowns, activity, recent accepted submissions, and sync status | Unique `{ userId, platform }` |
| `userloginlogs` | Sign-in dates used by the workspace calendar | Unique `{ userId, date }` |
| `sheets` | Practice sheet name, slug, description, source, question count, and optional `deletedAt` | Unique slug |
| `sheettopics` | Ordered topics and subtopics with an optional `parentTopicId` | `{ sheetId, parentTopicId, order }` |
| `sheetquestions` | Sheet question title, difficulty, platform, ordered position, and practice or resource links | `{ sheetId, topicId, order }` |
| `usersheetprogresses` | Per-user completion, completion date, and bookmark state for a sheet question | Unique `{ userId, questionId }`; `{ userId, sheetId }` |
| `companies` | Company kit metadata and question count | Unique slug |
| `companyquestions` | Company questions, difficulty, frequency, acceptance rate, link, and topics | `{ companyId, frequency }`, `{ companyId, difficulty }` |
| `usercompanyprogresses` | Per-user company question completion and completion date | Unique `{ userId, questionId }`; `{ userId, companyId }` |
| `dailymissions` | User-owned missions with title, priority, tags, and status | `{ userId, status }` |
| `rooms` | Room name, creator, invite code, and membership limit | Unique invite code |
| `roommembers` | User membership, room role, join date, and delegated contest-creation permission | Unique `{ roomId, userId }`; `{ userId }` |
| `roomcontests` | Room and creator IDs, contest timing, scoring matrix, and question snapshots | `{ roomId, startsAt }` |
| `roomcontestsolves` | Verified question, member, LeetCode account and submission, submission time, and awarded points | Unique `{ contestId, userId, questionId }` and `{ contestId, leetcodeUsername, questionId }` |
| `contestevents` | External contest listings and their start time, duration, resource, and original link | Unique external event ID; `{ start }`, `{ resource, start }` |
| `adminrolechanges` | Actor, affected account, previous and new roles, and change time | `{ createdAt, _id }` descending |

## Accounts and sync

Platform roles are `user`, `admin`, and `superAdmin`. Kompile checks the account’s current database role for protected admin requests. Room roles and contest-creation delegation are stored separately in `roommembers`.

The bootstrap script assigns the first Super Admin to a verified account and records the change with a null actor ID. Subsequent Admin grants and revocations write the user role and the audit record in one transaction. The admin directory and detail endpoints select reportable fields explicitly, excluding authentication secrets.

Profile sync stores provider results in `platformprofiles` and recomputes aggregate stats on `users`. The automatic sync compares successful per-platform timestamps with the browser’s local date and uses `profileAutoSyncAttemptedAt` to claim the daily attempt. Only platforms with a configured username are eligible. Manual sync can be requested separately.

## Practice and sheet publishing

Sheet and company questions are shared. Progress records are stored per user and question as users interact with them. Admin reports read those records for completion totals, recent practice, and sheet and topic breakdowns. Saved provider stats are displayed separately from practice completions.

CSV import validates rows and previews additions and edits. Publishing revalidates the preview and writes sheet metadata, topics, and questions in a transaction. Existing question IDs are preserved during updates so progress and bookmarks stay attached. MongoDB Atlas or a replica set is required for transactional operations.

Super Admin deletion sets `sheets.deletedAt`. Active sheet queries, user bookmarks, and the room contest question picker exclude deleted sheets. The underlying question records and progress history are retained, and a deleted sheet’s slug stays reserved.

## Rooms and contest scoring

A contest stores a snapshot of each selected question’s title, LeetCode slug, and difficulty, along with the point values. This keeps contest scoring stable when the original sheet changes.

Verification matches a saved LeetCode handle’s recent accepted submission to a contest question and requires a submission timestamp within the contest window. The effective verification deadline is three minutes after the contest ends. Unique solve indexes prevent the same member or LeetCode account from scoring twice on a question.

The contest leaderboard sums verified solve points and orders tied scores by when each member reached that score. The room’s Contest Points leaderboard sums those points across all of the room’s contests for current members.
