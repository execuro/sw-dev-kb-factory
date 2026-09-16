---
id: platform/dev/6.7/guides/plugins/apps/administration/add-custom-action-button.md
title: Add custom action button
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/administration/add-custom-action-button.html
sourceHash: f6549d443690fe1c4f936da6a60da1819bd63dd2
codeCheckedAgainst: "6.7.13.0"
keywords: ["action-button", "manifest.xml", "actionType", "openNewTab", "openModal", "notification", "reload", "shopware-app-signature", "shopware-shop-signature", "ActionButtonResponse", "smartbar button", "app action", "custom endpoint"]
summary: App manifest smartbar action buttons for Administration detail/list views; request payload and signed responses (notification, modal, tab, reload).
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/resources/references/app-reference/manifest-reference.md", "platform/dev/6.7/guides/plugins/apps/lifecycle/webhook.md", "platform/dev/6.7/guides/plugins/apps/app-scripts/custom-endpoints.md", "platform/dev/6.7/guides/plugins/apps/administration/meteor-admin-sdk.md"]
---
## What it is

Declaring custom action buttons in the smartbar of Administration detail and list views through the `<admin>` section of an app's `manifest.xml`, the request Shopware sends when a button is clicked, and the response format that triggers feedback in the Administration. For advanced cases the [Meteor Admin SDK](platform/dev/6.7/guides/plugins/apps/administration/meteor-admin-sdk.md) is recommended.

## When to use

An app needs a simple button on a product/order/promotion etc. list or detail page that calls the app backend (or an app script custom endpoint) and optionally shows a notification, opens a tab or modal, or reloads the page.

## Key steps / config

1. Manifest (schema `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Manifest/Schema/manifest-3.0.xsd`):

```xml
<admin>
    <action-button action="restockProduct" entity="product" view="list" url="https://example.com/restock">
        <label>restock</label>
    </action-button>
</admin>
```

Required attributes: `action` (free identifier), `entity`, `view` (`detail` or `list`), `url`. The schema restricts `entity` to `product`, `order`, `category`, `promotion`, `customer`, `cms_page`. See [Manifest reference](platform/dev/6.7/resources/references/app-reference/manifest-reference.md).

2. On click the app receives a POST similar to a [webhook](platform/dev/6.7/guides/plugins/apps/lifecycle/webhook.md): `source` (`url`, `appVersion`, `shopId`), `data` (`ids` array, `entity`, `action`), `meta` (`timestamp`, `reference`, `language`). The `sw-version` header carries the Shopware version. Verify `shopware-shop-signature` (SHA256 HMAC of the body with the shop secret from [registration](platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md)).
3. To trigger feedback, respond with a body and header `shopware-app-signature` (HMAC of the body with the app secret). An empty body is always valid.

```json
{ "actionType": "openModal", "payload": { "iframeUrl": "...", "size": "medium", "expand": true } }
```

- `notification`: `status` (`success`, `error`, `info`, `warning`), `message`
- `openNewTab`: `redirectUrl`
- `reload`: empty `payload`
- `openModal`: `iframeUrl` and `size` (`small`, `medium`, `large`, `fullscreen`) both required; `expand` defaults to `false`

4. Custom endpoint target: set a relative `url`, e.g. `url="/api/script/action-button"`, and add the app script `Resources/scripts/api-action-button/action-button-script.twig` that reads `hook.request.ids` and calls `hook.setResponse(services.response.json({...}))` with the same `actionType`/`payload` shape. See [custom endpoints](platform/dev/6.7/guides/plugins/apps/app-scripts/custom-endpoints.md).

App PHP SDK helpers: `ContextResolver::assembleActionButton()`, `ActionButtonResponse::notification()`, `::openNewTab()`, `::reload()`, `::modal()`.

## Essential identifiers

- `<action-button>` attributes `action`, `entity`, `view`, `url`
- `actionType` values `notification`, `reload`, `openNewTab`, `openModal`
- Headers `shopware-shop-signature`, `shopware-app-signature`, `sw-version`
- Modal/tab query params: `shop-id`, `shop-url`, `timestamp`, `sw-context-language`, `sw-user-language`, `shopware-shop-signature`

## Gotchas

- Docs describe modal `size` as defaulting to `medium`; the installed code rejects an `openModal` response without a valid `size` ("The app provided an invalid size").
- A response body without both `actionType` and `payload` fails with "Invalid app response".
- Relative URLs (and apps without an app secret) are executed as an internal sub-request instead of an HTTP call.
- Tab and modal URLs are signed with query parameters; always verify `shopware-shop-signature`.

## Version notes

- 6.4.1.0: `sw-version` header sent. 6.4.3.0: response content evaluated. 6.4.8.0: extra signed query params on tab/modal URLs. 6.4.10.0: relative target URLs for custom endpoints.

## Code check (6.7.13.0)
- corrected `action-button` — docs list only action/entity/view as required; XSD also requires `url` — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:251
- confirmed `entity` — enumeration product, order, category, promotion, customer, cms_page — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:406
- confirmed `view` — enumeration detail, list — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:427
- confirmed `asPayload()` — payload has source and data.ids/entity/action — vendor/shopware/core/Framework/App/ActionButton/AppAction.php:75
- corrected `VALID_MODAL_SIZES` — docs: size defaults to medium; code rejects a missing or invalid size — vendor/shopware/core/Framework/App/ActionButton/Response/OpenModalResponseFactory.php:57
- confirmed `$expand` — modal expand defaults to false — vendor/shopware/core/Framework/App/ActionButton/Response/OpenModalResponse.php:28
- confirmed `getTargetUrl()` — relative URL or missing app secret runs a sub-request; actionType and payload required — vendor/shopware/core/Framework/App/ActionButton/Executor.php:61
- confirmed `SHOPWARE_APP_SIGNATURE` — header `shopware-app-signature` — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:13
- confirmed `sw-version` — header added to app requests — vendor/shopware/core/Framework/App/Hmac/Guzzle/AuthMiddleware.php:110
- confirmed `ACTION_TYPE` — NotificationResponse value `notification` — vendor/shopware/core/Framework/App/ActionButton/Response/NotificationResponse.php:13
