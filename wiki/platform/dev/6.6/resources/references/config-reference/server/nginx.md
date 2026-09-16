---
id: platform/dev/6.6/resources/references/config-reference/server/nginx.md
title: Nginx
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/config-reference/server/nginx.html
sourceHash: a1521c4336826a30e5987d19bcabbd505db02bf7
keywords: ["nginx", "fastcgi", "webserver config", "public folder", "document root", "try_files", "fastcgi_pass", "shopware-installer.phar.php", "recovery", "cache-control", "server block", "server config"]
summary: "Reference nginx server block for Shopware: document root, PHP fastcgi, static asset caching and installer/recovery routes."
lastBuilt: 2026-09-15
---
## What it is

Reference nginx server block configuration for running a Shopware installation. The document root must always point to the `public` folder.

## Key steps / config

Key elements of the sample `server {}` block:

```text
server {
    listen 80;
    root __DOCUMENT_ROOT__/public;

    location /shopware-installer.phar.php { ... }
    location ~ /\. { deny all; }
    location ~ ^/(media|thumbnail|theme|bundles|sitemap).*\.php$ { deny all; }
    location /recovery/install { ... }
    location /recovery/update/ { ... }
    location ~* ^.+\.(?:css|...|xml)$ { try_files $uri /index.php$is_args$args; }
    location / { try_files $uri /index.php$is_args$args; }
    location ~ \.php$ { fastcgi_pass 127.0.0.1:9000; ... }
}
```

Notable directives: dot-files and `.php` files under `media|thumbnail|theme|bundles|sitemap` are denied; static assets (`css|cur|js|jpeg|gif|ico|png|svg|webp|html|woff|woff2|xml`) get `expires 1y` and `Cache-Control "public, must-revalidate, proxy-revalidate"`; `.svg` responses also get `Content-Security-Policy "script-src 'none'"`; PHP requests go through `fastcgi_pass 127.0.0.1:9000` with `fastcgi_split_path_info` and 300s proxy timeouts.

## Essential identifiers

- `root __DOCUMENT_ROOT__/public`
- `try_files $uri /index.php$is_args$args`
- `fastcgi_pass 127.0.0.1:9000`
- `location /recovery/install`, `location /recovery/update/`
- `location /shopware-installer.phar.php`
