---
id: platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md
title: App Registration & Backend Setup
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/lifecycle/app-registration-setup.html
sourceHash: fe11003ec1f3800b44dbe136b11452a8d78459e7
codeCheckedAgainst: "6.7.13.0"
keywords: ["app registration", "handshake", "shopware-app-signature", "shopware-shop-signature", "shopware-shop-signature-previous", "confirmation_url", "shop-secret", "app:validate", "app:shop-id:change", "requirements", "public-access", "crud", "notification:create", "app.installed", "APP_URL"]
summary: "App backend setup: registration handshake, confirmation, secret rotation, manifest requirements/permissions, notifications, app:validate."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/resources/references/app-reference/manifest-reference.md", "platform/dev/6.7/guides/plugins/apps/lifecycle/webhook.md", "platform/dev/6.7/guides/plugins/apps/app-sdks/php/_index.md", "platform/dev/6.7/resources/references/app-reference/script-reference/script-hooks-reference.md"]
---
## What it is

How an app with its own backend registers with a shop (setup handshake), declares permissions and requirements in `manifest.xml`, sends Administration notifications, receives lifecycle events, validates its config, and how shop migrations (APP_URL changes) are resolved.

## When to use

When your app uses Admin Modules, payment methods, tax providers, webhooks or other backend communication and must exchange secrets with the shop. The [PHP SDK](platform/dev/6.7/guides/plugins/apps/app-sdks/php/_index.md) and [Symfony bundle](platform/dev/6.7/guides/plugins/apps/app-sdks/symfony-bundle/_index.md) implement this flow. Docs: requests to the app server time out after 5 seconds.

## Key steps / config

1. **Registration request** — `GET` to the manifest's registration URL with query `shop-id`, `shop-url`, `timestamp`; headers `shopware-app-signature` (HMAC-SHA256 of the query string with the app secret), `sw-version`, and on re-registration `shopware-shop-signature` (query signed with the current shop secret). Verify with `hash_hmac('sha256', $queryString, $appSecret)`. The app secret comes from the Shopware Account; for local development or private apps with an external server set `<secret>` in the manifest (store apps cannot).
2. **Registration response** — proof = `hash_hmac('sha256', shop-id . shop-url . appName, $appSecret)`:

```json
{ "proof": "...", "secret": "<new shop-secret>", "confirmation_url": "https://my.example.com/registration/confirm" }
```

   To abort installation return `{ "error": "The shop URL is invalid" }`. The shop-secret should be unique per shop, 64–255 characters; store it with `shopId` and `shopUrl`.
3. **Confirmation request** — `POST` to `confirmation_url`, JSON body `apiKey`, `secretKey`, `timestamp`, `shopUrl`, `shopId`; header `shopware-shop-signature` (HMAC-SHA256 of the body with the new shop-secret), plus `shopware-shop-signature-previous` (previous secret) on re-registration. Use `apiKey`/`secretKey` as `client_id`/`client_secret` for Admin API OAuth.
4. **Secret rotation / shop-url change** — the shop re-registers with a known shop ID: validate both signatures, return a new secret, activate it and the new URL only after a valid confirmation, accept the old secret for a short grace period (e.g. 1 minute).
5. **Requirements** (6.7.10.0+) and **permissions** in the manifest (schema `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Manifest/Schema/manifest-3.0.xsd`):

```xml
<manifest>
    <requirements><public-access/></requirements>
    <permissions>
        <crud>product</crud>
        <delete>order</delete>
        <permission>system:cache:info</permission>
    </permissions>
</manifest>
```

   Requirements are empty elements (presence enables), checked on install/update. Permissions: `read`/`create`/`update`/`delete` per entity, `<crud>` shortcut (6.7.3.0+), `<permission>` for non-CRUD privileges (6.4.12.0+); accepted by the user on install and limiting API access.
6. **Notifications** (6.4.7.0+) — `POST /api/notification` with `status` (`success`/`error`/`info`/`warning`), `message`, optional `adminOnly`, `requiredPrivileges`; needs `notification:create`. Throttling: after 10 requests wait 10 s, 15 → 30 s, 20 → 60 s; reset after 24 h without failures.
7. **Lifecycle events** — `app.installed`, `app.updated`, `app.deleted`, `app.activated`, `app.deactivated`; app scripts can hook into the lifecycle since 6.4.9.0.
8. **Validation** — `bin/console app:validate [MyExampleApp]` checks app names, translations, webhook events/permissions, `config.xml`.
9. **Shop migration** — if `APP_URL` differs from the one used to generate the shop ID, app communication stops. Resolve in the Administration modal or with `bin/console app:shop-id:change [strategy]`: `move-shop-permanently` (re-register apps, same shop ID, new URL and secrets), `reinstall-apps` (new shop ID), `uninstall-apps`.

## Essential identifiers

- Headers: `shopware-app-signature`, `shopware-shop-signature`, `shopware-shop-signature-previous`, `sw-version`, `sw-context-language`, `sw-user-language`
- Response keys: `proof`, `secret`, `confirmation_url`, `error`
- CLI: `app:validate`, `app:shop-id:change`
- SDK: `Shopware\App\SDK\Authentication\DualSignatureRequestVerifier`

## Gotchas

- Registration fails if the returned `secret` equals the current app secret.
- Requirement validation is skipped outside the `prod` environment.
- Read permissions also cover entity data inside subscribed [webhooks](platform/dev/6.7/guides/plugins/apps/lifecycle/webhook.md).
- `app:url-change:resolve` (as named in the docs) is only a deprecated alias of `app:shop-id:change`.

## Version notes

- `sw-version` header since 6.4.1.0; `sw-context-language`/`sw-user-language` since 6.4.5.0.
- The `app:url-change:resolve` alias is removed in 6.8.0.

## Code check (6.7.13.0)
- confirmed `PrivateHandshake::assembleRequest()` — GET with shop-id/shop-url/timestamp, app signature, shop signature on re-registration — vendor/shopware/core/Framework/App/Lifecycle/Registration/PrivateHandshake.php:31
- confirmed `PrivateHandshake::fetchAppProof()` — HMAC of shopId . shopUrl . appName — vendor/shopware/core/Framework/App/Lifecycle/Registration/PrivateHandshake.php:61
- confirmed `confirmation_url` — read from registration response; new secret must differ from current — vendor/shopware/core/Framework/App/Lifecycle/Registration/AppRegistrationService.php:55
- confirmed `shopware-shop-signature-previous` — added on re-registration confirmation — vendor/shopware/core/Framework/App/Lifecycle/Registration/AppRegistrationService.php:138
- confirmed `requirements` — any child element allowed, presence enables — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:615
- corrected `environment` — docs: validated in prod, skipped in dev/test; code skips every non-prod environment — vendor/shopware/core/Framework/App/Validation/AppRequirementsValidator.php:38
- confirmed `notification:create` — ACL on `/api/notification` — vendor/shopware/core/Framework/Notification/Api/NotificationController.php:45
- confirmed `notification` — rate limiter 10/10s, 15/30s, 20/60s, reset 24 hours — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:315
- deprecated `app:url-change:resolve` — alias of `app:shop-id:change`, removed in v6.8.0 — vendor/shopware/core/Framework/App/Command/ChangeShopIdCommand.php:23
- corrected `MoveShopPermanentlyStrategy::STRATEGY_NAME` — docs: MoveShopPermanently; CLI strategy name `move-shop-permanently` — vendor/shopware/core/Framework/App/ShopIdChangeResolver/MoveShopPermanentlyStrategy.php:29
