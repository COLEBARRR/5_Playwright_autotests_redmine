import path from 'path';
import { existsSync, mkdirSync } from 'fs';
import { authenticator } from 'otplib';
import { test, expect } from '../fixtures/baseTest';
import { ActivityPage } from '../pages/ActivityPage';
import { DownloadPage } from '../pages/DownloadPage';
import { IssuesPage } from '../pages/IssuesPage';
import { LoginPage } from '../pages/LoginPage';
import { MainPage } from '../pages/MainPage';
import { ProjectsPage } from '../pages/ProjectsPage';

const requiredEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const redmineUser = requiredEnv('REDMINE_USER');
const redminePass = requiredEnv('REDMINE_PASS');
const redmineTwoFactorSecret = requiredEnv('REDMINE_2FA_SECRET');
const searchKeyword = process.env.SEARCH_KEYWORD ?? 'Playwright';
const activityUser = process.env.ACTIVITY_USER ?? 'Go MAEDA';
const activityDate = process.env.ACTIVITY_DATE ?? '2026-06-16';

test.describe('Test cases for https://www.redmine.org/', () => {
  test('C001 - Authorization of a registered user using valid data', async ({ page }) => {
    const mainPage = new MainPage(page);
    const loginPage = new LoginPage(page);

    await test.step('Open the website', async () => {
      await mainPage.open();
    });

    await test.step('Click on the "Sign in" link', async () => {
      await mainPage.goToSignIn();
      await loginPage.expectLoginFormVisible();
    });

    await test.step('Fill all fields with valid data', async () => {
      await loginPage.fillCredentials(redmineUser, redminePass);
      await loginPage.expectCredentialsEntered(redmineUser);
    });

    await test.step('Click the "Sign In" button', async () => {
      await loginPage.submit();
      await loginPage.expectTwoFactorFormVisible();
    });

    await test.step('Fill the "code" field', async () => {
      const code = authenticator.generate(redmineTwoFactorSecret);
      await loginPage.fillTwoFactorCode(code);
      await loginPage.expectTwoFactorCodeEntered(code);
    });

    await test.step('Click the "Sign In" button', async () => {
      await loginPage.submitTwoFactorCode();
      await mainPage.expectLoggedInAs(redmineUser);
    });
  });

  test('C002 - Searching for existing entities via the global search bar', async ({ page }) => {
    const mainPage = new MainPage(page);

    await test.step('Open the website', async () => {
      await mainPage.open();
    });

    await test.step('Click on the "Search" field and enter the keyword', async () => {
      await mainPage.search(searchKeyword);
      await mainPage.expectSearchValue(searchKeyword);
    });

    await test.step('Press "Enter" key', async () => {
      await mainPage.submitSearch();
      await mainPage.expectSearchResults(searchKeyword);
    });
  });

  test('C003 - Adding filters for "Issues" table', async ({ page }) => {
    const mainPage = new MainPage(page);
    const issuesPage = new IssuesPage(page);

    await test.step('Open the website', async () => {
      await mainPage.open();
    });

    await test.step('Click "Issues" button', async () => {
      await issuesPage.openIssues();
      await issuesPage.expectFiltersVisible();
    });

    await test.step('Click "Add filter" Dropdown list and select "Tracker"', async () => {
      await issuesPage.addFilter('tracker_id');
    });

    await test.step('Click "Add filter" Dropdown list and select "Status"', async () => {
      await issuesPage.addFilter('status_id');
    });

    await test.step('For the "Tracker" filter, select "corresponds" from the first dropdown list and "Defect" from the second', async () => {
      await issuesPage.setTrackerFilter('corresponds', 'Defect');
    });

    await test.step('For the "Status" filter, select "closed" from the dropdown list', async () => {
      await issuesPage.setStatusFilter('closed');
    });

    await test.step('Click "Apply" button', async () => {
      await issuesPage.applyFilters();
      await issuesPage.expectOnlyTrackerAndStatus('Defect', 'Closed');
    });
  });

  test('C004 - Filtering activity log by specific user', async ({ page }) => {
    const mainPage = new MainPage(page);
    const projectsPage = new ProjectsPage(page);
    const activityPage = new ActivityPage(page);

    await test.step('Open the website', async () => {
      await mainPage.open();
    });

    await test.step('Click the "Projects" button', async () => {
      await projectsPage.openProjects();
    });

    await test.step('Click the "Activity" button', async () => {
      await projectsPage.goToActivity();
      await activityPage.expectActivityPageVisible();
    });

    await test.step('Click on the "User" dropdown and select "Go MAEDA"', async () => {
      await activityPage.selectUser(activityUser);
    });

    await test.step('Click on the Date and select "16.06.2026"', async () => {
      await activityPage.setDate(activityDate);
    });

    await test.step('Click "Apply"', async () => {
      await activityPage.apply();
      await activityPage.expectActivitiesForUser(activityUser);
    });
  });

  test('C005 - Downloading the latest release package in .zip format', async ({ page }) => {
    const downloadPage = new DownloadPage(page);

    await test.step('Open the website', async () => {
      await downloadPage.openMainPage();
    });

    await test.step('Click the "Download" button', async () => {
      await downloadPage.openDownloadPage();
    });

    await test.step('Click on the link with the latest .zip release', async () => {
      const download = await downloadPage.downloadLatestZip();
      const suggestedName = download.suggestedFilename();
      expect(suggestedName).toMatch(/\.zip$/i);

      mkdirSync('downloads', { recursive: true });
      const savePath = path.join('downloads', suggestedName);
      await download.saveAs(savePath);
      expect(existsSync(savePath)).toBeTruthy();
    });

    await test.step('Choose the path and click "Save"', async () => {
      await expect(page.locator('body')).toBeVisible();
    });
  });
});
