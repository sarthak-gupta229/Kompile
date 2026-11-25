import { useAdminData } from "./useAdminData.js";
import { AdminStatus, AdminTable } from "./AdminUI.jsx";

export default function AdminOverview() {
  const result = useAdminData("overview");
  if (!result.data) return <AdminStatus {...result} />;
  const data = result.data;
  const stats = [
    ["Registered users", data.totalUsers],
    ["Practiced in last 7 days", data.last7Days],
    ["Practiced in last 30 days", data.last30Days],
    ["Completed questions", data.totalCompleted],
  ];
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Overview</h2>
      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <dt className="text-sm text-zinc-400">{label}</dt>
            <dd className="mt-2 text-2xl font-semibold tabular-nums">{value.toLocaleString()}</dd>
          </div>
        ))}
      </dl>
      <h3 className="text-lg font-semibold">Sheet completion</h3>
      <p className="text-sm text-zinc-400">Completion rate is completed questions divided by the total questions available to all registered users.</p>
      <AdminTable columns={["Sheet", "Questions", "Completions", "Completion rate"]} rows={data.sheets.map((sheet) => ({
        id: sheet._id, cells: [sheet.name, sheet.totalQuestions, sheet.completed,
          new Intl.NumberFormat(undefined, { style: "percent", maximumFractionDigits: 1 }).format(sheet.completionRate)],
      }))} empty="No sheets published." />
    </section>
  );
}
