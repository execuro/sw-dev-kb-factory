---
id: platform/dev/6.7/guides/plugins/plugins/framework/filesystem/_index.md
title: Filesystem
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/filesystem/
sourceHash: 87449ff9b795e9b23667100faf496508afd4797c
codeCheckedAgainst: "6.7.13.0"
keywords: ["filesystem", "flysystem", "FilesystemOperator", "League\\Flysystem\\FilesystemOperator", "shopware.filesystem.public", "shopware.filesystem.private", "file storage", "cloud storage", "amazon s3", "plugin files", "read write files"]
summary: "Overview: Shopware plugins read/write files via the Flysystem abstraction (FilesystemOperator), same API for local disk or cloud storage like S3."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/hosting/infrastructure/filesystem.md"]
---
## What it is

Entry page for the plugin filesystem guides. Shopware uses Flysystem, a PHP file storage library that offers one interface for different storage backends — the local file system or cloud providers.

## When to use

A plugin needs to read or write files and should not care where they are physically stored (local disk, Amazon S3 or another cloud backend).

## Key steps / config

- Plugins do not handle the underlying storage configuration. Inject a Flysystem `League\Flysystem\FilesystemOperator` service and use its read/write API; it stays the same whatever backend is configured.
- In the installed core, the shop-wide operators are the services `shopware.filesystem.public` and `shopware.filesystem.private` (also `shopware.filesystem.theme`, `shopware.filesystem.sitemap`, `shopware.filesystem.asset`, `shopware.filesystem.temp`), all of class `League\Flysystem\FilesystemOperator`.
- Every bundle/plugin additionally gets its own `<snake_case_bundle_name>.filesystem.public` and `.filesystem.private` services, registered in `Shopware\Core\Framework\Bundle::build()` as a `PrefixFilesystem` under `plugins/<snake_case_bundle_name>` on top of the matching shop-wide filesystem.
- Storage backend configuration (including outsourcing to cloud storage such as Amazon S3) is a hosting concern, covered in [the filesystem hosting guide](platform/dev/6.7/guides/hosting/infrastructure/filesystem.md).

## Essential identifiers

- `League\Flysystem\FilesystemOperator`
- `shopware.filesystem.public`
- `shopware.filesystem.private`
- `Shopware\Core\Framework\Adapter\Filesystem\PrefixFilesystem`

## Code check (6.7.13.0)
- confirmed `shopware.filesystem.public` — service of class FilesystemOperator built by FilesystemFactory — vendor/shopware/core/Framework/DependencyInjection/filesystem.xml:13
- confirmed `shopware.filesystem.private` — service of class FilesystemOperator (privateFactory) — vendor/shopware/core/Framework/DependencyInjection/filesystem.xml:18
- confirmed `shopware.filesystem.temp` — additional core filesystem service — vendor/shopware/core/Framework/DependencyInjection/filesystem.xml:23
- confirmed `shopware.filesystem.asset` — additional core filesystem service — vendor/shopware/core/Framework/DependencyInjection/filesystem.xml:38
- confirmed `League\Flysystem\FilesystemOperator` — type used for plugin filesystem argument aliases — vendor/shopware/core/Framework/Bundle.php:5
- confirmed `Bundle::registerFilesystem()` — per-bundle private/public PrefixFilesystem services — vendor/shopware/core/Framework/Bundle.php:40
- confirmed `PrefixFilesystem` — plugin filesystems prefixed with plugins/<container prefix> — vendor/shopware/core/Framework/Bundle.php:182
- unverified `Flysystem read/write API` — lives in vendor/league/flysystem, out of scope
