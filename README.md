# playwright-saucedemo-e2e

[![E2E](https://github.com/sami1507/playwright-saucedemo-e2e/actions/workflows/e2e.yml/badge.svg)](https://github.com/sami1507/playwright-saucedemo-e2e/actions/workflows/e2e.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![Playwright](https://img.shields.io/badge/Playwright-TypeScript-2EAD33)

End-to-end test suite for the [SauceDemo](https://www.saucedemo.com) storefront, written with Playwright and TypeScript. It covers authentication, catalogue behaviour, and the full checkout flow, and it is organised the way a production test framework would be: page objects, shared fixtures, tagged smoke tests, HTML and JUnit reports, and a scheduled CI run.

## What is covered

| Area           | Scenarios                                                                             |
| -------------- | ------------------------------------------------------------------------------------- |
| Authentication | Valid login, locked-out user message, wrong password and unknown user (data-driven), logout |
| Catalogue      | Six products listed, price sort low to high, name sort Z to A, add and remove from cart, badge count |
| Checkout       | End-to-end purchase, required shipping fields, order total equals item total plus tax |

Thirteen tests in total. Smoke tests carry the `@smoke` tag so a quick subset can run on every deploy.

## Project structure

```text
playwright.config.ts          Projects, reporters, base URL, retries for CI
src/
  fixtures.ts                 Extends `test` with page objects and an authenticated inventory page
  pages/
    LoginPage.ts              Login form and error banner
    InventoryPage.ts          Product grid, sorting, add and remove, cart link
    CartPage.ts               Cart contents and checkout button
    CheckoutPage.ts          Shipping form, order summary totals, confirmation
  data/testData.ts            Demo credentials and shipping details
  utils/money.ts              Parses "$1,234.50", compares totals in integer cents
tests/
  auth.spec.ts
  inventory.spec.ts
  checkout.spec.ts
.github/workflows/e2e.yml     Runs on push, pull request, weekday schedule and on demand
```

### Design choices

- **Locators by test id.** `testIdAttribute` is set to `data-test`, so `getByTestId("login-button")` reads like the intent and stays stable when styling changes. Buttons with no test id are found by role and accessible name.
- **Page objects own selectors.** Tests describe behaviour (`inventoryPage.addToCart(...)`) and never touch raw selectors, so a UI change needs one fix in one file.
- **Fixtures handle setup.** The `inventoryPage` fixture signs in before the test starts, so each spec states only the behaviour it checks.
- **Totals are checked in cents.** Floating-point dollars can disagree by a cent, so amounts are converted to integers before comparison.
- **Tests are isolated.** Each test gets a fresh browser context, and tests run in parallel.

## Running the tests

```bash
npm ci
npx playwright install chromium

npm test                 # full suite
npm run test:smoke       # @smoke subset
npm run report           # open the HTML report from the last run
npm run typecheck
```

To point the suite at another environment, set `BASE_URL`:

```bash
BASE_URL=https://staging.example.com npm test
```

## Continuous integration

`.github/workflows/e2e.yml` runs the suite on pushes to `main`, on pull requests, on weekday mornings and on demand. In CI the runner retries failed tests twice, so flaky network timing is reported separately from real failures. The HTML report and JUnit XML are uploaded as build artifacts.

## Tech stack

Playwright · TypeScript (strict) · GitHub Actions

## License

MIT. See [LICENSE](LICENSE).
