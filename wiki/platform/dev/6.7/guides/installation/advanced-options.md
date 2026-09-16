---
id: platform/dev/6.7/guides/installation/advanced-options.md
title: Advanced Docker Config
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/installation/advanced-options.html
sourceHash: f1f06e028af54cbe0e26d48cc655038a919e769a
codeCheckedAgainst: "6.7.13.0"
keywords: ["docker dev image", "ghcr.io/shopware/docker-dev", "shopware-cli project create", "minio", "s3", "amazon-s3", "shopware.filesystem", "use_path_style_endpoint", "orbstack", "compose.override.yaml", "imageproxy", "production data locally", "APP_URL", "assets:install", "theme:compile"]
summary: "Advanced local Docker setup: install into existing dir, docker-dev image tags, Minio as S3 filesystem, OrbStack routing, image proxy for production data."
lastBuilt: 2026-09-15
---
## What it is

Optional Docker configuration for a running Shopware CLI/Docker project: creating a project in an existing directory, choosing `docker-dev` image variants, emulating S3 with Minio, OrbStack routing on macOS, and proxying production images.

## When to use

When the default local environment needs to mirror production more closely (PHP/Node/web server, S3 storage), run several shops side by side, or work with an imported production database whose media URLs point to production.

## Key steps / config

**Install into an existing directory**: `cd` into it and run `shopware-cli project create`, leaving the project name empty; non-interactive: `shopware-cli project create --no-interaction` (omit the name or pass `.`).

**Image variants**: tag format `ghcr.io/shopware/docker-dev:php(PHP_VERSION)-node(NODE_VERSION)-(WEBSERVER)`. PHP `8.4`/`8.3`/`8.2`; Node `node24`/`node22`; web server `caddy`/`nginx`. Example: `ghcr.io/shopware/docker-dev:php8.4-node24-caddy`.

**Minio as S3**
1. Add a `minio` service (`image: minio/minio`, `command: server /data --console-address ":9001"`, `MINIO_ROOT_USER`/`MINIO_ROOT_PASSWORD`, ports `9000`/`9001`, volume `minio-data`) and a `minio-setup` service (`image: minio/mc`) that creates buckets `shopware-public` and `shopware-private` and sets anonymous download on the public one, to `compose.yaml`.
2. Create `config/packages/minio.yaml` (schema hint `https://raw.githubusercontent.com/shopware/shopware/refs/heads/trunk/config-schema.json`):
   ```yaml
   shopware:
     filesystem:
       public: &s3_public
         type: "amazon-s3"
         url: "<public bucket URL on port 9000>"
         config:
           bucket: shopware-public
           endpoint: <minio service URL, port 9000>
           use_path_style_endpoint: true
           region: us-east-1
           credentials: { key: minioadmin, secret: minioadmin }
       theme: *s3_public
       sitemap: *s3_public
       private: { type: "amazon-s3", config: { bucket: shopware-private, ... } }
   ```
3. `docker compose up -d`; Minio console on localhost port 9001 (`minioadmin` / `minioadmin`).
4. Upload assets: `make shell`, then `bin/console assets:install` and `bin/console theme:compile`.

**OrbStack routing (macOS)**: in `compose.override.yaml` set `web.ports: !override []` and `environment` `APP_URL: https://web.sw.orb.local`, `SYMFONY_TRUSTED_PROXIES: REMOTE_ADDR`. URL pattern `web.<project-name>.orb.local` (project directory name). `https://orb.local` lists running containers.

**Production data locally**: add service `imageproxy` (`image: ghcr.io/shopwarelabs/devcontainer/image-proxy`, port `8050:8000`, `REMOTE_SERVER_HOST: <production host>`) to `compose.override.yaml`, then create `config/packages/media-proxy.yaml` setting `shopware.filesystem.public.url` to the proxy on localhost port 8050. Images are fetched from production on demand and cached.

## Essential identifiers

- `shopware-cli project create --no-interaction`
- `ghcr.io/shopware/docker-dev:php8.4-node24-caddy`
- `shopware.filesystem.public`, `shopware.filesystem.private`, `shopware.filesystem.theme`, `shopware.filesystem.sitemap`
- `type: "amazon-s3"`, `config.bucket`, `config.region`, `config.endpoint`, `config.use_path_style_endpoint`, `config.credentials.key`/`secret`
- `bin/console assets:install`, `bin/console theme:compile`
- `APP_URL`, `SYMFONY_TRUSTED_PROXIES`
- `ghcr.io/shopwarelabs/devcontainer/image-proxy`, `REMOTE_SERVER_HOST`

## Gotchas

- The source writes the asset command as `asset:install`; the registered command name is `assets:install`.
- For S3 filesystems, `bucket` and `region` are required; `use_path_style_endpoint` must be a boolean (needed for Minio-style endpoints).
- Setting `visibility` inside `config` is deprecated for 6.8; set it next to `type`.

## Code check (6.7.13.0)
- confirmed `AwsS3v3Factory::getType()` — adapter type 'amazon-s3' — vendor/shopware/core/Framework/Adapter/Filesystem/Adapter/AwsS3v3Factory.php:43
- confirmed `use_path_style_endpoint` — optional bool S3 option — vendor/shopware/core/Framework/Adapter/Filesystem/Adapter/S3ClientFactory.php:68
- confirmed `bucket` — bucket and region are required S3 options — vendor/shopware/core/Framework/Adapter/Filesystem/Adapter/S3ClientFactory.php:60
- confirmed `credentials` — mapped to access key id/secret — vendor/shopware/core/Framework/Adapter/Filesystem/Adapter/S3ClientFactory.php:39
- confirmed `filesystem.theme` — theme/sitemap filesystems exist, empty by default — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:191
- corrected `assets:install` — docs: asset:install — vendor/shopware/core/Framework/Adapter/Asset/AssetInstallCommand.php:22
- confirmed `theme:compile` — storefront command name — vendor/shopware/storefront/Theme/Command/ThemeCompileCommand.php:19
- confirmed `visibility` — config-level visibility deprecated for v6.8.0.0 — vendor/shopware/core/Framework/Adapter/Filesystem/FilesystemFactory.php:52
- confirmed `APP_URL` — env variable read by installer — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:139
- unverified `ghcr.io/shopware/docker-dev` — Docker image and shopware-cli, out of scope
