---
id: platform/dev/6.7/guides/plugins/plugins/dependencies/using-composer-dependencies.md
title: Adding Composer Dependencies
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/dependencies/using-composer-dependencies.html
sourceHash: 5f0b28486da44fc5295d6e9f45d64c2093a81edc
codeCheckedAgainst: "6.7.15.1"
keywords: ["executeComposerCommands", "composer require", "composer.json", "vendor directory", "packages folder", "private composer dependency", "third-party php library", "sebastian/exporter", "NavigationPageLoadedEvent", "zip plugin", "static plugin", "bundle dependencies"]
summary: Add PHP packages to a plugin's composer.json require; zip plugins need executeComposerCommands() returning true or bundled vendor/packages.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/dependencies/add-plugin-dependencies.md", "platform/dev/6.7/guides/plugins/plugins/dependencies/using-npm-dependencies.md", "platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md"]
---
## What it is

How a Shopware plugin declares and ships third-party PHP packages (export libraries, PDF generators, API clients) through the `require` section of its `composer.json`, and how those packages get installed depending on how the plugin is deployed.

## When to use

Your plugin code needs a Composer package that Shopware does not already provide.

- **Static or Composer-managed plugins (recommended):** the project's root Composer install resolves the plugin's dependencies — nothing extra to do (see the static plugin approach in the [Plugin Base Guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)).
- **Zip-installed plugins (e.g. Shopware Store):** the project does not resolve them; either let Shopware run Composer on install or bundle the packages.

## Key steps / config

1. Temporarily remove `shopware/core` from the plugin's `require` (otherwise Composer downloads Shopware into the plugin's `vendor`).
2. In the plugin directory run `composer require sebastian/exporter` (example package), then add `shopware/core` back.
3. For zip plugins that should install packages on plugin install, override `executeComposerCommands()` in the plugin base class:

```php
use Shopware\Core\Framework\Plugin;

class SwagBasicExample extends Plugin
{
    public function executeComposerCommands(): bool
    {
        return true;
    }
}
```

4. Use the package directly with `use` statements — no build step. Example: a subscriber for `Shopware\Storefront\Page\Navigation\NavigationPageLoadedEvent` that calls `(new \SebastianBergmann\Exporter\Exporter)->export('hello, world!')` and logs it via `Psr\Log\LoggerInterface` (register it as described in [Listening to events](platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md)).
5. Private dependencies: put them into the plugin's `/packages/` folder and require them normally:

```text
SwagBasicExample/
├── packages/my-private-dependency/{composer.json, src/}
├── src/SwagBasicExample.php
└── composer.json
```

```json
"require": { "my-vendor-name/my-private-dependency": "^1.2.3" }
```

## Essential identifiers

- `Shopware\Core\Framework\Plugin::executeComposerCommands()` (default `false`)
- `composer require <vendor/package>`
- plugin `/packages/` folder for private packages
- `NavigationPageLoadedEvent` (example event)

## Gotchas

- When bundling instead, the `vendor` directory must be part of the plugin bundle; the bundle may not exceed 5 MB.
- With `executeComposerCommands()` returning `true`, Shopware runs `composer require` on install and `composer remove` on uninstall (per the installed code's docblock); requirements are then resolved by that Composer run instead of the plain requirement check.
- See also [Using NPM dependencies](platform/dev/6.7/guides/plugins/plugins/dependencies/using-npm-dependencies.md) and [Adding plugin dependencies](platform/dev/6.7/guides/plugins/plugins/dependencies/add-plugin-dependencies.md).

## Code check (6.7.15.1)
- confirmed `Plugin::executeComposerCommands()` — returns `false` by default — vendor/shopware/core/Framework/Plugin.php:92
- confirmed `composer require` — docblock: run on install, `composer remove` on uninstall — vendor/shopware/core/Framework/Plugin.php:89
- confirmed `executeComposerCommands` — install runs Composer require when true, else validates requirements — vendor/shopware/core/Framework/Plugin/PluginLifecycleService.php:134
- confirmed `NavigationPageLoadedEvent` — Storefront page event class — vendor/shopware/storefront/Page/Navigation/NavigationPageLoadedEvent.php:14
- unverified `SebastianBergmann\Exporter\Exporter` — third-party package, out of scope
- unverified `/packages/` — private package folder handling not found in core Plugin code
- unverified `5 MB` — Store bundle size limit, not enforced in core code
