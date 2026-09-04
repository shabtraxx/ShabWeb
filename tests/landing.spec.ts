import { test, expect } from '@playwright/test';

test.describe('landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has exactly one h1 and a descriptive title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page).toHaveTitle(/Shab/);

    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', /.{80,}/);
  });

  test('renders the three practices', async ({ page }) => {
    for (const name of ['Digital', 'Data', 'Cyber']) {
      await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
    }
  });

  test('every in-page anchor points at a section that exists', async ({ page }) => {
    const hrefs = await page.locator('a[href^="#"]').evaluateAll((links) =>
      links.map((link) => link.getAttribute('href')!).filter((href) => href.length > 1),
    );
    expect(hrefs.length).toBeGreaterThan(0);

    for (const href of new Set(hrefs)) {
      await expect(page.locator(href), `target for ${href}`).toHaveCount(1);
    }
  });

  test('no placeholder value leaks into a link target', async ({ page }) => {
    const targets = await page.locator('a[href]').evaluateAll((links) =>
      links.map((link) => link.getAttribute('href')!),
    );
    for (const href of targets) {
      expect(href, 'href should not contain an unfilled placeholder').not.toMatch(/\[[A-Z]/);
    }
  });

  test('loads nothing from a third-party host', async ({ page }) => {
    const external: string[] = [];
    page.on('request', (request) => {
      const url = new URL(request.url());
      if (url.hostname !== 'localhost' && url.protocol !== 'data:') {
        external.push(request.url());
      }
    });
    await page.reload({ waitUntil: 'networkidle' });
    expect(external, 'the page must be self-contained').toEqual([]);
  });

  test('does not scroll sideways', async ({ page }) => {
    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(overflows).toBe(false);
  });

  test('canonical and Open Graph URLs use the real domain', async ({ page }) => {
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');

    for (const url of [canonical, ogUrl]) {
      expect(url, 'metadata URL').toBeTruthy();
      expect(url, 'placeholder domain must not ship').not.toContain('example.com');
      expect(new URL(url!).origin).toBe('https://shab.com.au');
    }
  });

  test('the booking call to action is reachable', async ({ page }) => {
    const cta = page.getByRole('link', { name: /book a 30-minute call/i }).first();
    await expect(cta).toBeVisible();
  });
});

test.describe('footer business details', () => {
  test('shows the ABN and locality, not placeholders', async ({ page }) => {
    await page.goto('/');

    const legal = page.locator('.footer__legal');
    await expect(legal).toContainText('Adelaide, South Australia');
    await expect(legal).toContainText('ABN 45 074 849 006');
    await expect(legal, 'no bracketed placeholder should survive').not.toContainText('[');
  });
});

test.describe('privacy page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/privacy');
  });

  test('states who we are and names the host', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: 'Privacy' })).toBeVisible();

    const body = page.locator('.prose');
    await expect(body).toContainText('ABN 45 074 849 006');
    await expect(body).toContainText('Privacy Act 1988 (Cth)');
    await expect(body, 'the host receives visitor data and must be named').toContainText(
      'Cloudflare',
    );
    await expect(body, 'overseas disclosure must be stated').toContainText('outside Australia');
    await expect(body, 'every overseas recipient must be named').toContainText('Microsoft');
    await expect(body, 'the email path must be described').toContainText('Cloudflare Email Routing');
    await expect(body, 'no provider should be left generic').not.toContainText('our email provider');
  });

  test('carries a last-updated date', async ({ page }) => {
    await expect(page.locator('.prose__updated')).toContainText(/Last updated \d{1,2} \w+ \d{4}\./);
  });

  test('does not tell readers it is unreviewed, and has no placeholders', async ({ page }) => {
    const body = page.locator('.prose');
    await expect(body, 'the owner-facing caveat belongs in the source').not.toContainText(
      'not legal advice',
    );
    await expect(body).not.toContainText('[');
  });
});

test.describe('mobile navigation', () => {
  test.skip(({ isMobile }) => !isMobile, 'only present at narrow widths');

  test('opens, reports its state, and closes on selection', async ({ page }) => {
    await page.goto('/');

    const toggle = page.locator('[data-nav-toggle]');
    const panel = page.locator('#mobile-nav');

    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(panel).toBeHidden();

    const box = await toggle.boundingBox();
    expect(box!.width, 'hit target width').toBeGreaterThanOrEqual(44);
    expect(box!.height, 'hit target height').toBeGreaterThanOrEqual(44);

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(panel).toBeVisible();

    await panel.getByRole('link', { name: 'How we work' }).click();
    await expect(panel).toBeHidden();
    await expect(page).toHaveURL(/#how-we-work$/);
  });
});

test.describe('keyboard access', () => {
  test.skip(({ isMobile }) => isMobile, 'pointer-first on mobile');

  test('the first tab stop is the skip link', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.textContent?.trim());
    expect(focused).toBe('Skip to content');
  });

  test('the hidden mobile panel stays out of the tab order', async ({ page }) => {
    await page.goto('/');
    const reachable = await page.evaluate(() => {
      const panel = document.querySelector('#mobile-nav') as HTMLElement;
      return panel.hidden === false;
    });
    expect(reachable).toBe(false);
  });
});
