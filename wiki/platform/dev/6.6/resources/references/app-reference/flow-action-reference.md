---
id: platform/dev/6.6/resources/references/app-reference/flow-action-reference.md
title: Flow Action Reference
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/app-reference/flow-action-reference.html
sourceHash: cdf8832865e7a2a78270f911b5f5334de971ad5b
keywords: ["flow-action.xml", "flow-1.0.xsd", "flow-action", "flow builder", "orderAware", "customerAware", "flow variables", "input-field", "checkout.order.placed", "flow requirements", "app flow action"]
summary: "Reference for an app's flow-action.xml defining custom flow builder actions, config fields and available flow event variables."
lastBuilt: 2026-09-15
---
## What it is

This page documents an app's `flow-action.xml`, used to register custom Flow Builder actions (e.g. sending a Slack or Telegram message), plus the table of Flow event names and the variables available to each.

## Key steps / config

The root element is `<flow-actions>`, validated against `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Flow/Schema/flow-1.0.xsd`. Each `<flow-action>` has `<meta>` (name, label, headline, description, url, icon, `<requirements>`), `<headers>`, `<parameters>`, and `<config>` with `<input-field>` elements.

```xml
<flow-actions xsi:noNamespaceSchemaLocation="...flow-1.0.xsd">
  <flow-action>
    <meta>
      <name>slack</name>
      <label>Send slack message</label>
      <url>https://hooks.slack.com/services/{id}</url>
      <requirements>orderAware</requirements>
      <requirements>customerAware</requirements>
    </meta>
    <headers>
      <parameter type="string" name="content-type" value="application/json"/>
    </headers>
    <parameters>
      <parameter type="string" name="text" value="{{ subject }} \n {{ message }}"/>
    </parameters>
    <config>
      <input-field type="text">
        <name>subject</name>
        <label>Subject</label>
        <required>true</required>
      </input-field>
    </config>
  </flow-action>
</flow-actions>
```

`<requirements>` values seen include `orderAware` and `customerAware`. `<input-field type="...">` supports `text` and `textarea` types with `<name>`, `<label>`, `<place-holder>`, `<required>`, `<helpText>`, `<defaultValue>`.

The `## Variables` table maps Flow event names to the twig variables available in that event's message templates, e.g. `checkout.order.placed` and the various `state_enter.order*`/`state_enter.order_transaction*` events expose `order`; `customer.group.registration.declined`/`accepted` expose `customer` and `customerGroup`; `user.recovery.request` exposes `userRecovery`; `checkout.customer.double_opt_in_registration`/`double_opt_in_guest_order` expose `customer` and `confirmUrl`; `customer.recovery.request` exposes `customerRecovery`, `customer`, `resetUrl`, `shopName`; `contact_form.send` exposes `contactFormData`; `checkout.customer.register` exposes `customer`; `newsletter.register` exposes `newsletterRecipient` and `url`; `newsletter.confirm` exposes `newsletterRecipient`.

## Essential identifiers

- `flow-action.xml`
- `<flow-actions>`, `<flow-action>`, `<meta>`, `<requirements>`, `<headers>`, `<parameters>`, `<config>`, `<input-field>`
- Schema: `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Flow/Schema/flow-1.0.xsd`
