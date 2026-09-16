---
id: platform/dev/6.7/guides/plugins/apps/gateways/context/context-gateway.md
title: Context Gateway
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/gateways/context/context-gateway.html
sourceHash: c94d0623cca87a52b9c74c36152672a18a416e26
codeCheckedAgainst: "6.7.13.0"
keywords: ["context gateway", "store-api.context.gateway", "frontend.gateway.context", "ContextGatewayClient", "ContextGatewayCommandsCollectedEvent", "appName", "gateways", "context_change-currency", "createContextGatewayResponse", "customer context", "app server commands", "manifest.xml"]
summary: "Context Gateway (6.7.1.0+): manifest gateways/context URL, store-api and Storefront routes, ContextGatewayClient JS, command validation rules."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/apps/gateways/context/command-reference.md", "platform/dev/6.7/guides/plugins/apps/app-base-guide.md", "platform/dev/6.7/guides/plugins/apps/lifecycle/app-signature-verification.md", "platform/dev/6.7/guides/development/monetization/in-app-purchases.md"]
---
## What it is

The Context Gateway (since 6.7.1.0) lets an app's Storefront JavaScript trigger a signed request to the app server, which answers with commands that modify the customer's sales channel context (currency, language, addresses, payment/shipping method, login, registration).

## When to use

When an app needs server-side logic to change the customer context based on the current cart and sales channel.

## Key steps / config

1. Declare the endpoint in `manifest.xml`:

```xml
<manifest>
    <gateways>
        <context>https://my-app.server.com/context/gateway</context>
    </gateways>
</manifest>
```

2. Trigger it via Store API route `store-api.context.gateway` (`/store-api/context/gateway`, GET/POST) or Storefront route `frontend.gateway.context` (`/gateway/context`). The body must contain `appName`; the app must be active with a context gateway URL.
3. In Storefront JS:

```js
import ContextGatewayClient from 'src/service/context-gateway-client.service';
const client = new ContextGatewayClient('myAppName');
const tokenResponse = await client.call({ some: 'data' }); // { token, redirectUrl? }
client.navigate(tokenResponse, '/custom/target/path');
```

4. The app server receives `source` (`url`, `shopId`, `appVersion`, active in-app purchases), `cart`, `salesChannelContext`, `data` (custom body) and responds:

```json
{ "commands": [ { "command": "context_change-currency", "payload": { "iso": "GBP" } } ] }
```

With `app-php-sdk` 4.1.0+: `ContextResolver::assembleContextGatewayRequest()`, `ChangeCurrencyCommand`, `GatewayResponse::createContextGatewayResponse($commands)`; the Symfony bundle injects `ContextGatewayAction`. Command list: [command reference](platform/dev/6.7/guides/plugins/apps/gateways/context/command-reference.md).

Validation: known command key, valid payload, at most one command per type, at most one `context_register-customer` or `context_login-customer`.

## Essential identifiers

- `store-api.context.gateway`, `frontend.gateway.context`
- `ContextGatewayClient` (`call()`, `navigate()`)
- `Shopware\Core\Framework\Gateway\Context\Command\Event\ContextGatewayCommandsCollectedEvent` — dispatched after commands are collected; plugins can add/modify commands

## Gotchas

- `navigate()` without `customTarget` and without `redirectUrl` reloads the page. With `redirectUrl` but no `customTarget`, the code resolves the current page path against `redirectUrl` (docs say "used as-is"). An absolute `customTarget` replaces the path, a relative one is appended; query parameters are merged, trailing slashes removed.
- Docs: Shopware waits 5 seconds for the app response.
- Requests are signed, see [app signature verification](platform/dev/6.7/guides/plugins/apps/lifecycle/app-signature-verification.md).
- `context_login-customer` logs in without a password; `context_register-customer` creates and logs in a customer. Require explicit consent and validate data.
- A Storefront call failing with a `GatewayException` returns HTTP 400.

## Code check (6.7.13.0)
- confirmed `gateways.context` — xs:anyURI element in manifest schema — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:516
- confirmed `store-api.context.gateway` — `/store-api/context/gateway`, GET and POST — vendor/shopware/core/Framework/Gateway/Context/SalesChannel/ContextGatewayRoute.php:35
- confirmed `frontend.gateway.context` — `/gateway/context`, XmlHttpRequest — vendor/shopware/storefront/Controller/ContextGatewayController.php:31
- confirmed `appName` — missing value throws missingRequestParameter — vendor/shopware/core/Framework/App/Context/Gateway/AppContextGateway.php:46
- confirmed `ContextGatewayClient::call()` — merges `appName` into body, POSTs to route — vendor/shopware/storefront/Resources/app/storefront/src/service/context-gateway-client.service.ts:21
- corrected `ContextGatewayClient::navigate()` — docs: null customTarget uses redirectUrl as-is; code resolves current path against redirectUrl — vendor/shopware/storefront/Resources/app/storefront/src/service/context-gateway-client.service.ts:67
- confirmed `ContextGatewayCommandsCollectedEvent` — dispatched in `AppContextGateway::process()` — vendor/shopware/core/Framework/App/Context/Gateway/AppContextGateway.php:66
- confirmed `ContextGatewayCommandValidator::validate()` — one token command, no duplicate types — vendor/shopware/core/Framework/Gateway/Context/Command/Executor/ContextGatewayCommandValidator.php:25
- unverified `timeout` — 5-second limit not traced in the checked files
- unverified `GatewayResponse::createContextGatewayResponse()` — app-php-sdk, out of scope
