---
id: platform/dev/6.7/resources/references/adr/2025-04-01-context-gateway.md
title: Context Gateway
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2025-04-01-context-gateway.html
sourceHash: 786edd8b092dda279def4ba4111dc20e83c19f38
codeCheckedAgainst: "6.7.13.0"
keywords: ["ContextGateway", "AppContextGateway", "ContextGatewayRoute", "ContextGatewayController", "AbstractContextGatewayCommand", "AbstractContextGatewayCommandHandler", "ContextGatewayCommandRegistry", "shopware.context.gateway.command", "ContextGatewayCommandsCollectedEvent", "ContextGatewayClient", "/store-api/context/gateway", "frontend.gateway.context", "app gateway", "sales channel context switch", "customer login via app"]
summary: "ADR: app context gateway lets app servers return commands (login/register customer, change language/currency...) that modify the SalesChannelContext."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2025-04-01, area checkout) introducing the Context Gateway: a storefront-initiated channel through which an app server returns commands that change the `SalesChannelContext` (customer, language, currency, addresses). It mirrors the `CheckoutGateway` but works outside checkout, before a cart process begins.

## When to use

- An app must register or log in customers, switch language/currency, or update the active address based on external logic.
- A plugin needs to inspect or alter app-returned commands, or add a custom context command.

## Key steps / config

**Flow:** storefront JS → `frontend.gateway.context` (`/gateway/context`, `ContextGatewayController`) → `ContextGatewayRoute::load()` (`/store-api/context/gateway`, `store-api.context.gateway`, GET/POST) → `AppContextGateway::process(ContextGatewayPayloadStruct)` → app server → commands executed → `ContextTokenResponse` with the new context token. The request data must contain `appName`; the app must be active and declare a context gateway URL.

**1. App manifest:**

```xml
<manifest>
    <gateways>
        <context>https://example.com/context/gateway</context>
    </gateways>
</manifest>
```

**2. Storefront client:** `ContextGatewayClient` (`src/service/context-gateway-client.service.ts`), constructed with the app name. `call(data)` POSTs `{ ...data, appName }` (header `X-Requested-With: XMLHttpRequest`) to `window.router['frontend.gateway.context']` and returns `{ token, redirectUrl? }`; `navigate(tokenResponse, customTarget)` reloads or redirects.

**3. Payload sent to the app server** (client data under `custom`):

```json5
{ "source": { }, "salesChannelContext": { }, "cart": { },
  "custom": { "anyCustomKey": "anyCustomValue" } }
```

**4. App response:**

```json
[ { "command": "context_register-customer", "payload": { } },
  { "command": "context_change-currency", "payload": { "iso": "USD" } } ]
```

Register/login commands run first; the rest run sequentially in response order. Validation: at most one register-or-login command, each command type at most once. Installed keys: `context_register-customer`, `context_login-customer`, `context_change-language`, `context_change-currency`, `context_change-payment-method`, `context_change-shipping-method`, `context_change-shipping-location`, `context_change-billing-address`, `context_change-shipping-address`, `context_add-customer-message`.

**5. Custom command + handler** (tag the handler `shopware.context.gateway.command`; `ContextGatewayCommandRegistry` collects them; commands are built via `createFromPayload()`, which spreads the payload into the constructor):

```php
class ChangeCurrencyCommand extends AbstractContextGatewayCommand {
    public const COMMAND_KEY = 'context_change-currency';
    public function __construct(public readonly string $iso) {}
    public static function getDefaultKeyName(): string { return self::COMMAND_KEY; }
}
class ChangeCurrencyCommandHandler extends AbstractContextGatewayCommandHandler {
    public function handle(AbstractContextGatewayCommand $command, SalesChannelContext $context, array &$parameters): void
    { /* $parameters['currencyId'] = ...; consumed by ContextSwitchRoute */ }
    public static function supportedCommands(): array { return [ChangeCurrencyCommand::class]; }
}
```

**6. Event:** `ContextGatewayCommandsCollectedEvent` fires after commands are collected, before execution; plugins may inspect, modify or append commands.

## Essential identifiers

- `Shopware\Core\Framework\App\Context\Gateway\AppContextGateway`
- `Shopware\Core\Framework\Gateway\Context\SalesChannel\AbstractContextGatewayRoute`
- `Shopware\Storefront\Controller\ContextGatewayController`
- `Shopware\Core\Framework\Gateway\Context\Command\AbstractContextGatewayCommand`
- `Shopware\Core\Framework\Gateway\Context\Command\Handler\AbstractContextGatewayCommandHandler`
- `ContextGatewayCommandRegistry`, `ContextGatewayCommandsCollectedEvent`, `ContextGatewayClient`
- Tag `shopware.context.gateway.command`

## Gotchas

- ADR text names the handler method `getSupportedCommands()`; the code requires `supportedCommands()`.
- ADR example keys `context_switch-language` / `context_switch-currency` do not exist; use `context_change-*`.
- ADR SDK sketch (`ContextGatewayClientService::request()`, `/store-api/gateway/context`) differs from the shipped `ContextGatewayClient`.
- The ADR's gateway sketch is mislabelled `class AppCheckoutGateway`.
- `AppContextGateway` and `AbstractContextGatewayCommandHandler` are `@internal`.
- Security: apps can log in customers without passwords; a compromised app server could impersonate users. Proposed mitigations: validation, logging, rate limiting, per-app trust/ACL for login, auditability.

## Code check (6.7.13.0)
- confirmed `AbstractContextGatewayRoute::load()` — abstract, returns ContextTokenResponse; getDecorated() also required — vendor/shopware/core/Framework/Gateway/Context/SalesChannel/AbstractContextGatewayRoute.php:16
- confirmed `store-api.context.gateway` — route /store-api/context/gateway GET/POST — vendor/shopware/core/Framework/Gateway/Context/SalesChannel/ContextGatewayRoute.php:35
- confirmed `frontend.gateway.context` — storefront route /gateway/context, XmlHttpRequest — vendor/shopware/storefront/Controller/ContextGatewayController.php:31
- confirmed `AbstractContextGatewayCommand::getDefaultKeyName()` — abstract static — vendor/shopware/core/Framework/Gateway/Context/Command/AbstractContextGatewayCommand.php:10
- corrected `AbstractContextGatewayCommandHandler::supportedCommands()` — docs: getSupportedCommands() — vendor/shopware/core/Framework/Gateway/Context/Command/Handler/AbstractContextGatewayCommandHandler.php:26
- confirmed `shopware.context.gateway.command` — tagged_iterator for ContextGatewayCommandRegistry — vendor/shopware/core/System/DependencyInjection/sales_channel.xml:330
- corrected `ChangeLanguageCommand::COMMAND_KEY` — docs: context_switch-language — vendor/shopware/core/Framework/Gateway/Context/Command/ChangeLanguageCommand.php:10
- confirmed `ContextGatewayCommandsCollectedEvent` — dispatched before executor runs — vendor/shopware/core/Framework/App/Context/Gateway/AppContextGateway.php:66
- confirmed `ContextGatewayCommandValidator::validate()` — one register/login, no duplicate types — vendor/shopware/core/Framework/Gateway/Context/Command/Executor/ContextGatewayCommandValidator.php:27
- corrected `ContextGatewayClient::call()` — docs: ContextGatewayClientService::request() to /store-api/gateway/context — vendor/shopware/storefront/Resources/app/storefront/src/service/context-gateway-client.service.ts:21
