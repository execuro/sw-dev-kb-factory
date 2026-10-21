---
id: platform/dev/6.7/products/tools/cli/project-commands/autofix.md
title: Autofixer
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/project-commands/autofix.html
sourceHash: ac9ca8a65599898bb4ac63356de12f9e4fdad0e4
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware-cli project autofix flex", "shopware-cli project autofix composer-plugins", "symfony flex migration", "custom/plugins", "composer plugins", "SHOPWARE_PACKAGIST_TOKEN", "packages.shopware.com", "path repository", "--no-interaction", "--dry-run", "headless", "migrate plugins to composer"]
summary: shopware-cli project autofix - flex migrates a 6.4-style project to Symfony Flex; composer-plugins moves custom/plugins extensions to Composer.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/hosting/installation-updates/extension-management.md"]
---
## What it is

Built-in Shopware CLI auto fixers for project migrations: `project autofix flex` converts a legacy (Shopware 6.4 and earlier) project structure to Symfony Flex, and `project autofix composer-plugins` converts extensions cloned into `custom/plugins` into Composer-managed extensions.

## When to use

- Upgrading a project from 6.4 or earlier to 6.5+ and its structure is still pre-Flex.
- Extensions were copied/cloned into `custom/` and should instead be managed by Composer (version knowledge, dependency resolution, updates). See [extension management](platform/dev/6.7/guides/hosting/installation-updates/extension-management.md).

## Key steps / config

Symfony Flex migration (back up the project first):

```bash
shopware-cli project autofix flex
```

It moves configuration files to the Flex locations, deletes unnecessary configuration files, and updates `composer.json` and `bin/console` to use the new configuration files.

Composer migration:

```bash
shopware-cli project autofix composer-plugins
# headless / CI
export SHOPWARE_PACKAGIST_TOKEN=your-token-here
shopware-cli project autofix composer-plugins --no-interaction
# print the plan only (headless mode only)
shopware-cli project autofix composer-plugins --no-interaction --dry-run
```

Per extension in `custom/`, the command prefers a repository-backed install matching the locally installed version:

1. Shopware Store plugins: required from `packages.shopware.com` when a valid `SHOPWARE_PACKAGIST_TOKEN` is set and that version exists there; local copy removed after `require` succeeds.
2. Extensions available at the exact version on Packagist or another configured Composer repository: required from there; local copy removed.
3. Other extensions with a Composer package name: registered as Composer path repositories — files stay in place, Composer manages them, but no repository-driven updates.
4. Extensions without a Composer package name: skipped.

Modes: interactive wizard in a terminal; headless with `--no-interaction` or when no terminal is attached (typical CI). The command takes no path argument — it works on the closest Shopware project found from the current directory.

Token source: Shopware Account > Shops > Licenses > "..." on any extension > Install via Composer.

## Essential identifiers

- `shopware-cli project autofix flex`
- `shopware-cli project autofix composer-plugins`
- `--no-interaction`, `--dry-run`
- `SHOPWARE_PACKAGIST_TOKEN`, `packages.shopware.com`
- `custom/plugins`, `composer.json`, `bin/console`

## Gotchas

- `project autofix flex` deletes files — have a backup.
- Without `SHOPWARE_PACKAGIST_TOKEN`, a headless run skips the Store lookup; Packagist/other repositories are still checked and unresolved extensions fall back to path repositories, so Store plugins stop receiving updates from `packages.shopware.com`. Set the token in CI.
- `--dry-run` only applies in headless mode.

## Code check (6.7.15.1)
- confirmed `custom/plugins` — default plugin directory of the kernel plugin loader — vendor/shopware/core/Framework/Plugin/KernelPluginLoader/KernelPluginLoader.php:50
- confirmed `PluginFinder::COMPOSER_TYPE` — Composer-installed plugins are discovered by this package type — vendor/shopware/core/Framework/Plugin/KernelPluginLoader/ComposerPluginLoader.php:31
- confirmed `shopware-platform-plugin` — value of the Composer plugin type constant — vendor/shopware/core/Framework/Plugin/Util/PluginFinder.php:20
- confirmed `ComposerPluginLoader` — kernel loader for Composer-managed plugins — vendor/shopware/core/Framework/Plugin/KernelPluginLoader/ComposerPluginLoader.php:15
- unverified `shopware-cli project autofix flex` — Go CLI command, outside the Shopware package roots
- unverified `shopware-cli project autofix composer-plugins` — Go CLI command, out of scope
- unverified `SHOPWARE_PACKAGIST_TOKEN` — read by shopware-cli only, out of scope
