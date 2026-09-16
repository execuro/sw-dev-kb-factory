---
id: platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/using-composer-dependencies.md
title: Adding Composer dependencies
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/plugin-fundamentals/using-composer-dependencies.html
sourceHash: a8fad871140fb710e5b5e1dcf01de40b931e78a9
keywords: ["composer dependencies", "composer.json", "composer require", "executeComposerCommands", "Plugin class", "vendor directory", "private composer dependency", "plugin bundle size"]
summary: "How to add Composer packages to a plugin's composer.json, install them, and bundle the vendor directory with the plugin."
lastBuilt: "2026-09-15"
---
## What it is

Explains how to add Composer dependencies to a Shopware plugin, including private dependencies bundled with the plugin.

## Key steps / config

- Add the dependency to the `require` section of the plugin's `composer.json`, e.g. `"sebastian/exporter": "*"`, then run `composer require sebastian/exporter` in the plugin directory.
- The `vendor` directory (where Composer saves dependencies) must be included in the plugin bundle; the plugin bundle size must not exceed 5 MB.
- To have the plugin's Composer packages installed automatically when the plugin itself is installed, override `executeComposerCommands` on the plugin base class and return `true`:

```php
namespace Swag\BasicExample;

use Shopware\Core\Framework\Plugin;

class SwagBasicExample extends Plugin
{
    public function executeComposerCommands(): bool
    {
        return true;
    }
}
```

- After installing, `use` the dependency's classes directly (no build step needed for PHP), e.g. `use SebastianBergmann\Exporter\Exporter;`.
- Private Composer dependencies can be bundled by placing them under the plugin's `/packages/` folder, then requiring them like any other dependency, e.g. `"my-vendor-name/my-private-dependency": "^1.2.3"`.

## Essential identifiers

- `Shopware\Core\Framework\Plugin::executeComposerCommands()`
- `composer.json` `require` section
- `composer require <package>`
- `/packages/` folder for private dependencies

## Gotchas

The plugin bundle including its `vendor` directory must not exceed a 5 MB size limit.
