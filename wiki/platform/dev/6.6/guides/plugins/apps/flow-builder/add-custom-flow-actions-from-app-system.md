---
docType: developer
id: platform/dev/6.6/guides/plugins/apps/flow-builder/add-custom-flow-actions-from-app-system.md
sourceHash: 4ff97aadc5137a2f5341da9945da6e31d2f3495a
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/flow-builder/add-custom-flow-actions-from-app-system.html
title: Add custom flow action from app system
version: "6.6"
versions:
  - "6.6"
keywords: ["flow-action.xml", "flow.xml", "flow-actions", "flow-action", "CustomerAware", "OrderAware", "MailAware", "SalesChannelAware", "UserAware", "DelayAware", "CustomerGroupAware", "requirements", "input-field", "app:install", "flow-1.0.xsd"]
summary: "Custom flow actions are defined in flow-action.xml (flow.xml from 6.5.2.0) with meta, headers, parameters and config sections."
lastBuilt: 2026-09-15
---
## What it is

Documents how apps add custom, configurable webhook actions to the Flow Builder (available since Shopware 6.4.10.0), letting third-party services be triggered from flows.

## When to use

When an app needs to expose its own action (e.g. sending a Slack message) as a selectable Flow Builder action, restricted to specific trigger events.

## Key steps / config

Directory layout under `custom/apps/<AppName>/Resources/`: `flow-action.xml` (or `flow.xml` from 6.5.2.0, replacing `flow-action.xml` from 6.6.0.0), icons, and `manifest.xml`. Actions are wrapped in `<flow-actions>`/`<flow-action>` (schema `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Flow/Schema/flow-1.0.xsd`):

```xml
<flow-action>
    <meta>
        <name>slackmessage</name>
        <label>...</label>
        <badge>Slack</badge>
        <description>...</description>
        <url>https://hooks.slack.com/services/{id}</url>
        <sw-icon>default-communication-speech-bubbles</sw-icon>
        <requirements>orderAware</requirements>
        <requirements>customerAware</requirements>
    </meta>
    <headers>
        <parameter type="string" name="content-type" value="application/json"/>
    </headers>
    <parameters>
        <parameter type="string" name="text" value="{{ message }}"/>
    </parameters>
    <config>
        <input-field type="text"><name>message</name><label>Message</label></input-field>
    </config>
</flow-action>
```

`<meta><name>` must be a unique technical name, `label`/`description` are required, `url` is the webhook Shopware calls, `requirements` lists the `aware` interfaces the action supports (e.g. `orderAware` → `Shopware\Core\Framework\Event\OrderAware`; also `customerAware`, `customerGroupAware`, `delayAware`, `mailAware`, `salesChannelAware`, `userAware`). `headers`/`parameters` use `type` (only `string` supported), `name`, `value`; parameter values can interpolate variables like `{{ order.orderNumber }}`. `<config><input-field>` entries (types: text, textarea, text-editor, url, password, int, float, bool, checkbox, datetime, date, time, colorpicker, single-select, multi-select) render as Administration form components (`<sw-text-field/>`, `<sw-switch-field/>`, etc.) and their values become available in parameter templates. Install with:

```bash
bin/console app:install --activate FlowBuilderActionApp
```

## Essential identifiers

- `flow-action.xml` / `flow.xml`, schema `flow-1.0.xsd`
- `<flow-action>`, `<requirements>`, `<headers>`, `<parameters>`, `<config><input-field>`
- `Shopware\Core\Framework\Event\{CustomerAware,OrderAware,MailAware,SalesChannelAware,UserAware,DelayAware,CustomerGroupAware}`
- `bin/console app:install --activate`

## Gotchas

The app folder name must match `<name>` in the manifest. `flow-action.xml` is replaced by `flow.xml` from 6.5.2.0 and removed entirely from 6.6.0.0.

## Version notes

Custom flow actions for apps require 6.4.10.0+. From 6.5.2.0 the action definition moves to `flow.xml`; `flow-action.xml` is removed from 6.6.0.0.
