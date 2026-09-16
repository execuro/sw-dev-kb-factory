---
id: platform/dev/6.7/guides/hosting/infrastructure/filesystem.md
title: Filesystem
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/infrastructure/filesystem.html
sourceHash: d5890d5e0c85a28e4f2b9b0c6e46bf470cf4bb7f
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware.filesystem", "amazon-s3", "google-storage", "local", "AdapterFactoryInterface", "shopware.filesystem.factory", "batch_write_size", "private_local_download_strategy", "SHOPWARE_CDN_STRATEGY_DEFAULT", "allowed_extensions", "flysystem", "s3 storage", "cdn", "media migration", "cluster storage"]
summary: Configure Shopware 6.7 Flysystem adapters (local, amazon-s3, google-storage), fallbacks, S3 migration, CDN URL strategy, download strategy, custom adapters.
lastBuilt: 2026-09-15
---
## What it is

Shopware stores media, documents, theme files, bundle assets and sitemaps through Flysystem. Storage is split into per-purpose filesystems (`public`, `private`, `theme`, `asset`, `sitemap`, `temp`), each configured under `shopware.filesystem` in `config/packages/shopware.yml` with a `type` of `local`, `amazon-s3` or `google-storage`.

## When to use

Clusters with several app servers (shared S3/S3-compatible storage is required), moving a single server to object storage, putting a CDN in front of public files, migrating existing media, restricting upload extensions, offloading private downloads, or adding a custom storage backend.

## Key steps / config

Shipped defaults: `public` → `%kernel.project_dir%/public`, `private` (visibility `private`) → `%kernel.project_dir%/files`, `temp` → `%kernel.project_dir%/var`; `theme`, `asset`, `sitemap` are empty and fall back to `public`. Each filesystem accepts `type`, `url`, `visibility`, `config`:

```yaml
shopware:
  filesystem:
    public: &s3
      type: "amazon-s3"
      url: "{{S3_URL}}"
      config:
        bucket: "{{AWS_BUCKET}}"
        region: "{{AWS_REGION}}"
        endpoint: "{{AWS_ENDPOINT}}"
        use_path_style_endpoint: true
        credentials: { key: "...", secret: "..." }
    theme: *s3
    asset: *s3
    sitemap: *s3
```

Adapter `config` keys (as enforced by the factories):
- `local`: `root` required; optional `file`/`dir` permission maps (`public`/`private`, defaults from umask), `enforce_file_permissions` (default `true`).
- `amazon-s3` (`composer require league/flysystem-async-aws-s3`): `bucket`, `region` required; optional `endpoint`, `use_path_style_endpoint` (bool), `root`, `options`, `credentials.key`/`credentials.secret` (omit to use IAM role / env credential discovery).
- `google-storage` (`composer require league/flysystem-google-cloud-storage`): `projectId`, `bucket` required; optional `keyFilePath`, `keyFile` (array, wins if both set), `root`. Bucket needs fine-grained ACL mode.

Migration from `local`:
1. Copy files with identical relative paths (DB stores e.g. `media/ab/cd/example.jpg`): `public/media`, `public/thumbnail`, `public/sitemap`, plus `files/` for private — e.g. `rclone copy public/media s3:your-bucket/media` or `aws s3 sync public/media s3://your-bucket/media`. A configured `root` must match the bucket prefix.
2. Switch the configuration and deploy.
3. Run `bin/console asset:install` and `bin/console theme:compile` (no need to copy `public/theme`, `public/bundles`).
4. For live shops re-run the copy after the switch (two-pass sync), or use maintenance mode.

Other `shopware.filesystem` keys: `allowed_extensions` / `private_allowed_extensions` (private list adds `zip`, `rar`, `xml`); `private_local_download_strategy` = `php` (default) | `x-sendfile` | `x-accel`, with `private_local_path_prefix` (default `""`) for x-accel; `batch_write_size` (default `250`, min 1) for S3 batch writes.

CDN: set the public filesystem `url` to the CDN domain (typically in `config/packages/prod/shopware.yml`). Media path strategy via env `SHOPWARE_CDN_STRATEGY_DEFAULT` (`shopware.cdn.strategy`): `id` (default), `filename`, `physical_filename`, `plain`.

Custom adapter — implementations are autoconfigured with tag `shopware.filesystem.factory`:

```php
use Shopware\Core\Framework\Adapter\Filesystem\Adapter\AdapterFactoryInterface;
use League\Flysystem\FilesystemAdapter;

class MyFlysystemAdapterFactory implements AdapterFactoryInterface
{
    public function getType(): string { return 'my-adapter-prefix'; } // matches YAML `type`
    public function create(array $config): FilesystemAdapter { /* ... */ }
}
```

## Essential identifiers

- `Shopware\Core\Framework\Adapter\Filesystem\Adapter\AdapterFactoryInterface`, tag `shopware.filesystem.factory`
- `private_local_download_strategy`, `private_local_path_prefix`, `batch_write_size`
- `SHOPWARE_CDN_STRATEGY_DEFAULT`
- `bin/console asset:install`, `bin/console theme:compile`

## Gotchas

- Changing config does not move files: switching without copying gives 404s on existing media.
- `theme`/`asset`/`sitemap` follow `public` when unset — changing `public` later moves them too unless pinned explicitly.
- Missing adapter package → `MissingDependencyException`; MinIO-style providers need `use_path_style_endpoint: true`.
- Changing the CDN strategy on a shop with media changes generated paths and breaks existing URLs.
- The docs describe `shopware.cdn.path_cache_buster: false` (query-string `ts` cache busting only, and warn against `media:update-path --force` afterwards); the key is not defined in the installed 6.7.13.0 config tree.

## Code check (6.7.13.0)
- confirmed `AdapterFactoryInterface::create()` — returns `FilesystemAdapter` from `array $config` — vendor/shopware/core/Framework/Adapter/Filesystem/Adapter/AdapterFactoryInterface.php:14
- confirmed `AdapterFactoryInterface::getType()` — second required member — vendor/shopware/core/Framework/Adapter/Filesystem/Adapter/AdapterFactoryInterface.php:16
- confirmed `shopware.filesystem.factory` — autoconfigured tag for the interface — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:166
- confirmed `batch_write_size` — default 250, min 1 — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:142
- confirmed `private_local_download_strategy` — enum, default php — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:134
- confirmed `root` — only required local option; enforce_file_permissions default true — vendor/shopware/core/Framework/Adapter/Filesystem/Adapter/LocalFactory.php:77
- confirmed `bucket` — bucket and region required for amazon-s3 — vendor/shopware/core/Framework/Adapter/Filesystem/Adapter/S3ClientFactory.php:60
- confirmed `projectId` — projectId and bucket required for google-storage — vendor/shopware/core/Framework/Adapter/Filesystem/Adapter/GoogleStorageFactory.php:49
- confirmed `SHOPWARE_CDN_STRATEGY_DEFAULT` — maps to cdn.strategy — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:202
- absent `path_cache_buster` — not defined in the cdn config tree or anywhere in the installed code
