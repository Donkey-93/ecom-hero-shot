'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useGenerationStore } from '@/lib/store';
import { getBuiltinPreset } from '@/templates';
import { CopyButton } from '@/components/export/CopyButton';
import { JsonExport } from '@/components/export/JsonExport';
import { toast } from 'sonner';
import { dbSet } from '@/lib/db';
import type { Generation, PlaceholderValue } from '@/lib/schemas';

/**
 * The store groups placeholder values per templateId; the Generation schema
 * (and the JSON we hand to the user) flattens them into a single map. This
 * preserves Stream A's design choice in both directions.
 */
function flattenTemplateValues(
  nested: Record<string, Record<string, PlaceholderValue>>
): Record<string, PlaceholderValue> {
  const out: Record<string, PlaceholderValue> = {};
  for (const values of Object.values(nested)) {
    for (const [k, v] of Object.entries(values)) out[k] = v;
  }
  return out;
}

export default function ReviewPage() {
  const router = useRouter();
  const {
    selectedPresetId,
    productImages,
    productContext,
    selectedPalette,
    generatedPrompts,
    templateValues,
  } = useGenerationStore();
  const [saving, setSaving] = useState(false);
  const preset = getBuiltinPreset(selectedPresetId ?? '');

  useEffect(() => {
    if (!preset) router.replace('/generate/style');
  }, [preset, router]);

  if (!preset || !selectedPalette) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-sm text-muted-foreground">
        准备审核页…
      </div>
    );
  }

  const templates = preset.templates ?? [];
  const flatValues = flattenTemplateValues(templateValues);

  async function handleSave() {
    setSaving(true);
    try {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const generation: Generation = {
        id,
        createdAt: now,
        updatedAt: now,
        presetId: selectedPresetId!,
        productImages,
        productContext,
        selectedPalette: selectedPalette!,
        templateValues: flatValues,
        generatedPrompts,
      };
      await dbSet('gen:' + id, generation);
      toast.success('已保存到历史');
    } catch (e) {
      toast.error('保存失败：' + (e instanceof Error ? e.message : String(e)));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Step 6：审核 & 导出</h2>
      <p className="text-muted-foreground">逐张图核对 prompt + 中文翻译。</p>
      <Tabs defaultValue={generatedPrompts[0]?.templateId ?? templates[0]?.id ?? ''}>
        <TabsList>
          {templates.map(t => (
            <TabsTrigger key={t.id} value={t.id}>
              {t.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {templates.map(t => {
          const result = generatedPrompts.find(p => p.templateId === t.id);
          return (
            <TabsContent
              key={t.id}
              value={t.id}
              className="grid grid-cols-1 lg:grid-cols-3 gap-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">参考图</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.referenceImageUrl}
                    alt={t.name}
                    className="w-full rounded"
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">英文 Prompt</CardTitle>
                  {result ? <CopyButton text={result.finalPrompt} /> : null}
                </CardHeader>
                <CardContent>
                  <pre className="text-xs whitespace-pre-wrap">
                    {result?.finalPrompt ?? '— 未生成 —'}
                  </pre>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">中文翻译</CardTitle>
                  {result ? <CopyButton text={result.chineseTranslation} /> : null}
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">
                    {result?.chineseTranslation ?? '— 未生成 —'}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
      <div className="flex justify-between items-center border-t pt-4">
        <JsonExport
          generation={{
            id: 'preview',
            createdAt: '',
            updatedAt: '',
            presetId: selectedPresetId!,
            productImages,
            productContext,
            selectedPalette: selectedPalette!,
            templateValues: flatValues,
            generatedPrompts,
          }}
        />
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave} disabled={saving}>
            {saving ? '保存中…' : '保存到历史'}
          </Button>
          <Button disabled>生成图片（Phase 2）</Button>
        </div>
      </div>
    </div>
  );
}
