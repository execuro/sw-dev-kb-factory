---
id: platform/dev/6.7/guides/installation/advanced-options.md
title: Advanced Docker Config
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/installation/advanced-options.html
sourceHash: f1f06e028af54cbe0e26d48cc655038a919e769a
codeCheckedAgainst: "6.7.15.1"
keywords: ["docker", "ghcr.io/shopware/docker-dev", "minio", "s3", "amazon-s3", "use_path_style_endpoint", "shopware.filesystem", "orbstack", "compose.override.yaml", "imageproxy", "REMOTE_SERVER_HOST", "shopware-cli project create", "existing directory", "image variants"]
summary: Optional Docker dev setup tweaks - install into existing dir, docker-dev image tags, Minio as S3 filesystem, OrbStack routing, production image proxy.
lastBuilt: 2026-10-21
---
## What it is

Optional and advanced Docker configuration for a local Shopware project created with the Shopware CLI: installing into an existing directory, choosing image variants, emulating S3 with Minio, OrbStack routing and proxying production images.

## When to use

Once the local environment runs and you want to mirror production more closely (PHP/Node/web server, S3 storage, production data) or run several projects side by side.

## Key steps / config

**Existing directory:** `cd /path/to/project` then `shopware-cli project create`, leaving the project name empty; non-interactive: `shopware-cli project create --no-interaction` (omit the name or pass `.`).

**Image variants:** tag format `ghcr.io/shopware/docker-dev:php(PHP_VERSION)-node(NODE_VERSION)-(WEBSERVER)`. PHP `8.4`/`8.3`/`8.2`, Node `node24`/`node22`, web server `caddy`/`nginx`, e.g. `ghcr.io/shopware/docker-dev:php8.4-node24-caddy`.

**Minio (S3-compatible):**
1. Add a `minio` service (`image: minio/minio`, `command: server /data --console-address ":9001"`, `MINIO_ROOT_USER`/`MINIO_ROOT_PASSWORD`, ports 9000/9001, volume `minio-data`) and a `minio-setup` service (`image: minio/mc`) that creates buckets `shopware-public` and `shopware-private` and sets anonymous download on the public one, to `compose.yaml`.
2. Create `config/packages/minio.yaml` (optional schema header `# yaml-language-server: $schema=https://raw.githubusercontent.com/shopware/shopware/refs/heads/trunk/config-schema.json`):

```yaml
shopware:
  filesystem:
    public: &s3_public
      type: "amazon-s3"
      url: "<public bucket URL on port 9000>"
      config:
        bucket: shopware-public
        endpoint: <minio service on port 9000>
        use_path_style_endpoint: true
        region: us-east-1
        credentials: { key: minioadmin, secret: minioadmin }
    theme: *s3_public
    sitemap: *s3_public
    private: { type: "amazon-s3", config: { bucket: shopware-private, ... } }
```

3. `docker compose up -d`; console on localhost port 9001 (`minioadmin`/`minioadmin`).
4. Upload assets: `make shell`, then `bin/console assets:install` and `bin/console theme:compile`.

**OrbStack routing (macOS):** in `compose.override.yaml` set `web.ports: !override []`, `APP_URL: https://web.<project-name>.orb.local`, `SYMFONY_TRUSTED_PROXIES: REMOTE_ADDR` (plus a `mailer` service using `axllent/mailpit`). `<project-name>` is the project directory name; `https://orb.local` lists running containers.

**Production images locally:** add an `imageproxy` service (`image: ghcr.io/shopwarelabs/devcontainer/image-proxy`, port `8050:8000`, env `REMOTE_SERVER_HOST`), then create `config/packages/media-proxy.yaml` setting `shopware.filesystem.public.url` to the proxy on localhost port 8050. Images are fetched on demand and cached.

## Essential identifiers

- `shopware-cli project create --no-interaction`
- `ghcr.io/shopware/docker-dev:php8.4-node24-caddy`
- `shopware.filesystem.public` / `theme` / `sitemap` / `private`, `type: "amazon-s3"`, `use_path_style_endpoint`
- `bin/console assets:install`, `bin/console theme:compile`
- `ghcr.io/shopwarelabs/devcontainer/image-proxy`, `REMOTE_SERVER_HOST`
- `APP_URL`, `SYMFONY_TRUSTED_PROXIES`

## Gotchas

- The source writes the asset command as `asset:install`; the registered command is `assets:install`.
- The S3 adapter requires `bucket` and `region` in `config`.
- Run asset/theme commands after switching the filesystem so files land in the bucket.

## Code check (6.7.15.1)
- confirmed `amazon-s3` — filesystem adapter type name — vendor/shopware/core/Framework/Adapter/Filesystem/Adapter/AwsS3v3Factory.php:43
- confirmed `use_path_style_endpoint` — optional bool option of the S3 client — vendor/shopware/core/Framework/Adapter/Filesystem/Adapter/S3ClientFactory.php:81
- confirmed `bucket` — required S3 config option together with `region` — vendor/shopware/core/Framework/Adapter/Filesystem/Adapter/S3ClientFactory.php:73
- confirmed `filesystem.public` — config node — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:86
- confirmed `filesystem.private` — config node — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:79
- confirmed `filesystem.theme` — config node — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:101
- confirmed `filesystem.sitemap` — config node — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:121
- corrected `assets:install` — docs: `asset:install` — vendor/shopware/core/Framework/Adapter/Asset/AssetInstallCommand.php:23
- confirmed `theme:compile` — Storefront command — vendor/shopware/storefront/Theme/Command/ThemeCompileCommand.php:21
- unverified `ghcr.io/shopware/docker-dev` — Docker image, out of scope
