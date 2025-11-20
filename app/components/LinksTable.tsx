'use client';
import { useEffect, useState } from 'react';

type LinkRow = { id:number; code:string; target:string; clicks:number; last_clicked?: string | null };

export default function LinksTable() {
  const [rows, setRows] = useState<LinkRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  async function load() {
    setLoading(true);
    const res = await fetch('/api/links');
    const data = await res.json();
    setRows(data.map((r:any) => ({ id: r.id, code: r.code, target: r.target, clicks: r.clicks ?? 0, last_clicked: r.last_clicked })));
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function del(code: string) {
    if (!confirm(`Delete ${code}?`)) return;
    await fetch(`/api/links/${code}`, { method: 'DELETE' });
    load();
  }

  const filtered = rows.filter(r => r.code.includes(query) || r.target.includes(query));

  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center gap-2">
        <input className="border p-2 rounded flex-1" placeholder="Search by code or URL" value={query} onChange={e=>setQuery(e.target.value)} />
        <button className="bg-slate-700 text-white px-3 py-1 rounded" onClick={load}>Refresh</button>
      </div>
      {loading ? <div>Loading...</div> : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-2 text-left">Code</th>
                <th className="p-2 text-left">Target</th>
                <th className="p-2">Clicks</th>
                <th className="p-2">Last Clicked</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-t">
                  <td className="p-2 font-mono"><a className="text-blue-600" href={`/${r.code}`} target="_blank" rel="noreferrer">{r.code}</a></td>
                  <td className="p-2 max-w-xl truncate" title={r.target}>{r.target}</td>
                  <td className="p-2 text-center">{r.clicks}</td>
                  <td className="p-2 text-center">{r.last_clicked ? new Date(r.last_clicked).toLocaleString() : '-'}</td>
                  <td className="p-2 text-center">
                    <button className="text-red-600" onClick={() => del(r.code)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
