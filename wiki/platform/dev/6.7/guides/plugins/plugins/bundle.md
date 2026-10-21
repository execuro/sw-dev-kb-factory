---
id: platform/dev/6.7/guides/plugins/plugins/bundle.md
title: Symfony Bundles
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/bundle.html
sourceHash: 18d3eb5a3b5cca6cebd0419cfe91501afc323fb3
codeCheckedAgainst: "6.7.15.1"
keywords: ["bundle", "symfony bundle", "Shopware\\Core\\Framework\\Bundle", "config/bundles.php", "registerMigrationPath", "database:migrate", "shopware-bundles", "InstalledVersions::isInstalled", "Feature::isActive", "ThemeInterface", "project customization", "plugin alternative", "theme.json"]
summary: Project code as a bundle instead of a plugin - bundles.php registration, migrations, theme interface, shopware-bundles for Shopware CLI.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md", "platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md", "platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md"]
---
## What it is

How to ship project-level customizations as a Symfony bundle instead of a Shopware plugin. Plugins extend bundles and add a lifecycle (install, update, activate, uninstall), automatic migration handling, asset building integration and Administration management. Hierarchy: `Shopware\Core\Framework\Plugin` → `Shopware\Core\Framework\Bundle` → `Symfony\Component\HttpKernel\Bundle\Bundle`. See the [Plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md).

## When to use

Customizing a single project, managed entirely via Composer, not distributed, with no need for a plugin lifecycle or Administration management.

## Key steps / config

1. Pick a base class: `Shopware\Core\Framework\Bundle` (theme support, JS/CSS assets, migrations) or plain `Symfony\Component\HttpKernel\Bundle\Bundle`.
2. Create the class under `src/` in the `App\` namespace (changeable in the project `composer.json`):
   ```php
   namespace App\YourBundleName;
   use Shopware\Core\Framework\Bundle;
   class YourBundleName extends Bundle {}
   ```
3. Register it in `config/bundles.php`: `App\YourBundleName\YourBundleName::class => ['all' => true],`. For optional packages guard it with `Composer\InstalledVersions::isInstalled('vendor/your-bundle-package')`, optionally combined with `Shopware\Core\Framework\Feature::isActive('YOUR_FEATURE_FLAG')` (safe in `bundles.php`).
4. Services, routes and templates load like in a plugin: `Resources/config/services.php`, `Resources/config/routes.php`, `Resources/views`.
5. Theme: implement `Shopware\Storefront\Framework\ThemeInterface` on the bundle class; add `theme.json` for [theme configuration](platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md).
6. Migrations: `Bundle::build()` already calls `registerMigrationPath()` for a `Migration/` directory next to the bundle class. If you override `build()`, keep `parent::build($container);`. Run them manually: `bin/console database:migrate <BundleName> --all`, or via [Deployment Helper](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md) in `.config/shopware-project.yml`:
   ```yaml
   deployment:
     hooks:
       pre-update: |
         bin/console database:migrate <BundleName> --all
   ```
7. Shopware CLI asset builds: declare the bundle in `composer.json`:
   ```json
   { "extra": { "shopware-bundles": { "src/<BundleName>": { "name": "<BundleName>" } } } }
   ```

## Essential identifiers

- `Shopware\Core\Framework\Bundle`, `Symfony\Component\HttpKernel\Bundle\Bundle`
- `Shopware\Storefront\Framework\ThemeInterface`
- `config/bundles.php`, `extra.shopware-bundles`
- `bin/console database:migrate <BundleName> --all`

## Gotchas

- An unguarded `bundles.php` entry for a package that is not installed crashes the app with a class-not-found error.
- Bundles have no lifecycle, so migrations never run automatically.
- Shopware CLI cannot detect bundles; without `shopware-bundles` their assets are not built.
- The docs name the theme interface `Shopware\Core\Framework\ThemeInterface`; that class does not exist - use the Storefront one.
- The docs say migrations are not detected and require overriding `build()`; in 6.7.15.1 the base `build()` already registers them.

## Code check (6.7.15.1)
- absent `Shopware\Core\Framework\ThemeInterface` — not in the code index; the interface is `Shopware\Storefront\Framework\ThemeInterface`
- confirmed `Shopware\Storefront\Framework\ThemeInterface` — marker interface, no members — vendor/shopware/storefront/Framework/ThemeInterface.php:8
- confirmed `Bundle` — abstract, extends Symfony bundle — vendor/shopware/core/Framework/Bundle.php:33
- confirmed `Plugin` — extends `Bundle` — vendor/shopware/core/Framework/Plugin.php:17
- corrected `Bundle::registerMigrationPath()` — docs: must override `build()` to enable migrations; base `build()` calls it already — vendor/shopware/core/Framework/Bundle.php:40
- confirmed `Bundle::registerMigrationPath()` — skips when the migration dir is missing — vendor/shopware/core/Framework/Bundle.php:144
- confirmed `Resources/config/services.*` — loaded by `registerContainerFile()` — vendor/shopware/core/Framework/Bundle.php:238
- confirmed `database:migrate` — command name — vendor/shopware/core/Framework/Migration/Command/MigrationCommand.php:22
- confirmed `--all` — option "no migration timestamp cap" — vendor/shopware/core/Framework/Migration/Command/MigrationCommand.php:57
- confirmed `Feature::isActive()` — static method — vendor/shopware/core/Framework/Feature.php:139
