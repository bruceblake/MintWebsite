# Test info

- Name: Services Page Tests >> Test S.5: Custom Services Section >> Custom services section contains correct elements
- Location: /home/proxyie/MySoftware/MintWebsite/mint-detailing-website-tests/tests/servicesPage.spec.js:258:9

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
  238 |       // Verify "What's Included" list if it exists
  239 |       const includedList = exteriorService.locator('ul.includes-list');
  240 |       if (await includedList.count() > 0) {
  241 |         const listItems = includedList.locator('li');
  242 |         const itemCount = await listItems.count();
  243 |         expect(itemCount).toBeGreaterThan(0);
  244 |         
  245 |         // Check commonly included services
  246 |         const itemTexts = await listItems.allTextContents();
  247 |         const combinedText = itemTexts.join(' ').toLowerCase();
  248 |         
  249 |         // Exterior service should mention at least one of these common terms
  250 |         const commonTerms = ['wash', 'polish', 'wax', 'clay', 'wheel', 'tire', 'shine'];
  251 |         const hasCommonTerm = commonTerms.some(term => combinedText.includes(term));
  252 |         expect(hasCommonTerm).toBeTruthy();
  253 |       }
  254 |     });
  255 |   });
  256 |   
  257 |   test.describe('Test S.5: Custom Services Section', () => {
> 258 |     test('Custom services section contains correct elements', async ({ page }) => {
      |         ^ Error: browserType.launch: 
  259 |       // Find the custom services section - it's a regular section with Custom Detailing Solutions
  260 |       const customSection = page.locator('section').filter({ hasText: 'Custom Detailing Solutions' });
  261 |       await expect(customSection).toBeVisible();
  262 |       
  263 |       // Verify heading
  264 |       const heading = customSection.locator('h2');
  265 |       await expect(heading).toBeVisible();
  266 |       await expect(heading).toContainText(/Custom|Special/i);
  267 |       
  268 |       // Verify description
  269 |       const description = customSection.locator('p');
  270 |       await expect(description).toBeVisible();
  271 |       
  272 |       // Verify "Get Custom Quote" button exists
  273 |       const quoteButton = customSection.locator('a.btn', { hasText: /Quote|Contact/i });
  274 |       await expect(quoteButton).toBeVisible();
  275 |       
  276 |       // Verify button links to quote or contact page
  277 |       const buttonHref = await quoteButton.getAttribute('href');
  278 |       expect(buttonHref).toMatch(/quote|contact/);
  279 |     });
  280 |   });
  281 |   
  282 |   test.describe('Test S.6: CTA Section', () => {
  283 |     test('CTA section contains correct elements and links', async ({ page }) => {
  284 |       // Find the CTA section - it's a regular section with CTA content
  285 |       const ctaSection = page.locator('section').filter({ hasText: 'Ready to Experience the Mint Difference?' });
  286 |       await expect(ctaSection).toBeVisible();
  287 |       
  288 |       // Verify heading
  289 |       const heading = ctaSection.locator('h2');
  290 |       await expect(heading).toBeVisible();
  291 |       
  292 |       // Verify CTA buttons exist
  293 |       const ctaButtons = ctaSection.locator('a.btn');
  294 |       expect(await ctaButtons.count()).toBeGreaterThan(0);
  295 |       
  296 |       // Verify at least one button links to the quote page
  297 |       const quoteButton = ctaSection.locator('a.btn', { hasText: /Quote|Book|Schedule/i });
  298 |       if (await quoteButton.count() > 0) {
  299 |         await expect(quoteButton).toBeVisible();
  300 |         const buttonHref = await quoteButton.getAttribute('href');
  301 |         expect(buttonHref).toMatch(/quote|contact|booking/);
  302 |       }
  303 |     });
  304 |   });
  305 | });
```