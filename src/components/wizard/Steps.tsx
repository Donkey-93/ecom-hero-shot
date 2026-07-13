'use client';
import { usePathname } from 'next/navigation';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { key: 'upload', label: '上传商品图', href: '/generate/upload' },
  { key: 'palette', label: '选配色', href: '/generate/palette' },
  { key: 'product', label: '产品信息', href: '/generate/product' },
  { key: 'style', label: '选风格', href: '/generate/style' },
  { key: 'details', label: '填卖点', href: '/generate/details' },
  { key: 'review', label: '审核导出', href: '/generate/review' },
];

export function Steps() {
  const pathname = usePathname();
  const currentIdx = STEPS.findIndex(s => pathname?.startsWith(s.href));

  return (
    <nav className="w-full border-b bg-card">
      <ol className="flex items-center max-w-5xl mx-auto p-4 gap-2 overflow-x-auto">
        {STEPS.map((s, i) => {
          const isCurrent = i === currentIdx;
          const isDone = i < currentIdx;
          return (
            <li key={s.key} className="flex items-center gap-2 shrink-0">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
                  isCurrent && 'bg-primary text-primary-foreground',
                  isDone && 'bg-green-500 text-white',
                  !isCurrent && !isDone && 'bg-muted text-muted-foreground',
                )}
              >
                {isDone ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={cn('text-sm', isCurrent && 'font-semibold')}>{s.label}</span>
              {i < STEPS.length - 1 && <span className="text-muted-foreground mx-2">→</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}