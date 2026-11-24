
import {test as base} from '@playwright/test';
import { LoginPage } from './Pages/LoginPage';

export const test = base.extend({
    //Fixture 1 which always goes to login page
    loginPage: async({page}, use) => {
        const loginPageObject = new LoginPage(page);
        await loginPageObject.goto();
        await use(loginPageObject);
    },

    loggedIn: async({page}, use) => {
        //Straight login
        const loginPageObject = new LoginPage(page);
        await loginPageObject.goto();
        await loginPageObject.login(process.env.TEST_EMAIL, process.env.TEST_PASSWORD);
        await use(loginPageObject);
    },
})

export { expect } from '@playwright/test';
