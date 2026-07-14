import { GoogleGenerativeAI } from '@google/generative-ai';
import type { LLMClient, ExtractedPoints, FreeStyleArgs } from './index';
import type { ColorPalette, Template, ProductContext } from '../schemas';

const TEXT_MODEL = process.env.GOOGLE_MODEL_TEXT ?? 'gemini-2.0-flash-exp';
const VISION_MODEL = process.env.GOOGLE_MODEL_VISION ?? 'gemini-2.5-flash';

export class GeminiLLMClient implements LLMClient {
  private textModel;
  private visionModel;

  constructor() {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) throw new Error('GOOGLE_API_KEY not set in environment');
    const genai = new GoogleGenerativeAI(apiKey);
    this.textModel = genai.getGenerativeModel({
      model: TEXT_MODEL,
      generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
    });
    this.visionModel = genai.getGenerativeModel({
      model: VISION_MODEL,
      generationConfig: { responseMimeType: 'application/json', temperature: 0.4 },
    });
  }

  // ===== 文字方法（4 个）=====

  async extractSellingPoints(ctx: ProductContext): Promise<ExtractedPoints> {
    const prompt = `你是资深电商文案策划。基于产品信息输出结构化 JSON（严格遵守 schema，不要任何解释）：

产品名: ${ctx.productName}
核心成分: ${ctx.coreIngredients.join(', ')}
核心卖点: ${ctx.coreSellingPoints.join(', ')}${
      ctx.audience ? '\n已知受众: ' + ctx.audience : ''
    }${ctx.occasion ? '\n已知场景: ' + ctx.occasion : ''}

输出 JSON:
{
  "sellingPoints": ["4 条短句", "每条 ≤ 12 字", "中文", "强动词开头"],
  "ingredients": ["成分名（中英皆可）"],
  "audience": "目标人群 1 句",
  "occasion": "使用场景 1 句"
}`;

    const result = await this.textModel.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text) as ExtractedPoints;
  }

  async fillFreeStyle({ template, placeholder, currentValues, productContext }: FreeStyleArgs): Promise<string | string[]> {
    const sysPrompt = `你是电商主图文案专家。需要为一个 placeholder 填写内容。

产品: ${productContext.productName}
成分: ${productContext.coreIngredients.join(', ')}
卖点: ${productContext.coreSellingPoints.join(', ')}${
      productContext.audience ? '\n受众: ' + productContext.audience : ''
    }${productContext.occasion ? '\n场景: ' + productContext.occasion : ''}

模板: "${template.name}"
占位符: "${placeholder.label}"（${placeholder.hint ?? '无提示'}）
类型: ${placeholder.type}
${
  placeholder.type === 'list'
    ? '是 list，需要 ' + placeholder.minItems + '~' + placeholder.maxItems + ' 项，每项为 ' + placeholder.itemLabel
    : '是单行文本，max ' + (placeholder.maxLength ?? 60) + ' 字符'
}

已填其他字段: ${JSON.stringify(currentValues)}

风格: ${template.promptNotes ?? '高端美妆电商，简洁有冲击力'}

要求:
- 输出${placeholder.type === 'list' ? 'JSON 数组字符串，每项一行' : '纯文本（不要引号/前缀）'}
- 语言: ${placeholder.inputLanguage === 'en' ? '必须英文' : placeholder.inputLanguage === 'zh' ? '必须中文' : '与已填字段保持一致'}
- 长度: 精炼，直接可用`;

    const result = await this.textModel.generateContent(sysPrompt);
    const text = result.response.text().trim();
    if (placeholder.type === 'list') {
      try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) return parsed as string[];
      } catch { /* fall through */ }
      return text.split('\n').map(s => s.replace(/^[-*\d.)\s]+/, '').trim()).filter(Boolean);
    }
    return text;
  }

  async translateToEnglish(text: string, ctx: ProductContext): Promise<string> {
    const prompt = `你是英美电商文案专家。把以下中文翻译为符合英美电商语境的英文短语。

产品背景: ${ctx.productName}（${ctx.coreSellingPoints.join(', ')}）
原文: ${text}

要求:
- 直接输出英文（不要引号/前缀/翻译说明）
- 符合 Amazon / Shopify 风格的高端美妆文案
- 长度不超过原文 1.5 倍`;

    const r = await this.textModel.generateContent(prompt);
    return r.response.text().trim();
  }

  async translatePromptToChinese(
    finalPrompt: string,
    _template: Template,
    palette: ColorPalette,
    _ctx: ProductContext,
  ): Promise<string> {
    // 真实实现：调 textModel 翻译整段英文 prompt
    const prompt = '你是电商主图 prompt 翻译专家。把以下英文 prompt 翻译为中文，让不懂英文的运营能审核。\n\n' +
      '模板名: ' + _template.name + '\n' +
      '背景色: ' + palette.background + ', 主色: ' + palette.primary + '\n\n' +
      '英文 prompt:\n---\n' + finalPrompt + '\n---\n\n' +
      '要求:\n' +
      '- 保留 [未填:xxx] 标记原样\n' +
      '- 保留占位符位置（如果原文有 {{xxx}}，翻译为「（xxx 位置）」）\n' +
      '- 中文通顺，符合电商运营用语\n' +
      '- 关键英文术语（如 "1:1 aspect ratio", "glassmorphism"）可保留 + 简短中文解释';

    const r = await this.textModel.generateContent(prompt);
    return r.response.text().trim();
  }

  // ===== 视觉方法（1 个）=====

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
      return {
        inlineData: {
          mimeType: match[1],
          data: match[2],
        },
      };
    });

    const promptText = '你是资深电商运营 + 产品经理。看这些产品图（包装 + 产品），从图里识别并输出 JSON。\n\n' +
      (hints ? '用户额外提示: ' + hints + '\n' : '') +
      '要求：\n' +
      '- productName: 推断产品中文名（用图上印刷的名字优先）\n' +
      '- coreIngredients: 3-5 个核心成分（中文，从图上文字或推断）\n' +
      '- coreSellingPoints: 4 条短句卖点（中文，≤12 字，强动词开头）\n' +
      '- audience: 1 句目标人群描述\n' +
      '- occasion: 1 句使用场景描述\n\n' +
      '严格按这个 JSON 输出（不要任何其他文字）:\n' +
      '{\n' +
      '  "productName": "...",\n' +
      '  "coreIngredients": ["...", "..."],\n' +
      '  "coreSellingPoints": ["...", "...", "...", "..."],\n' +
      '  "audience": "...",\n' +
      '  "occasion": "..."\n' +
      '}';

    const result = await this.visionModel.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            { text: promptText },
            ...imageParts,
          ],
        },
      ],
    });

    const text = result.response.text();
    return JSON.parse(text);
  }
}
