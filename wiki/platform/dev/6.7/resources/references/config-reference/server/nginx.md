---
id: platform/dev/6.7/resources/references/config-reference/server/nginx.md
title: Nginx
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/config-reference/server/nginx.html
sourceHash: 9f4c1055c626df2458df4f8ea8f530f1ea46b5d6
codeCheckedAgainst: "6.7.15.1"
keywords: ["nginx", "server block", "web server config", "document root public", "fastcgi_pass", "php-fpm", "shopware-installer.phar.php", "Content-Security-Policy", "client_max_body_size", "try_files", "static asset caching", "deny php in media"]
summary: Reference Nginx server block for Shopware 6.7 - public docroot, installer route, PHP denial in asset dirs, CSP for media HTML/SVG, PHP-FPM.
lastBuilt: 2026-10-21
---
## What it is

A reference Nginx `server` block for a Shopware 6.7 installation. The document root must always point to the project's `public` folder for all functionality to work.

## When to use

When you host Shopware on Nginx with PHP-FPM and need a base configuration covering the web installer/updater, static asset caching, security restrictions on public directories and PHP routing through `index.php`.

## Key steps / config

Skeleton (replace `__DOCUMENT_ROOT__`, `server_name` and the FPM address):

```text
server {
    listen 80;
    index index.php index.html;
    client_max_body_size 128M;
    root __DOCUMENT_ROOT__/public;
    location /shopware-installer.phar.php { try_files $uri /shopware-installer.phar.php$is_args$args; }
    location ~ ^/(media|thumbnail|theme|bundles|sitemap).*\.php$ { deny all; }
    location ~* ^/(media|thumbnail)/.*[.]html$ { try_files $uri =404; add_header Content-Security-Policy "..."; }
    location / { try_files $uri /index.php$is_args$args; }
    location ~ \.php$ { include fastcgi.conf; fastcgi_pass 127.0.0.1:9000; }
}
```

Locations in order, as in the source:

1. **Installer / update** — `location /shopware-installer.phar.php` and `location ~ ^/shopware-installer\.phar\.php/.+\.(?:css|js|png|svg|woff)$` both `try_files $uri /shopware-installer.phar.php$is_args$args`.
2. **Dot files** — `location ~ /\.` → `deny all`.
3. **PHP in public dirs** — `location ~ ^/(media|thumbnail|theme|bundles|sitemap).*\.php$` → `deny all`.
4. **Stored HTML** — `location ~* ^/(media|thumbnail)/.*[.]html$`: `try_files $uri =404`, `expires 1y`, `Cache-Control "public, must-revalidate, proxy-revalidate"` and `Content-Security-Policy "script-src 'none'; object-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'"`. The source's comment: stored HTML must not affect pages rendered by PHP.
5. **Asset prefixes** — `location ~ ^/(theme|media|thumbnail|bundles|css|fonts|js|recovery|sitemap)/`: one-year expiry, `log_not_found off`, `tcp_nodelay off`, `open_file_cache max=3000 inactive=120s` (+ `open_file_cache_valid 45s`, `open_file_cache_min_uses 2`, `open_file_cache_errors off`); a nested `location ~* ^.+\.svg` adds the same CSP.
6. **Static file extensions** — `location ~* ^.+\.(?:css|cur|js|jpe?g|gif|ico|png|webp|html|woff|woff2|xml)$`: same caching, `access_log off`, fallback `try_files $uri /index.php$is_args$args`.
7. **SVG anywhere** — `location ~* ^.+\.svg$`: fallback to `index.php`, one-year expiry, same CSP.
8. **Front controller** — `location /` → `try_files $uri /index.php$is_args$args`.
9. **PHP-FPM** — `location ~ \.php$`: `fastcgi_split_path_info ^(.+\.php)(/.+)$`, `include fastcgi.conf`, `fastcgi_param HTTP_PROXY ""`, `fastcgi_buffers 8 16k`, `fastcgi_buffer_size 32k`, `proxy_connect_timeout`/`proxy_send_timeout`/`proxy_read_timeout`/`send_timeout` all `300s`, `client_body_buffer_size 128k`, `fastcgi_pass 127.0.0.1:9000`.

## Essential identifiers

- `root __DOCUMENT_ROOT__/public`
- `shopware-installer.phar.php`
- `client_max_body_size 128M`
- `fastcgi_pass`, `fastcgi.conf`, `fastcgi_param HTTP_PROXY ""`
- `Content-Security-Policy`, `Cache-Control "public, must-revalidate, proxy-revalidate"`

## Gotchas

- The document root must be `public`, not the project root; otherwise not all functionality works.
- The installer location is needed for the web-based update: the Administration update wizard sends the browser to `shopware-installer.phar.php`, which the updater downloads into `public/`.

## Code check (6.7.15.1)
- confirmed `shopware-installer.phar.php` — the updater downloads the web installer into `public/shopware-installer.phar.php` — vendor/shopware/core/Framework/Update/Services/ApiClient.php:75
- confirmed `shopware-installer.phar.php` — Administration update wizard redirects to this path under the API base path — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-shopware-updates/page/sw-settings-shopware-updates-wizard/index.ts:334
- confirmed `media` — media files are stored under a `media/` path prefix — vendor/shopware/core/Content/Media/Core/Application/AbstractMediaPathStrategy.php:47
- confirmed `thumbnail` — thumbnails are stored under a `thumbnail/` path prefix — vendor/shopware/core/Content/Media/Core/Application/AbstractMediaPathStrategy.php:48
- confirmed `sitemap/` — sitemap files are served from the `sitemap/` path — vendor/shopware/core/Content/Sitemap/SalesChannel/SitemapFileRoute.php:46
- confirmed `Content-Security-Policy` — for PHP responses the application adds its own CSP only when the header is not already set — vendor/shopware/core/Framework/Routing/CoreSubscriber.php:73
- unverified `fastcgi_pass` — Nginx directive, not part of the Shopware code base
