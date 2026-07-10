'use client';
import { PlaceholderInput } from './inputs';
import type {
  Template,
  PlaceholderValue,
  ProductContext,
} from '@/lib/schemas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { useGenerationStore } from '@/lib/store';
import { toast } from 'sonner';

interface Props {
  template: Template;
  values: Record<string, PlaceholderValue>;
  onChange: (key: string, value: PlaceholderValue) => void;
}

export function ReviewForm({ template, values, onChange }: Props) {
  const { productContext } = useGenerationStore() as { productContext: ProductContext };
  const [busyKey, setBusyKey] = useState<string | null>(null);

  async function handleFreeStyle(key: string) {
    const ph = template.placeholders.find(p => p.key === key);
    if (!ph) return;
    setBusyKey(key);
    try {
      const r = await fetch('/api/llm/freestyle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template,
          placeholder: ph,
          currentValues: values,
          productContext,
        }),
      });
      if (!r.ok) {
        const detail = await r.text().catch(() => '');
        throw new Error('自由发挥失败：' + detail || String(r.status));
      }
      const { value } = (await r.json()) as { value: PlaceholderValue };
      onChange(key, value);
      toast.success('已自动填充');
    } catch (e) {
      toast.error('自由发挥失败：' + (e instanceof Error ? e.message : String(e)));
    } finally {
      setBusyKey(null);
    }
  }

  async function handleTranslate(key: string) {
    const raw = values[key];
    if (typeof raw !== 'string' || !raw) return;
    setBusyKey(key);
    try {
      const r = await fetch('/api/llm/translate-zh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: raw, context: productContext }),
      });
      if (!r.ok) {
        const detail = await r.text().catch(() => '');
        throw new Error('翻译失败：' + detail || String(r.status));
      }
      const { text } = (await r.json()) as { text: string };
      onChange(key, text);
      toast.success('已转英文');
    } catch (e) {
      toast.error('翻译失败：' + (e instanceof Error ? e.message : String(e)));
    } finally {
      setBusyKey(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{template.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {template.placeholders.map(ph => (
          <PlaceholderInput
            key={ph.key}
            ph={ph}
            value={values[ph.key]}
            onChange={v => onChange(ph.key, v)}
            onFreeStyle={
              busyKey === ph.key
                ? async () => {}
                : () => handleFreeStyle(ph.key)
            }
            onTranslate={() => handleTranslate(ph.key)}
          />
        ))}
      </CardContent>
    </Card>
  );
}
