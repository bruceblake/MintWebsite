# Test info

- Name: Services Page Tests >> Test S.3: Service Cards Content >> Service prices are displayed correctly
- Location: /home/proxyie/MySoftware/MintWebsite/mint-detailing-website-tests/tests/servicesPage.spec.js:137:9

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
> 137 |     test('Service prices are displayed correctly', async ({ page }) => {
      |         ^ Error: browserType.launch: Executable doesn't exist at /home/proxyie/.cache/ms-playwright/chromium_headless_shell-1169/chrome-linux/headless_shell
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
  178 |       await expect(interiorService).toBeVisible();
  179 |       
  180 |       // Verify service name
  181 |       const serviceName = interiorService.locator('h3');
  182 |       await expect(serviceName).toContainText(/Interior Detailing/i);
  183 |       
  184 |       // Verify service has a description
  185 |       const serviceDesc = interiorService.locator('p.service-description');
  186 |       await expect(serviceDesc).toBeVisible();
  187 |       
  188 |       // Verify service has a price
  189 |       const servicePrice = interiorService.locator('.service-price');
  190 |       await expect(servicePrice).toBeVisible();
  191 |       const priceText = await servicePrice.textContent();
  192 |       expect(priceText).toMatch(/\$\d+/);
  193 |       
  194 |       // Verify "What's Included" list if it exists
  195 |       const includedList = interiorService.locator('ul.includes-list');
  196 |       if (await includedList.count() > 0) {
  197 |         const listItems = includedList.locator('li');
  198 |         const itemCount = await listItems.count();
  199 |         expect(itemCount).toBeGreaterThan(0);
  200 |         
  201 |         // Check commonly included services like vacuum and cleaning
  202 |         const itemTexts = await listItems.allTextContents();
  203 |         const combinedText = itemTexts.join(' ').toLowerCase();
  204 |         
  205 |         // Interior service should mention at least one of these common terms
  206 |         const commonTerms = ['vacuum', 'clean', 'dust', 'wipe', 'dashboard', 'seats', 'carpet'];
  207 |         const hasCommonTerm = commonTerms.some(term => combinedText.includes(term));
  208 |         expect(hasCommonTerm).toBeTruthy();
  209 |       }
  210 |     });
  211 |     
  212 |     test('Exterior detailing service is listed with correct details', async ({ page }) => {
  213 |       // Find the main Exterior Detailing service using the unique data-testid
  214 |       const exteriorService = page.locator('[data-testid="exterior-detailing-main"]');
  215 |       
  216 |       // Skip if this specific service isn't in this deployment
  217 |       if (await exteriorService.count() === 0) {
  218 |         test.skip();
  219 |         return;
  220 |       }
  221 |       
  222 |       await expect(exteriorService).toBeVisible();
  223 |       
  224 |       // Verify service name
  225 |       const serviceName = exteriorService.locator('h3');
  226 |       await expect(serviceName).toBeVisible();
  227 |       
  228 |       // Verify service has a description
  229 |       const serviceDesc = exteriorService.locator('p.service-description');
  230 |       await expect(serviceDesc).toBeVisible();
  231 |       
  232 |       // Verify service has a price
  233 |       const servicePrice = exteriorService.locator('.service-price');
  234 |       await expect(servicePrice).toBeVisible();
  235 |       const priceText = await servicePrice.textContent();
  236 |       expect(priceText).toMatch(/\$\d+/);
  237 |       
```