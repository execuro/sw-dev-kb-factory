---
id: platform/dev/6.6/products/cli/project-commands/image-proxy.md
title: Image Proxy
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/cli/project-commands/image-proxy.html
sourceHash: d428052e96db29526c7a655bccad0d3c2682aae0
keywords: ["shopware-cli", "project image-proxy", "image proxy", "local HTTP server", "public folder", "var/cache/image-proxy", "X-Cache", "zzz-sw-cli-image-proxy.yml", "external-url", "shopware.filesystem.public"]
summary: "shopware-cli project image-proxy serves the local public folder and proxies/caches missing files from an upstream Shopware environment."
lastBuilt: "2026-09-15"
---
## What it is

`shopware-cli project image-proxy` starts a local HTTP server that serves files from a Shopware project's `public` folder, proxying and caching any file not found locally from an upstream server.

## When to use

Use it during development to access media files from a production or staging environment without downloading the entire media library.

## Key steps / config

```bash
shopware-cli project image-proxy
shopware-cli project image-proxy --url https://my-shop.com
shopware-cli project image-proxy --port 3000
shopware-cli project image-proxy --clear
shopware-cli project image-proxy --external-url https://dev.example.com
shopware-cli project image-proxy --skip-config
```

Upstream URL can also be configured in `.shopware-project.yml`:

```yaml
image_proxy:
  url: https://production.example.com
```

If no URL is set via `--url` or config, the command exits with an error.

Request flow: check the local `public` folder, then the file cache (`var/cache/image-proxy/`), then proxy to upstream; successful (HTTP 200) responses are cached. Cache files are named by replacing `/` with `_` in the request path, preserve the `Content-Type` header, never expire automatically, and cached responses carry an `X-Cache: HIT` header.

By default the command writes a Shopware config file at `config/packages/zzz-sw-cli-image-proxy.yml` (removed automatically on stop) that points Shopware's public filesystem at the proxy:

```yaml
shopware:
  filesystem:
    public:
      type: "local"
      config:
        root:
```

## Essential identifiers

- `shopware-cli project image-proxy`
- `--url`, `--port`, `--clear`, `--external-url`, `--skip-config`
- `var/cache/image-proxy/`
- `config/packages/zzz-sw-cli-image-proxy.yml`
- `X-Cache`

## Gotchas

Without an upstream URL from `--url` or `.shopware-project.yml`, the command errors out immediately.
