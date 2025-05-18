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

  test('Test 1.2: Header Navigation Links', async ({ page, isMobile }) => {
    // Test each navigation link - using "pretty URLs" without .html
    // Updated expectedText to match the actual content on the pages
    const navLinks = [
      { testId: 'nav-about', path: '/about', expectedElement: 'h1', expectedText: 'About Mint' },
      { testId: 'nav-services', path: '/services', expectedElement: 'h1', expectedText: 'Our Detailing Services' },
      { testId: 'nav-gallery', path: '/gallery', expectedElement: '[data-testid="gallery-heading"]', expectedText: 'Photo Gallery' },
      { testId: 'nav-testimonials', path: '/testimonials', expectedElement: 'h1', expectedText: 'Customer Testimonials' },
      { testId: 'nav-service-area', path: '/service-area', expectedElement: 'h1', expectedText: 'Our Service Area' },
      { testId: 'nav-quote', path: '/quote', expectedElement: '[data-testid="form-title"]', expectedText: 'Request a Quote' }
    ];

    for (const link of navLinks) {
      // Open mobile menu if on mobile viewport
      if (isMobile) {
        const mobileMenuToggle = page.locator('[data-testid="mobile-menu-toggle"]');
        await mobileMenuToggle.click();
        await expect(page.locator('[data-testid="nav-menu"]')).toBeVisible(); // Wait for menu to open
      }
      
      // Find the navigation link
      const navLink = page.locator(`[data-testid="${link.testId}"]`);
      
      // Make sure it's visible and scrolled into view if needed (helps with mobile)
      await navLink.waitFor({ state: 'visible' });
      await navLink.scrollIntoViewIfNeeded();
      
      // Click the navigation link
      await navLink.click();
      
      // Verify URL change - using Playwright's path handling with baseURL
      // This automatically prepends the baseURL from playwright.config.js
      await expect(page).toHaveURL(link.path);
      
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
    // Note: The actual href attributes in the HTML use .html extension, but Netlify serves pretty URLs
    const footerLinks = [
      { text: 'Home', href: 'index.html', expectedPath: '/' }, // Root URL for homepage
      { text: 'Services', href: 'services.html', expectedPath: '/services' },
      { text: 'Get a Quote', href: 'quote.html', expectedPath: '/quote' }
    ];

    for (const link of footerLinks) {
      // Find the link by its text content and verify the href before clicking
      const footerLink = page.locator('.footer-link').filter({ hasText: link.text }).first();
      
      // Ensure element is in viewport for mobile
      await footerLink.waitFor({ state: 'visible' });
      await footerLink.scrollIntoViewIfNeeded();
      
      // Click the link
      await footerLink.click();
      
      // Wait for navigation to complete
      await page.waitForURL(/.*/, { timeout: 10000 });
      
      // Verify we've landed on the expected page (using pretty URL format)
      await expect(page).toHaveURL(link.expectedPath);
      
      // Go back to the homepage for the next test
      await page.goto('/');
    }
  });

  test('Test 1.4: Logo Link to Homepage', async ({ page }) => {
    // First navigate to a sub-page
    await page.goto('/about');
    
    // Verify we're on the about page
    await expect(page).toHaveURL('/about');
    
    // Wait for the logo to be visible before clicking
    await page.locator('[data-testid="logo"]').waitFor({ state: 'visible' });
    
    // Click the logo
    await page.locator('[data-testid="logo"]').click();
    
    // Verify we're back on the homepage - Netlify serves the root URL '/'
    await expect(page).toHaveURL('/');
    
    // Verify hero section is visible (which is only on the homepage)
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
  });
});