import { useState } from "react";
import { Link } from "react-router-dom";
import { downloadAdminCsv, importAdminSheet } from "../../api/admin.api.js";
import { AdminPagination, AdminStatus, AdminTable } from "./AdminUI.jsx";
import { useAdminData } from "./useAdminData.js";

const pageSize = 25;

export default function AdminSheets() {
  const [sheetId, setSheetId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [published, setPublished] = useState(null);
  const [pending, setPending] = useState("");
  const [revision, setRevision] = useState(0);
  const result = useAdminData("sheets", { revision });
  const selected = result.data?.find((item) => item._id === sheetId);

  async function download(path, filename) {
    try {
      await downloadAdminCsv(path, filename);
    } catch {
      setError("Could not download the CSV.");
    }
  }

  async function submit(event) {
    event.preventDefault();
    if (!file || pending) return;
    setPending("preview");
    setError("");
    setPublished(null);
    setPreview(null);
    try {
      const input = { sheetId, name, description, csv: await file.text() };
      const plan = await importAdminSheet("preview", input);
      setPreview({ ...plan, input });
      setPage(1);
    } catch (error) {
      setError(error.response?.data?.message || "Could not preview this import.");
    } finally {
      setPending("");
    }
  }

  async function publish() {
    if (!preview || preview.errors.length || pending) return;
    setPending("publish");
    setError("");
    try {
      const sheet = await importAdminSheet("publish", { ...preview.input, revision: preview.revision });
      setPublished(sheet);
      setPreview(null);
      setFile(null);
      setSheetId(sheet._id);
      setRevision((previous) => previous + 1);
    } catch (error) {
      setError(error.response?.data?.message || "Could not publish this sheet.");
      if (error.response?.status === 409) setPreview(null);
    } finally {
      setPending("");
    }
  }

  const previewRows = preview ? [
    ...preview.errors.map(({ row, message }) => ({ id: row, cells: [row, "Error", message] })),
    ...preview.rows.map(({ row, title, topic, action }) => ({ id: row, cells: [row, action, `${topic} · ${title}`] })),
  ] : [];

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Import Sheets</h2>
      <AdminStatus {...result} />
      <div className="flex flex-wrap gap-2">
        <button className="admin-button" onClick={() => download("sheets/template", "kompile-sheet-template.csv")}>Download CSV template</button>
        {selected && <button className="admin-button"
          onClick={() => download(`sheets/${selected._id}/csv`, `${selected.slug}.csv`)}>Download selected sheet CSV</button>}
      </div>
      <form className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4" onSubmit={submit}>
        <fieldset disabled={Boolean(pending)} className="space-y-4" onChange={() => {
          setPreview(null);
          setPublished(null);
          setError("");
        }}>
          <label className="block text-sm">Sheet to publish
            <select className="admin-field" value={sheetId} onChange={(event) => {
              const existing = result.data?.find((sheet) => sheet._id === event.target.value);
              setSheetId(event.target.value);
              setName(existing?.name ?? "");
              setDescription(existing?.description ?? "");
            }}>
              <option value="">Create a new sheet</option>
              {result.data?.map((sheet) => <option key={sheet._id} value={sheet._id}>{sheet.name}</option>)}
            </select>
          </label>
          <label className="block text-sm">Sheet name
            <input className="admin-field" required maxLength={120} value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label className="block text-sm">Description
            <textarea className="admin-field" rows={3} maxLength={1000} value={description} onChange={(event) => setDescription(event.target.value)} />
          </label>
          <label className="block text-sm">Question CSV
            <input key={revision} className="admin-field" type="file" accept=".csv,text/csv" required onChange={(event) => setFile(event.target.files[0])} />
          </label>
          {sheetId && <p className="text-sm text-zinc-400">Keep the exported question IDs when editing. Leave the question ID blank for new rows. Omitted questions stay in the sheet.</p>}
          <button className="admin-button admin-primary">{pending === "preview" ? "Checking CSV…" : "Preview import"}</button>
        </fieldset>
      </form>

      {error && <p role="alert" className="rounded-lg bg-red-950 p-3 text-red-200">{error}</p>}
      {published && <p role="status" className="text-emerald-300">Published {published.name} with {published.totalQuestions} questions.{" "}
        <Link className="admin-link" to={`/workspace/sheets/${published.slug}`}>Open sheet</Link>
      </p>}
      {preview && (
        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Import preview</h3>
          <p role="status" className="text-sm text-zinc-300">{preview.added} additions · {preview.edited} edits · {preview.topicsAdded} new topics · {preview.errors.length} errors</p>
          {preview.warnings.map((warning) => <p key={warning} className="text-sm text-amber-300">{warning}</p>)}
          <AdminTable columns={["CSV row", "Action", "Question or issue"]}
            rows={previewRows.slice((page - 1) * pageSize, page * pageSize)} />
          <AdminPagination page={page} hasMore={page * pageSize < previewRows.length} onPage={setPage} />
          <button className="admin-button admin-primary" disabled={Boolean(pending) || preview.errors.length > 0} onClick={publish}>
            {pending === "publish" ? "Publishing…" : "Publish sheet"}
          </button>
        </section>
      )}
    </section>
  );
}
