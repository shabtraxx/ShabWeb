import { test, expect } from '@playwright/test';

/**
 * The og:image once pointed at a file that did not exist, so every link
 * preview rendered a broken card. These assert the declaration and the file
 * agree — which is the failure that actually shipped.
 */
test.describe('social share card', () => {
  test('og:image is declared and the file exists', async ({ page, request }) => {
    await page.goto('/');

    const declared = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(declared, 'og:image must be declared').toBeTruthy();

    // The declaration is absolute against the production origin; fetch the
    // same path from whatever host the tests are running against.
    const path = new URL(declared!).pathname;
    const response = await request.get(path);

    expect(response.status(), `${path} should be served, not 404`).toBe(200);
    expect(response.headers()['content-type']).toContain('image');
  });

  test('the card is a valid PNG at the size the platforms expect', async ({ request }) => {
    const response = await request.get('/og.png');
    const bytes = await response.body();

    // PNG signature, then width and height as big-endian uint32 in the IHDR.
    expect(bytes.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    expect(bytes.readUInt32BE(16), 'width').toBe(1200);
    expect(bytes.readUInt32BE(20), 'height').toBe(630);

    // Facebook and LinkedIn both refuse images over 8MB.
    expect(bytes.length).toBeLessThan(8 * 1024 * 1024);
  });
});
