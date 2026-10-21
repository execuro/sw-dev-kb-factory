---
id: platform/dev/6.7/resources/references/config-reference/server/caddy.md
title: Caddy
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/config-reference/server/caddy.html
sourceHash: 4ca6bb8f13ce91d0440ba988be5306a31ac16e18
codeCheckedAgainst: "6.7.15.1"
keywords: ["caddy", "Caddyfile", "web server config", "php_fastcgi", "file_server", "Content-Security-Policy", "X-Frame-Options", "Referrer-Policy", "staticDocuments", "document root public", "media thumbnail html", "server configuration"]
summary: Reference Caddyfile for Shopware 6.7 - public root, php_fastcgi to PHP-FPM, security headers and a strict CSP for stored SVG/HTML media.
lastBuilt: 2026-10-21
---
## What it is

A reference Caddy (Caddyfile) site block for serving a Shopware 6.7 project. It sets the document root to `public`, forwards PHP to PHP-FPM via FastCGI, enables compression, adds security headers, and applies a locked-down Content-Security-Policy to SVG files and HTML files stored under `/media` or `/thumbnail`.

## When to use

When you host Shopware behind Caddy instead of Nginx or Apache and need a working base configuration to adapt (domain name, PHP-FPM address).

## Key steps / config

Skeleton of the site block (replace `mydomain.com` and the FastCGI address):

```text
mydomain.com {
  header { ... }                      # X-Frame-Options, Referrer-Policy
  @staticDocuments { file; path_regexp staticDocuments ... }
  header @staticDocuments Content-Security-Policy "..."
  @default { not path /theme/* /media/* ... }
  root * public
  php_fastcgi 127.0.0.1:9000
  encode zstd gzip
  file_server
}
```

1. `root * public` — the document root is the project's `public` folder.
2. `php_fastcgi 127.0.0.1:9000` — pass PHP requests to PHP-FPM on that address.
3. `encode zstd gzip` and `file_server` — compress responses and serve static files directly.
4. Global `header` block — sends `X-Frame-Options DENY` and `Referrer-Policy no-referrer-when-downgrade`.
5. `@staticDocuments` matcher — matches existing files (`file`) with `path_regexp staticDocuments (?i)([.]svg$|^/(media|thumbnail)/.*[.]html$)`, i.e. any `.svg` or HTML under `/media/` or `/thumbnail/`. These get the header `Content-Security-Policy "script-src 'none'; object-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'"`.
6. `@default` matcher — every path except the static prefixes `/theme/*`, `/media/*`, `/thumbnail/*`, `/bundles/*`, `/css/*`, `/fonts/*`, `/js/*`, `/recovery/*`, `/sitemap/*`.

In the source, the `header` and matcher bodies are written one directive per line; the skeleton above elides them.

## Essential identifiers

- `root * public`, `php_fastcgi`, `encode zstd gzip`, `file_server`
- `@staticDocuments`, `@default` (named matchers)
- `Content-Security-Policy`, `X-Frame-Options`, `Referrer-Policy`

## Gotchas

- The strict CSP on uploaded SVG/HTML exists because those files are user-supplied content in `media`/`thumbnail`; without it, stored HTML/SVG could run scripts in the shop's origin.
- For responses rendered by PHP, Shopware itself also sets the frame-options header (only if not already present), `Referrer-Policy: strict-origin-when-cross-origin` and a route-scope CSP, so the values a client sees for PHP pages can differ from those in the Caddyfile.

## Code check (6.7.15.1)
- confirmed `PlatformRequest::HEADER_FRAME_OPTIONS` — Shopware sets the frame-options header to `deny` on PHP responses when absent — vendor/shopware/core/PlatformRequest.php:13
- confirmed `Referrer-Policy` — application sets `strict-origin-when-cross-origin` on successful PHP responses — vendor/shopware/core/Framework/Routing/CoreSubscriber.php:62
- confirmed `Content-Security-Policy` — application only adds its CSP template when the header is not already set — vendor/shopware/core/Framework/Routing/CoreSubscriber.php:73
- confirmed `media` — media files are stored under a `media/` path prefix — vendor/shopware/core/Content/Media/Core/Application/AbstractMediaPathStrategy.php:47
- confirmed `thumbnail` — thumbnails are stored under a `thumbnail/` path prefix — vendor/shopware/core/Content/Media/Core/Application/AbstractMediaPathStrategy.php:48
- confirmed `sitemap/` — sitemap files are served from the `sitemap/` path — vendor/shopware/core/Content/Sitemap/SalesChannel/SitemapFileRoute.php:46
- unverified `php_fastcgi` — Caddy directive, not part of the Shopware code base
