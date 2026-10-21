---
id: platform/dev/6.7/products/tools/cli/project-commands/image-proxy.md
title: Image Proxy
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/project-commands/image-proxy.html
sourceHash: c722cf861c8d330120c5d48c1f34284730722101
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware-cli project image-proxy", "image_proxy.url", "image proxy", "media proxy", "missing product images", "404 media", "shopware.filesystem.public", "zzz-sw-cli-image-proxy.yml", "var/cache/image-proxy", "--external-url", "--skip-config", "production media locally"]
summary: shopware-cli project image-proxy serves local media and fetches missing images on demand from production, caching them in var/cache/image-proxy.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/tools/cli/configuration.md"]
---
## What it is

`shopware-cli project image-proxy` starts a local HTTP server that intercepts Shopware's image requests, serves local files or cached copies, and fetches missing images from an upstream (production) server on demand, caching them for later requests. It avoids 404s for product images after cloning a production database without downloading the full media library (often 100GB+).

## When to use

Local development against a copy of production (or staging) data where the media files are not present locally.

## Key steps / config

1. Ensure a project config exists (`shopware-cli project config init` if not) and set the upstream in the resolved project configuration file (see [configuration file lookup priority](platform/dev/6.7/products/tools/cli/configuration.md)):

```yaml
image_proxy:
  url: https://production.example.com
```

2. Start it: `shopware-cli project image-proxy`. Without `--url` or `image_proxy.url` the command exits with an error.

| Option | Description | Default |
|---|---|---|
| `--url` | Upstream URL (overrides config) | from config |
| `--port` | Listen port | `8080` |
| `--clear` | Clear cache before starting | `false` |
| `--external-url` | URL written into the Shopware config (reverse proxy setups) | localhost on `--port` |
| `--skip-config` | Do not create the Shopware config file | `false` |

Examples: `--url https://staging.example.com`, `--port 3000`, `--external-url https://dev.example.com`.

**Request flow**: local `public` folder → file cache `var/cache/image-proxy/` → upstream request → HTTP 200 responses cached to disk.

**Shopware integration**: unless `--skip-config` is given, the command writes `config/packages/zzz-sw-cli-image-proxy.yml`, pointing the public filesystem at the proxy, and removes it when the server stops. Shape:

```yaml
shopware:
  filesystem:
    public:
      type: "local"
      url: <proxy or --external-url>
      config:
        root: "%kernel.project_dir%/public"
```

## Essential identifiers

- `shopware-cli project image-proxy`, flags `--url`, `--port`, `--clear`, `--external-url`, `--skip-config`
- `image_proxy.url` (project config)
- `config/packages/zzz-sw-cli-image-proxy.yml`
- `shopware.filesystem.public` (`type`, `url`, `config.root`)
- `var/cache/image-proxy/`

## Gotchas

- No automatic cache expiration; files stay cached until cleared (`--clear`).
- Cache files are named by replacing `/` with `_` in the request path; the `Content-Type` header is preserved, and cached responses carry `X-Cache: HIT`.
- With `--skip-config` you must configure `shopware.filesystem.public` yourself.
- Only HTTP 200 responses are cached.

## Code check (6.7.15.1)
- confirmed `shopware.filesystem.public` — `public` node of the `filesystem` config tree — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:86
- confirmed `public.type` — scalar `type` under `public` — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:88
- confirmed `public.url` — scalar `url` under `public` — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:89
- confirmed `public.config` — free-form `config` variable node — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:91
- confirmed `local` — adapter type name of the local filesystem factory — vendor/shopware/core/Framework/Adapter/Filesystem/Adapter/LocalFactory.php:44
- confirmed `root` — required option of the local adapter — vendor/shopware/core/Framework/Adapter/Filesystem/Adapter/LocalFactory.php:77
- unverified `shopware-cli project image-proxy` — Go CLI, not part of the Shopware core/storefront/administration packages
- unverified `image_proxy.url` — shopware-cli project config key, outside the Shopware packages
