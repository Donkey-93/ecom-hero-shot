'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PaletteCard } from '@/components/palette/PaletteCard';
import { useGenerationStore } from '@/lib/store';
import type { ColorPalette } from '@/lib/schemas';

export default function PalettePage() {
  const router = useRouter();
  const { productImages, paletteCandidates, setPalettes, selectedPalette, selectPalette } =
    useGenerationStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchPalettes() {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch('/api/palette/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: productImages.packaging ?? 'default',
          count: 3,
        }),
      });
      if (!r.ok) throw new Error('配色识别失败 (' + r.status + ')');
      const { palettes } = (await r.json()) as { palettes: ColorPalette[] };
      setPalettes(palettes);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (paletteCandidates.length === 0) void fetchPalettes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Step 2：选配色</h2>
      <p className="text-muted-foreground">基于你的商品图自动提取 3 套配色方案。</p>
      {error ? <div className="text-red-500 text-sm">{error}</div> : null}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {paletteCandidates.map(p => (
          <PaletteCard
            key={p.id}
            palette={p}
            selected={selectedPalette?.id === p.id}
            onSelect={() => selectPalette(p)}
          />
        ))}
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={fetchPalettes} disabled={loading}>
          {loading ? '生成中…' : '重新生成'}
        </Button>
        <Button disabled={!selectedPalette} onClick={() => router.push('/generate/product')}>
          下一步
        </Button>
      </div>
    </div>
  );
}