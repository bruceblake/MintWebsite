// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Tests for detailed content verification across the website
 * Verifies specific text content beyond just headings
 */
test.describe('Detailed Content Verification', () => {
  test('Test C.1: Homepage - Hero Section Content', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Verify hero title
    const heroTitle = page.locator('[data-testid="hero-title"]');
    await expect(heroTitle).toBeVisible();
    await expect(heroTitle).toContainText('Experience Perfection');
    
    // Verify hero subtitle
    const heroSubtitle = page.locator('.hero-subtitle');
    await expect(heroSubtitle).toBeVisible();
    await expect(heroSubtitle).toContainText('Mint Vehicle Detailing provides premium car care services');
    
    // Verify CTA button text and visibility
    const heroCta = page.locator('[data-testid="hero-quote-btn"]');
    await expect(heroCta).toBeVisible();
    await expect(heroCta).toContainText('Get Your Free Quote Today');
    
    // Verify secondary CTA button
    const secondaryCta = page.locator('.hero-buttons .btn-outline');
    await expect(secondaryCta).toBeVisible();
    await expect(secondaryCta).toContainText('Explore Our Services');
  });
  
  test('Test C.2: Homepage - Services Overview Section', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Verify section title
    const sectionTitle = page.locator('.section-title').filter({ hasText: 'Our Services' });
    await expect(sectionTitle).toBeVisible();
    
    // Get all service cards
    const serviceCards = page.locator('.service-card');
    const count = await serviceCards.count();
    
    // Verify we have at least 3 service cards
    expect(count).toBeGreaterThanOrEqual(3);
    
    // Service names to verify
    const expectedServices = ['Interior Detailing', 'Exterior Polishing', 'Ceramic Coating'];
    
    // Verify each service card
    for (let i = 0; i < Math.min(count, expectedServices.length); i++) {
      const card = serviceCards.nth(i);
      
      // Verify card title
      const title = card.locator('.service-card-title');
      await expect(title).toBeVisible();
      await expect(title).toContainText(expectedServices[i]);
      
      // Verify card has a description
      const description = card.locator('.service-card-text');
      await expect(description).toBeVisible();
      
      // Verify card has an image
      const image = card.locator('img');
      await expect(image).toBeVisible();
      
      // Verify card has a "Learn More" button
      const button = card.locator('.btn');
      await expect(button).toBeVisible();
      await expect(button).toContainText('Learn More');
    }
  });
  
  test('Test C.3: Homepage - "Why Choose Mint?" Section', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Verify section title
    const sectionTitle = page.locator('.section-title').filter({ hasText: 'Why Choose Mint?' });
    await expect(sectionTitle).toBeVisible();
    
    // Get all feature points
    const features = page.locator('.feature');
    const count = await features.count();
    
    // Verify we have at least 3 feature points
    expect(count).toBeGreaterThanOrEqual(3);
    
    // Expected feature titles
    const expectedFeatures = [
      'Certified Professionals',
      'Eco-Friendly Products',
      'Mobile Service Available',
      'Satisfaction Guaranteed'
    ];
    
    // Verify content of at least 3 feature points
    for (let i = 0; i < Math.min(count, expectedFeatures.length); i++) {
      const feature = features.nth(i);
      
      // Verify feature has an icon
      const icon = feature.locator('.feature-icon');
      await expect(icon).toBeVisible();
      
      // Verify feature title
      const title = feature.locator('.feature-title');
      await expect(title).toBeVisible();
      
      // Verify feature has a description
      const description = feature.locator('.feature-text');
      await expect(description).toBeVisible();
    }
  });
  
  test('Test C.4: About Page - Key Paragraphs', async ({ page }) => {
    // Navigate to the about page
    await page.goto('/about');
    
    // Verify page title
    const pageTitle = page.locator('h1').first();
    await expect(pageTitle).toBeVisible();
    await expect(pageTitle).toContainText('About Mint');
    
    // Verify story intro paragraph is present
    const storyIntro = page.locator('.about-text p').first();
    await expect(storyIntro).toBeVisible();
    await expect(storyIntro).toContainText('Welcome to Mint Detailing');
    
    // Verify mission/vision section is present
    const missionSection = page.locator('.mission h3');
    const visionSection = page.locator('.vision h3');
    
    // Check if either mission or vision section exists
    const hasMission = await missionSection.count() > 0;
    const hasVision = await visionSection.count() > 0;
    
    expect(hasMission || hasVision).toBeTruthy();
    
    if (hasMission) {
      await expect(missionSection).toContainText('Mission');
    }
    
    if (hasVision) {
      await expect(visionSection).toContainText('Vision');
    }
  });
  
  test('Test C.5: Footer Content', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Verify copyright text includes "Mint Detailing" and a year
    const copyright = page.locator('.copyright');
    await expect(copyright).toBeVisible();
    await expect(copyright).toContainText('Mint Detailing');
    
    // Verify year - should be current or recent year
    const copyrightText = await copyright.textContent();
    const yearPattern = /\d{4}/;
    const match = copyrightText?.match(yearPattern);
    
    expect(match).toBeTruthy();
    if (match) {
      const year = parseInt(match[0]);
      const currentYear = new Date().getFullYear();
      // Allow for the year to be current or at most 1 year old (for test stability)
      expect(year).toBeGreaterThanOrEqual(currentYear - 1);
    }
    
    // Verify contact info in footer
    const footerPhone = page.locator('.footer-links a[href^="tel:"]');
    await expect(footerPhone).toBeVisible();
    
    const footerEmail = page.locator('.footer-links a[href^="mailto:"]');
    await expect(footerEmail).toBeVisible();
    await expect(footerEmail).toContainText('@');
  });
});