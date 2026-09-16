---
id: "platform/hubs/shopware-cli.md"
title: "shopware-cli"
summary: "Shopware CLI: installation, project/extension/store account commands, validation, formatting, refactoring, and related tooling across 6.6/6.7."
keywords: ["shopware-cli", "cli", "installation", "extension commands", "project commands", "shopware account commands", "validation", "formatter", "automatic refactoring", "store quality guidelines", "docker", "telemetry", "tooling", "app starter guides", "caches and indexes"]
members: ["platform/dev/6.6/guides/hosting/installation-updates/docker.md", "platform/dev/6.6/guides/plugins/apps/starter/add-api-endpoint.md", "platform/dev/6.6/guides/plugins/apps/starter/starter-admin-extension.md", "platform/dev/6.6/products/cli/_index.md", "platform/dev/6.6/products/cli/extension-commands/extract-meta-data.md", "platform/dev/6.6/products/cli/formatter.md", "platform/dev/6.6/products/cli/installation.md", "platform/dev/6.6/products/cli/project-commands/build.md", "platform/dev/6.6/products/cli/project-commands/helper-commands.md", "platform/dev/6.6/products/cli/project-commands/image-proxy.md", "platform/dev/6.6/products/cli/project-commands/project-config-sync.md", "platform/dev/6.6/products/cli/project-commands/remote-extension-managment.md", "platform/dev/6.6/products/cli/shopware-account-commands/authentication.md", "platform/dev/6.6/products/cli/shopware-account-commands/releasing-extension-to-shopware-store.md", "platform/dev/6.6/products/cli/shopware-account-commands/updating-store-page.md", "platform/dev/6.6/products/cli/validation.md", "platform/dev/6.6/resources/guidelines/testing/store/quality-guidelines-apps/_index.md", "platform/dev/6.6/resources/guidelines/testing/store/quality-guidelines-plugins/_index.md", "platform/dev/6.6/resources/tooling/cli/_index.md", "platform/dev/6.7/guides/development/testing/store/quality-guidelines.md", "platform/dev/6.7/guides/development/tooling/_index.md", "platform/dev/6.7/guides/installation/legacy-setups/_index.md", "platform/dev/6.7/products/tools/_index.md", "platform/dev/6.7/products/tools/cli/_index.md", "platform/dev/6.7/products/tools/cli/automatic-refactoring.md", "platform/dev/6.7/products/tools/cli/command-types.md", "platform/dev/6.7/products/tools/cli/extension-commands/admin-watcher.md", "platform/dev/6.7/products/tools/cli/extension-commands/configuration.md", "platform/dev/6.7/products/tools/cli/extension-commands/extract-meta-data.md", "platform/dev/6.7/products/tools/cli/installation.md", "platform/dev/6.7/resources/references/telemetry.md", "platform/func/configuration/caches-indexes.md"]
lastBuilt: "2026-09-15"
---

This hub covers `shopware-cli`, the external command-line tool for building, validating and
releasing Shopware projects and extensions, plus the docs that reference or complement it
(Docker deployment, App-system starter guides, Store quality guidelines, and the wider
tooling landscape). Come here instead of grepping when you need to pick the right
`shopware-cli` command scope (project / extension / store account), check install options
for a given platform, or find which quality-guideline/tooling page applies to a given
Shopware version.

Between 6.6 and 6.7 the CLI reference docs were reorganized from `products/cli/*` to
`products/tools/cli/*`; the `_index.md`, `installation.md` and `extension-commands/extract-meta-data.md`
pages exist in both trees covering the same commands under the new location — treat the 6.7
copy as the current structure and the 6.6 copy as the same content at the older path.

Developer — Shopware CLI (6.6, `products/cli/*`):
- [Shopware CLI](platform/dev/6.6/products/cli/_index.md) — project, extension, and store command scopes overview.
- [Installation](platform/dev/6.6/products/cli/installation.md) — package managers, Docker, CI, manual binary, or source build.
- [Formatter](platform/dev/6.6/products/cli/formatter.md) — `extension format`/`project format` for PHP, JS, CSS/SCSS, Admin Twig.
- [Validation](platform/dev/6.6/products/cli/validation.md) — `extension validate` linting with `--full`/`--only`.
- [Extracting Meta Data](platform/dev/6.6/products/cli/extension-commands/extract-meta-data.md) — `get-version`/`get-changelog` for CI/CD.
- [Build a complete Project](platform/dev/6.6/products/cli/project-commands/build.md) — `project ci` deployment builds.
- [Helper Commands](platform/dev/6.6/products/cli/project-commands/helper-commands.md) — create, storefront/admin build & watch, worker, clear-cache, console, generate-jwt.
- [Image Proxy](platform/dev/6.6/products/cli/project-commands/image-proxy.md) — `project image-proxy` local asset server/cache.
- [Project Config synchronization](platform/dev/6.6/products/cli/project-commands/project-config-sync.md) — `config pull`/`push` for theme, system config, entities.
- [Remote Extension Management](platform/dev/6.6/products/cli/project-commands/remote-extension-managment.md) — `extension {list,install,uninstall,update,outdated,upload,delete}` via the API.
- [Authentication](platform/dev/6.6/products/cli/shopware-account-commands/authentication.md) — `account login` and CI env vars.
- [Releasing automated extension to Shopware Store](platform/dev/6.6/products/cli/shopware-account-commands/releasing-extension-to-shopware-store.md) — `account producer extension upload`.
- [Updating Store Page of Extension](platform/dev/6.6/products/cli/shopware-account-commands/updating-store-page.md) — `account producer extension info pull`/`push`.
- [CLI](platform/dev/6.6/resources/tooling/cli/_index.md) — CLI section index in tooling reference docs.

Developer — Shopware CLI (6.7, `products/tools/cli/*`):
- [Shopware CLI](platform/dev/6.7/products/tools/cli/_index.md) — projects, Docker dev env, build/validate/package, Store upload, CI/CD.
- [Command Types](platform/dev/6.7/products/tools/cli/command-types.md) — project/extension/store command scopes.
- [Automatic Refactoring](platform/dev/6.7/products/tools/cli/automatic-refactoring.md) — `extension fix`/`project fix` with rector, eslint, admin-twig, stylelint, symfony-xml.
- [Standalone Admin Watcher](platform/dev/6.7/products/tools/cli/extension-commands/admin-watcher.md) — `extension admin-watch`/`project admin-watch`.
- [Configuration](platform/dev/6.7/products/tools/cli/extension-commands/configuration.md) — `.shopware-extension.yml` options and CLI environment variables.
- [Extracting Meta Data](platform/dev/6.7/products/tools/cli/extension-commands/extract-meta-data.md) — `get-version`, `get-name`, `get-changelog`, `config-schema`.
- [Other Installation Options](platform/dev/6.7/products/tools/cli/installation.md) — DNF, AUR, Nix, devenv, CI images, ddev, Docker, source build.
- [Tools](platform/dev/6.7/products/tools/_index.md) — index of standalone tools: Shopware CLI and the MCP Server.
- [Tooling](platform/dev/6.7/guides/development/tooling/_index.md) — when to use `bin/console` vs `shopware-cli` vs `swx` and other tools.
- [Legacy Setups](platform/dev/6.7/guides/installation/legacy-setups/_index.md) — Devenv/Symfony CLI setups kept for reference; Docker or Shopware CLI recommended.
- [Shopware Tools Telemetry](platform/dev/6.7/resources/references/telemetry.md) — usage data sent by Shopware CLI, Deployment Helper, Web Installer; opt out via `DO_NOT_TRACK`.

Developer — related guides and Store quality guidelines:
- [Docker Image](platform/dev/6.6/guides/hosting/installation-updates/docker.md) — production Docker base image, tags, PHP extensions, `compose.yaml`.
- [Starter Guide - Add an API endpoint](platform/dev/6.6/guides/plugins/apps/starter/add-api-endpoint.md) — App Script Store API endpoint tutorial.
- [Starter Guide - Create Admin Extensions](platform/dev/6.6/guides/plugins/apps/starter/starter-admin-extension.md) — Administration UI extension via `manifest.xml` `base-app-url`.
- [Quality guidelines for apps and themes in the app system](platform/dev/6.6/resources/guidelines/testing/store/quality-guidelines-apps/_index.md) — Store review checklist for the app system.
- [Quality guidelines for apps in the plugin system](platform/dev/6.6/resources/guidelines/testing/store/quality-guidelines-plugins/_index.md) — Store review checklist for the plugin system.
- [Quality Guidelines for Store Extensions](platform/dev/6.7/guides/development/testing/store/quality-guidelines.md) — 6.7 overview of the Store review process and topic map, superseding the split 6.6 app/plugin checklists.
- [Caches Indexes](platform/func/configuration/caches-indexes.md) — self-hosted Caches & Indexes admin module, `cache:clear`/`cache:warmup`/`dal:refresh:index`, referencing Shopware CLI for cache tasks.
</content>
