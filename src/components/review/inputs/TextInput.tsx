'use client';
import { Input } from '@/components/ui/input';
import { FreeStyleButton } from '../FreeStyleButton';
import { TranslateButton } from '../TranslateButton';
import type { z } from 'zod';
import type { PlaceholderValue, TextPlaceholderSchema } from '@/lib/schemas';

type TextPlaceholder = z.infer<typeof TextPlaceholderSchema>;

export function TextInput({
  ph,
  value,
  onChange,
  onFreeStyle,
  onTranslate,
}: {
  ph: TextPlaceholder;
  value: PlaceholderValue | undefined;
  onChange: (v: string) => void;
  onFreeStyle: () => Promise<void>;
  onTranslate: () => Promise<void>;
}) {
  const v = typeof value === 'string' ? value : '';
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{ph.label}</label>
        <div className="flex gap-1">
          <TranslateButton onClick={onTranslate} disabled={!v} />
          <FreeStyleButton onClick={onFreeStyle} />
        </div>
      </div>
      <Input
        value={v}
        maxLength={ph.maxLength}
        placeholder={ph.hint}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
