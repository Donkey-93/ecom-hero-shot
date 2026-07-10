import type { Template } from '@/lib/schemas';

export const ingredientTpl: Template = {
  id: 'tpl_ingredient',
  name: '成分图',
  type: 'ingredient',
  referenceImageUrl: '/templates/bright-yellow-cosmetic/ingredient.png',
  promptNotes: '突出 4 个核心成分，配合水晶球或类似视觉容器。',
  prompt: `Commercial e-commerce ingredient infographic, 1:1 aspect ratio. Clean white background with a refreshing {{palette_background}}-tinted gradient.

[Centerpiece Composition]: A {{centerpieceVisuals}} floats weightlessly in the exact center. Elegantly wrapping around this centerpiece is an {{secondaryVisuals}}, flowing dynamically like a piece of {{materialMetaphor}}.

[Asymmetrical Bubbles & Heavy Typography]: At the top center, an extra-large, oversized, bold clean headline reads exactly: "{{headlineText}}". Surrounding the centerpiece are 4 floating crystal-clear liquid spheres arranged in an organic, staggered, and asymmetrical layout (varied heights and staggered left/right positions). Underneath each sphere, there is a highly prominent, extra-large, and bold font text overlay displaying ONLY the ingredient name:

"{{coreWord1}}"
"{{coreWord2}}"
"{{coreWord3}}"
"{{coreWord4}}"

[Style & Lighting]: High-end cosmetic studio lighting, bright and airy atmosphere, crisp rim light on the floating centerpiece, realistic soft drop shadows, premium marketplace graphic design style, hyper-realistic, 8k resolution, sharp focus --ar 1:1 --style raw --v 6.0`,
  placeholders: [
    { key: 'palette_background', label: '背景主题色', type: 'palette' },
    { key: 'centerpieceVisuals', label: '核心产品外观', type: 'longText', inputLanguage: 'auto' },
    { key: 'secondaryVisuals', label: '辅助产品外观', type: 'longText', inputLanguage: 'auto' },
    { key: 'materialMetaphor', label: '材质动态拟物', type: 'text', inputLanguage: 'en' },
    { key: 'headlineText', label: '大标题文案', type: 'text', inputLanguage: 'auto', maxLength: 40 },
    { key: 'coreWord1', label: '核心词 1', type: 'text', inputLanguage: 'auto', maxLength: 30 },
    { key: 'coreWord2', label: '核心词 2', type: 'text', inputLanguage: 'auto', maxLength: 30 },
    { key: 'coreWord3', label: '核心词 3', type: 'text', inputLanguage: 'auto', maxLength: 30 },
    { key: 'coreWord4', label: '核心词 4', type: 'text', inputLanguage: 'auto', maxLength: 30 },
  ],
};

export const compareTpl: Template = {
  id: 'tpl_compare',
  name: '竞品对比图',
  type: 'compare',
  referenceImageUrl: '/templates/bright-yellow-cosmetic/compare.png',
  promptNotes: '4 行玻璃拟态对比表，左侧本产品优势，右侧竞品劣势。',
  prompt: `Commercial e-commerce product comparison infographic, 1:1 aspect ratio. Clean white background with a refreshing {{palette_background}}-tinted gradient.

[Visual Styling & Material]: All horizontal comparison rows and container boxes are styled with premium Apple-style frosted glass (glassmorphism) texture, featuring realistic semi-translucent blur effects, soft glossy edges, and elegant drop shadows.

[Top Layout]:
Main Title at the top center reads exactly: "{{headlineText}}" in bold clean sans-serif typography.
Below the title, a side-by-side product placement: On the left, {{ownProductVisuals}}. On the right, {{competitorVisuals}}. A central round button reads "VS".

[Horizontal Comparison Rows]: 4 vertical rows of frosted glass rectangular cards stretching horizontally.
Row 1: Left reads "{{ownAdvantage1}}" | Middle reads "{{compareKeyword1}}" | Right reads "{{competitorWeakness1}}"
Row 2: Left reads "{{ownAdvantage2}}" | Middle reads "{{compareKeyword2}}" | Right reads "{{competitorWeakness2}}"
Row 3: Left reads "{{ownAdvantage3}}" | Middle reads "{{compareKeyword3}}" | Right reads "{{competitorWeakness3}}"
Row 4: Left reads "{{ownAdvantage4}}" | Middle reads "{{compareKeyword4}}" | Right reads "{{competitorWeakness4}}"

[Lighting]: High-end studio lighting reflecting beautifully off the glassmorphism elements, bright and clean aesthetic, hyper-realistic, 8k resolution, sharp focus --ar 1:1 --style raw --v 6.0`,
  placeholders: [
    { key: 'palette_background', label: '背景主题色', type: 'palette' },
    { key: 'headlineText', label: '大标题', type: 'text', inputLanguage: 'auto', maxLength: 60 },
    { key: 'ownProductVisuals', label: '本产品外观', type: 'longText', inputLanguage: 'auto' },
    { key: 'competitorVisuals', label: '竞品外观', type: 'longText', inputLanguage: 'auto' },
    { key: 'ownAdvantage1', label: '本产品优势 1', type: 'text', inputLanguage: 'auto', maxLength: 40 },
    { key: 'compareKeyword1', label: '对比维度 1', type: 'text', inputLanguage: 'en', maxLength: 25 },
    { key: 'competitorWeakness1', label: '竞品劣势 1', type: 'text', inputLanguage: 'auto', maxLength: 40 },
    { key: 'ownAdvantage2', label: '本产品优势 2', type: 'text', inputLanguage: 'auto', maxLength: 40 },
    { key: 'compareKeyword2', label: '对比维度 2', type: 'text', inputLanguage: 'en', maxLength: 25 },
    { key: 'competitorWeakness2', label: '竞品劣势 2', type: 'text', inputLanguage: 'auto', maxLength: 40 },
    { key: 'ownAdvantage3', label: '本产品优势 3', type: 'text', inputLanguage: 'auto', maxLength: 40 },
    { key: 'compareKeyword3', label: '对比维度 3', type: 'text', inputLanguage: 'en', maxLength: 25 },
    { key: 'competitorWeakness3', label: '竞品劣势 3', type: 'text', inputLanguage: 'auto', maxLength: 40 },
    { key: 'ownAdvantage4', label: '本产品优势 4', type: 'text', inputLanguage: 'auto', maxLength: 40 },
    { key: 'compareKeyword4', label: '对比维度 4', type: 'text', inputLanguage: 'en', maxLength: 25 },
    { key: 'competitorWeakness4', label: '竞品劣势 4', type: 'text', inputLanguage: 'auto', maxLength: 40 },
  ],
};