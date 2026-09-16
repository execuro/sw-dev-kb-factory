---
id: platform/dev/6.6/resources/references/adr/2022-25-11-run-lighthouse-test-ine2e-env.md
title: Run Lighthouse tests in E2E env
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-25-11-run-lighthouse-test-ine2e-env.html"
sourceHash: e9b54366511558f3b7c8269645300ea396738616
keywords: ["lighthouse", "APP_ENV=e2e", "APP_ENV=prod", "AdminQueueWorker", "e2e environment", "performance testing", "storefront", "rate limits", "enqueue timeouts"]
summary: "Documents switching Lighthouse tests from APP_ENV=prod to APP_ENV=e2e to deactivate the admin worker and avoid timeouts."
lastBuilt: "2026-09-15"
---
## What it is

ADR documenting the switch of Shopware 6's Lighthouse performance tests from the `prod` application environment to a dedicated `e2e` environment.

## When to use

Relevant when running or interpreting Lighthouse performance tests in CI, or when investigating why Lighthouse results differ between the `prod` and `e2e` environments.

## Key steps / config

- Context: Lighthouse tests previously ran with `APP_ENV=prod`, which meant the AdminQueueWorker was also active — something not recommended for real production setups. After enqueue was removed, Lighthouse also started running into timeouts while the admin worker was used.
- Decision: run Lighthouse tests with `APP_ENV=e2e` instead, which deactivates the admin worker, resolving the timeout issue and producing results the ADR expects to be closer to real production behavior.

## Essential identifiers

- `APP_ENV=e2e`
- `APP_ENV=prod`
- AdminQueueWorker

## Gotchas

Lighthouse tests no longer run in the real `prod` environment. The two environments differ in two ways relevant here: the admin worker is deactivated in `e2e` (closer to real production), and rate limits are also deactivated in `e2e` — though the ADR notes the rate-limit difference is not relevant for the Lighthouse tests themselves.
