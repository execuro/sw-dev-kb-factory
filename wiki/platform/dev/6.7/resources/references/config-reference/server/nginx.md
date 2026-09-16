---
id: platform/dev/6.7/resources/references/config-reference/server/nginx.md
title: Nginx
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/config-reference/server/nginx.html
sourceHash: 9a35d03f6d30646d23d7de2313e38ba402005810
codeCheckedAgainst: "6.7.13.0"
keywords: ["nginx", "server block", "web server config", "document root", "public folder", "shopware-installer.phar.php", "fastcgi_pass", "try_files", "index.php", "php-fpm", "static asset caching", "Content-Security-Policy", "vhost"]
summary: Reference Nginx server block for Shopware 6.7 - document root on public/, installer and index.php rewrites, asset caching, dotfile/PHP denies, PHP-FPM.
lastBuilt: 2026-09-15
---
## What it is

The reference Nginx `server` block for running Shopware 6.7: document root, front-controller rewrites, web-installer routes, access denies, static asset caching headers and the PHP-FPM FastCGI handoff.

## When to use

When setting up or reviewing an Nginx vhost for a Shopware project (self-hosted server, custom Docker image) instead of Apache.

## Key steps / config

1. Point the document root at the project's `public` folder: `root __DOCUMENT_ROOT__/public;` — the docs state it must always be `public` for all functionality to work.
2. Base directives: `index index.php index.html;`, `client_max_body_size 128M;`.
3. Route the web installer/updater: `location /shopware-installer.phar.php { try_files $uri /shopware-installer.phar.php$is_args$args; }` plus a regex location for its `css|js|png|svg|woff` assets.
4. Deny dotfiles (`location ~ /\. { deny all; }`) and PHP files in public asset dirs: `location ~ ^/(media|thumbnail|theme|bundles|sitemap).*\.php$ { deny all; }`.
5. Cache public asset directories `^/(theme|media|thumbnail|bundles|css|fonts|js|recovery|sitemap)/` and static file extensions with `expires 1y;`, `add_header Cache-Control "public, must-revalidate, proxy-revalidate";`, `log_not_found off;`, `tcp_nodelay off;` and `open_file_cache max=3000 inactive=120s;` (valid 45s, min_uses 2, errors off). Static-extension misses fall back to `try_files $uri /index.php$is_args$args;`.
6. Serve SVGs with `add_header Content-Security-Policy "script-src 'none'";`.
7. Front controller: `location / { try_files $uri /index.php$is_args$args; }`.
8. PHP handoff skeleton:

```text
location ~ \.php$ {
    fastcgi_split_path_info ^(.+\.php)(/.+)$;
    include fastcgi.conf;
    fastcgi_param HTTP_PROXY "";
    fastcgi_buffers 8 16k;
    fastcgi_buffer_size 32k;
    proxy_read_timeout 300s;   # also connect/send, send_timeout 300s
    client_body_buffer_size 128k;
    fastcgi_pass 127.0.0.1:9000;
}
```

## Essential identifiers

- `root __DOCUMENT_ROOT__/public;`
- `/shopware-installer.phar.php`
- `try_files $uri /index.php$is_args$args;`
- `fastcgi_param HTTP_PROXY "";`
- `fastcgi_pass 127.0.0.1:9000;`
- `Content-Security-Policy "script-src 'none'"`

## Gotchas

- `__DOCUMENT_ROOT__` is a placeholder for the project path; the root must end in `/public`.
- `fastcgi_param HTTP_PROXY "";` clears the `Proxy` request header passed to PHP.
- The SVG CSP header blocks scripts embedded in uploaded SVG files.
- The `server_name localhost;` and `listen 80;` values are sample values; adapt them (and TLS) for real hosts.

## Code check (6.7.13.0)
- confirmed `shopware-installer.phar.php` — core updater downloads the installer into the project's `public/` folder, matching the Nginx location — vendor/shopware/core/Framework/Update/Services/ApiClient.php:80
- confirmed `shopware-installer.phar.php` — Administration update wizard opens it under the API base path — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-shopware-updates/page/sw-settings-shopware-updates-wizard/index.ts:240
- unverified `fastcgi_pass` — Nginx/PHP-FPM directives are server config, not in the checked vendor roots
- unverified `index.php` — the public front controller lives in the project template, not in the checked vendor roots
