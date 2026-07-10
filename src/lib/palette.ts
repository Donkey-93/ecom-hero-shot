import type { ColorPalette } from './schemas';

export const BUILTIN_PALETTES: ColorPalette[] = [
  { id: 'warm-yellow', name: '暖阳黄', background: '#FFFBEA', primary: '#F5B800', accent: '#D97706', text: '#1F2937', textOnPrimary: '#FFFFFF' },
  { id: 'lemon-yellow', name: '柠檬黄', background: '#FEFCE8', primary: '#EAB308', accent: '#A16207', text: '#1F2937', textOnPrimary: '#FFFFFF' },
  { id: 'gold-yellow', name: '金黄', background: '#FFFBEB', primary: '#D97706', accent: '#92400E', text: '#1F2937', textOnPrimary: '#FFFFFF' },
  { id: 'rose-gold', name: '玫瑰金', background: '#FFF7ED', primary: '#F97316', accent: '#C2410C', text: '#1F2937', textOnPrimary: '#FFFFFF' },
  { id: 'clean-white', name: '极简白', background: '#FFFFFF', primary: '#FBBF24', accent: '#B45309', text: '#0F172A', textOnPrimary: '#1F2937' },
];

function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function shouldMockFail(seed: number | string = Date.now()): boolean {
  return hashString(String(seed)) % 100 < 5;
}

export function extractPalettes(imageUrl: string, count = 3): ColorPalette[] {
  const start = hashString(imageUrl) % BUILTIN_PALETTES.length;
  const result: ColorPalette[] = [];
  for (let i = 0; i < count; i++) {
    const base = BUILTIN_PALETTES[(start + i) % BUILTIN_PALETTES.length];
    result.push({ ...base, id: base.id + '-' + i + '-' + hashString(imageUrl + String(i)) });
  }
  return result;
}