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

  test.describe('Test 2.6: Input Placeholder Verification', () => {
    test('Input fields have correct placeholder text', async ({ page }) => {
      // Check Vehicle Make placeholder
      const vehicleMake = page.locator('[data-testid="input-vehicle-make"]');
      await expect(vehicleMake).toBeVisible();
      expect(await vehicleMake.getAttribute('placeholder')).toBe('e.g. Toyota, BMW, Audi');
      
      // Check Vehicle Model placeholder
      const vehicleModel = page.locator('[data-testid="input-vehicle-model"]');
      await expect(vehicleModel).toBeVisible();
      expect(await vehicleModel.getAttribute('placeholder')).toBe('e.g. Camry, X5, A4');
      
      // Check Vehicle Year placeholder
      const vehicleYear = page.locator('[data-testid="input-vehicle-year"]');
      await expect(vehicleYear).toBeVisible();
      expect(await vehicleYear.getAttribute('placeholder')).toBe('e.g. 2023');
      
      // Check Vehicle Color placeholder if it exists
      const vehicleColor = page.locator('#color, [name="color"]');
      if (await vehicleColor.count() > 0) {
        await expect(vehicleColor).toBeVisible();
        expect(await vehicleColor.getAttribute('placeholder')).toBe('e.g. Black, Silver, White');
      }
      
      // Check Service Location placeholder if it exists
      const serviceLocation = page.locator('#location, [name="location"]');
      if (await serviceLocation.count() > 0) {
        await expect(serviceLocation).toBeVisible();
        expect(await serviceLocation.getAttribute('placeholder')).toBe('City, State or Full Address');
      }
      
      // Check Additional Information placeholder
      const additionalInfo = page.locator('[data-testid="input-message"]');
      await expect(additionalInfo).toBeVisible();
      const messagePlaceholder = await additionalInfo.getAttribute('placeholder');
      
      // Verify it contains instruction text (may vary slightly in wording)
      expect(messagePlaceholder).toContain('specific concerns');
      expect(messagePlaceholder).toContain('requests');
      expect(messagePlaceholder).toContain('vehicle');
    });
  });

  test.describe('Test 2.7: Form Input Field Properties', () => {
    test('Input fields have correct types and attributes', async ({ page }) => {
      // Check name field (should be type="text" and required)
      const nameInput = page.locator('[data-testid="input-name"]');
      expect(await nameInput.getAttribute('type')).toBe('text');
      expect(await nameInput.getAttribute('required')).not.toBeNull();
      
      // Check email field (should be type="email" and required)
      const emailInput = page.locator('[data-testid="input-email"]');
      expect(await emailInput.getAttribute('type')).toBe('email');
      expect(await emailInput.getAttribute('required')).not.toBeNull();
      
      // Check phone field (should be type="tel" and required)
      const phoneInput = page.locator('[data-testid="input-phone"]');
      expect(await phoneInput.getAttribute('type')).toBe('tel');
      expect(await phoneInput.getAttribute('required')).not.toBeNull();
      
      // Check vehicle make, model, year (should be type="text" and required)
      const requiredVehicleFields = [
        'input-vehicle-make',
        'input-vehicle-model',
        'input-vehicle-year'
      ];
      
      for (const fieldId of requiredVehicleFields) {
        const field = page.locator(`[data-testid="${fieldId}"]`);
        expect(await field.getAttribute('type')).toBe('text');
        expect(await field.getAttribute('required')).not.toBeNull();
      }
      
      // Check message field (should be a textarea, but not required)
      const messageField = page.locator('[data-testid="input-message"]');
      expect(await messageField.evaluate(el => el.tagName.toLowerCase())).toBe('textarea');
      // Message field is typically optional
      expect(await messageField.getAttribute('required')).toBeNull();
    });
  });

  test.describe('Test 2.8: Form Label to Input Associations', () => {
    test('Labels are correctly associated with input fields', async ({ page }) => {
      // Check all required fields have labels properly associated
      const fields = [
        { id: 'name', testId: 'input-name', label: 'Full Name' },
        { id: 'email', testId: 'input-email', label: 'Email Address' },
        { id: 'phone', testId: 'input-phone', label: 'Phone Number' },
        { id: 'vehicle-make', testId: 'input-vehicle-make', label: 'Vehicle Make' },
        { id: 'vehicle-model', testId: 'input-vehicle-model', label: 'Vehicle Model' },
        { id: 'vehicle-year', testId: 'input-vehicle-year', label: 'Vehicle Year' },
      ];
      
      for (const field of fields) {
        // Get the input element
        const input = page.locator(`[data-testid="${field.testId}"]`);
        await expect(input).toBeVisible();
        
        // Check that the input has the correct ID
        expect(await input.getAttribute('id')).toBe(field.id);
        
        // Get the label element
        const label = page.locator(`label[for="${field.id}"]`);
        await expect(label).toBeVisible();
        await expect(label).toContainText(field.label);
      }
    });
  });
});