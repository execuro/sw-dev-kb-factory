---
id: platform/dev/6.6/resources/references/adr/2022-04-19-integrate-app-into-flow-action.md
title: Integrate an app into flow action
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-04-19-integrate-app-into-flow-action.html"
sourceHash: "c466a31a033bf6c2e14c3867f98bb2af2c49b07d"
keywords: ["flow-action.xml", "app_id", "flow_sequence", "FlowExecutor", "flow action webhook", "CheckoutOrderPlaced", "app flow action", "flow-actions xsd", "meta headers parameters config"]
summary: "ADR: apps deliver custom flow actions via a Resources/flow-action.xml manifest and a webhook called by FlowExecutor, keyed by app_id on flow_sequence."
lastBuilt: "2026-09-15"
---
## What it is
Architecture decision record describing how apps (which cannot ship PHP code) deliver their own flow actions to Shopware's Flow Builder, via webhooks and XML configuration.

## When to use
When an app needs to register one or more custom flow actions that react to flow triggers (business events like `CheckoutOrderPlaced`).

## Key steps / config
- An `app_id` is stored on each `flow_sequence` record to identify app-provided flow actions.
- `FlowExecutor` detects the app_id and automatically calls the app's configured webhook instead of dispatching to a PHP listener.
- Flow actions are declared in a new `Resources/flow-action.xml` file per app, with four sections: `<meta>` (identification/UI), `<headers>` (webhook headers), `<parameters>` (webhook parameters), `<config>` (admin UI config fields).
- Schema location referenced in the XML root: `https://test-flow.com/flow-action-1.0.xsd`.

```xml
<flow-actions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="https://test-flow.com/flow-action-1.0.xsd">
    <flow-action>
        <meta>
            <name></name>
            <badge></badge>
            <label></label>
            <description></description>
            <url></url>
            <sw-icon></sw-icon>
            <requirements></requirements>
        </meta>
        <headers>
            <parameter type="string" name="" value=""/>
        </headers>
        <parameters>
            <parameter type="string" name="" value=""/>
        </parameters>
        <config>
            <input-field type="text">
                <name></name>
                <label></label>
                <required></required>
            </input-field>
        </config>
    </flow-action>
</flow-actions>
```

- All app flow action data is stored in the database as usual and deleted when the app is uninstalled.

## Essential identifiers
- `Resources/flow-action.xml`
- `app_id` on `flow_sequence`
- `FlowExecutor`
- `<meta>`, `<headers>`, `<parameters>`, `<config>` elements
