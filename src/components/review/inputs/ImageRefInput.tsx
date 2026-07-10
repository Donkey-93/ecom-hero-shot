'use client';
import { useGenerationStore } from '@/lib/store';
import { UploadZone } from '@/components/upload/UploadZone';
import type { z } from 'zod';
import type { ImageRefPlaceholderSchema } from '@/lib/schemas';

type ImageRefPlaceholder = z.infer<typeof ImageRefPlaceholderSchema>;

export function ImageRefInput({ ph }: { ph: ImageRefPlaceholder }) {
  const { productImages, setProductImage } = useGenerationStore();
  const url =
    ph.accept === 'packaging'
      ? productImages.packaging
      : ph.accept === 'product'
        ? productImages.product
        : (productImages.packaging ?? productImages.product);
  return (
    <UploadZone
      label={ph.label}
      currentUrl={url}
      onUploaded={u =>
        setProductImage(ph.accept === 'product' ? 'product' : 'packaging', u)
      }
    />
  );
}
