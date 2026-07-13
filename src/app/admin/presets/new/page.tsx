'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dbSet } from '@/lib/db';
import { toast } from 'sonner';
import type { StylePreset, Template } from '@/lib/schemas';

export default function NewPresetPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSave() {
    if (!name.trim() || !prompt.trim()) {
      toast.error('名称和模板 Prompt 必填');
      return;
    }
    setSubmitting(true);
    try {
      const id = 'preset_user_' + crypto.randomUUID();
      const now = new Date().toISOString();
      const tplId = id + '_tpl1';
      const template: Template = {
        id: tplId,
        name: '默认模板',
        type: 'feature',
        referenceImageUrl: '/templates/bright-yellow-cosmetic/feature.png',
        prompt,
        placeholders: [{ key: 'content', label: '内容', type: 'longText' }],
      };
      const preset: StylePreset = {
        id,
        name: name.trim(),
        description: description.trim(),
        source: 'user',
        coverImageUrl: template.referenceImageUrl,
        templates: [template],
        createdAt: now,
        updatedAt: now,
      };
      await dbSet('preset:' + id, preset);
      toast.success('风格已保存');
      router.push('/admin/styles');
    } catch (e) {
      toast.error('保存失败：' + (e instanceof Error ? e.message : String(e)));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen p-6 md:p-12 max-w-2xl mx-auto space-y-6">
    <div className="space-y-1.5">
      <h1 className="text-3xl font-bold tracking-tight">上传新风格</h1>
    </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">MVP 版风格向导</CardTitle>
          <CardDescription>
            填名称 + 描述 + 模板 prompt 即可创建。后续会支持参考图上传和多模板。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">名称</Label>
            <Input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="例：森林系美妆"
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">描述</Label>
            <Input
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="例：清新自然，绿+米白为主色调"
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">模板 Prompt（含占位符）</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              rows={10}
              placeholder={'A {{content}} hero shot, studio lighting, 4K, ...'}
            />
            <p className="text-xs text-muted-foreground">
              用 <code className="bg-muted px-1 rounded">{'{{key}}'}</code> 表示占位符。
              MVP 仅识别 <code className="bg-muted px-1 rounded">content</code>（长文本）。
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.push('/admin/styles')}>
              取消
            </Button>
            <Button onClick={handleSave} disabled={!name.trim() || !prompt.trim() || submitting}>
              {submitting ? '保存中…' : '保存风格'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
