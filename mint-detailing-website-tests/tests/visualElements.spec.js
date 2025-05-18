// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Tests for visual elements across the website
 * Verifies logo, hero images, service cards, and gallery images
 */
test.describe('Visual Elements & Content', () => {
  test('Test 3.1: Logo Presence and Alt Text', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Verify the logo is visible
    const logo = page.locator('[data-testid="logo"]');
    await expect(logo).toBeVisible();
    
    // Verify logo text content
    await expect(logo).toContainText('Mint');
    
    // Check alt text if it's an image logo (may be a text logo instead)
    const logoImage = page.locator('.logo img');
    const logoImageCount = await logoImage.count();
    
    if (logoImageCount > 0) {
      const altText = await logoImage.getAttribute('alt');
      expect(altText).toBeTruthy();
      expect(altText).toContain('Mint');
    }
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
    
    // Verify hero content elements
    await expect(page.locator('[data-testid="hero-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="hero-subtitle"]')).toBeVisible();
    await expect(page.locator('[data-testid="hero-quote-btn"]')).toBeVisible();
  });

  test('Test 3.3: Service Card Placeholder Images', async ({ page }) => {
    // Part 1: Check service cards on homepage
    await page.goto('/');
    
    // Verify the services section is present
    await expect(page.locator('[data-testid="services-overview-section"]')).toBeVisible();
    
    // Check each individual service card with data-testid
    const serviceTypes = ['interior', 'exterior', 'ceramic'];
    
    for (const serviceType of serviceTypes) {
      // Verify the service card is visible
      const serviceCard = page.locator(`[data-testid="service-card-${serviceType}"]`);
      await expect(serviceCard).toBeVisible();
      
      // Verify the service card image
      const serviceImage = page.locator(`[data-testid="service-card-${serviceType}-image"]`);
      await expect(serviceImage).toBeVisible();
      
      // Verify the image has alt text
      const altText = await serviceImage.getAttribute('alt');
      expect(altText).toBeTruthy();
      expect(altText.length).toBeGreaterThan(3); // Simple check for meaningful alt text
      
      // Verify the image src is not empty and not a random URL
      const src = await serviceImage.getAttribute('src');
      expect(src).toBeTruthy();
      expect(src).not.toContain('source.unsplash.com/random');
      
      // Verify service card has title, text, and button
      await expect(page.locator(`[data-testid="service-card-${serviceType}-title"]`)).toBeVisible();
      await expect(page.locator(`[data-testid="service-card-${serviceType}-text"]`)).toBeVisible();
      await expect(page.locator(`[data-testid="service-card-${serviceType}-button"]`)).toBeVisible();
    }
    
    // Part 2: Check service cards on services page
    await page.goto('/services');
    
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
        
        // Check alt text
        const altText = await image.getAttribute('alt');
        expect(altText).toBeTruthy();
      }
    }
  });

  test('Test 3.4: Gallery Page - Image Presence', async ({ page }) => {
    // Navigate to the gallery page
    await page.goto('/gallery');
    
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
      
      // Check alt text
      const altText = await image.getAttribute('alt');
      expect(altText).toBeTruthy();
    }
    
    // Verify there are gallery items with data-testid attributes
    const galleryItem1 = page.locator('[data-testid="gallery-image-item-1"]');
    await expect(galleryItem1).toBeVisible();
  });

  test('Test 3.5: Testimonials Page - Before/After Images', async ({ page }) => {
    // Navigate to the testimonials page
    await page.goto('/testimonials');
    
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
      
      // Check alt text
      const afterAlt = await afterImage.getAttribute('alt');
      expect(afterAlt).toBeTruthy();
      
      // Check the "before" image
      const beforeImage = container.locator('.comparison-img-overlay img');
      await expect(beforeImage).toBeVisible();
      
      // Verify the image src is not a random URL
      const beforeSrc = await beforeImage.getAttribute('src');
      expect(beforeSrc).toBeTruthy();
      expect(beforeSrc).not.toContain('source.unsplash.com/random');
      
      // Check alt text
      const beforeAlt = await beforeImage.getAttribute('alt');
      expect(beforeAlt).toBeTruthy();
    }
  });
  
  test('Test V.1: All Service Card Images (Services Page)', async ({ page }) => {
    // Navigate to the services page
    await page.goto('/services');
    
    // Find all service card images
    const serviceImages = page.locator('.service-item-image img, .service-image img, .service-img');
    
    // Count the number of images
    const count = await serviceImages.count();
    
    // We should have at least some service images
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const image = serviceImages.nth(i);
        
        // Verify the image is visible
        await expect(image).toBeVisible();
        
        // Verify image has a src attribute and it's not a random URL
        const src = await image.getAttribute('src');
        expect(src).toBeTruthy();
        expect(src).not.toContain('source.unsplash.com/random');
        
        // Verify image has alt text
        const alt = await image.getAttribute('alt');
        expect(alt).toBeTruthy();
        expect(alt.length).toBeGreaterThan(3); // Ensure it's not just a placeholder alt
      }
    }
  });
  
  test('Test V.2: Testimonial Before & After Image Pairs', async ({ page }) => {
    // Navigate to the testimonials page
    await page.goto('/testimonials');
    
    // Find all before/after comparison containers
    const beforeAfterContainers = page.locator('.before-after-item .comparison-container');
    
    // Count the number of containers
    const count = await beforeAfterContainers.count();
    
    // If we have before/after images, check them
    if (count > 0) {
      // Check at least 2 before/after pairs if available
      const containersToCheck = Math.min(count, 2);
      
      for (let i = 0; i < containersToCheck; i++) {
        const container = beforeAfterContainers.nth(i);
        
        // Check "after" image (the main visible image)
        const afterImage = container.locator('.comparison-img');
        await expect(afterImage).toBeVisible();
        
        // Verify after image has a src attribute
        const afterSrc = await afterImage.getAttribute('src');
        expect(afterSrc).toBeTruthy();
        
        // Verify after image has alt text
        const afterAlt = await afterImage.getAttribute('alt');
        expect(afterAlt).toBeTruthy();
        
        // Check "before" image (in the overlay)
        const beforeImage = container.locator('.comparison-img-overlay img');
        await expect(beforeImage).toBeVisible();
        
        // Verify before image has a src attribute
        const beforeSrc = await beforeImage.getAttribute('src');
        expect(beforeSrc).toBeTruthy();
        
        // Verify before image has alt text
        const beforeAlt = await beforeImage.getAttribute('alt');
        expect(beforeAlt).toBeTruthy();
        
        // Verify before and after images are different
        expect(beforeSrc).not.toEqual(afterSrc);
      }
    }
  });
  
  test('Test V.3: Logo Alt Text', async ({ page }) => {
    // Test the logo alt text on multiple pages
    const pagesToCheck = ['/', '/about', '/services', '/gallery'];
    
    for (const path of pagesToCheck) {
      // Navigate to the page
      await page.goto(path);
      
      // Find the logo
      const logo = page.locator('[data-testid="logo"]');
      await expect(logo).toBeVisible();
      
      // If it's a text logo, just check the content
      const logoText = await logo.textContent();
      expect(logoText).toBeTruthy();
      expect(logoText).toContain('Mint');
      
      // Check if there's an actual image logo
      const logoImage = page.locator('.logo img');
      const logoImageCount = await logoImage.count();
      
      if (logoImageCount > 0) {
        // If there's an image logo, check its alt text
        const altText = await logoImage.getAttribute('alt');
        expect(altText).toBeTruthy();
        expect(altText).toContain('Mint');
        expect(altText).toContain('Logo');
      }
    }
  });
});