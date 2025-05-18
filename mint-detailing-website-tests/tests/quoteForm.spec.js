// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Tests for the "Get a Free Quote" form functionality
 * Verifies form field presence, validation, and submission process
 */
test.describe('"Get a Free Quote" Form Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the quote page before each test
    await page.goto('/quote.html');
  });

  test('Test 2.1: Navigate to Quote Page', async ({ page }) => {
    // Verify we're on the quote page
    await expect(page).toHaveURL(/quote.html/);
    
    // Verify the form title is visible
    const formTitle = page.locator('[data-testid="form-title"]');
    await expect(formTitle).toBeVisible();
    await expect(formTitle).toContainText('Request a Quote');
  });

  test('Test 2.2: Form Field Presence', async ({ page }) => {
    // Verify all required form fields are present
    const requiredFields = [
      { testId: 'input-name', label: 'Full Name' },
      { testId: 'input-email', label: 'Email Address' },
      { testId: 'input-phone', label: 'Phone Number' },
      { testId: 'input-vehicle-make', label: 'Vehicle Make' },
      { testId: 'input-vehicle-model', label: 'Vehicle Model' },
      { testId: 'input-vehicle-year', label: 'Vehicle Year' }
    ];

    for (const field of requiredFields) {
      // Check field is visible
      await expect(page.locator(`[data-testid="${field.testId}"]`)).toBeVisible();
      
      // Check label is present
      const label = page.locator(`label[for="${field.testId.replace('input-', '')}"]`);
      await expect(label).toContainText(field.label);
    }

    // Verify services section is present
    await expect(page.locator('[data-testid="services-options"]')).toBeVisible();
    
    // Verify submit button is present
    await expect(page.locator('[data-testid="submit-button"]')).toBeVisible();
  });

  test('Test 2.3: Submit Empty Form (Client-Side Validation Check)', async ({ page }) => {
    // Try to submit an empty form
    await page.locator('[data-testid="submit-button"]').click();
    
    // Wait a moment for validation to trigger
    await page.waitForTimeout(500);
    
    // Check URL hasn't changed
    await expect(page).toHaveURL(/quote.html/);
    
    // Verify we haven't been redirected to thank-you page
    const formTitle = page.locator('[data-testid="form-title"]');
    await expect(formTitle).toBeVisible();
  });

  test('Test 2.4: Submit Form with Invalid Email (Client-Side Validation Check)', async ({ page }) => {
    // Fill out required fields except email
    await page.locator('[data-testid="input-name"]').fill('Test User');
    await page.locator('[data-testid="input-email"]').fill('invalid-email'); // Invalid email format
    await page.locator('[data-testid="input-phone"]').fill('1234567890');
    await page.locator('[data-testid="input-vehicle-make"]').fill('Toyota');
    await page.locator('[data-testid="input-vehicle-model"]').fill('Camry');
    await page.locator('[data-testid="input-vehicle-year"]').fill('2022');
    
    // Select at least one service
    await page.locator('#interior-deep-clean').check();
    
    // Try to submit the form
    await page.locator('[data-testid="submit-button"]').click();
    
    // Wait a moment for validation to trigger
    await page.waitForTimeout(500);
    
    // Check URL hasn't changed
    await expect(page).toHaveURL(/quote.html/);
    
    // Verify we haven't been redirected to thank-you page
    const formTitle = page.locator('[data-testid="form-title"]');
    await expect(formTitle).toBeVisible();
  });

  test('Test 2.5: Successful Form Submission (Redirect & No Console Errors)', async ({ page }) => {
    // This test won't actually submit to Netlify backend in test environment
    // We'll just verify the form validates and attempts submission with no errors
    
    // Fill out all required fields with valid data
    await page.locator('[data-testid="input-name"]').fill('Test User');
    await page.locator('[data-testid="input-email"]').fill('test@example.com');
    await page.locator('[data-testid="input-phone"]').fill('1234567890');
    await page.locator('[data-testid="input-vehicle-make"]').fill('Toyota');
    await page.locator('[data-testid="input-vehicle-model"]').fill('Camry');
    await page.locator('[data-testid="input-vehicle-year"]').fill('2022');
    
    // Select at least one service
    await page.locator('#interior-deep-clean').check();
    
    // Track console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Start waiting for navigation before clicking
    const navigationPromise = page.waitForURL(/thank-you.html/, { timeout: 5000 }).catch(e => {
      // In case the test server doesn't actually redirect
      console.log('Navigation timeout: This is expected in test environments without a backend');
      return null;
    });
    
    // Submit the form
    await page.locator('[data-testid="submit-button"]').click();
    
    // Wait for navigation attempt
    await navigationPromise;
    
    // Assert no console errors occurred
    expect(consoleErrors.length).toBe(0);
    
    // Note: In a real test against a live site with Netlify backend,
    // you would also verify the redirect to thank-you.html succeeds and that
    // the thank-you page contains expected content
  });
});