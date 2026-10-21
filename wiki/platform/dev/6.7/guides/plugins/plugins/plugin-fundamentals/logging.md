---
id: platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/logging.md
title: Logging
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/plugin-fundamentals/logging.html
sourceHash: ee3ca00ff5cdfb1d75274ab3c872e5f2fd4ba055
codeCheckedAgainst: "6.7.15.1"
keywords: ["monolog", "monolog.yaml", "monolog.logger.my_plugin_channel", "channels", "handlers", "rotating_file", "Resources/config/packages", "DelegatingLoader", "build", "logger", "log channel", "plugin logging", "log file"]
summary: "Plugin logging with a dedicated Monolog channel - load packages/*.yaml in the plugin build() method, declare the channel and a rotating_file handler."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-scheduled-task.md", "platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-custom-commands.md"]
---
## What it is

How a plugin writes to its own log file: give it a dedicated Monolog channel, route that channel to a handler, and inject the channel-scoped logger service.

## When to use

You want plugin actions or errors logged separately for debugging or auditing, in a way project owners can re-route.

## Key steps / config

1. Make the plugin load package configuration from `Resources/config/packages`. Override `build()` in the plugin base class (`<plugin root>/src/SwagBasicExample.php`, extends `Shopware\Core\Framework\Plugin`), call `parent::build($container)`, then load the glob with a Symfony `DelegatingLoader` over `YamlFileLoader`, `GlobFileLoader` and `DirectoryLoader` (all with `new FileLocator('Resources/config')`):

```php
$confDir = \rtrim($this->getPath(), '/') . '/Resources/config';
$configLoader->load($confDir . '/{packages}/*.yaml', 'glob');
```

This is a Symfony bundle requirement; Bundle Extensions are an alternative.

2. Declare a unique channel and a handler in `<plugin root>/src/Resources/config/packages/monolog.yaml`:

```yaml
monolog:
  channels: ['my_plugin_channel']
  handlers:
    myPluginLogHandler:
      type: rotating_file
      path: "%kernel.logs_dir%/my_plugin_%kernel.environment%.log"
      level: error
      channels: ["my_plugin_channel"]
```

3. Inject the channel logger by service id `monolog.logger.my_plugin_channel`.

## Essential identifiers

- `monolog.channels`, `monolog.handlers`, handler `type: rotating_file`
- `monolog.logger.my_plugin_channel` (service id pattern `monolog.logger.<channel>`)
- `Resources/config/packages/monolog.yaml`
- `Plugin::build()`, `getPath()`

## Gotchas

- In 6.7.15.1 `Bundle::build()` registers services, migrations, filesystems and events only; it does not load `Resources/config/packages`. Core bundles do that through the protected `buildDefaultConfig()`, which plugins do not call by default — hence step 1.
- A separate channel lets project owners redirect your logs to a different handler.

## Code check (6.7.15.1)
- confirmed `Bundle::build()` — no package config loading, only services/migrations/filesystem/events — vendor/shopware/core/Framework/Bundle.php:35
- confirmed `Bundle::buildDefaultConfig()` — loads `{packages}/*`, called by core bundles only — vendor/shopware/core/Framework/Bundle.php:158
- confirmed `Plugin` — abstract base class extending Bundle — vendor/shopware/core/Framework/Plugin.php:17
- confirmed `monolog.logger.business_events` — core uses the `monolog.logger.<channel>` id pattern — vendor/shopware/core/Framework/DependencyInjection/services.php:772
- unverified `rotating_file` — symfony/monolog-bundle, out of scope
- unverified `DelegatingLoader` — vendor/symfony, out of scope
