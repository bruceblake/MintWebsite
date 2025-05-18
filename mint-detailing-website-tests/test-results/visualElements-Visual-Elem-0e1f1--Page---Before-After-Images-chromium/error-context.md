# Test info

- Name: Visual Elements & Content >> Test 3.5: Testimonials Page - Before/After Images
- Location: /home/proxyie/MySoftware/MintWebsite/mint-detailing-website-tests/tests/visualElements.spec.js:120:3

# Error details

```
Error: browserType.launch: Executable doesn't exist at /home/proxyie/.cache/ms-playwright/chromium_headless_shell-1169/chrome-linux/headless_shell
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
   20 |
   21 |   test('Test 3.2: Homepage Hero Image', async ({ page }) => {
   22 |     // Navigate to the homepage
   23 |     await page.goto('/');
   24 |     
   25 |     // Verify the hero section is visible
   26 |     const heroSection = page.locator('[data-testid="hero-section"]');
   27 |     await expect(heroSection).toBeVisible();
   28 |     
   29 |     // Verify the hero section has a background image
   30 |     const bgImage = await heroSection.evaluate(el => {
   31 |       const style = window.getComputedStyle(el);
   32 |       return style.backgroundImage;
   33 |     });
   34 |     
   35 |     // Check that the background image URL is not empty and not a random URL
   36 |     expect(bgImage).toBeTruthy();
   37 |     expect(bgImage).not.toContain('source.unsplash.com/random');
   38 |   });
   39 |
   40 |   test('Test 3.3: Service Card Placeholder Images', async ({ page }) => {
   41 |     // Part 1: Check service cards on homepage
   42 |     await page.goto('/');
   43 |     
   44 |     // Find all service card images
   45 |     const serviceCardImages = page.locator('.service-card-img');
   46 |     
   47 |     // Ensure we have some service cards
   48 |     const count = await serviceCardImages.count();
   49 |     expect(count).toBeGreaterThan(0);
   50 |     
   51 |     // Check each image
   52 |     for (let i = 0; i < count; i++) {
   53 |       const image = serviceCardImages.nth(i);
   54 |       
   55 |       // Verify the image is visible
   56 |       await expect(image).toBeVisible();
   57 |       
   58 |       // Verify the image src is not empty and not a random URL
   59 |       const src = await image.getAttribute('src');
   60 |       expect(src).toBeTruthy();
   61 |       expect(src).not.toContain('source.unsplash.com/random');
   62 |     }
   63 |     
   64 |     // Part 2: Check service cards on services page
   65 |     await page.goto('/services.html');
   66 |     
   67 |     // Find all service card images on the services page
   68 |     const servicesPageImages = page.locator('.service-image img, .service-img');
   69 |     
   70 |     // Ensure we have some service images
   71 |     const servicesCount = await servicesPageImages.count();
   72 |     
   73 |     // It's okay if we find 0 images here as the services page might use a different structure
   74 |     if (servicesCount > 0) {
   75 |       // Check each image
   76 |       for (let i = 0; i < servicesCount; i++) {
   77 |         const image = servicesPageImages.nth(i);
   78 |         
   79 |         // Verify the image is visible
   80 |         await expect(image).toBeVisible();
   81 |         
   82 |         // Verify the image src is not empty and not a random URL
   83 |         const src = await image.getAttribute('src');
   84 |         expect(src).toBeTruthy();
   85 |         expect(src).not.toContain('source.unsplash.com/random');
   86 |       }
   87 |     }
   88 |   });
   89 |
   90 |   test('Test 3.4: Gallery Page - Image Presence', async ({ page }) => {
   91 |     // Navigate to the gallery page
   92 |     await page.goto('/gallery.html');
   93 |     
   94 |     // Verify the gallery grid is present
   95 |     await expect(page.locator('[data-testid="gallery-grid"]')).toBeVisible();
   96 |     
   97 |     // Find all gallery images
   98 |     const galleryImages = page.locator('.gallery-img');
   99 |     
  100 |     // Ensure we have some gallery images
  101 |     const count = await galleryImages.count();
  102 |     expect(count).toBeGreaterThan(0);
  103 |     
  104 |     // Check at least the first few images
  105 |     const imagesToCheck = Math.min(count, 5);  // Check up to 5 images
  106 |     
  107 |     for (let i = 0; i < imagesToCheck; i++) {
  108 |       const image = galleryImages.nth(i);
  109 |       
  110 |       // Verify the image is visible
  111 |       await expect(image).toBeVisible();
  112 |       
  113 |       // Verify the image src is not empty and not a random URL
  114 |       const src = await image.getAttribute('src');
  115 |       expect(src).toBeTruthy();
  116 |       expect(src).not.toContain('source.unsplash.com/random');
  117 |     }
  118 |   });
  119 |
> 120 |   test('Test 3.5: Testimonials Page - Before/After Images', async ({ page }) => {
      |   ^ Error: browserType.launch: Executable doesn't exist at /home/proxyie/.cache/ms-playwright/chromium_headless_shell-1169/chrome-linux/headless_shell
  121 |     // Navigate to the testimonials page
  122 |     await page.goto('/testimonials.html');
  123 |     
  124 |     // Find all comparison containers (before/after image slots)
  125 |     const comparisonContainers = page.locator('.comparison-container');
  126 |     
  127 |     // Ensure we have some comparison containers
  128 |     const count = await comparisonContainers.count();
  129 |     
  130 |     // We may or may not have comparison containers
  131 |     if (count > 0) {
  132 |       // Check the first comparison container
  133 |       const container = comparisonContainers.first();
  134 |       await expect(container).toBeVisible();
  135 |       
  136 |       // Check the "after" image
  137 |       const afterImage = container.locator('.comparison-img');
  138 |       await expect(afterImage).toBeVisible();
  139 |       
  140 |       // Verify the image src is not a random URL
  141 |       const afterSrc = await afterImage.getAttribute('src');
  142 |       expect(afterSrc).toBeTruthy();
  143 |       expect(afterSrc).not.toContain('source.unsplash.com/random');
  144 |       
  145 |       // Check the "before" image
  146 |       const beforeImage = container.locator('.comparison-img-overlay img');
  147 |       await expect(beforeImage).toBeVisible();
  148 |       
  149 |       // Verify the image src is not a random URL
  150 |       const beforeSrc = await beforeImage.getAttribute('src');
  151 |       expect(beforeSrc).toBeTruthy();
  152 |       expect(beforeSrc).not.toContain('source.unsplash.com/random');
  153 |     }
  154 |   });
  155 | });
```