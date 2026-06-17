import { test as base, expect, type Page } from '@playwright/test';
import { authenticator } from 'otplib';
import { MainPage } from '../pages/MainPage';
import { LoginPage } from '../pages/LoginPage';

type RedmineFixtures = {
  authenticatedPage: Page;
};

const requiredEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

export const test = base.extend<RedmineFixtures>({
  authenticatedPage: async ({ page }, use) => {
    const mainPage = new MainPage(page);
    const loginPage = new LoginPage(page);
    const username = requiredEnv('REDMINE_USER');
    const password = requiredEnv('REDMINE_PASS');
    const twoFactorSecret = requiredEnv('REDMINE_2FA_SECRET');

    await mainPage.open();
    await mainPage.goToSignIn();
    await loginPage.expectLoginFormVisible();
    await loginPage.fillCredentials(username, password);
    await loginPage.submit();

    await loginPage.expectTwoFactorFormVisible();
    const token = authenticator.generate(twoFactorSecret);
    await loginPage.fillTwoFactorCode(token);
    await loginPage.submitTwoFactorCode();

    await expect(mainPage.loggedInAs).toContainText(new RegExp(username, 'i'));
    await use(page);
  }
});

export { expect };
