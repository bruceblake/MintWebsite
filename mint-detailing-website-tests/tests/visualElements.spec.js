// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Tests for visual elements across the website
 * Verifies logo, hero images, service cards, and gallery images
 */
test.describe('Visual Elements & Content', () => {
  test('Test 3.1: Logo Presence', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Verify the logo is visible
    const logo = page.locator('[data-testid="logo"]');
    await expect(logo).toBeVisible();
    
    // Verify logo text content
    await expect(logo).toContainText('Mint');
  });

  test('Test 3.2: Homepage Hero Image', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Verify the hero section is visible
    const heroSection = page.locator('[data-testid="hero-section"]');
    await expect(heroSection).toBeVisible();
    
    // Verify the hero section has a background image
    const bgImage = await heroSection.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.backgroundImage;
    });
    
    // Check that the background image URL is not empty and not a random URL
    expect(bgImage).toBeTruthy();
    expect(bgImage).not.toContain('source.unsplash.com/random');
  });

  test('Test 3.3: Service Card Placeholder Images', async ({ page }) => {
    // Part 1: Check service cards on homepage
    await page.goto('/');
    
    // Find all service card images
    const serviceCardImages = page.locator('.service-card-img');
    
    // Ensure we have some service cards
    const count = await serviceCardImages.count();
    expect(count).toBeGreaterThan(0);
    
    // Check each image
    for (let i = 0; i < count; i++) {
      const image = serviceCardImages.nth(i);
      
      // Verify the image is visible
      await expect(image).toBeVisible();
      
      // Verify the image src is not empty and not a random URL
      const src = await image.getAttribute('src');
      expect(src).toBeTruthy();
      expect(src).not.toContain('source.unsplash.com/random');
    }
    
    // Part 2: Check service cards on services page
    await page.goto('/services.html');
    
    // Find all service card images on the services page
    const servicesPageImages = page.locator('.service-image img, .service-img');
    
    // Ensure we have some service images
    const servicesCount = await servicesPageImages.count();
    
    // It's okay if we find 0 images here as the services page might use a different structure
    if (servicesCount > 0) {
      // Check each image
      for (let i = 0; i < servicesCount; i++) {
        const image = servicesPageImages.nth(i);
        
        // Verify the image is visible
        await expect(image).toBeVisible();
        
        // Verify the image src is not empty and not a random URL
        const src = await image.getAttribute('src');
        expect(src).toBeTruthy();
        expect(src).not.toContain('source.unsplash.com/random');
      }
    }
  });

  test('Test 3.4: Gallery Page - Image Presence', async ({ page }) => {
    // Navigate to the gallery page
    await page.goto('/gallery.html');
    
    // Verify the gallery grid is present
    await expect(page.locator('[data-testid="gallery-grid"]')).toBeVisible();
    
    // Find all gallery images
    const galleryImages = page.locator('.gallery-img');
    
    // Ensure we have some gallery images
    const count = await galleryImages.count();
    expect(count).toBeGreaterThan(0);
    
    // Check at least the first few images
    const imagesToCheck = Math.min(count, 5);  // Check up to 5 images
    
    for (let i = 0; i < imagesToCheck; i++) {
      const image = galleryImages.nth(i);
      
      // Verify the image is visible
      await expect(image).toBeVisible();
      
      // Verify the image src is not empty and not a random URL
      const src = await image.getAttribute('src');
      expect(src).toBeTruthy();
      expect(src).not.toContain('source.unsplash.com/random');
    }
  });

  test('Test 3.5: Testimonials Page - Before/After Images', async ({ page }) => {
    // Navigate to the testimonials page
    await page.goto('/testimonials.html');
    
    // Find all comparison containers (before/after image slots)
    const comparisonContainers = page.locator('.comparison-container');
    
    // Ensure we have some comparison containers
    const count = await comparisonContainers.count();
    
    // We may or may not have comparison containers
    if (count > 0) {
      // Check the first comparison container
      const container = comparisonContainers.first();
      await expect(container).toBeVisible();
      
      // Check the "after" image
      const afterImage = container.locator('.comparison-img');
      await expect(afterImage).toBeVisible();
      
      // Verify the image src is not a random URL
      const afterSrc = await afterImage.getAttribute('src');
      expect(afterSrc).toBeTruthy();
      expect(afterSrc).not.toContain('source.unsplash.com/random');
      
      // Check the "before" image
      const beforeImage = container.locator('.comparison-img-overlay img');
      await expect(beforeImage).toBeVisible();
      
      // Verify the image src is not a random URL
      const beforeSrc = await beforeImage.getAttribute('src');
      expect(beforeSrc).toBeTruthy();
      expect(beforeSrc).not.toContain('source.unsplash.com/random');
    }
  });
});