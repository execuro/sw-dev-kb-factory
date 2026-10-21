---
id: platform/dev/6.7/guides/plugins/plugins/framework/filesystem/filesystem.md
title: Filesystem - Flysystem
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/filesystem/filesystem.html
sourceHash: 566c2bbaaa05de78d5a5e6a1a4abeebe018778e5
codeCheckedAgainst: "6.7.15.1"
keywords: ["flysystem", "FilesystemOperator", "League\\Flysystem\\FilesystemOperator", "shopware.filesystem.private", "shopware.filesystem.public", "swag_basic_example.filesystem.public", "swag_basic_example.filesystem.private", "PrefixFilesystem", "plugin filesystem", "file storage", "read write files", "private files", "public files"]
summary: Plugin file access via Flysystem - per-plugin public/private filesystem services and core shopware.filesystem.* as FilesystemOperator.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md"]
---
## What it is

Shopware exposes file storage to plugins through Flysystem (`League\Flysystem\FilesystemOperator`). Core provides predefined filesystems (private: invoices, delivery notes; public: product pictures, media; plus theme, sitemap and bundle asset filesystems), and every plugin/bundle gets its own private and public filesystem service.

## When to use

A plugin needs to read, write or list files - private plugin data or publicly served plugin files - through a common interface instead of touching the local disk directly. Prerequisites are a plugin ([Plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)) and a custom service ([Add custom service](platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md)).

## Key steps / config

1. Plugin filesystem service ids are the snake_case plugin name followed by `.filesystem.public` / `.filesystem.private`. For `SwagBasicExample`:
   - `swag_basic_example.filesystem.public`
   - `swag_basic_example.filesystem.private`
2. Write a service that takes `FilesystemOperator` arguments and uses the Flysystem API (`read()`, `write()`, `listContents()`):

```php
use League\Flysystem\FilesystemOperator;

class ExampleFilesystemService
{
    public function __construct(
        private FilesystemOperator $fileSystemPublic,
        private FilesystemOperator $fileSystemPrivate,
    ) {}
}
```

3. Wire the filesystems in `src/Resources/config/services.php`:

```php
$services->set(ExampleFilesystemService::class)
    ->args([
        service('swag_basic_example.filesystem.public'),
        service('swag_basic_example.filesystem.private'),
    ]);
// core alternatives: service('shopware.filesystem.private'), service('shopware.filesystem.public')
```

The installed code also registers an autowiring alias per plugin filesystem: a `FilesystemOperator` argument named `$<camelCasePluginName>PublicFilesystem` / `...PrivateFilesystem` (e.g. `$swagBasicExamplePublicFilesystem`), and for core `$privateFilesystem` / `$publicFilesystem`.

## Essential identifiers

- `League\Flysystem\FilesystemOperator`
- `<snake_case_plugin_name>.filesystem.public`, `<snake_case_plugin_name>.filesystem.private`
- `shopware.filesystem.private`, `shopware.filesystem.public`
- `Shopware\Core\Framework\Adapter\Filesystem\PrefixFilesystem` (class behind plugin filesystems)

## Gotchas

- The docs say the plugin namespaces are generated during plugin installation; in the installed code they are registered when the bundle builds the container (`Bundle::build()`), so they exist for every active bundle/plugin in the compiled container.
- A plugin filesystem is not separate storage: it is a `PrefixFilesystem` over the core `shopware.filesystem.public`/`private` filesystem with the prefix `plugins/<snake_case_plugin_name>`, so it inherits the core filesystem's adapter configuration.
- For the full read/write API, the source refers to the Flysystem filesystem API documentation.

## Code check (6.7.15.1)
- confirmed `Bundle::registerFilesystem()` — service id `%s.filesystem.%s` from container prefix, called for `private` and `public` — vendor/shopware/core/Framework/Bundle.php:190
- corrected `Bundle::build()` — docs: namespaces generated during plugin installation; registered at container build — vendor/shopware/core/Framework/Bundle.php:35
- confirmed `Bundle::getContainerPrefix()` — snake_case of the bundle name — vendor/shopware/core/Framework/Bundle.php:74
- confirmed `PrefixFilesystem` — plugin filesystem wraps core filesystem with prefix `plugins/<prefix>` — vendor/shopware/core/Framework/Bundle.php:197
- confirmed `registerAliasForArgument` — per-plugin `...PublicFilesystem`/`...PrivateFilesystem` autowiring alias — vendor/shopware/core/Framework/Bundle.php:209
- confirmed `shopware.filesystem.public` — public `FilesystemOperator` service — vendor/shopware/core/Framework/DependencyInjection/filesystem.php:31
- confirmed `shopware.filesystem.private` — private `FilesystemOperator` service — vendor/shopware/core/Framework/DependencyInjection/filesystem.php:38
- confirmed `shopware.filesystem.theme` — predefined theme filesystem — vendor/shopware/core/Framework/DependencyInjection/filesystem.php:52
- confirmed `shopware.filesystem.sitemap` — predefined sitemap filesystem — vendor/shopware/core/Framework/DependencyInjection/filesystem.php:59
- confirmed `privateFilesystem` — core autowiring alias for `shopware.filesystem.private` — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:197
