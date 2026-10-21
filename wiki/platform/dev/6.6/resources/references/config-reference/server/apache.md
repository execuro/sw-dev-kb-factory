---
id: platform/dev/6.6/resources/references/config-reference/server/apache.md
title: Apache
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/config-reference/server/apache.html
sourceHash: d0f6f911360db56b1a6c18f101bf892601c2ca60
keywords: ["apache", "VirtualHost", "DocumentRoot", "AllowOverride", "Content-Security-Policy", "mod_headers", "FilesMatch", "public folder", "web server", "httpd", "svg", "shopware.error.log"]
summary: Apache VirtualHost reference for Shopware 6.6 - DocumentRoot must be the public folder; includes Content-Security-Policy headers for html and svg files.
lastBuilt: 2026-10-21
---
## What it is

Reference Apache `VirtualHost` configuration for serving a Shopware 6.6 installation. The source states that the document root must always point to the `public` folder, so that all functionality works.

## When to use

When setting up or reviewing an Apache web server for Shopware 6.6, including the Content-Security-Policy headers applied to user-provided files.

## Key steps / config

Skeleton of the configuration (`_SHOPWARE_LOCATION_` and `HOST_NAME` are placeholders to replace):

```text
<VirtualHost *:80>
   ServerName "HOST_NAME"
   DocumentRoot _SHOPWARE_LOCATION_/public
   <Directory _SHOPWARE_LOCATION_>
      Options Indexes FollowSymLinks MultiViews
      AllowOverride All
      Order allow,deny
      allow from all
      <IfModule mod_headers.c> ... </IfModule>
   </Directory>
   ErrorLog ${APACHE_LOG_DIR}/shopware.error.log
   CustomLog ${APACHE_LOG_DIR}/shopware.access.log combined
</VirtualHost>
```

Inside `<IfModule mod_headers.c>` the source sets a `Content-Security-Policy` header in two places:

- A `Header set` with an `expr=` condition: the request must be an existing file (`-f %{REQUEST_FILENAME}`) and the URI must match a case-insensitive regular expression for files under `/media` or `/thumbnail` that end in `.html`.
- A `<FilesMatch>` block matching files ending in `.svg` (case-insensitive) that sets the same header.

Both use the value `script-src 'none'; object-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'`.

## Essential identifiers

- `DocumentRoot _SHOPWARE_LOCATION_/public`
- `AllowOverride All`
- `mod_headers.c`
- `Content-Security-Policy`
- `FilesMatch`
- `${APACHE_LOG_DIR}/shopware.error.log`
- `${APACHE_LOG_DIR}/shopware.access.log`

## Gotchas

- The document root must point to the `public` folder, not the installation root.
- The CSP headers depend on `mod_headers` being available, since they sit inside `<IfModule mod_headers.c>`.
