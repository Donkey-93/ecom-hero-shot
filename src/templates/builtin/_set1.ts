import type { StylePreset, Template } from '@/lib/schemas';

export const featureTpl: Template = {
  id: 'tpl_func_intro',
  name: '功能介绍图',
  type: 'feature',
  referenceImageUrl: '/templates/bright-yellow-cosmetic/feature.png',
  promptNotes: '高端美妆电商英文文案，简洁有冲击力。强调产品的核心功能和即时效果。',
  prompt: `Commercial e-commerce product listing image, 1:1 aspect ratio, side-by-side split composition.

[Left Side Composition]: A {{productType}} with {{packagingDescription}} stands vertically on a {{surfaceDescription}}. {{productContextElements}} and {{decorationElements}} swirl gracefully around the lower half and sides of the {{productType}}.

[Right Side Typography Layout]: A bright, clean white background with a {{palette_background}}-tinted gradient.

Top-Right Headline Text Overlay: Large bold clean sans-serif text reading exactly: "{{headlineText}}"

Vertical Feature List: Below the headline, a vertical column of {{featureListCount}} thin-bordered round {{featureIconStyle}} icons. Next to each icon, the exact text copy must read sequentially from top to bottom, separated by thin dashed horizontal lines:

"{{featureListItem_1}}"
"{{featureListItem_2}}"
"{{featureListItem_3}}"
"{{featureListItem_4}}"

Bottom-Right Corner: A sleek, minimalist {{bottomDecoration}} running horizontally along the bottom edge.

[Style & Lighting]: High-end cosmetic studio lighting, crisp edge highlights, soft photorealistic drop shadows, premium marketplace graphic design style, hyper-realistic, 8k resolution, sharp focus --ar 1:1 --style raw --v 6.0`,
  placeholders: [
    { key: 'productType', label: '产品类型', type: 'text', inputLanguage: 'en' },
    { key: 'packagingDescription', label: '包装描述', type: 'text', inputLanguage: 'auto' },
    { key: 'surfaceDescription', label: '产品表面', type: 'text', inputLanguage: 'auto' },
    { key: 'productContextElements', label: '产品相关场景元素', type: 'text', inputLanguage: 'auto' },
    { key: 'decorationElements', label: '其他场景装饰', type: 'text', inputLanguage: 'auto' },
    { key: 'palette_background', label: '背景主题色', type: 'palette' },
    { key: 'headlineText', label: '主标题卖点', type: 'text', inputLanguage: 'auto', maxLength: 60 },
    { key: 'featureListCount', label: '列表数量', type: 'text', inputLanguage: 'en' },
    { key: 'featureIconStyle', label: '功能列表图标样式', type: 'text', inputLanguage: 'en' },
    { key: 'featureListItem_1', label: '卖点 1', type: 'text', inputLanguage: 'auto', maxLength: 30 },
    { key: 'featureListItem_2', label: '卖点 2', type: 'text', inputLanguage: 'auto', maxLength: 30 },
    { key: 'featureListItem_3', label: '卖点 3', type: 'text', inputLanguage: 'auto', maxLength: 30 },
    { key: 'featureListItem_4', label: '卖点 4', type: 'text', inputLanguage: 'auto', maxLength: 30 },
    { key: 'bottomDecoration', label: '底部装饰描述', type: 'text', inputLanguage: 'en' },
    { key: 'styleParams', label: '风格参数', type: 'text', inputLanguage: 'en' },
  ],
};

export const audienceTpl: Template = {
  id: 'tpl_audience',
  name: '适用人群图',
  type: 'audience',
  referenceImageUrl: '/templates/bright-yellow-cosmetic/audience.png',
  promptNotes: '展示 4 个真实生活场景，每个场景对应一个细分人群。',
  prompt: `Commercial e-commerce infographic image, 1:1 aspect ratio, clean minimalist layout. NO product packaging featured.

[Background & Heading]: A crisp, bright white background with a soft, refreshing {{palette_background}}-tinted gradient. At the top center, a prominent, bold, clean sans-serif headline reads exactly: "{{headlineText}}".

[Grid Layout]: A symmetric 2x2 grid containing 4 clean rounded-corner square image cards. Each card features a realistic lifestyle photo with a solid, vibrant {{cardThemeColor}} banner running along its bottom edge containing specific text:

Top-Left Card: {{scene1Visuals}}. Bottom banner text reads exactly: "{{scene1Banner}}"
Top-Right Card: {{scene2Visuals}}. Bottom banner text reads exactly: "{{scene2Banner}}"
Bottom-Left Card: {{scene3Visuals}}. Bottom banner text reads exactly: "{{scene3Banner}}"
Bottom-Right Card: {{scene4Visuals}}. Bottom banner text reads exactly: "{{scene4Banner}}"

[Style & Lighting]: High-end clean cosmetic lifestyle aesthetic, bright and cheerful atmosphere, realistic photography for the inner card photos, sharp focus, professional marketplace graphic design style --ar 1:1 --style raw --v 6.0`,
  placeholders: [
    { key: 'palette_background', label: '背景主题色', type: 'palette' },
    { key: 'headlineText', label: '大标题场景文案', type: 'text', inputLanguage: 'auto', maxLength: 80 },
    { key: 'cardThemeColor', label: '卡片主题色', type: 'palette' },
    { key: 'scene1Visuals', label: '场景 1 视觉', type: 'longText', inputLanguage: 'auto' },
    { key: 'scene1Banner', label: '场景 1 短句', type: 'text', inputLanguage: 'auto', maxLength: 30 },
    { key: 'scene2Visuals', label: '场景 2 视觉', type: 'longText', inputLanguage: 'auto' },
    { key: 'scene2Banner', label: '场景 2 短句', type: 'text', inputLanguage: 'auto', maxLength: 30 },
    { key: 'scene3Visuals', label: '场景 3 视觉', type: 'longText', inputLanguage: 'auto' },
    { key: 'scene3Banner', label: '场景 3 短句', type: 'text', inputLanguage: 'auto', maxLength: 30 },
    { key: 'scene4Visuals', label: '场景 4 视觉', type: 'longText', inputLanguage: 'auto' },
    { key: 'scene4Banner', label: '场景 4 短句', type: 'text', inputLanguage: 'auto', maxLength: 30 },
  ],
};