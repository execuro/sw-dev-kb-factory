---
docType: developer
id: platform/dev/6.6/guides/plugins/apps/flow-builder/add-custom-flow-triggers-from-app-system.md
sourceHash: 7fd3be6a6784683c4ebd55e96c4e718981b9656e
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/flow-builder/add-custom-flow-triggers-from-app-system.html
title: Add custom flow trigger from app system
version: "6.6"
versions:
  - "6.6"
keywords: ["flow-event", "flow.xml", "flow-events", "trigger-event", "aware", "orderAware", "customerAware", "CustomAppEvent", "StorableFlow", "FlowStorer", "app:install", "flow-1.0.xsd", "sw-flow-custom-event"]
summary: "Custom flow triggers are defined via <flow-event> in flow.xml and fired through POST /api/_action/trigger-event/{eventName}."
lastBuilt: 2026-09-15
---
## What it is

Documents how apps add custom, pre-defined flow triggers (available since 6.5.3.0) to the Flow Builder, in addition to the default triggers.

## When to use

When an app needs to fire its own flow trigger from custom application logic and have Flow Builder actions react to it.

## Key steps / config

Directory layout under `custom/apps/<AppName>/Resources/`: `app/administration/snippet/{de-DE,en-GB}.json` and `flow.xml`, plus `manifest.xml`. Define triggers in `flow.xml` (schema `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Flow/Schema/flow-1.0.xsd`):

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

`<name>` is the unique technical trigger name; `<aware>` filters which actions become available for that trigger (`customerAware`, `customerGroupAware`, `delayAware`, `mailAware`, `orderAware`, `salesChannelAware`, `userAware` — each maps to a `Shopware\Core\Framework\Event\*Aware` interface). Fire the trigger with `POST /api/_action/trigger-event/{eventName}`, supplying data; Shopware creates a `CustomAppEvent` and dispatches it, storing the data via `StorableFlow` for later use by actions or email templates:

```php
$salesChanelId = $flow->getData(MailAware::SALES_CHANNEL_ID);
$customer = $flow->getData(CustomerAware::CUSTOMER_ID);
```

Translate the trigger for the trigger tree and flow list using snippet keys nested under `sw-flow-custom-event` → `event-tree` / `flow-list`, derived from the `<name>` in `flow.xml` (e.g. `swag.before.open_the_doors` → `event-tree.swag.before.openTheDoors`, `flow-list.swag_before_open_the_doors`). Install with:

```bash
bin/console app:install --activate FlowBuilderTriggerApp
```

## Essential identifiers

- `flow.xml`, schema `flow-1.0.xsd`
- `<flow-event>`, `<aware>`
- `POST /api/_action/trigger-event/{eventName}`
- `StorableFlow`, `CustomAppEvent`
- `sw-flow-custom-event`, `event-tree`, `flow-list`
- `bin/console app:install --activate`

## Gotchas

The app folder name must match the app name in the manifest. Snippet keys must be structured to match the trigger's `<name>` exactly.

## Version notes

Custom flow triggers for apps require Shopware 6.5.3.0 or later.
