# Redmine Playwright Autotests

TypeScript Playwright project generated for `https://www.redmine.org/` using Page Object Model and custom fixtures.

## Setup

```bash
npm install
npx playwright install
```

Credentials and test parameters are stored in `.env`. The file is listed in `.gitignore` and must not be committed.

## Run

```bash
npm test
npm run test:headed
npm run test:debug
```

All tests use `test.step()` for readable reports. The config also writes Playwright HTML and Allure results.
