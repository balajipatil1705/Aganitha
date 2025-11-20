import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { links } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(_req: NextRequest, { params }: { params: any }) {
  const { code } = (await params) as { code: string };
  const rows = await db.select().from(links).where(eq(links.code, code));
  if (!rows.length) return NextResponse.json({ error: 'not found' }, { status: 404 });
  const r = rows[0];
  return NextResponse.json({ id: r.id, code: r.code, target: r.target, clicks: r.clicks, last_clicked: r.last_clicked, created_at: r.created_at });
}

export async function DELETE(_req: NextRequest, { params }: { params: any }) {
  const { code } = (await params) as { code: string };
  const rows = await db.select().from(links).where(eq(links.code, code));
  if (!rows.length) return NextResponse.json({ error: 'not found' }, { status: 404 });
  await db.delete(links).where(eq(links.code, code));
  return NextResponse.json({ ok: true });
}
