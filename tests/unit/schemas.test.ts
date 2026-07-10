import { describe, it, expect } from 'vitest';
import {
  TextPlaceholderSchema,
  ListPlaceholderSchema,
  ColorPaletteSchema,
  ProductContextSchema,
  TemplateSchema,
  StylePresetSchema,
} from '@/lib/schemas';

describe('Placeholder schemas', () => {
  it('validates text placeholder', () => {
    const r = TextPlaceholderSchema.safeParse({ key: 'name', label: 'Name', type: 'text' });
    expect(r.success).toBe(true);
  });

  it('rejects list without minItems', () => {
    const r = ListPlaceholderSchema.safeParse({
      key: 'list', label: 'List', type: 'list', itemLabel: 'Item', maxItems: 4,
    });
    expect(r.success).toBe(false);
  });
});

describe('ColorPalette', () => {
  it('validates hex colors', () => {
    const r = ColorPaletteSchema.safeParse({
      id: 'p1', name: 'Yellow',
      background: '#FFFBEA', primary: '#FFC107', accent: '#E6A800',
      text: '#1A1A1A', textOnPrimary: '#FFFFFF',
    });
    expect(r.success).toBe(true);
  });
});

describe('ProductContext', () => {
  it('requires productName, coreIngredients, coreSellingPoints', () => {
    const r = ProductContextSchema.safeParse({
      productName: 'Test', coreIngredients: ['a'], coreSellingPoints: ['b'],
    });
    expect(r.success).toBe(true);
  });
  it('rejects empty coreIngredients', () => {
    const r = ProductContextSchema.safeParse({
      productName: 'Test', coreIngredients: [], coreSellingPoints: ['b'],
    });
    expect(r.success).toBe(false);
  });
});

describe('StylePreset', () => {
  it('validates full preset', () => {
    const r = StylePresetSchema.safeParse({
      id: 'p', name: 'N', description: 'd', source: 'builtin',
      coverImageUrl: '/x.png', templates: [],
      createdAt: '2026-01-01', updatedAt: '2026-01-01',
    });
    expect(r.success).toBe(true);
  });
});