---
id: platform/dev/6.7/products/tools/cli/project-commands/image-proxy.md
title: Image Proxy
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/project-commands/image-proxy.html
sourceHash: de36e0fd667bbb36b632e3d8b47fc1c29aa3f0c9
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware-cli project image-proxy", "image_proxy.url", "shopware.filesystem.public", "zzz-sw-cli-image-proxy.yml", "var/cache/image-proxy", "--external-url", "--skip-config", "media proxy", "missing product images", "production media locally", "404 images"]
summary: "shopware-cli project image-proxy: local HTTP server that fetches missing media from a production upstream on demand and caches it in var/cache/image-proxy/."
lastBuilt: 2026-09-15
---
## What it is

`shopware-cli project image-proxy` starts a local HTTP server that serves media for a local shop: it checks local files, then a disk cache, then fetches from an upstream (e.g. production) server and caches the result. It avoids downloading a full media library (often 100GB+) after cloning a production database.

## When to use

Local development against a production database copy where product images return 404 because the media files are not present.

## Key steps / config

1. Configure the upstream in `.shopware-project.yml` (or pass `--url`):

```yaml
image_proxy:
  url: https://production.example.com
```

2. Start it: `shopware-cli project image-proxy`.

Options:

| Option | Meaning | Default |
|---|---|---|
| `--url` | Upstream URL (overrides config) | from config |
| `--port` | Listen port | `8080` |
| `--clear` | Clear cache before start | `false` |
| `--external-url` | URL written into the Shopware config (reverse proxy setups) | localhost on the chosen port, plain HTTP |
| `--skip-config` | Do not create the Shopware config file | `false` |

Request flow: local `public` folder → cache in `var/cache/image-proxy/` → upstream request → HTTP 200 responses cached to disk.

Unless `--skip-config` is set, the command writes `config/packages/zzz-sw-cli-image-proxy.yml` pointing the public filesystem at the proxy, and removes it when the server stops:

```yaml
shopware:
  filesystem:
    public:
      type: "local"
      url: '<proxy or --external-url>'
      config:
        root: "%kernel.project_dir%/public"
```

## Essential identifiers

- `shopware-cli project image-proxy` with `--url`, `--port`, `--clear`, `--external-url`, `--skip-config`
- `image_proxy.url` in `.shopware-project.yml`
- `config/packages/zzz-sw-cli-image-proxy.yml`
- `shopware.filesystem.public` (`type`, `url`, `config.root`)
- `var/cache/image-proxy/`

## Gotchas

- Without `--url` or `image_proxy.url` the command exits with an error.
- No automatic cache expiry; use `--clear` to refresh.
- Cache file names replace `/` with `_` in the request path; `Content-Type` is preserved and cached hits carry `X-Cache: HIT`.
- With `--skip-config` you must set `shopware.filesystem.public.url` yourself.

## Code check (6.7.13.0)
- confirmed `shopware.filesystem.public` — `public` filesystem node in the core bundle configuration — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:83
- confirmed `url` — scalar `url` child of `filesystem.public` — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:86
- confirmed `config.root` — core default `%kernel.project_dir%/public` for the public filesystem — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:186
- confirmed `type` — core default `local` for the public filesystem — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:183
- unverified `shopware-cli project image-proxy` — Go shopware-cli command and flags, out of scope
- unverified `image_proxy.url` — `.shopware-project.yml` key read by shopware-cli, out of scope
