import { NextRequest, NextResponse } from 'next/server';
import { extractPalettes, shouldMockFail } from '@/lib/palette';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  let body: { imageUrl?: string; count?: number } = {};
  try {
    body = await req.json();
  } catch {
    // empty body is ok, we fall back to 'default'
  }
  const imageUrl = body.imageUrl ?? 'default';
  const count = Math.max(1, Math.min(5, body.count ?? 3));

  if (shouldMockFail(imageUrl + ':' + count)) {
    return NextResponse.json({ error: 'Mock 失败' }, { status: 500 });
  }
  const palettes = extractPalettes(imageUrl, count);
  return NextResponse.json({ palettes });
}