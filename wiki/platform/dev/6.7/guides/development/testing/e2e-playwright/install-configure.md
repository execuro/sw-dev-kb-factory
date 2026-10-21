---
id: platform/dev/6.7/guides/development/testing/e2e-playwright/install-configure.md
title: Install & Configure
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/install-configure.html
sourceHash: 73d319ecae2a65f282c1427dedddb1d35e3c0aba
codeCheckedAgainst: "6.7.15.1"
keywords: ["@shopware-ag/acceptance-test-suite", "APP_URL", "SHOPWARE_ACCESS_KEY_ID", "SHOPWARE_SECRET_ACCESS_KEY", "SHOPWARE_ADMIN_USERNAME", "SHOPWARE_ADMIN_PASSWORD", "MAILPIT_BASE_URL", "BaseTestFile.ts", "playwright.config.ts", "FixtureTypes", "npm init playwright", "ats setup", "e2e test install"]
summary: Setup of the Shopware Acceptance Test Suite - npm install, APP_URL plus integration or admin-user env vars, Mailpit, BaseTestFile.ts extending the ATS test.
lastBuilt: 2026-10-20
relatedPages: ["platform/dev/6.7/guides/development/testing/e2e-playwright/fixtures.md"]
---
## What it is

Setup guide for the Shopware Acceptance Test Suite (ATS): creating a Playwright project, installing the `@shopware-ag/acceptance-test-suite` package, configuring access to the Shopware instance under test, and wiring a base test file.

## When to use

Starting a new E2E test project against a Shopware instance, or preparing an environment to run existing ATS tests locally (including email tests via Mailpit).

## Key steps / config

Install:

```shell
npm init playwright@latest
npm install @shopware-ag/acceptance-test-suite
npm install
npx playwright install
npx playwright install-deps
```

The suite tests any Shopware instance purely through its APIs. Access is configured with environment variables; choose integration credentials (recommended) or an admin user:

```dotenv
APP_URL="<url-to-the-shopware-instance>"
# integration
SHOPWARE_ACCESS_KEY_ID="<your-shopware-integration-id>"
SHOPWARE_SECRET_ACCESS_KEY="<your-shopware-integration-secret>"
# admin user
SHOPWARE_ADMIN_USERNAME="<administrator-user-name>"
SHOPWARE_ADMIN_PASSWORD="<administrator-user-password>"
```

Point Playwright at the same instance in `playwright.config.ts`: `defineConfig({ use: { baseURL: process.env['APP_URL'] } })`.

Mailpit: run a local Mailpit instance (web UI on localhost port 8025, SMTP on port 1025 by default) and set `MAILPIT_BASE_URL` in `playwright.config.ts` to the web UI address; then email tests such as `tests/Mailpit.spec.ts` can run.

Base test file: set `"type": "module",` in `package.json`, then create e.g. `BaseTestFile.ts`:

```typescript
import { test as base } from '@shopware-ag/acceptance-test-suite';
import type { FixtureTypes } from '@shopware-ag/acceptance-test-suite';
export * from '@shopware-ag/acceptance-test-suite';
export const test = base.extend<FixtureTypes>({ /* your fixtures */ });
```

Tests import from it: `import { test, expect } from './../BaseTestFile';` and receive fixtures such as `AdminApiContext` and `DefaultSalesChannel` as test-function arguments (see [fixtures](platform/dev/6.7/guides/development/testing/e2e-playwright/fixtures.md)).

## Essential identifiers

- `@shopware-ag/acceptance-test-suite`
- `APP_URL`, `SHOPWARE_ACCESS_KEY_ID`, `SHOPWARE_SECRET_ACCESS_KEY`, `SHOPWARE_ADMIN_USERNAME`, `SHOPWARE_ADMIN_PASSWORD`, `MAILPIT_BASE_URL`
- `playwright.config.ts`, `BaseTestFile.ts`, `FixtureTypes`

## Gotchas

- The ATS uses Playwright's extension system and works as a drop-in for Playwright; add your own fixtures via a base test file rather than importing the package directly in every test.
- `package.json` must declare `"type": "module"`.

## Code check (6.7.15.1)
- confirmed `APP_URL` — the Shopware instance's own base URL env var — vendor/shopware/core/Maintenance/System/Service/AppUrlVerifier.php:37
- confirmed `client_credentials` — integration access key/secret authenticate via the OAuth client-credentials grant — vendor/shopware/core/Framework/Api/OAuth/ClientRepository.php:50
- unverified `SHOPWARE_ACCESS_KEY_ID` — env var read by the external ATS package, out of scope
- unverified `SHOPWARE_ADMIN_USERNAME` — env var read by the external ATS package, out of scope
- unverified `MAILPIT_BASE_URL` — ATS/Playwright config, out of scope
- unverified `FixtureTypes` — type exported by @shopware-ag/acceptance-test-suite, out of scope
