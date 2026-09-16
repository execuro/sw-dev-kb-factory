---
id: platform/dev/6.7/resources/references/config-reference/server/caddy.md
title: Caddy
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/config-reference/server/caddy.html
sourceHash: 9db63a85b1309f2f72d023fa012b4879bdc56567
codeCheckedAgainst: "6.7.13.0"
keywords: ["caddy", "caddyfile", "php_fastcgi", "file_server", "root * public", "X-Frame-Options", "Content-Security-Policy", "svg", "web server config", "encode zstd gzip"]
summary: Caddyfile example for Shopware 6.7 - public root, php_fastcgi, zstd/gzip, security headers, SVG CSP and a static-asset path matcher.
lastBuilt: 2026-09-15
---
## What it is

A reference Caddyfile for serving a Shopware 6.7 installation with Caddy and PHP-FPM.

## When to use

When hosting Shopware behind Caddy.

## Key steps / config

Replace `mydomain.com` with your domain; `php_fastcgi` points at the PHP-FPM address.

```text
mydomain.com {
  header {
    X-Frame-Options DENY
    Referrer-Policy no-referrer-when-downgrade
  }
  @svg {
    file
    path *.svg
  }
  header @svg Content-Security-Policy "script-src 'none'"
  @default {
    not path /theme/* /media/* /thumbnail/* /bundles/* /css/* /fonts/* /js/* /recovery/* /sitemap/*
  }
  root * public
  php_fastcgi 127.0.0.1:9000
  encode zstd gzip
  file_server
}
```

## Essential identifiers

- `root * public`
- `php_fastcgi 127.0.0.1:9000`
- `encode zstd gzip`, `file_server`
- `header @svg Content-Security-Policy "script-src 'none'"`
- `@default` matcher excluding `/theme/*`, `/media/*`, `/thumbnail/*`, `/bundles/*`, `/css/*`, `/fonts/*`, `/js/*`, `/recovery/*`, `/sitemap/*`

## Code check (6.7.13.0)
- confirmed `/public/` — web root is the project's public directory — vendor/shopware/core/Framework/Adapter/Asset/AssetInstallCommand.php:69
- confirmed `theme/` — compiled theme assets are written under theme/ — vendor/shopware/storefront/Theme/ThemeCompiler.php:259
- confirmed `bundles/` — bundle assets live under bundles/ — vendor/shopware/storefront/Theme/ThemeCompiler.php:505
- confirmed `sitemap/` — sitemap files are served from sitemap/ — vendor/shopware/core/Content/Sitemap/SalesChannel/SitemapFileRoute.php:46
- confirmed `media/` — media path strategy produces media/ paths — vendor/shopware/core/Content/Media/Core/Application/AbstractMediaPathStrategy.php:27
- confirmed `thumbnail/` — thumbnail paths are thumbnail/ — vendor/shopware/core/Content/Media/Core/Application/AbstractMediaPathStrategy.php:27
- unverified `/recovery/*` — not checked against the installed code
- unverified `php_fastcgi` — Caddy directive, outside the vendor/shopware code roots
