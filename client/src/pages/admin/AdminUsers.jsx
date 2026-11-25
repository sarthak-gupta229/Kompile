import { useState } from "react";
import { Link } from "react-router-dom";
import { AdminPagination, AdminStatus, AdminTable } from "./AdminUI.jsx";
import { formatDate, roleName } from "./adminFormat.js";
import { useAdminData } from "./useAdminData.js";

const platforms = {
  leetcode: { name: "LeetCode", url: "https://leetcode.com/u/" },
  codeforces: { name: "Codeforces", url: "https://codeforces.com/profile/" },
  github: { name: "GitHub", url: "https://github.com/" },
  hackerrank: { name: "HackerRank", url: "https://www.hackerrank.com/profile/" },
  gfg: { name: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/user/" },
};

function PlatformLinks({ accounts }) {
  if (!accounts?.length) return "—";
  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1">
      {accounts.map(({ platform, username }) => {
        const link = platforms[platform];
        return <li key={platform}>{link ? (
          <a className="admin-link" href={link.url + encodeURIComponent(username)} target="_blank" rel="noopener noreferrer"
            aria-label={`${username} on ${link.name} (new tab)`}>{link.name}</a>
        ) : platform}</li>;
      })}
    </ul>
  );
}

const formatRating = (rating) => Number.isFinite(rating) ? rating.toFixed(2) : "—";

export default function AdminUsers() {
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const result = useAdminData("users", { page, search });
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Users</h2>
      <form className="flex flex-wrap items-end gap-3" onSubmit={(event) => {
        event.preventDefault();
        setPage(1);
        setSearch(draft.trim());
      }}>
        <label className="w-full text-sm sm:max-w-sm">
          Search by name, username, or email
          <input type="search" className="admin-field" value={draft} maxLength={120} onChange={(event) => setDraft(event.target.value)} />
        </label>
        <button className="admin-button">Search</button>
      </form>
      {result.data ? (
        <>
          <p role="status" className="text-sm text-zinc-400">{result.data.total.toLocaleString()} accounts</p>
          <AdminTable compactCards columns={["User", "Total questions", "Total contests", "Active days", "LeetCode rating",
            "Codeforces rating", "Platforms", "Email", "Role", "Sheet solves", "Company solves", "Latest practice", "Actions"]}
            rows={result.data.entries.map((user) => ({
              id: user._id,
              cells: [
                <Link className="admin-link break-words" to={`/workspace/profile/${encodeURIComponent(user.username)}`}>{user.fullname || user.username}
                  {user.fullname && <span className="block text-xs text-zinc-400">@{user.username}</span>}
                </Link>,
                user.totalQuestions, user.totalContests, user.totalActiveDays,
                formatRating(user.leetcodeRating), formatRating(user.codeforcesRating),
                <PlatformLinks accounts={user.platforms} />,
                user.email, roleName(user.role), user.sheetsCompleted, user.companyCompleted, formatDate(user.latestPractice),
                <Link className="admin-link whitespace-nowrap" to={user._id}
                  aria-label={`Admin details for @${user.username}`}>Admin details</Link>,
              ],
            }))} />
          <AdminPagination page={page} hasMore={result.data.hasMore} onPage={setPage} />
        </>
      ) : <AdminStatus {...result} />}
    </section>
  );
}

export function AdminRoleHistory() {
  const [page, setPage] = useState(1);
  const result = useAdminData("role-changes", { page });
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Role history</h2>
      {result.data ? (
        <>
          <AdminTable columns={["Changed by", "Account", "Previous role", "New role", "Date"]} rows={result.data.entries.map((entry) => ({
            id: entry._id,
            cells: [entry.actorId?.username ?? "Server setup", entry.userId?.username ?? "Unavailable",
              roleName(entry.fromRole), roleName(entry.toRole), formatDate(entry.createdAt)],
          }))} empty="No role changes recorded." />
          <AdminPagination page={page} hasMore={result.data.hasMore} onPage={setPage} />
        </>
      ) : <AdminStatus {...result} />}
    </section>
  );
}
