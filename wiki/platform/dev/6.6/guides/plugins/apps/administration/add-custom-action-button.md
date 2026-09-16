---
id: platform/dev/6.6/guides/plugins/apps/administration/add-custom-action-button.md
title: Add custom action button
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/administration/add-custom-action-button.html
sourceHash: f46fd6f2d93d5482507a9f452cda147b508267c6
keywords: ["action-button", "action button", "manifest.xml", "smartbar", "shopware-shop-signature", "shopware-app-signature", "sw-version", "openNewTab", "notification", "reload", "openModal", "actionType", "custom endpoints"]
summary: "Adding custom action buttons to the Administration smartbar via manifest.xml, plus the request/response actions apps can trigger."
lastBuilt: "2026-09-15"
---
## What it is

Describes adding custom action buttons to the smartbar of Administration detail and list views via the app manifest file.

## Key steps / config

Define `<action-button>` elements inside `<admin>` in the manifest:

```xml
<admin>
    <action-button action="setPromotion" entity="promotion" view="detail" url="https://example.com/promotion/set-promotion">
        <label>set Promotion</label>
    </action-button>
</admin>
```

Required attributes:
- `action` — unique identifier, freely chosen.
- `entity` — the entity the button operates on.
- `view` — `detail` or `list`.

Clicking the button sends a request to the button's URL containing the entity name and the selected id(s) (a single-element array on detail pages), plus `source` (`url`, `appVersion`, `shopId`) and `meta` (`timestamp`, `reference`, `language`). Verify authenticity via the `shopware-shop-signature` header (SHA256 HMAC of the request body, signed with the app's shop secret).

To give feedback, the app responds with a body containing an `actionType` (`notification`, `reload`, `openNewTab`, `openModal`) and a `payload`:
- `openNewTab`: `payload.redirectUrl`
- `notification`: `payload.status` (`success`/`error`/`info`/`warning`), `payload.message`
- `reload`: empty payload
- `openModal`: `payload.iframeUrl`, `payload.size` (`small`/`medium`/`large`/`fullscreen`, default `medium`), `payload.expand` (default `false`)

The response must include a `shopware-app-signature` header (SHA256 HMAC of the response body, signed with the app secret).

Action buttons can also target the app's own custom endpoints (documented separately) by using a relative `url` in the manifest instead of an absolute one.

## Essential identifiers

- `<action-button action="" entity="" view="" url="">`
- `shopware-shop-signature`, `shopware-app-signature`, `sw-version`
- `actionType`, `payload.redirectUrl`, `payload.iframeUrl`, `payload.status`, `payload.message`

## Gotchas

For simple apps, custom action buttons via manifest suffice; for advanced apps, the Meteor Admin SDK is recommended for more features and flexibility.

## Version notes

- Since Shopware 6.4.1.0: the current Shopware version is sent as an `sw-version` header.
- Since Shopware 6.4.3.0: the feedback-response feature was added; previous versions ignore the response content.
- Since Shopware 6.4.8.0: tab/custom-modal requests also carry `shop-id`, `shop-url`, `timestamp`, `sw-context-language`, `sw-user-language`, `shopware-shop-signature` query parameters.
- Since Shopware 6.4.10.0: relative target URLs (pointing at custom endpoints) are supported for action buttons; earlier versions require an absolute URL.
