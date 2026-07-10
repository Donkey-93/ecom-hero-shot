import { NextRequest, NextResponse } from 'next/server';
import {
  TemplateSchema,
  ColorPaletteSchema,
  ProductContextSchema,
} from '@/lib/schemas';
import { z } from 'zod';
import { llm } from '@/lib/llm';

const BodySchema = z.object({
  prompt: z.string(),
  template: TemplateSchema,
  palette: ColorPaletteSchema,
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
    return NextResponse.json({
      chinese: await client.translatePromptToChinese(
        body.prompt,
        body.template,
        body.palette,
        body.productContext
      ),
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
