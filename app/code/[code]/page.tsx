import Header from '../../components/Header';
import { db } from '@/db';
import { links } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function Page({ params }: { params: { code: string } }) {
  const code = params.code;
  const rows = await db.select().from(links).where(eq(links.code, code));
  if (!rows.length) return (
    <div>
      <Header />
      <main className="max-w-4xl mx-auto p-4">Not found</main>
    </div>
  );
  const r = rows[0];
  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <main className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-2">Stats for {r.code}</h1>
        <div className="bg-white p-4 rounded shadow">
          <p><strong>Target:</strong> <a className="text-blue-600" href={r.target}>{r.target}</a></p>
          <p><strong>Clicks:</strong> {r.clicks}</p>
          <p><strong>Created:</strong> {new Date(r.created_at).toLocaleString()}</p>
          <p><strong>Last Clicked:</strong> {r.last_clicked ? new Date(r.last_clicked).toLocaleString() : '-'}</p>
        </div>
      </main>
    </div>
  );
}
