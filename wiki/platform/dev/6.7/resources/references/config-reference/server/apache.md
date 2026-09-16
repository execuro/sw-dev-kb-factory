---
id: platform/dev/6.7/resources/references/config-reference/server/apache.md
title: Apache
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/config-reference/server/apache.html
sourceHash: b40222374d08e186623670962afe27f208f610e6
codeCheckedAgainst: "6.7.13.0"
keywords: ["apache", "apache2", "virtualhost", "vhost", "DocumentRoot", "AllowOverride All", "public folder", "document root", "web server config", "APACHE_LOG_DIR"]
summary: Apache VirtualHost example for Shopware 6.7; DocumentRoot must point to the public folder, AllowOverride All, separate error/access logs.
lastBuilt: 2026-09-15
---
## What it is

A reference Apache `VirtualHost` configuration for serving a Shopware 6.7 installation.

## When to use

When setting up or reviewing an Apache vhost for a Shopware shop.

## Key steps / config

Replace `HOST_NAME` and `_SHOPWARE_LOCATION_` with your host name and installation path:

```text
<VirtualHost *:80>
   ServerName "HOST_NAME"
   DocumentRoot _SHOPWARE_LOCATION_/public
   <Directory _SHOPWARE_LOCATION_>
      Options Indexes FollowSymLinks MultiViews
      AllowOverride All
      Order allow,deny
      allow from all
   </Directory>
   ErrorLog ${APACHE_LOG_DIR}/shopware.error.log
   CustomLog ${APACHE_LOG_DIR}/shopware.access.log combined
</VirtualHost>
```

## Essential identifiers

- `DocumentRoot _SHOPWARE_LOCATION_/public`
- `AllowOverride All`
- `${APACHE_LOG_DIR}/shopware.error.log`, `${APACHE_LOG_DIR}/shopware.access.log`

## Gotchas

- The document root must always point to the `public` folder, otherwise not all functionality works.

## Code check (6.7.13.0)
- confirmed `/public/` — core resolves the web root as the project's public directory (assets installed there) — vendor/shopware/core/Framework/Adapter/Asset/AssetInstallCommand.php:69
- unverified `AllowOverride All` — Apache directive, outside the vendor/shopware code roots
- unverified `APACHE_LOG_DIR` — Apache environment variable, outside the vendor/shopware code roots
