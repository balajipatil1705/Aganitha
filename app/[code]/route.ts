import { NextResponse } from 'next/server';
import { db } from '@/db';
import { links } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(_req: Request, { params }: { params: any }) {
  const { code } = (await params) as { code: string };
  const rows = await db.select().from(links).where(eq(links.code, code));
  if (!rows.length) return NextResponse.json({ error: 'not found' }, { status: 404 });
  const link = rows[0];

  try {
    await db.update(links).set({ clicks: link.clicks + 1, last_clicked: new Date() }).where(eq(links.code, code));
  } catch (e) {
    // ignore update errors for redirect path
  }

  return NextResponse.redirect(link.target, 302);
}
