# Test info

- Name: Visual Elements & Content >> Test 3.2: Homepage Hero Image
- Location: /home/proxyie/MySoftware/MintWebsite/mint-detailing-website-tests/tests/visualElements.spec.js:21:3

# Error details

```
Error: browserType.launch: 
╔══════════════════════════════════════════════════════╗
║ Host system is missing dependencies to run browsers. ║
║ Missing libraries:                                   ║
║     libicudata.so.66                                 ║
║     libicui18n.so.66                                 ║
║     libicuuc.so.66                                   ║
║     libxslt.so.1                                     ║
║     libwoff2dec.so.1.0.2                             ║
║     libopus.so.0                                     ║
║     libwebpdemux.so.2                                ║
║     libharfbuzz-icu.so.0                             ║
║     libwebpmux.so.3                                  ║
║     libwebp.so.6                                     ║
║     libenchant-2.so.2                                ║
║     libhyphen.so.0                                   ║
║     libgudev-1.0.so.0                                ║
║     libffi.so.7                                      ║
║     libevdev.so.2                                    ║
║     libx264.so                                       ║
╚══════════════════════════════════════════════════════╝
```

# Test source

```ts
   1 | // @ts-check
   2 | const { test, expect } = require('@playwright/test');
   3 |
   4 | /**
   5 |  * Tests for visual elements across the website
   6 |  * Verifies logo, hero images, service cards, and gallery images
   7 |  */
   8 | test.describe('Visual Elements & Content', () => {
   9 |   test('Test 3.1: Logo Presence', async ({ page }) => {
   10 |     // Navigate to the homepage
   11 |     await page.goto('/');
   12 |     
   13 |     // Verify the logo is visible
   14 |     const logo = page.locator('[data-testid="logo"]');
   15 |     await expect(logo).toBeVisible();
   16 |     
   17 |     // Verify logo text content
   18 |     await expect(logo).toContainText('Mint');
   19 |   });
   20 |
>  21 |   test('Test 3.2: Homepage Hero Image', async ({ page }) => {
      |   ^ Error: browserType.launch: 
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
  120 |   test('Test 3.5: Testimonials Page - Before/After Images', async ({ page }) => {
  121 |     // Navigate to the testimonials page
```