'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ReviewForm } from '@/components/review/ReviewForm';
import { PromptPreview } from '@/components/preview/PromptPreview';
import { ChineseTranslation } from '@/components/preview/ChineseTranslation';
import { useGenerationStore } from '@/lib/store';
import { getBuiltinPreset } from '@/templates';
import type { Template } from '@/lib/schemas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function DetailsInner() {
  const router = useRouter();
  const params = useSearchParams();
  const initialTemplate = params.get('template');
  const {
    selectedPresetId,
    templateValues,
    setPlaceholderValue,
    productContext,
    productImages,
    selectedPalette,
    generatedPrompts,
    setGeneratedPrompts,
  } = useGenerationStore();

  const preset = getBuiltinPreset(selectedPresetId ?? '');
  const templates: Template[] = preset?.templates ?? [];
  const [active, setActive] = useState<string>(
    initialTemplate ?? templates[0]?.id ?? ''
  );
  const [activeResult, setActiveResult] = useState<{
    finalPrompt: string;
    chineseTranslation: string;
  } | null>(null);

  useEffect(() => {
    if (!selectedPresetId) router.replace('/generate/style');
  }, [selectedPresetId, router]);

  // Reset result whenever the user switches template tabs.
  useEffect(() => {
    const cached = generatedPrompts.find(p => p.templateId === active);
    setActiveResult(
      cached
        ? {
            finalPrompt: cached.finalPrompt,
            chineseTranslation: cached.chineseTranslation,
          }
        : null
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Persist new render results into the store for later review page.
  useEffect(() => {
    if (!activeResult) return;
    const exists = generatedPrompts.find(
      p =>
        p.templateId === active &&
        p.finalPrompt === activeResult.finalPrompt &&
        p.chineseTranslation === activeResult.chineseTranslation
    );
    if (exists) return;
    setGeneratedPrompts([
      ...generatedPrompts.filter(p => p.templateId !== active),
      {
        templateId: active,
        finalPrompt: activeResult.finalPrompt,
        chineseTranslation: activeResult.chineseTranslation,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeResult]);

  if (!preset || !active) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-sm text-muted-foreground">
        请先选择一个风格预设…
      </div>
    );
  }
  const template = templates.find(t => t.id === active);
  if (!template) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Step 5：填卖点（实时预览）</h2>
      <Tabs value={active} onValueChange={setActive}>
        <TabsList>
          {templates.map(t => (
            <TabsTrigger key={t.id} value={t.id}>
              {t.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {templates.map(t => (
          <TabsContent
            key={t.id}
            value={t.id}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <ReviewForm
              template={t}
              values={templateValues[t.id] ?? {}}
              onChange={(k, v) => setPlaceholderValue(t.id, k, v)}
            />
            <div className="space-y-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={t.referenceImageUrl}
                alt={t.name}
                className="rounded border w-full"
              />
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">最终英文 Prompt</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs whitespace-pre-wrap">
                    {activeResult?.finalPrompt ?? '—'}
                  </pre>
                </CardContent>
              </Card>
              {activeResult ? (
                <ChineseTranslation text={activeResult.chineseTranslation} />
              ) : null}
              {selectedPalette ? (
                <PromptPreview
                  template={t}
                  values={templateValues[t.id] ?? {}}
                  palette={selectedPalette}
                  productImages={productImages}
                  productContext={productContext}
                  onResult={r =>
                    setActiveResult({
                      finalPrompt: r.finalPrompt,
                      chineseTranslation: r.chineseTranslation,
                    })
                  }
                />
              ) : null}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <div className="flex justify-end">
        <Button onClick={() => router.push('/generate/review')}>下一步</Button>
      </div>
    </div>
  );
}

export default function DetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto p-8 text-sm text-muted-foreground">
          载入中…
        </div>
      }
    >
      <DetailsInner />
    </Suspense>
  );
}
