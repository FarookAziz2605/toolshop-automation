export class ProductPage {
    constructor(page) {
        this.homePage= page.locator('.nav-link.active');
        this.productContent = page.locator('.card');
        this.imageContent= page.locator('.card-img-wrapper img');
        this.titleContent= page.locator('.card-title');
        this.priceContent= page.locator('[data-test="product-price"]');
        this.co2Badge = page.locator('[data-test="co2-rating-badge"]')
        this.co2Rating = page.locator('.co2-letter.active');
        this.validRatings = ['A', 'B', 'C', 'D', 'E'];
        this.environmentScale = "A = most environmentally friendly, E = higher environmental impact";


    };

    async goHome() {
        await this.homePage.click();
    };

    async getCount(locator) {

        const count = await locator.count();
        return count;
    }

    async getPrices(locator) {
        const pricesInText= await (locator).allTextContents();
        const prices = pricesInText.map(price => Number(price.replace('$', '')));

        return prices;
    }
    

}