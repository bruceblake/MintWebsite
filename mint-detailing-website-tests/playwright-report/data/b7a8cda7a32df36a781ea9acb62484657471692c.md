# Test info

- Name: Services Page Tests >> Test S.3: Service Cards Content >> Service cards contain required elements
- Location: /home/proxyie/MySoftware/MintWebsite/mint-detailing-website-tests/tests/servicesPage.spec.js:77:9

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
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Services Page Tests', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     // Navigate to the services page before each test
   6 |     await page.goto('/services');
   7 |     
   8 |     // Wait for the main content to load completely
   9 |     await page.waitForSelector('.service-category-section', { state: 'visible' });
   10 |   });
   11 |   
   12 |   test.describe('Test S.1: Services Page Structure', () => {
   13 |     test('Services page has correct title and structure', async ({ page }) => {
   14 |       // Verify page title
   15 |       const title = page.locator('h1');
   16 |       await expect(title).toBeVisible();
   17 |       await expect(title).toContainText('Our Detailing Services');
   18 |       
   19 |       // Verify services introduction exists with unique testid
   20 |       const servicesIntro = page.locator('[data-testid="services-page-intro"]');
   21 |       await expect(servicesIntro).toBeVisible();
   22 |       
   23 |       // Verify filter buttons exist
   24 |       const filterButtons = page.locator('.service-category-btn');
   25 |       const filterCount = await filterButtons.count();
   26 |       expect(filterCount).toBeGreaterThanOrEqual(3); // At least All, Interior, Exterior filters
   27 |       
   28 |       // Verify service sections exist
   29 |       const serviceSection = page.locator('.service-category-section');
   30 |       await expect(serviceSection.first()).toBeVisible();
   31 |       
   32 |       // Verify custom services section exists - it's a regular section with the custom content
   33 |       const customServices = page.locator('section').filter({ hasText: 'Custom Detailing Solutions' });
   34 |       await expect(customServices).toBeVisible();
   35 |       
   36 |       // Verify CTA section exists - it's a regular section with CTA content
   37 |       const ctaSection = page.locator('section').filter({ hasText: 'Ready to Experience the Mint Difference?' });
   38 |       await expect(ctaSection).toBeVisible();
   39 |     });
   40 |   });
   41 |   
   42 |   test.describe('Test S.2: Service Filtering', () => {
   43 |     test('Filter buttons correctly filter service items', async ({ page }) => {
   44 |       // Get initial count of all service items
   45 |       const allItems = page.locator('.service-item');
   46 |       const initialItemCount = await allItems.count();
   47 |       expect(initialItemCount).toBeGreaterThan(0);
   48 |       
   49 |       // Test each filter category
   50 |       const categories = ['interior', 'exterior', 'protection'];
   51 |       
   52 |       for (const category of categories) {
   53 |         // Find and click the filter button
   54 |         const filterBtn = page.locator(`.service-category-btn[data-category="${category}"]`);
   55 |         if (await filterBtn.count() === 0) continue;
   56 |         
   57 |         await filterBtn.click();
   58 |         
   59 |         // Wait for filtering animation to complete
   60 |         await page.waitForTimeout(500);
   61 |         
   62 |         // Verify only items with matching category are visible
   63 |         const visibleItems = page.locator(`.service-item:not(.hidden)`);
   64 |         const categoryItems = page.locator(`.service-item[data-category*="${category}"]:not(.hidden)`);
   65 |         
   66 |         expect(await visibleItems.count()).toBe(await categoryItems.count());
   67 |         
   68 |         // Return to "all" filter to reset for next test
   69 |         const allFilterBtn = page.locator('.service-category-btn[data-category="all"]');
   70 |         await allFilterBtn.click();
   71 |         await page.waitForTimeout(500);
   72 |       }
   73 |     });
   74 |   });
   75 |   
   76 |   test.describe('Test S.3: Service Cards Content', () => {
>  77 |     test('Service cards contain required elements', async ({ page }) => {
      |         ^ Error: browserType.launch: Executable doesn't exist at /home/proxyie/.cache/ms-playwright/firefox-1482/firefox/firefox
   78 |       // Get all service items
   79 |       const serviceItems = page.locator('.service-item');
   80 |       const itemCount = await serviceItems.count();
   81 |       
   82 |       // Check at least 3 service cards (or all if fewer than 3)
   83 |       const cardsToCheck = Math.min(itemCount, 3);
   84 |       
   85 |       for (let i = 0; i < cardsToCheck; i++) {
   86 |         const serviceItem = serviceItems.nth(i);
   87 |         
   88 |         // Check service image
   89 |         const serviceImage = serviceItem.locator('.service-item-image');
   90 |         await expect(serviceImage).toBeVisible();
   91 |         
   92 |         // Check image src
   93 |         const img = serviceImage.locator('img');
   94 |         const imgSrc = await img.getAttribute('src');
   95 |         expect(imgSrc).toBeTruthy();
   96 |         
   97 |         // Check image alt text
   98 |         const imgAlt = await img.getAttribute('alt');
   99 |         expect(imgAlt).toBeTruthy();
  100 |         
  101 |         // Check service name
  102 |         const serviceName = serviceItem.locator('h3');
  103 |         await expect(serviceName).toBeVisible();
  104 |         const nameText = await serviceName.textContent();
  105 |         expect(nameText?.trim().length).toBeGreaterThan(0);
  106 |         
  107 |         // Check service description
  108 |         const serviceDesc = serviceItem.locator('p.service-description');
  109 |         await expect(serviceDesc).toBeVisible();
  110 |         
  111 |         // Check included list if it exists
  112 |         const includedList = serviceItem.locator('ul.includes-list');
  113 |         if (await includedList.count() > 0) {
  114 |           await expect(includedList).toBeVisible();
  115 |           
  116 |           // Check for at least one list item
  117 |           const listItems = includedList.locator('li');
  118 |           expect(await listItems.count()).toBeGreaterThan(0);
  119 |         }
  120 |         
  121 |         // Check price
  122 |         const servicePrice = serviceItem.locator('.service-price');
  123 |         await expect(servicePrice).toBeVisible();
  124 |         const priceText = await servicePrice.textContent();
  125 |         expect(priceText).toMatch(/\$\d+/); // Verify price contains a dollar amount
  126 |         
  127 |         // Check "Book This Service" button
  128 |         const bookButton = serviceItem.locator('a.btn', { hasText: /Book|Quote/ });
  129 |         await expect(bookButton).toBeVisible();
  130 |         
  131 |         // Verify button links to quote page
  132 |         const bookHref = await bookButton.getAttribute('href');
  133 |         expect(bookHref).toContain('quote');
  134 |       }
  135 |     });
  136 |     
  137 |     test('Service prices are displayed correctly', async ({ page }) => {
  138 |       // Get all service items
  139 |       const serviceItems = page.locator('.service-item');
  140 |       const itemCount = await serviceItems.count();
  141 |       
  142 |       // Check at least 3 service cards (or all if fewer than 3)
  143 |       const cardsToCheck = Math.min(itemCount, 3);
  144 |       
  145 |       for (let i = 0; i < cardsToCheck; i++) {
  146 |         const serviceItem = serviceItems.nth(i);
  147 |         
  148 |         // Check price format
  149 |         const servicePrice = serviceItem.locator('.service-price');
  150 |         await expect(servicePrice).toBeVisible();
  151 |         
  152 |         const priceText = await servicePrice.textContent();
  153 |         
  154 |         // Price should either:
  155 |         // 1. Match "Starting at: $X" format
  156 |         // 2. Match "Starting at: $X-$Y" format for range pricing
  157 |         // 3. Contain other pricing text containing a dollar sign
  158 |         expect(
  159 |           priceText?.match(/Starting at: \$\d+/) !== null ||
  160 |           priceText?.match(/Starting at: \$\d+\s*-\s*\$\d+/) !== null ||
  161 |           priceText?.match(/\$\d+/) !== null
  162 |         ).toBeTruthy();
  163 |       }
  164 |     });
  165 |   });
  166 |   
  167 |   test.describe('Test S.4: Verifying Specific Services', () => {
  168 |     test('Interior detailing service is listed with correct details', async ({ page }) => {
  169 |       // Find the Interior Detailing service
  170 |       const interiorService = page.locator('.service-item', { has: page.locator('h3', { hasText: /Interior Detailing/i }) });
  171 |       
  172 |       // Skip if this specific service isn't in this deployment
  173 |       if (await interiorService.count() === 0) {
  174 |         test.skip();
  175 |         return;
  176 |       }
  177 |       
```