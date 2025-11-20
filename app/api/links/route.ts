import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { links } from '@/db/schema';
import { eq } from 'drizzle-orm';

function validCode(code: string) {
  return /^[A-Za-z0-9]{6,8}$/.test(code);
}

function makeCode(len = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let out = '';
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export async function GET() {
  const rows = await db.select().from(links).orderBy(links.created_at);
  return NextResponse.json(rows.map(r => ({
    id: r.id,
    code: r.code,
    target: r.target,
    clicks: r.clicks,
    created_at: r.created_at,
    last_clicked: r.last_clicked,
  })));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const target = (body.target || '').trim();
  let code = body.code ? String(body.code).trim() : '';

  if (!target) {
    return NextResponse.json({ error: 'target is required' }, { status: 400 });
  }

  try {
    const url = new URL(target);
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('invalid protocol');
    }
  } catch (e) {
    return NextResponse.json({ error: 'invalid URL' }, { status: 400 });
  }

  if (code) {
    if (!validCode(code)) {
      return NextResponse.json({ error: 'code must match [A-Za-z0-9]{6,8}' }, { status: 400 });
    }
    const exists = await db.select().from(links).where(eq(links.code, code));
    if (exists.length) {
      return NextResponse.json({ error: 'code already exists' }, { status: 409 });
    }
  } else {
    for (let i = 0; i < 5; i++) {
      const candidate = makeCode();
      const exists = await db.select().from(links).where(eq(links.code, candidate));
      if (!exists.length) { code = candidate; break; }
    }
    if (!code) code = makeCode(8);
  }

  const res = await db.insert(links).values({ code, target }).returning();
  const inserted = res[0];
  return NextResponse.json({ id: inserted.id, code: inserted.code, target: inserted.target }, { status: 201 });
}
