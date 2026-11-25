import { useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { UserContext } from "../../context/UserContext.jsx";
import "./admin.css";

export default function AdminPanel() {
  const { user } = useContext(UserContext);
  if (!["admin", "superAdmin"].includes(user.role)) {
    return <p role="alert" className="text-zinc-200">Platform admin access is required.</p>;
  }

  const sections = [
    { to: "/workspace/admin", label: "Overview", end: true },
    { to: "/workspace/admin/users", label: "Users" },
    { to: "/workspace/admin/sheets", label: "Import Sheets", end: true },
    { to: "/workspace/admin/sheets/manage", label: "Manage Sheets" },
  ];
  if (user.role === "superAdmin") {
    sections.push({ to: "/workspace/admin/role-changes", label: "Role history" });
  }

  return (
    <div className="admin-panel mx-auto max-w-7xl space-y-6">
      <h1 className="text-2xl font-semibold sm:text-3xl">Admin panel</h1>
      <nav aria-label="Admin panel" className="flex flex-wrap gap-2 border-b border-zinc-800 pb-3">
        {sections.map(({ to, label, end }) => (
          <NavLink key={to} to={to} end={end} className="admin-button">{label}</NavLink>
        ))}
      </nav>
      <Outlet context={{ isSuperAdmin: user.role === "superAdmin" }} />
    </div>
  );
}
