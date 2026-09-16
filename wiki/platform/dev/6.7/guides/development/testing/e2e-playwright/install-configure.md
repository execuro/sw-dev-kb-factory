---
id: platform/dev/6.7/guides/development/testing/e2e-playwright/install-configure.md
title: "Install & Configure"
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/install-configure.html
sourceHash: 73d319ecae2a65f282c1427dedddb1d35e3c0aba
codeCheckedAgainst: "6.7.13.0"
keywords: ["@shopware-ag/acceptance-test-suite", "APP_URL", "SHOPWARE_ACCESS_KEY_ID", "SHOPWARE_SECRET_ACCESS_KEY", "SHOPWARE_ADMIN_USERNAME", "SHOPWARE_ADMIN_PASSWORD", "MAILPIT_BASE_URL", "FixtureTypes", "integration:create", "playwright setup", "acceptance test suite", "ats", "e2e testing", "BaseTestFile"]
summary: Installing the Shopware Acceptance Test Suite in a Playwright project; .env auth variables (integration or admin user), Mailpit, and a BaseTestFile.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/development/testing/e2e-playwright/fixtures.md"]
---
## What it is

Setup guide for the Shopware Acceptance Test Suite (ATS): creating a Playwright project, installing `@shopware-ag/acceptance-test-suite`, configuring access to the Shopware instance under test via environment variables, and creating a base test file that extends the ATS `test`.

## When to use

Starting a new Playwright acceptance test project for Shopware, or preparing a local environment to run existing ATS-based tests.

## Key steps / config

1. Create a Playwright project and install the ATS and browsers:
   - `npm init playwright@latest`
   - `npm install @shopware-ag/acceptance-test-suite`
   - `npm install`, `npx playwright install`, `npx playwright install-deps`
2. Configure access in `.env`. The suite works against any Shopware instance through the API. Two auth options: integration (recommended) or admin user.

```dotenv
APP_URL="<url-to-the-shopware-instance>"
SHOPWARE_ACCESS_KEY_ID="<integration-id>"
SHOPWARE_SECRET_ACCESS_KEY="<integration-secret>"
SHOPWARE_ADMIN_USERNAME="<admin-user>"
SHOPWARE_ADMIN_PASSWORD="<admin-password>"
```

   On the Shopware side, `bin/console integration:create <name> --admin` creates an integration and prints exactly the `SHOPWARE_ACCESS_KEY_ID=` / `SHOPWARE_SECRET_ACCESS_KEY=` lines.
3. Point Playwright at the same instance in `playwright.config.ts`: `defineConfig({ use: { baseURL: process.env['APP_URL'] } })`.
4. Mailpit (for email tests such as `tests/Mailpit.spec.ts`): run a local Mailpit; by default its web UI listens on localhost port 8025 and SMTP on port 1025. Set `MAILPIT_BASE_URL` in `playwright.config.ts` to the Mailpit web UI address.
5. Set `"type": "module",` in `package.json` and create a base test file used by all tests:

```TypeScript
// BaseTestFile.ts
import { test as base } from '@shopware-ag/acceptance-test-suite';
import type { FixtureTypes } from '@shopware-ag/acceptance-test-suite';
export * from '@shopware-ag/acceptance-test-suite';
export const test = base.extend<FixtureTypes>({ /* your fixtures */ });
```

6. In tests, import from it: `import { test, expect } from './../BaseTestFile';` and request fixtures such as `AdminApiContext` and `DefaultSalesChannel` as arguments. See [Fixtures](platform/dev/6.7/guides/development/testing/e2e-playwright/fixtures.md).

## Essential identifiers

- `@shopware-ag/acceptance-test-suite`, `FixtureTypes`, `base.extend<FixtureTypes>`
- `APP_URL`, `SHOPWARE_ACCESS_KEY_ID`, `SHOPWARE_SECRET_ACCESS_KEY`, `SHOPWARE_ADMIN_USERNAME`, `SHOPWARE_ADMIN_PASSWORD`, `MAILPIT_BASE_URL`
- `integration:create` (Shopware CLI)
- `playwright.config.ts`, `BaseTestFile.ts`

## Gotchas

- The ATS works as a complete drop-in for Playwright via Playwright's extension system; a custom base file is the recommended central reference only when you add your own fixtures.
- Integration credentials are the recommended auth option over admin user credentials.

## Code check (6.7.13.0)
- confirmed `integration:create` — console command creating an integration, `--admin` option — vendor/shopware/core/Framework/Api/Command/CreateIntegrationCommand.php:18
- confirmed `SHOPWARE_ACCESS_KEY_ID` — printed by integration:create — vendor/shopware/core/Framework/Api/Command/CreateIntegrationCommand.php:56
- confirmed `SHOPWARE_SECRET_ACCESS_KEY` — printed by integration:create — vendor/shopware/core/Framework/Api/Command/CreateIntegrationCommand.php:57
- confirmed `APP_URL` — Shopware env parameter, default empty — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:3
- unverified `SHOPWARE_ADMIN_USERNAME` — read by the ATS npm package, outside vendor/shopware
- unverified `SHOPWARE_ADMIN_PASSWORD` — read by the ATS npm package, outside vendor/shopware
- unverified `MAILPIT_BASE_URL` — read by the ATS npm package, outside vendor/shopware
- unverified `FixtureTypes` — exported by the ATS npm package, outside vendor/shopware
