---
id: platform/dev/6.7/guides/development/testing/e2e-playwright/best-practices.md
title: Best Practices
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/best-practices.html
sourceHash: 459e7e8f99173e1f9a25f87832c85781fd0e5541
codeCheckedAgainst: "6.7.13.0"
keywords: ["playwright best practices", "test isolation", "TestDataService", "AdminApiClient", "flaky tests", "test.skip", "trace off", "sensitive data", "credentials", "errors[]", "conventional commits", "acceptance test suite", "e2e testing"]
summary: ATS Playwright best practices - isolation via TestDataService, no reliance on en_GB/EUR or existing data, credentials out of traces, API errors[].
lastBuilt: 2026-09-15
---
## What it is

Rules for writing Shopware acceptance (Playwright E2E) tests with the Acceptance Test Suite (ATS), building on the official Playwright best-practices page. The central principle is test isolation: it prevents flaky behaviour and lets tests run in parallel and on systems with an unknown state.

## When to use

Writing or reviewing ATS/Playwright tests for Shopware, handling credentials in tests, or debugging failing Admin API calls made from tests.

## Key steps / config

### Dos

- Create test data with `TestDataService` (ATS `src/services/TestDataService.ts`); it also cleans up what it created.
- Create all data the test needs — sales channels, customers, users (page fixtures cover most common cases).
- Set required settings explicitly on the user/customer/sales channel.
- Jump directly to detail pages by the ID of created entities; otherwise search by a unique name to filter lists to that one entity.
- When skipping, reference the GitHub issue in the skip call: `test.skip('Blocked by https://[...])`.

### Don'ts

- Do not expect lists/tables or API helper results to contain only one item; use unique IDs/names/criteria.
- Avoid unused fixtures — refactor the test or fixture instead.
- Do not depend on implicit configuration or existing data (rules, flows, categories).
- Do not expect the shop defaults `en_GB` and `EUR`.
- Do not change global settings (anything in Settings not specific to a sales channel, e.g. tax, search); changing your own created sales channel is fine.

### Sensitive data / credentials

Move steps that use credentials into a separate project that runs first, with tracing disabled:

```typescript
projects: [
  { name: 'init', testMatch: /.*\.init\.ts/, use: { trace: 'off' } },
  { /* actual test project */ dependencies: ['init'] },
]
```

### Debugging API calls

Errors are not shown directly; read the response's `errors[]` array:

```typescript
const response = await this.AdminApiClient.post('some/route', { data: { limit: 1, filter: [/* ... */] } });
const responseData = await response.json();
console.log(responseData.errors[0]);
```

## Essential identifiers

- `TestDataService`, `AdminApiClient`
- `test.skip`, Playwright project options `testMatch`, `use.trace`, `dependencies`
- Response `errors[]`

## Gotchas

- System language and default currency are not guaranteed to be `en_GB`/`EUR` — the installed core itself notes the installer can overwrite them.
- Contributions to the ATS repository must use Conventional Commits.

## Code check (6.7.13.0)
- confirmed `Defaults::LANGUAGE_SYSTEM` — docblock warns not to depend on it being en-GB, the installer can overwrite it — vendor/shopware/core/Defaults.php:18
- confirmed `Defaults::CURRENCY` — docblock warns not to depend on it being EUR — vendor/shopware/core/Defaults.php:25
- confirmed `errors` — Admin API error responses are serialised as an `errors` array — vendor/shopware/core/Framework/Api/EventListener/ErrorResponseFactory.php:27
- unverified `TestDataService` — external ATS npm package; no occurrence in vendor/shopware
- unverified `AdminApiClient` — ATS fixture, out of scope of the installed Shopware packages
