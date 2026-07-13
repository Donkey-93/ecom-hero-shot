import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { llm } from '@/lib/llm';

const BodySchema = z.object({
  images: z.array(z.string().regex(/^data:image\//)).min(1).max(4),
  hints: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = BodySchema.parse(await req.json());
    const client = await llm();
    const result = await client.identifyProductFromImages(body.images, body.hints);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message ?? 'identify failed' },
      { status: 500 },
    );
  }
}
