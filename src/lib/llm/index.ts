import type { ColorPalette, ProductContext, Template, Placeholder, PlaceholderValue } from '../schemas';

export interface ExtractedPoints {
  sellingPoints: string[];
  ingredients: string[];
  audience: string;
  occasion: string;
}

export interface FreeStyleArgs {
  template: Template;
  placeholder: Placeholder;
  currentValues: Record<string, PlaceholderValue>;
  productContext: ProductContext;
}

export interface LLMClient {
  extractSellingPoints(ctx: ProductContext): Promise<ExtractedPoints>;
  fillFreeStyle(args: FreeStyleArgs): Promise<string | string[]>;
  translateToEnglish(text: string, ctx: ProductContext): Promise<string>;
  translatePromptToChinese(
    finalPrompt: string,
    template: Template,
    palette: ColorPalette,
    ctx: ProductContext,
  ): Promise<string>;
}

async function getLLMClient(): Promise<LLMClient> {
  const driver = process.env.LLM_DRIVER ?? 'gemini';
  if (driver === 'mock') {
    const { MockLLMClient } = await import('./mock');
    return new MockLLMClient();
  }
  const { GeminiLLMClient } = await import('./gemini');
  return new GeminiLLMClient();
}

let _client: LLMClient | null = null;
export async function llm(): Promise<LLMClient> {
  if (!_client) _client = await getLLMClient();
  return _client;
}