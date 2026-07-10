import { NextRequest, NextResponse } from 'next/server';
import { ProductContextSchema } from '@/lib/schemas';
import { z } from 'zod';
import { llm } from '@/lib/llm';

const BodySchema = z.object({
  text: z.string(),
  context: ProductContextSchema,
});

export async function POST(req: NextRequest) {
  let parsed;
  try {
    parsed = BodySchema.parse(await req.json());
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
  try {
    const client = await llm();
    return NextResponse.json({
      text: await client.translateToEnglish(parsed.text, parsed.context),
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
