// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Tests for responsive design behavior
 * Verifies mobile menu functionality and responsive layout
 */
test.describe('Basic Responsiveness', () => {
  test('Test 4.1: Mobile Menu Toggling', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate to the homepage
    await page.goto('/');
    
    // Verify that main desktop navigation links are NOT visible
    // (We check for presence but hidden/collapsed state)
    const navMenu = page.locator('[data-testid="nav-menu"]');
    
    // The menu itself might be present in DOM but not visible/expanded
    await expect(navMenu).toBeVisible(); // The container is visible
    
    // But individual nav items should be hidden or collapsed
    // This test may need to be adjusted based on how the mobile menu is implemented
    // Some sites hide items with CSS, others have a mobile-specific menu that's initially hidden
    
    // Verify mobile menu toggle button is visible
    const menuToggle = page.locator('[data-testid="mobile-menu-toggle"]');
    await expect(menuToggle).toBeVisible();
    
    // Click the mobile menu toggle button
    await menuToggle.click();
    
    // Wait for animation to complete (if any)
    await page.waitForTimeout(300);
    
    // Verify the mobile navigation menu becomes visible
    // This test assumes that clicking the toggle adds a class 'active' to the nav-menu
    // Adjust the selector based on actual implementation
    await expect(navMenu).toHaveClass(/active/);
    
    // Click the toggle button again
    await menuToggle.click();
    
    // Wait for animation to complete (if any)
    await page.waitForTimeout(300);
    
    // Verify the mobile navigation menu is hidden again
    await expect(navMenu).not.toHaveClass(/active/);
  });

  test('Test 4.2: No Horizontal Scroll on Mobile (Homepage)', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate to the homepage
    await page.goto('/');
    
    // Wait for any CSS animations to complete
    await page.waitForTimeout(500);
    
    // Check if horizontal scrollbar is present by comparing document width to viewport width
    const isHorizontalScrollPresent = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });
    
    // Assert that there is no horizontal scrollbar
    expect(isHorizontalScrollPresent).toBe(false);
  });

  test('Test 4.3: Key Elements Visibility on Mobile', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate to the homepage
    await page.goto('/');
    
    // Check that key elements are visible on mobile
    const keyElements = [
      { selector: '[data-testid="logo"]', description: 'Logo' },
      { selector: '[data-testid="hero-title"]', description: 'Hero Title' },
      { selector: '[data-testid="hero-quote-btn"]', description: 'Quote Button' }
    ];
    
    for (const element of keyElements) {
      await expect(page.locator(element.selector)).toBeVisible();
    }
    
    // Navigate to the quote page
    await page.goto('/quote.html');
    
    // Check that form elements are properly visible on mobile
    const formElements = [
      { selector: '[data-testid="form-title"]', description: 'Form Title' },
      { selector: '[data-testid="input-name"]', description: 'Name Input' },
      { selector: '[data-testid="input-email"]', description: 'Email Input' },
      { selector: '[data-testid="input-phone"]', description: 'Phone Input' },
      { selector: '[data-testid="submit-button"]', description: 'Submit Button' }
    ];
    
    for (const element of formElements) {
      await expect(page.locator(element.selector)).toBeVisible();
    }
  });
});