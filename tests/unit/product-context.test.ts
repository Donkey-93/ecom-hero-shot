import { describe, it, expect } from 'vitest';
import { createEmptyProductContext, validateProductContext } from '@/lib/product-context';

describe('product-context', () => {
  it('createEmpty returns empty but valid shape', () => {
    const c = createEmptyProductContext();
    expect(c.productName).toBe('');
    expect(c.coreIngredients).toEqual([]);
  });

  it('validate returns errors for missing required', () => {
    const r = validateProductContext(createEmptyProductContext());
    expect(r.valid).toBe(false);
    expect(r.errors.length).toBeGreaterThan(0);
  });

  it('validate passes for complete', () => {
    const r = validateProductContext({
      productName: 'X', coreIngredients: ['a'], coreSellingPoints: ['b'],
    });
    expect(r.valid).toBe(true);
  });
});