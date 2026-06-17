import { expect, type Locator, type Page } from '@playwright/test';

export class MainPage {
  readonly page: Page;
  readonly signInLink: Locator;
  readonly searchInput: Locator;
  readonly projectsLink: Locator;
  readonly issuesLink: Locator;
  readonly downloadLink: Locator;
  readonly loggedInAs: Locator;
  readonly searchResults: Locator;
  readonly searchOptions: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signInLink = page.getByRole('link', { name: 'Sign in' });
    this.searchInput = page.locator('#quick-search #q');
    this.projectsLink = page.getByRole('link', { name: /^Projects$/ });
    this.issuesLink = page.getByRole('link', { name: /^Issues$/ });
    this.downloadLink = page.getByRole('link', { name: /^Download$/ });
    this.loggedInAs = page.locator('#loggedas');
    this.searchResults = page.locator('#search-results');
    this.searchOptions = page.locator('#search-form select, #search-form input[type="checkbox"]');
  }

  async open(): Promise<void> {
    await this.page.goto('/');
    await expect(this.page.locator('#content')).toBeVisible();
  }

  async goToSignIn(): Promise<void> {
    await this.signInLink.click();
  }

  async search(keyword: string): Promise<void> {
    await this.searchInput.click();
    await this.searchInput.fill(keyword);
  }

  async submitSearch(): Promise<void> {
    await this.searchInput.press('Enter');
  }

  async expectSearchValue(keyword: string): Promise<void> {
    await expect(this.searchInput).toHaveValue(keyword);
  }

  async expectSearchResults(keyword: string): Promise<void> {
    await expect(this.page.locator('#search-input')).toHaveValue(keyword);
    await expect(this.searchResults).toBeVisible();
  
    await expect(this.page.locator('#content h3')).toContainText(/Results|\([0-9]+\)/i);
  
    await expect(this.searchOptions.first()).toBeVisible();
}

  async expectLoggedInAs(username: string): Promise<void> {
    await expect(this.loggedInAs).toContainText(new RegExp(username, 'i'));
  }
}
