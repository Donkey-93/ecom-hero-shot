'use client';
import type { Placeholder, PlaceholderValue } from '@/lib/schemas';
import { TextInput } from './TextInput';
import { LongTextInput } from './LongTextInput';
import { ListInput } from './ListInput';
import { PaletteRefInput } from './PaletteRefInput';
import { ImageRefInput } from './ImageRefInput';

interface Props {
  ph: Placeholder;
  value: PlaceholderValue | undefined;
  onChange: (v: PlaceholderValue) => void;
  onFreeStyle?: () => Promise<void>;
  onTranslate?: () => Promise<void>;
}

export function PlaceholderInput(props: Props) {
  const noop = async () => {};
  const onFreeStyle = props.onFreeStyle ?? noop;
  const onTranslate = props.onTranslate ?? noop;
  const { ph } = props;
  switch (ph.type) {
    case 'text':
      return (
        <TextInput
          ph={ph}
          value={props.value}
          onChange={v => props.onChange(v)}
          onFreeStyle={onFreeStyle}
          onTranslate={onTranslate}
        />
      );
    case 'longText':
      return (
        <LongTextInput
          ph={ph}
          value={props.value}
          onChange={v => props.onChange(v)}
          onFreeStyle={onFreeStyle}
          onTranslate={onTranslate}
        />
      );
    case 'list':
      return (
        <ListInput
          ph={ph}
          value={props.value}
          onChange={v => props.onChange(v)}
          onFreeStyle={onFreeStyle}
        />
      );
    case 'palette':
      return <PaletteRefInput ph={ph} />;
    case 'imageRef':
      return <ImageRefInput ph={ph} />;
  }
}
