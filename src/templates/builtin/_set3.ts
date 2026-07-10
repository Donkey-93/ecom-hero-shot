import type { StylePreset, Template } from '@/lib/schemas';

export const beforeAfterTpl: Template = {
  id: 'tpl_before_after',
  name: '使用前后图',
  type: 'beforeAfter',
  referenceImageUrl: '/templates/bright-yellow-cosmetic/before-after.png',
  promptNotes: '左右分栏，左侧痛点（灰）右侧效果（亮黄）。',
  prompt: `Commercial e-commerce infographic image, 1:1 aspect ratio, symmetric split-column layout. Clean white background with a refreshing {{palette_background}}-tinted gradient. No product packaging featured.

[Top Layout]:
Extra-large, oversized, bold clean sans-serif text at the very top reads exactly: "{{headlineText}}"
Below the title, two large, beautifully spaced photorealistic portraits: On the left, {{leftPersonVisuals}}. On the right, {{rightPersonVisuals}}. Both portraits are photorealistic and no text is on the photos themselves.

[Center Advice Banner]: In the middle-right area, a {{centerBannerStyle}} with text copy reading: "{{centerBannerMainText}}" and "{{centerBannerSubText}}".

[Vertical Side Descriptions]: Below the photos, a vertical list in each column.
Left Column (Pain Points): {{leftIconStyle}} icons with the following text copy in extra-large, bold text, separated by thin dashed horizontal lines, from top to bottom:
"{{leftPainPoint1}}"
"{{leftPainPoint2}}"
"{{leftPainPoint3}}"
"{{leftPainPoint4}}"
"{{leftPainPoint5}}"
"{{leftPainPoint6}}"
Right Column (Solutions & Results): {{rightIconStyle}} icons with the following text copy in extra-large, bold text, separated by thin dashed horizontal lines, from top to bottom:
"{{rightAdvantage1}}"
"{{rightAdvantage2}}"
"{{rightAdvantage3}}"
"{{rightAdvantage4}}"
"{{rightAdvantage5}}"
"{{rightAdvantage6}}"

[Bottom Layout]:
At the bottom center, in small, clean text, exactly: "{{bottomDisclaimer}}"

[Style & Lighting]: High-end cosmetic studio lighting, bright and airy aesthetic, clean design, photorealistic photography, sharp focus. Overall palette: {{overallPaletteDescription}}, avoiding blue.`,
  placeholders: [
    { key: 'palette_background', label: '背景主题色', type: 'palette' },
    { key: 'headlineText', label: '主标题', type: 'text', inputLanguage: 'auto', maxLength: 80 },
    { key: 'leftPersonVisuals', label: '左侧痛点人物', type: 'longText', inputLanguage: 'auto' },
    { key: 'rightPersonVisuals', label: '右侧效果人物', type: 'longText', inputLanguage: 'auto' },
    { key: 'centerBannerStyle', label: '中间装饰条样式', type: 'text', inputLanguage: 'auto' },
    { key: 'centerBannerMainText', label: '中间装饰主文', type: 'text', inputLanguage: 'auto', maxLength: 40 },
    { key: 'centerBannerSubText', label: '中间装饰副文', type: 'text', inputLanguage: 'auto', maxLength: 40 },
    { key: 'leftIconStyle', label: '左侧图标样式', type: 'text', inputLanguage: 'auto' },
    { key: 'leftPainPoint1', label: '左侧痛点 1', type: 'text', inputLanguage: 'auto', maxLength: 30 },
    { key: 'leftPainPoint2', label: '左侧痛点 2', type: 'text', inputLanguage: 'auto', maxLength: 30 },
    { key: 'leftPainPoint3', label: '左侧痛点 3', type: 'text', inputLanguage: 'auto', maxLength: 30 },
    { key: 'leftPainPoint4', label: '左侧痛点 4', type: 'text', inputLanguage: 'auto', maxLength: 30 },
    { key: 'leftPainPoint5', label: '左侧痛点 5', type: 'text', inputLanguage: 'auto', maxLength: 30 },
    { key: 'leftPainPoint6', label: '左侧痛点 6', type: 'text', inputLanguage: 'auto', maxLength: 30 },
    { key: 'rightIconStyle', label: '右侧图标样式', type: 'text', inputLanguage: 'auto' },
    { key: 'rightAdvantage1', label: '右侧优势 1', type: 'text', inputLanguage: 'auto', maxLength: 30 },
    { key: 'rightAdvantage2', label: '右侧优势 2', type: 'text', inputLanguage: 'auto', maxLength: 30 },
    { key: 'rightAdvantage3', label: '右侧优势 3', type: 'text', inputLanguage: 'auto', maxLength: 30 },
    { key: 'rightAdvantage4', label: '右侧优势 4', type: 'text', inputLanguage: 'auto', maxLength: 30 },
    { key: 'rightAdvantage5', label: '右侧优势 5', type: 'text', inputLanguage: 'auto', maxLength: 30 },
    { key: 'rightAdvantage6', label: '右侧优势 6', type: 'text', inputLanguage: 'auto', maxLength: 30 },
    { key: 'bottomDisclaimer', label: '底部免责', type: 'text', inputLanguage: 'auto' },
    { key: 'overallPaletteDescription', label: '整体配色描述', type: 'text', inputLanguage: 'auto' },
  ],
};

