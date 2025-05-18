import { test, expect } from '@playwright/test';

test.describe('Services Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the services page before each test
    await page.goto('/services');
    
    // Wait for the main content to load completely
    await page.waitForSelector('.service-grid', { state: 'visible' });
  });
  
  test.describe('Test S.1: Services Page Structure', () => {
    test('Services page has correct title and structure', async ({ page }) => {
      // Verify page title
      const title = page.locator('h1');
      await expect(title).toBeVisible();
      await expect(title).toContainText('Our Detailing Services');
      
      // Verify services introduction exists
      const servicesIntro = page.locator('.services-intro');
      await expect(servicesIntro).toBeVisible();
      
      // Verify filter buttons exist
      const filterButtons = page.locator('.service-filter-btn');
      const filterCount = await filterButtons.count();
      expect(filterCount).toBeGreaterThanOrEqual(3); // At least All, Interior, Exterior filters
      
      // Verify service grid exists
      const serviceGrid = page.locator('.service-grid');
      await expect(serviceGrid).toBeVisible();
      
      // Verify custom services section exists
      const customServices = page.locator('.custom-services');
      await expect(customServices).toBeVisible();
      
      // Verify CTA section exists
      const ctaSection = page.locator('.cta-section');
      await expect(ctaSection).toBeVisible();
    });
  });
  
  test.describe('Test S.2: Service Filtering', () => {
    test('Filter buttons correctly filter service items', async ({ page }) => {
      // Get initial count of all service items
      const allItems = page.locator('.service-item');
      const initialItemCount = await allItems.count();
      expect(initialItemCount).toBeGreaterThan(0);
      
      // Test each filter category
      const categories = ['interior', 'exterior', 'protection'];
      
      for (const category of categories) {
        // Find and click the filter button
        const filterBtn = page.locator(`.service-filter-btn[data-filter="${category}"]`);
        if (await filterBtn.count() === 0) continue;
        
        await filterBtn.click();
        
        // Wait for filtering animation to complete
        await page.waitForTimeout(500);
        
        // Verify only items with matching category are visible
        const visibleItems = page.locator(`.service-item:not(.hidden)`);
        const categoryItems = page.locator(`.service-item[data-category*="${category}"]:not(.hidden)`);
        
        expect(await visibleItems.count()).toBe(await categoryItems.count());
        
        // Return to "all" filter to reset for next test
        const allFilterBtn = page.locator('.service-filter-btn[data-filter="all"]');
        await allFilterBtn.click();
        await page.waitForTimeout(500);
      }
    });
  });
  
  test.describe('Test S.3: Service Cards Content', () => {
    test('Service cards contain required elements', async ({ page }) => {
      // Get all service items
      const serviceItems = page.locator('.service-item');
      const itemCount = await serviceItems.count();
      
      // Check at least 3 service cards (or all if fewer than 3)
      const cardsToCheck = Math.min(itemCount, 3);
      
      for (let i = 0; i < cardsToCheck; i++) {
        const serviceItem = serviceItems.nth(i);
        
        // Check service image
        const serviceImage = serviceItem.locator('.service-item-image');
        await expect(serviceImage).toBeVisible();
        
        // Check image src
        const img = serviceImage.locator('img');
        const imgSrc = await img.getAttribute('src');
        expect(imgSrc).toBeTruthy();
        
        // Check image alt text
        const imgAlt = await img.getAttribute('alt');
        expect(imgAlt).toBeTruthy();
        
        // Check service name
        const serviceName = serviceItem.locator('h3');
        await expect(serviceName).toBeVisible();
        const nameText = await serviceName.textContent();
        expect(nameText?.trim().length).toBeGreaterThan(0);
        
        // Check service description
        const serviceDesc = serviceItem.locator('p.service-description');
        await expect(serviceDesc).toBeVisible();
        
        // Check included list if it exists
        const includedList = serviceItem.locator('ul.includes-list');
        if (await includedList.count() > 0) {
          await expect(includedList).toBeVisible();
          
          // Check for at least one list item
          const listItems = includedList.locator('li');
          expect(await listItems.count()).toBeGreaterThan(0);
        }
        
        // Check price
        const servicePrice = serviceItem.locator('.service-price');
        await expect(servicePrice).toBeVisible();
        const priceText = await servicePrice.textContent();
        expect(priceText).toMatch(/\$\d+/); // Verify price contains a dollar amount
        
        // Check "Book This Service" button
        const bookButton = serviceItem.locator('a.btn', { hasText: /Book|Quote/ });
        await expect(bookButton).toBeVisible();
        
        // Verify button links to quote page
        const bookHref = await bookButton.getAttribute('href');
        expect(bookHref).toContain('quote');
      }
    });
    
    test('Service prices are displayed correctly', async ({ page }) => {
      // Get all service items
      const serviceItems = page.locator('.service-item');
      const itemCount = await serviceItems.count();
      
      // Check at least 3 service cards (or all if fewer than 3)
      const cardsToCheck = Math.min(itemCount, 3);
      
      for (let i = 0; i < cardsToCheck; i++) {
        const serviceItem = serviceItems.nth(i);
        
        // Check price format
        const servicePrice = serviceItem.locator('.service-price');
        await expect(servicePrice).toBeVisible();
        
        const priceText = await servicePrice.textContent();
        
        // Price should either:
        // 1. Match "Starting at: $X" format
        // 2. Match "Starting at: $X-$Y" format for range pricing
        // 3. Contain other pricing text containing a dollar sign
        expect(
          priceText?.match(/Starting at: \$\d+/) !== null ||
          priceText?.match(/Starting at: \$\d+\s*-\s*\$\d+/) !== null ||
          priceText?.match(/\$\d+/) !== null
        ).toBeTruthy();
      }
    });
  });
  
  test.describe('Test S.4: Verifying Specific Services', () => {
    test('Interior detailing service is listed with correct details', async ({ page }) => {
      // Find the Interior Detailing service
      const interiorService = page.locator('.service-item', { has: page.locator('h3', { hasText: /Interior Detailing/i }) });
      
      // Skip if this specific service isn't in this deployment
      if (await interiorService.count() === 0) {
        test.skip();
        return;
      }
      
      await expect(interiorService).toBeVisible();
      
      // Verify service name
      const serviceName = interiorService.locator('h3');
      await expect(serviceName).toContainText(/Interior Detailing/i);
      
      // Verify service has a description
      const serviceDesc = interiorService.locator('p.service-description');
      await expect(serviceDesc).toBeVisible();
      
      // Verify service has a price
      const servicePrice = interiorService.locator('.service-price');
      await expect(servicePrice).toBeVisible();
      const priceText = await servicePrice.textContent();
      expect(priceText).toMatch(/\$\d+/);
      
      // Verify "What's Included" list if it exists
      const includedList = interiorService.locator('ul.includes-list');
      if (await includedList.count() > 0) {
        const listItems = includedList.locator('li');
        const itemCount = await listItems.count();
        expect(itemCount).toBeGreaterThan(0);
        
        // Check commonly included services like vacuum and cleaning
        const itemTexts = await listItems.allTextContents();
        const combinedText = itemTexts.join(' ').toLowerCase();
        
        // Interior service should mention at least one of these common terms
        const commonTerms = ['vacuum', 'clean', 'dust', 'wipe', 'dashboard', 'seats', 'carpet'];
        const hasCommonTerm = commonTerms.some(term => combinedText.includes(term));
        expect(hasCommonTerm).toBeTruthy();
      }
    });
    
    test('Exterior detailing service is listed with correct details', async ({ page }) => {
      // Find the Exterior Detailing service
      const exteriorService = page.locator('.service-item', { has: page.locator('h3', { hasText: /Exterior Detailing|Wash|Polish/i }) });
      
      // Skip if this specific service isn't in this deployment
      if (await exteriorService.count() === 0) {
        test.skip();
        return;
      }
      
      await expect(exteriorService).toBeVisible();
      
      // Verify service name
      const serviceName = exteriorService.locator('h3');
      await expect(serviceName).toBeVisible();
      
      // Verify service has a description
      const serviceDesc = exteriorService.locator('p.service-description');
      await expect(serviceDesc).toBeVisible();
      
      // Verify service has a price
      const servicePrice = exteriorService.locator('.service-price');
      await expect(servicePrice).toBeVisible();
      const priceText = await servicePrice.textContent();
      expect(priceText).toMatch(/\$\d+/);
      
      // Verify "What's Included" list if it exists
      const includedList = exteriorService.locator('ul.includes-list');
      if (await includedList.count() > 0) {
        const listItems = includedList.locator('li');
        const itemCount = await listItems.count();
        expect(itemCount).toBeGreaterThan(0);
        
        // Check commonly included services
        const itemTexts = await listItems.allTextContents();
        const combinedText = itemTexts.join(' ').toLowerCase();
        
        // Exterior service should mention at least one of these common terms
        const commonTerms = ['wash', 'polish', 'wax', 'clay', 'wheel', 'tire', 'shine'];
        const hasCommonTerm = commonTerms.some(term => combinedText.includes(term));
        expect(hasCommonTerm).toBeTruthy();
      }
    });
  });
  
  test.describe('Test S.5: Custom Services Section', () => {
    test('Custom services section contains correct elements', async ({ page }) => {
      // Find the custom services section
      const customSection = page.locator('.custom-services');
      await expect(customSection).toBeVisible();
      
      // Verify heading
      const heading = customSection.locator('h2');
      await expect(heading).toBeVisible();
      await expect(heading).toContainText(/Custom|Special/i);
      
      // Verify description
      const description = customSection.locator('p');
      await expect(description).toBeVisible();
      
      // Verify "Get Custom Quote" button exists
      const quoteButton = customSection.locator('a.btn', { hasText: /Quote|Contact/i });
      await expect(quoteButton).toBeVisible();
      
      // Verify button links to quote or contact page
      const buttonHref = await quoteButton.getAttribute('href');
      expect(buttonHref).toMatch(/quote|contact/);
    });
  });
  
  test.describe('Test S.6: CTA Section', () => {
    test('CTA section contains correct elements and links', async ({ page }) => {
      // Find the CTA section
      const ctaSection = page.locator('.cta-section');
      await expect(ctaSection).toBeVisible();
      
      // Verify heading
      const heading = ctaSection.locator('h2');
      await expect(heading).toBeVisible();
      
      // Verify CTA buttons exist
      const ctaButtons = ctaSection.locator('a.btn');
      expect(await ctaButtons.count()).toBeGreaterThan(0);
      
      // Verify at least one button links to the quote page
      const quoteButton = ctaSection.locator('a.btn', { hasText: /Quote|Book|Schedule/i });
      if (await quoteButton.count() > 0) {
        await expect(quoteButton).toBeVisible();
        const buttonHref = await quoteButton.getAttribute('href');
        expect(buttonHref).toMatch(/quote|contact|booking/);
      }
    });
  });
});