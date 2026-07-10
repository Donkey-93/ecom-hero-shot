'use client';
import { useEffect, useRef, useState } from 'react';
import type {
  Template,
  ColorPalette,
  ProductContext,
  PlaceholderValue,
} from '@/lib/schemas';

interface RenderResponse {
  finalPrompt: string;
  chineseTranslation: string;
  missingFields?: string[];
  fieldTranslations?: Record<string, string>;
}

export function PromptPreview({
  template,
  values,
  palette,
  productImages,
  productContext,
  onResult,
}: {
  template: Template;
  values: Record<string, PlaceholderValue>;
  palette: ColorPalette | undefined;
  productImages: { packaging?: string; product?: string };
  productContext: ProductContext;
  onResult: (r: RenderResponse) => void;
}) {
  const [loading, setLoading] = useState(false);
  const lastSigRef = useRef<string>('');

  useEffect(() => {
    if (!palette) return;
    const sig =
      template.id +
      '|' +
      JSON.stringify(values) +
      '|' +
      JSON.stringify(palette) +
      '|' +
      JSON.stringify(productImages) +
      '|' +
      JSON.stringify(productContext);
    if (sig === lastSigRef.current) return;
    lastSigRef.current = sig;

    const handle = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await fetch('/api/prompts/render', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ template, values, palette, productImages, productContext }),
        });
        if (r.ok) {
          const data = (await r.json()) as RenderResponse;
          onResult(data);
        }
      } catch {
        /* surface upstream — keep last good result visible */
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(handle);
  }, [
    template.id,
    JSON.stringify(values),
    JSON.stringify(palette),
    JSON.stringify(productImages),
    JSON.stringify(productContext),
    template,
    palette,
    productImages,
    productContext,
    onResult,
  ]);

  if (!palette) {
    return (
      <div className="text-xs text-muted-foreground">提示：先在 Step 3 选择配色。</div>
    );
  }
  return loading ? (
    <div className="text-xs text-muted-foreground">渲染中…</div>
  ) : null;
}
