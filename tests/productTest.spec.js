import {test, expect} from '../fixtures.js';
import { ProductPage } from '../Pages/ProductPage.js';

let productPage;

test.describe('Authenticated product tests', () => {

    async function getRating (badge) {
        await expect(badge).toBeVisible();

        const activeRatings = badge.locator('.co2-letter.active');

        const count = await productPage.getCount(activeRatings);
        expect(count).toBe(1);

        //Checking if one of letters is there or not
        const selectedRating = (await activeRatings.textContent()).trim();

        return selectedRating
    }

    test.beforeEach(async ({loggedIn}) => {
       productPage = new ProductPage(loggedIn.page)
       await productPage.goHome();

       // Wait until at least one product card is visible
       await expect(productPage.productContent.first()).toBeVisible();

    });

    test('PROD-001: Verify that product cards exist and are visible', async() => {
        //checking count of the products.
        const count = await productPage.getCount(productPage.productContent);
        expect(count).toBeGreaterThan(0);

        //Checking the content to be visible
        for(let i =0; i < count; i++) {
            await expect(productPage.productContent.nth(i)).toBeVisible();
        };

    });

    test ('PROD-002 — Verify product images', async () => {

        const count = await productPage.getCount(productPage.imageContent);

        for (let i= 0; i < count; i++) {
            await expect(productPage.imageContent.nth(i)).toBeVisible();
            await expect(productPage.imageContent.nth(i)).not.toHaveJSProperty('naturalWidth', 0);
        }
    });

    test ('PROD-003 — Verify product names', async () => {
        
        const count = await productPage.getCount(productPage.titleContent);

        for (let i=0; i < count; i++) {
            await expect(productPage.titleContent.nth(i)).not.toBeEmpty();
        }

    })

    test ('PROD-004 — Verify product prices', async() => {

        const count = await productPage.getCount(productPage.priceContent);

        const prices = await productPage.getPrices(productPage.priceContent);

        for (let i=0; i < count; i++) {
            expect(Number.isFinite(prices[i])).toBe(true);
            expect(prices[i]).toBeGreaterThanOrEqual(0);
            expect(prices[i]).toBeLessThanOrEqual(100);
        }
    })

    test ('PROD-005 Check that the environmental rating is displayed and is one of A, B, C, D, or E.', async() => {
        
        await expect(productPage.co2Badge.first()).toBeVisible();
        const badgeCount = await productPage.getCount(productPage.co2Badge);

        const productCount = await productPage.getCount(productPage.productContent);
        expect(badgeCount).toBe(productCount);

        for (let i = 0; i < badgeCount; i++) {

            
            const badge = productPage.co2Badge.nth(i);
            
            const selectedRating = await getRating(badge);
            expect(productPage.validRatings.includes(selectedRating)).toBe(true);
        }
        
    });

    test('PROD-006 Verify CO₂ rating tooltip', async () => {
        const count = await productPage.getCount(productPage.co2Badge);

        for (let i=0; i < count; i++) {
            await expect(productPage.co2Badge.nth(i)).toHaveAttribute('title', productPage.environmentScale);
        }
        
    })

    test('PROD-007 — Verify navigation to product details', async ({page}) => {

        await expect(productPage.titleContent.first()).not.toBeEmpty();
        const title = (await productPage.titleContent.first().textContent()).trim();
        const selectedRating = await getRating(productPage.co2Badge.first());
        const priceText = await productPage.priceContent.first().textContent();
        const price = Number(priceText.replace('$', '').trim());
        
        const productUrl = await productPage.productContent.first().getAttribute('href');
        await productPage.productContent.first().click();

        await expect(page).toHaveURL(new RegExp(productUrl));

        await expect(page.locator('[data-test="product-name"]')).toHaveText(title);
        await expect(page.locator('[data-test="unit-price"]')).toHaveText(price.toFixed(2));
        const productRating = await getRating(page.locator('.co2-rating-scale.mt-2'));
        expect(productRating).toBe(selectedRating);
    });
});