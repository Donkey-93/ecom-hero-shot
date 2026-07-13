'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGenerationStore } from '@/lib/store';
import { StyleCard } from '@/components/style/StyleCard';
import { Button } from '@/components/ui/button';
import type { StylePreset } from '@/lib/schemas';
import { dbGet } from '@/lib/db';
import { useLiveQuery } from '@/hooks/useLiveQuery';

const USER_PRESET_PREFIX = 'preset:';

export default function StylePage() {
  const router = useRouter();
  const { selectedPresetId, selectPreset, productContext } = useGenerationStore();
  const [builtin, setBuiltin] = useState<StylePreset[]>([]);

  const userPresets = useLiveQuery<StylePreset[]>(async () => {
    if (typeof indexedDB === 'undefined') return [];
    const { dbKeys } = await import('@/lib/db');
    const keys = await dbKeys();
    const presetKeys = keys.filter(k => k.startsWith(USER_PRESET_PREFIX));
    const items = (await Promise.all(presetKeys.map(k => dbGet(k)))) as (StylePreset | null)[];
    return items.filter((p): p is StylePreset => p != null);
  }, []);

  useEffect(() => {
    fetch('/api/templates')
      .then(r => r.json())
      .then(d => setBuiltin(d.builtin ?? []))
      .catch(() => setBuiltin([]));
  }, []);

  useEffect(() => {
    if (!productContext.productName) router.replace('/generate/product');
  }, [productContext, router]);

  const allPresets: StylePreset[] = [...builtin, ...(userPresets ?? [])];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Step 4：选风格</h2>
      {allPresets.length === 0 ? (
        <p className="text-muted-foreground">正在加载风格…</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allPresets.map(p => (
            <StyleCard
              key={p.id}
              preset={p}
              selected={selectedPresetId === p.id}
              onSelect={() => selectPreset(p.id)}
            />
          ))}
        </div>
      )}
      <div className="flex justify-end">
        <Button disabled={!selectedPresetId} onClick={() => router.push('/generate/details')}>
          下一步
        </Button>
      </div>
    </div>
  );
}