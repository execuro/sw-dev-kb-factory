---
id: platform/dev/6.7/guides/hosting/installation-updates/security-plugin.md
title: Security Plugin
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/security-plugin.html
sourceHash: b670141ce079a3e6a4d72dc613dc02dbbe50f9c7
codeCheckedAgainst: "6.7.15.1"
keywords: ["SwagPlatformSecurity", "security plugin", "security fixes backport", "GHSA", "security advisory", "composer audit", "ignore-id", "plugin:install", "plugin:refresh", "store.shopware.com/swagplatformsecurity", "vulnerability", "dependency check"]
summary: SwagPlatformSecurity backports Shopware security fixes per GHSA advisory; install via Composer, manage fixes, align composer audit ignore-id entries.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/hosting/installation-updates/extension-management.md"]
---
## What it is

The Shopware 6 Security Plugin (`SwagPlatformSecurity`) is a free, Shopware-maintained plugin that backports fixes for vulnerabilities in Shopware's own code to existing installations, so known issues can be closed by a plugin update without upgrading Shopware. It does not replace regular Shopware updates and does not cover third-party dependencies such as Symfony or Twig.

## When to use

- An installation cannot be updated to the latest patch release immediately.
- You need to bridge the time until a proper Shopware update.
- You want `composer audit` to stop reporting advisories that an active plugin fix already mitigates.

## Key steps / config

Compatibility: plugin 4.x for Shopware 6.7.x, 3.x for 6.6.x, 2.x for 6.5.x (all maintained); 1.x for 6.4.x is no longer maintained. Each fix declares the Shopware version range it applies to and is only loaded when the running version is affected, so installing on a fully patched shop is safe.

Install: either through the Extension Store in the Administration ("Shopware 6 Security Plugin"), or, for CI builds / multi-server setups, through the Shopware Composer Registry (see platform/dev/6.7/guides/hosting/installation-updates/extension-management.md):

```bash
composer require store.shopware.com/swagplatformsecurity
bin/console plugin:refresh
bin/console plugin:install --activate SwagPlatformSecurity
bin/console cache:clear
```

Clear the cache again after every plugin update so new fixes are loaded. Then check dependencies where the project is built:

```bash
composer audit
composer update <package-name> --with-all-dependencies
```

Manage fixes under *Settings > Extensions > Security Plugin*: each fix is identified by its GHSA id (e.g. `GHSA-9v5m-39wh-5chq`), links to the advisory, and is active by default. Deactivating a fix requires the administrator password. The fix configuration is stored in the database (applies to all nodes); changing it rebuilds the container cache.

Silence mitigated advisories in the project's `composer.json`:

```json
{
  "config": {
    "policy": {
      "advisories": {
        "ignore-id": { "GHSA-9v5m-39wh-5chq": "Mitigated by an active fix in the Security Plugin." }
      }
    }
  }
}
```

The settings page checks this: it confirms completeness, lists missing entries (offers a one-click add), and warns when an advisory is ignored although its fix is deactivated. It also runs a dependency check against the packagist.org advisory database (package names and versions are sent to packagist.org; result cached one hour; ignored advisories are not reported).

## Essential identifiers

- `SwagPlatformSecurity`, Composer package `store.shopware.com/swagplatformsecurity`
- `plugin:refresh`, `plugin:install --activate`, `cache:clear`
- `composer audit`, `config.policy.advisories.ignore-id`
- *Settings > Extensions > Security Plugin*

## Gotchas

- Installing/updating the plugin does not update Composer dependencies: an outdated Shopware or Symfony/Twig pinned in `composer.lock` stays vulnerable. Update only the packages the audit reports, not a blanket `composer update`.
- Some vulnerabilities cannot be fixed through the plugin for every version; the advisory then states that an update is required.
- The one-click `composer.json` button writes on the server that handles the request; in clusters or read-only CI deployments, apply the snippet in the repository, or the next deploy overwrites it.
- Only ignore an advisory while its fix is active; never ignore advisories the plugin does not cover.
- In a cluster, make sure all nodes refresh their cache after changing the fix configuration.
- If a patched dependency is unreachable within current constraints, or the dependency is end-of-life, a Shopware update is required.

## Code check (6.7.15.1)
- confirmed `plugin:refresh` — core console command — vendor/shopware/core/Framework/Plugin/Command/PluginRefreshCommand.php:22
- confirmed `plugin:install` — core console command — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:28
- confirmed `--activate` — option of plugin:install, activates after installation — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:52
- unverified `SwagPlatformSecurity` — separate store plugin, not part of the installed core/storefront/administration code
- unverified `cache:clear` — Symfony FrameworkBundle command, out of scope
- unverified `composer audit` — Composer CLI, out of scope
