---
id: platform/dev/6.7/guides/hosting/infrastructure/filesystem.md
title: Filesystem
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/infrastructure/filesystem.html
sourceHash: 0b84ca7c55b6fc6f331bf1fcb66b2974c9cda51d
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware.filesystem", "amazon-s3", "google-storage", "AdapterFactoryInterface", "shopware.filesystem.factory", "SHOPWARE_CDN_STRATEGY_DEFAULT", "private_local_download_strategy", "batch_write_size", "path_cache_buster", "flysystem", "s3 storage", "cdn", "media migration", "cluster shared storage"]
summary: "Shopware filesystem config: public/private/theme/asset/sitemap/temp adapters, local/S3/GCS options, migration, CDN, media strategy, custom adapters."
lastBuilt: 2026-10-21
---
## What it is

Configuration of Shopware's Flysystem-based file storage under `shopware.filesystem` in `config/packages/shopware.yml`: one adapter per purpose, backed by `local`, `amazon-s3` or `google-storage`, plus CDN URLs, media path strategy, upload whitelists and private download delivery.

## When to use

Running more than one app server (shared external storage is required), moving media to S3-compatible storage for redundancy, serving files through a CDN, or adding a custom storage backend.

## Key steps / config

**Filesystems:** `public` (media, `public/`), `private` (invoices, downloads, `files/`), `temp` (`var/`), and `theme`, `asset`, `sitemap`, which inherit `public` when not set. Each accepts `type` (required), `url` (derived from `APP_URL` if omitted), `visibility`, `config`.

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
        credentials: { key: "{{AWS_ACCESS_KEY_ID}}", secret: "{{AWS_SECRET_ACCESS_KEY}}" }
    theme: *s3
    asset: *s3
    sitemap: *s3
```

**Adapter `config` keys:**

- `local`: `root` (required), `file` / `dir` permission maps (`public`/`private`, defaults from umask), `enforce_file_permissions` (default `true`).
- `amazon-s3` (`composer require league/flysystem-async-aws-s3`): `bucket`, `region` (required), `endpoint`, `use_path_style_endpoint` (bool, `true` for MinIO-style hosts), `root` (default empty), `credentials.key` + `credentials.secret` (both required if the block is given; omit for IAM-role discovery), `options`.
- `google-storage` (`composer require league/flysystem-google-cloud-storage`): `bucket`, `projectId`, `keyFilePath` or `keyFile`, `root`. Bucket must use fine-grained ACL mode.

**Migrating to a new adapter** (config change does not move files; existing media 404s otherwise):

1. Copy files with identical relative paths (DB stores only relative paths like `media/ab/cd/example.jpg`), e.g. `rclone copy public/media s3:your-bucket/media` or `aws s3 sync public/media s3://your-bucket/media`; same for `public/thumbnail`, `public/sitemap`, and `files` for private. A `root` must match the bucket prefix.
2. Switch the config.
3. Regenerate: `bin/console asset:install`, `bin/console theme:compile`.
4. For live shops re-run the copy after deploy, or use maintenance mode.

**CDN / media URLs:**

- Set `public.url` to the CDN domain (often only in `config/packages/prod/shopware.yml`).
- `SHOPWARE_CDN_STRATEGY_DEFAULT` → `shopware.cdn.strategy`: `id` (default), `filename`, `physical_filename`, `plain`.
- `shopware.cdn.path_cache_buster: false` drops the upload timestamp from new physical paths; cache busting then relies on the `ts` query parameter.

**Other `shopware.filesystem` keys:** `allowed_extensions`, `private_allowed_extensions`, `private_local_download_strategy` (`php` default, `x-sendfile`, `x-accel`), `private_local_path_prefix` (for `x-accel`, default `""`), `batch_write_size` (default `250`, min 1).

**Custom adapter:** implement `Shopware\Core\Framework\Adapter\Filesystem\Adapter\AdapterFactoryInterface`; `getType()` must match the YAML `type`:

```php
class MyFlysystemAdapterFactory implements AdapterFactoryInterface
{
    public function getType(): string { return 'my-adapter-prefix'; }

    public function create(array $config): FilesystemAdapter
    {
        return new MyFlysystemAdapter($config); // $config = the YAML `config` block
    }
}
```

The service needs the tag `shopware.filesystem.factory`; with autoconfigure enabled Shopware adds it automatically for any `AdapterFactoryInterface` implementation.

## Essential identifiers

- `shopware.filesystem.{public,private,theme,asset,sitemap,temp}`, types `local`, `amazon-s3`, `google-storage`
- `AdapterFactoryInterface::create()`, `AdapterFactoryInterface::getType()`, tag `shopware.filesystem.factory`
- `SHOPWARE_CDN_STRATEGY_DEFAULT`, `shopware.cdn.strategy`, `shopware.cdn.path_cache_buster`
- `allowed_extensions`, `private_allowed_extensions`, `private_local_download_strategy`, `private_local_path_prefix`, `batch_write_size`
- `bin/console asset:install`, `bin/console theme:compile`

## Gotchas

- Changing `public` later also moves `theme`/`asset`/`sitemap` unless they are pinned explicitly (e.g. a `&local` anchor with `type: "local"` and `root: "%kernel.project_dir%/public"`).
- Presigned S3 downloads (Import/Export files, private Admin media, digital products) redirect the browser to the storage endpoint; `shopware.filesystem.private.config.endpoint` must be browser-reachable (HTTPS if the shop uses HTTPS). An internal-only host like `minio:9000` breaks these downloads; changing `url` does not affect signing. The local download strategy does not apply to presigned downloads.
- Changing the CDN strategy on a live shop breaks existing media URLs unless files are moved.
- After disabling `path_cache_buster`, the CDN must key on query strings; do not run `media:update-path --force` (it rewrites DB paths without moving files).
- `MissingDependencyException`: install the adapter package. Bucket-host errors on MinIO etc.: set `use_path_style_endpoint: true`.

## Code check (6.7.15.1)
- confirmed `AdapterFactoryInterface::create()` — `create(array $config): FilesystemAdapter` — vendor/shopware/core/Framework/Adapter/Filesystem/Adapter/AdapterFactoryInterface.php:14
- confirmed `AdapterFactoryInterface::getType()` — returns the `type` string — vendor/shopware/core/Framework/Adapter/Filesystem/Adapter/AdapterFactoryInterface.php:16
- confirmed `shopware.filesystem.factory` — auto-added for AdapterFactoryInterface via autoconfiguration — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:167
- confirmed `amazon-s3` — S3 factory type; `google-storage`/`local` likewise — vendor/shopware/core/Framework/Adapter/Filesystem/Adapter/AwsS3v3Factory.php:43
- confirmed `use_path_style_endpoint` — optional bool; `bucket`/`region` required, `root` defaults empty — vendor/shopware/core/Framework/Adapter/Filesystem/Adapter/S3ClientFactory.php:74
- confirmed `enforce_file_permissions` — local option, default `true`; `root` required — vendor/shopware/core/Framework/Adapter/Filesystem/Adapter/LocalFactory.php:87
- confirmed `private_local_download_strategy` — enum php/x-sendfile/x-accel, default `php` — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:137
- confirmed `batch_write_size` — default 250, min 1 — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:145
- confirmed `path_cache_buster` — boolean, default true — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:162
- confirmed `SHOPWARE_CDN_STRATEGY_DEFAULT` — env mapped to `cdn.strategy` — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:213
