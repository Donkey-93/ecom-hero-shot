import type { LLMClient, ExtractedPoints, FreeStyleArgs } from './index';
import type { ColorPalette, Template, ProductContext } from '../schemas';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export class MockLLMClient implements LLMClient {
  async extractSellingPoints(ctx: ProductContext): Promise<ExtractedPoints> {
    await sleep(50);
    return {
      sellingPoints: [
        ctx.productName + ' - 30 秒见效',
        '温和不刺激',
        '便携装随时用',
        '专业配方',
      ],
      ingredients: ctx.coreIngredients,
      audience: '都市白领 / 健身爱好者',
      occasion: '工作日 / 出差 / 运动后',
    };
  }

  async fillFreeStyle({ placeholder, productContext }: FreeStyleArgs): Promise<string | string[]> {
    await sleep(50);
    if (placeholder.type === 'list') {
      const cap = Math.max(1, (placeholder as { maxItems: number }).maxItems);
      const items = ['卖点 1', '卖点 2', '卖点 3', '卖点 4'].slice(0, cap);
      while (items.length < cap) items.push('卖点 ' + (items.length + 1));
      return items;
    }
    return productContext.productName + ' - ' + placeholder.label + '（mock）';
  }

  async translateToEnglish(text: string, _ctx?: unknown): Promise<string> {
    await sleep(50);
    return '[EN] ' + text;
  }

  async translatePromptToChinese(_p: string, _t: Template, p: ColorPalette, _ctx?: unknown): Promise<string> {
    await sleep(50);
    return '[中文翻译 mock] 颜色：' + p.primary + ' / ' + p.background + '。这是一段测试翻译，用于离线调试。';
  }
}