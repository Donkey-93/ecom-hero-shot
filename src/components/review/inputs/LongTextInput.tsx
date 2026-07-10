'use client';
import { Textarea } from '@/components/ui/textarea';
import { FreeStyleButton } from '../FreeStyleButton';
import { TranslateButton } from '../TranslateButton';
import type { z } from 'zod';
import type { PlaceholderValue, LongTextPlaceholderSchema } from '@/lib/schemas';

type LongTextPlaceholder = z.infer<typeof LongTextPlaceholderSchema>;

export function LongTextInput({
  ph,
  value,
  onChange,
  onFreeStyle,
  onTranslate,
}: {
  ph: LongTextPlaceholder;
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
      <Textarea
        value={v}
        maxLength={ph.maxLength}
        placeholder={ph.hint}
        rows={3}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
