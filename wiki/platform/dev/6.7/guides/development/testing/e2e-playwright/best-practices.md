---
id: platform/dev/6.7/guides/development/testing/e2e-playwright/best-practices.md
title: Best Practices
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/best-practices.html
sourceHash: 459e7e8f99173e1f9a25f87832c85781fd0e5541
codeCheckedAgainst: "6.7.15.1"
keywords: ["playwright best practices", "test isolation", "TestDataService", "AdminApiClient", "errors[]", "test.skip", "trace off", "sensitive data", "credentials", "flaky tests", "conventional commits", "acceptance test suite"]
summary: Do/don't rules for Shopware Playwright acceptance tests - isolation via TestDataService, hiding credentials from traces, debugging Admin API errors[].
lastBuilt: 2026-10-20
---
## What it is

Guidelines for writing Shopware acceptance (E2E) tests with Playwright and the Shopware Acceptance Test Suite (ATS). The core rule is test isolation, which prevents flakiness and lets tests run in parallel and against systems with unknown state. The source also recommends the official Playwright best-practices page as a first read.

## When to use

Writing or reviewing ATS-based tests, especially when tests are flaky, depend on shop state, handle payment-provider sandbox credentials, or fail on opaque API errors.

## Key steps / config

Dos:

- Create test data with the ATS `TestDataService` (github.com/shopware/acceptance-test-suite, `src/services/TestDataService.ts`); it also cleans up what it created.
- Create everything the test needs — sales channels, customers, users (page fixtures cover most common cases).
- Set required settings explicitly on the user/customer/sales channel.
- Jump straight to detail pages by the ID of the entity you created; otherwise filter lists via search on a unique name.
- When skipping, reference the GitHub issue: `test.skip('Blocked by https://[...])`.

Don'ts:

- Don't expect lists/tables or API helper results to contain only one item; use unique IDs/names/criteria.
- Avoid unused fixtures — refactor the test or fixture.
- Don't depend on implicit configuration or existing data (rules, flows, categories).
- Don't assume the shop defaults `en_GB` and `EUR`.
- Don't change global settings (anything in "Settings" not sales-channel-specific, e.g. tax, search); changing the test's own sales channel is fine.

Sensitive data: move steps using credentials into a separate project that runs first, with tracing disabled, so secrets stay out of logs and traces:

```typescript
projects: [
  { name: 'init', testMatch: /.*\.init\.ts/, use: { trace: 'off' } },
  { /* actual test project */ dependencies: ['init'] },
]
```

Debugging API calls: failed calls are not shown directly; read and log the response's `errors[]` array:

```typescript
const response = await this.AdminApiClient.post('some/route', {
  data: { limit: 1, filter: [{ type: 'equals', field: 'someField', value: 'someValue' }] },
});
console.log((await response.json()).errors[0]);
```

Contributions go to the ATS repository on GitHub (github.com/shopware/acceptance-test-suite) and must follow the Conventional Commits spec.

## Essential identifiers

- `TestDataService`
- `AdminApiClient`
- `errors[]` (API error response array)
- `test.skip`
- Playwright project options `testMatch`, `use.trace: 'off'`, `dependencies`

## Gotchas

- Tests must not rely on the default locale/currency or on pre-existing rules, flows or categories — the instance under test may have an unknown state.

## Code check (6.7.15.1)
- unverified `TestDataService` — part of the external acceptance-test-suite package, out of scope
- unverified `AdminApiClient` — ATS client, out of scope
- confirmed `errors` — API error responses are serialised under an `errors` key — vendor/shopware/core/Framework/Api/EventListener/ErrorResponseFactory.php:27
- confirmed `equals` — filter type parsed by the DAL query string parser — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Parser/QueryStringParser.php:68
