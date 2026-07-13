'use client';
import { Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ColorPalette } from '@/lib/schemas';

export function PaletteCard({
  palette,
  selected,
  onSelect,
}: {
  palette: ColorPalette;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <Card
      className={cn(
        'card-elevate cursor-pointer overflow-hidden group',
        selected
          ? 'ring-2 ring-primary border-primary shadow-lg shadow-primary/10'
          : 'border-border/60 hover:border-primary/40',
      )}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">{palette.name}</h3>
          {selected && (
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={3} />
            </div>
          )}
        </div>
        <div className="flex gap-1 h-14 rounded-lg overflow-hidden shadow-inner">
          <div className="flex-1 transition-transform group-hover:scale-105" style={{ background: palette.background }} />
          <div className="flex-1 transition-transform group-hover:scale-105" style={{ background: palette.primary }} />
          <div className="flex-1 transition-transform group-hover:scale-105" style={{ background: palette.accent }} />
          <div className="flex-1 transition-transform group-hover:scale-105" style={{ background: palette.text }} />
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
          <span>{palette.background}</span>
          <span>{palette.primary}</span>
        </div>
        <Button
          onClick={onSelect}
          variant={selected ? 'default' : 'outline'}
          className="w-full"
          size="sm"
        >
          {selected ? '已选' : '选择'}
        </Button>
      </CardContent>
    </Card>
  );
}
