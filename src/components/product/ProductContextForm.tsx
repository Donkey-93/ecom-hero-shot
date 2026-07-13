'use client';
import { useFieldArray, useForm, type FieldArrayPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProductContextSchema, type ProductContext } from '@/lib/schemas';
import { Plus, X, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

interface Props {
  initialValue: ProductContext;
  onSubmit: (ctx: ProductContext) => Promise<void>;
  onAIExtract?: () => Promise<Partial<ProductContext> | null>;
}

export function ProductContextForm({ initialValue, onSubmit, onAIExtract }: Props) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductContext>({
    resolver: zodResolver(ProductContextSchema),
    defaultValues: initialValue,
  });
  const ingredients = useFieldArray({ control, name: 'coreIngredients' as FieldArrayPath<ProductContext> });
  const sellingPoints = useFieldArray({ control, name: 'coreSellingPoints' as FieldArrayPath<ProductContext> });
  const [aiLoading, setAiLoading] = useState(false);

  async function handleAI() {
    if (!onAIExtract) return;
    setAiLoading(true);
    try {
      const partial = await onAIExtract();
      if (partial) {
        if (partial.productName) setValue('productName', partial.productName);
        if (partial.coreIngredients) setValue('coreIngredients', partial.coreIngredients);
        if (partial.sellingPoints) setValue('coreSellingPoints', partial.sellingPoints);
        if (partial.audience) setValue('audience', partial.audience);
        if (partial.occasion) setValue('occasion', partial.occasion);
      }
      toast.success('已自动填充');
    } catch (e: any) {
      toast.error(e.message ?? 'AI 识别失败');
    } finally { setAiLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="productName">
          产品名 <span className="text-red-500">*</span>
        </Label>
        <Input id="productName" {...register('productName')} placeholder="例：清爽控油洗发湿巾" />
        {errors.productName ? (
          <p className="text-xs text-red-500 mt-1">{errors.productName.message}</p>
        ) : null}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>
            核心成分 <span className="text-red-500">*</span>
          </Label>
          <Button type="button" size="sm" variant="ghost" onClick={() => ingredients.append('')}>
            <Plus className="w-4 h-4" /> 添加
          </Button>
        </div>
        {ingredients.fields.map((f, i) => (
          <div key={f.id} className="flex gap-2 mb-2">
            <Input
              {...register(`coreIngredients.${i}` as const)}
              placeholder={'成分 ' + (i + 1)}
            />
            <Button type="button" size="icon" variant="ghost" onClick={() => ingredients.remove(i)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>
            核心卖点 <span className="text-red-500">*</span>
          </Label>
          <div className="flex gap-1">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleAI}
              disabled={aiLoading || !onAIExtract}
            >
              {aiLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              AI 识别图片
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => sellingPoints.append('')}
            >
              <Plus className="w-4 h-4" /> 添加
            </Button>
          </div>
        </div>
        {sellingPoints.fields.map((f, i) => (
          <div key={f.id} className="flex gap-2 mb-2">
            <Input
              {...register(`coreSellingPoints.${i}` as const)}
              placeholder={'卖点 ' + (i + 1)}
            />
            <Button type="button" size="icon" variant="ghost" onClick={() => sellingPoints.remove(i)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <div>
        <Label htmlFor="audience">目标人群</Label>
        <Input id="audience" {...register('audience')} placeholder="例：都市白领 / 健身爱好者" />
      </div>
      <div>
        <Label htmlFor="occasion">使用场景</Label>
        <Input id="occasion" {...register('occasion')} placeholder="例：工作日 / 出差 / 运动后" />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? '保存中…' : '保存并继续'}
      </Button>
    </form>
  );
}