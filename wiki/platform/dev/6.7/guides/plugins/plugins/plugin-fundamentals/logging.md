---
id: platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/logging.md
title: Logging
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/plugin-fundamentals/logging.html
sourceHash: ee3ca00ff5cdfb1d75274ab3c872e5f2fd4ba055
codeCheckedAgainst: "6.7.13.0"
keywords: ["monolog", "monolog.yaml", "monolog.logger.my_plugin_channel", "channels", "handlers", "rotating_file", "Resources/config/packages", "build", "DelegatingLoader", "logging", "log file", "logger channel", "plugin logs"]
summary: "Plugin logging: load Resources/config/packages YAML in the plugin build(), define a Monolog channel and handler, inject monolog.logger.<channel>."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-scheduled-task.md", "platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-custom-commands.md"]
---
## What it is

How a plugin writes its own log messages through Monolog: load package configuration from the plugin, declare a dedicated Monolog channel, route it to a handler, and inject the channel-scoped logger service.

## When to use

When a plugin should log actions or errors to a file for debugging or as a record of performed actions.

## Key steps / config

1. Make the plugin load package config from `Resources/config/packages` by overriding `build()` in the plugin base class (a Symfony bundle requirement; Bundle Extensions are an alternative):

```php
class SwagBasicExample extends Plugin
{
    public function build(ContainerBuilder $container): void
    {
        parent::build($container);
        $locator = new FileLocator('Resources/config');
        $resolver = new LoaderResolver([new YamlFileLoader($container, $locator),
            new GlobFileLoader($container, $locator), new DirectoryLoader($container, $locator)]);
        $confDir = \rtrim($this->getPath(), '/') . '/Resources/config';
        (new DelegatingLoader($resolver))->load($confDir . '/{packages}/*.yaml', 'glob');
    }
}
```

2. Declare a unique channel and a handler in `<plugin root>/src/Resources/config/packages/monolog.yaml`:

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

3. Inject the logger Monolog registers for the channel: service ID `monolog.logger.my_plugin_channel`.

## Essential identifiers

- `Shopware\Core\Framework\Plugin::build()` (inherited from `Shopware\Core\Framework\Bundle`)
- `Symfony\Component\Config\Loader\DelegatingLoader`, `Symfony\Component\DependencyInjection\Loader\YamlFileLoader`, `GlobFileLoader`, `DirectoryLoader`
- `src/Resources/config/packages/monolog.yaml`
- `monolog.channels`, `monolog.handlers`, `rotating_file`
- `monolog.logger.my_plugin_channel`

## Gotchas

- `Shopware\Core\Framework\Bundle::build()` by default loads only `Resources/config/services.*`, not `packages/`; hence the override. Core bundles (e.g. Storefront) instead call the protected `buildDefaultConfig()`, which loads `{packages}/*` and `{packages}/<env>/*` with all config extensions.
- The example loader only handles `*.yaml` files.
- A dedicated channel lets project owners redirect your logs to another handler.

## Code check (6.7.13.0)
- confirmed `Plugin` — extends Shopware Bundle — vendor/shopware/core/Framework/Plugin.php:17
- confirmed `Bundle::build()` — loads services.* only, no packages dir — vendor/shopware/core/Framework/Bundle.php:34
- confirmed `Resources/config/services.*` — container files globbed in build — vendor/shopware/core/Framework/Bundle.php:222
- confirmed `Bundle::buildDefaultConfig()` — protected, loads {packages} config — vendor/shopware/core/Framework/Bundle.php:145
- confirmed `buildDefaultConfig` — used by Storefront bundle build — vendor/shopware/storefront/Storefront.php:29
- confirmed `rotating_file` — handler type used by core prod monolog config — vendor/shopware/core/Framework/Resources/config/packages/prod/monolog.yaml:8
- confirmed `monolog.logger.business_events` — channel logger service id pattern used by core — vendor/shopware/core/Framework/DependencyInjection/services.xml:585
- unverified `monolog.channels` — vendor/symfony/monolog-bundle, out of scope
- unverified `Bundle::getPath()` — Symfony HttpKernel Bundle, out of scope
