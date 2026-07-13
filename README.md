# 电商主图生成系统 (ecom-hero-shot)

基于「反向提取模板」方法论 + Gemini 的电商主图 prompt 生成工具。给定一张商品图，自动走完 6 步向导，输出 5 张主图的英文 prompt + 中文翻译，可直接喂给 Nano Banana 2 等生图模型。

## 快速开始

```bash
pnpm install
cp .env.local.example .env.local   # 填入 GOOGLE_API_KEY
pnpm dev
```

打开 http://localhost:3000

> Windows / `pnpm` 脚本被 PowerShell 拦截时，可直接调用本地二进制：
> ```bash
> node node_modules/next/dist/bin/next dev
> node node_modules/.bin/playwright test
> node node_modules/.bin/vitest run
> ```

## 脚本

| 命令 | 作用 |
| --- | --- |
| `pnpm dev` | 启动 Next.js dev server（端口 3000） |
| `pnpm build` | 生产构建 |
| `pnpm start` | 启动生产 server |
| `pnpm test` / `vitest run` | 跑单元测试（jsdom 环境） |
| `playwright test` | 跑 E2E 测试（自动启 dev server） |
| `playwright install chromium` | 首次跑 E2E 前需装浏览器 |

## 架构

6 步向导：`/generate/upload` → `/generate/palette` → `/generate/product` → `/generate/style` → `/generate/details` → `/generate/review`

辅助页：

- `/` — 首页（3 个入口卡片）
- `/gallery` — 已保存的生成历史（IndexedDB）
- `/admin/styles` — 内置 + 用户风格管理
- `/admin/presets/new` — 上传新风格向导

核心模块：

- `src/lib/schemas.ts` — Zod 类型（产品上下文 / 配色 / 模板 / 风格 / 生成）
- `src/lib/db.ts` — `idb-keyval` 封装 + Zustand persist 适配器
- `src/lib/store.ts` — 全局向导状态（Zustand）
- `src/lib/llm/` — LLM 客户端接口 + Gemini + Mock 双驱动
- `src/lib/renderer.ts` — 模板 prompt 渲染（占位符 → 终稿）
- `src/templates/builtin/` — 内置风格（亮黄美妆工作室 5 张主图）
- `src/app/api/*` — upload / palette-extract / llm-* / templates / prompts / generate

详细设计：`docs/superpowers/specs/2026-07-09-ecom-hero-shot-design.md`

## 6 步向导

1. **上传商品图** — 包装图优先（推荐），产品图备选
2. **选配色** — 3 套候选（mock 提取，Phase 2 接真实 CV）
3. **填全局产品信息** — 产品名 / 核心成分 / 核心卖点（可点「AI 提取」走 Gemini）
4. **选风格** — 内置 5 张主图模板（功能 / 人群 / 成分 / 对比 / 前后）
5. **填卖点** — schema 驱动表单 + 实时预览最终 prompt
6. **审核导出** — 5 张主图卡片 + 复制 / 下载 JSON / 保存到历史

## Phase 状态

- ✅ Phase 1：网站骨架 + 真实 Gemini 文本流 + IndexedDB 历史
- ⏳ Phase 2：生图（`/api/generate` 占位返回 501，需 Nano Banana 2 API key）

## 风格

- 内置：`亮黄美妆工作室`（5 张主图：功能 / 人群 / 成分 / 对比 / 前后）
- 用户自定义：通过 `/admin/presets/new` 上传

## 环境变量

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `GOOGLE_API_KEY` | Phase 1 LLM 真跑时必填 | Gemini API key |
| `GOOGLE_MODEL_TEXT` | 否 | 默认 `gemini-2.5-pro` |
| `LLM_DRIVER` | 否 | `gemini`（默认）/ `mock` |
| `IMAGE_DRIVER` | 否 | `mock`（默认；Phase 2 改 `nanobanana`） |

## 测试覆盖

- 单元测试：`src/lib/*` 业务逻辑、schemas、db、palette、product-context、renderer、llm-mock、ProductContextForm
- E2E：首页 3 入口 + Gallery 空态 + 风格管理 + 上传新风格 + 向导前 4 步 + 产品表单校验门

## 路线图

- [ ] Phase 2：接入 Nano Banana 2 生图（替换 `/api/generate` 占位）
- [ ] Phase 2：配色从商品图真实提取（替换 mock）
- [ ] Phase 3：多模板 + 多变体 + 批量导出 ZIP
- [ ] Phase 3：用户上传参考图 → 自动反推 prompt
