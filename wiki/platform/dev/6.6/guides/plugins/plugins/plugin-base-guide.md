---
id: platform/dev/6.6/guides/plugins/plugins/plugin-base-guide.md
title: Plugin Base Guide
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceHash: 0f1fbd3ffa15f112bd77332a512558b8f639856a
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/plugin-base-guide.html
keywords: ["plugin", "Shopware\\Core\\Framework\\Plugin", "plugin:create", "plugin:refresh", "plugin:install", "composer.json", "shopware-platform-plugin", "shopware-plugin-class", "PSR-4", "custom/plugins", "bin/console", "plugin structure"]
summary: "Walks through creating, structuring, and installing a first Shopware 6 plugin (class, composer.json, console commands)."
lastBuilt: "2026-09-15"
---
## What it is

The base guide for creating a Shopware 6 plugin from scratch: naming it, generating its directory structure, writing its PHP base class and `composer.json`, and installing/activating it.

## When to use

Use this as the starting point before any other plugin-fundamentals guide (services, commands, scheduled tasks, configuration, events) since those all assume a plugin already exists.

## Key steps / config

1. Pick a UpperCamelCase technical name with a vendor prefix (example used throughout: `SwagBasicExample`).
2. Generate the structure with `bin/console plugin:create SwagBasicExample` (optionally with `-c`/`--create-config` to also scaffold a demo configuration file), or create it manually under `custom/plugins/<PluginName>/src/`.
3. Create the plugin base class extending `Shopware\Core\Framework\Plugin`:

```php
namespace Swag\BasicExample;

use Shopware\Core\Framework\Plugin;

class SwagBasicExample extends Plugin
{
}
```

4. Add a `composer.json` at the plugin root with `"type": "shopware-platform-plugin"`, a `require` entry for `shopware/core`, and an `extra.shopware-plugin-class` pointing to the base class:

```json
{
    "name": "swag/basic-example",
    "version": "1.0.0",
    "type": "shopware-platform-plugin",
    "require": { "shopware/core": "~6.6.0" },
    "extra": { "shopware-plugin-class": "Swag\\BasicExample\\SwagBasicExample" },
    "autoload": { "psr-4": { "Swag\\BasicExample\\": "src/" } }
}
```

5. Refresh, install and activate: `php bin/console plugin:refresh`, then `php bin/console plugin:install --activate SwagBasicExample`.

## Essential identifiers

- `Shopware\Core\Framework\Plugin`
- `bin/console plugin:create`
- `bin/console plugin:refresh`
- `bin/console plugin:install --activate`
- `composer.json` fields: `type: shopware-platform-plugin`, `extra.shopware-plugin-class`, `autoload.psr-4`

## Gotchas

The `type` field in `composer.json` must be `shopware-platform-plugin` so Shopware recognizes it as a plugin, and `require` must include at least `shopware/core` for compatibility checking; a warning about the `version` field during `plugin:refresh` can be safely ignored.
