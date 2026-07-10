import { describe, it, expect } from 'vitest';
import { extractPalettes, BUILTIN_PALETTES } from '@/lib/palette';

describe('extractPalettes', () => {
  it('returns 3 palettes by default', () => {
    const ps = extractPalettes('http://x/yellow.png');
    expect(ps).toHaveLength(3);
  });

  it('respects count param', () => {
    expect(extractPalettes('x', 1)).toHaveLength(1);
    expect(extractPalettes('x', 5)).toHaveLength(5);
  });

  it('returns valid hex colors', () => {
    const ps = extractPalettes('x');
    for (const p of ps) {
      expect(p.background).toMatch(/^#[0-9A-F]{6}$/);
      expect(p.primary).toMatch(/^#[0-9A-F]{6}$/);
    }
  });

  it('is deterministic for same input', () => {
    const a = extractPalettes('same-url');
    const b = extractPalettes('same-url');
    expect(a[0].id).toBe(b[0].id);
  });

  it('exposes builtin palettes', () => {
    expect(BUILTIN_PALETTES.length).toBeGreaterThanOrEqual(3);
  });
});