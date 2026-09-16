---
id: platform/dev/6.6/guides/plugins/plugins/bundle.md
title: Bundle
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/bundle.html
sourceHash: d1ec4876b202ec982e1c9f8f1fa1cf65e6f61828
keywords: ["Shopware\\Core\\Framework\\Bundle", "Symfony\\Component\\HttpKernel\\Bundle\\Bundle", "config/bundles.php", "ThemeInterface", "registerMigrationPath", "database:migrate", "deployment-helper", "shopware-bundles", "services.xml", "routes.xml", "theme.json", "symfony bundle"]
summary: "Using a Symfony/Shopware Bundle instead of a plugin for project code not meant to be managed via the Administration."
lastBuilt: "2026-09-15"
relatedPages: ["platform/dev/6.6/guides/plugins/themes/theme-configuration.md", "platform/dev/6.6/guides/hosting/installation-updates/deployments/deployment-helper.md"]
---
## What it is

A Bundle is the Symfony bundle concept used for project-critical customizations that should not be managed through the Shopware Administration, as plugins are. It is registered in `config/bundles.php` instead of being installed/activated like a plugin.

## When to use

When code belongs to the project itself (not a distributable/manageable extension) but still needs services, twig templates, routes, theme support or migrations.

## Key steps / config

Choose a base class:

- `Shopware\Core\Framework\Bundle` — extends the Symfony bundle, adds theme support, JS/CSS assets, migrations.
- `Symfony\Component\HttpKernel\Bundle\Bundle` — plain Symfony bundle, no Shopware extras.

Create the bundle class under `src/` (registered under the `App\` namespace by default) and register it:

```php
// <project root>/src/YourBundleName.php
namespace App\YourBundleName;
use Shopware\Core\Framework\Bundle;
class YourBundleName extends Bundle {}
```

```php
// <project root>/config/bundles.php
App\YourBundleName\YourBundleName::class => ['all' => true],
```

Add `Resources/config/services.xml`, `Resources/config/routes.xml`, or `Resources/views` for twig — auto-detected. Implement `Shopware\Core\Framework\ThemeInterface` to register the bundle as a theme (optionally with a `theme.json`).

Migrations are not auto-detected; override `build()`:

```php
public function build(ContainerBuilder $container): void
{
    parent::build($container);
    $this->registerMigrationPath($container);
}
```

Run migrations manually with `bin/console database:migrate <BundleName> --all`, or via Deployment Helper's `pre-update` hook in `.shopware-project.yaml`.

For Shopware-CLI to build bundle assets, add it to `composer.json`:

```json
{
    "extra": {
        "shopware-bundles": {
          "src/<BundleName>": { "name": "<BundleName>" }
        }
    }
}
```

## Essential identifiers

- `Shopware\Core\Framework\Bundle`
- `Symfony\Component\HttpKernel\Bundle\Bundle`
- `Shopware\Core\Framework\ThemeInterface`
- `bin/console database:migrate <BundleName> --all`
- `composer.json` `extra.shopware-bundles`
- `config/bundles.php`

## Gotchas

Bundles have no lifecycle, so migrations are never executed automatically — they must be run manually or via a deployment hook. Shopware-CLI does not detect bundles automatically, so bundle assets are not built unless declared in `composer.json`'s `extra.shopware-bundles` section.
