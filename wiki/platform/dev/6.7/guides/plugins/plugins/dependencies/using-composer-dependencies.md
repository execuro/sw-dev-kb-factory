---
id: platform/dev/6.7/guides/plugins/plugins/dependencies/using-composer-dependencies.md
title: Adding Composer Dependencies
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/dependencies/using-composer-dependencies.html
sourceHash: 5f0b28486da44fc5295d6e9f45d64c2093a81edc
codeCheckedAgainst: "6.7.13.0"
keywords: ["composer.json", "composer require", "executeComposerCommands", "Shopware\\Core\\Framework\\Plugin", "shopware/core", "vendor directory", "packages folder", "private composer dependency", "php library", "third-party package", "zip plugin", "plugin dependencies"]
summary: "Declare PHP packages in a plugin's composer.json; override Plugin::executeComposerCommands() for zip plugins or bundle vendor/ or packages/ folder."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/dependencies/using-npm-dependencies.md", "platform/dev/6.7/guides/plugins/plugins/dependencies/add-plugin-dependencies.md", "platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md"]
---
## What it is

How a Shopware plugin declares and ships third-party PHP packages (export libraries, PDF generators, API clients) through the `require` section of its own `composer.json`.

## When to use

Your plugin code needs a PHP library that is not part of Shopware. How it gets installed depends on the plugin setup:

- **Static or Composer-managed plugins (recommended):** the project's root Composer install resolves the plugin's dependencies automatically; nothing else to do (see [plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)).
- **Zip-installed plugins (e.g. Shopware Store):** the project does not resolve them. Either let Shopware run Composer during install via `executeComposerCommands()`, or bundle the packages with the plugin.

## Key steps / config

1. Temporarily remove the `shopware/core` entry from `require` in the plugin's `composer.json` (otherwise Composer downloads Shopware into the plugin's `vendor` directory).
2. In the plugin directory run `composer require sebastian/exporter` (example package). This adds it to `require` and installs it.
3. Put the `shopware/core` requirement back.
4. Either ship the plugin's `vendor` directory in the bundle, or let Shopware run Composer by overriding the base-class method:

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

With `true`, the lifecycle service runs `composer require <plugin composer name>` against the project on install/update and `composer remove` on uninstall.

5. Use the library directly with `use` statements (no build step), e.g. `SebastianBergmann\Exporter\Exporter` inside a subscriber on `NavigationPageLoadedEvent` (see [listening to events](platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md)).

### Private (bundled) dependencies

Place packages in the plugin's `/packages/` folder, then require them like any dependency:

```text
SwagBasicExample
├── packages/my-private-dependency/{composer.json, src/}
├── src/SwagBasicExample.php
└── composer.json

"require": { "my-vendor-name/my-private-dependency": "^1.2.3" }
```

## Essential identifiers

- `Shopware\Core\Framework\Plugin::executeComposerCommands()` (returns `bool`, default `false`)
- `composer require sebastian/exporter`
- `shopware/core` (composer requirement)
- `Shopware\Storefront\Page\Navigation\NavigationPageLoadedEvent`
- `/packages/` plugin folder

## Gotchas

- When bundling, the `vendor` directory must be included in the plugin bundle, and the bundle may not exceed 5 MB.
- The composer run requires the plugin's `composer.json` to define a `name`; otherwise installation throws a composer.json-invalid error.
- In a cluster setup (`shopware.deployment.cluster_setup`), Shopware skips the runtime `composer require` even when `executeComposerCommands()` returns `true`.
- If `executeComposerCommands()` returns `false`, plugin requirements are validated instead of being installed.

## Code check (6.7.13.0)
- confirmed `Plugin::executeComposerCommands()` — base method returns false by default — vendor/shopware/core/Framework/Plugin.php:92
- confirmed `executeComposerRequireWhenNeeded` — install runs composer require when the method returns true, else validates requirements — vendor/shopware/core/Framework/Plugin/PluginLifecycleService.php:135
- confirmed `executeComposerRemoveCommand` — uninstall runs composer remove when true — vendor/shopware/core/Framework/Plugin/PluginLifecycleService.php:256
- confirmed `executeComposerCommands` — update re-runs composer require when true — vendor/shopware/core/Framework/Plugin/PluginLifecycleService.php:285
- confirmed `shopware.deployment.cluster_setup` — skips runtime composer require — vendor/shopware/core/Framework/Plugin/PluginLifecycleService.php:761
- confirmed `composerJsonInvalid` — thrown when the plugin composer.json has no name — vendor/shopware/core/Framework/Plugin/PluginLifecycleService.php:767
- confirmed `CommandExecutor::require()` — runs composer require with the plugin composer name in the project dir — vendor/shopware/core/Framework/Plugin/Composer/CommandExecutor.php:32
- confirmed `NavigationPageLoadedEvent` — storefront page event class — vendor/shopware/storefront/Page/Navigation/NavigationPageLoadedEvent.php:11
- unverified `/packages/` — private package path repository is configured outside the checked vendor roots
- unverified `5 MB` — bundle size limit is enforced by the Store, not in the checked vendor roots
