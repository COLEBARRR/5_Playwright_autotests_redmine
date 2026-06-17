import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly twoFactorCodeInput: Locator;
  readonly twoFactorSubmitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#username, input[name="username"], input[name="login"]').first();
    this.passwordInput = page.locator('#password, input[name="password"]').first();
    this.submitButton = page.getByRole('button', { name: /login|sign in/i }).or(page.locator('input[type="submit"]')).first();
    this.twoFactorCodeInput = page.locator('#twofa_code, #code, input[name="twofa_code"], input[name="code"], input[autocomplete="one-time-code"]').first();
    this.twoFactorSubmitButton = page.getByRole('button', { name: /login|sign in|submit/i }).or(page.locator('input[type="submit"]')).first();
  }

  async expectLoginFormVisible(): Promise<void> {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
  }

  async fillCredentials(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
  }

  async expectCredentialsEntered(username: string): Promise<void> {
    await expect(this.usernameInput).toHaveValue(username);
    await expect(this.passwordInput).not.toHaveValue('');
    await expect(this.passwordInput).toHaveAttribute('type', /password/i);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async expectTwoFactorFormVisible(): Promise<void> {
    await expect(this.twoFactorCodeInput).toBeVisible();
  }

  async fillTwoFactorCode(code: string): Promise<void> {
    await this.twoFactorCodeInput.fill(code);
  }

  async expectTwoFactorCodeEntered(code: string): Promise<void> {
    await expect(this.twoFactorCodeInput).toHaveValue(code);
  }

  async submitTwoFactorCode(): Promise<void> {
    await this.twoFactorSubmitButton.click();
  }
}
