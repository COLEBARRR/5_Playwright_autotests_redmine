import { expect, type Locator, type Page } from '@playwright/test';

export class ActivityPage {
  readonly page: Page;
  readonly userSelect: Locator;
  readonly dateInput: Locator;
  readonly applyButton: Locator;
  readonly activityItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userSelect = page.locator('select[name="user_id"], #user_id, select').filter({ has: page.locator('option') }).first();
    this.dateInput = page.locator('input[name="from"], #from, input[type="date"], input[name="date"]').first();
    this.applyButton = page.getByRole('link', { name: /^Apply$/ }).or(page.getByRole('button', { name: /^Apply$/ })).or(page.locator('input[type="submit"]')).first();
    this.activityItems = page.locator('#activity dl, #activity .time-entry, #content dl, #content .journal');
  }

  async expectActivityPageVisible(): Promise<void> {
    await expect(this.page.locator('#activity')).toBeVisible();
    await expect(this.page.locator('#activity_scope_form')).toBeVisible();
  }

  async selectUser(userName: string): Promise<void> {
    await this.selectByLabelOrValue(this.userSelect, userName);
    await expect(this.userSelect).toContainText(userName);
  }

  async setDate(isoDate: string): Promise<void> {
    await this.dateInput.fill(isoDate);
    await expect(this.dateInput).toHaveValue(isoDate);
  }

  async apply(): Promise<void> {
    await this.applyButton.click();
    await expect(this.page.locator('#activity')).toBeVisible();
  }

  async expectActivitiesForUser(userName: string): Promise<void> {
    const authors = this.page.locator('#activity dd .author');

    await expect(authors.first()).toBeVisible();

    const authorCount = await authors.count();
    for (let index = 0; index < authorCount; index += 1) {
      await expect(authors.nth(index)).toContainText(userName);
    }
  }

  private async selectByLabelOrValue(select: Locator, label: string): Promise<void> {
    const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const option = select.locator('option').filter({ hasText: new RegExp(`^\\s*${escapedLabel}\\s*$`, 'i') });
    const value = await option.first().getAttribute('value');

    if (value) {
      await select.selectOption(value);
      return;
    }

    await select.selectOption({ label });
  }
}
