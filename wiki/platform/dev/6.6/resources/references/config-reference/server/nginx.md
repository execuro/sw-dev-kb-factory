---
id: platform/dev/6.6/resources/references/config-reference/server/nginx.md
title: Nginx
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/config-reference/server/nginx.html
sourceHash: 5b49327c8a57ee72bce421c120dca2ec5c712e6d
keywords: ["nginx", "server block", "fastcgi_pass", "try_files", "shopware-installer.phar.php", "client_max_body_size", "open_file_cache", "Content-Security-Policy", "recovery/install", "recovery/update", "web server", "svg csp"]
summary: "Reference Nginx server block for Shopware 6.6: public root, installer and recovery routes, asset caching, blocked dotfiles and PHP, CSP for HTML and SVG."
lastBuilt: 2026-10-20
---
## What it is

The reference Nginx `server` block for serving Shopware 6.6. It sets the root to `public`, routes the web installer and recovery tool, caches static assets, blocks sensitive paths and forwards PHP to FastCGI.

## When to use

When configuring or reviewing Nginx for a Shopware 6.6 shop, or updating an existing config to receive the CSP protection for stored HTML and SVG files.

## Key steps / config

The document root must always point to the `public` folder. Replace `__DOCUMENT_ROOT__`.

```text
server {
    listen 80;
    index index.php index.html;
    server_name localhost;
    client_max_body_size 128M;
    root __DOCUMENT_ROOT__/public;
    ...
}
```

Locations in the block:

- `/shopware-installer.phar.php` and `^/shopware-installer\.phar\.php/.+\.(?:css|js|png|svg|woff)$` use `try_files $uri /shopware-installer.phar.php$is_args$args;` for install and update.
- `~ /\.` and `~ ^/(media|thumbnail|theme|bundles|sitemap).*\.php$` use `deny all;` (dotfiles and PHP in public directories).
- `/recovery/install` falls back to `/recovery/install/index.php$is_args$args`; `/recovery/update/` rewrites to `/recovery/update/index.php` when the file does not exist.
- `~* ^/(media|thumbnail)/.*[.]html$` serves stored HTML with `try_files $uri =404;`, `expires 1y` and the CSP header.
- `~ ^/(theme|media|thumbnail|bundles|css|fonts|js|recovery|sitemap)/` and the static extension location set `expires 1y`, `Cache-Control "public, must-revalidate, proxy-revalidate"` and `open_file_cache max=3000 inactive=120s` with `open_file_cache_valid 45s`, `open_file_cache_min_uses 2`, `open_file_cache_errors off`.
- SVG locations add the CSP header.
- `location /` uses `try_files $uri /index.php$is_args$args;`.
- `~ \.php$` uses `fastcgi_split_path_info`, `include fastcgi.conf`, `fastcgi_param HTTP_PROXY ""`, `fastcgi_buffers 8 16k`, `fastcgi_buffer_size 32k`, 300s proxy and send timeouts, `client_body_buffer_size 128k` and `fastcgi_pass 127.0.0.1:9000;`.

CSP value used for HTML and SVG:

```text
script-src 'none'; object-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'
```

## Essential identifiers

- `root __DOCUMENT_ROOT__/public`
- `client_max_body_size 128M`
- `fastcgi_pass 127.0.0.1:9000`
- `try_files $uri /index.php$is_args$args`
- `/shopware-installer.phar.php`, `/recovery/install`, `/recovery/update/`
- `add_header Content-Security-Policy`

## Gotchas

- Document root not on `public` breaks functionality.
- Because `add_header` is declared per location, nested locations such as the SVG one repeat `Cache-Control` and the CSP header themselves.
