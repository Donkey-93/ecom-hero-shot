import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, History, Palette } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen p-8 md:p-24">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">电商主图生成系统</h1>
        <p className="text-muted-foreground mb-12">
          上传商品图，选风格，AI 帮你生成 5 张高质量主图 prompt
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Sparkles className="w-8 h-8 text-yellow-500 mb-2" />
              <CardTitle>开始生成</CardTitle>
              <CardDescription>上传商品图，6 步完成 5 张主图</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/generate/upload" className="w-full">
                <Button className="w-full">开始</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <History className="w-8 h-8 text-blue-500 mb-2" />
              <CardTitle>我的历史</CardTitle>
              <CardDescription>查看、复用、删除历史生成</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/gallery" className="w-full">
                <Button variant="outline" className="w-full">
                  查看
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Palette className="w-8 h-8 text-purple-500 mb-2" />
              <CardTitle>风格管理</CardTitle>
              <CardDescription>查看、编辑、上传新风格预设</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/styles" className="w-full">
                <Button variant="outline" className="w-full">
                  管理
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}