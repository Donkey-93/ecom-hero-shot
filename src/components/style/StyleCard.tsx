import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { StylePreset } from '@/lib/schemas';
import { Check, Layers } from 'lucide-react';

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
        'card-elevate cursor-pointer overflow-hidden group',
        selected
          ? 'ring-2 ring-primary border-primary shadow-lg shadow-primary/10'
          : 'border-border/60 hover:border-primary/40',
      )}
    >
      <div className="relative overflow-hidden aspect-[4/3] bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={preset.coverImageUrl}
          alt={preset.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {selected && (
          <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-md">
            <Check className="w-4 h-4 text-primary-foreground" strokeWidth={3} />
          </div>
        )}
      </div>
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-base leading-tight">{preset.name}</h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
            {preset.description}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Layers className="w-3.5 h-3.5" strokeWidth={1.75} />
          <span>{count} 张主图</span>
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
