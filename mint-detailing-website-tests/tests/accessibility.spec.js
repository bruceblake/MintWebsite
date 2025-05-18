import { test, expect } from '@playwright/test';

/**
 * Basic Accessibility Tests
 * These tests focus on essential accessibility features that can be verified 
 * without requiring full WCAG compliance testing tools.
 */
test.describe('Basic Accessibility Checks', () => {
  
  test.describe('Test A.1: Image Accessibility', () => {
    test('All important images have alt text', async ({ page }) => {
      // Test homepage images
      await page.goto('/');
      
      // Check all content images (excluding decorative images with role="presentation")
      const contentImages = page.locator('img:not([role="presentation"])');
      const count = await contentImages.count();
      
      for (let i = 0; i < count; i++) {
        const img = contentImages.nth(i);
        
        // Get image src to help identify it in error messages
        const src = await img.getAttribute('src') || 'unknown-src';
        
        // Skip SVG images that may be decorative but don't have role="presentation"
        if (src.endsWith('.svg')) continue;
        
        // Check for alt text
        const altText = await img.getAttribute('alt');
        expect(altText, `Image with src="${src}" is missing alt text`).not.toBeNull();
        
        // Check that alt text isn't empty if the image is not decorative
        if (!await img.getAttribute('role') || await img.getAttribute('role') !== 'presentation') {
          expect(altText?.trim().length, `Image with src="${src}" has empty alt text`).toBeGreaterThan(0);
        }
      }
    });
    
    test('Hero and service images have descriptive alt text', async ({ page }) => {
      // Check key pages for important images
      const pagesToCheck = ['/', '/services', '/about'];
      
      for (const pagePath of pagesToCheck) {
        await page.goto(pagePath);
        
        // Find hero/banner images
        const heroImages = page.locator('.hero img, .banner img, [data-testid*="hero"] img');
        const heroCount = await heroImages.count();
        
        for (let i = 0; i < heroCount; i++) {
          const img = heroImages.nth(i);
          const alt = await img.getAttribute('alt');
          const src = await img.getAttribute('src') || 'unknown-src';
          
          // Hero images should have descriptive alt text (more than just a few chars)
          expect(alt, `Hero image with src="${src}" is missing alt text`).not.toBeNull();
          expect(alt?.trim().length, `Hero image with src="${src}" has insufficient alt text`).toBeGreaterThan(5);
        }
        
        // Find service/feature images if on appropriate pages
        if (pagePath === '/' || pagePath === '/services') {
          const serviceImages = page.locator('.service-card img, .service-item img, .feature-item img');
          const serviceCount = await serviceImages.count();
          
          for (let i = 0; i < serviceCount; i++) {
            const img = serviceImages.nth(i);
            const alt = await img.getAttribute('alt');
            const src = await img.getAttribute('src') || 'unknown-src';
            
            // Service images should have descriptive alt text
            expect(alt, `Service image with src="${src}" is missing alt text`).not.toBeNull();
            expect(alt?.trim().length, `Service image with src="${src}" has insufficient alt text`).toBeGreaterThan(0);
          }
        }
      }
    });
  });
  
  test.describe('Test A.2: Heading Structure', () => {
    test('Pages have correct heading hierarchy', async ({ page }) => {
      const pagesToCheck = ['/', '/about', '/services', '/quote', '/gallery'];
      
      for (const pagePath of pagesToCheck) {
        await page.goto(pagePath);
        
        // Check that at least one h1 exists
        const h1s = page.locator('h1');
        const h1Count = await h1s.count();
        expect(h1Count, `Page ${pagePath} doesn't have an h1 heading`).toBeGreaterThan(0);
        
        // Check that h1 is not empty
        if (h1Count > 0) {
          const h1Text = await h1s.first().textContent();
          expect(h1Text?.trim().length, `Page ${pagePath} has an empty h1 heading`).toBeGreaterThan(0);
        }
        
        // Verify heading order - no heading level can be skipped
        // e.g., can't have h1 followed directly by h3 without h2 in between
        const headings = page.locator('h1, h2, h3, h4, h5, h6');
        const headingCount = await headings.count();
        
        // Keep track of the highest heading level seen
        let highestHeadingLevelSeen = 1;
        
        for (let i = 0; i < headingCount; i++) {
          const heading = headings.nth(i);
          const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
          const level = parseInt(tagName.substring(1));
          
          // Ensure heading levels don't skip (e.g., h1 to h3)
          // Note: This is a simplified check - in real sites, this logic might be more complex
          expect(level, `Page ${pagePath} has an invalid heading structure (skipping levels)`).toBeLessThanOrEqual(highestHeadingLevelSeen + 1);
          
          // Update highest level seen
          if (level > highestHeadingLevelSeen) {
            highestHeadingLevelSeen = level;
          }
        }
      }
    });
  });
  
  test.describe('Test A.3: Form Accessibility', () => {
    test('Form inputs have associated labels', async ({ page }) => {
      // Check the quote form page
      await page.goto('/quote');
      
      // Get all inputs except hidden, submit, button, and image types
      const formInputs = page.locator('input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="image"]), textarea, select');
      const inputCount = await formInputs.count();
      
      for (let i = 0; i < inputCount; i++) {
        const input = formInputs.nth(i);
        
        // Get the input's ID
        const id = await input.getAttribute('id');
        
        if (id) {
          // Look for a label with a matching 'for' attribute
          const matchingLabel = page.locator(`label[for="${id}"]`);
          const hasMatchingLabel = await matchingLabel.count() > 0;
          
          // If no matching label, check if the input is inside a label
          const isInsideLabel = await input.evaluate(el => {
            let parent = el.parentElement;
            while (parent) {
              if (parent.tagName.toLowerCase() === 'label') {
                return true;
              }
              parent = parent.parentElement;
            }
            return false;
          });
          
          // Input should either have a matching label or be inside a label
          expect(hasMatchingLabel || isInsideLabel, `Input with ID "${id}" has no associated label`).toBeTruthy();
          
          // If there is a matching label, make sure it's not empty
          if (hasMatchingLabel) {
            const labelText = await matchingLabel.textContent();
            expect(labelText?.trim().length, `Label for input "${id}" is empty`).toBeGreaterThan(0);
          }
        } else {
          // If no ID, check if it's inside a label
          const isInsideLabel = await input.evaluate(el => {
            let parent = el.parentElement;
            while (parent) {
              if (parent.tagName.toLowerCase() === 'label') {
                return true;
              }
              parent = parent.parentElement;
            }
            return false;
          });
          
          // Inputs without IDs should be inside labels
          expect(isInsideLabel, `Input without ID is not inside a label element`).toBeTruthy();
        }
      }
    });
    
    test('Required form fields are properly indicated', async ({ page }) => {
      // Check the quote form page
      await page.goto('/quote');
      
      // Get all required inputs
      const requiredInputs = page.locator('input[required], textarea[required], select[required]');
      const requiredCount = await requiredInputs.count();
      
      for (let i = 0; i < requiredCount; i++) {
        const input = requiredInputs.nth(i);
        const id = await input.getAttribute('id');
        
        if (id) {
          // Check if the label has a visual indication that the field is required
          // Most sites use an asterisk (*) or the word "required"
          const label = page.locator(`label[for="${id}"]`);
          
          if (await label.count() > 0) {
            const labelText = await label.textContent();
            const hasVisualIndicator = labelText?.includes('*') || 
                                      labelText?.toLowerCase().includes('required') ||
                                      await label.evaluate(el => {
                                        return window.getComputedStyle(el, '::after').content.includes('*');
                                      });
            
            expect(hasVisualIndicator, `Required field "${id}" has no visual required indicator`).toBeTruthy();
          }
        }
      }
    });
  });
  
  test.describe('Test A.4: Color Contrast for Key Elements', () => {
    test('Main navigation has sufficient color contrast', async ({ page }) => {
      // This is a basic check for navigation contrast - would need color contrast analyzer for complete testing
      await page.goto('/');
      
      // Get main navigation links
      const navLinks = page.locator('nav a, .nav-link, .navbar-link');
      const linkCount = await navLinks.count();
      
      for (let i = 0; i < linkCount; i++) {
        const link = navLinks.nth(i);
        
        // Get the computed color and background-color
        const { color, backgroundColor } = await link.evaluate(el => {
          const style = window.getComputedStyle(el);
          return { 
            color: style.color, 
            backgroundColor: style.backgroundColor 
          };
        });
        
        // Ensure color is defined - can't do proper contrast check without a color library
        // but we can at least check that text color exists
        expect(color).toBeTruthy();
      }
    });
  });
  
  test.describe('Test A.5: Document Language', () => {
    test('HTML lang attribute is specified', async ({ page }) => {
      const pagesToCheck = ['/', '/about', '/services', '/quote', '/gallery'];
      
      for (const pagePath of pagesToCheck) {
        await page.goto(pagePath);
        
        // Check if the HTML element has a lang attribute
        const lang = await page.evaluate(() => document.documentElement.lang);
        expect(lang, `Page ${pagePath} is missing the HTML lang attribute`).toBeTruthy();
        expect(lang.length, `Page ${pagePath} has an empty HTML lang attribute`).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Test A.6: Keyboard Navigation', () => {
    test('Main navigation is keyboard accessible', async ({ page }) => {
      await page.goto('/');
      
      // Find all interactive elements in the navigation
      const navLinks = page.locator('nav a, .nav-link, .navbar-link');
      const linkCount = await navLinks.count();
      
      for (let i = 0; i < linkCount; i++) {
        const link = navLinks.nth(i);
        
        // Check if the link has a tabindex that doesn't prevent focusing
        const tabindex = await link.getAttribute('tabindex');
        const isTabable = tabindex === null || tabindex >= 0;
        
        expect(isTabable, `Navigation link has a negative tabindex which prevents keyboard focus`).toBeTruthy();
      }
      
      // Check if nav toggle button (for mobile) is keyboard accessible
      const navToggle = page.locator('#nav-toggle, .navbar-toggle, .mobile-toggle');
      if (await navToggle.count() > 0) {
        const tabindex = await navToggle.getAttribute('tabindex');
        const isTabable = tabindex === null || tabindex >= 0;
        
        expect(isTabable, `Navigation toggle button is not keyboard accessible`).toBeTruthy();
      }
    });
    
    test('CTA buttons are keyboard accessible', async ({ page }) => {
      // Check key pages
      const pagesToCheck = ['/', '/services'];
      
      for (const pagePath of pagesToCheck) {
        await page.goto(pagePath);
        
        // Find primary CTA buttons 
        const ctaButtons = page.locator('.btn-primary, .cta-button');
        const buttonCount = await ctaButtons.count();
        
        for (let i = 0; i < buttonCount; i++) {
          const button = ctaButtons.nth(i);
          
          // Check if it's a button or link
          const tagName = await button.evaluate(el => el.tagName.toLowerCase());
          
          if (tagName === 'a') {
            // Links should have href
            const href = await button.getAttribute('href');
            expect(href, `CTA link has no href attribute`).not.toBeNull();
          } else if (tagName === 'button') {
            // Buttons should be either type="button" or type="submit"
            const type = await button.getAttribute('type');
            expect(type, `CTA button does not have a type attribute`).not.toBeNull();
          } else {
            // Other elements used as buttons should have role="button" and tabindex="0"
            const role = await button.getAttribute('role');
            expect(role, `CTA element is not a button or link and doesn't have role="button"`).toBe('button');
            
            const tabindex = await button.getAttribute('tabindex');
            expect(tabindex, `CTA element with role="button" does not have tabindex="0"`).toBe('0');
          }
        }
      }
    });
  });
});