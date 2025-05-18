# Test info

- Name: Services Page Tests >> Test S.2: Service Filtering >> Filter buttons correctly filter service items
- Location: /home/proxyie/MySoftware/MintWebsite/mint-detailing-website-tests/tests/servicesPage.spec.js:43:9

# Error details

```
Error: browserType.launch: 
╔══════════════════════════════════════════════════════╗
║ Host system is missing dependencies to run browsers. ║
║ Missing libraries:                                   ║
║     libicudata.so.66                                 ║
║     libicui18n.so.66                                 ║
║     libicuuc.so.66                                   ║
║     libxslt.so.1                                     ║
║     libwoff2dec.so.1.0.2                             ║
║     libopus.so.0                                     ║
║     libwebpdemux.so.2                                ║
║     libharfbuzz-icu.so.0                             ║
║     libwebpmux.so.3                                  ║
║     libwebp.so.6                                     ║
║     libenchant-2.so.2                                ║
║     libhyphen.so.0                                   ║
║     libgudev-1.0.so.0                                ║
║     libffi.so.7                                      ║
║     libevdev.so.2                                    ║
║     libx264.so                                       ║
╚══════════════════════════════════════════════════════╝
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
>  43 |     test('Filter buttons correctly filter service items', async ({ page }) => {
      |         ^ Error: browserType.launch: 
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
   77 |     test('Service cards contain required elements', async ({ page }) => {
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
```