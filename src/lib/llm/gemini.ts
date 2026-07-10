import { GoogleGenerativeAI } from '@google/generative-ai';
import type { LLMClient, ExtractedPoints, FreeStyleArgs } from './index';
import type { ColorPalette, Template, ProductContext } from '../schemas';

const MODEL_NAME = process.env.GOOGLE_MODEL_TEXT ?? 'gemini-2.5-pro';

export class GeminiLLMClient implements LLMClient {
  private model;

  constructor() {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) throw new Error('GOOGLE_API_KEY not set in environment');
    const genai = new GoogleGenerativeAI(apiKey);
    this.model = genai.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
    });
  }

  async extractSellingPoints(ctx: ProductContext): Promise<ExtractedPoints> {
    const prompt = `你是资深电商文案策划。基于产品信息输出结构化 JSON（严格遵守 schema，不要任何解释）：\n\n产品名: ${ctx.productName}\n核心成分: ${ctx.coreIngredients.join(', ')}\n核心卖点: ${ctx.coreSellingPoints.join(', ')}${
      ctx.audience ? '\n已知受众: ' + ctx.audience : ''
    }${ctx.occasion ? '\n已知场景: ' + ctx.occasion : ''}\n\n输出 JSON:\n{\n  "sellingPoints": ["4 条短句", "每条 ≤ 12 字", "中文", "强动词开头"],\n  "ingredients": ["成分名（中英皆可）"],\n  "audience": "目标人群 1 句",\n  "occasion": "使用场景 1 句"\n}`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text) as ExtractedPoints;
  }

  async fillFreeStyle({ template, placeholder, currentValues, productContext }: FreeStyleArgs): Promise<string | string[]> {
    const sysPrompt = `你是电商主图文案专家。需要为一个 placeholder 填写内容。\n\n产品: ${productContext.productName}\n受众: ${productContext.audience ?? '未指定'}\n场景: ${productContext.occasion ?? '未指定'}\n\n模板: ${template.name}\n占位符 key=${placeholder.key} label=${placeholder.label} type=${placeholder.type}\n\n当前已填写的其他占位符:\n${Object.entries(currentValues).map(([k, v]) => `- ${k}: ${typeof v === 'string' ? v : Array.isArray(v) ? v.join(', ') : ''}`).join('\n') || '（暂无）'}\n\n输出要求:\n- 如果 placeholder.type === 'list'，返回 string[]\n- 否则返回 string\n- 直接返回内容，不要任何 Markdown 包裹或解释`;
    const result = await this.model.generateContent(sysPrompt);
    const text = result.response.text().trim();
    if (placeholder.type === 'list') {
      try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) return parsed as string[];
      } catch {
        /* fall through */
      }
      return text.split('\n').map(s => s.replace(/^[-*]\s*/, '').trim()).filter(Boolean);
    }
    return text;
  }

  async translateToEnglish(text: string, ctx: ProductContext): Promise<string> {
    const prompt = `你是电商翻译官。翻译下面的中文为英文电商文案（保留品牌名 / 产品名专有名词不译），仅返回翻译结果本身：\n\n产品: ${ctx.productName}\n原文: ${text}`;
    const result = await this.model.generateContent(prompt);
    return result.response.text().trim();
  }

  async translatePromptToChinese(
    _finalPrompt: string,
    _template: Template,
    palette: ColorPalette,
    _ctx: ProductContext,
  ): Promise<string> {
    // Simple deterministic stub for the chat-only translation path; concrete UX is handled in UI.
    return `[Gemini 翻译占位] 主导色: ${palette.primary} / 背景: ${palette.background}。该功能用于离线调试，工程集成后再启用真实翻译。`;
  }
}