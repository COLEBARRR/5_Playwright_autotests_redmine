import { expect, type Locator, type Page } from '@playwright/test';

export class IssuesPage {
  readonly page: Page;
  readonly filtersPanel: Locator;
  readonly addFilterSelect: Locator;
  readonly applyButton: Locator;
  readonly issuesTable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.filtersPanel = page.locator('#query_form_with_buttons');
    this.addFilterSelect = page.locator('#add_filter_select, select[name="add_filter_select"]').first();
    this.applyButton = page.getByRole('link', { name: /^Apply$/ }).or(page.getByRole('button', { name: /^Apply$/ })).first();
    this.issuesTable = page.locator('table.issues, #issue-list, table.list').first();
  }

  async openIssues(): Promise<void> {
    await this.page.goto('/projects/redmine/issues');
    await this.expectFiltersVisible();
  }

  async expectFiltersVisible(): Promise<void> {
    await expect(this.filtersPanel).toBeVisible();
    await expect(this.addFilterSelect).toBeVisible();
  }

  async addFilter(filterValue: 'tracker_id' | 'status_id'): Promise<void> {
    const filterRow = this.page.locator(`#tr_${filterValue}`);
    const checkbox = this.page.locator(`#cb_${filterValue}`);

    if (await filterRow.isVisible()) {
      if (!(await checkbox.isChecked())) {
        await checkbox.check();
      }
      return;
    }

    await this.addFilterSelect.selectOption(filterValue);
    await expect(filterRow).toBeVisible();
  }

  async setTrackerFilter(operatorLabel: string, valueLabel: string): Promise<void> {
    const operatorSelect = this.page.locator('select[name="op[tracker_id]"], #operators_tracker_id');
    await this.selectByLabelOrValue(operatorSelect, operatorLabel);
    const valueSelect = this.page.locator('select[name="v[tracker_id][]"], [id^="values_tracker_id"]');
    await this.selectByLabelOrValue(valueSelect, valueLabel);
  }

  async setStatusFilter(valueLabel: string): Promise<void> {
    const operatorSelect = this.page.locator('select[name="op[status_id]"], #operators_status_id');
    const normalized = valueLabel.toLowerCase().trim();

    if (normalized === 'closed' || normalized === 'c') {
      await this.selectByLabelOrValue(operatorSelect, 'closed');
    } else {
      await this.selectByLabelOrValue(operatorSelect, 'corresponds');
      const valueSelect = this.page.locator('select[name="v[status_id][]"], [id^="values_status_id"]');
      await this.selectByLabelOrValue(valueSelect, valueLabel);
    }
  }

  async applyFilters(): Promise<void> {
    await this.applyButton.click();
    await expect(this.issuesTable).toBeVisible();
  }

  async expectOnlyTrackerAndStatus(tracker: string, status: string): Promise<void> {
    const rows = this.issuesTable.locator('tbody tr');
    await expect(rows.first()).toBeVisible();

    const trackerCells = this.issuesTable.locator('tbody tr td.tracker');
    const statusCells = this.issuesTable.locator('tbody tr td.status');
    const count = await trackerCells.count();

    for (let index = 0; index < count; index += 1) {
      await expect(trackerCells.nth(index)).toHaveText(new RegExp(`^\\s*${tracker}\\s*$`, 'i'));
      await expect(statusCells.nth(index)).toHaveText(new RegExp(`^\\s*${status}\\s*$`, 'i'));
    }
  }


  private async selectByLabelOrValue(select: Locator, valueOrLabel: string): Promise<void> {
    await expect(select).toBeVisible({ timeout: 5000 });

    const normalized = valueOrLabel.toLowerCase().trim();

    if (normalized === 'corresponds' || normalized === '=') {
      await select.selectOption('=');
      return;
    }
    if (normalized === 'is not' || normalized === '!') {
      await select.selectOption('!');
      return;
    }
    if (normalized === 'open' || normalized === 'o') {
      await select.selectOption('o');
      return;
    }
    if (normalized === 'closed' || normalized === 'c') {
      await select.selectOption('c');
      return;
    }

    try {
      await select.selectOption({ label: valueOrLabel });
    } catch (e) {
      await select.selectOption(valueOrLabel);
    }
  }
}