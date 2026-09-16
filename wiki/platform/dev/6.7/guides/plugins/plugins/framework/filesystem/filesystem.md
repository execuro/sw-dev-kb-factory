---
id: platform/dev/6.7/guides/plugins/plugins/framework/filesystem/filesystem.md
title: Filesystem - Flysystem
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/filesystem/filesystem.html
sourceHash: 566c2bbaaa05de78d5a5e6a1a4abeebe018778e5
codeCheckedAgainst: "6.7.13.0"
keywords: ["flysystem", "filesystem", "FilesystemOperator", "League\\Flysystem\\FilesystemOperator", "swag_basic_example.filesystem.public", "swag_basic_example.filesystem.private", "shopware.filesystem.public", "shopware.filesystem.private", "PrefixFilesystem", "plugin private files", "plugin public files", "services.php"]
summary: "Inject a plugin's own <snake_name>.filesystem.public/private (or shopware.filesystem.*) FilesystemOperator into a service to read, write and list files."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md"]
---
## What it is

How a plugin reads and writes files through Flysystem (`League\Flysystem\FilesystemOperator`) by injecting a filesystem service into its own service.

## When to use

A plugin must store or read private files (e.g. generated documents) or public files, or list files, independent of the configured storage backend. Builds on the [Plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md) and [Add custom service guide](platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md).

## Key steps / config

Shop-wide filesystems exist for private shop files (invoices, delivery notes), public files (product pictures, media), theme files, sitemap files and bundle assets. Each plugin/bundle also gets its own namespace: the snake_case bundle name followed by `.filesystem.public` or `.filesystem.private`. For the example plugin `SwagBasicExample`:

- `swag_basic_example.filesystem.public` — public plugin files
- `swag_basic_example.filesystem.private` — private plugin files

1. Write a service taking two `FilesystemOperator` arguments:

```php
use League\Flysystem\FilesystemOperator;

class ExampleFilesystemService
{
    public function __construct(
        private FilesystemOperator $fileSystemPublic,
        private FilesystemOperator $fileSystemPrivate,
    ) {}
    // read($filename), write($filename, $content), listContents()
}
```

2. Register it in `<plugin root>/src/Resources/config/services.php` and pass the filesystems:

```php
$services->set(ExampleFilesystemService::class)
    ->args([
        service('swag_basic_example.filesystem.public'),
        service('swag_basic_example.filesystem.private'),
    ]);
// shop-wide alternatives: service('shopware.filesystem.private'), service('shopware.filesystem.public')
```

3. Use `$this->fileSystemPrivate->read($filename)`, `->write($filename, $content)` and `$this->fileSystemPublic->listContents()` (see the Flysystem filesystem API docs).

## Essential identifiers

- `League\Flysystem\FilesystemOperator`
- `swag_basic_example.filesystem.public`, `swag_basic_example.filesystem.private` (pattern `<snake_case_bundle_name>.filesystem.<public|private>`)
- `shopware.filesystem.public`, `shopware.filesystem.private`
- `Shopware\Core\Framework\Adapter\Filesystem\PrefixFilesystem`

## Gotchas

- The docs say the plugin namespaces are generated "during the plugin installation". In the installed code they are container service definitions added in `Bundle::build()` for every bundle, pointing at a `PrefixFilesystem` with prefix `plugins/<snake_case_bundle_name>` on the shop-wide `shopware.filesystem.public`/`private` — plugin files live in a subfolder of the shop filesystem, not in a separate storage.
- Autowiring aliases also exist: `<camelCaseBundleName>PublicFilesystem`/`<camelCaseBundleName>PrivateFilesystem` per bundle, and `publicFilesystem`/`privateFilesystem` for the shop-wide operators, when the argument is typed `FilesystemOperator`.

## Code check (6.7.13.0)
- corrected `Bundle::registerFilesystem()` — docs: namespaces generated during plugin installation; code registers them at container build — vendor/shopware/core/Framework/Bundle.php:40
- confirmed `Bundle::getContainerPrefix()` — snake_case of bundle name, used as service-id prefix — vendor/shopware/core/Framework/Bundle.php:73
- confirmed `%s.filesystem.%s` — plugin service id pattern — vendor/shopware/core/Framework/Bundle.php:179
- confirmed `PrefixFilesystem` — plugin filesystem prefixed with plugins/<prefix> — vendor/shopware/core/Framework/Bundle.php:182
- confirmed `registerAliasForArgument` — per-bundle FilesystemOperator alias <name>PublicFilesystem — vendor/shopware/core/Framework/Bundle.php:194
- confirmed `shopware.filesystem.public` — core FilesystemOperator service — vendor/shopware/core/Framework/DependencyInjection/filesystem.xml:13
- confirmed `shopware.filesystem.private` — core FilesystemOperator service — vendor/shopware/core/Framework/DependencyInjection/filesystem.xml:18
- confirmed `privateFilesystem` — autowiring alias for shopware.filesystem.private — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:192
- confirmed `shopware.filesystem.sitemap` — sitemap filesystem service — vendor/shopware/core/Framework/DependencyInjection/filesystem.xml:33
- unverified `FilesystemOperator::listContents()` — vendor/league/flysystem, out of scope
