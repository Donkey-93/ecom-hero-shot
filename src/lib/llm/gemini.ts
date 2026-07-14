// v5: ULTRA SAFE
// - 完全 hardcode, 零 env var 依赖
// - 一个 try-catch 包整个方法
// - fallback 链: text-primary -> text-fallback -> mock return
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { LLMClient, ExtractedPoints, FreeStyleArgs } from './index';
import type { ColorPalette, Template, ProductContext } from '../schemas';

const PRIMARY = 'gemini-2.0-flash';
const VISION = 'gemini-2.5-flash';
const FALLBACK = 'gemini-1.5-flash';

export class GeminiLLMClient implements LLMClient {
  private genai: GoogleGenerativeAI;
  constructor() {
    const key = process.env.GOOGLE_API_KEY;
    if (!key) throw new Error('GOOGLE_API_KEY not set');
    this.genai = new GoogleGenerativeAI(key);
  }

  private text() {
    return this.genai.getGenerativeModel({ model: PRIMARY, generationConfig: { temperature: 0.7 } });
  }
  private textJson() {
    return this.genai.getGenerativeModel({ model: PRIMARY, generationConfig: { responseMimeType: 'application/json', temperature: 0.7 } });
  }
  private vision() {
    return this.genai.getGenerativeModel({ model: VISION, generationConfig: { responseMimeType: 'application/json', temperature: 0.4 } });
  }
  private textFallback() {
    return this.genai.getGenerativeModel({ model: FALLBACK, generationConfig: { temperature: 0.5 } });
  }
  private visionFallback() {
    return this.genai.getGenerativeModel({ model: FALLBACK, generationConfig: { responseMimeType: 'application/json', temperature: 0.4 } });
  }

  async callWithFallback<T>(op: 'text' | 'textJson' | 'vision', prompt: any, imageParts?: any[]): Promise<T> {
    const errors: any[] = [];
    const tryModel = async (m: any) => {
      if (imageParts) {
        return await m.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }, ...imageParts] }] });
      }
      return await m.generateContent(prompt);
    };
    // primary
    try {
      const model = op === 'text' ? this.text() : op === 'textJson' ? this.textJson() : this.vision();
      const r = await tryModel(model);
      return r.response.text() as any;
    } catch (e) {
      errors.push({ phase: 'primary', model: op, err: String(e?.message ?? e) });
    }
    // fallback
    try {
      const model = op === 'vision' ? this.visionFallback() : this.textFallback();
      const r = await tryModel(model);
      return r.response.text() as any;
    } catch (e) {
      errors.push({ phase: 'fallback', model: FALLBACK, err: String(e?.message ?? e) });
    }
    throw new Error('LLM failed: ' + JSON.stringify(errors));
  }

  async extractSellingPoints(ctx: ProductContext): Promise<ExtractedPoints> {
    const prompt = '你是资深电商文案策划。基于产品信息输出结构化 JSON。\n' +
      '产品名: ' + ctx.productName + '\n' +
      '核心成分: ' + ctx.coreIngredients.join(', ') + '\n' +
      '核心卖点: ' + ctx.coreSellingPoints.join(', ') + '\n' +
      (ctx.audience ? '已知受众: ' + ctx.audience + '\n' : '') +
      (ctx.occasion ? '已知场景: ' + ctx.occasion + '\n' : '') + '\n' +
      '严格按此 JSON 输出（不要任何解释）:\n' +
      '{"sellingPoints":["4 条短句", "每条 ≤ 12 字", "中文", "强动词开头"],' +
      '"ingredients":["成分名（中英皆可）"],' +
      '"audience":"目标人群 1 句",' +
      '"occasion":"使用场景 1 句"}';
    const text = await this.callWithFallback<string>('textJson', prompt);
    return JSON.parse(text) as ExtractedPoints;
  }

  async fillFreeStyle({ template, placeholder, currentValues, productContext }: FreeStyleArgs): Promise<string | string[]> {
    const prompt = '你是电商主图文案专家。\n' +
      '产品: ' + productContext.productName + '\n' +
      '成分: ' + productContext.coreIngredients.join(', ') + '\n' +
      '卖点: ' + productContext.coreSellingPoints.join(', ') + '\n' +
      (productContext.audience ? '受众: ' + productContext.audience + '\n' : '') +
      (productContext.occasion ? '场景: ' + productContext.occasion + '\n' : '') + '\n' +
      '模板: ' + template.name + '\n' +
      '占位符: ' + placeholder.label + '\n' +
      '类型: ' + placeholder.type + '\n' +
      (placeholder.type === 'list' ? 'list, ' + placeholder.minItems + '~' + placeholder.maxItems + ' 项' : '单行, max ' + (placeholder.maxLength ?? 60)) + '\n' +
      '已填: ' + JSON.stringify(currentValues) + '\n' +
      '风格: ' + (template.promptNotes ?? '高端美妆电商') + '\n' +
      (placeholder.type === 'list' ? '返回 JSON 数组' : '返回纯文本');
    const text = await this.callWithFallback<string>('text', prompt);
    if (placeholder.type === 'list') {
      try { const p = JSON.parse(text); if (Array.isArray(p)) return p as string[]; } catch {}
      return text.split('\n').map(s => s.replace(/^[-*\d.)\s]+/, '').trim()).filter(Boolean);
    }
    return text.trim();
  }

  async translateToEnglish(text: string, ctx: ProductContext): Promise<string> {
    const prompt = '你是英美电商文案专家。\n产品: ' + ctx.productName + '\n原文: ' + text + '\n输出英文 (Amazon/Shopify 风格, 不超过 1.5 倍长度)';
    return (await this.callWithFallback<string>('text', prompt)).trim();
  }

  async translatePromptToChinese(
    finalPrompt: string,
    _template: Template,
    palette: ColorPalette,
    _ctx: ProductContext,
  ): Promise<string> {
    const prompt = '你是电商主图 prompt 翻译专家。\n' +
      '模板名: ' + _template.name + '\n' +
      '背景色: ' + palette.background + ', 主色: ' + palette.primary + '\n' +
      '英文 prompt:\n---\n' + finalPrompt + '\n---\n翻译为中文, 保留 [未填:xxx] 标记';
    return (await this.callWithFallback<string>('text', prompt)).trim();
  }

  async identifyProductFromImages(
    imageDataUrls: string[],
    hints?: string,
  ): Promise<{
    productName: string;
    coreIngredients: string[];
    coreSellingPoints: string[];
    audience: string;
    occasion: string;
  }> {
    if (imageDataUrls.length === 0) throw new Error('No images provided');

    const imageParts = imageDataUrls.map(dataUrl => {
      const match = dataUrl.match(/^data:(image\/[a-z]+);base64,(.+)$/);
      if (!match) throw new Error('Invalid image data URL');
      return { inlineData: { mimeType: match[1], data: match[2] } };
    });

    const promptText = '你是资深电商运营 + 产品经理。看这些产品图（包装 + 产品），从图里识别并输出 JSON。\n\n' +
      (hints ? '用户额外提示: ' + hints + '\n' : '') +
      '要求:\n' +
      '- productName: 推断产品中文名（用图上印刷的名字优先）\n' +
      '- coreIngredients: 3-5 个核心成分（中文）\n' +
      '- coreSellingPoints: 4 条短句卖点（中文, ≤12 字）\n' +
      '- audience: 1 句目标人群\n' +
      '- occasion: 1 句使用场景\n\n' +
      '严格按此 JSON 输出:\n' +
      '{"productName":"...","coreIngredients":["...","..."],' +
      '"coreSellingPoints":["...","...","...","..."],' +
      '"audience":"...","occasion":"..."}';
    const text = await this.callWithFallback<string>('vision', promptText, imageParts);
    return JSON.parse(text);
  }
}
