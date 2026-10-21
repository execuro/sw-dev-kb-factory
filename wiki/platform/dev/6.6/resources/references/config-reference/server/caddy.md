---
id: platform/dev/6.6/resources/references/config-reference/server/caddy.md
title: Caddy
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/config-reference/server/caddy.html
sourceHash: 4ca6bb8f13ce91d0440ba988be5306a31ac16e18
keywords: ["caddy", "Caddyfile", "php_fastcgi", "file_server", "staticDocuments", "path_regexp", "Content-Security-Policy", "X-Frame-Options", "Referrer-Policy", "web server", "encode zstd gzip", "svg csp"]
summary: Reference Caddyfile for Shopware 6.6 with php_fastcgi on 127.0.0.1:9000, public root, security headers and CSP for stored HTML and SVG files.
lastBuilt: 2026-10-20
---
## What it is

The reference Caddy site block for serving Shopware 6.6. It serves the `public` directory through `php_fastcgi`, compresses responses, and sends security headers including a restrictive `Content-Security-Policy` for stored HTML and SVG files.

## When to use

When configuring or reviewing a Caddy web server for a Shopware 6.6 shop.

## Key steps / config

Skeleton of the site block (replace `mydomain.com`):

```text
mydomain.com {
  header {
    X-Frame-Options DENY
    Referrer-Policy no-referrer-when-downgrade
  }

  @staticDocuments {
    file
    path_regexp staticDocuments (?i)([.]svg$|^/(media|thumbnail)/.*[.]html$)
  }
  header @staticDocuments Content-Security-Policy "script-src 'none'; object-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'"

  @default {
    not path /theme/* /media/* /thumbnail/* /bundles/* /css/* /fonts/* /js/* /recovery/* /sitemap/*
  }

  root * public
  php_fastcgi 127.0.0.1:9000
  encode zstd gzip
  file_server
}
```

- The `@staticDocuments` matcher selects existing files that are SVG, or HTML below `/media` or `/thumbnail`, and attaches the CSP header to them.
- The `@default` matcher lists the static asset path prefixes: `/theme`, `/media`, `/thumbnail`, `/bundles`, `/css`, `/fonts`, `/js`, `/recovery`, `/sitemap`.
- PHP is served via FastCGI on `127.0.0.1:9000`.

## Essential identifiers

- `@staticDocuments`, `@default`
- `php_fastcgi 127.0.0.1:9000`
- `root * public`
- `encode zstd gzip`
- `X-Frame-Options DENY`
- `Referrer-Policy no-referrer-when-downgrade`
- `Content-Security-Policy`
