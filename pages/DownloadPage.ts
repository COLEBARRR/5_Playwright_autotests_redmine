import { expect, type Download, type Locator, type Page } from '@playwright/test';

export class DownloadPage {
  readonly page: Page;
  readonly latestReleaseHeader: Locator;
  readonly latestZipLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.latestReleaseHeader = page.getByRole('heading', { name: /latest releases/i }).or(page.locator('text=/Latest releases/i')).first();
    this.latestZipLink = page.locator('a[href$=".zip"]').filter({ hasText: /\.zip/i }).first();
  }

  async openMainPage(): Promise<void> {
    await this.page.goto('/');
    await expect(this.page.locator('#content')).toBeVisible();
  }

  async openDownloadPage(): Promise<void> {
    await this.page.goto('/projects/redmine/wiki/Download');
    await expect(this.latestReleaseHeader).toBeVisible();
  }

  async downloadLatestZip(): Promise<Download> {
    const latestZipLink = this.page.locator('#content a[href$=".zip"]').filter({ hasText: /^redmine-\d+\.\d+\.\d+\.zip$/ }).last();
    await expect(latestZipLink).toBeVisible();

    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      latestZipLink.click()
    ]);

    return download;
  }
}
