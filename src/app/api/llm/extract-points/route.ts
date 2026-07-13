import { NextRequest, NextResponse } from 'next/server';
import { ProductContextSchema } from '@/lib/schemas';
import { llm } from '@/lib/llm';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  let body: { context?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: '缺少请求体' }, { status: 400 });
  }

  const parsed = ProductContextSchema.safeParse(body.context);
  if (!parsed.success) {
    return NextResponse.json(
      { error: '产品信息不合法', details: parsed.error.issues },
      { status: 400 },
    );
  }
  const ctx = parsed.data;

  try {
    const client = await llm();
    const result = await client.extractSellingPoints(ctx);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'LLM 失败' },
      { status: 500 },
    );
  }
}