---
id: platform/dev/6.7/resources/references/adr/2022-04-19-integrate-app-into-flow-action.md
title: Integrate an app into flow action
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-04-19-integrate-app-into-flow-action.html
sourceHash: c466a31a033bf6c2e14c3867f98bb2af2c49b07d
codeCheckedAgainst: "6.7.13.0"
keywords: ["flow-actions", "flow-action", "flow-extensions", "Resources/flow.xml", "flow-1.0.xsd", "app_flow_action", "app_flow_action_id", "FlowExecutor", "AppFlowActionEvent", "flow builder", "app flow action", "webhook", "input-field"]
summary: "ADR: apps ship flow actions in Resources/flow.xml (flow-extensions > flow-actions); FlowExecutor calls the app webhook via app_flow_action_id."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record for letting apps deliver their own Flow Builder actions. Because apps cannot ship PHP code, an app flow action is declared in XML and executed by calling a configurable webhook in the background. An app can deliver multiple actions; the data is stored in the database and deleted when the app is uninstalled.

## When to use

- You build an app that should add actions (e.g. "send a Telegram message") to flows triggered by business events such as an order being placed.
- You debug how an app flow action is stored and dispatched.

## Key steps / config

1. Create `Resources/flow.xml` in the app (validated against `flow-1.0.xsd`). Skeleton per the installed schema:

```xml
<flow-extensions>
    <flow-actions>
        <flow-action>
            <meta><name/><label/><badge/><description/><sw-icon/><url/><requirements/></meta>
            <headers><parameter type="string" name="content-type" value="application/json"/></headers>
            <parameters><parameter type="string" name="message" value="{{ subject }} ..."/></parameters>
            <config><input-field type="text"><name>subject</name><label/><required>true</required></input-field></config>
        </flow-action>
    </flow-actions>
</flow-extensions>
```

2. Sections of a `flow-action`:
   - `meta` — identification and UI: `name` (lowercase, dots allowed, e.g. `telegram.send.message`), `label`, `headline`, `description`, `icon`, `badge`, `sw-icon`, `url` (webhook target), `requirements` (e.g. `orderAware`), `delayable`.
   - `headers` — `parameter` elements (`type`, `name`, `value`) sent as webhook headers.
   - `parameters` — `parameter` elements for the webhook payload; values can use Twig-style placeholders such as `{{ customer.lastName }}` and config field names.
   - `config` — `input-field` elements for the Administration form (`name`, `label`, `place-holder`, `helpText`, `defaultValue`, `options`, `required`; `type` e.g. `text`, `textarea`, `single-select`).
3. On install the actions are stored in `app_flow_action`. A `flow_sequence` pointing at an app action carries `app_flow_action_id`; `FlowExecutor` detects it and dispatches an `AppFlowActionEvent` with the rendered headers and payload instead of a PHP action handler.

## Essential identifiers

- `Resources/flow.xml`, schema `flow-1.0.xsd`, root `flow-extensions`
- `Shopware\Core\Framework\App\Flow\Action\Action::createFromXmlFile()`
- Entity `app_flow_action`; field `flow_sequence.app_flow_action_id`
- `Shopware\Core\Content\Flow\Dispatching\FlowExecutor`

## Gotchas

- The ADR names the file `Resources/flow-action.xml` with root `flow-actions`; the installed lifecycle handlers read `Resources/flow.xml`, whose root element is `flow-extensions` wrapping `flow-actions` (and optionally `flow-events`).
- The ADR says an `app_id` is stored on each `flow_sequence`; the code uses `app_flow_action_id` there, and `app_id` lives on `app_flow_action`.
- The ADR's XML uses a placeholder `noNamespaceSchemaLocation` host; do not copy it.
- `headers`, `parameters` and `config` are all declared in the schema's `xs:all` without `minOccurs="0"`, and `config` needs at least one `input-field`.

## Code check (6.7.13.0)
- corrected `Resources/flow.xml` — docs: Resources/flow-action.xml — vendor/shopware/core/Framework/App/Lifecycle/Handler/FlowActionLifecycleHandler.php:83
- corrected `flow-extensions` — docs: root element flow-actions; schema root is flow-extensions — vendor/shopware/core/Framework/App/Flow/Schema/flow-1.0.xsd:3
- confirmed `XSD_FLOW_FILE` — schema /Schema/flow-1.0.xsd — vendor/shopware/core/Framework/App/Flow/Action/Action.php:13
- confirmed `meta` — name, label, headline, description, icon, badge, sw-icon, url, requirements, delayable — vendor/shopware/core/Framework/App/Flow/Schema/flow-1.0.xsd:49
- confirmed `input-field` — name, label, place-holder, helpText, defaultValue, options, required — vendor/shopware/core/Framework/App/Flow/Schema/flow-1.0.xsd:102
- corrected `app_flow_action_id` — docs: app_id stored on flow_sequence — vendor/shopware/core/Content/Flow/Aggregate/FlowSequence/FlowSequenceDefinition.php:78
- confirmed `app_flow_action` — entity with required app_id — vendor/shopware/core/Framework/App/Aggregate/FlowAction/AppFlowActionDefinition.php:31
- confirmed `appFlowActionId` — FlowExecutor dispatches AppFlowActionEvent for app actions — vendor/shopware/core/Content/Flow/Dispatching/FlowExecutor.php:196
