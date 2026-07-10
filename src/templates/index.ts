import type { StylePreset } from '@/lib/schemas';
import { brightYellowCosmeticPreset } from './builtin/_index';

export const BUILTIN_PRESETS: StylePreset[] = [brightYellowCosmeticPreset];

export function getBuiltinPreset(id: string): StylePreset | undefined {
  return BUILTIN_PRESETS.find(p => p.id === id);
}