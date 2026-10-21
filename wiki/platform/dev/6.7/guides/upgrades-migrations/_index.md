---
id: platform/dev/6.7/guides/upgrades-migrations/_index.md
title: Upgrades and Migrations
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/upgrades-migrations/
sourceHash: 3deec6e3ddaa9d18b17c5c7d04c477832b2c3b7a
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware-cli project upgrade", "upgrade", "migration", "breaking changes", "UPGRADE-6.7.md", "RELEASE_INFO-6.7.md", "deprecations", "feature flags", "extension compatibility", "store plugins", "apps", "version update"]
summary: Overview of Shopware version upgrades - affected layers, a 7-step upgrade workflow, and upgrade strategy for projects, plugins, Store plugins and apps.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/tools/cli/project-commands/upgrade.md", "platform/dev/6.7/guides/upgrades-migrations/administration/_index.md", "platform/dev/6.7/guides/hosting/installation-updates/performing-updates.md", "platform/dev/6.7/guides/upgrades-migrations/upgrade-shopware.md"]
---
## What it is

The entry page for version upgrades of Shopware core and extensions. It covers the migration work needed when moving to a new minor or major version, the layers where breaking changes happen, and strategies that keep upgrade cost low.

## When to use

- You are moving a project to a new Shopware minor or major version.
- You maintain a plugin, Store plugin or app and need to stay compatible across core versions.

## Key steps / config

For a guided local upgrade, use `shopware-cli project upgrade` ([guide](platform/dev/6.7/products/tools/cli/project-commands/upgrade.md)). It checks project readiness and Composer-managed extensions, verifies the target with Composer before modifying files, runs the upgrade locally and writes a shareable report.

Upgrade categories: **APIs** (HTTP contract changes), **Core** (framework, DAL, feature removals, backend behavior), **[Administration](platform/dev/6.7/guides/upgrades-migrations/administration/_index.md)** (Vue, Pinia, Vite, Meteor; these may force major plugin versions), **Storefront** (Twig templates, JS plugins), **App System** (manifest, webhooks), **Hosting & Configuration**.

Typical workflow:

1. Review release notes and UPGRADE files.
2. Check breaking changes per layer (Core / Admin / Storefront / API).
3. Run the Shopware CLI upgrade preflight (non-interactive mode), or otherwise validate extension compatibility and Composer resolution.
4. Apply required migrations and project changes.
5. Rebuild Admin/Storefront assets if needed.
6. Test critical flows and extension behavior.
7. Commit the reviewed changes and deploy through your normal process.

**Custom projects:** follow [Performing updates](platform/dev/6.7/guides/hosting/installation-updates/performing-updates.md). Review [RELEASE_INFO-6.7.md](https://github.com/shopware/shopware/blob/trunk/RELEASE_INFO-6.7.md) and [UPGRADE-6.7.md](https://github.com/shopware/shopware/blob/trunk/UPGRADE-6.7.md) for each release. Use feature toggles to decouple risky changes from deployment.

**Extension developers (general):** avoid internal APIs and undocumented features. Keep dependencies aligned with core, maintain automated tests, keep database migrations idempotent, and track deprecations continuously instead of batching them. The CLI upgrade wizard can also run on a representative Composer-managed test project to find extension updates and blockers. It does not replace testing the extension itself.

- **Custom plugins:** ship migration code for schema/config changes and defaults that work on older cores. Test against the target version matrix and note breaking changes in the README.
- **Store plugins:** align Store metadata (compatibility range, changelog) with the tested core versions. Run Store validation before submission ([Store submission via CLI](platform/dev/6.7/products/tools/cli/shopware-account-commands/releasing-extension-to-shopware-store.md)). Communicate BC breaks and prefer additive changes and feature flags.
- **Apps:** version manifests carefully and broaden compatibility only after testing. Keep webhook/action handlers tolerant of new fields and events.

## Essential identifiers

- `shopware-cli project upgrade`
- `RELEASE_INFO-6.7.md`, `UPGRADE-6.7.md`

## Gotchas

- Upgrade effort depends on the installation. Heavy custom code raises it, and so does a shop with no custom code but 60 Store plugins.

## Code check (6.7.15.1)
- unverified `shopware-cli project upgrade` — Shopware CLI tool, outside the vendor code roots
- unverified `UPGRADE-6.7.md` — repository root file, outside the vendor code roots
- confirmed `Feature::isActive()` — feature-flag check backing the advised feature toggles — vendor/shopware/core/Framework/Feature.php:139
- confirmed `MigrationStep::update()` — non-destructive migration entry point for schema changes — vendor/shopware/core/Framework/Migration/MigrationStep.php:33
- confirmed `MigrationStep::updateDestructive()` — separate destructive migration step — vendor/shopware/core/Framework/Migration/MigrationStep.php:38
