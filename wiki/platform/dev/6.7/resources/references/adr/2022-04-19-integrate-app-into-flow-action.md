---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/references/adr/2022-04-19-integrate-app-into-flow-action.md
sourceHash: c466a31a033bf6c2e14c3867f98bb2af2c49b07d
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-04-19-integrate-app-into-flow-action.html
title: Integrate an app into flow action
version: "6.7"
versions:
  - "6.7"
keywords: ["app flow action", "flow builder", "webhook", "Resources/flow.xml", "flow-1.0.xsd", "flow-extensions", "flow-actions", "app_flow_action", "app_flow_action_id", "flow_sequence", "FlowExecutor", "AppFlowActionEvent", "input-field", "adr"]
summary: "ADR: apps ship Flow Builder actions as XML-defined webhooks; in 6.7 they live in Resources/flow.xml and flow_sequence references app_flow_action_id."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2022-04-19) that lets apps provide their own Flow Builder actions. Apps cannot ship PHP code, so an app flow action is declared in XML and runs as a webhook to the app. Each app can provide several actions. They are stored in the database, and all of them are deleted when the app is uninstalled.

## When to use

- You are building an app that adds custom actions to Flow Builder.
- You are debugging why an app-provided flow action triggers a webhook rather than a PHP listener.
- You need the XML elements available for configuring an app flow action.

## Key steps / config

How it works: for each action configured on a flow trigger (a business event such as `CheckoutOrderPlaced`), Shopware dispatches an action. A core flow action is handled by a PHP listener. For an app action, the `flow_sequence` row references the app's action, and `FlowExecutor` sees this and calls the app's webhook instead.

Declare actions in the app's `Resources/flow.xml`, validated against `flow-1.0.xsd`. Each `<flow-action>` holds four blocks:

1. `<meta>`: identification and UI data. `name` must match `[a-z][a-z.]*[a-z]`. Other elements are `label`, `headline`, `description`, `icon`, `badge`, `sw-icon`, `url`, `requirements` and `delayable`.
2. `<headers>`: `<parameter type name value/>` entries sent as webhook headers.
3. `<parameters>`: `<parameter type name value/>` entries for the webhook payload. Values may use Twig such as `{{ customer.lastName }}` and config field names such as `{{ subject }}`.
4. `<config>`: `<input-field type="...">` entries for the admin UI, with `name`, `label`, `place-holder`, `helpText`, `defaultValue`, `options` and `required`.

```xml
<flow-extensions>
    <flow-actions>
        <flow-action>
            <meta><name>telegram.send.message</name><label>...</label><url>...</url><requirements>orderAware</requirements></meta>
            <headers><parameter type="string" name="content-type" value="application/json"/></headers>
            <parameters><parameter type="string" name="message" value="{{ subject }} ..."/></parameters>
            <config><input-field type="text"><name>subject</name><label>Subject</label><required>true</required></input-field></config>
        </flow-action>
    </flow-actions>
</flow-extensions>
```

Storage: each action becomes an `app_flow_action` row linked to the app by `app_id` (cascade delete). A `flow_sequence` row points to it through `app_flow_action_id`, also with cascade delete.

## Essential identifiers

- `Resources/flow.xml`, schema `flow-1.0.xsd`, root `<flow-extensions>` containing `<flow-actions>`/`<flow-action>`
- `<meta>`, `<headers>`, `<parameters>`, `<config>`, `<input-field>`
- Entity `app_flow_action` (`AppFlowActionDefinition`), FK `flow_sequence.app_flow_action_id`
- `Shopware\Core\Content\Flow\Dispatching\FlowExecutor`, `Shopware\Core\Framework\App\Event\AppFlowActionEvent`

## Gotchas

- The ADR names the file `Resources/flow-action.xml` with root `<flow-actions>` and the example schema location `https://test-flow.com/flow-action-1.0.xsd`. The installed 6.7 code reads only `Resources/flow.xml`. That file's root is `<flow-extensions>`, which can hold both `<flow-actions>` and `<flow-events>`.
- The ADR says `flow_sequence` stores an `app_id`. In the code it stores `app_flow_action_id`, and the `app_id` lives on `app_flow_action`.
- Action names must be unique within `<flow-actions>` (XSD `uniqueActionName`).

## Code check (6.7.15.1)
- absent `Resources/flow-action.xml` — not read anywhere; app flow actions load from `Resources/flow.xml`
- confirmed `Resources/flow.xml` — file loaded for app flow actions — vendor/shopware/core/Framework/App/Lifecycle/Handler/FlowActionLifecycleHandler.php:87
- confirmed `flow-1.0.xsd` — schema used to validate the flow file — vendor/shopware/core/Framework/App/Flow/Action/Action.php:13
- corrected `flow-extensions` — docs: root element `<flow-actions>`; XSD root is `<flow-extensions>` — vendor/shopware/core/Framework/App/Flow/Schema/flow-1.0.xsd:3
- confirmed `flow-action` — children `meta`, `headers`, `parameters`, `config` — vendor/shopware/core/Framework/App/Flow/Schema/flow-1.0.xsd:31
- corrected `app_flow_action_id` — docs: `app_id` stored on `flow_sequence` — vendor/shopware/core/Content/Flow/Aggregate/FlowSequence/FlowSequenceDefinition.php:81
- confirmed `AppFlowActionDefinition::ENTITY_NAME` — `app_flow_action`, cascade-deleted with app — vendor/shopware/core/Framework/App/Aggregate/FlowAction/AppFlowActionDefinition.php:31
- confirmed `FlowExecutor::callHandle()` — dispatches `AppFlowActionEvent` when `appFlowActionId` set — vendor/shopware/core/Content/Flow/Dispatching/FlowExecutor.php:204
