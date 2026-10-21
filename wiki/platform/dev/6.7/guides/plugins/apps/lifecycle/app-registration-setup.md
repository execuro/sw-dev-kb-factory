---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md
relatedPages:
  - platform/dev/6.7/guides/plugins/apps/app-sdks/php/_index.md
  - platform/dev/6.7/guides/plugins/apps/app-sdks/symfony-bundle/_index.md
  - platform/dev/6.7/resources/references/app-reference/manifest-reference.md
  - platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md
sourceHash: ae614cc2e8d09d2f17a60b39229d9937867a7298
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/lifecycle/app-registration-setup.html
title: App Registration & Backend Setup
version: "6.7"
versions:
  - "6.7"
keywords: ["app registration", "app setup handshake", "shopware-app-signature", "shopware-shop-signature", "shopware-shop-signature-previous", "shop-secret", "confirmation_url", "app:validate", "app:shop-id:change", "APP_URL change", "app permissions crud", "manifest requirements public-access", "app lifecycle events", "api/notification"]
summary: "App backend setup handshake (signatures, proof, shop-secret), manifest permissions/requirements, app:validate and APP_URL change strategies."
lastBuilt: 2026-10-21
---
## What it is

How an app with its own backend is registered with a shop during installation (the setup handshake), how permissions and requirements are declared in the manifest, how apps are validated, and how Shopware handles shop URL changes (migration, staging copies).

## When to use

Needed whenever the app backend and Shopware communicate, in particular for Admin Modules, payment methods, tax providers or webhooks. Requests to the app server time out after 5 seconds. The [PHP SDK](platform/dev/6.7/guides/plugins/apps/app-sdks/php/_index.md) and [Symfony bundle](platform/dev/6.7/guides/plugins/apps/app-sdks/symfony-bundle/_index.md) implement the handshake.

## Key steps / config

1. **Registration request** — `GET` to the manifest's setup registration URL with query `shop-id`, `shop-url`, `timestamp` and headers `shopware-app-signature` (HMAC-SHA256 of the query string with the `app secret`), `sw-version`, and on re-registration `shopware-shop-signature` (signed with the current `shop-secret`). Verify with `hash_hmac('sha256', $queryString, $appSecret)` or SDK `Shopware\App\SDK\Authentication\DualSignatureRequestVerifier::authenticateRegistrationRequest($request, $appConfig, $shop)`. For local development, and for private apps with an external server, set `<secret>` in the manifest.
2. **Registration response**:

```json
{ "proof": "<hmac>", "secret": "<shop-secret>", "confirmation_url": "https://.../registration/confirm" }
```

   `proof` = `hash_hmac('sha256', shop-id . shop-url . appName, $appSecret)`; `secret` is the per-shop `shop-secret` (unique, 64–255 chars). On failure return `{"error": "The shop URL is invalid"}`.
3. **Confirmation request** — `POST` to `confirmation_url` with body `apiKey`, `secretKey`, `timestamp`, `shopUrl`, `shopId`. Verify `shopware-shop-signature` = `hash_hmac('sha256', $body, $shopSecret)`. Store credentials per `shopId`; `apiKey`/`secretKey` are `client_id`/`client_secret` for Admin API OAuth. Headers `sw-context-language`, `sw-user-language` are also sent. On re-registration, `shopware-shop-signature-previous` signs the body with the previous `shop-secret`.
4. **Re-registration / rotation** — validate both signatures, generate a new secret, activate new secret/URL only after a valid confirmation, accept the old secret for a short grace period (e.g. 1 minute). Interrupted rotations recover by re-running `app:install` or `app:secret:rotate` ([secret recovery](platform/dev/6.7/guides/plugins/apps/lifecycle/app-secret-recovery.md)).
5. **Requirements and permissions** in `manifest.xml` (schema `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Manifest/Schema/manifest-3.0.xsd`):

```xml
<requirements>
    <public-access/>
</requirements>
<permissions>
    <crud>product</crud>
    <delete>order</delete>
    <permission>system:cache:info</permission>
</permissions>
```

   Requirements are empty elements, validated on install/update in `prod` only. `<read>`/`<create>`/`<update>`/`<delete>` per entity, `<crud>` grants all four, `<permission>` for non-CRUD privileges. Users accept permissions at install; API access is limited to them ([ACL rules](platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md)).
6. **Notifications** — `POST /api/notification` with `status` (`success`/`error`/`info`/`warning`), `message`, optional `adminOnly`, `requiredPrivileges`; needs `notification:create`. Throttled after 10 requests (10 s wait), 15 (30 s), 20 (60 s); reset after 24 h without failure.
7. **Lifecycle events** — `app.installed`, `app.updated`, `app.deleted`, `app.activated`, `app.deactivated` (also as [app script](platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md) hooks).
8. **Validation** — `bin/console app:validate [MyExampleApp]` checks app names, translations, webhook events and permissions, `config.xml`.
9. **Shop URL changes** — if the current `APP_URL` differs from the one used to generate the shop ID, Shopware stops calling apps. Resolve via the Administration modal or `bin/console app:shop-id:change [strategy]`: `move-shop-permanently` (same shop ID, re-registers with new URL/secret), `reinstall-apps` (new shop ID, for staging copies), `uninstall-apps` (removes apps from the new installation).

## Essential identifiers

- Headers: `shopware-app-signature`, `shopware-shop-signature`, `shopware-shop-signature-previous`, `sw-version`
- Keys: `proof`, `secret`, `confirmation_url`, `apiKey`, `secretKey`
- Manifest: `<requirements>`, `<public-access/>`, `<permissions>`, `<crud>`, `<permission>`, `<secret>`
- CLI: `app:validate`, `app:shop-id:change`, `app:secret:rotate`; env `APP_URL`

## Gotchas

- Never publish the `app secret`; apps with a hard-coded manifest `<secret>` cannot be uploaded to the store.
- Webhook payloads require read permission on the contained entities.
- Requirement validation is skipped in `dev` and `test`.
- The old name `app:url-change:resolve` remains an alias of `app:shop-id:change`, deprecated for removal in v6.8.0.

## Version notes

- `sw-version` since 6.4.1.0; language headers since 6.4.5.0; notifications since 6.4.7.0; app-script lifecycle hooks since 6.4.9.0; `<permission>` since 6.4.12.0; `<crud>` since 6.7.3.0; `<requirements>` since 6.7.10.0.

## Code check (6.7.15.1)
- confirmed `RequestSigner::SHOPWARE_APP_SIGNATURE` — `shopware-app-signature` — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:13
- confirmed `RequestSigner::SHOPWARE_SHOP_SIGNATURE` — `shopware-shop-signature` — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:15
- confirmed `shopware-shop-signature-previous` — sent on re-registration confirmation — vendor/shopware/core/Framework/App/Lifecycle/Registration/AppRegistrationService.php:253
- confirmed `app:validate` — command name — vendor/shopware/core/Framework/App/Command/ValidateAppCommand.php:25
- confirmed `app:shop-id:change` — command with optional `strategy` argument — vendor/shopware/core/Framework/App/Command/ChangeShopIdCommand.php:21
- deprecated `app:url-change:resolve` — alias removed in v6.8.0 — vendor/shopware/core/Framework/App/Command/ChangeShopIdCommand.php:24
- confirmed `MoveShopPermanentlyStrategy::STRATEGY_NAME` — `move-shop-permanently`; siblings `reinstall-apps`, `uninstall-apps` — vendor/shopware/core/Framework/App/ShopIdChangeResolver/MoveShopPermanentlyStrategy.php:29
- confirmed `public-access` — PublicAccess requirement name — vendor/shopware/core/Framework/App/Validation/Requirements/PublicAccess.php:68
- confirmed `AppRequirementsValidator::$environment` — requirements enforced only in `prod` — vendor/shopware/core/Framework/App/Validation/AppRequirementsValidator.php:23
- confirmed `crud` — permissions element in manifest-3.0.xsd — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:236
