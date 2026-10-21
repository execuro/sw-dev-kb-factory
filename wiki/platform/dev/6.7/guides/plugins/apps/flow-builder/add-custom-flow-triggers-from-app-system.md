---
id: platform/dev/6.7/guides/plugins/apps/flow-builder/add-custom-flow-triggers-from-app-system.md
title: Add custom flow trigger from app system
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/flow-builder/add-custom-flow-triggers-from-app-system.html
sourceHash: 0cc0d3e8475f33c49c90e41d8738e1ed32bae535
codeCheckedAgainst: "6.7.15.1"
keywords: ["flow.xml", "flow-event", "flow-events", "aware", "/api/_action/trigger-event/{eventName}", "CustomAppEvent", "StorableFlow", "sw-flow-custom-event", "app:install", "flow builder", "custom trigger", "custom event", "app system"]
summary: Define custom Flow Builder triggers in an app flow.xml (<flow-event>), dispatch them via POST /api/_action/trigger-event/{eventName}, add snippets.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/concepts/framework/flow-concept.md", "platform/dev/6.7/resources/references/adr/2022-07-21-adding-the-storable-flow-to-implement-delay-action-in-flow-builder.md", "platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/adding-snippets.md"]
---
## What it is

How an app declares custom Flow Builder triggers in `Resources/flow.xml` and fires them through an Admin API endpoint. The posted data becomes flow data for actions and mail templates. Available since Shopware 6.5.3.0.

## When to use

Your app needs to start merchant-configured flows from its own events (for example `swag.before.open_the_doors`).

## Key steps / config

1. Create `custom/apps/<AppName>/manifest.xml` (schema `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Manifest/Schema/manifest-3.0.xsd`). `<meta><name>` must equal the folder name.
2. In `Resources/flow.xml` (schema `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Flow/Schema/flow-1.0.xsd`):

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

- `name`: unique, must match `[a-z][a-z._]*[a-z]`.
- `aware`: at least one entry is required (repeatable), and it filters which actions the trigger offers. `orderAware` offers order actions such as `action.add.order.tag`, `action.generate.document` and `action.set.order.state`. `customerAware` offers customer actions such as `action.add.customer.tag` and `action.change.customer.group`. Other values map to the `Shopware\Core\Framework\Event` interfaces `CustomerGroupAware`, `MailAware`, `SalesChannelAware` and `UserAware`.
3. Fire the trigger with `POST /api/_action/trigger-event/{eventName}` (Admin API, ACL `flow:dispatch`). The JSON body (for example `customerId`, `salesChannelId`, `shopName`, `url`) is dispatched as a `CustomAppEvent` and stored in `StorableFlow`. Actions read it with `$flow->getData(CustomerAware::CUSTOMER_ID)`, and mail templates use `{{ shopName }}`.
4. Add snippets in `Resources/app/administration/snippet/en-GB.json` / `de-DE.json`, keyed by the trigger name (see [adding snippets](platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/adding-snippets.md)):

```json
{ "sw-flow-custom-event": {
    "event-tree": { "swag": "...", "before": "...", "openTheDoors": "..." },
    "flow-list": { "swag_before_open_the_doors": "..." } } }
```

5. Install: `bin/console app:install --activate FlowBuilderTriggerApp`.

## Essential identifiers

- `<flow-events>`, `<flow-event>`, `<aware>`
- `POST /api/_action/trigger-event/{eventName}` (route `api.action.trigger_event`)
- `Shopware\Core\Framework\App\Event\CustomAppEvent`, `StorableFlow::getData()`
- `sw-flow-custom-event.event-tree.*`, `sw-flow-custom-event.flow-list.*`

## Gotchas

- The docs list `delayAware` mapped to `Shopware\Core\Framework\Event\DelayAware`. That interface does not exist in 6.7.
- The docs call `aware` optional, but the XSD requires at least one `<aware>` element.
- The endpoint throws `FlowException::customTriggerByNameNotFound` unless an active app has registered a flow event with that name.

## Version notes

- App custom flow triggers require Shopware 6.5.3.0 or later.

## Code check (6.7.15.1)
- absent `Shopware\Core\Framework\Event\DelayAware` — no such interface in the installed code
- corrected `flow-event.aware` — docs: not required; XSD element has default minOccurs 1 — vendor/shopware/core/Framework/App/Flow/Schema/flow-1.0.xsd:162
- confirmed `flow-event.name` — pattern `[a-z][a-z._]*[a-z]` — vendor/shopware/core/Framework/App/Flow/Schema/flow-1.0.xsd:158
- confirmed `/api/_action/trigger-event/{eventName}` — POST, ACL `flow:dispatch` — vendor/shopware/core/Content/Flow/Controller/TriggerFlowController.php:37
- confirmed `CustomAppEvent` — dispatched with request data — vendor/shopware/core/Content/Flow/Controller/TriggerFlowController.php:44
- confirmed `FlowException::customTriggerByNameNotFound()` — thrown if no active app event matches — vendor/shopware/core/Content/Flow/Controller/TriggerFlowController.php:58
- confirmed `StorableFlow::getData()` — key/default accessor — vendor/shopware/core/Content/Flow/Dispatching/StorableFlow.php:86
- confirmed `CustomerAware::CUSTOMER_ID` — value `customerId` — vendor/shopware/core/Framework/Event/CustomerAware.php:11
- confirmed `MailAware::SALES_CHANNEL_ID` — value `salesChannelId` — vendor/shopware/core/Framework/Event/MailAware.php:14
- confirmed `sw-flow-custom-event` — admin reads flow-list snippet key — vendor/shopware/administration/Resources/app/administration/src/module/sw-flow/view/listing/sw-flow-list/index.js:225
