---
id: platform/dev/6.7/guides/plugins/plugins/bundle.md
title: Symfony Bundles
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/bundle.html
sourceHash: 77b648b739f563c8ca5d8dab37fb2226c304a7a8
codeCheckedAgainst: "6.7.13.0"
keywords: ["Shopware\\Core\\Framework\\Bundle", "Symfony\\Component\\HttpKernel\\Bundle\\Bundle", "storefront theme interface", "config/bundles.php", "registerMigrationPath", "database:migrate", "shopware-bundles", "InstalledVersions::isInstalled", "Feature::isActive", "project customization", "bundle vs plugin", "symfony bundle"]
summary: "Symfony bundle instead of plugin for project code: extend Shopware\\Core\\Framework\\Bundle, register in config/bundles.php, run migrations manually."
lastBuilt: 2026-09-15
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md
  - platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md
  - platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md
  - platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md
---
## What it is

How to build project-level extensions as Symfony bundles instead of Shopware plugins. Plugins extend bundles (`Plugin` → `Shopware\Bundle` → `Symfony\Bundle`) and add a lifecycle (install, update, activate, uninstall), automatic migration handling, asset-building integration and Administration management. See the [Plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md).

## When to use

- Customizing a single project that is not distributed.
- No plugin lifecycle or Administration management needed; everything managed via Composer.

## Key steps / config

1. Choose a base class: `Shopware\Core\Framework\Bundle` (theme support, JS/CSS assets, migrations) or `Symfony\Component\HttpKernel\Bundle\Bundle` (plain Symfony).
2. Create the class under `src/` in the default `App\` namespace (configurable in `composer.json`):

```php
namespace App\YourBundleName;

use Shopware\Core\Framework\Bundle;

class YourBundleName extends Bundle
{
}
```

3. Register in `config/bundles.php`: `App\YourBundleName\YourBundleName::class => ['all' => true],`
4. Optional bundles: wrap the registration in `if (InstalledVersions::isInstalled('vendor/your-bundle-package'))`, optionally `&& Feature::isActive('YOUR_FEATURE_FLAG')` (reads env vars, safe in `bundles.php`); otherwise a missing package causes class-not-found.
5. `Resources/config/services.php`, `Resources/config/routes.php` and `Resources/views` are loaded automatically.
6. Theme: implement the storefront theme marker interface (FQCN under Gotchas); optionally add `theme.json` ([theme configuration](platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md)).
7. Migrations: `Bundle::build()` already calls `registerMigrationPath($container)` for the `Migration/` directory; keep `parent::build($container)` when overriding `build()`. Migrations are not executed automatically: run `bin/console database:migrate <BundleName> --all`, or add it as a `deployment.hooks.pre-update` hook in `.shopware-project.yaml` for the [Deployment Helper](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md).
8. Shopware CLI does not detect bundles; declare them in `composer.json` so assets get built:

```json
{ "extra": { "shopware-bundles": { "src/<BundleName>": { "name": "<BundleName>" } } } }
```

## Essential identifiers

- `Shopware\Core\Framework\Bundle`, `Symfony\Component\HttpKernel\Bundle\Bundle`
- `config/bundles.php`, `theme.json`, `.shopware-project.yaml`
- `Bundle::build()`, `Bundle::registerMigrationPath()`
- `bin/console database:migrate <BundleName> --all`
- `extra.shopware-bundles`

## Gotchas

- The docs name the theme interface `Shopware\Core\Framework\ThemeInterface`; it does not exist. The installed interface is `Shopware\Storefront\Framework\ThemeInterface`, checked by `StorefrontPluginConfigurationFactory`.
- The docs say `build()` must be overridden to register migrations; the base `Bundle::build()` already does this.
- Next: [Dependency Injection](platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md), [Listening to events](platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md).

## Code check (6.7.13.0)
- absent `Shopware\Core\Framework\ThemeInterface` — not in the installed code index; the real interface is Shopware\Storefront\Framework\ThemeInterface (vendor/shopware/storefront/Framework/ThemeInterface.php)
- confirmed `Shopware\Core\Framework\Bundle` — abstract class extending the Symfony bundle — vendor/shopware/core/Framework/Bundle.php:32
- corrected `Bundle::build()` — docs: override build() to enable migrations; base build() already calls registerMigrationPath — vendor/shopware/core/Framework/Bundle.php:36
- confirmed `Bundle::registerMigrationPath()` — protected, registers a MigrationSource if the Migration dir exists — vendor/shopware/core/Framework/Bundle.php:131
- confirmed `database:migrate` — migration console command — vendor/shopware/core/Framework/Migration/Command/MigrationCommand.php:21
- confirmed `Feature::isActive()` — static feature flag check — vendor/shopware/core/Framework/Feature.php:128
- unverified `InstalledVersions::isInstalled()` — Composer runtime API, out of scope
- unverified `shopware-bundles` — read by Shopware CLI, outside the checked vendor roots
