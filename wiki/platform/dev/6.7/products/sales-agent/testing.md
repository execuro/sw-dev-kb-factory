---
id: platform/dev/6.7/products/sales-agent/testing.md
title: Testing
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/sales-agent/testing.html
sourceHash: b98c299eedb1305c5e5475d3754137d393267300
codeCheckedAgainst: "6.7.13.0"
keywords: ["sales agent", "testing", "unit tests", "vitest", "pnpm run test", "pnpm run test:coverage", "coverage", "tests directory", "swagsalesagent"]
summary: "Sales Agent app unit tests use Vitest in the tests directory; run with pnpm run test, coverage report with pnpm run test:coverage."
lastBuilt: 2026-09-15
---
## What it is

How unit tests are organised and run for the Shopware Sales Agent app: Vitest is the test runner and tests live in the `tests` directory.

## When to use

When running or adding unit tests, or generating a coverage report, in the Sales Agent app repository.

## Key steps / config

- Run unit tests: `pnpm run test`
- Run with coverage: `pnpm run test:coverage`

## Essential identifiers

- Test runner: Vitest
- Test location: `tests` directory
- Commands: `pnpm run test`, `pnpm run test:coverage`

## Code check (6.7.13.0)
- unverified `pnpm run test` — script of the separate Sales Agent app repository, not in vendor/shopware
- unverified `pnpm run test:coverage` — app repository script, out of scope
- unverified `tests` — app repository directory, out of scope
