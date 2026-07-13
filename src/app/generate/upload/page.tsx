'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UploadZone } from '@/components/upload/UploadZone';
import { useGenerationStore } from '@/lib/store';

export default function UploadPage() {
  const router = useRouter();
  const { productImages, setProductImage } = useGenerationStore();

  const canNext = Boolean(productImages.packaging || productImages.product);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Step 1：上传商品图</h2>
      <p className="text-muted-foreground">至少上传一张（包装图优先）。</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UploadZone
          label="包装图（推荐）"
          currentUrl={productImages.packaging}
          onUploaded={url => setProductImage('packaging', url)}
        />
        <UploadZone
          label="产品图"
          currentUrl={productImages.product}
          onUploaded={url => setProductImage('product', url)}
        />
      </div>
      <div className="flex justify-end">
        <Button disabled={!canNext} onClick={() => router.push('/generate/palette')}>
          下一步
        </Button>
      </div>
    </div>
  );
}