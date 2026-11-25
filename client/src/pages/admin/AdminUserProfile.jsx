import { useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { saveAdminRole } from "../../api/admin.api.js";
import { AdminFields, AdminPagination, AdminStatus, AdminTable } from "./AdminUI.jsx";
import { fieldLabel, formatDate, roleName } from "./adminFormat.js";
import { useAdminData } from "./useAdminData.js";

const platformNames = { leetcode: "LeetCode", codeforces: "Codeforces", github: "GitHub" };

function PlatformDetails({ platforms }) {
  if (!platforms.length) return <p className="text-sm text-zinc-400">No platform data has been synced.</p>;
  return platforms.map((platform) => (
    <details key={platform._id} className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
      <summary className="cursor-pointer font-medium">
        {platformNames[platform.platform] ?? platform.platform} · {platform.handle}
      </summary>
      <AdminFields fields={[
        ["Sync status", platform.syncStatus], ["Last synced", formatDate(platform.lastSyncedAt)],
        ...Object.entries(platform.stats ?? {}).map(([key, value]) => [fieldLabel(key), value]),
      ]} />
      {platform.languages?.length > 0 && (
        <AdminTable columns={["Language", "Count", "Percentage"]} rows={platform.languages.map((item, index) => ({
          id: index, cells: [item.name, item.count ?? "—", item.percentage == null ? "—" : `${item.percentage}%`],
        }))} />
      )}
      {platform.topicAnalysis?.length > 0 && (
        <AdminTable columns={["Topic", "Count"]} rows={platform.topicAnalysis.map((item, index) => ({
          id: index, cells: [item.topic, item.count],
        }))} />
      )}
      {platform.heatmap?.length > 0 && (
        <details className="space-y-2">
          <summary className="cursor-pointer text-sm">Daily activity ({platform.heatmap.length} days)</summary>
          <div className="max-h-64 overflow-auto">
            <AdminTable columns={["Date", "Count"]} rows={platform.heatmap.map((item, index) => ({
              id: index, cells: [item.date?.slice(0, 10), item.count],
            }))} />
          </div>
        </details>
      )}
      {platform.recentAcSubmissions?.length > 0 && (
        <AdminTable columns={["Recent accepted submission", "Solved at"]} rows={platform.recentAcSubmissions.map((item, index) => ({
          id: index, cells: [item.title, formatDate(item.solvedAt)],
        }))} />
      )}
    </details>
  ));
}

const activityColumns = {
  sheets: ["Sheet", "Question", "Difficulty", "Status", "Last activity"],
  companies: ["Company", "Question", "Difficulty", "Completed at"],
  contests: ["Contest", "Question", "Difficulty", "Points", "Submitted at"],
};

function ActivityList({ userId }) {
  const [kind, setKind] = useState("sheets");
  const [page, setPage] = useState(1);
  const result = useAdminData(`users/${userId}/activity/${kind}`, { page });
  const rows = result.data?.entries.map((row) => {
    const question = row.questionId?.title ?? "Unavailable";
    const difficulty = row.questionId?.difficulty || "—";
    let cells;
    if (kind === "companies") {
      cells = [row.companyId?.name ?? "Unavailable", question, difficulty, formatDate(row.completedAt)];
    } else if (kind === "contests") {
      cells = [row.contestId?.title ?? "Unavailable", question, difficulty, row.points, formatDate(row.submittedAt)];
    } else {
      const status = [row.completed && "Completed", row.bookmarked && "Bookmarked"].filter(Boolean).join(", ");
      cells = [row.sheetId?.name ?? "Unavailable", question, difficulty, status, formatDate(row.updatedAt)];
    }
    return { id: row._id, cells };
  });
  return (
    <section className="space-y-3">
      <h3 className="text-lg font-semibold">Question activity</h3>
      <label className="block max-w-xs text-sm">Activity type
        <select className="admin-field" value={kind} onChange={(event) => { setKind(event.target.value); setPage(1); }}>
          <option value="sheets">Sheet completions and bookmarks</option>
          <option value="companies">Company-kit completions</option>
          <option value="contests">Verified contest solves</option>
        </select>
      </label>
      {rows ? (
        <>
          <AdminTable columns={activityColumns[kind]} rows={rows} empty="No recorded activity." />
          <AdminPagination page={page} hasMore={result.data.hasMore} onPage={setPage} />
        </>
      ) : <AdminStatus {...result} />}
    </section>
  );
}

export default function AdminUserProfile() {
  const { userId } = useParams();
  const { isSuperAdmin } = useOutletContext();
  const [revision, setRevision] = useState(0);
  const [saving, setSaving] = useState(false);
  const [roleFeedback, setRoleFeedback] = useState(null);
  const result = useAdminData(`users/${userId}`, { revision });

  async function changeRole(role, username) {
    if (!window.confirm(`Change @${username} to ${roleName(role)}?`)) return;
    setSaving(true);
    setRoleFeedback(null);
    try {
      await saveAdminRole(userId, role);
      setRoleFeedback({ message: `Role updated to ${roleName(role)}.` });
      setRevision((previous) => previous + 1);
    } catch (error) {
      setRoleFeedback({ error: error.response?.data?.message || "Could not update the role." });
    } finally {
      setSaving(false);
    }
  }

  if (!result.data) return <AdminStatus {...result} />;
  const { user, progress } = result.data;
  return (
    <article className="space-y-6">
      <Link to="/workspace/admin/users" className="admin-link text-sm">Back to users</Link>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">{user.fullname || user.username}</h2>
          <p className="text-sm text-zinc-400">@{user.username} · {roleName(user.role)}</p>
        </div>
        {isSuperAdmin && user.role !== "superAdmin" && (
          <button className="admin-button" disabled={saving}
            onClick={() => changeRole(user.role === "admin" ? "user" : "admin", user.username)}>
            {saving ? "Saving…" : user.role === "admin" ? "Revoke Admin access" : "Grant Admin access"}
          </button>
        )}
      </header>
      {roleFeedback?.error && <p role="alert" className="text-red-300">{roleFeedback.error}</p>}
      {roleFeedback?.message && <p role="status" className="text-emerald-300">{roleFeedback.message}</p>}

      <section className="space-y-3">
        <h3 className="text-lg font-semibold">Account and profile</h3>
        <AdminFields fields={[
          ["Email", user.email], ["Email verified", user.isEmailVerified ? "Yes" : "No"],
          ["Joined", formatDate(user.createdAt)], ["Sign-in method", user.authProvider === "google" ? "Google" : "Email"],
          ["Bio", user.bio || null], ["Country", user.country || null], ["Skills", user.techStack?.join(", ") || null],
          ["Institution", user.education?.institution], ["Degree", user.education?.degree], ["Branch", user.education?.branch],
          ["Graduation year", user.education?.graduationYear],
          ...["linkedin", "twitter", "website", "resume"].map((field) => [fieldLabel(field), user.socialLinks?.[field]]),
        ]} />
        <AdminTable columns={["Connected platform", "Username", "Verified", "Connected at"]}
          rows={user.connectedPlatforms?.map((entry, index) => ({
            id: index, cells: [platformNames[entry.platform] ?? entry.platform, entry.username,
              entry.isVerified ? "Yes" : "No", formatDate(entry.connectedAt)],
          })) ?? []} empty="No saved platform usernames." />
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold">Practice progress</h3>
        <p className="text-sm text-zinc-400">{progress.company} company-kit questions completed.</p>
        {progress.sheets.map((sheet) => {
          const topics = new Map(sheet.topics.map((topic) => [topic._id, topic.name]));
          return (
            <details key={sheet._id} className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <summary className="cursor-pointer text-sm">{sheet.name} · {sheet.completed}/{sheet.totalQuestions} completed · {sheet.bookmarked} bookmarked</summary>
              <AdminTable columns={["Topic", "Completed", "Easy", "Medium", "Hard", "Unrated", "Bookmarks"]}
                rows={sheet.topics.map((topic) => ({
                  id: topic._id,
                  cells: [topic.parentTopicId ? `${topics.get(topic.parentTopicId) ?? ""} / ${topic.name}` : topic.name,
                    `${topic.completed}/${topic.total}`, ...["easy", "medium", "hard", "unrated"].map((level) => topic.difficulty[level] ?? 0), topic.bookmarked],
                }))} empty="No topics." />
            </details>
          );
        })}
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold">External platform stats</h3>
        <AdminFields fields={[
          ["Total solved", user.stats?.totalQuestions ?? 0],
          ["Active days", user.stats?.totalActiveDays ?? 0],
          ["Contests attended", user.stats?.contests?.totalAttended ?? 0],
        ]} />
        <PlatformDetails platforms={progress.platforms} />
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold">Rooms and contests</h3>
        <p className="text-sm text-zinc-400">{progress.contests.solved} verified contest solves · {progress.contests.points} points</p>
        <AdminTable columns={["Room", "Role", "Joined"]} rows={progress.rooms.map((room) => ({
          id: room._id, cells: [room.roomId?.name ?? "Unavailable", fieldLabel(room.role), formatDate(room.joinedAt)],
        }))} empty="No room memberships." />
      </section>

      <ActivityList key={userId} userId={userId} />
    </article>
  );
}
