---
id: platform/dev/6.7/products/sales-agent/testing.md
title: Testing
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/sales-agent/testing.html
sourceHash: b98c299eedb1305c5e5475d3754137d393267300
codeCheckedAgainst: "6.7.15.1"
keywords: ["sales agent", "testing", "unit tests", "vitest", "pnpm run test", "pnpm run test:coverage", "coverage", "tests directory", "test runner", "javascript tests"]
summary: Sales Agent unit tests use Vitest, live in the tests directory, and run with pnpm run test; pnpm run test:coverage produces a coverage report.
lastBuilt: 2026-10-21
---
## What it is

This page covers how unit tests work in the Shopware Sales Agent project. Tests use Vitest and live in the project's `tests` directory.

## When to use

Use it to run or extend the Sales Agent's unit tests, or to get a coverage report before you submit a change.

## Key steps / config

1. Put unit tests in the `tests` directory. Vitest is the test runner.
2. Run the unit tests:

   ```bash
   pnpm run test
   ```

3. Run the tests and generate a coverage report:

   ```bash
   pnpm run test:coverage
   ```

## Essential identifiers

- `pnpm run test`: runs the unit tests
- `pnpm run test:coverage`: runs the tests with coverage
- `tests`: the directory that holds the tests
- Vitest: the unit test framework

## Code check (6.7.15.1)
- unverified `pnpm run test` — script of the standalone Sales Agent project, not part of vendor/shopware core, storefront or administration
- unverified `pnpm run test:coverage` — script of the standalone Sales Agent project, outside the checked package roots
- unverified `tests` — directory of the Sales Agent repository, outside the checked package roots
