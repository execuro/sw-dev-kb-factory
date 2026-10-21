---
id: platform/dev/6.7/resources/references/config-reference/server/apache.md
title: Apache
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/config-reference/server/apache.html
sourceHash: d0f6f911360db56b1a6c18f101bf892601c2ca60
codeCheckedAgainst: "6.7.15.1"
keywords: ["apache", "apache2", "VirtualHost", "DocumentRoot", "public folder", "AllowOverride All", "mod_headers", "Content-Security-Policy", "FilesMatch", "svg", "media", "thumbnail", "web server config", "vhost"]
summary: "Apache VirtualHost for Shopware: DocumentRoot on public/, AllowOverride All, CSP headers blocking scripts in uploaded HTML and SVG media."
lastBuilt: 2026-10-21
---
## What it is

A reference Apache `VirtualHost` configuration for serving Shopware 6.7. The document root must always point to the project's `public` folder, otherwise not all functionality works.

## When to use

When setting up or reviewing an Apache vhost for a Shopware installation, in particular to get the document root right and to add the recommended Content-Security-Policy headers for files served under `/media` and `/thumbnail`.

## Key steps / config

1. Set `DocumentRoot` to `_SHOPWARE_LOCATION_/public` (never the project root).
2. In the `<Directory _SHOPWARE_LOCATION_>` block, use `Options Indexes FollowSymLinks MultiViews`, `AllowOverride All`, `Order allow,deny` and `allow from all`.
3. Inside `<IfModule mod_headers.c>`, set a restrictive `Content-Security-Policy` (`script-src 'none'; object-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'`):
   - conditionally, for existing files (`-f %{REQUEST_FILENAME}`) whose `%{REQUEST_URI}` is under `/media/` or `/thumbnail/` and ends in `.html` (case-insensitive);
   - for every file matching the `FilesMatch` pattern for `.svg` (case-insensitive).
4. Log to `${APACHE_LOG_DIR}/shopware.error.log` and `${APACHE_LOG_DIR}/shopware.access.log combined`.

Skeleton (the docs write the literal dot in both regexes as a bracketed `.` character class; `\.` below is equivalent):

```text
<VirtualHost *:80>
   ServerName "HOST_NAME"
   DocumentRoot _SHOPWARE_LOCATION_/public
   <Directory _SHOPWARE_LOCATION_>
      AllowOverride All
      <IfModule mod_headers.c>
         Header set Content-Security-Policy "script-src 'none'; ..." "expr=-f %{REQUEST_FILENAME} && %{REQUEST_URI} =~ m#^/(media|thumbnail)/.*\.(?i:html)$#"
         <FilesMatch "\.(?i:svg)$">
            Header set Content-Security-Policy "script-src 'none'; ..."
         </FilesMatch>
      </IfModule>
   </Directory>
</VirtualHost>
```

## Essential identifiers

- `DocumentRoot _SHOPWARE_LOCATION_/public`
- `AllowOverride All`
- `mod_headers.c`, `Header set Content-Security-Policy`
- `FilesMatch` (SVG), `%{REQUEST_URI}` match on `/media` and `/thumbnail`
- `${APACHE_LOG_DIR}/shopware.error.log`, `${APACHE_LOG_DIR}/shopware.access.log`

## Gotchas

- `HOST_NAME` and `_SHOPWARE_LOCATION_` are placeholders for the real host name and installation path.
- The CSP headers are wrapped in `IfModule mod_headers.c`, so they are only sent when `mod_headers` is enabled.
- The sample defines a port 80 vhost only.

## Code check (6.7.15.1)
- confirmed `AbstractMediaPathStrategy::generate()` — generated paths start with `media/` or `thumbnail/`, matching the vhost CSP regex — vendor/shopware/core/Content/Media/Core/Application/AbstractMediaPathStrategy.php:37
- confirmed `Content-Security-Policy` — the application adds its own CSP only to responses it handles and only if none is already set — vendor/shopware/core/Framework/Routing/CoreSubscriber.php:73
- unverified `DocumentRoot` — Apache directive, not part of the Shopware code roots
- unverified `mod_headers.c` — Apache module, out of scope of the installed Shopware code
