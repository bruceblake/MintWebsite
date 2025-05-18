// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Navigation tests for Mint Detailing website
 * Tests navigation links, page loading, and basic accessibility
 */
test.describe('Core Navigation & Page Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage before each test
    await page.goto('/');
  });

  test('Test 1.1: Load Homepage', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle(/Mint Detailing/);
    
    // Verify hero title is present
    const heroTitle = page.locator('[data-testid="hero-title"]');
    await expect(heroTitle).toBeVisible();
    await expect(heroTitle).toContainText('Experience Perfection');
  });

  test('Test 1.2: Header Navigation Links', async ({ page }) => {
    // Test each navigation link
    const navLinks = [
      { testId: 'nav-about', path: '/about.html', expectedElement: 'h1', expectedText: 'About Mint' },
      { testId: 'nav-services', path: '/services.html', expectedElement: 'h1', expectedText: 'Our Services' },
      { testId: 'nav-gallery', path: '/gallery.html', expectedElement: '[data-testid="gallery-heading"]', expectedText: 'Photo Gallery' },
      { testId: 'nav-testimonials', path: '/testimonials.html', expectedElement: 'h1', expectedText: 'Customer Testimonials' },
      { testId: 'nav-service-area', path: '/service-area.html', expectedElement: 'h1', expectedText: 'Our Service Area' },
      { testId: 'nav-quote', path: '/quote.html', expectedElement: '[data-testid="form-title"]', expectedText: 'Request a Quote' }
    ];

    for (const link of navLinks) {
      // Click the navigation link
      await page.locator(`[data-testid="${link.testId}"]`).click();
      
      // Verify URL change - allow both with and without .html (pretty URLs)
      // Create a pattern that accepts both '/about.html' and '/about'
      const basePath = link.path.replace('.html', '');
      const urlPattern = new RegExp(`${basePath}(?:\\.html)?$`);
      await expect(page).toHaveURL(urlPattern);
      
      // Verify expected content on the page
      const element = page.locator(link.expectedElement);
      await expect(element).toBeVisible();
      await expect(element).toContainText(link.expectedText);
      
      // Go back to the homepage for the next test
      await page.goto('/');
    }
  });

  test('Test 1.3: Footer Navigation Links (Basic)', async ({ page }) => {
    // Test a few key footer links
    const footerLinks = [
      { text: 'Home', path: 'index.html', expectedURL: /^\/$|index\.html$/ }, // Match either root '/' or 'index.html'
      { text: 'Services', path: 'services.html', expectedURL: /\/services(?:\.html)?$/ },
      { text: 'Get a Quote', path: 'quote.html', expectedURL: /\/quote(?:\.html)?$/ }
    ];

    for (const link of footerLinks) {
      // Find the link by its text content within the footer
      await page.locator('.footer').getByText(link.text).first().click();
      
      // Verify URL change - using pre-defined regex pattern for each link
      await expect(page).toHaveURL(link.expectedURL);
      
      // Go back to the homepage for the next test
      await page.goto('/');
    }
  });

  test('Test 1.4: Logo Link to Homepage', async ({ page }) => {
    // First navigate to a sub-page - handle both /about.html and /about URLs
    await page.goto('/about.html');
    
    // Verify we're on the about page - handle both with and without .html
    await expect(page).toHaveURL(/\/about(?:\.html)?$/);
    
    // Wait for the logo to be visible before clicking
    await page.locator('[data-testid="logo"]').waitFor({ state: 'visible' });
    
    // Click the logo
    await page.locator('[data-testid="logo"]').click();
    
    // Verify we're back on the homepage - match either '/' or '/index.html'
    await expect(page).toHaveURL(/^\/$|\/index\.html$/);
    
    // Verify hero section is visible (which is only on the homepage)
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
  });
});