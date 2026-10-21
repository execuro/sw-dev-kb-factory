---
id: platform/dev/6.7/guides/plugins/apps/administration/add-custom-action-button.md
title: Add custom action button
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/administration/add-custom-action-button.html
sourceHash: f6549d443690fe1c4f936da6a60da1819bd63dd2
codeCheckedAgainst: "6.7.15.1"
keywords: ["action-button", "manifest.xml", "smartbar button", "openNewTab", "openModal", "notification", "reload", "shopware-shop-signature", "shopware-app-signature", "ActionButtonResponse", "/api/script/{hook}", "app action button", "admin button"]
summary: Define app action buttons in manifest.xml for detail/list smartbars, the request Shopware sends, and the signed response types the Admin acts on.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/apps/administration/meteor-admin-sdk.md", "platform/dev/6.7/resources/references/app-reference/manifest-reference.md", "platform/dev/6.7/guides/plugins/apps/lifecycle/webhook.md", "platform/dev/6.7/guides/plugins/apps/app-scripts/custom-endpoints.md"]
---
## What it is

Apps can add custom buttons to the Administration smartbar of entity detail and list views by declaring `<action-button>` elements in the `<admin>` section of `manifest.xml`. Clicking one sends a signed request to the app; the app may answer with a signed JSON body that tells the Administration to open a tab, show a notification, reload, or open a modal. For advanced use the [Meteor Admin SDK](platform/dev/6.7/guides/plugins/apps/administration/meteor-admin-sdk.md) is recommended.

## When to use

A simple app needs a smartbar button on a product, order, category, promotion, customer or CMS page view that triggers a call to the app backend (or an app-script custom endpoint) and gives feedback to the user.

## Key steps / config

1. Declare buttons in `manifest.xml` (schema `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Manifest/Schema/manifest-3.0.xsd`):

```xml
<admin>
    <action-button action="restockProduct" entity="product" view="list" url="https://example.com/restock">
        <label>restock</label>
    </action-button>
</admin>
```

All four attributes are required: `action` (free unique id), `entity` (one of `product`, `order`, `category`, `promotion`, `customer`, `cms_page`), `view` (`detail` or `list`), `url`. At least one `<label>` is required. See the [Manifest reference](platform/dev/6.7/resources/references/app-reference/manifest-reference.md).

2. Handle the request. It resembles a [webhook](platform/dev/6.7/guides/plugins/apps/lifecycle/webhook.md) payload but carries the entity and selected ids (a single id on detail pages):

```json
{
  "source": { "url": "...", "appVersion": "...", "shopId": "..." },
  "data": { "ids": ["..."], "entity": "product", "action": "restockProduct" },
  "meta": { "timestamp": 0, "reference": "...", "language": "..." }
}
```

Verify it via the `shopware-shop-signature` header (SHA256 HMAC of the body, signed with the shop secret from [registration](platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md)). The Shopware version is sent as the `sw-version` header.

3. Optionally respond with a body plus header `shopware-app-signature` (SHA256 HMAC of the whole body, signed with the app secret). An empty body is always valid.

```json
{ "actionType": "openModal", "payload": { "iframeUrl": "https://...", "size": "medium", "expand": true } }
```

- `openNewTab` — `payload.redirectUrl`
- `notification` — `payload.status` (`success`, `error`, `info`, `warning`), `payload.message`
- `reload` — empty `payload`
- `openModal` — `payload.iframeUrl`, `size` (`small`, `medium`, `large`, `fullscreen`), `expand` (bool, default `false`)

URLs opened by `openNewTab`/`openModal` get the query parameters `shop-id`, `shop-url`, `timestamp`, `sw-context-language`, `sw-user-language` and `shopware-shop-signature` (hash of the query part) — verify it.

4. App PHP SDK helpers: `ContextResolver::assembleActionButton()`, `ActionButtonResponse::openNewTab()`, `::notification()`, `::reload()`, `::modal()`; Symfony bundle injects `Shopware\App\SDK\Context\ActionButton\ActionButtonAction`.

5. Custom endpoint target: set a relative `url="/api/script/action-button"` and add `Resources/scripts/api-action-button/action-button-script.twig` which builds `services.response.json({...})` and calls `hook.setResponse(response)`; ids are in `hook.request.ids`. See [custom endpoints](platform/dev/6.7/guides/plugins/apps/app-scripts/custom-endpoints.md).

## Essential identifiers

- `<action-button>` attributes `action`, `entity`, `view`, `url`; child `<label>`
- Action types `openNewTab`, `notification`, `reload`, `openModal`
- Headers `shopware-shop-signature`, `shopware-app-signature`, `sw-version`
- Route `/api/script/{hook}`

## Gotchas

- Buttons are only available in the smartbar of detail and list views.
- `openModal` fails with "The app provided an invalid iframeUrl" and `openNewTab` with "invalid redirectUrl" when the URL is empty.
- Signing of the opened URLs means the app must verify `shopware-shop-signature` on those requests too.

## Version notes

- 6.4.1.0: `sw-version` header added. 6.4.3.0: response content handled (older versions ignore it). 6.4.8.0: signed query parameters on tab/modal URLs. 6.4.10.0: relative URLs (custom endpoints) supported.

## Code check (6.7.15.1)
- confirmed `action-button` — attributes action/entity/view/url all `use="required"` — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:34
- confirmed `entity` — enum product, order, category, promotion, customer, cms_page — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:415
- confirmed `view` — enum detail, list — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:436
- confirmed `OpenNewTabResponse::ACTION_TYPE` — value `openNewTab` — vendor/shopware/core/Framework/App/ActionButton/Response/OpenNewTabResponse.php:13
- confirmed `NotificationResponse::ACTION_TYPE` — value `notification` — vendor/shopware/core/Framework/App/ActionButton/Response/NotificationResponse.php:13
- confirmed `ReloadDataResponse::ACTION_TYPE` — value `reload` — vendor/shopware/core/Framework/App/ActionButton/Response/ReloadDataResponse.php:13
- confirmed `OpenModalResponse::$expand` — defaults to false — vendor/shopware/core/Framework/App/ActionButton/Response/OpenModalResponse.php:28
- confirmed `RequestSigner::SHOPWARE_APP_SIGNATURE` — header `shopware-app-signature` — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:13
- confirmed `shopware-shop-signature` — appended to signed tab/modal URLs with shop-id, shop-url, timestamp — vendor/shopware/core/Framework/App/Hmac/QuerySigner.php:55
- confirmed `/api/script/{hook}` — custom endpoint route — vendor/shopware/core/Framework/Script/Api/ScriptApiRoute.php:34
