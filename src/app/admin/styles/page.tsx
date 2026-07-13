'use client';
import Link from 'next/link';
import { ArrowLeft, Palette, Plus } from 'lucide-react';
import { BUILTIN_PRESETS } from '@/templates';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dbGet, dbKeys } from '@/lib/db';
import { useLiveQuery } from '@/hooks/useLiveQuery';
import type { StylePreset } from '@/lib/schemas';

export default function StylesAdminPage() {
  const userPresets = useLiveQuery<StylePreset[]>(async () => {
    const allKeys = await dbKeys();
    const presetKeys = allKeys.filter(k => k.startsWith('preset:'));
    const items = await Promise.all(presetKeys.map(k => dbGet(k)));
    return items.filter((p): p is StylePreset => p != null);
  }, []);

  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Palette className="w-7 h-7 text-purple-500" />
          <h1 className="text-3xl font-bold">风格管理</h1>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-1" />
              返回首页
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/presets/new">
              <Plus className="w-4 h-4 mr-1" />
              上传新风格
            </Link>
          </Button>
        </div>
      </div>

      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-3">内置风格</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BUILTIN_PRESETS.map(p => (
            <Card key={p.id}>
              <CardHeader>
                <CardTitle className="text-base">
                  {p.name}
                  <span className="ml-2 text-xs text-muted-foreground">(内置)</span>
                </CardTitle>
                <CardDescription>{p.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <p>{p.templates?.length ?? 0} 张主图模板</p>
                <p className="text-xs">ID: {p.id}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-3">我的风格</h2>
        {userPresets === undefined ? (
          <p className="text-sm text-muted-foreground">加载中…</p>
        ) : userPresets.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">还没有自定义风格</CardTitle>
              <CardDescription>上传你自己的风格预设，生成专属的主图 prompt 模板。</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/admin/presets/new">上传第一个风格</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userPresets.map(p => (
              <Card key={p.id}>
                <CardHeader>
                  <CardTitle className="text-base">{p.name}</CardTitle>
                  {p.description ? <CardDescription>{p.description}</CardDescription> : null}
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-1">
                  <p>{p.templates?.length ?? 0} 张主图模板</p>
                  <p className="text-xs">创建于 {new Date(p.createdAt).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
