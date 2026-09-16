---
id: platform/dev/6.7/guides/upgrades-migrations/_index.md
title: Upgrades and Migrations
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/upgrades-migrations/
sourceHash: 3deec6e3ddaa9d18b17c5c7d04c477832b2c3b7a
codeCheckedAgainst: "6.7.13.0"
keywords: ["upgrade", "migration", "shopware-cli project upgrade", "UPGRADE-6.7.md", "RELEASE_INFO-6.7.md", "breaking changes", "deprecations", "version update", "feature flags", "extension compatibility", "store plugins", "apps", "MigrationStep"]
summary: "Shopware version upgrades overview: change categories, 7-step workflow, shopware-cli project upgrade, strategy for plugins, Store plugins and apps."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/tools/cli/project-commands/upgrade.md", "platform/dev/6.7/guides/upgrades-migrations/upgrade-shopware.md", "platform/dev/6.7/guides/hosting/installation-updates/performing-updates.md", "platform/dev/6.7/guides/development/_index.md"]
---
## What it is

Section index for version-based upgrades of Shopware core and extensions: what categories of breaking changes exist, the typical upgrade workflow, and strategies that reduce upgrade cost for custom projects, plugins, Store plugins and apps.

## When to use

Before moving a project or extension to a new minor or major Shopware version, to understand breaking changes, required adjustments and compatibility requirements.

## Key steps / config

For a guided local upgrade use `shopware-cli project upgrade` ([Upgrade a Shopware Project](platform/dev/6.7/products/tools/cli/project-commands/upgrade.md)): it checks project readiness and Composer-managed extensions, verifies the target with Composer before touching project files, runs the upgrade locally and writes a shareable report.

Change categories: **APIs** (HTTP/API contracts), **Core** (framework, DAL, feature removals, backend behavior), **[Administration](platform/dev/6.7/guides/upgrades-migrations/administration/_index.md)** (Vue/Pinia/Vite/Meteor upgrades — may force major version updates of affected plugins), **Storefront** (Twig templates, JS plugins), **App System** (manifest, webhooks), **Hosting & Configuration**.

Typical workflow:

1. Review release notes and UPGRADE files.
2. Check breaking changes per layer (Core / Admin / Storefront / API).
3. Run the Shopware CLI upgrade preflight (non-interactive) or otherwise validate extension compatibility and Composer resolution.
4. Apply required migrations and project changes.
5. Rebuild Admin/Storefront assets if needed.
6. Test critical flows and extension behavior.
7. Commit reviewed changes and deploy through the normal process.

Custom projects: follow [Performing updates](platform/dev/6.7/guides/hosting/installation-updates/performing-updates.md) (see also [Upgrade Shopware](platform/dev/6.7/guides/upgrades-migrations/upgrade-shopware.md)); read `RELEASE_INFO-6.7.md` and `UPGRADE-6.7.md` in the shopware/shopware GitHub repository per release; use feature toggles to decouple risky changes from deployment.

Extension developers: avoid internal APIs and undocumented features, align dependencies with core, keep automated tests, keep database migrations idempotent, track deprecations continuously. The CLI upgrade wizard can run against a representative Composer test project to list updates and blockers, but does not replace testing the extension itself.

- Custom plugins: ship migration code for schema/config changes; keep defaults working on older cores until support is dropped; test against the target version matrix; note breaks in the README.
- Store plugins: align Store compatibility range and changelog with tested versions; run Store validation before submission ([Store submission via CLI](platform/dev/6.7/products/tools/cli/shopware-account-commands/releasing-extension-to-shopware-store.md)); communicate BC breaks; prefer additive changes and feature flags.
- Apps: version manifests carefully (broaden compatibility only after testing); keep webhook/action handlers tolerant to new fields and events.

## Essential identifiers

- `shopware-cli project upgrade`
- `UPGRADE-6.7.md`, `RELEASE_INFO-6.7.md`
- Feature flags: `Shopware\Core\Framework\Feature` (`Feature::isActive()`)
- Plugin migrations: `Shopware\Core\Framework\Migration\MigrationStep`

## Gotchas

- Complexity depends on the installation: heavy custom code, or no custom code but around 60 Store plugins, can be equally hard to upgrade.

## Code check (6.7.13.0)
- confirmed `Feature` — core feature flag class — vendor/shopware/core/Framework/Feature.php:15
- confirmed `Feature::isActive()` — static feature-flag check — vendor/shopware/core/Framework/Feature.php:128
- confirmed `MigrationStep` — abstract base for database migrations — vendor/shopware/core/Framework/Migration/MigrationStep.php:17
- confirmed `MigrationStep::update()` — abstract, required per migration — vendor/shopware/core/Framework/Migration/MigrationStep.php:33
- unverified `shopware-cli project upgrade` — external Shopware CLI, out of scope
- unverified `UPGRADE-6.7.md` — repository root file, not in the checked vendor roots
