import { describe, it, expect } from 'vitest';
import { MockLLMClient } from '@/lib/llm/mock';
import type { ProductContext, Template, Placeholder } from '@/lib/schemas';

const ctx: ProductContext = { productName: 'P', coreIngredients: ['a'], coreSellingPoints: ['b'] };
const tpl: Template = {
  id: 't', name: 'T', type: 'feature', referenceImageUrl: '/x.png',
  prompt: 'p', placeholders: [],
};

describe('MockLLMClient', () => {
  it('extractSellingPoints returns 4 selling points', async () => {
    const c = new MockLLMClient();
    const r = await c.extractSellingPoints(ctx);
    expect(r.sellingPoints.length).toBe(4);
  });

  it('fillFreeStyle text returns string', async () => {
    const c = new MockLLMClient();
    const ph: Placeholder = { key: 'k', label: 'L', type: 'text', inputLanguage: 'auto' as const } as unknown as Parameters<typeof c.fillFreeStyle>[0]['placeholder'];
    const r = await c.fillFreeStyle({ template: tpl, placeholder: ph, currentValues: {}, productContext: ctx });
    expect(typeof r).toBe('string');
  });

  it('fillFreeStyle list returns array respecting maxItems', async () => {
    const c = new MockLLMClient();
    const ph: Placeholder = { key: 'l', label: 'L', type: 'list' as const, itemLabel: 'i', minItems: 1, maxItems: 3 };
    const r = await c.fillFreeStyle({ template: tpl, placeholder: ph, currentValues: {}, productContext: ctx });
    expect(Array.isArray(r)).toBe(true);
    expect((r as string[]).length).toBe(3);
  });

  it('translateToEnglish prefixes [EN]', async () => {
    const c = new MockLLMClient();
    const r = await c.translateToEnglish('清爽控油', ctx);
    expect(r).toBe('[EN] 清爽控油');
  });

  it('translatePromptToChinese mentions palette color', async () => {
    const c = new MockLLMClient();
    const palette = { id: 'p', name: 'Y', background: '#FFFBEA', primary: '#F5B800', accent: '#D97706', text: '#1F2937', textOnPrimary: '#FFFFFF' } as const;
    const r = await c.translatePromptToChinese('p', tpl, palette, ctx);
    expect(r).toContain('#F5B800');
  });
});