---
id: platform/dev/6.7/resources/references/adr/2025-04-01-context-gateway.md
title: Context Gateway
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2025-04-01-context-gateway.html
sourceHash: 786edd8b092dda279def4ba4111dc20e83c19f38
codeCheckedAgainst: "6.7.15.1"
keywords: ["context gateway", "AppContextGateway", "ContextGatewayRoute", "store-api.context.gateway", "frontend.gateway.context", "ContextGatewayClient", "AbstractContextGatewayCommand", "AbstractContextGatewayCommandHandler", "shopware.context.gateway.command", "ContextGatewayCommandsCollectedEvent", "context_register-customer", "app server", "sales channel context", "gateways manifest"]
summary: "ADR: Context Gateway lets an app server change the SalesChannelContext (login, register, language, currency) via commands sent from the storefront."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2025-04-01, area checkout) introducing the Context Gateway: a channel through which an app server changes the `SalesChannelContext` (customer, language, currency, addresses) outside the checkout, before a cart or checkout starts. The storefront client initiates it; the app answers with commands that Shopware executes, following the command pattern of the existing `CheckoutGateway`.

## When to use

- Your app must register (guest or full) or log in a customer, switch language or currency, or update the active address based on external logic.
- A plugin needs to inspect or alter the commands an app returned.

## Key steps / config

1. Declare the endpoint in the app's `manifest.xml` under `<gateways>` (schema `manifest-3.0.xsd`, element `context`, type `xs:anyURI`):

```xml
<manifest>
    <gateways>
        <context>https://example.com/context/gateway</context>
    </gateways>
</manifest>
```

2. The app must also hold the `context_gateway` capability (`ContextGateway::PERMISSION`); otherwise `AppContextGateway::process()` rejects the call.
3. Storefront route `frontend.gateway.context` (path `/gateway/context`, GET/POST, `XmlHttpRequest`) in `Shopware\Storefront\Controller\ContextGatewayController` loads the cart and calls `AbstractContextGatewayRoute::load()`. The Store API route is `store-api.context.gateway` at `/store-api/context/gateway` (`Shopware\Core\Framework\Gateway\Context\SalesChannel\ContextGatewayRoute`). The body must contain `appName`; all body data becomes the `RequestDataBag` in `ContextGatewayPayloadStruct` (cart, context, data). The response is a `ContextTokenResponse`.
4. Storefront JS helper `ContextGatewayClient` (`service/context-gateway-client.service.ts`) is constructed with the app name. `call(data)` POSTs `{ ...data, appName }` with `X-Requested-With: XMLHttpRequest` to `window.router['frontend.gateway.context']` and returns `{ token, redirectUrl? }`; `navigate(tokenResponse, customTarget)` reloads or redirects.
5. App server request and response:

```json5
// request to app server
{ "source": { /* app source */ }, "salesChannelContext": {}, "cart": {}, "custom": { "anyCustomKey": "..." } }
// response from app server
[
  { "command": "context_register-customer", "payload": { /* RegisterCustomerData */ } },
  { "command": "context_change-language", "payload": { "iso": "de-DE" } },
  { "command": "context_change-currency", "payload": { "iso": "USD" } }
]
```

Command keys in 6.7: `context_register-customer`, `context_login-customer`, `context_change-language`, `context_change-currency`, `context_change-shipping-method`, `context_change-payment-method`, `context_change-billing-address`, `context_change-shipping-address`, `context_change-shipping-location`, `context_add-customer-message`.

Register/login commands run first; the rest run in response order on the resulting context. `ContextGatewayCommandValidator` allows at most one register-or-login command and no duplicate command type.

6. Command and handler shape (handlers are collected by `ContextGatewayCommandRegistry` via the tag `shopware.context.gateway.command`):

```php
class ChangeCurrencyCommand extends AbstractContextGatewayCommand {
    public const COMMAND_KEY = 'context_change-currency';
    public function __construct(public readonly string $iso) {}
    public static function getDefaultKeyName(): string { return self::COMMAND_KEY; }
}
class ChangeCurrencyCommandHandler extends AbstractContextGatewayCommandHandler {
    public function handle(AbstractContextGatewayCommand $command, SalesChannelContext $context, array &$parameters): void { /* set $parameters['currencyId'] */ }
    public static function supportedCommands(): array { return [ChangeCurrencyCommand::class]; }
}
```

`$parameters` is used by the context switch route to update the context. Commands are built from the app payload via `AbstractContextGatewayCommand::createFromPayload()` (named constructor arguments).

7. `ContextGatewayCommandsCollectedEvent` is dispatched after commands are collected and before execution, so plugins can inspect, modify or append commands.

## Essential identifiers

- `Shopware\Core\Framework\App\Context\Gateway\AppContextGateway`
- `ContextGatewayRoute` / `AbstractContextGatewayRoute` (`getDecorated()`, `load()`), `store-api.context.gateway`
- `ContextGatewayController`, `frontend.gateway.context`, `ContextGatewayClient`
- `ContextGatewayPayloadStruct`, `ContextTokenResponse`
- `AbstractContextGatewayCommand` (`getDefaultKeyName()`), `AbstractContextGatewayCommandHandler` (`handle()`, `supportedCommands()`)
- `ContextGatewayCommandRegistry`, `shopware.context.gateway.command`, `ContextGatewayCommandsCollectedEvent`

## Gotchas

- ADR examples vs code: `AppCheckoutGateway` is `AppContextGateway`; SDK class `ContextGatewayClientService::request()` is `ContextGatewayClient::call()`/`navigate()`; `getSupportedCommands()` is `supportedCommands()`; `context_switch-language`/`context_switch-currency` are `context_change-*`; the client posts to the storefront route `/gateway/context`, not `/store-api/gateway/context`.
- `AppContextGateway`, `ContextGateway` and `AbstractContextGatewayCommandHandler` are `@internal`; custom handlers are not a public extension point.
- The storefront controller returns HTTP 400 on `GatewayException` and adds a flash message only for `GatewayException::CUSTOMER_MESSAGE` errors.
- Security: an app server can log in existing customers by email without a password. The ADR calls for strict validation, logging, rate limiting, per-app trust settings and auditable actions.

## Version notes

- Outside core, the `app-php-sdk` gets `ContextGatewayAction` (request) and `ContextGatewayResponse` objects plus typed command classes; the Symfony App Bundle resolves these DTOs automatically.

## Code check (6.7.15.1)
- corrected `AppContextGateway::process()` — docs: example class AppCheckoutGateway — vendor/shopware/core/Framework/App/Context/Gateway/AppContextGateway.php:47
- confirmed `ContextGateway::PERMISSION` — app must hold context_gateway capability — vendor/shopware/core/Framework/App/Manifest/Xml/Gateway/ContextGateway.php:13
- confirmed `ContextGatewayRoute::load()` — store-api.context.gateway at /store-api/context/gateway — vendor/shopware/core/Framework/Gateway/Context/SalesChannel/ContextGatewayRoute.php:35
- confirmed `frontend.gateway.context` — storefront route /gateway/context, GET/POST — vendor/shopware/storefront/Controller/ContextGatewayController.php:31
- corrected `ContextGatewayClient::call()` — docs: ContextGatewayClientService::request() posting to /store-api/gateway/context — vendor/shopware/storefront/Resources/app/storefront/src/service/context-gateway-client.service.ts:21
- corrected `AbstractContextGatewayCommandHandler::supportedCommands()` — docs: getSupportedCommands() — vendor/shopware/core/Framework/Gateway/Context/Command/Handler/AbstractContextGatewayCommandHandler.php:26
- confirmed `AbstractContextGatewayCommand::getDefaultKeyName()` — abstract static, required in command classes — vendor/shopware/core/Framework/Gateway/Context/Command/AbstractContextGatewayCommand.php:10
- corrected `ChangeCurrencyCommand::COMMAND_KEY` — docs response: context_switch-currency; key is context_change-currency — vendor/shopware/core/Framework/Gateway/Context/Command/ChangeCurrencyCommand.php:10
- confirmed `shopware.context.gateway.command` — tagged iterator feeding the command registry — vendor/shopware/core/Framework/Gateway/Context/Command/Registry/ContextGatewayCommandRegistry.php:32
- confirmed `ContextGatewayCommandValidator::validate()` — max one register/login command, no duplicate types — vendor/shopware/core/Framework/Gateway/Context/Command/Executor/ContextGatewayCommandValidator.php:27
