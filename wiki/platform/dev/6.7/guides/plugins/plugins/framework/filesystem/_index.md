---
id: platform/dev/6.7/guides/plugins/plugins/framework/filesystem/_index.md
title: Filesystem
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/filesystem/
sourceHash: 87449ff9b795e9b23667100faf496508afd4797c
codeCheckedAgainst: "6.7.15.1"
keywords: ["filesystem", "Flysystem", "FilesystemOperator", "shopware.filesystem.public", "shopware.filesystem.private", "PrefixFilesystem", "plugin file storage", "read write files", "cloud storage", "s3", "publicFilesystem", "privateFilesystem"]
summary: "Plugins read and write files through Shopware's Flysystem abstraction (FilesystemOperator), independent of local or cloud storage backends."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/hosting/infrastructure/filesystem.md"]
---
## What it is

Section index for plugin file handling. Shopware uses Flysystem, a PHP file storage library that provides one interface for different storage backends, local file systems as well as cloud providers.

## When to use

When a plugin needs to read or write files and should not care whether the shop stores them locally or with a cloud provider such as Amazon S3.

## Key steps / config

- Plugins do not handle the underlying storage configuration; they use the Flysystem abstraction directly, and the read/write API is the same for every backend.
- In the installed code, the shop-wide filesystems are `League\Flysystem\FilesystemOperator` services such as `shopware.filesystem.public` and `shopware.filesystem.private`, autowirable by argument name `$publicFilesystem` / `$privateFilesystem`.
- Every bundle/plugin additionally gets its own prefixed filesystems, `<container prefix>.filesystem.public` and `<container prefix>.filesystem.private` (a `PrefixFilesystem` scoped to `plugins/<container prefix>`), autowirable as `<camelCasePluginName>PublicFilesystem` / `<camelCasePluginName>PrivateFilesystem`.
- Storage backends (local, S3, and so on) are configured by the shop operator, not the plugin; see the [filesystem hosting guide](platform/dev/6.7/guides/hosting/infrastructure/filesystem.md).

## Essential identifiers

- `League\Flysystem\FilesystemOperator`
- `shopware.filesystem.public`, `shopware.filesystem.private`
- `Shopware\Core\Framework\Adapter\Filesystem\PrefixFilesystem`

## Code check (6.7.15.1)
- confirmed `FilesystemOperator` — Flysystem interface used for all Shopware filesystem services — vendor/shopware/core/Framework/DependencyInjection/filesystem.php:5
- confirmed `shopware.filesystem.public` — public `FilesystemOperator` built by `FilesystemFactory` — vendor/shopware/core/Framework/DependencyInjection/filesystem.php:31
- confirmed `shopware.filesystem.private` — private `FilesystemOperator` via `privateFactory` — vendor/shopware/core/Framework/DependencyInjection/filesystem.php:38
- confirmed `privateFilesystem` — autowiring alias for `shopware.filesystem.private` — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:197
- confirmed `publicFilesystem` — autowiring alias for `shopware.filesystem.public` — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:198
- confirmed `Bundle::registerFilesystem()` — per-plugin `<prefix>.filesystem.<key>` service — vendor/shopware/core/Framework/Bundle.php:190
- confirmed `PrefixFilesystem` — plugin filesystem scoped to `plugins/<prefix>` — vendor/shopware/core/Framework/Bundle.php:197
