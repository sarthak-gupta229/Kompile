export function AdminStatus({ error, data }) {
  if (error) return <p role="alert" className="rounded-lg border border-red-900 bg-red-950 p-3 text-red-200">{error}</p>;
  if (data === undefined) return <p role="status" className="text-zinc-400">Loading…</p>;
  return null;
}

export function AdminTable({ columns, rows, empty = "No results found.", compactCards = false }) {
  if (!rows.length) return <p className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400">{empty}</p>;
  return (
    <>
    {compactCards && (
      <ul className="admin-compact-cards space-y-3">
        {rows.map(({ id, cells }) => (
          <li key={id} className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm">
            <div className="font-medium">{cells[0]}</div>
            <dl className="grid grid-cols-2 gap-3 border-y border-zinc-800 py-3">
              {cells.slice(1, -1).map((cell, index) => (
                <div key={columns[index + 1]} className="min-w-0">
                  <dt className="text-xs text-zinc-400">{columns[index + 1]}</dt>
                  <dd className="mt-1 break-words">{cell}</dd>
                </div>
              ))}
            </dl>
            <div>{cells.at(-1)}</div>
          </li>
        ))}
      </ul>
    )}
    <div className={`overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 ${compactCards ? "admin-wide-table" : ""}`}
      tabIndex={compactCards ? 0 : undefined} role={compactCards ? "region" : undefined}
      aria-label={compactCards ? "User directory table" : undefined}>
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-900 text-zinc-300">
          <tr>{columns.map((column) => <th key={column} scope="col" className="whitespace-nowrap px-4 py-3 font-medium">{column}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {rows.map(({ id, cells }) => (
            <tr key={id}>{cells.map((cell, index) => <td key={columns[index]} className="px-4 py-3 align-top">{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}

export function AdminPagination({ page, hasMore, onPage }) {
  if (page === 1 && !hasMore) return null;
  return (
    <div className="flex flex-wrap items-center justify-end gap-3 text-sm">
      <button className="admin-button" disabled={page === 1} onClick={() => onPage(page - 1)}>Previous</button>
      <span>Page {page}</span>
      <button className="admin-button" disabled={!hasMore} onClick={() => onPage(page + 1)}>Next</button>
    </div>
  );
}

export function AdminFields({ fields }) {
  return (
    <dl className="grid gap-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {fields.map(([label, value]) => (
        <div className="min-w-0" key={label}>
          <dt className="text-sm text-zinc-400">{label}</dt>
          <dd className="mt-1 break-words text-sm">{value ?? "—"}</dd>
        </div>
      ))}
    </dl>
  );
}
