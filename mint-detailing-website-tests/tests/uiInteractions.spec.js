import { test, expect } from '@playwright/test';

test.describe('UI Interactions', () => {
  test.describe('Test UI.1: Navigation Link Hover States (Desktop)', () => {
    test('Header navigation links change color on hover', async ({ page }) => {
      // Only run this test on desktop viewports
      test.skip(page.viewportSize()?.width < 768, 'Only for desktop');
      
      // Navigate to the homepage
      await page.goto('/');
      
      // Get a navbar link - use the About link
      const navLink = page.locator('nav .nav-link').filter({ hasText: 'About' });
      await expect(navLink).toBeVisible();
      
      // Get initial styles
      const initialColor = await navLink.evaluate(el => {
        return window.getComputedStyle(el).color;
      });
      
      // Hover over the link
      await navLink.hover();
      
      // Give the transition time to complete (assuming there's a CSS transition)
      await page.waitForTimeout(300);
      
      // Get hover styles
      const hoverColor = await navLink.evaluate(el => {
        return window.getComputedStyle(el).color;
      });
      
      // Verify the color changed on hover
      expect(hoverColor).not.toEqual(initialColor);
      
      // Verify the hover color is mint green (approx. rgb(208, 228, 225) or close to it)
      // Converting to RGB format for easier comparison with tolerances
      const rgbMatch = hoverColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (rgbMatch) {
        const [_, r, g, b] = rgbMatch.map(Number);
        // Check if the color is in the light mint green range (#d0e4e1 = rgb(208, 228, 225))
        expect(r).toBeGreaterThan(190); // Red component around 208
        expect(r).toBeLessThan(220);
        expect(g).toBeGreaterThan(215); // Green component around 228
        expect(g).toBeLessThan(240);
        expect(b).toBeGreaterThan(210); // Blue component around 225
        expect(b).toBeLessThan(235);
      }
    });
  });
  
  test.describe('Test UI.2: Button Hover States (Primary CTAs)', () => {
    test('Primary buttons change appearance on hover', async ({ page }) => {
      // Navigate to the homepage
      await page.goto('/');
      
      // Find a primary button
      const primaryButton = page.locator('.btn-primary').first();
      await expect(primaryButton).toBeVisible();
      
      // Get initial styles
      const initialStyles = await primaryButton.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          backgroundColor: style.backgroundColor,
          transform: style.transform,
          boxShadow: style.boxShadow
        };
      });
      
      // Hover over the button
      await primaryButton.hover();
      
      // Give the transition time to complete
      await page.waitForTimeout(300);
      
      // Get hover styles
      const hoverStyles = await primaryButton.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          backgroundColor: style.backgroundColor,
          transform: style.transform,
          boxShadow: style.boxShadow
        };
      });
      
      // Verify styles changed on hover
      // At least one of these properties should change (darker background, transform, or stronger shadow)
      expect(
        hoverStyles.backgroundColor !== initialStyles.backgroundColor ||
        hoverStyles.transform !== initialStyles.transform ||
        hoverStyles.boxShadow !== initialStyles.boxShadow
      ).toBeTruthy();
    });
    
    test('Get a Quote button in header changes on hover', async ({ page }) => {
      // Skip on mobile viewport
      test.skip(page.viewportSize()?.width < 768, 'Only for desktop');
      
      // Navigate to the homepage
      await page.goto('/');
      
      // Find the header CTA button 
      const ctaButton = page.locator('[data-testid="nav-quote"]');
      await expect(ctaButton).toBeVisible();
      
      // Get initial styles
      const initialStyles = await ctaButton.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          backgroundColor: style.backgroundColor,
          transform: style.transform,
          boxShadow: style.boxShadow
        };
      });
      
      // Hover over the button
      await ctaButton.hover();
      
      // Give the transition time to complete
      await page.waitForTimeout(300);
      
      // Get hover styles
      const hoverStyles = await ctaButton.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          backgroundColor: style.backgroundColor,
          transform: style.transform,
          boxShadow: style.boxShadow
        };
      });
      
      // Verify styles changed on hover
      expect(
        hoverStyles.backgroundColor !== initialStyles.backgroundColor ||
        hoverStyles.transform !== initialStyles.transform ||
        hoverStyles.boxShadow !== initialStyles.boxShadow
      ).toBeTruthy();
    });
  });
  
  test.describe('Test UI.3: Service Card Hover Effects', () => {
    test('Service cards have visual effect on hover', async ({ page }) => {
      // Navigate to the homepage or services page
      await page.goto('/services');
      
      // Find a service card
      const serviceCard = page.locator('.service-card').first();
      await expect(serviceCard).toBeVisible();
      
      // Get initial styles
      const initialStyles = await serviceCard.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          transform: style.transform,
          boxShadow: style.boxShadow
        };
      });
      
      // Hover over the service card
      await serviceCard.hover();
      
      // Give the transition time to complete
      await page.waitForTimeout(300);
      
      // Get hover styles
      const hoverStyles = await serviceCard.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          transform: style.transform,
          boxShadow: style.boxShadow
        };
      });
      
      // Verify styles changed on hover (typically elevation/shadow increases and possibly a small transform)
      expect(
        hoverStyles.transform !== initialStyles.transform ||
        hoverStyles.boxShadow !== initialStyles.boxShadow
      ).toBeTruthy();
    });
  });
  
  test.describe('Test UI.4: Footer Link Hover States', () => {
    test('Footer links change appearance on hover', async ({ page }) => {
      // Navigate to the homepage
      await page.goto('/');
      
      // Find a footer link
      const footerLink = page.locator('footer a').filter({ hasText: /Home|About|Services/ }).first();
      await expect(footerLink).toBeVisible();
      
      // Get initial color
      const initialColor = await footerLink.evaluate(el => {
        return window.getComputedStyle(el).color;
      });
      
      // Hover over the link
      await footerLink.hover();
      
      // Give the transition time to complete
      await page.waitForTimeout(300);
      
      // Get hover color
      const hoverColor = await footerLink.evaluate(el => {
        return window.getComputedStyle(el).color;
      });
      
      // Verify color changed on hover
      expect(hoverColor).not.toEqual(initialColor);
    });
  });
  
  test.describe('Test UI.5: Form Input Focus States', () => {
    test('Quote form inputs have visual feedback on focus', async ({ page }) => {
      // Navigate to the quote page
      await page.goto('/quote');
      
      // Find an input field
      const inputField = page.locator('form input[type="text"], form input[type="email"]').first();
      await expect(inputField).toBeVisible();
      
      // Get initial styles
      const initialStyles = await inputField.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          borderColor: style.borderColor,
          boxShadow: style.boxShadow,
          outline: style.outline
        };
      });
      
      // Focus the input field
      await inputField.focus();
      
      // Give the transition time to complete
      await page.waitForTimeout(300);
      
      // Get focus styles
      const focusStyles = await inputField.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          borderColor: style.borderColor,
          boxShadow: style.boxShadow,
          outline: style.outline
        };
      });
      
      // Verify styles changed on focus (typically border color, outline, or box shadow changes)
      expect(
        focusStyles.borderColor !== initialStyles.borderColor ||
        focusStyles.boxShadow !== initialStyles.boxShadow ||
        focusStyles.outline !== initialStyles.outline
      ).toBeTruthy();
    });
  });
  
  test.describe('Test UI.6: Gallery Item Hover Effects', () => {
    test('Gallery items show overlay on hover', async ({ page }) => {
      // Navigate to the gallery page
      await page.goto('/gallery');
      
      // Wait for gallery items to load
      await page.waitForSelector('.gallery-item', { state: 'visible' });
      
      // Find a gallery item
      const galleryItem = page.locator('.gallery-item').first();
      await expect(galleryItem).toBeVisible();
      
      // Get the initial state of the overlay (typically moved down with translateY)
      const overlay = galleryItem.locator('.gallery-item-overlay');
      const initialTransform = await overlay.evaluate(el => {
        return window.getComputedStyle(el).transform;
      });
      
      // Verify initial state has transform
      expect(initialTransform).toContain('translateY');
      
      // Hover over the gallery item
      await galleryItem.hover();
      
      // Give the transition time to complete
      await page.waitForTimeout(300);
      
      // Get the hover state transform of the overlay
      const hoverTransform = await overlay.evaluate(el => {
        return window.getComputedStyle(el).transform;
      });
      
      // Verify the overlay transform changed on hover (should be translateY(0) or none)
      expect(hoverTransform).not.toEqual(initialTransform);
    });
  });
  
  test.describe('Test UI.7: Social Media Icon Hover Effects', () => {
    test('Social media icons have hover effects', async ({ page }) => {
      // Navigate to the homepage or contact page
      await page.goto('/');
      
      // Find a social media icon in the footer
      const socialIcon = page.locator('footer .social-link').first();
      await expect(socialIcon).toBeVisible();
      
      // Get initial styles
      const initialStyles = await socialIcon.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          transform: style.transform,
          color: style.color,
          backgroundColor: style.backgroundColor
        };
      });
      
      // Hover over the social icon
      await socialIcon.hover();
      
      // Give the transition time to complete
      await page.waitForTimeout(300);
      
      // Get hover styles
      const hoverStyles = await socialIcon.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          transform: style.transform,
          color: style.color,
          backgroundColor: style.backgroundColor
        };
      });
      
      // Verify styles changed on hover
      expect(
        hoverStyles.transform !== initialStyles.transform ||
        hoverStyles.color !== initialStyles.color ||
        hoverStyles.backgroundColor !== initialStyles.backgroundColor
      ).toBeTruthy();
    });
  });
});