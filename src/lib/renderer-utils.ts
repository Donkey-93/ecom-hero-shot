import type { PlaceholderValue } from './schemas';

export function looksLikeChinese(s: string): boolean {
  return /[\u4e00-\u9fff]/.test(s);
}

export function stringifyValue(v: PlaceholderValue | undefined): string {
  if (v === undefined || v === null) return '';
  if (typeof v === 'string') return v;
  if (Array.isArray(v)) return v.join(', ');
  if ('url' in v) return v.url;
  return JSON.stringify(v);
}

export function stringifyValues(values: Record<string, PlaceholderValue>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(values)) {
    out[k] = stringifyValue(v);
  }
  return out;
}

export function paletteToCtx(p: { background: string; primary: string; accent: string; text: string }): Record<string, string> {
  return {
    palette_background: p.background,
    palette_primary: p.primary,
    palette_accent: p.accent,
    palette_text: p.text,
  };
}