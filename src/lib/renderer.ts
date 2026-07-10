import type { Template, ProductContext, ColorPalette, PlaceholderValue } from './schemas';
import type { LLMClient } from './llm';
import { looksLikeChinese, stringifyValues, paletteToCtx } from './renderer-utils';

export interface RenderResult {
  finalPrompt: string;
  chineseTranslation: string;
  missingFields: string[];
  fieldTranslations: Record<string, string>;
}

export async function renderPrompt(
  template: Template,
  values: Record<string, PlaceholderValue>,
  palette: ColorPalette,
  productImages: { packaging?: string; product?: string },
  productContext: ProductContext,
  llm: LLMClient,
): Promise<RenderResult> {
  const ctx: Record<string, string> = {
    ...stringifyValues(values),
    ...paletteToCtx(palette),
    packaging_url: productImages.packaging ?? '',
    product_url: productImages.product ?? '',
  };

  const fieldTranslations: Record<string, string> = {};
  for (const ph of template.placeholders) {
    const raw = ctx[ph.key];
    if (!raw) continue;

    const lang = ph.inputLanguage ?? 'auto';
    if (lang !== 'en' && looksLikeChinese(raw)) {
      const translated = await llm.translateToEnglish(raw, productContext);
      ctx[ph.key] = translated;
      fieldTranslations[ph.key] = translated;
    }
  }

  let finalPrompt = template.prompt;
  const missingFields: string[] = [];

  // First pass: declared placeholders (also flag missing).
  for (const ph of template.placeholders) {
    const val = ctx[ph.key];
    if (val === undefined || val === '') {
      missingFields.push(ph.key);
      finalPrompt = finalPrompt.replaceAll('{{' + ph.key + '}}', '[未填:' + ph.label + ']');
    } else {
      finalPrompt = finalPrompt.replaceAll('{{' + ph.key + '}}', String(val));
    }
  }

  // Second pass: replace any remaining ctx-derived placeholders (palette_*, packaging_url, product_url)
  // that the prompt uses but were not declared as user-fillable placeholders.
  for (const [k, v] of Object.entries(ctx)) {
    if (typeof v === 'string' && v.length > 0 && finalPrompt.includes('{{' + k + '}}')) {
      finalPrompt = finalPrompt.replaceAll('{{' + k + '}}', v);
    }
  }

  const chineseTranslation = await llm.translatePromptToChinese(finalPrompt, template, palette, productContext);

  return { finalPrompt, chineseTranslation, missingFields, fieldTranslations };
}