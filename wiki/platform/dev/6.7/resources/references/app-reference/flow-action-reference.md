---
id: platform/dev/6.7/resources/references/app-reference/flow-action-reference.md
title: Flow Action Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/app-reference/flow-action-reference.html
sourceHash: 35d0bef19e9d2af7ed3252a0d2da58ffb18c3681
codeCheckedAgainst: "6.7.13.0"
keywords: ["flow.xml", "flow-1.0.xsd", "flow-extensions", "flow-actions", "flow-action", "flow builder", "app flow action", "input-field", "requirements", "orderAware", "customerAware", "webhook action", "flow variables"]
summary: "Reference for app flow actions in Resources/flow.xml: meta, headers, parameters, input-field config, and the variables available per business event."
lastBuilt: 2026-09-15
---
## What it is

Annotated example of how an app registers custom Flow Builder actions (e.g. "Send slack message") that call an external URL with templated headers/parameters, plus a table of the template variables each triggering event provides.

## When to use

When an app adds its own action to Flow Builder and needs the exact XML element names, the `input-field` config, or the variables usable in parameter templates for a given event.

## Key steps / config

1. Put the definition in `Resources/flow.xml` inside the app (the file the core reads).
2. Root element is `<flow-extensions>` (schema `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Flow/Schema/flow-1.0.xsd`); actions go in its `<flow-actions>` child.
3. Each `<flow-action>` has `meta`, `headers`, `parameters`, `config`.

```xml
<flow-extensions>
  <flow-actions>
    <flow-action>
      <meta>
        <name>slack</name><label>Send slack message</label>
        <url>https://hooks.slack.com/services/{id}</url>
        <sw-icon>default-communication-speech-bubbles</sw-icon><icon>slack.png</icon>
        <requirements>orderAware</requirements>
      </meta>
      <headers><parameter type="string" name="content-type" value="application/json"/></headers>
      <parameters><parameter type="string" name="text" value="{{ subject }} ..."/></parameters>
      <config><input-field type="text"><name>subject</name><label>Subject</label><required>true</required></input-field></config>
    </flow-action>
  </flow-actions>
</flow-extensions>
```

- `meta` optional texts: `headline`, `description` (translatable via `lang`).
- `input-field` children: `name`, `label`, `place-holder`, `helpText`, `defaultValue`, `options`, `required`; attribute `type` (default `text`, e.g. `textarea`).
- Config values are referenced in `parameters` via Twig, e.g. `{{ subject }}`, `{{ order.orderNumber }}`.

### Variables per event

| Events | Variables |
|---|---|
| `checkout.order.placed`, `state_enter.order.state.*`, `state_enter.order_transaction.state.*`, `state_enter.order_delivery.state.*` | `order` |
| `customer.group.registration.accepted` / `.declined` | `customer`, `customerGroup` |
| `user.recovery.request` | `userRecovery` |
| `checkout.customer.double_opt_in_registration` / `_guest_order` | `customer`, `confirmUrl` |
| `customer.recovery.request` | `customerRecovery`, `customer`, `resetUrl`, `shopName` |
| `contact_form.send` | `contactFormData` |
| `checkout.customer.register` | `customer` |
| `newsletter.register` | `newsletterRecipient`, `url` |
| `newsletter.confirm` | `newsletterRecipient` |

## Essential identifiers

- `Resources/flow.xml`, `flow-1.0.xsd`, `flow-extensions`, `flow-actions`, `flow-action`
- `meta`, `headers`, `parameters`, `config`, `input-field`, `requirements`, `sw-icon`

## Gotchas

- The source example labels the file `flow-action.xml` and uses `<flow-actions>` as root. The installed schema declares only `flow-extensions` as root and the core loads `Resources/flow.xml`.
- `meta` `name` must match `[a-z][a-z.]*[a-z]`; `input-field` `name` must match `[a-zA-Z][a-zA-Z0-9]*`.
- `meta` also accepts `badge` and a boolean `delayable` (not in the source example).

## Code check (6.7.13.0)
- corrected `Resources/flow.xml` — docs: file named flow-action.xml — vendor/shopware/core/Framework/App/Lifecycle/Handler/FlowActionLifecycleHandler.php:83
- corrected `flow-extensions` — docs: root element flow-actions; schema root is flow-extensions — vendor/shopware/core/Framework/App/Flow/Schema/flow-1.0.xsd:3
- confirmed `flow-actions` — read as child of the document — vendor/shopware/core/Framework/App/Flow/Action/Action.php:31
- confirmed `flow-1.0.xsd` — schema used for validation — vendor/shopware/core/Framework/App/Flow/Action/Action.php:13
- confirmed `flow-action` — meta, headers, parameters, config — vendor/shopware/core/Framework/App/Flow/Schema/flow-1.0.xsd:31
- confirmed `requirements` — meta child element — vendor/shopware/core/Framework/App/Flow/Schema/flow-1.0.xsd:65
- confirmed `delayable` — boolean meta flag, default false — vendor/shopware/core/Framework/App/Flow/Action/Xml/Metadata.php:56
- confirmed `input-field` — type attribute default text — vendor/shopware/core/Framework/App/Flow/Schema/flow-1.0.xsd:76
- confirmed `checkout.order.placed` — event name — vendor/shopware/core/Checkout/Cart/Event/CheckoutOrderPlacedEvent.php:29
- confirmed `contact_form.send` — event name — vendor/shopware/core/Content/ContactForm/Event/ContactFormEvent.php:21
