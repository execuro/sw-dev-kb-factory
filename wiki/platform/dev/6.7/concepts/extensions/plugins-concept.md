---
id: platform/dev/6.7/concepts/extensions/plugins-concept.md
title: Plugins
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/extensions/plugins-concept.html
sourceHash: ac7b46e000a68a1e9cfb1b028a56405e95c43ffa
codeCheckedAgainst: "6.7.15.1"
keywords: ["plugins", "plugin base class", "Shopware\\Core\\Framework\\Plugin", "Bundle", "symfony bundle", "composer package", "shopware-platform-plugin", "composer.json", "dependency injection", "shopware cloud", "extensions"]
summary: "Plugin concept: plugins are Symfony bundles extending Shopware\\Core\\Framework\\Plugin, shipped as Composer packages; not compatible with Shopware cloud."
lastBuilt: 2026-10-20
---
## What it is

Plugins are an extension of Symfony bundles: they can provide their own assets, controllers, services or tests. Every plugin extends an abstract base class, `Shopware\Core\Framework\Plugin`, which provides helpers that initialize parameters such as the plugin's name and root path in the dependency injection container. Each plugin is also a Composer package and can declare dependencies that way.

## When to use

When an extension must run inside the Shopware process with deep integration (the source cites examples like a "new User Provider" or a "custom Search Engine") and the target shop is not a cloud store.

## Key steps / config

- Plugin class: extends `Shopware\Core\Framework\Plugin`, which extends `Shopware\Core\Framework\Bundle` (itself a Symfony `Bundle`). Lifecycle hooks such as `install()`, `update()`, `activate()`, `deactivate()`, `uninstall()` are optional overrides with empty defaults — no member is mandatory.
- Composer package: the plugin's `composer.json` must have `"type": "shopware-platform-plugin"` and an `extra.label`, otherwise plugin discovery reports it as invalid.

## Essential identifiers

- `Shopware\Core\Framework\Plugin`, `Shopware\Core\Framework\Bundle`
- `shopware-platform-plugin` (Composer type)

## Gotchas

- Plugins are not compatible with Shopware cloud stores; use an app there.

## Code check (6.7.15.1)
- confirmed `Plugin` — abstract base class extending `Bundle` — vendor/shopware/core/Framework/Plugin.php:17
- confirmed `Bundle` — extends Symfony `Bundle` (aliased `SymfonyBundle`) — vendor/shopware/core/Framework/Bundle.php:33
- confirmed `Bundle::build()` — registers container file, migrations, filesystems, events — vendor/shopware/core/Framework/Bundle.php:35
- confirmed `Bundle::getContainerPrefix()` — snake-cased plugin name for container parameters — vendor/shopware/core/Framework/Bundle.php:74
- confirmed `Plugin::getBasePath()` — plugin root path — vendor/shopware/core/Framework/Plugin.php:108
- confirmed `Plugin::install()` — optional lifecycle hook with empty body — vendor/shopware/core/Framework/Plugin.php:39
- confirmed `Plugin::executeComposerCommands()` — opt-in `composer require` on install, default false — vendor/shopware/core/Framework/Plugin.php:92
- confirmed `PluginFinder::COMPOSER_TYPE` — value `shopware-platform-plugin` — vendor/shopware/core/Framework/Plugin/Util/PluginFinder.php:20
- confirmed `composer.json` — invalid type or missing `extra.label` rejected — vendor/shopware/core/Framework/Plugin/Util/PluginFinder.php:177
