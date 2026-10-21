---
id: platform/dev/6.7/resources/references/app-reference/flow-action-reference.md
title: Flow Action Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/app-reference/flow-action-reference.html
sourceHash: 35d0bef19e9d2af7ed3252a0d2da58ffb18c3681
codeCheckedAgainst: "6.7.15.1"
keywords: ["flow.xml", "flow-1.0.xsd", "flow action", "app flow action", "flow builder", "flow-extensions", "flow-actions", "input-field", "requirements", "orderAware", "customerAware", "checkout.order.placed", "flow variables", "webhook action"]
summary: Reference for app flow actions in Resources/flow.xml - meta, headers, parameters, input-field config, and the Twig variables each flow event exposes.
lastBuilt: 2026-10-21
---
## What it is

The reference for declaring app flow actions: Flow Builder actions that, when triggered, send an HTTP request to the app-defined `url` with configured headers and Twig-rendered parameters. It also lists which variables each flow event exposes to those parameter templates.

## When to use

When an app adds its own action (e.g. "Send slack message") to the Administration's Flow Builder, or when writing the parameter templates and needing to know which variables an event provides.

## Key steps / config

1. Put the definition in `Resources/flow.xml`, validated against `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Flow/Schema/flow-1.0.xsd`.
2. The schema's root element is `<flow-extensions>`, which wraps `<flow-actions>` (and optionally `<flow-events>`). Each `<flow-action>` requires all four children `meta`, `headers`, `parameters`, `config`:

```xml
<flow-extensions xmlns:xsi="..." xsi:noNamespaceSchemaLocation="...flow-1.0.xsd">
  <flow-actions>
    <flow-action>
      <meta>
        <name>slack</name>
        <label lang="de-DE">Slack-Nachricht senden</label>
        <url>...</url>
        <sw-icon>default-communication-speech-bubbles</sw-icon>
        <requirements>orderAware</requirements>
      </meta>
      <headers><parameter type="string" name="content-type" value="application/json"/></headers>
      <parameters><parameter type="string" name="text" value="{{ subject }} \n {{ message }}"/></parameters>
      <config><input-field type="text"><name>subject</name><required>true</required></input-field></config>
```

- `meta`: `name` (lowercase, pattern `[a-z][a-z.]*[a-z]`), `label`, optional `headline`, `description`, `icon` (e.g. `slack.png`), `badge`, `sw-icon`, plus `url`, `requirements` (repeatable, e.g. `orderAware`, `customerAware`), `delayable`. Translatable elements take `lang`, default `en-GB`.
- `parameter`: attributes `type`, `name`, `value` are all required; `value` may use Twig, e.g. `{{ order.orderNumber }}` or `{{ chatId }}` referencing a config field.
- `input-field`: `name` (pattern `[a-zA-Z][a-zA-Z0-9]*`), `label`, `place-holder`, `helpText`, `defaultValue`, `options`, `required` (default `false`); attribute `type` defaults to `text`, allowed: `text`, `textarea`, `text-editor`, `url`, `password`, `int`, `float`, `bool`, `checkbox`, `datetime`, `date`, `time`, `colorpicker`, `single-select`, `multi-select`.

### Variables per event

| Event(s) | Variables |
|---|---|
| `checkout.order.placed`, `state_enter.order.state.*`, `state_enter.order_transaction.state.*`, `state_enter.order_delivery.state.*` | `order` |
| `customer.group.registration.accepted` / `.declined` | `customer`, `customerGroup` |
| `user.recovery.request` | `userRecovery` |
| `checkout.customer.double_opt_in_registration`, `checkout.customer.double_opt_in_guest_order` | `customer`, `confirmUrl` |
| `customer.recovery.request` | `customerRecovery`, `customer`, `resetUrl`, `shopName` |
| `contact_form.send` | `contactFormData` |
| `checkout.customer.register` | `customer` |
| `newsletter.register` | `newsletterRecipient`, `url` |
| `newsletter.confirm` | `newsletterRecipient` |

## Essential identifiers

- `Resources/flow.xml`, `flow-1.0.xsd`
- Elements `flow-extensions`, `flow-action`, `meta`, `headers`, `parameters`, `parameter`, `config`, `input-field`
- Requirements `orderAware`, `customerAware`

## Gotchas

- The source labels the sample `// flow-action.xml` and uses `<flow-actions>` as the document root. The installed loader reads only `Resources/flow.xml` and validates it against a schema whose root is `<flow-extensions>`, so wrap `<flow-actions>` in it.
- Action names must be unique within `<flow-actions>`.
- The listed `state_enter.*` events cover specific states only (e.g. `order.state.cancelled`, `order_transaction.state.paid_partially`, `order_delivery.state.returned`), not every state.

## Code check (6.7.15.1)
- corrected `flow-extensions` — docs: root element `<flow-actions>`; schema root is `flow-extensions` — vendor/shopware/core/Framework/App/Flow/Schema/flow-1.0.xsd:3
- corrected `Resources/flow.xml` — docs: file named flow-action.xml — vendor/shopware/core/Framework/App/Lifecycle/Handler/FlowActionLifecycleHandler.php:83
- confirmed `Action::createFromXmlFile()` — validates against flow-1.0.xsd — vendor/shopware/core/Framework/App/Flow/Action/Action.php:21
- confirmed `uniqueActionName` — action names unique — vendor/shopware/core/Framework/App/Flow/Schema/flow-1.0.xsd:24
- confirmed `requirements` — meta element — vendor/shopware/core/Framework/App/Flow/Schema/flow-1.0.xsd:65
- confirmed `delayable` — optional meta element not in docs — vendor/shopware/core/Framework/App/Flow/Schema/flow-1.0.xsd:66
- confirmed `textarea` — allowed input-field type — vendor/shopware/core/Framework/App/Flow/Schema/flow-1.0.xsd:122
- confirmed `orderAware` — requirement value used by Flow Builder — vendor/shopware/administration/Resources/app/administration/src/module/sw-flow/service/flow-builder.service.spec.js:26
- confirmed `checkout.order.placed` — event name — vendor/shopware/core/Checkout/Cart/Event/CheckoutOrderPlacedEvent.php:34
- confirmed `user.recovery.request` — event name — vendor/shopware/core/System/User/Recovery/UserRecoveryRequestEvent.php:26
