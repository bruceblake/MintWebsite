# Test info

- Name: Core Navigation & Page Accessibility >> Test 1.4: Logo Link to Homepage
- Location: /home/proxyie/MySoftware/MintWebsite/mint-detailing-website-tests/tests/navigation.spec.js:72:3

# Error details

```
Error: browserType.launch: Executable doesn't exist at /home/proxyie/.cache/ms-playwright/chromium_headless_shell-1169/chrome-linux/headless_shell
╔═════════════════════════════════════════════════════════════════════════╗
║ Looks like Playwright Test or Playwright was just installed or updated. ║
║ Please run the following command to download new browsers:              ║
║                                                                         ║
║     npx playwright install                                              ║
║                                                                         ║
║ <3 Playwright Team                                                      ║
╚═════════════════════════════════════════════════════════════════════════╝
```

# Test source

```ts
   1 | // @ts-check
   2 | const { test, expect } = require('@playwright/test');
   3 |
   4 | /**
   5 |  * Navigation tests for Mint Detailing website
   6 |  * Tests navigation links, page loading, and basic accessibility
   7 |  */
   8 | test.describe('Core Navigation & Page Accessibility', () => {
   9 |   test.beforeEach(async ({ page }) => {
  10 |     // Navigate to the homepage before each test
  11 |     await page.goto('/');
  12 |   });
  13 |
  14 |   test('Test 1.1: Load Homepage', async ({ page }) => {
  15 |     // Verify page title
  16 |     await expect(page).toHaveTitle(/Mint Detailing/);
  17 |     
  18 |     // Verify hero title is present
  19 |     const heroTitle = page.locator('[data-testid="hero-title"]');
  20 |     await expect(heroTitle).toBeVisible();
  21 |     await expect(heroTitle).toContainText('Experience Perfection');
  22 |   });
  23 |
  24 |   test('Test 1.2: Header Navigation Links', async ({ page }) => {
  25 |     // Test each navigation link
  26 |     const navLinks = [
  27 |       { testId: 'nav-about', path: '/about.html', expectedElement: 'h1', expectedText: 'About Mint' },
  28 |       { testId: 'nav-services', path: '/services.html', expectedElement: 'h1', expectedText: 'Our Services' },
  29 |       { testId: 'nav-gallery', path: '/gallery.html', expectedElement: '[data-testid="gallery-heading"]', expectedText: 'Photo Gallery' },
  30 |       { testId: 'nav-testimonials', path: '/testimonials.html', expectedElement: 'h1', expectedText: 'Customer Testimonials' },
  31 |       { testId: 'nav-service-area', path: '/service-area.html', expectedElement: 'h1', expectedText: 'Our Service Area' },
  32 |       { testId: 'nav-quote', path: '/quote.html', expectedElement: '[data-testid="form-title"]', expectedText: 'Request a Quote' }
  33 |     ];
  34 |
  35 |     for (const link of navLinks) {
  36 |       // Click the navigation link
  37 |       await page.locator(`[data-testid="${link.testId}"]`).click();
  38 |       
  39 |       // Verify URL change
  40 |       await expect(page).toHaveURL(new RegExp(link.path));
  41 |       
  42 |       // Verify expected content on the page
  43 |       const element = page.locator(link.expectedElement);
  44 |       await expect(element).toBeVisible();
  45 |       await expect(element).toContainText(link.expectedText);
  46 |       
  47 |       // Go back to the homepage for the next test
  48 |       await page.goto('/');
  49 |     }
  50 |   });
  51 |
  52 |   test('Test 1.3: Footer Navigation Links (Basic)', async ({ page }) => {
  53 |     // Test a few key footer links
  54 |     const footerLinks = [
  55 |       { text: 'Home', path: 'index.html' },
  56 |       { text: 'Services', path: 'services.html' },
  57 |       { text: 'Get a Quote', path: 'quote.html' }
  58 |     ];
  59 |
  60 |     for (const link of footerLinks) {
  61 |       // Find the link by its text content within the footer
  62 |       await page.locator('.footer').getByText(link.text).first().click();
  63 |       
  64 |       // Verify URL change
  65 |       await expect(page).toHaveURL(new RegExp(link.path));
  66 |       
  67 |       // Go back to the homepage for the next test
  68 |       await page.goto('/');
  69 |     }
  70 |   });
  71 |
> 72 |   test('Test 1.4: Logo Link to Homepage', async ({ page }) => {
     |   ^ Error: browserType.launch: Executable doesn't exist at /home/proxyie/.cache/ms-playwright/chromium_headless_shell-1169/chrome-linux/headless_shell
  73 |     // First navigate to a sub-page
  74 |     await page.goto('/about.html');
  75 |     
  76 |     // Verify we're on the about page
  77 |     await expect(page).toHaveURL(/about.html/);
  78 |     
  79 |     // Click the logo
  80 |     await page.locator('[data-testid="logo"]').click();
  81 |     
  82 |     // Verify we're back on the homepage
  83 |     await expect(page).toHaveURL(/^\/$|index.html$/);
  84 |     
  85 |     // Verify hero section is visible (which is only on the homepage)
  86 |     await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
  87 |   });
  88 | });
```