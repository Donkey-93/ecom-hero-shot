import { describe, it, expect, vi } from 'vitest';
import { renderPrompt } from '@/lib/renderer';
import type { Template, ProductContext, ColorPalette } from '@/lib/schemas';

const palette: ColorPalette = {
  id: 'p', name: 'Yellow',
  background: '#FFFBEA', primary: '#FFC107', accent: '#E6A800',
  text: '#1A1A1A', textOnPrimary: '#FFFFFF',
};

const productContext: ProductContext = {
  productName: 'Test', coreIngredients: ['a'], coreSellingPoints: ['b'],
};

function makeTpl(placeholders: any[]): Template {
  // Build a prompt that references every placeholder so list/palette values appear in finalPrompt.
  const parts = ['Hello {{name}}, color is {{palette_primary}}'];
  for (const ph of placeholders) parts.push('{{' + ph.key + '}}');
  return {
    id: 't1', name: 'Test', type: 'feature',
    referenceImageUrl: '', prompt: parts.join(' | '),
    placeholders,
  };
}

const mockLLM = {
  translateToEnglish: vi.fn(async (s: string) => '[EN] ' + s),
  translatePromptToChinese: vi.fn(async (s: string) => '[CN] ' + s),
} as any;

describe('renderPrompt', () => {
  it('fills text placeholders', async () => {
    const tpl = makeTpl([{ key: 'name', label: 'Name', type: 'text' }]);
    const r = await renderPrompt(tpl, { name: 'World' }, palette, {}, productContext, mockLLM);
    expect(r.finalPrompt).toContain('Hello World');
    expect(r.finalPrompt).toContain('#FFC107');
    expect(r.missingFields).toEqual([]);
  });

  it('reports missing fields with [未填:label]', async () => {
    const tpl = makeTpl([{ key: 'name', label: '名称', type: 'text' }]);
    const r = await renderPrompt(tpl, {}, palette, {}, productContext, mockLLM);
    expect(r.missingFields).toEqual(['name']);
    expect(r.finalPrompt).toContain('[未填:名称]');
  });

  it('translates Chinese input to English (inputLanguage=auto)', async () => {
    const tpl = makeTpl([{ key: 'name', label: 'Name', type: 'text', inputLanguage: 'auto' }]);
    const r = await renderPrompt(tpl, { name: '清爽控油' }, palette, {}, productContext, mockLLM);
    expect(r.finalPrompt).toContain('[EN] 清爽控油');
    expect(mockLLM.translateToEnglish).toHaveBeenCalledWith('清爽控油', productContext);
    expect(r.fieldTranslations.name).toBe('[EN] 清爽控油');
  });

  it('does NOT translate when inputLanguage=en', async () => {
    const tpl = makeTpl([{ key: 'name', label: 'Name', type: 'text', inputLanguage: 'en' }]);
    const r = await renderPrompt(tpl, { name: '清爽控油' }, palette, {}, productContext, mockLLM);
    expect(r.finalPrompt).toContain('清爽控油');
    expect(mockLLM.translateToEnglish).not.toHaveBeenCalled();
  });

  it('translates final prompt to Chinese', async () => {
    const tpl = makeTpl([{ key: 'name', label: 'Name', type: 'text' }]);
    const r = await renderPrompt(tpl, { name: 'World' }, palette, {}, productContext, mockLLM);
    expect(mockLLM.translatePromptToChinese).toHaveBeenCalled();
    expect(r.chineseTranslation.startsWith('[CN]')).toBe(true);
  });

  it('handles list placeholder (joins with comma)', async () => {
    const tpl = makeTpl([{ key: 'features', label: 'Features', type: 'list', itemLabel: 'item', minItems: 1, maxItems: 4 }]);
    const r = await renderPrompt(tpl, { features: ['A', 'B', 'C'] }, palette, {}, productContext, mockLLM);
    expect(r.finalPrompt).toContain('A, B, C');
  });
});