---
id: platform/dev/6.6/resources/references/config-reference/server/caddy.md
title: Caddy
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/config-reference/server/caddy.html
sourceHash: 9db63a85b1309f2f72d023fa012b4879bdc56567
keywords: ["caddy", "caddyfile", "php_fastcgi", "file_server", "webserver config", "public folder", "X-Frame-Options", "Content-Security-Policy", "server config", "reverse proxy"]
summary: "Reference Caddyfile for Shopware: root at public, php_fastcgi, security headers for SVG assets."
lastBuilt: 2026-09-15
---
## What it is

Reference Caddy webserver configuration (a Caddyfile) for running a Shopware installation.

## Key steps / config

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

- `root * public` — document root set to the `public` folder
- `php_fastcgi 127.0.0.1:9000`
- `header` directive for `X-Frame-Options`, `Referrer-Policy`
- `Content-Security-Policy "script-src 'none'"` applied to `*.svg` matcher
