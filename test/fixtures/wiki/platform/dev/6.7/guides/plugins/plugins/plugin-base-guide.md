---
id: platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md
title: Plugin base guide
docType: developer
version: "6.7"
versions: ["6.7", "6.6"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/plugin-base-guide.html
sourceUrls: { "6.7": "https://developer.shopware.com/docs/guides/plugins/plugins/plugin-base-guide.html", "6.6": "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/plugin-base-guide.html" }
sourceHash: b2
keywords: [plugin, bootstrap, composer.json, Plugin class, install, activate]
summary: Create, register and install a plugin skeleton.
lastBuilt: 2026-08-30
---
## What it is

A plugin is a Composer package with a `Plugin` class that Shopware bootstraps.

## When to use

Use a plugin when you need full backend access; use an app otherwise.

## Key steps / config

1. Create `custom/plugins/SwagBasicExample/composer.json`.
2. Add the Plugin class:

```php
<?php declare(strict_types=1);

namespace Swag\BasicExample;

use Shopware\Core\Framework\Plugin;

class SwagBasicExample extends Plugin
{
}
```

### Install and activate

Run `bin/console plugin:refresh` and `bin/console plugin:install --activate SwagBasicExample`.

### Lifecycle hooks

Override `install`, `update`, `uninstall`, `activate`, `deactivate`.

## Essential identifiers

- `Shopware\Core\Framework\Plugin`
- `bin/console plugin:install`

## Gotchas

The plugin name must match the composer `extra.shopware-plugin-class` entry.

## Version notes

Identical for 6.6 and 6.7.
