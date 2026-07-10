'use client';
import { useGenerationStore } from '@/lib/store';
import type { z } from 'zod';
import type { PalettePlaceholderSchema } from '@/lib/schemas';

type PalettePlaceholder = z.infer<typeof PalettePlaceholderSchema>;

export function PaletteRefInput({ ph }: { ph: PalettePlaceholder }) {
  const { selectedPalette } = useGenerationStore();
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{ph.label}</label>
      {selectedPalette ? (
        <div className="flex gap-1 h-8 rounded overflow-hidden border">
          <div className="flex-1" style={{ background: selectedPalette.background }} />
          <div className="flex-1" style={{ background: selectedPalette.primary }} />
          <div className="flex-1" style={{ background: selectedPalette.accent }} />
        </div>
      ) : (
        <p className="text-xs text-red-500">未选配色</p>
      )}
    </div>
  );
}
