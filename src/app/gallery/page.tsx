'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, History, Sparkles } from 'lucide-react';
import { dbListGenerations } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/common/EmptyState';
import type { Generation } from '@/lib/schemas';

export default function GalleryPage() {
  const [items, setItems] = useState<Generation[] | null>(null);

  useEffect(() => {
    let alive = true;
    dbListGenerations()
      .then(rows => {
        if (!alive) return;
        const sorted = (rows as Generation[])
          .slice()
          .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
        setItems(sorted);
      })
      .catch(() => {
        if (alive) setItems([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <History className="w-7 h-7 text-blue-500" />
          <h1 className="text-3xl font-bold">我的历史</h1>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-1" />
            返回首页
          </Link>
        </Button>
      </div>

      {items === null ? (
        <p className="text-muted-foreground">加载中…</p>
      ) : items.length === 0 ? (
        <EmptyState
          title="还没有生成记录"
          description="完成一次 6 步向导后，生成的 prompt 会保存到这里。"
          icon={Sparkles}
          cta={{ label: '开始生成', href: '/generate/upload' }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(g => (
            <Card
              key={g.id}
              className="card-elevate border-border/40 overflow-hidden group cursor-pointer"
            >
              <div className="aspect-video bg-gradient-to-br from-yellow-50 to-amber-100 flex items-center justify-center">
                <Sparkles
                  className="w-8 h-8 text-yellow-500/40 group-hover:scale-110 transition-transform"
                  strokeWidth={1.5}
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold line-clamp-1">
                  {g.productContext.productName}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-0.5">
                <p>{new Date(g.createdAt).toLocaleString()}</p>
                <p>{g.generatedPrompts.length} 张主图</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
