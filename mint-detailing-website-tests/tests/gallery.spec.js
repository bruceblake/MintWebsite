import { test, expect } from '@playwright/test';

test.describe('Gallery Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the gallery page before each test
    await page.goto('/gallery');
    
    // Wait for the gallery to load completely
    await page.waitForSelector('[data-testid="gallery-grid"]', { state: 'visible' });
  });
  
  test.describe('Test G.1: Gallery Page Structure', () => {
    test('Gallery page has correct heading and structure', async ({ page }) => {
      // Verify the page heading
      const heading = page.locator('[data-testid="gallery-heading"]');
      await expect(heading).toBeVisible();
      await expect(heading).toContainText('Our Work');
      
      // Verify gallery grid exists
      const galleryGrid = page.locator('[data-testid="gallery-grid"]');
      await expect(galleryGrid).toBeVisible();
      
      // Verify filter buttons exist
      const filterButtons = page.locator('.gallery-filter-btn');
      const filterCount = await filterButtons.count();
      expect(filterCount).toBeGreaterThanOrEqual(3); // At least All, Exterior, Interior filters
      
      // Verify filter buttons have the correct filtering categories
      const filterCategories = ['all', 'exterior', 'interior'];
      for (const category of filterCategories) {
        const filterBtn = page.locator(`.gallery-filter-btn[data-filter="${category}"]`);
        await expect(filterBtn).toBeVisible();
      }
      
      // Verify at least some gallery items exist
      const galleryItems = page.locator('.gallery-item');
      const itemCount = await galleryItems.count();
      expect(itemCount).toBeGreaterThan(0);
    });
  });
  
  test.describe('Test G.2: Gallery Filtering', () => {
    test('Filter buttons correctly filter gallery items', async ({ page }) => {
      // Get initial count of all gallery items
      const allItems = page.locator('.gallery-item');
      const initialItemCount = await allItems.count();
      expect(initialItemCount).toBeGreaterThan(0);
      
      // Check that non-"all" filters actually filter content
      const categories = ['exterior', 'interior', 'ceramic'];
      
      for (const category of categories) {
        // Some categories might not be available in all deployments
        const filterBtn = page.locator(`.gallery-filter-btn[data-filter="${category}"]`);
        if (await filterBtn.count() === 0) continue;
        
        // Click the filter button
        await filterBtn.click();
        
        // Wait for filtering animation to complete
        await page.waitForTimeout(500);
        
        // Get count of currently visible items after filtering
        const visibleItems = page.locator(`.gallery-item:not(.hidden)`);
        const filteredCount = await visibleItems.count();
        
        // If we have any items in this category
        if (filteredCount > 0) {
          // Check that only items with the correct category are visible
          const shownItems = page.locator(`.gallery-item:not(.hidden)`);
          const categoryItems = page.locator(`.gallery-item[data-category*="${category}"]:not(.hidden)`);
          
          expect(await shownItems.count()).toBe(await categoryItems.count());
        }
        
        // Return to "all" filter to reset for next test
        const allFilterBtn = page.locator('.gallery-filter-btn[data-filter="all"]');
        await allFilterBtn.click();
        await page.waitForTimeout(500);
      }
    });
  });
  
  test.describe('Test G.3: Lightbox Functionality', () => {
    test('Lightbox opens when clicking gallery image', async ({ page }) => {
      // Find the first gallery image
      const firstImage = page.locator('[data-testid="gallery-img-1"]').or(page.locator('.gallery-item').first().locator('img'));
      await expect(firstImage).toBeVisible();
      
      // Click on the image to open lightbox
      await firstImage.click();
      
      // Verify lightbox is visible
      const lightbox = page.locator('[data-testid="lightbox-container"]').or(page.locator('.lightbox.active'));
      await expect(lightbox).toBeVisible();
      
      // Verify lightbox image is visible
      const lightboxImage = page.locator('[data-testid="lightbox-image"]').or(page.locator('.lightbox.active img'));
      await expect(lightboxImage).toBeVisible();
      
      // Verify lightbox controls are visible
      const prevBtn = page.locator('[data-testid="lightbox-prev"]').or(page.locator('.lightbox-prev'));
      const nextBtn = page.locator('[data-testid="lightbox-next"]').or(page.locator('.lightbox-next'));
      const closeBtn = page.locator('[data-testid="lightbox-close"]').or(page.locator('.lightbox-close'));
      
      await expect(prevBtn).toBeVisible();
      await expect(nextBtn).toBeVisible();
      await expect(closeBtn).toBeVisible();
    });
    
    test('Lightbox navigation works correctly', async ({ page }) => {
      // Find and click the first gallery image
      const firstImage = page.locator('[data-testid="gallery-img-1"]').or(page.locator('.gallery-item').first().locator('img'));
      await expect(firstImage).toBeVisible();
      await firstImage.click();
      
      // Verify lightbox is visible
      const lightbox = page.locator('[data-testid="lightbox-container"]').or(page.locator('.lightbox.active'));
      await expect(lightbox).toBeVisible();
      
      // Get the current image src
      const lightboxImage = page.locator('[data-testid="lightbox-image"]').or(page.locator('.lightbox.active img'));
      await expect(lightboxImage).toBeVisible();
      const initialSrc = await lightboxImage.getAttribute('src');
      
      // Click next button
      const nextBtn = page.locator('[data-testid="lightbox-next"]').or(page.locator('.lightbox-next'));
      await nextBtn.click();
      
      // Wait for transition
      await page.waitForTimeout(300);
      
      // Get new image src
      const newSrc = await lightboxImage.getAttribute('src');
      
      // Verify image changed (src should be different)
      expect(newSrc).not.toBe(initialSrc);
      
      // Click previous button
      const prevBtn = page.locator('[data-testid="lightbox-prev"]').or(page.locator('.lightbox-prev'));
      await prevBtn.click();
      
      // Wait for transition
      await page.waitForTimeout(300);
      
      // Get back image src
      const backSrc = await lightboxImage.getAttribute('src');
      
      // Verify we're back to the initial image
      expect(backSrc).toBe(initialSrc);
    });
    
    test('Lightbox closes correctly', async ({ page }) => {
      // Find and click the first gallery image
      const firstImage = page.locator('[data-testid="gallery-img-1"]').or(page.locator('.gallery-item').first().locator('img'));
      await expect(firstImage).toBeVisible();
      await firstImage.click();
      
      // Verify lightbox is visible
      const lightbox = page.locator('[data-testid="lightbox-container"]').or(page.locator('.lightbox.active'));
      await expect(lightbox).toBeVisible();
      
      // Test closing with the close button
      const closeBtn = page.locator('[data-testid="lightbox-close"]').or(page.locator('.lightbox-close'));
      await closeBtn.click();
      
      // Verify lightbox is hidden
      await expect(page.locator('.lightbox.active')).not.toBeVisible();
      
      // Open lightbox again
      await firstImage.click();
      await expect(lightbox).toBeVisible();
      
      // Test closing with Escape key
      await page.keyboard.press('Escape');
      
      // Verify lightbox is hidden
      await expect(page.locator('.lightbox.active')).not.toBeVisible();
      
      // Open lightbox again
      await firstImage.click();
      await expect(lightbox).toBeVisible();
      
      // Test closing by clicking outside the image
      // Click in the top-left corner of the lightbox (away from the image)
      await page.mouse.click(10, 10);
      
      // Verify lightbox is hidden
      await expect(page.locator('.lightbox.active')).not.toBeVisible();
    });
  });
  
  test.describe('Test G.4: Before-After Comparisons', () => {
    test('Before-After section exists and has comparison sliders', async ({ page }) => {
      // Check if before-after section exists
      const beforeAfterSection = page.locator('[data-testid="before-after-grid"]').or(page.locator('.before-after-grid'));
      
      // Skip test if this section doesn't exist on this deployment
      if (await beforeAfterSection.count() === 0) {
        test.skip();
        return;
      }
      
      await expect(beforeAfterSection).toBeVisible();
      
      // Check for comparison containers
      const comparisonContainers = page.locator('.comparison-container');
      const containerCount = await comparisonContainers.count();
      
      // Skip further checks if no comparison containers exist
      if (containerCount === 0) {
        test.skip();
        return;
      }
      
      // Check properties of the first comparison container
      const firstContainer = comparisonContainers.first();
      await expect(firstContainer).toBeVisible();
      
      // Check for before/after images
      const beforeAfterImage = firstContainer.locator('.comparison-img');
      await expect(beforeAfterImage).toBeVisible();
      
      // Check for slider control if it exists
      const slider = firstContainer.locator('.slider-handle');
      if (await slider.count() > 0) {
        await expect(slider).toBeVisible();
      }
    });
  });
  
  test.describe('Test G.5: Gallery Item Count Verification', () => {
    test('Gallery has the expected minimum number of images', async ({ page }) => {
      // Get count of all gallery items
      const galleryItems = page.locator('.gallery-item');
      const itemCount = await galleryItems.count();
      
      // Verify we have at least 6 gallery items (adjust based on your actual requirements)
      expect(itemCount).toBeGreaterThanOrEqual(6);
      
      // Check each gallery item has an image
      for (let i = 0; i < Math.min(itemCount, 10); i++) { // Check up to 10 items
        const item = galleryItems.nth(i);
        const image = item.locator('img');
        await expect(image).toBeVisible();
        
        // Check image has src
        const src = await image.getAttribute('src');
        expect(src).toBeTruthy();
        
        // Check image has alt text
        const alt = await image.getAttribute('alt');
        expect(alt).toBeTruthy();
      }
    });
  });
  
  test.describe('Test G.6: Gallery Layout Responsiveness', () => {
    test('Gallery layout changes responsively on mobile', async ({ page }) => {
      // Skip if viewport is not mobile
      const viewportWidth = page.viewportSize()?.width || 1280;
      if (viewportWidth >= 768) {
        // Only check this on mobile viewports
        test.skip();
        return;
      }
      
      // Check gallery grid columns on mobile
      const galleryGrid = page.locator('[data-testid="gallery-grid"]').or(page.locator('.gallery-grid'));
      
      // Check CSS grid properties for mobile layout
      const gridTemplateColumns = await galleryGrid.evaluate(el => {
        return window.getComputedStyle(el).gridTemplateColumns;
      });
      
      // On mobile, grid should have fewer columns (1 or 2)
      // Count the number of columns by counting the number of values in gridTemplateColumns
      const columnCount = gridTemplateColumns.split(' ').length;
      expect(columnCount).toBeLessThanOrEqual(2);
      
      // Check filter buttons layout
      const filterSection = page.locator('.gallery-filter');
      const filterDisplay = await filterSection.evaluate(el => {
        return window.getComputedStyle(el).display;
      });
      
      // Filter buttons should stack or have a mobile-friendly layout
      expect(['block', 'flex', 'grid']).toContain(filterDisplay);
    });
  });
});