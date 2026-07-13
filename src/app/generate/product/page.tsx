'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useGenerationStore } from '@/lib/store';
import { ProductContextForm } from '@/components/product/ProductContextForm';
import { llm } from '@/lib/llm';
import type { ProductContext } from '@/lib/schemas';

export default function ProductPage() {
  const router = useRouter();
  const { productContext, setProductContext, productImages } = useGenerationStore();

  useEffect(() => {
    if (!productImages.packaging && !productImages.product) {
      router.replace('/generate/upload');
    }
  }, [productImages, router]);

  async function handleSubmit(ctx: ProductContext) {
    setProductContext(ctx);
    router.push('/generate/style');
  }

  async function handleAI() {
    if (!productContext.productName) return null;
    const client = await llm();
    const r = await client.extractSellingPoints(productContext);
    return {
      sellingPoints: r.sellingPoints,
      audience: r.audience,
      occasion: r.occasion,
    };
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Step 3：产品信息（必填）</h2>
      <p className="text-muted-foreground">
        产品名 + 至少 1 个成分 + 至少 1 个卖点。后续"自由发挥"会基于这些信息。
      </p>
      <ProductContextForm
        initialValue={productContext}
        onSubmit={handleSubmit}
        onAIExtract={handleAI}
      />
    </div>
  );
}