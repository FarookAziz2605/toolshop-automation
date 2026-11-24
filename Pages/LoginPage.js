import { expect } from "@playwright/test";
export class LoginPage {
    constructor(page) {
        this.page= page;
        this.email= page.locator('#email');
        this.password= page.locator('#password');
        this.submitButton= page.locator('.btnSubmit');
        this.errorMessage= page.locator('.help-block');
    
        this.menu= page.locator('#menu')
        this.signOut= page.locator('[data-test="nav-sign-out"]')

    }

    async goto() {
        await this.page.goto('/auth/login');
    }
    
    async login(email, password) {
        await this.email.fill(email);
        await this.password.fill(password);
        await this.submitButton.click();
    }

    async assertErrorMessage() {
        await expect(this.errorMessage).toHaveText('Invalid email or password');
    }
    
    async logOut() {
        
        await this.menu.click();
        await this.signOut.click();
    }
}

