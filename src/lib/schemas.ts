import { z } from 'zod';

const PlaceholderBaseSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  hint: z.string().optional(),
  required: z.boolean().optional(),
  inputLanguage: z.enum(['auto', 'en', 'zh']).optional(),
});

export const TextPlaceholderSchema = PlaceholderBaseSchema.extend({
  type: z.literal('text'),
  defaultValue: z.string().optional(),
  maxLength: z.number().int().positive().optional(),
});

export const LongTextPlaceholderSchema = PlaceholderBaseSchema.extend({
  type: z.literal('longText'),
  defaultValue: z.string().optional(),
  maxLength: z.number().int().positive().optional(),
});

export const ListPlaceholderSchema = PlaceholderBaseSchema.extend({
  type: z.literal('list'),
  itemLabel: z.string().min(1),
  minItems: z.number().int().nonnegative(),
  maxItems: z.number().int().positive(),
  defaultValue: z.array(z.string()).optional(),
});

export const PalettePlaceholderSchema = PlaceholderBaseSchema.extend({
  type: z.literal('palette'),
});

export const ImageRefPlaceholderSchema = PlaceholderBaseSchema.extend({
  type: z.literal('imageRef'),
  accept: z.enum(['packaging', 'product', 'any']),
});

export const PlaceholderSchema = z.discriminatedUnion('type', [
  TextPlaceholderSchema,
  LongTextPlaceholderSchema,
  ListPlaceholderSchema,
  PalettePlaceholderSchema,
  ImageRefPlaceholderSchema,
]);
export type Placeholder = z.infer<typeof PlaceholderSchema>;

const HexColor = z.string().regex(/^#[0-9A-Fa-f]{6}$/);

export const ColorPaletteSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  background: HexColor,
  primary: HexColor,
  accent: HexColor,
  text: HexColor,
  textOnPrimary: HexColor,
  extractedFrom: z.string().optional(),
});
export type ColorPalette = z.infer<typeof ColorPaletteSchema>;

export const ProductContextSchema = z.object({
  productName: z.string().min(1, '产品名必填'),
  coreIngredients: z.array(z.string().min(1)).min(1, '至少 1 个核心成分'),
  coreSellingPoints: z.array(z.string().min(1)).min(1, '至少 1 个核心卖点'),
  audience: z.string().optional(),
  occasion: z.string().optional(),
});
export type ProductContext = z.infer<typeof ProductContextSchema>;

export const TemplateTypeSchema = z.enum([
  'feature', 'audience', 'ingredient', 'compare', 'beforeAfter',
]);
export type TemplateType = z.infer<typeof TemplateTypeSchema>;

export const TemplateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: TemplateTypeSchema,
  referenceImageUrl: z.string().min(1),
  prompt: z.string().min(1),
  promptNotes: z.string().optional(),
  placeholders: z.array(PlaceholderSchema).min(1),
});
export type Template = z.infer<typeof TemplateSchema>;

export const StylePresetSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  source: z.enum(['builtin', 'user']),
  coverImageUrl: z.string().min(1),
  templates: z.array(TemplateSchema).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type StylePreset = z.infer<typeof StylePresetSchema>;

export const PlaceholderValueSchema = z.union([
  z.string(),
  z.array(z.string()),
  ColorPaletteSchema,
  z.object({ url: z.string() }),
]);
export type PlaceholderValue = z.infer<typeof PlaceholderValueSchema>;

export const GenerationSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  presetId: z.string(),
  productImages: z.object({
    packaging: z.string().optional(),
    product: z.string().optional(),
  }),
  productContext: ProductContextSchema,
  selectedPalette: ColorPaletteSchema,
  templateValues: z.record(z.string(), PlaceholderValueSchema),
  generatedPrompts: z.array(z.object({
    templateId: z.string(),
    finalPrompt: z.string(),
    chineseTranslation: z.string(),
  })),
});
export type Generation = z.infer<typeof GenerationSchema>;