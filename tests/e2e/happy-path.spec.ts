import { test, expect } from '@playwright/test';

test('home page shows 3 entry cards', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /电商主图/ }).first()).toBeVisible();
  // 3 entry cards
  await expect(page.getByText('开始生成')).toBeVisible();
  await expect(page.getByText('我的历史')).toBeVisible();
  await expect(page.getByText('风格管理')).toBeVisible();
  // 3 entry buttons
  await expect(page.getByRole('link', { name: /开始/ }).or(page.getByRole('button', { name: /开始/ }))).toBeVisible();
  await expect(page.getByRole('link', { name: /查看/ }).or(page.getByRole('button', { name: /查看/ }))).toBeVisible();
  await expect(page.getByRole('link', { name: /管理/ }).or(page.getByRole('button', { name: /管理/ }))).toBeVisible();
});

test('gallery page loads and shows empty state when no history', async ({ page }) => {
  // Clear IndexedDB before test
  await page.goto('/');
  await page.evaluate(async () => {
    const dbs = await indexedDB.databases();
    await Promise.all(
      dbs.map(
        (db) =>
          new Promise<void>((resolve) => {
            if (!db.name) return resolve();
            const req = indexedDB.deleteDatabase(db.name);
            req.onsuccess = () => resolve();
            req.onerror = () => resolve();
            req.onblocked = () => resolve();
          }),
      ),
    );
  });
  await page.goto('/gallery');
  await expect(page.getByRole('heading', { name: '我的历史' })).toBeVisible();
  await expect(page.getByText('还没有生成记录')).toBeVisible();
});

test('styles admin page lists builtin preset', async ({ page }) => {
  await page.goto('/admin/styles');
  await expect(page.getByRole('heading', { name: '风格管理' })).toBeVisible();
  await expect(page.getByText('内置风格')).toBeVisible();
  await expect(page.getByText('亮黄美妆工作室')).toBeVisible();
  await expect(page.locator('text=/^内置$/').first()).toBeVisible();
  // Upload new preset link
  await expect(page.getByRole('link', { name: /上传新风格/ })).toBeVisible();
});

test('new preset wizard validates required fields', async ({ page }) => {
  await page.goto('/admin/presets/new');
  await expect(page.getByRole('heading', { name: '上传新风格' })).toBeVisible();
  // Save button is disabled when name/prompt are empty
  const saveButton = page.getByRole('button', { name: '保存风格' });
  await expect(saveButton).toBeDisabled();
  // Fill in name + prompt -> enabled
  await page.getByLabel('名称').fill('测试风格');
  await page.getByLabel('模板 Prompt（含占位符）').fill('A {{content}} hero shot, 4K, beautiful');
  await expect(saveButton).toBeEnabled();
});

test('wizard navigation: upload (file) -> palette -> product (gated)', async ({ page }) => {
  // 1) Home
  await page.goto('/');
  await page.getByRole('link', { name: /开始/ }).or(page.getByRole('button', { name: /开始/ })).click();
  await expect(page).toHaveURL(/\/generate\/upload$/);

  // 2) Upload a packaging image
  await page.setInputFiles('input[type=file]', 'public/templates/bright-yellow-cosmetic/feature.png');
  // Wait for thumbnail (alt = label of upload zone)
  await expect(page.locator('img[alt="包装图（推荐）"]')).toBeVisible({ timeout: 10_000 });

  // 3) Next -> palette
  await page.getByRole('button', { name: '下一步' }).click();
  await expect(page).toHaveURL(/\/generate\/palette$/);

  // The mock palette API has a 5% failure rate. Retry up to 5 times via
  // the "重新生成" button until a palette card appears.
  const chooseButton = page.locator('button:has-text("选择")').first();
  for (let attempt = 0; attempt < 5; attempt++) {
    if (await chooseButton.isVisible().catch(() => false)) break;
    const retry = page.getByRole('button', { name: '重新生成' });
    if (await retry.isVisible().catch(() => false)) {
      await retry.click();
    }
    await page.waitForTimeout(500);
  }
  await expect(chooseButton).toBeVisible({ timeout: 5_000 });
  await chooseButton.click();

  // 4) Next -> product
  await page.getByRole('button', { name: '下一步' }).click();
  await expect(page).toHaveURL(/\/generate\/product$/);

  // 5) Submit with empty form -> validation error
  await page.getByRole('button', { name: '保存并继续' }).click();
  await expect(page.getByText('产品名必填')).toBeVisible();
});
