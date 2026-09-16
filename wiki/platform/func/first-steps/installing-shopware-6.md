---
id: "platform/func/first-steps/installing-shopware-6.md"
title: "Installing Shopware 6"
docType: "functional"
version: "6.7"
versions: ["6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/first-steps/installing-shopware-6"
sourceHash: "a51d4e1889bd443e39d504f1b187c605fa09b7fb42a7952381a15fc78676dfa4"
revision:
  current: true
  range: "6.7.3.0 - 6.7.3.1"
  swMax: "6.7.3.1"
  swMin: "6.7.3.0"
keywords: ["installing shopware 6", "system requirements", "htaccess", "vhost routing", "DocumentRoot", "shopware-installer.phar.php", "database configuration", "composer installation", "web installer", "public directory"]
summary: "Installing Shopware 6 covers pre-install requirements, htaccess/vhost routing, the web installer (phar.php), and Composer setup."
lastBuilt: "2026-09-15"
---
## What it is
This page explains what to check before installing Shopware 6 and walks through installation using the web installer, plus an alternative Composer-based path.

## When to use
Use it before and during a fresh Shopware 6 installation.

## Key steps / config
- System requirements: verify the target server meets Shopware 6's requirements before installing; self-hosted is possible, but a hosting partner server is recommended for optimal performance.
- Htaccess: during installation, avoid `.htaccess` protection (it can block the admin), or exclude `/api` from Basic Auth, e.g.:
```
AuthType Basic
AuthName "Please login."
AuthUserFile /path/to/.htpasswd
Require expr %{THE_REQUEST} =~ m#.*?\s+\/api.*?#
Require valid-user
```
- Routing: point the web server's `DocumentRoot` at the Shopware install directory during setup, then switch it to `DocumentRoot _SHOPWARE_DIR_/public` after installation, since the storefront and admin interface are only served from `/public`.
- Download the installer PHP file, place it in an empty public directory, then open it in a browser, e.g. `www.my-url.com/ShopwareFolder/shopware-installer.phar.php`, to start installation; the same file performs updates on an existing installation.
- Installer steps: language selection, system-requirements check, license agreement, database configuration (new or existing empty database, optional port/socket via advanced settings), database import (**Start Installation**), final configuration (shop email address, default system language, default currency, admin user), and language-pack download.
- Alternative: install via Composer, described in the developer documentation's installation template guide.

## Essential identifiers
- `shopware-installer.phar.php`
- `DocumentRoot`
- htaccess `Require expr %{THE_REQUEST}`

## Gotchas
Do not leave the web installer file accessible on an open domain before finishing installation. The default system language and currency cannot be changed after installation.
