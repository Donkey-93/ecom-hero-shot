import { NextRequest, NextResponse } from 'next/server';
import {
  TemplateSchema,
  ColorPaletteSchema,
  ProductContextSchema,
  PlaceholderValueSchema,
} from '@/lib/schemas';
import { z } from 'zod';
import { renderPrompt } from '@/lib/renderer';
import { llm } from '@/lib/llm';

const BodySchema = z.object({
  template: TemplateSchema,
  values: z.record(z.string(), PlaceholderValueSchema),
  palette: ColorPaletteSchema,
  productImages: z.object({
    packaging: z.string().optional(),
    product: z.string().optional(),
  }),
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
    const result = await renderPrompt(
      body.template,
      body.values,
      body.palette,
      body.productImages,
      body.productContext,
      client
    );
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
