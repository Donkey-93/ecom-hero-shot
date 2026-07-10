import { NextRequest, NextResponse } from 'next/server';
import {
  TemplateSchema,
  PlaceholderSchema,
  ProductContextSchema,
  PlaceholderValueSchema,
} from '@/lib/schemas';
import { z } from 'zod';
import { llm } from '@/lib/llm';

const BodySchema = z.object({
  template: TemplateSchema,
  placeholder: PlaceholderSchema,
  currentValues: z.record(z.string(), PlaceholderValueSchema),
  productContext: ProductContextSchema,
});

export async function POST(req: NextRequest) {
  let body;
  try {
    body = BodySchema.parse(await req.json());
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
  try {
    const client = await llm();
    const value = await client.fillFreeStyle(body);
    return NextResponse.json({ value });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
