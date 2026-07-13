import { test } from '@playwright/test';

test.describe('frontend-polish screenshots', () => {
  test('capture 4 polish screenshots', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    const targets = [
      ['/', 'polish-01-home.png'],
      ['/gallery', 'polish-02-gallery.png'],
      ['/admin/styles', 'polish-03-admin-styles.png'],
      ['/admin/presets/new', 'polish-04-admin-new.png'],
    ];

    for (const [path, file] of targets) {
      await page.goto(path, { waitUntil: 'networkidle' });
      // Apple-like settle delay for hero animations
      await page.waitForTimeout(800);
      await page.screenshot({ path: `screenshots/${file}`, fullPage: false });
      console.log(`captured ${file}`);
    }
  });
});
