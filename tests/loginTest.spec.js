
import { test, expect } from '../fixtures.js';

import fs from 'fs';
const data = JSON.parse(fs.readFileSync('TestData/loginData.json', 'utf-8'));

// Valid credentials from .env
const validEmail = process.env.TEST_EMAIL;
const validPassword = process.env.TEST_PASSWORD;

test('Login with valid credentials', async ({ loggedIn }) => {
    await expect(loggedIn.page.locator('[data-test="page-title"]')).toHaveText('My account');
});

test('Login with valid email and invalid password', async ({ loginPage }) => {
    await loginPage.login(validEmail, data.inValidCredentials.password);

    await loginPage.assertErrorMessage();
});

test('Login with invalid/unregistered email with correct password', async ({ loginPage }) => {
    await loginPage.login(data.inValidCredentials.email, validPassword);

    await loginPage.assertErrorMessage();
});

test('Login with empty email and valid password', async ({ loginPage, page }) => {
    await loginPage.login('', validPassword);

    await expect(page.locator('#email-error'))
        .toHaveText('Email is required');
});

test('Login with valid email and empty password', async ({ loginPage, page }) => {
    await loginPage.login(validEmail, '');

    await expect(page.locator('#password-error'))
        .toHaveText('Password is required');
});

test('Login with empty email and password', async ({ loginPage, page }) => {
    await loginPage.login('', '');

    await expect(page.locator('#email-error'))
        .toHaveText('Email is required');

    await expect(page.locator('#password-error'))
        .toHaveText('Password is required');
});

test('Login with wrong email format and valid password', async ({ loginPage, page }) => {
    await loginPage.login(data.inValidCredentials.wrongEmailFormat, validPassword);

    await expect(page.locator('#email-error'))
        .toHaveText('Email format is invalid');
});

test('Testing logout Function', async ({ loggedIn, page }) => {
    await loggedIn.logOut();

    await expect(page).toHaveURL('/auth/login');
});
