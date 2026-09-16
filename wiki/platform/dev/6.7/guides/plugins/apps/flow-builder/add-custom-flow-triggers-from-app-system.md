---
id: platform/dev/6.7/guides/plugins/apps/flow-builder/add-custom-flow-triggers-from-app-system.md
title: Add custom flow trigger from app system
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/flow-builder/add-custom-flow-triggers-from-app-system.html
sourceHash: 0cc0d3e8475f33c49c90e41d8738e1ed32bae535
codeCheckedAgainst: "6.7.13.0"
keywords: ["custom flow trigger", "flow builder event", "flow-event", "flow.xml", "aware", "orderAware", "/api/_action/trigger-event/{eventName}", "CustomAppEvent", "StorableFlow", "sw-flow-custom-event", "app:install", "app trigger api"]
summary: App custom flow triggers - <flow-event> with name/aware in Resources/flow.xml, dispatched via POST /api/_action/trigger-event/{eventName}, snippet keys.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/concepts/framework/flow-concept.md", "platform/dev/6.7/resources/references/adr/2022-07-21-adding-the-storable-flow-to-implement-delay-action-in-flow-builder.md", "platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/adding-snippets.md"]
---
## What it is

How an app registers its own Flow Builder triggers: each `<flow-event>` in `Resources/flow.xml` becomes a selectable trigger, and the app fires it through an Admin API endpoint with arbitrary data that flow actions and mail templates can use. Available since Shopware 6.5.3.0.

## When to use

An app wants merchants to build flows that start on an app-side event (e.g. `swag.before.open_the_doors`) rather than a core event. See [Flow Builder concept](platform/dev/6.7/concepts/framework/flow-concept.md).

## Key steps / config

1. Create `custom/apps/FlowBuilderTriggerApp/manifest.xml` (schema `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Manifest/Schema/manifest-3.0.xsd`); the manifest `<name>` must match the folder name.
2. In `Resources/flow.xml` (schema `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Flow/Schema/flow-1.0.xsd`) add `<flow-events>`:

```xml
<flow-extensions>
    <flow-events>
        <flow-event>
            <name>swag.before.open_the_doors</name>
            <aware>orderAware</aware>
        </flow-event>
    </flow-events>
</flow-extensions>
```

   - `name`: required, unique; schema pattern `[a-z][a-z._]*[a-z]`.
   - `aware`: repeatable; decides which actions are offered for the trigger. `orderAware` enables order actions (`action.add.order.tag`, `action.set.order.state`, `action.generate.document`, `action.stop.flow`, ...); `customerAware` enables customer actions (`action.add.customer.tag`, `action.change.customer.group`, ...). Values map to `Shopware\Core\Framework\Event\CustomerAware`, `CustomerGroupAware`, `MailAware`, `OrderAware`, `SalesChannelAware`, `UserAware`.
3. Fire the trigger: `POST /api/_action/trigger-event/{eventName}` with a JSON body (e.g. `customerId`, `salesChannelId`, `shopName`, `url`). The controller checks that an active app registered that event name, then dispatches a `Shopware\Core\Framework\App\Event\CustomAppEvent` carrying the body.
4. The data is stored in the `StorableFlow`; actions read it with `$flow->getData(MailAware::SALES_CHANNEL_ID)` or `$flow->getData(CustomerAware::CUSTOMER_ID)`; mail templates use `{{ shopName }}`, `{{ url }}`. See [StorableFlow ADR](platform/dev/6.7/resources/references/adr/2022-07-21-adding-the-storable-flow-to-implement-delay-action-in-flow-builder.md).
5. Snippets in `Resources/app/administration/snippet/en-GB.json` / `de-DE.json` (see [Adding snippets](platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/adding-snippets.md)):

```json
{ "sw-flow-custom-event": {
    "event-tree": { "swag": "Swag", "before": "Before", "openTheDoors": "Open the doors" },
    "flow-list": { "swag_before_open_the_doors": "Before open the doors" } } }
```

6. Install: `bin/console app:install --activate FlowBuilderTriggerApp`.

## Essential identifiers

- `<flow-events>`, `<flow-event>`, `<name>`, `<aware>`
- `POST /api/_action/trigger-event/{eventName}` (route `api.action.trigger_event`)
- `Shopware\Core\Framework\App\Event\CustomAppEvent`, `StorableFlow::getData()`
- `sw-flow-custom-event`, `event-tree`, `flow-list`

## Gotchas

- The docs' aware table includes `delayAware` / `Shopware\Core\Framework\Event\DelayAware`; that interface is not in the installed code.
- The docs mark `aware` optional; the PHP parser only enforces `name`, but `flow-1.0.xsd` declares `aware` in the sequence without `minOccurs="0"`, so include at least one.
- Calling the endpoint for an unknown event name or an inactive app fails (custom trigger not found).
- The docs' PHP sample has an extra closing parenthesis on each `getData` call.

## Code check (6.7.13.0)
- absent `Shopware\Core\Framework\Event\DelayAware` — listed in docs aware table; not in installed code
- confirmed `/api/_action/trigger-event/{eventName}` — POST route api.action.trigger_event — vendor/shopware/core/Content/Flow/Controller/TriggerFlowController.php:37
- confirmed `CustomAppEvent` — dispatched with request body — vendor/shopware/core/Content/Flow/Controller/TriggerFlowController.php:44
- confirmed `REQUIRED_FIELDS` — only name required by the parser — vendor/shopware/core/Framework/App/Flow/Event/Xml/CustomEvent.php:16
- corrected `aware` — docs: not required; schema declares it without minOccurs 0 — vendor/shopware/core/Framework/App/Flow/Schema/flow-1.0.xsd:162
- confirmed `StorableFlow::getData()` — reads stored flow data — vendor/shopware/core/Content/Flow/Dispatching/StorableFlow.php:86
- confirmed `CustomerAware::CUSTOMER_ID` — value customerId — vendor/shopware/core/Framework/Event/CustomerAware.php:11
- confirmed `MailAware::SALES_CHANNEL_ID` — value salesChannelId — vendor/shopware/core/Framework/Event/MailAware.php:14
- confirmed `sw-flow-custom-event` — event-tree snippet lookup — vendor/shopware/administration/Resources/app/administration/src/module/sw-flow/component/sw-flow-trigger/index.js:753
- confirmed `action.stop.flow` — core action name — vendor/shopware/core/Content/Flow/Dispatching/Action/StopFlowAction.php:17
