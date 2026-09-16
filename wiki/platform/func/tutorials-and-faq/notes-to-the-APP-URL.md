---
id: platform/func/tutorials-and-faq/notes-to-the-APP-URL.md
title: Notes To The APP URL
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/notes-to-the-APP-URL
sourceHash: 1cc7922337c0319a7fb93edc6a902e1fb076eaf83441dbe96670759aee473921
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["APP_URL", "app url", "self-hosted", "apps", ".env", ".env.local", "APP_URL_CHECK_DISABLED", "domain change detected", "sales channel domain", "app server", "licence domain", "shop id"]
summary: "How the APP_URL env variable lets self-hosted apps talk to Shopware, where to set it, and how to handle a domain move."
lastBuilt: 2026-09-15
---

## What it is

`APP_URL` is a configuration variable, read from the `.env` file, that lets external apps (e.g. purchased from the Shopware Store) exchange information with a self-hosted Shopware installation, independent of the registered account/licence domain.

## When to use

Relevant whenever a self-hosted shop is moved to another domain, apps stop working, or the admin shows the message "Domain change detected".

## Key steps / config

The `.env` file sits in the installation's root directory and is a hidden file; it requires FTP/SSH access to view or edit. As of Shopware 6.5.0.0, changes belong in `.env.local` instead of `.env`. Example structure:

```
APP_ENV="prod"
APP_URL="https://YOUR-DOMAIN"
DATABASE_URL="mysql://YOUR-DATABASE"
SHOPWARE_ES_HOSTS="elasticsearch:9200"
SHOPWARE_ES_ENABLED="0"
SHOPWARE_HTTP_CACHE_ENABLED="1"
SHOPWARE_HTTP_DEFAULT_TTL="7200"
```

Points to check when moving a shop:
- Accessibility: the domain must be reachable; the default domain is the first sales channel's domain and cannot be easily changed later in the administration.
- Multiple domains: if several sales channel domains exist, pick one as `APP_URL`.
- Shop/domain moved: verify the licence domain under **Settings > System > Shopware Account**.
- The `.env` root line should read `APP_URL={domain}` (e.g. `APP_URL=https://my-shop.com`).
- To silence the "Wrongly configured APP_URL" warning when the URL is actually correct, set `APP_URL_CHECK_DISABLED=1` in `.env` (`.env.local` from 6.5).

When a domain change is detected, the admin shows a modal with three options: "Migrate apps to new domain" (re-registers apps at app servers under the new domain, shop id unchanged), "Copy apps to current domain" (re-installs and re-registers apps, new shop id generated — for a copy of the shop that should keep using the apps), and "Uninstall apps" (deletes apps without notifying app servers, new shop id generated — for a copy that should not use the apps).

## Essential identifiers

- `APP_URL`
- `.env` / `.env.local`
- `APP_URL_CHECK_DISABLED=1`

## Gotchas

Disabling the APP_URL check via `APP_URL_CHECK_DISABLED=1` may cause apps to stop working unless HTTP communication between the store and host is allowed.

## Version notes

From Shopware 6.5.0.0, the described `.env` changes must be made in `.env.local` instead of `.env`.
