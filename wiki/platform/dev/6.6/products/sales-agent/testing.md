---
id: platform/dev/6.6/products/sales-agent/testing.md
title: Testing
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/sales-agent/testing.html
sourceHash: b98c299eedb1305c5e5475d3754137d393267300
keywords: ["testing", "unit tests", "vitest", "pnpm run test", "pnpm run test:coverage", "test coverage", "sales agent", "tests directory", "test runner", "pnpm scripts"]
summary: "Sales Agent unit tests use Vitest, live in the tests directory, and run via pnpm run test / pnpm run test:coverage."
lastBuilt: 2026-09-15
---
## What it is

This page documents how unit tests are set up and run for the Sales Agent product. Vitest is used as the test runner.

## Key steps / config

- Tests are located in the `tests` directory.
- Run the unit test suite:
  ```bash
  pnpm run test
  ```
- Run the suite with coverage reporting:
  ```bash
  pnpm run test:coverage
  ```

## Essential identifiers

`pnpm run test`, `pnpm run test:coverage`, `tests` directory, Vitest
