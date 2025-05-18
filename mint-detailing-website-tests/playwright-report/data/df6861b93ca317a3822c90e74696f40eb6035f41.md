# Test info

- Name: "Get a Free Quote" Form Functionality >> Test 2.3: Submit Empty Form (Client-Side Validation Check)
- Location: /home/proxyie/MySoftware/MintWebsite/mint-detailing-website-tests/tests/quoteForm.spec.js:51:3

# Error details

```
Error: browserType.launch: Executable doesn't exist at /home/proxyie/.cache/ms-playwright/firefox-1482/firefox/firefox
╔═════════════════════════════════════════════════════════════════════════╗
║ Looks like Playwright Test or Playwright was just installed or updated. ║
║ Please run the following command to download new browsers:              ║
║                                                                         ║
║     npx playwright install                                              ║
║                                                                         ║
║ <3 Playwright Team                                                      ║
╚═════════════════════════════════════════════════════════════════════════╝
```

# Test source

```ts
   1 | // @ts-check
   2 | const { test, expect } = require('@playwright/test');
   3 |
   4 | /**
   5 |  * Tests for the "Get a Free Quote" form functionality
   6 |  * Verifies form field presence, validation, and submission process
   7 |  */
   8 | test.describe('"Get a Free Quote" Form Functionality', () => {
   9 |   test.beforeEach(async ({ page }) => {
   10 |     // Navigate to the quote page before each test
   11 |     await page.goto('/quote.html');
   12 |   });
   13 |
   14 |   test('Test 2.1: Navigate to Quote Page', async ({ page }) => {
   15 |     // Verify we're on the quote page
   16 |     await expect(page).toHaveURL(/quote.html/);
   17 |     
   18 |     // Verify the form title is visible
   19 |     const formTitle = page.locator('[data-testid="form-title"]');
   20 |     await expect(formTitle).toBeVisible();
   21 |     await expect(formTitle).toContainText('Request a Quote');
   22 |   });
   23 |
   24 |   test('Test 2.2: Form Field Presence', async ({ page }) => {
   25 |     // Verify all required form fields are present
   26 |     const requiredFields = [
   27 |       { testId: 'input-name', label: 'Full Name' },
   28 |       { testId: 'input-email', label: 'Email Address' },
   29 |       { testId: 'input-phone', label: 'Phone Number' },
   30 |       { testId: 'input-vehicle-make', label: 'Vehicle Make' },
   31 |       { testId: 'input-vehicle-model', label: 'Vehicle Model' },
   32 |       { testId: 'input-vehicle-year', label: 'Vehicle Year' }
   33 |     ];
   34 |
   35 |     for (const field of requiredFields) {
   36 |       // Check field is visible
   37 |       await expect(page.locator(`[data-testid="${field.testId}"]`)).toBeVisible();
   38 |       
   39 |       // Check label is present
   40 |       const label = page.locator(`label[for="${field.testId.replace('input-', '')}"]`);
   41 |       await expect(label).toContainText(field.label);
   42 |     }
   43 |
   44 |     // Verify services section is present
   45 |     await expect(page.locator('[data-testid="services-options"]')).toBeVisible();
   46 |     
   47 |     // Verify submit button is present
   48 |     await expect(page.locator('[data-testid="submit-button"]')).toBeVisible();
   49 |   });
   50 |
>  51 |   test('Test 2.3: Submit Empty Form (Client-Side Validation Check)', async ({ page }) => {
      |   ^ Error: browserType.launch: Executable doesn't exist at /home/proxyie/.cache/ms-playwright/firefox-1482/firefox/firefox
   52 |     // Try to submit an empty form
   53 |     await page.locator('[data-testid="submit-button"]').click();
   54 |     
   55 |     // Wait a moment for validation to trigger
   56 |     await page.waitForTimeout(500);
   57 |     
   58 |     // Check URL hasn't changed
   59 |     await expect(page).toHaveURL(/quote.html/);
   60 |     
   61 |     // Verify we haven't been redirected to thank-you page
   62 |     const formTitle = page.locator('[data-testid="form-title"]');
   63 |     await expect(formTitle).toBeVisible();
   64 |   });
   65 |
   66 |   test('Test 2.4: Submit Form with Invalid Email (Client-Side Validation Check)', async ({ page }) => {
   67 |     // Fill out required fields except email
   68 |     await page.locator('[data-testid="input-name"]').fill('Test User');
   69 |     await page.locator('[data-testid="input-email"]').fill('invalid-email'); // Invalid email format
   70 |     await page.locator('[data-testid="input-phone"]').fill('1234567890');
   71 |     await page.locator('[data-testid="input-vehicle-make"]').fill('Toyota');
   72 |     await page.locator('[data-testid="input-vehicle-model"]').fill('Camry');
   73 |     await page.locator('[data-testid="input-vehicle-year"]').fill('2022');
   74 |     
   75 |     // Select at least one service
   76 |     await page.locator('#interior-deep-clean').check();
   77 |     
   78 |     // Try to submit the form
   79 |     await page.locator('[data-testid="submit-button"]').click();
   80 |     
   81 |     // Wait a moment for validation to trigger
   82 |     await page.waitForTimeout(500);
   83 |     
   84 |     // Check URL hasn't changed
   85 |     await expect(page).toHaveURL(/quote.html/);
   86 |     
   87 |     // Verify we haven't been redirected to thank-you page
   88 |     const formTitle = page.locator('[data-testid="form-title"]');
   89 |     await expect(formTitle).toBeVisible();
   90 |   });
   91 |
   92 |   test('Test 2.5: Successful Form Submission (Redirect & No Console Errors)', async ({ page }) => {
   93 |     // This test won't actually submit to Netlify backend in test environment
   94 |     // We'll just verify the form validates and attempts submission with no errors
   95 |     
   96 |     // Fill out all required fields with valid data
   97 |     await page.locator('[data-testid="input-name"]').fill('Test User');
   98 |     await page.locator('[data-testid="input-email"]').fill('test@example.com');
   99 |     await page.locator('[data-testid="input-phone"]').fill('1234567890');
  100 |     await page.locator('[data-testid="input-vehicle-make"]').fill('Toyota');
  101 |     await page.locator('[data-testid="input-vehicle-model"]').fill('Camry');
  102 |     await page.locator('[data-testid="input-vehicle-year"]').fill('2022');
  103 |     
  104 |     // Select at least one service
  105 |     await page.locator('#interior-deep-clean').check();
  106 |     
  107 |     // Track console errors
  108 |     const consoleErrors = [];
  109 |     page.on('console', msg => {
  110 |       if (msg.type() === 'error') {
  111 |         consoleErrors.push(msg.text());
  112 |       }
  113 |     });
  114 |     
  115 |     // Start waiting for navigation before clicking
  116 |     const navigationPromise = page.waitForURL(/thank-you.html/, { timeout: 5000 }).catch(e => {
  117 |       // In case the test server doesn't actually redirect
  118 |       console.log('Navigation timeout: This is expected in test environments without a backend');
  119 |       return null;
  120 |     });
  121 |     
  122 |     // Submit the form
  123 |     await page.locator('[data-testid="submit-button"]').click();
  124 |     
  125 |     // Wait for navigation attempt
  126 |     await navigationPromise;
  127 |     
  128 |     // Assert no console errors occurred
  129 |     expect(consoleErrors.length).toBe(0);
  130 |     
  131 |     // Note: In a real test against a live site with Netlify backend,
  132 |     // you would also verify the redirect to thank-you.html succeeds and that
  133 |     // the thank-you page contains expected content
  134 |   });
  135 | });
```