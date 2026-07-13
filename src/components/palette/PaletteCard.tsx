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
    <Card className={cn('cursor-pointer transition-all', selected && 'ring-2 ring-primary')}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{palette.name}</h3>
          {selected ? <Check className="w-5 h-5 text-primary" /> : null}
        </div>
        <div className="flex gap-1 h-12 rounded overflow-hidden">
          <div className="flex-1" style={{ background: palette.background }} />
          <div className="flex-1" style={{ background: palette.primary }} />
          <div className="flex-1" style={{ background: palette.accent }} />
          <div className="flex-1" style={{ background: palette.text }} />
        </div>
        <div className="text-xs font-mono text-muted-foreground">
          bg: {palette.background} · primary: {palette.primary}
        </div>
        <Button onClick={onSelect} variant={selected ? 'default' : 'outline'} className="w-full">
          {selected ? '已选' : '选择'}
        </Button>
      </CardContent>
    </Card>
  );
}