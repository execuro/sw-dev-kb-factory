---
id: platform/dev/6.7/products/tools/cli/project-commands/autofix.md
title: Autofixer
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/project-commands/autofix.html
sourceHash: "ac9ca8a65599898bb4ac63356de12f9e4fdad0e4"
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware-cli project autofix flex", "shopware-cli project autofix composer-plugins", "symfony flex", "SHOPWARE_PACKAGIST_TOKEN", "--no-interaction", "--dry-run", "custom/plugins", "composer migration", "path repository", "packages.shopware.com", "project migration", "autofixer"]
summary: "shopware-cli project autofix flex (legacy to Symfony Flex) and composer-plugins (custom/plugins to Composer), headless mode and SHOPWARE_PACKAGIST_TOKEN."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/hosting/installation-updates/extension-management.md"]
---
## What it is

Shopware CLI's built-in auto fixers for project migrations: converting a pre-6.5 project to Symfony Flex, and migrating extensions cloned into `custom/plugins` to Composer-managed packages.

## When to use

- Upgrading a Shopware 6.4-or-earlier project (no Symfony Flex) to 6.5+.
- Replacing manually cloned store extensions with Composer management (see [extension management](platform/dev/6.7/guides/hosting/installation-updates/extension-management.md)).

## Key steps / config

### Migrate to Symfony Flex

```bash
shopware-cli project autofix flex
```

Moves configuration files to their Flex locations, deletes unnecessary configuration files, and updates `composer.json` and `bin/console` to use the new configuration files. Take a backup first.

### Migrate custom/plugins extensions to Composer

```bash
shopware-cli project autofix composer-plugins
```

For each extension in `custom/`, it prefers a repository-backed install matching the locally installed version:

- Shopware Store plugins: required from `packages.shopware.com` if a valid `SHOPWARE_PACKAGIST_TOKEN` is available and the version exists there; local copy removed after `require` succeeds.
- Extensions available at the exact version from Packagist or another configured Composer repository: required from there; local copy removed.
- Other extensions with a Composer package name: registered as Composer path repositories (files stay in place; no repository-driven updates).
- Extensions without a Composer package name: skipped.

No path argument; it works on the closest Shopware project from the current directory.

Modes:
- In a terminal: interactive wizard.
- With `--no-interaction` or no TTY (CI): headless.

```bash
export SHOPWARE_PACKAGIST_TOKEN=your-token-here
shopware-cli project autofix composer-plugins --no-interaction
shopware-cli project autofix composer-plugins --no-interaction --dry-run
```

`--dry-run` prints the migration plan without modifying the project (headless mode only).

## Essential identifiers

- `shopware-cli project autofix flex`
- `shopware-cli project autofix composer-plugins`
- `--no-interaction`, `--dry-run`
- `SHOPWARE_PACKAGIST_TOKEN`

## Gotchas

- `project autofix flex` deletes configuration files — back up the project.
- Without `SHOPWARE_PACKAGIST_TOKEN`, headless runs skip the Store lookup; Store plugins then fall back to path repositories when possible and stop receiving updates from `packages.shopware.com`.
- Token location: Shopware Account "Shops" > "Licenses" > "..." on any extension > "Install via Composer".

## Version notes

- Shopware 6.4 and earlier used a project structure without Symfony Flex; 6.5+ expects Flex.

## Code check (6.7.13.0)
- confirmed `custom/plugins` — core's kernel plugin loader defaults the plugin directory to this path — vendor/shopware/core/Framework/Plugin/KernelPluginLoader/KernelPluginLoader.php:50
- confirmed `custom/plugins/` — core treats plugins under this path as locally installed — vendor/shopware/core/Framework/Plugin/PluginEntity.php:145
- unverified `project autofix flex` — implemented in shopware-cli (Go), out of scope
- unverified `project autofix composer-plugins` — implemented in shopware-cli (Go), out of scope
- unverified `SHOPWARE_PACKAGIST_TOKEN` — read by shopware-cli, not referenced in vendor/shopware
- unverified `--dry-run` — shopware-cli flag, out of scope
