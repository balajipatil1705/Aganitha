'use client';
import { useState } from 'react';

export default function LinkForm({ onCreated }: { onCreated?: () => void }) {
  const [target, setTarget] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, code: code || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'unknown');
      setSuccess(`Short link created: ${location.origin}/${data.code}`);
      setTarget(''); setCode('');
      onCreated?.();
    } catch (e: any) {
      setError(e.message || 'Failed');
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={submit} className="p-4 bg-white rounded shadow">
      <div className="mb-2">
        <label className="block text-sm font-medium">Target URL</label>
        <input className="w-full border rounded p-2" value={target} onChange={e=>setTarget(e.target.value)} placeholder="https://example.com/long/path" />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Custom Code (optional)</label>
        <input className="w-full border rounded p-2" value={code} onChange={e=>setCode(e.target.value)} placeholder="6-8 alphanumeric chars" />
      </div>
      <div className="flex items-center gap-2">
        <button className="bg-slate-800 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Creating...' : 'Create'}</button>
        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
      </div>
    </form>
  );
}
