# Redmine Playwright TypeScript E2E Tests

This repository contains a set of end-to-end (E2E) automated tests for the **Redmine** web platform, built with the **Playwright** framework using **TypeScript** and the **Page Object Model (POM)** architectural pattern.

---
## Quick Links

- **GitHub Repository:** [Open repository](https://github.com/COLEBARRR/5_Playwright_autotests_redmine/)
- **CI/CD Pipeline:** [View GitHub Actions runs](https://github.com/COLEBARRR/5_Playwright_autotests_redmine/actions)
- **Test Reports:** [View Allure Report](https://colebarrr.github.io/5_Playwright_autotests_redmine/)
- **Test Cases:** [View test cases in Google Sheets](https://docs.google.com/spreadsheets/d/1eD7ZNBqVGCZ_GU2eAEFNBDiJCXc8dC2yzDEaU2xCxqc/edit?usp=sharing)

---
## Prerequisites

Before running the tests locally, make sure you have the following installed:

- **Node.js** (LTS version recommended)
- **npm**
---
You can check the currently installed versions with:

node -v
npm -v

---
## Installation

Clone the project repository:

git clone https://github.com/COLEBARRR/5_Playwright_autotests_redmine.git
---
Navigate to the root project folder:

cd 5_Playwright_autotests_redmine
---
Install all required dependencies and packages:

npm install
---
Install the browser binaries used by Playwright for automation:

npx playwright install --with-deps chromium

---
## How To Run Tests

The project includes custom automation scripts defined in `package.json` to simplify test execution and log management.
---
### Run tests in headless (console) mode

npm run test

Runs all test scenarios in the background via the console.
---
### Run tests with browser UI (headed mode)

npm run test:headed

Runs tests locally with a visible browser window on screen.
---
### Step-by-step debug mode

npm run test:debug

Launches the interactive Playwright Inspector for line-by-line code debugging.
---
### Run in Playwright UI mode

npm run test:ui

Opens the full Playwright graphical console with logs, execution timeline, screenshots, and the ability to run individual specs.
---
### Show the standard Playwright report

npm run report

Invokes the built-in Playwright HTML reporter for local viewing of failed step logs.
---
### Generate the interactive Allure report

npm run allure:generate

Clears previous builds and compiles result files from `allure-results` into a final static website inside the `allure-report` folder.
---
### Open the Allure report

npm run allure:open

Starts a local server to deploy and view the Allure report in the browser.

---
## Project Architecture and Design Patterns

The project is designed following **Page Object Model (POM)** principles to minimize locator duplication, improve scenario readability, and simplify test maintenance.

### Page Object Model (POM)

Each logical page of the Redmine web application is extracted into a dedicated TypeScript class inside the `pages/` directory. Element selectors and page-specific interaction methods are strictly isolated from the test files themselves.

The following pages are implemented in the project:

- **`LoginPage.ts`** — The user authentication page. Encapsulates credential input and login form submission.
- **`MainPage.ts`** — The main application page, containing global navigation elements, the header, and the main menu.
- **`ProjectsPage.ts`** — The project management interface. Handles the logic for creating, searching, and working with project lists.
- **`IssuesPage.ts`** — The issues and bug tracking section. Contains locators for creating, filtering, and modifying tasks.
- **`ActivityPage.ts`** — The activity page, displaying the feed of recent changes and an action log for projects.
- **`DownloadPage.ts`** — The files and document downloads section, related to builds or distributions.

---
## CI/CD Integration

The continuous integration process is automated using **GitHub Actions**. The pipeline scenario is described in the `.github/workflows/playwright.yml` file.

The pipeline is automatically triggered on every `push` or `pull_request` to the `main` and `master` branches.

The CI steps include:
1. Provisioning a virtual machine based on Ubuntu.
2. Checking out the source code and installing Node.js.
3. Downloading and cleanly installing dependencies via `npm ci`.
4. Running automated tests in headless mode on Chromium, using repository secrets for authentication.
5. Automatically collecting logs, generating history, and deploying the interactive Allure report to **GitHub Pages**.