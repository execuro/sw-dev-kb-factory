---
id: platform/dev/6.7/guides/plugins/apps/flow-builder/add-custom-flow-actions-from-app-system.md
title: Add Custom Flow Action from App System
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/flow-builder/add-custom-flow-actions-from-app-system.html
sourceHash: 4bd905e0bf9d3f683453b4676870944e8c61e5f1
codeCheckedAgainst: "6.7.13.0"
keywords: ["custom flow action", "flow builder", "app webhook action", "flow.xml", "flow-action", "requirements", "orderAware", "customerAware", "input-field", "flow-1.0.xsd", "app:install", "Shopware\\Core\\Framework\\Event\\OrderAware", "delayable"]
summary: App flow actions in Resources/flow.xml - meta (name, label, url, requirements), headers, parameters, config input fields; Shopware POSTs to the url.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/concepts/framework/flow-concept.md", "platform/dev/6.7/resources/references/app-reference/flow-action-reference.md", "platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md"]
---
## What it is

How an app adds configurable webhook actions to the Flow Builder: each `<flow-action>` in the app's `Resources/flow.xml` becomes an action in the Administration; when a flow runs it, Shopware calls the action's `url` with the configured headers and body parameters.

## When to use

An app needs a flow step that calls a third-party service (e.g. post a Slack message when an order is placed). Available since Shopware 6.4.10.0. See [Flow Builder concept](platform/dev/6.7/concepts/framework/flow-concept.md).

## Key steps / config

1. Create `custom/apps/<AppName>/manifest.xml` (schema `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Manifest/Schema/manifest-3.0.xsd`); `<meta><name>` must match the folder name.
2. Create `Resources/flow.xml` (schema `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Flow/Schema/flow-1.0.xsd`), root `<flow-extensions>` → `<flow-actions>` → any number of `<flow-action>`, each with `meta`, `headers`, `parameters`, `config`:

```xml
<flow-action>
    <meta>
        <name>slackmessage</name>
        <label>Send slack message</label>
        <url>https://hooks.slack.com/services/{id}</url>
        <requirements>orderAware</requirements>
    </meta>
    <headers><parameter type="string" name="content-type" value="application/json"/></headers>
    <parameters><parameter type="string" name="text" value="{{ message }}"/></parameters>
    <config><input-field type="text"><name>message</name><label>Message</label></input-field></config>
</flow-action>
```

3. Meta: the parser requires `name`, `label`, `url`. Optional: `description`, `badge`, `sw-icon`, `icon` (wins over `sw-icon`), `headline`, `delayable` (boolean). `label`/`description` accept `lang`. `<requirements>` may repeat; values are aware-interface names that restrict which triggers offer the action: `customerAware`, `customerGroupAware`, `mailAware`, `orderAware`, `salesChannelAware`, `userAware` (interfaces in `Shopware\Core\Framework\Event\`, e.g. `Shopware\Core\Framework\Event\OrderAware`).
4. `<parameter>` needs `type` (only `string`), `name`, `value`; values can use config variables (`{{ message }}`) and trigger data (`{{ order.orderNumber }}`, see [flow action reference](platform/dev/6.7/resources/references/app-reference/flow-action-reference.md)).
5. `<input-field type="...">` keys: `name`, `label` (required), `place-holder`, `required`, `helpText`. Types: `text`, `textarea`, `text-editor`, `url`, `password`, `int`, `float`, `bool`, `checkbox`, `datetime`, `date`, `time`, `colorpicker`, `single-select`, `multi-select` (see [plugin configuration](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md)).
6. Install: `bin/console app:install --activate FlowBuilderActionApp`.

## Essential identifiers

- `Resources/flow.xml`, `<flow-extensions>`, `<flow-actions>`, `<flow-action>`, `<input-field>`
- `<requirements>`: `orderAware`, `customerAware`, `customerGroupAware`, `mailAware`, `salesChannelAware`, `userAware`
- `bin/console app:install --activate`

## Gotchas

- The docs list `delayAware` / `Shopware\Core\Framework\Event\DelayAware`; that interface does not exist in the installed code. App actions signal delay support via the `<delayable>` meta boolean.
- The docs mark `description` and `requirements` as required; the parser only enforces `label`, `name`, `url`.
- Action `<name>` must match `[a-z][a-z.]*[a-z]` and be unique.

## Code check (6.7.13.0)
- absent `Shopware\Core\Framework\Event\DelayAware` — listed as a requirement interface in docs; not in the installed code
- corrected `REQUIRED_FIELDS` — docs: description and requirements required; code requires label, name, url — vendor/shopware/core/Framework/App/Flow/Action/Xml/Metadata.php:15
- confirmed `delayable` — optional boolean meta element — vendor/shopware/core/Framework/App/Flow/Schema/flow-1.0.xsd:66
- confirmed `flow-action` — children meta, headers, parameters, config — vendor/shopware/core/Framework/App/Flow/Schema/flow-1.0.xsd:31
- confirmed `lcfirst` — aware values derived from interface short names — vendor/shopware/core/Framework/Event/BusinessEventCollector.php:75
- confirmed `Shopware\Core\Framework\Event\OrderAware` — interface exists — vendor/shopware/core/Framework/Event/OrderAware.php:9
- confirmed `Shopware\Core\Framework\Event\CustomerAware` — interface exists — vendor/shopware/core/Framework/Event/CustomerAware.php:9
- confirmed `Shopware\Core\Framework\Event\MailAware` — interface exists — vendor/shopware/core/Framework/Event/MailAware.php:10
- confirmed `Resources/flow.xml` — file parsed for app flow actions — vendor/shopware/core/Framework/App/Lifecycle/Handler/FlowActionLifecycleHandler.php:83
- confirmed `app:install` — command name — vendor/shopware/core/Framework/App/Command/InstallAppCommand.php:28
