---
id: platform/dev/6.6/guides/plugins/apps/app-base-guide.md
title: App Base Guide
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/app-base-guide.html
sourceHash: 5b83a9ec05ea891343fe3c5c2d93f83f04c52e3f
keywords: ["manifest.xml", "App Base Guide", "app:install", "app:activate", "app:validate", "bin/console", "APP_URL", "webhook", "registration", "permissions", "ACL", "app secret", "shop secret", "manifest-2.0.xsd", "custom/apps"]
summary: "Guide to building a Shopware app: manifest.xml, install commands, backend registration, permissions, lifecycle events, and APP_URL migration."
lastBuilt: "2026-09-15"
---
## What it is

The App Base Guide walks through adding your own app to Shopware and configuring it to communicate with an external backend server, from file structure through lifecycle handling.

## When to use

Use this guide when building a new app, especially one with its own backend that needs registration (Admin Module, Payment Method, Tax provider, or Webhook features), permission requests, or lifecycle/migration handling.

## Key steps / config

1. Choose a technical name in UpperCamelCase (e.g. `MyExampleApp`); it must match the app's folder name in the manifest.
2. Create `custom/apps/<AppName>/manifest.xml`, the central interface between the app and Shopware:

```xml
<manifest xsi:noNamespaceSchemaLocation="https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Manifest/Schema/manifest-2.0.xsd">
    <meta>
        <name>...</name>
        <label>...</label>
        <version>...</version>
        <icon>...</icon>
        <license>...</license>
    </meta>
</manifest>
```

3. Install and activate with `bin/console app:install --activate MyExampleApp` (omit `--activate` to install inactive, then run `app:activate` later). Skip file validation with `--no-validate`. Clear the cache afterwards with `bin/console cache:clear`, or `cache:clear:http` / `cache:clear:all` if changes still are not visible.
4. Setup (optional) is only required if the app's backend and Shopware need to communicate. Shopware sends a registration `GET` request to the URL from the manifest, with query parameters `shop-id`, `shop-url`, `timestamp`, and headers `shopware-app-signature` and (since 6.4.1.0) `sw-version`. The signature is an HMAC-SHA256 of the query string, signed with the `app secret`.
5. The app backend responds with a `proof` (HMAC-SHA256 of the concatenated `shopId`, `shopUrl`, and app name, signed with the app secret), a generated `secret` (the "shop secret", 64-255 characters), and a `confirmation_url`.
6. Shopware then sends a `POST` confirmation request to `confirmation_url` with `apiKey`, `secretKey`, `timestamp`, `shopUrl`, `shopId` in the body, signed via the `shopware-shop-signature` header using the shop secret. Use `apiKey`/`secretKey` as `client_id`/`client_secret` for an OAuth token against the Admin API.
7. Permissions are declared in the manifest's `<permissions>` element with `<read>`, `<create>`, `<update>`, `<delete>` per entity, or (since 6.4.12.0) a non-CRUD `<permission>` element, e.g. `system:cache:info`.
8. Validate with `bin/console app:validate` (all apps) or `bin/console app:validate MyExampleApp` (one app); it checks for non-matching app names, missing translations, unknown webhook events, missing webhook permissions, and `config.xml` errors.

## Essential identifiers

- `manifest.xml`, schema `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Manifest/Schema/manifest-2.0.xsd`
- `bin/console app:install --activate`, `app:activate`, `app:validate`, `app:url-change:resolve`
- `cache:clear`, `cache:clear:http`, `cache:clear:all`
- `APP_URL` environment variable
- `shopware-app-signature`, `shopware-shop-signature`, `sw-version` headers
- App lifecycle events: `app.installed`, `app.updated`, `app.deleted`, `app.activated`, `app.deactivated`

## Gotchas

- Only the app developer and the Shopware Account should ever know the app's `app-secret` — never publish it. A manifest with a hard-coded `<secret>` cannot be uploaded to the Store, but a private app with an external backend must provide one for local development.
- Admin app notifications (`POST /api/notification`, requires the `notification:create` permission) are rate-limited: after 10 attempts wait 10 seconds, after 15 attempts 30 seconds, after 20 attempts 60 seconds; the limit resets after 24 hours without a failed request.
- If `APP_URL` changes (a shop is migrated, or duplicated as a staging copy), Shopware stops contacting installed apps to avoid data corruption until the user resolves it via `bin/console app:url-change:resolve` (or an Administration modal) using one of `MoveShopPermanently`, `ReinstallApps`, or `UninstallApps`. Simple themes without a backend are unaffected by this mechanism.

## Version notes

- Since 6.4.1.0, registration/confirmation requests include a `sw-version` header; since 6.4.5.0 they also carry `sw-context-language` and `sw-user-language` headers.
- Since 6.4.7.0, apps can send admin notifications via `POST /api/notification`.
- Since 6.4.9.0, App scripts can hook into an app's own lifecycle events without needing an external server.
- Since 6.4.12.0, apps can request non-CRUD privileges via the `<permission>` element.
