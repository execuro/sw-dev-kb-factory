---
id: platform/dev/6.6/guides/hosting/infrastructure/filesystem.md
title: Filesystem
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/hosting/infrastructure/filesystem.html
sourceHash: 7ceb184fa78abb22befb1b2bbccbb76cce1d7bee
keywords: ["filesystem", "flysystem", "shopware.filesystem", "amazon-s3 adapter", "google-storage adapter", "AdapterFactoryInterface", "shopware.filesystem.factory", "private_local_download_strategy", "allowed_extensions", "CDN configuration", "public files", "media storage"]
summary: "Explains Flysystem-based public/private/theme/asset/sitemap filesystem config, adapters, download strategies, and custom adapters."
lastBuilt: 2026-09-15
---
## What it is
Documents Shopware's Flysystem-based filesystem abstraction used for public, private, theme, sitemap, and asset (bundle asset) files, and how to configure adapters for cloud storage providers.

## When to use
Use it when configuring where Shopware stores media, invoices, theme, sitemap, and asset files, especially in cluster setups where multiple app servers must share files via external storage, or when serving public files through a CDN.

## Key steps / config
Configuration lives in `config/packages/shopware.yml` under the `filesystem:` key, with separate entries for `public`, `private`, `theme`, `asset`, and `sitemap`:

```yaml
shopware:
  filesystem:
    public:
      url: "{url-to-your-public-files}"
    private:
      visibility: "private"
    theme:
      url: "{url-to-your-theme-files}"
    asset:
      url: "{url-to-your-asset-files}"
    sitemap:
      url: "{url-to-your-sitemap-files}"
```

- `theme`, `asset`, and `sitemap` fall back to the `public` configuration unless set explicitly.
- `allowed_extensions` / `private_allowed_extensions` restrict uploaded file types; `private_local_download_strategy` selects the download strategy for private files: `php` (default, streamed `application/octet-stream`), `x-sendfile` (Apache, needs `mod_xsendfile`), or `x-accel` (Nginx internal redirect).
- CDN: set the `public.url` in `config/packages/prod/shopware.yml` to the CDN URL (note the `prod` environment path).
- Adapter types: `local` (needs `root` config), `amazon-s3` (needs `league/flysystem-async-aws-s3`; config keys `bucket`, `region`, `endpoint`, `credentials.key`/`secret`, plus `use_path_style_endpoint` for path-style S3 providers like Minio), `google-storage` (needs `league/flysystem-google-cloud-storage`; config keys `bucket`, `projectId`, `keyFilePath`, and a bucket with "Fine-grained" ACL mode).
- Custom adapters implement `Shopware\Core\Framework\Adapter\Filesystem\Adapter\AdapterFactoryInterface` (methods `getType()` and `create(array $config)`) and register the service with the DI tag `shopware.filesystem.factory`.

## Essential identifiers
- `shopware.filesystem.public/private/theme/asset/sitemap`
- `allowed_extensions`, `private_allowed_extensions`, `private_local_download_strategy`
- `Shopware\Core\Framework\Adapter\Filesystem\Adapter\AdapterFactoryInterface`
- `shopware.filesystem.factory` DI tag
- `league/flysystem-async-aws-s3`, `league/flysystem-google-cloud-storage`

## Gotchas
CDN configuration set only in `config/packages/shopware.yml` applies to all environments; placing it under `config/packages/prod/` scopes it to production only.
