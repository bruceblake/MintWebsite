# Test info

- Name: Basic Responsiveness >> Test 4.1: Mobile Menu Toggling
- Location: /home/proxyie/MySoftware/MintWebsite/mint-detailing-website-tests/tests/responsiveness.spec.js:9:3

# Error details

```
Error: browserType.launch: Executable doesn't exist at /home/proxyie/.cache/ms-playwright/firefox-1482/firefox/firefox
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
   5 |  * Tests for responsive design behavior
   6 |  * Verifies mobile menu functionality and responsive layout
   7 |  */
   8 | test.describe('Basic Responsiveness', () => {
>  9 |   test('Test 4.1: Mobile Menu Toggling', async ({ page }) => {
     |   ^ Error: browserType.launch: Executable doesn't exist at /home/proxyie/.cache/ms-playwright/firefox-1482/firefox/firefox
   10 |     // Set viewport to mobile size
   11 |     await page.setViewportSize({ width: 375, height: 667 });
   12 |     
   13 |     // Navigate to the homepage
   14 |     await page.goto('/');
   15 |     
   16 |     // Verify that main desktop navigation links are NOT visible
   17 |     // (We check for presence but hidden/collapsed state)
   18 |     const navMenu = page.locator('[data-testid="nav-menu"]');
   19 |     
   20 |     // The menu itself might be present in DOM but not visible/expanded
   21 |     await expect(navMenu).toBeVisible(); // The container is visible
   22 |     
   23 |     // But individual nav items should be hidden or collapsed
   24 |     // This test may need to be adjusted based on how the mobile menu is implemented
   25 |     // Some sites hide items with CSS, others have a mobile-specific menu that's initially hidden
   26 |     
   27 |     // Verify mobile menu toggle button is visible
   28 |     const menuToggle = page.locator('[data-testid="mobile-menu-toggle"]');
   29 |     await expect(menuToggle).toBeVisible();
   30 |     
   31 |     // Click the mobile menu toggle button
   32 |     await menuToggle.click();
   33 |     
   34 |     // Wait for animation to complete (if any)
   35 |     await page.waitForTimeout(300);
   36 |     
   37 |     // Verify the mobile navigation menu becomes visible
   38 |     // This test assumes that clicking the toggle adds a class 'active' to the nav-menu
   39 |     // Adjust the selector based on actual implementation
   40 |     await expect(navMenu).toHaveClass(/active/);
   41 |     
   42 |     // Click the toggle button again
   43 |     await menuToggle.click();
   44 |     
   45 |     // Wait for animation to complete (if any)
   46 |     await page.waitForTimeout(300);
   47 |     
   48 |     // Verify the mobile navigation menu is hidden again
   49 |     await expect(navMenu).not.toHaveClass(/active/);
   50 |   });
   51 |
   52 |   test('Test 4.2: No Horizontal Scroll on Mobile (Homepage)', async ({ page }) => {
   53 |     // Set viewport to mobile size
   54 |     await page.setViewportSize({ width: 375, height: 667 });
   55 |     
   56 |     // Navigate to the homepage
   57 |     await page.goto('/');
   58 |     
   59 |     // Wait for any CSS animations to complete
   60 |     await page.waitForTimeout(500);
   61 |     
   62 |     // Check if horizontal scrollbar is present by comparing document width to viewport width
   63 |     const isHorizontalScrollPresent = await page.evaluate(() => {
   64 |       return document.body.scrollWidth > window.innerWidth;
   65 |     });
   66 |     
   67 |     // Assert that there is no horizontal scrollbar
   68 |     expect(isHorizontalScrollPresent).toBe(false);
   69 |   });
   70 |
   71 |   test('Test 4.3: Key Elements Visibility on Mobile', async ({ page }) => {
   72 |     // Set viewport to mobile size
   73 |     await page.setViewportSize({ width: 375, height: 667 });
   74 |     
   75 |     // Navigate to the homepage
   76 |     await page.goto('/');
   77 |     
   78 |     // Check that key elements are visible on mobile
   79 |     const keyElements = [
   80 |       { selector: '[data-testid="logo"]', description: 'Logo' },
   81 |       { selector: '[data-testid="hero-title"]', description: 'Hero Title' },
   82 |       { selector: '[data-testid="hero-quote-btn"]', description: 'Quote Button' }
   83 |     ];
   84 |     
   85 |     for (const element of keyElements) {
   86 |       await expect(page.locator(element.selector)).toBeVisible();
   87 |     }
   88 |     
   89 |     // Navigate to the quote page
   90 |     await page.goto('/quote.html');
   91 |     
   92 |     // Check that form elements are properly visible on mobile
   93 |     const formElements = [
   94 |       { selector: '[data-testid="form-title"]', description: 'Form Title' },
   95 |       { selector: '[data-testid="input-name"]', description: 'Name Input' },
   96 |       { selector: '[data-testid="input-email"]', description: 'Email Input' },
   97 |       { selector: '[data-testid="input-phone"]', description: 'Phone Input' },
   98 |       { selector: '[data-testid="submit-button"]', description: 'Submit Button' }
   99 |     ];
  100 |     
  101 |     for (const element of formElements) {
  102 |       await expect(page.locator(element.selector)).toBeVisible();
  103 |     }
  104 |   });
  105 | });
```