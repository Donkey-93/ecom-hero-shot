import { NextRequest, NextResponse } from 'next/server';
import { BUILTIN_PRESETS } from '@/templates';
import { dbGet } from '@/lib/db';
import type { StylePreset } from '@/lib/schemas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const presetId = req.nextUrl.searchParams.get('presetId');

  if (presetId) {
    const builtin = BUILTIN_PRESETS.find(p => p.id === presetId);
    if (builtin) return NextResponse.json({ preset: builtin });
    const userJson = (await dbGet(presetId)) as StylePreset | null;
    if (userJson) return NextResponse.json({ preset: userJson });
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // list user presets (those saved as full StylePreset JSON in idb)
  // for SSR safety we only return builtins here; the client uses useLiveQuery
  // to subscribe to idb-stored user presets.
  return NextResponse.json({ builtin: BUILTIN_PRESETS });
}