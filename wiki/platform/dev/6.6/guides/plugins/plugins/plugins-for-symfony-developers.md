---
id: platform/dev/6.6/guides/plugins/plugins/plugins-for-symfony-developers.md
title: Plugins for Symfony developers
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/plugins-for-symfony-developers.html
sourceHash: 41ecf3581c608de3e883d7eca5761fc0a8b3cc23
keywords: ["Symfony bundle", "Shopware plugin", "Shopware\\Core\\Framework\\Plugin", "Shopware\\Core\\Framework\\Bundle", "Symfony\\Component\\HttpKernel\\Bundle", "plugin lifecycle", "install", "postInstall", "update", "postUpdate", "uninstall", "activate", "deactivate", "bundle system"]
summary: How a Shopware 6 plugin relates to a Symfony bundle, its class inheritance chain, and the plugin lifecycle methods available.
lastBuilt: 2026-09-15
---
## What it is

This guide is an entry point for developers already familiar with Symfony bundles, explaining how the Shopware Plugin System builds on top of Symfony's Bundle System.

## When to use

Use this to understand the relationship between a Shopware plugin and a Symfony bundle before diving into plugin-specific mechanisms such as dependency injection or event listening.

## Key steps / config

A bundle is Symfony's mechanism for providing additional third-party features — even many of Symfony's own core features (`Twig`, `Security`, `WebProfiler`) ship as bundles. Shopware builds its plugin system on top of this, adding plugin lifecycles and more.

Every Shopware plugin must extend `Shopware\Core\Framework\Plugin`. The inheritance chain is:

```
YourNamespace\PluginName extends
    Shopware\Core\Framework\Plugin extends
        Shopware\Core\Framework\Bundle extends
            Symfony\Component\HttpKernel\Bundle
```

`Shopware\Core\Framework\Bundle` adds support for migrations, filesystem access, events, and themes on top of the Symfony base bundle; `Shopware\Core\Framework\Plugin` adds the extended plugin lifecycle. The plugin's base class can implement these lifecycle methods:

| Lifecycle | Description |
| :--- | :--- |
| `install()` | Executed on plugin install |
| `postInstall()` | Executed after successful plugin install |
| `update()` | Executed on plugin update |
| `postUpdate()` | Executed after successful plugin update |
| `uninstall()` | Executed on plugin uninstallation |
| `activate()` | Executed before plugin activation |
| `deactivate()` | Executed before plugin deactivation |

## Essential identifiers

- `Shopware\Core\Framework\Plugin` — the required base class for a Shopware plugin
- `Shopware\Core\Framework\Bundle` — adds migrations, filesystem, events, themes support
- `Symfony\Component\HttpKernel\Bundle` — Symfony's base bundle class
- lifecycle methods: `install()`, `postInstall()`, `update()`, `postUpdate()`, `uninstall()`, `activate()`, `deactivate()`

## Gotchas

Because every Shopware plugin is internally also a Symfony bundle, Symfony treats and handles it as such; the Shopware-specific classes only add handling for cases like plugin migrations and registering Shopware business events on top of the standard bundle behavior.
