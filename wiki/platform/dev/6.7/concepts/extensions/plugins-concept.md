---
id: platform/dev/6.7/concepts/extensions/plugins-concept.md
title: Plugins
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/extensions/plugins-concept.html
sourceHash: ac7b46e000a68a1e9cfb1b028a56405e95c43ffa
codeCheckedAgainst: "6.7.13.0"
keywords: ["plugins", "plugin base class", "Shopware\\Core\\Framework\\Plugin", "symfony bundle", "Bundle", "composer package", "shopware-platform-plugin", "plugin lifecycle", "shopware cloud", "extension", "dependency injection"]
summary: Shopware plugin concept - Symfony bundles extending the abstract Plugin base class, shipped as Composer packages; not compatible with Shopware cloud.
lastBuilt: 2026-09-15
---
## What it is

Concept page for Shopware plugins: essentially an extension of Symfony bundles that can provide their own resources (assets, controllers, services, tests). Every plugin extends an abstract base class that offers helpers, e.g. initialising parameters such as the plugin's name and root path in the dependency injection container. Each plugin is also a Composer package and can declare dependencies that way.

## When to use

- Understanding what a plugin is before following the plugin base guide.
- Deciding between a plugin and an app: plugins are deeply integrated and can do nearly everything (e.g. a new user provider or a custom search engine), but do not run in Shopware cloud.

## Key steps / config

- Plugin class extends `Shopware\Core\Framework\Plugin`, which extends `Shopware\Core\Framework\Bundle` (itself a Symfony bundle).
- The base class declares overridable lifecycle hooks with empty default bodies — none is mandatory: `install()`, `postInstall()`, `update()`, `postUpdate()`, `activate()`, `deactivate()`, `uninstall()`. Its constructor is `final`.
- Composer package of type `shopware-platform-plugin`.

```php
class MyPlugin extends \Shopware\Core\Framework\Plugin
{
    public function install(InstallContext $installContext): void { /* ... */ }
}
```

## Essential identifiers

- `Shopware\Core\Framework\Plugin`
- `Shopware\Core\Framework\Bundle`
- Composer `"type": "shopware-platform-plugin"`

## Gotchas

- Plugins are not compatible with Shopware cloud stores; use an app to extend cloud stores.

## Code check (6.7.13.0)
- confirmed `Plugin` — abstract base class every plugin extends — vendor/shopware/core/Framework/Plugin.php:17
- confirmed `Bundle` — extends Symfony bundle — vendor/shopware/core/Framework/Bundle.php:32
- confirmed `Plugin::__construct()` — final, not overridable — vendor/shopware/core/Framework/Plugin.php:22
- confirmed `Plugin::install()` — optional lifecycle hook with empty body — vendor/shopware/core/Framework/Plugin.php:39
- confirmed `Plugin::uninstall()` — optional lifecycle hook with empty body — vendor/shopware/core/Framework/Plugin.php:63
- confirmed `Plugin::getBasePath()` — plugin root path helper — vendor/shopware/core/Framework/Plugin.php:108
- confirmed `shopware-platform-plugin` — Composer package type — vendor/shopware/core/Framework/Plugin/Util/PluginFinder.php:20
