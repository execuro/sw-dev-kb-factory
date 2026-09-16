---
id: platform/dev/6.7/guides/development/testing/ci.md
title: Continuous Integration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/ci.html
sourceHash: 086199bbd6fdd6ad64f915e6a3766334a8cdcd72
codeCheckedAgainst: "6.7.13.0"
keywords: ["continuous integration", "ci", "pipeline", "static analysis", "coding standards", "phpstan", "shopware cli formatter", "shopware cli validation", "project build", "extension build", "smoke tests", "integration tests", "build artifact", "store submission", "IntegrationTestBehaviour"]
summary: CI recommendations for Shopware projects and plugins - static analysis, CLI formatter/validation, build-once artifacts, smoke and integration tests.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/hosting/installation-updates/deployments/_index.md", "platform/dev/6.7/products/tools/cli/project-commands/build.md", "platform/dev/6.7/products/tools/cli/extension-commands/build.md", "platform/dev/6.7/products/tools/cli/validation.md"]
---
## What it is

Guidance on what a Continuous Integration pipeline for a Shopware custom project or a custom/Store plugin should run: at minimum static analysis and coding-standards checks alongside the project or extension build, plus sanity checks (smoke tests, lightweight integration tests) and automated unit/integration/E2E tests where feasible. Promotion and release are covered by the [Deployment guide](platform/dev/6.7/guides/hosting/installation-updates/deployments/_index.md).

## When to use

Setting up or reviewing a CI pipeline for a Shopware 6.7 project repository or a plugin (custom or Shopware Store) so that artifacts stay reproducible and regressions surface before deployment.

## Key steps / config

### Cross-cutting practices

1. Fail fast: run coding standards and static analysis before the slower E2E tests.
2. Keep code style consistent with the [Shopware CLI formatter](platform/dev/6.7/products/tools/cli/formatter.md) and run the bundled [Shopware CLI validation tools](platform/dev/6.7/products/tools/cli/validation.md) in CI.
3. Produce the artifact once per commit and promote that same artifact through all stages:
   - plugins: ZIP
   - apps: deployment-ready image/package
   - projects: built assets

### Custom projects

1. Run the [Project build command](platform/dev/6.7/products/tools/cli/project-commands/build.md) in CI to compile Storefront and Administration assets and warm caches, so deployments do not rebuild.
2. Apply environment-specific configuration only at deployment, not in CI; the [setup patterns](platform/dev/6.7/guides/installation/_index.md) can be mirrored in pipelines.
3. Add smoke tests against the HTTP layer and DAL-level integration tests for custom entities.
4. Cache Composer/NPM dependencies, but keep lock files committed for deterministic builds.

### Custom/Store plugins

1. Build and validate with the [Extension build command](platform/dev/6.7/products/tools/cli/extension-commands/build.md) so the ZIP is reproducible.
2. Run unit/integration tests with the Shopware test environment; keep fixtures inside the plugin to avoid coupling to project data.
3. For Store plugins, add the Shopware Store validations (linting, metadata, PHPStan) early to catch review issues before [Store submission via CLI](platform/dev/6.7/products/tools/cli/shopware-account-commands/releasing-extension-to-shopware-store.md).

## Essential identifiers

- Shopware CLI formatter, Shopware CLI validation
- Shopware CLI project build command, extension build command
- Store submission via Shopware CLI (account commands)
- PHPStan (Store validation step)

## Gotchas

- Rebuilding assets during deployment defeats the "build once, promote the same artifact" rule; build in CI instead.
- Environment-specific config belongs to the deployment step, not the CI build.
- Plugin test fixtures that depend on project data couple the plugin to one shop; keep them in the plugin.

## Code check (6.7.13.0)
- unverified `shopware-cli formatter` — Shopware CLI is a separate tool, not part of vendor/shopware core/storefront/administration
- unverified `shopware-cli validation` — Shopware CLI tool, out of scope of the installed Shopware packages
- unverified `project build command` — Shopware CLI command, out of scope of the installed Shopware packages
- unverified `extension build command` — Shopware CLI command, out of scope of the installed Shopware packages
- confirmed `IntegrationTestBehaviour` — core test-case trait (kernel, DB transaction, cache behaviours) available for integration tests — vendor/shopware/core/Framework/Test/TestCaseBase/IntegrationTestBehaviour.php:5
- confirmed `KernelTestBehaviour` — core trait used by IntegrationTestBehaviour for kernel-booted tests — vendor/shopware/core/Framework/Test/TestCaseBase/IntegrationTestBehaviour.php:11
