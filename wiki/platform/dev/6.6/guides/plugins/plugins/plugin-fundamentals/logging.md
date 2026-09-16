---
id: platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/logging.md
title: Logging
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceHash: 5275b11d473c90db36511d0360e33574457467a7
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/plugin-fundamentals/logging.html
keywords: ["logging", "Monolog", "monolog.yaml", "channels", "monolog.logger", "DirectoryLoader", "GlobFileLoader", "YamlFileLoader", "rotating_file", "Resources/config/packages", "build method", "ContainerBuilder"]
summary: "Configure a dedicated Monolog channel and handler for a plugin by loading packages config and defining monolog.yaml."
lastBuilt: "2026-09-15"
---
## What it is

A guide on logging plugin actions or errors to a log file via Monolog, for debugging or recording performed actions.

## When to use

Use this whenever a plugin needs its own log channel separate from the default application log.

## Key steps / config

1. Ensure the plugin loads package configuration from `/Resources/config/packages` by overriding `build()` in the plugin class:

```php
class SwagBasicExample extends Plugin
{
    public function build(ContainerBuilder $container): void
    {
        parent::build($container);
        $locator = new FileLocator('Resources/config');
        $resolver = new LoaderResolver([
            new YamlFileLoader($container, $locator),
            new GlobFileLoader($container, $locator),
            new DirectoryLoader($container, $locator),
        ]);
        $configLoader = new DelegatingLoader($resolver);
        $confDir = \rtrim($this->getPath(), '/') . '/Resources/config';
        $configLoader->load($confDir . '/{packages}/*.yaml', 'glob');
    }
}
```

2. Define a channel in `Resources/config/packages/monolog.yaml`:

```yaml
monolog:
  channels: ['my_plugin_channel']
```

3. Optionally attach a handler to the channel:

```yaml
monolog:
  channels: ['my_plugin_channel']
  handlers:
    myPluginLogHandler:
        type: rotating_file
        path: "%kernel.logs_dir%/my_plugin_%kernel.environment%.log"
        level: error
        channels: [ "my_plugin_channel"]
```

4. Inject the channel-scoped logger service using its service ID: `monolog.logger.my_plugin_channel`.

## Essential identifiers

- `monolog.logger.my_plugin_channel` service id pattern
- `monolog.yaml` keys: `channels`, `handlers`, `type: rotating_file`, `path`, `level`
- `ContainerBuilder::build()`, `YamlFileLoader`, `GlobFileLoader`, `DirectoryLoader`, `DelegatingLoader`

## Gotchas

This build-method requirement is a general Symfony Bundle requirement (loading package config), and can alternatively be achieved via Bundle Extensions; project owners can redirect a plugin's channel to a different one to suit their needs.
