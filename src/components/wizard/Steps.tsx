'use client';
import { usePathname } from 'next/navigation';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { key: 'upload', label: '上传', href: '/generate/upload' },
  { key: 'palette', label: '配色', href: '/generate/palette' },
  { key: 'product', label: '产品', href: '/generate/product' },
  { key: 'style', label: '风格', href: '/generate/style' },
  { key: 'details', label: '卖点', href: '/generate/details' },
  { key: 'review', label: '导出', href: '/generate/review' },
];

export function Steps() {
  const pathname = usePathname();
  const currentIdx = STEPS.findIndex(s => pathname?.startsWith(s.href));

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 glass bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <ol className="flex items-center max-w-5xl mx-auto px-4 py-3 gap-1 overflow-x-auto">
        {STEPS.map((s, i) => {
          const isCurrent = i === currentIdx;
          const isDone = i < currentIdx;
          const isUpcoming = i > currentIdx;
          return (
            <li key={s.key} className="flex items-center gap-1 shrink-0">
              <div
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200',
                  isCurrent && 'bg-primary text-primary-foreground shadow-md shadow-primary/30 scale-110',
                  isDone && 'bg-primary/15 text-primary',
                  isUpcoming && 'bg-muted text-muted-foreground',
                )}
              >
                {isDone ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : i + 1}
              </div>
              <span
                className={cn(
                  'text-xs transition-colors',
                  isCurrent && 'font-semibold text-foreground',
                  isDone && 'text-foreground/70',
                  isUpcoming && 'text-muted-foreground',
                )}
              >
                {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    'h-px w-6 mx-2 transition-colors',
                    isDone ? 'bg-primary/30' : 'bg-border',
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
