'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { FreeStyleButton } from '../FreeStyleButton';
import type { z } from 'zod';
import type { PlaceholderValue, ListPlaceholderSchema } from '@/lib/schemas';

type ListPlaceholder = z.infer<typeof ListPlaceholderSchema>;

export function ListInput({
  ph,
  value,
  onChange,
  onFreeStyle,
}: {
  ph: ListPlaceholder;
  value: PlaceholderValue | undefined;
  onChange: (v: string[]) => void;
  onFreeStyle: () => Promise<void>;
}) {
  const items = Array.isArray(value) ? value : [];
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">
          {ph.label}{' '}
          <span className="text-xs text-muted-foreground">
            ({items.length}/{ph.maxItems})
          </span>
        </label>
        <FreeStyleButton onClick={onFreeStyle} />
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={item}
            onChange={e => {
              const n = [...items];
              n[i] = e.target.value;
              onChange(n);
            }}
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            aria-label={`É¾³ý ${ph.itemLabel} ${i + 1}`}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button
        size="sm"
        variant="outline"
        onClick={() => onChange([...items, ''])}
        disabled={items.length >= ph.maxItems}
      >
        <Plus className="w-4 h-4 mr-1" />
        Ìí¼Ó {ph.itemLabel}
      </Button>
    </div>
  );
}
