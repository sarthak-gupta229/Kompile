import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { deleteAdminSheet } from "../../api/admin.api.js";
import { AdminStatus, AdminTable } from "./AdminUI.jsx";
import { useAdminData } from "./useAdminData.js";

export default function AdminManageSheets() {
  const { isSuperAdmin } = useOutletContext();
  const [revision, setRevision] = useState(0);
  const [pendingId, setPendingId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const result = useAdminData("sheets", { revision });

  async function deleteSheet(sheet) {
    if (pendingId) return;
    const confirmation = window.prompt(
      `This removes the sheet from My Sheets, bookmarks, and the contest question picker.\n\nType “${sheet.name}” to confirm deletion.`,
    );
    if (confirmation === null) return;
    if (confirmation !== sheet.name) {
      setFeedback({ error: "The sheet name did not match. The sheet was kept." });
      return;
    }
    setPendingId(sheet._id);
    setFeedback(null);
    try {
      await deleteAdminSheet(sheet._id);
      setFeedback({ message: `Deleted ${sheet.name}.` });
      setRevision((previous) => previous + 1);
    } catch (error) {
      setFeedback({ error: error.response?.data?.message || "Could not delete this sheet." });
    } finally {
      setPendingId(null);
    }
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Manage Sheets</h2>
      {feedback?.error && <p role="alert" className="rounded-lg bg-red-950 p-3 text-red-200">{feedback.error}</p>}
      {feedback?.message && <p role="status" className="text-emerald-300">{feedback.message}</p>}
      {result.data ? (
        <AdminTable columns={["Sheet", "Questions", ...(isSuperAdmin ? ["Actions"] : [])]}
          rows={result.data.map((sheet) => ({
            id: sheet._id,
            cells: [
              <Link to={`/workspace/sheets/${encodeURIComponent(sheet.slug)}`} className="admin-link break-words">{sheet.name}</Link>,
              sheet.totalQuestions,
              ...(isSuperAdmin ? [
                <button type="button" className="admin-button admin-danger" disabled={pendingId !== null}
                  aria-label={`Delete ${sheet.name}`} onClick={() => deleteSheet(sheet)}>
                  {pendingId === sheet._id ? "Deleting…" : "Delete"}
                </button>,
              ] : []),
            ],
          }))}
          empty="No sheets published." />
      ) : <AdminStatus {...result} />}
    </section>
  );
}
