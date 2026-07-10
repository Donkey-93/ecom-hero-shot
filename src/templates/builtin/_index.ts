import type { StylePreset } from '@/lib/schemas';
import { featureTpl } from './_set1';
import { audienceTpl } from './_set1';
import { ingredientTpl } from './_set2';
import { compareTpl } from './_set2';
import { beforeAfterTpl } from './_set3';

export const brightYellowCosmeticPreset: StylePreset = {
  id: 'preset_bright_yellow_cosmetic',
  name: '亮黄美妆工作室',
  description: '高端美妆电商风格：亮黄 + 白底 + 金色装饰，5 张主图覆盖功能/人群/成分/对比/前后全链路',
  source: 'builtin',
  coverImageUrl: '/templates/bright-yellow-cosmetic/cover.png',
  templates: [featureTpl, audienceTpl, ingredientTpl, compareTpl, beforeAfterTpl],
  createdAt: '2026-07-09',
  updatedAt: '2026-07-09',
};