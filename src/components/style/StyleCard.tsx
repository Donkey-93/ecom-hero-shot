'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { StylePreset } from '@/lib/schemas';
import { Check } from 'lucide-react';

export function StyleCard({
  preset,
  selected,
  onSelect,
}: {
  preset: StylePreset;
  selected: boolean;
  onSelect: () => void;
}) {
  const count = preset.templates?.length ?? 0;
  return (
    <Card
      className={cn(
        'cursor-pointer overflow-hidden transition-all',
        selected && 'ring-2 ring-primary',
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={preset.coverImageUrl} alt={preset.name} className="w-full h-40 object-cover" />
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{preset.name}</h3>
          {selected ? <Check className="w-5 h-5 text-primary" /> : null}
        </div>
        <p className="text-xs text-muted-foreground">{preset.description}</p>
        <div className="text-xs">📐 {count} 张主图</div>
        <Button onClick={onSelect} variant={selected ? 'default' : 'outline'} className="w-full">
          {selected ? '已选' : '选择'}
        </Button>
      </CardContent>
    </Card>
  );
}