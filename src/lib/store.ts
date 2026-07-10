'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from './db';
import type { ColorPalette, ProductContext, PlaceholderValue, Generation } from './schemas';
import { createEmptyProductContext } from './product-context';

interface GenerationStore {
  productImages: { packaging?: string; product?: string };
  paletteCandidates: ColorPalette[];
  selectedPalette?: ColorPalette;
  selectedPresetId?: string;
  productContext: ProductContext;
  templateValues: Record<string, Record<string, PlaceholderValue>>;
  generatedPrompts: Array<{ templateId: string; finalPrompt: string; chineseTranslation: string }>;
  currentGenerationId?: string;

  setProductImage: (slot: 'packaging' | 'product', url: string) => void;
  setPalettes: (candidates: ColorPalette[]) => void;
  selectPalette: (p: ColorPalette) => void;
  setProductContext: (ctx: Partial<ProductContext>) => void;
  selectPreset: (id: string) => void;
  setPlaceholderValue: (templateId: string, key: string, value: PlaceholderValue) => void;
  setPlaceholderValues: (templateId: string, values: Record<string, PlaceholderValue>) => void;
  setGeneratedPrompts: (prompts: Generation['generatedPrompts']) => void;
  reset: () => void;
}

const initialState = {
  productImages: {} as { packaging?: string; product?: string },
  paletteCandidates: [] as ColorPalette[],
  selectedPalette: undefined as ColorPalette | undefined,
  selectedPresetId: undefined as string | undefined,
  productContext: createEmptyProductContext(),
  templateValues: {} as Record<string, Record<string, PlaceholderValue>>,
  generatedPrompts: [] as Generation['generatedPrompts'],
  currentGenerationId: undefined as string | undefined,
};

export const useGenerationStore = create<GenerationStore>()(
  persist(
    (set) => ({
      ...initialState,
      setProductImage: (slot, url) => set(s => ({ productImages: { ...s.productImages, [slot]: url } })),
      setPalettes: (candidates) => set({ paletteCandidates: candidates }),
      selectPalette: (p) => set({ selectedPalette: p }),
      setProductContext: (ctx) => set(s => ({ productContext: { ...s.productContext, ...ctx } })),
      selectPreset: (id) => set({ selectedPresetId: id }),
      setPlaceholderValue: (templateId, key, value) => set(s => ({
        templateValues: { ...s.templateValues, [templateId]: { ...(s.templateValues[templateId] ?? {}), [key]: value } },
      })),
      setPlaceholderValues: (templateId, values) => set(s => ({
        templateValues: { ...s.templateValues, [templateId]: { ...(s.templateValues[templateId] ?? {}), ...values } },
      })),
      setGeneratedPrompts: (prompts) => set({ generatedPrompts: prompts }),
      reset: () => set(initialState),
    }),
    {
      name: 'ecom-hero-shot-store',
      storage: createJSONStorage(() => idbStorage),
    },
  ),
);