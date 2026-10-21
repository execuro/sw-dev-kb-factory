---
id: platform/hubs/shopware-cli.md
title: shopware-cli
summary: "Navigation hub for Shopware CLI (shopware-cli): install, project/extension/Store commands, validation, CI, telemetry, Docker and PaaS."
keywords: ["shopware-cli", "shopware cli", "project ci", "extension validate", "extension fix", "account login", "formatter", "image-proxy", "telemetry", "installation", "store upload", "deployment helper"]
members: ["platform/dev/6.6/guides/hosting/installation-updates/docker.md", "platform/dev/6.6/guides/plugins/apps/starter/add-api-endpoint.md", "platform/dev/6.6/guides/plugins/apps/starter/starter-admin-extension.md", "platform/dev/6.6/products/cli/_index.md", "platform/dev/6.6/products/cli/extension-commands/extract-meta-data.md", "platform/dev/6.6/products/cli/formatter.md", "platform/dev/6.6/products/cli/installation.md", "platform/dev/6.6/products/cli/project-commands/build.md", "platform/dev/6.6/products/cli/project-commands/helper-commands.md", "platform/dev/6.6/products/cli/project-commands/image-proxy.md", "platform/dev/6.6/products/cli/project-commands/project-config-sync.md", "platform/dev/6.6/products/cli/project-commands/remote-extension-managment.md", "platform/dev/6.6/products/cli/shopware-account-commands/authentication.md", "platform/dev/6.6/products/cli/shopware-account-commands/releasing-extension-to-shopware-store.md", "platform/dev/6.6/products/cli/shopware-account-commands/updating-store-page.md", "platform/dev/6.6/products/cli/validation.md", "platform/dev/6.6/resources/guidelines/testing/store/quality-guidelines-apps/_index.md", "platform/dev/6.6/resources/guidelines/testing/store/quality-guidelines-plugins/_index.md", "platform/dev/6.6/resources/tooling/cli/_index.md", "platform/dev/6.7/guides/development/testing/store/quality-guidelines.md", "platform/dev/6.7/guides/development/tooling/_index.md", "platform/dev/6.7/guides/installation/legacy-setups/_index.md", "platform/dev/6.7/guides/upgrades-migrations/administration/_index.md", "platform/dev/6.7/products/paas/shopware-paas/cli-setup.md", "platform/dev/6.7/products/tools/_index.md", "platform/dev/6.7/products/tools/cli/_index.md", "platform/dev/6.7/products/tools/cli/automatic-refactoring.md", "platform/dev/6.7/products/tools/cli/command-types.md", "platform/dev/6.7/products/tools/cli/configuration.md", "platform/dev/6.7/products/tools/cli/extension-commands/extract-meta-data.md", "platform/dev/6.7/products/tools/cli/installation.md", "platform/dev/6.7/resources/references/telemetry.md", "platform/func/configuration/caches-indexes.md"]
lastBuilt: 2026-10-21
---

# shopware-cli

Shopware CLI (`shopware-cli`) is a standalone external tool, separate from `bin/console`, for building, validating, releasing and operating projects and extensions. Its commands fall into three scopes: project, extension and Store (account). Come here when a question involves `shopware-cli` commands, config files, installation, CI usage, or Store release steps, then open the member that matches. In 6.6 the CLI docs live under `products/cli`; in 6.7 they moved to `products/tools/cli`, and the 6.7 pages are the current reference.

## Developer: 6.7

- [Tools](platform/dev/6.7/products/tools/_index.md) — overview of standalone developer tools: Shopware CLI and the native MCP Server.
- [Shopware CLI](platform/dev/6.7/products/tools/cli/_index.md) — what the CLI is, install via Homebrew, APT, GitHub Action or Docker, verifier needs PHP 8.2+.
- [Command Types](platform/dev/6.7/products/tools/cli/command-types.md) — project, extension and Store command scopes.
- [Automatic Refactoring](platform/dev/6.7/products/tools/cli/automatic-refactoring.md) — `extension fix` and `project fix` with rector, eslint, stylelint, symfony-xml.
- [Configuration files](platform/dev/6.7/products/tools/cli/configuration.md) — config file locations, lookup order, legacy root files, local override.
- [Extracting Meta Data](platform/dev/6.7/products/tools/cli/extension-commands/extract-meta-data.md) — get-version, get-name, get-changelog, config-schema for CI.
- [Other Installation Options](platform/dev/6.7/products/tools/cli/installation.md) — DNF, AUR, Nix, devenv, ddev, Docker, source build, environment variables.
- [Tooling](platform/dev/6.7/guides/development/tooling/_index.md) — when to use `bin/console` vs `shopware-cli`, swx, Deployment Helper, IDE plugins.
- [Shopware Tools Telemetry](platform/dev/6.7/resources/references/telemetry.md) — UDP telemetry sent by the tools and opt-out via `DO_NOT_TRACK`.
- [PaaS CLI Setup](platform/dev/6.7/products/paas/shopware-paas/cli-setup.md) — installing the PaaS CLI, login, SSH keys.
- [Quality Guidelines for Store Extensions](platform/dev/6.7/guides/development/testing/store/quality-guidelines.md) — Store review overview and links to requirement pages.
- [Legacy Setups](platform/dev/6.7/guides/installation/legacy-setups/_index.md) — Devenv and Symfony CLI setups kept for reference; Docker via Shopware CLI is recommended.
- [Administration](platform/dev/6.7/guides/upgrades-migrations/administration/_index.md) — admin migration guides, including automatic refactoring with the CLI.

## Developer: 6.6

The 6.6 pages cover the older CLI documentation layout; the 6.7 pages above supersede them where topics overlap (installation, meta data extraction, command overview).

- [Shopware CLI](platform/dev/6.6/products/cli/_index.md) — CLI overview and command scopes.
- [CLI](platform/dev/6.6/resources/tooling/cli/_index.md) — index page for the CLI tooling section.
- [Installation](platform/dev/6.6/products/cli/installation.md) — package managers, Docker, CI integrations, source build.
- [Validation](platform/dev/6.6/products/cli/validation.md) — `extension validate` with `--full` and `--only`.
- [Formatter](platform/dev/6.6/products/cli/formatter.md) — `extension format` / `project format`, `--dry-run`.
- [Extracting Meta Data](platform/dev/6.6/products/cli/extension-commands/extract-meta-data.md) — get-version and get-changelog (older variant of the 6.7 page).
- [Build a complete Project](platform/dev/6.6/products/cli/project-commands/build.md) — `project ci` for deployment builds.
- [Helper Commands](platform/dev/6.6/products/cli/project-commands/helper-commands.md) — create, build, watch, worker, clear-cache, console, generate-jwt, admin-api.
- [Image Proxy](platform/dev/6.6/products/cli/project-commands/image-proxy.md) — `project image-proxy` for missing public files.
- [Project Config synchronization](platform/dev/6.6/products/cli/project-commands/project-config-sync.md) — `project config pull/push`.
- [Remote Extension Management](platform/dev/6.6/products/cli/project-commands/remote-extension-managment.md) — `project extension` commands via the Shopware API.
- [Authentication](platform/dev/6.6/products/cli/shopware-account-commands/authentication.md) — `account login` and CI environment variables.
- [Releasing automated extension to Shopware Store](platform/dev/6.6/products/cli/shopware-account-commands/releasing-extension-to-shopware-store.md) — `account producer extension upload`.
- [Updating Store Page of Extension](platform/dev/6.6/products/cli/shopware-account-commands/updating-store-page.md) — `extension info pull/push` for Store page content.
- [Docker Image](platform/dev/6.6/guides/hosting/installation-updates/docker.md) — production Docker base image and compose setup.
- [Starter Guide - Add an API endpoint](platform/dev/6.6/guides/plugins/apps/starter/add-api-endpoint.md) — App Script Store API endpoint tutorial mentioning the CLI.
- [Starter Guide - Create Admin Extensions](platform/dev/6.6/guides/plugins/apps/starter/starter-admin-extension.md) — app Administration extension tutorial mentioning the CLI.
- [Quality guidelines for apps and themes in the app system](platform/dev/6.6/resources/guidelines/testing/store/quality-guidelines-apps/_index.md) — Store review checklist for apps and themes.
- [Quality guidelines for apps in the plugin system](platform/dev/6.6/resources/guidelines/testing/store/quality-guidelines-plugins/_index.md) — Store review checklist for plugins.

## Merchant

- [Caches Indexes](platform/func/configuration/caches-indexes.md) — self-hosted Caches & Indexes admin module; console commands, with the CLI mentioned only in passing.
