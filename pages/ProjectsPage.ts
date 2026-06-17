import { expect, type Locator, type Page } from '@playwright/test';

export class ProjectsPage {
  readonly page: Page;
  readonly activityLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.activityLink = page.getByRole('link', { name: /^Activity$/ });
  }

  async openProjects(): Promise<void> {
    await this.page.goto('/projects');
    await expect(this.page.locator('#projects-index')).toBeVisible();
  }

  async goToActivity(): Promise<void> {
    await this.activityLink.click();
    await expect(this.page).toHaveURL(/activity/);
  }
}
