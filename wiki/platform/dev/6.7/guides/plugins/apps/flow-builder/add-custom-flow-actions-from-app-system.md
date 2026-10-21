---
id: platform/dev/6.7/guides/plugins/apps/flow-builder/add-custom-flow-actions-from-app-system.md
title: Add Custom Flow Action from App System
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/flow-builder/add-custom-flow-actions-from-app-system.html
sourceHash: 4bd905e0bf9d3f683453b4676870944e8c61e5f1
codeCheckedAgainst: "6.7.15.1"
keywords: ["flow.xml", "flow-action", "flow-actions", "flow-extensions", "requirements", "orderAware", "customerAware", "input-field", "app:install", "flow builder", "custom action", "webhook action", "app system"]
summary: App flow.xml <flow-action> definitions (meta, headers, parameters, config) that add webhook-based custom actions to the Shopware Flow Builder.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/concepts/framework/flow-concept.md", "platform/dev/6.7/resources/references/app-reference/flow-action-reference.md", "platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md"]
---
## What it is

How an app registers custom Flow Builder actions in `Resources/flow.xml`. Each action is a configurable webhook: when a flow runs it, Shopware calls the action's `url` with the headers and body parameters you define. Available since Shopware 6.4.10.0.

## When to use

Your app needs to add Flow Builder actions that call a third-party service, such as posting a Slack message when an order is placed.

## Key steps / config

1. Create `custom/apps/<AppName>/manifest.xml` (schema `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Manifest/Schema/manifest-3.0.xsd`). `<meta><name>` must match the folder name.
2. Create `Resources/flow.xml` (schema `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Flow/Schema/flow-1.0.xsd`). Its root `<flow-extensions>` holds `<flow-actions>` with one or more `<flow-action>` entries. Each entry needs all four children, `meta`, `headers`, `parameters` and `config`:

```xml
<flow-action>
    <meta>
        <name>slackmessage</name>
        <label>Send slack message</label>
        <url>https://hooks.slack.com/services/{id}</url>
        <sw-icon>default-communication-speech-bubbles</sw-icon>
        <requirements>orderAware</requirements>
    </meta>
    <headers><parameter type="string" name="content-type" value="application/json"/></headers>
    <parameters><parameter type="string" name="text" value="{{ message }} ..."/></parameters>
    <config><input-field type="text"><name>message</name><label>Message</label></input-field></config>
</flow-action>
```

- `meta`:
  - `name` is unique and must match `[a-z][a-z.]*[a-z]`.
  - Other elements: `label` and `description` (translatable via `lang`), `badge`, `url` (the webhook to call), `sw-icon` or `icon` (`icon` wins if both are set), repeatable `requirements`, and an optional boolean `delayable`.
- `requirements` sets which triggers offer the action. Each value is the lcfirst short name of a `Shopware\Core\Framework\Event` interface: `customerAware`, `customerGroupAware`, `mailAware`, `orderAware`, `salesChannelAware`, `userAware`. For example, `checkout.order.placed` is `orderAware`.
- `headers` and `parameters` hold `<parameter type name value>` elements, all three attributes required, and only `string` type is supported. Values can use config fields (`{{ message }}`) and trigger data (`{{ order.orderNumber }}`). See the [flow action reference](platform/dev/6.7/resources/references/app-reference/flow-action-reference.md).
- `config` holds `<input-field type="...">` elements:
  - Children: `name` (`[a-zA-Z][a-zA-Z0-9]*`), `label`, `place-holder`, `helpText`, `required` (default `false`), `defaultValue`, `options`.
  - Types: `text`, `textarea`, `text-editor`, `url`, `password`, `int`, `float`, `bool`, `checkbox`, `datetime`, `date`, `time`, `colorpicker`, `single-select`, `multi-select`. See [plugin configuration](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md).
3. Install: `bin/console app:install --activate FlowBuilderActionApp`.

## Essential identifiers

- `<flow-extensions>`, `<flow-actions>`, `<flow-action>`, `<input-field>`
- `Shopware\Core\Framework\Event\OrderAware`, `CustomerAware`, `CustomerGroupAware`, `MailAware`, `SalesChannelAware`, `UserAware`
- `bin/console app:install --activate`

## Gotchas

- The docs list `delayAware` mapped to `Shopware\Core\Framework\Event\DelayAware`. That interface does not exist in 6.7. Delay support is the separate `<delayable>` meta flag.
- The docs present `headers`, `parameters` and `config` as optional and mark `description` as required. The XSD is the reverse: those three children are mandatory, while every element inside `meta` is optional.

## Version notes

- Custom flow actions from apps require Shopware 6.4.10.0 or later.

## Code check (6.7.15.1)
- absent `Shopware\Core\Framework\Event\DelayAware` — no such interface in the installed code; delay is the `delayable` meta flag
- corrected `flow-action` — docs: headers/parameters/config optional; XSD xs:all requires meta, headers, parameters, config — vendor/shopware/core/Framework/App/Flow/Schema/flow-1.0.xsd:31
- confirmed `meta.name` — pattern `[a-z][a-z.]*[a-z]` — vendor/shopware/core/Framework/App/Flow/Schema/flow-1.0.xsd:51
- confirmed `delayable` — optional boolean meta element — vendor/shopware/core/Framework/App/Flow/Schema/flow-1.0.xsd:66
- confirmed `requirements` — meta element, mapped to lcfirst interface short name — vendor/shopware/core/Content/Flow/Api/FlowActionCollector.php:77
- confirmed `Shopware\Core\Framework\Event\OrderAware` — interface exists — vendor/shopware/core/Framework/Event/OrderAware.php:9
- confirmed `Shopware\Core\Framework\Event\CustomerGroupAware` — interface exists — vendor/shopware/core/Framework/Event/CustomerGroupAware.php:9
- confirmed `parameter` — type, name, value attributes all required — vendor/shopware/core/Framework/App/Flow/Schema/flow-1.0.xsd:69
- confirmed `input-field` — type enum text…multi-select, required default false — vendor/shopware/core/Framework/App/Flow/Schema/flow-1.0.xsd:102
- confirmed `app:install` — command with `--activate` option — vendor/shopware/core/Framework/App/Command/InstallAppCommand.php:29
