---
id: platform/dev/6.7/guides/development/testing/ci.md
title: Continuous Integration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/ci.html
sourceHash: 086199bbd6fdd6ad64f915e6a3766334a8cdcd72
codeCheckedAgainst: "6.7.15.1"
keywords: ["continuous integration", "ci", "pipeline", "static analysis", "phpstan", "coding standards", "shopware-cli formatter", "shopware-cli validation", "project build", "extension build", "artifact promotion", "smoke tests", "store submission"]
summary: CI practices for Shopware projects and plugins - static analysis, formatter/validation, build artifacts once per commit, smoke and DAL integration tests.
lastBuilt: 2026-10-20
relatedPages: ["platform/dev/6.7/guides/hosting/installation-updates/deployments/_index.md", "platform/dev/6.7/products/tools/cli/formatter.md", "platform/dev/6.7/products/tools/cli/validation.md", "platform/dev/6.7/products/tools/cli/project-commands/build.md"]
---
## What it is

Recommendations for Continuous Integration of Shopware custom projects and custom/Store plugins. At a minimum CI should run static analysis and coding standards checks alongside the project or extension build so artifacts stay reproducible, plus sanity checks (smoke tests, lightweight integration tests). Unit, integration and E2E tests where feasible make refactors, upgrades and dependency changes safer. Promotion and release are covered by the [Deployment guide](platform/dev/6.7/guides/hosting/installation-updates/deployments/_index.md).

## When to use

You are setting up or reviewing a CI pipeline for a Shopware project or extension.

## Key steps / config

### Cross-cutting

- Fail fast: run coding standards and static analysis before slower E2E tests.
- Keep code style consistent with the [Shopware CLI formatter](platform/dev/6.7/products/tools/cli/formatter.md) and run the bundled [Shopware CLI validation tools](platform/dev/6.7/products/tools/cli/validation.md) in CI.
- Produce artifacts once per commit (ZIP for plugins, deployment-ready image/package for apps, built assets for projects) and promote the same artifact through all stages.

### Custom projects

- Reuse the [Project build command](platform/dev/6.7/products/tools/cli/project-commands/build.md) to compile Storefront and Administration assets and warm caches; run it in CI so deployments do not rebuild.
- Use environment-specific config only at deployment time, not in CI; mirror the [setup patterns](platform/dev/6.7/guides/installation/_index.md) in pipelines.
- Add smoke tests against the HTTP layer plus DAL-level integration tests for custom entities.
- Cache Composer/NPM dependencies but keep lock files committed for deterministic builds.

### Custom/Store plugins

- Build and validate with the [Extension build command](platform/dev/6.7/products/tools/cli/extension-commands/build.md) so the ZIP is reproducible.
- Run unit/integration tests with the Shopware test environment (core provides `Shopware\Core\TestBootstrapper` for PHPUnit bootstrapping and the `IntegrationTestBehaviour` trait for kernel/DB-backed tests); keep fixtures inside the plugin to avoid coupling to project data.
- For Store plugins, add the Shopware Store validations early (linting, metadata, PHPStan) to catch review issues before [Store submission via CLI](platform/dev/6.7/products/tools/cli/shopware-account-commands/releasing-extension-to-shopware-store.md).

## Essential identifiers

- Shopware CLI formatter, validation, project build, extension build
- `Shopware\Core\TestBootstrapper`, `IntegrationTestBehaviour`
- PHPStan, Composer/NPM lock files

## Gotchas

- Building in CI and again during deployment breaks reproducibility - build once, promote the artifact.
- Environment-specific configuration belongs in deployment, not CI.

## Code check (6.7.15.1)
- confirmed `TestBootstrapper` — PHPUnit bootstrap helper for the Shopware test environment — vendor/shopware/core/TestBootstrapper.php:23
- confirmed `TestBootstrapper::addCallingPlugin()` — registers the plugin under test — vendor/shopware/core/TestBootstrapper.php:206
- confirmed `IntegrationTestBehaviour` — trait for kernel/database-backed integration tests — vendor/shopware/core/Framework/Test/TestCaseBase/IntegrationTestBehaviour.php:5
- unverified `shopware-cli` — formatter, validation and build commands live in Shopware CLI, out of scope
- unverified `PHPStan` — third-party tool, out of scope
