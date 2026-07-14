import { GoogleGenerativeAI } from '@google/generative-ai';
import type { LLMClient, ExtractedPoints, FreeStyleArgs } from './index';
import type { ColorPalette, Template, ProductContext } from '../schemas';

const TEXT_MODEL = process.env.GOOGLE_MODEL_TEXT ?? 'gemini-2.0-flash';
const VISION_MODEL = process.env.GOOGLE_MODEL_VISION ?? 'gemini-2.5-flash';
const FALLBACK_MODEL = 'gemini-1.5-flash';

function logErr(tag: string, err: any): void {
  try {
    const status = err?.status ?? err?.response?.status ?? err?.code ?? '?';
    const msg = err?.message ?? String(err);
    const body = err?.response?.data ?? err?.error ?? '';
    console.error('[' + tag + ']', { status, msg, body: typeof body === 'string' ? body.slice(0, 500) : JSON.stringify(body).slice(0, 500) });
  } catch {
    console.error('[' + tag + '] logErr failed');
  }
}

export class GeminiLLMClient implements LLMClient {
  private genai: GoogleGenerativeAI;
  private textName: string;
  private visionName: string;

  constructor() {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY not set');
    }
    this.genai = new GoogleGenerativeAI(apiKey);
    this.textName = TEXT_MODEL;
    this.visionName = VISION_MODEL;
  }

  private getTextModel() {
    return this.genai.getGenerativeModel({
      model: this.textName,
      generationConfig: { temperature: 0.7 },
    });
  }

  private getTextModelJson() {
    return this.genai.getGenerativeModel({
      model: this.textName,
      generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
    });
  }

  private getVisionModel() {
    return this.genai.getGenerativeModel({
      model: this.visionName,
      generationConfig: { responseMimeType: 'application/json', temperature: 0.4 },
    });
  }

  // ===== 文字方法 =====

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

    try {
      const result = await this.getTextModelJson().generateContent(prompt);
      const text = result.response.text();
      return JSON.parse(text) as ExtractedPoints;
    } catch (err) {
      logErr('extractSellingPoints', err);
      throw new Error('extractSellingPoints failed: ' + (err instanceof Error ? err.message : String(err)));
    }
  }

  async fillFreeStyle({ template, placeholder, currentValues, productContext }: FreeStyleArgs): Promise<string | string[]> {
    const sysPrompt = '你是电商主图文案专家。\n' +
      '产品: ' + productContext.productName + '\n' +
      '成分: ' + productContext.coreIngredients.join(', ') + '\n' +
      '卖点: ' + productContext.coreSellingPoints.join(', ') + '\n' +
      (productContext.audience ? '受众: ' + productContext.audience + '\n' : '') +
      (productContext.occasion ? '场景: ' + productContext.occasion + '\n' : '') + '\n' +
      '模板: ' + template.name + '\n' +
      '占位符: ' + placeholder.label + '（' + (placeholder.hint ?? '无提示') + '）\n' +
      '类型: ' + placeholder.type + '\n' +
      (placeholder.type === 'list'
        ? '需要 ' + placeholder.minItems + '~' + placeholder.maxItems + ' 项'
        : '单行文本, max ' + (placeholder.maxLength ?? 60) + ' 字符') + '\n' +
      '已填字段: ' + JSON.stringify(currentValues) + '\n' +
      '风格: ' + (template.promptNotes ?? '高端美妆电商') + '\n' +
      '语言: ' + (placeholder.inputLanguage === 'en' ? '英文' : placeholder.inputLanguage === 'zh' ? '中文' : '与已填字段一致') + '\n' +
      (placeholder.type === 'list' ? '返回 JSON 数组' : '返回纯文本') + ', 精炼直接可用';

    try {
      const result = await this.getTextModel().generateContent(sysPrompt);
      const text = result.response.text().trim();
      if (placeholder.type === 'list') {
        try {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) return parsed as string[];
        } catch { /* fall through */ }
        return text.split('\n').map(s => s.replace(/^[-*\d.)\s]+/, '').trim()).filter(Boolean);
      }
      return text;
    } catch (err) {
      logErr('fillFreeStyle', err);
      throw new Error('fillFreeStyle failed: ' + (err instanceof Error ? err.message : String(err)));
    }
  }

  async translateToEnglish(text: string, ctx: ProductContext): Promise<string> {
    const prompt = '你是英美电商文案专家。\n' +
      '产品: ' + ctx.productName + '（' + ctx.coreSellingPoints.join(', ') + '）\n' +
      '原文: ' + text + '\n' +
      '输出英文 (Amazon/Shopify 风格, 不超过 1.5 倍长度, 不要引号)';

    try {
      const r = await this.getTextModel().generateContent(prompt);
      return r.response.text().trim();
    } catch (err) {
      logErr('translateToEnglish', err);
      throw new Error('translateToEnglish failed: ' + (err instanceof Error ? err.message : String(err)));
    }
  }

  async translatePromptToChinese(
    finalPrompt: string,
    _template: Template,
    palette: ColorPalette,
    _ctx: ProductContext,
  ): Promise<string> {
    const prompt = '你是电商主图 prompt 翻译专家。\n' +
      '模板名: ' + _template.name + '\n' +
      '背景色: ' + palette.background + ', 主色: ' + palette.primary + '\n\n' +
      '英文 prompt:\n---\n' + finalPrompt + '\n---\n\n' +
      '翻译为中文, 保留 [未填:xxx] 标记, 关键英文术语可加中文解释';

    try {
      const r = await this.getTextModel().generateContent(prompt);
      return r.response.text().trim();
    } catch (err) {
      logErr('translatePromptToChinese', err);
      throw new Error('translatePromptToChinese failed: ' + (err instanceof Error ? err.message : String(err)));
    }
  }

  // ===== 视觉方法 =====

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
    if (imageDataUrls.length === 0) {
      throw new Error('No images provided');
    }

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
      '- coreSellingPoints: 4 条短句卖点（中文, ≤12 字, 强动词开头）\n' +
      '- audience: 1 句目标人群描述\n' +
      '- occasion: 1 句使用场景描述\n\n' +
      '严格按此 JSON 输出（不要其他文字）:\n' +
      '{"productName":"...",' +
      '"coreIngredients":["...","..."],' +
      '"coreSellingPoints":["...","...","...","..."],' +
      '"audience":"...",' +
      '"occasion":"..."}';

    try {
      const result = await this.getVisionModel().generateContent({
        contents: [
          {
            role: 'user',
            parts: [{ text: promptText }, ...imageParts],
          },
        ],
      });
      const text = result.response.text();
      return JSON.parse(text);
    } catch (err) {
      logErr('identifyProductFromImages', err);
      throw new Error('identifyProductFromImages failed: ' + (err instanceof Error ? err.message : String(err)));
    }
  }
}
