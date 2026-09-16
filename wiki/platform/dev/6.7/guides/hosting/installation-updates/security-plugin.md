---
id: platform/dev/6.7/guides/hosting/installation-updates/security-plugin.md
title: Security Plugin
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/security-plugin.html
sourceHash: b670141ce079a3e6a4d72dc613dc02dbbe50f9c7
codeCheckedAgainst: "6.7.13.0"
keywords: ["SwagPlatformSecurity", "store.shopware.com/swagplatformsecurity", "security plugin", "security fixes", "backport", "GHSA", "security advisory", "composer audit", "ignore-id", "plugin:install", "vulnerability", "dependency check"]
summary: "SwagPlatformSecurity backports Shopware security fixes per GHSA advisory; compatibility, Composer install, fix toggling, composer audit ignore-id setup."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/hosting/installation-updates/extension-management.md"]
---
## What it is

The Shopware 6 Security Plugin (`SwagPlatformSecurity`) is a free, Shopware-maintained plugin that backports security fixes for Shopware's own code to existing installations, so known vulnerabilities can be closed by a plugin update instead of a Shopware update. It does not replace regular updates and does not cover third-party dependencies (Symfony, Twig, etc.).

## When to use

Bridging the time until a proper Shopware update, securing an installation that cannot be updated immediately, or silencing `composer audit` false alarms for advisories the plugin already mitigates.

## Key steps / config

**Compatibility**

| Plugin | Shopware | Maintained |
|---|---|---|
| 4.x | 6.7.x | yes |
| 3.x | 6.6.x | yes |
| 2.x | 6.5.x | yes |
| 1.x | 6.4.x | no |

Each fix declares the Shopware version range it applies to and is loaded only when the installed version is affected, so installing it on a fully patched shop is safe.

**Install**: via the Extension Store in the Administration ("Shopware 6 Security Plugin"), or for CI/multi-server setups through the Shopware Composer Registry (see [extension management](platform/dev/6.7/guides/hosting/installation-updates/extension-management.md)):

```bash
composer require store.shopware.com/swagplatformsecurity
bin/console plugin:refresh
bin/console plugin:install --activate SwagPlatformSecurity
bin/console cache:clear
```

Clear the cache again after every plugin update so new fixes load. Then check dependencies where the project is built:

```bash
composer audit
composer update <package-name> --with-all-dependencies
bin/console cache:clear
```

Update only the packages the audit reports, not a blanket `composer update`.

**Managing fixes**: *Settings > Extensions > Security Plugin* lists each fix (identified by its GHSA id, e.g. `GHSA-9v5m-39wh-5chq`) with description and advisory link. All applicable fixes are active by default. A fix can be deactivated (requires the admin password; reopens the vulnerability). Fix configuration is stored in the database, so it applies to all cluster nodes; the container cache is rebuilt after changes.

**Composer audit integration** — exclude advisories covered by an active fix in `composer.json`:

```json
{
  "config": {
    "policy": {
      "advisories": {
        "ignore-id": {
          "GHSA-9v5m-39wh-5chq": "Mitigated by an active fix in the Security Plugin."
        }
      }
    }
  }
}
```

The plugin page reports whether all covered advisories are excluded, offers a one-click add of missing entries, and warns when an advisory is excluded while its fix is deactivated.

**Dependency check**: the same page compares installed Composer packages against the packagist.org advisory database (package names/versions are transmitted; result cached one hour; `ignore-id` exclusions are not reported).

## Essential identifiers

- `SwagPlatformSecurity`
- `store.shopware.com/swagplatformsecurity`
- `bin/console plugin:refresh`, `bin/console plugin:install --activate SwagPlatformSecurity`, `bin/console cache:clear`
- `composer audit`, `composer update <package-name> --with-all-dependencies`
- `config.policy.advisories.ignore-id`
- *Settings > Extensions > Security Plugin*

## Gotchas

- Installing/updating the plugin does not update Composer dependencies; an outdated `composer.lock` pinning vulnerable Shopware, Symfony or Twig versions stays vulnerable.
- Some vulnerabilities cannot be fixed via the plugin for every version; the advisory then states an update is required.
- Only exclude an advisory while its fix is active; never exclude advisories the plugin does not cover.
- The one-click button writes `composer.json` on the server handling the request; in clusters or read-only CI deployments apply the snippet in the repository, or the next deploy overwrites it.
- In clusters, make sure all nodes refresh their cache after changing fix configuration.
- If a patched dependency is unreachable within current constraints, or the dependency is end-of-life, a Shopware update is required.

## Code check (6.7.13.0)
- confirmed `plugin:refresh` — core console command — vendor/shopware/core/Framework/Plugin/Command/PluginRefreshCommand.php:21
- confirmed `plugin:install` — core console command — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:25
- confirmed `activate` — `--activate` option of plugin:install activates after install — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:50
- unverified `SwagPlatformSecurity` — separate store plugin, not part of vendor/shopware core/storefront/administration
- unverified `cache:clear` — Symfony FrameworkBundle command, out of scope (core only defines `cache:clear:all`/`cache:clear:http`)
- unverified `ignore-id` — Composer configuration, out of scope
