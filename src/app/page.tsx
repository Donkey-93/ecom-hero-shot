'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, History, Palette, ArrowRight } from 'lucide-react';

const actions = [
  {
    icon: Sparkles,
    title: '开始生成',
    description: '上传商品图，6 步完成 5 张主图',
    href: '/generate/upload',
    cta: '开始',
    iconClass: 'text-yellow-500',
  },
  {
    icon: History,
    title: '我的历史',
    description: '查看、复用、删除历史生成',
    href: '/gallery',
    cta: '查看',
    iconClass: 'text-blue-500',
  },
  {
    icon: Palette,
    title: '风格管理',
    description: '查看、编辑、上传新风格预设',
    href: '/admin/styles',
    cta: '管理',
    iconClass: 'text-purple-500',
  },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero 区 — 大标题、紧凑 leading、负 tracking */}
      <section className="px-6 pt-20 pb-12 md:pt-32 md:pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-medium text-muted-foreground mb-4 tracking-wide uppercase">
            Ecom Hero Shot
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            电商主图
            <br />
            AI 一键生成
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
            上传商品图，选风格，AI 帮你生成 5 张高质量主图 prompt
          </p>
        </div>
      </section>

      {/* 卡片网格 — 加 hover 提升 + icon 渐变背景 */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.href}
                className="card-elevate border-border/60 group cursor-pointer"
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200 ${action.iconClass}`}
                  >
                    <Icon className="w-6 h-6" strokeWidth={1.75} />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {action.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="ghost" className="w-full justify-between group/btn">
                    <Link href={action.href}>
                      <span>{action.cta}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
}
