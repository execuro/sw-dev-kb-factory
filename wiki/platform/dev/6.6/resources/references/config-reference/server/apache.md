---
id: platform/dev/6.6/resources/references/config-reference/server/apache.md
title: Apache
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/config-reference/server/apache.html
sourceHash: b40222374d08e186623670962afe27f208f610e6
keywords: ["apache", "apache2", "VirtualHost", "DocumentRoot", "AllowOverride", "webserver config", "public folder", "document root", "ErrorLog", "CustomLog", "server config"]
summary: "Reference Apache VirtualHost config for Shopware, pointing DocumentRoot at the public folder."
lastBuilt: 2026-09-15
---
## What it is

Reference Apache webserver configuration for running a Shopware installation, given as a sample `VirtualHost` block.

## When to use

When setting up or reviewing an Apache vhost for a Shopware project.

## Key steps / config

The document root must always point to the `public` folder for all functionality to work.

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

- `DocumentRoot` — must point to `_SHOPWARE_LOCATION_/public`
- `AllowOverride All`
- `ErrorLog`, `CustomLog`
