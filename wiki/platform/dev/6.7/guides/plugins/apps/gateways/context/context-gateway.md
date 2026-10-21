---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/apps/gateways/context/context-gateway.md
relatedPages:
  - platform/dev/6.7/guides/plugins/apps/app-base-guide.md
  - platform/dev/6.7/guides/development/monetization/in-app-purchases.md
  - platform/dev/6.7/guides/plugins/apps/lifecycle/app-signature-verification.md
  - platform/dev/6.7/guides/plugins/apps/gateways/context/command-reference.md
sourceHash: c94d0623cca87a52b9c74c36152672a18a416e26
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/gateways/context/context-gateway.html
title: Context Gateway
version: "6.7"
versions:
  - "6.7"
keywords: ["context gateway", "store-api.context.gateway", "frontend.gateway.context", "ContextGatewayClient", "ContextGatewayCommandsCollectedEvent", "appName", "gateways manifest", "context_gateway permission", "sales channel context", "change currency from app", "login customer from app", "GatewayResponse"]
summary: Context Gateway (6.7.1.0+) lets an app server return commands that change the customer's sales channel context, triggered via Store API or Storefront.
lastBuilt: 2026-10-21
---
## What it is

The Context Gateway (since 6.7.1.0) lets an app's JavaScript call Shopware, which forwards the current `SalesChannelContext`, `Cart` and custom data to the app server; the app server answers with commands that change the customer context (currency, language, addresses, payment/shipping method, login, registration).

## When to use

When an app needs to switch or manipulate the customer's context based on server-side decisions, e.g. switching to GBP and `en-GB` when the current currency is not GBP.

## Key steps / config

1. Declare the gateway URL in `manifest.xml`:

```xml
<manifest>
    <gateways>
        <context>https://my-app.server.com/context/gateway</context>
    </gateways>
</manifest>
```

Declaring `<context>` makes Shopware add the `context_gateway` permission to the app's requested permissions; requests are rejected until it is granted.

2. Trigger the gateway:
   - Store API: route `store-api.context.gateway` (path `/store-api/context/gateway`, GET/POST). The body must contain `appName` (the app name from the manifest); other body fields are forwarded as custom data.
   - Storefront: route `frontend.gateway.context` (path `/gateway/context`), registered automatically. Use the JS client:

```javascript
import ContextGatewayClient from 'src/service/context-gateway-client.service';
const gatewayClient = new ContextGatewayClient('myAppName');
const tokenResponse = await gatewayClient.call({ some: 'data' });
// tokenResponse.token, tokenResponse.redirectUrl
await gatewayClient.navigate(tokenResponse, '/custom/target/path');
```

   `navigate(tokenResponse, customTarget)`: an absolute `customTarget` (starting with `/`) replaces the path of `redirectUrl`; a relative one is appended; `null` uses `redirectUrl` as-is, or reloads the page if there is none. Trailing slashes are removed.

3. App server receives `source` (`url`, `shopId`, `appVersion`, active in-app purchases), `cart`, `salesChannelContext`, `data` (custom data), signed via app signature verification. Respond within 5 seconds:

```json
{
  "commands": [
    { "command": "context_change-currency", "payload": { "iso": "GBP" } },
    { "command": "context_change-language", "payload": { "iso": "en-GB" } }
  ]
}
```

   With `app-php-sdk` 4.1.0+: `ContextResolver::assembleContextGatewayRequest()` yields a `ContextGatewayAction`; build a `Collection` of commands (`ChangeCurrencyCommand`, `ChangeLanguageCommand`, ...) and return `GatewayResponse::createContextGatewayResponse($commands)`, signed. The Symfony bundle injects `ContextGatewayAction` into a controller action directly.

4. Validation by Shopware: command key must be known, payload valid for that command, no duplicate command types, at most one `context_register-customer` or `context_login-customer` per response. See [command reference](platform/dev/6.7/guides/plugins/apps/gateways/context/command-reference.md).

## Essential identifiers

- `store-api.context.gateway`, `frontend.gateway.context`
- `ContextGatewayClient` (`src/service/context-gateway-client.service`), `call()`, `navigate()`
- `Shopware\Core\Framework\Gateway\Context\Command\Event\ContextGatewayCommandsCollectedEvent` — dispatched after commands are collected; plugins may modify/add commands
- Manifest `<gateways><context>`, permission `context_gateway`
- SDK: `Shopware\App\SDK\Context\Gateway\Context\ContextGatewayAction`, `Shopware\App\SDK\Response\GatewayResponse`

## Gotchas

- `context_login-customer` logs a customer in without a password; `context_register-customer` creates an account and logs it in. Your app must obtain explicit customer consent and validate data.
- Missing `appName` fails the request; the app must be active and have a context gateway URL configured.
- Shopware waits 5 seconds for the app server response.
- Invalid commands/payloads are logged or thrown depending on environment (via `ExceptionLogger`), not silently executed.

## Version notes

- Introduced in 6.7.1.0. PHP SDK support since `app-php-sdk` 4.1.0.
- The implicit `context_gateway` capability permission is not mentioned in the docs; it is enforced in 6.7.15.1.

## Code check (6.7.15.1)
- confirmed `store-api.context.gateway` — path `/store-api/context/gateway`, GET/POST — vendor/shopware/core/Framework/Gateway/Context/SalesChannel/ContextGatewayRoute.php:35
- confirmed `frontend.gateway.context` — path `/gateway/context`, XmlHttpRequest — vendor/shopware/storefront/Controller/ContextGatewayController.php:31
- confirmed `appName` — required request parameter — vendor/shopware/core/Framework/App/Context/Gateway/AppContextGateway.php:49
- corrected `context_gateway` — docs: only the manifest URL is needed; code also requires this granted capability permission — vendor/shopware/core/Framework/App/Manifest/Xml/Gateway/ContextGateway.php:13
- confirmed `ContextGateway::PERMISSION` — added to requested permissions when `<context>` is declared — vendor/shopware/core/Framework/App/Manifest/Manifest.php:346
- confirmed `Gateways::GATEWAYS` — manifest tag `context` maps to ContextGateway — vendor/shopware/core/Framework/App/Manifest/Xml/Gateway/Gateways.php:17
- confirmed `ContextGatewayCommandsCollectedEvent` — dispatched after collecting commands — vendor/shopware/core/Framework/App/Context/Gateway/AppContextGateway.php:77
- confirmed `ContextGatewayCommandValidator::validate()` — one token command max, no duplicate types — vendor/shopware/core/Framework/Gateway/Context/Command/Executor/ContextGatewayCommandValidator.php:25
- confirmed `ContextGatewayClient` — `call()` adds `appName`, uses `frontend.gateway.context` — vendor/shopware/storefront/Resources/app/storefront/src/service/context-gateway-client.service.ts:9
- unverified `5 seconds` — timeout value not located in the checked gateway files
