---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/references/adr/2023-07-13-flow-builder-preview.md
sourceHash: 55c243740ad2e0a6247f5e7fdd5348946aa4ad73
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-07-13-flow-builder-preview.html
title: Flow Builder Preview
version: "6.7"
versions: ["6.7"]
keywords: ["flow builder preview", "flow preview", "FlowAction", "handleFlow", "StorableFlow", "flow action", "flow logging", "dry run", "flow debugging", "skipped action", "business ops", "adr"]
summary: "ADR (2023): planned optional preview of flows that evaluates rules and validates action input without running handleFlow; not present in 6.7.15.1 code."
lastBuilt: 2026-10-21
---
## What it is

Architecture decision record (2023-07-13, area Business Ops) proposing a Flow Builder Preview: merchants could preview a flow to see which steps and decisions it would take, without the real flow being executed or simulated. It is one of two planned measures; the other, Flow Builder Logging (what went wrong in the past), is explicitly out of scope of this ADR.

## When to use

Read this when you build or maintain custom flow actions and want to know whether you must support a preview mode, or when you are debugging why a flow (e.g. a mail flow) did not behave as intended and look for tooling. Check the Code check section first: the preview is a decision, not shipped code, in the installed version.

## Key steps / config

Scope as decided in the ADR — the preview helps merchants *create* new flows and *update* existing ones.

Will do:

- Evaluate the path of a flow by executing its rules.
- Validate the input data of the actions.
- Leave it up to each action how much "real" code it executes for the preview.

Won't do:

- Execute flow actions, i.e. call an action's `handleFlow` method.
- Run one large database transaction and roll it back afterwards. (Examples the ADR gives of what an action itself might choose: a mail action could render the template and send it to a given address; a CRUD action could only check input data or open its own transaction and roll it back.)

Preview support is optional for existing and new actions. Actions without it would be shown as "skipped" in the Administration. The ADR sketches a new core interface defining the preview output structure that an action implements to become previewable (see Gotchas for its status).

What the installed code requires of a flow action today is the abstract `FlowAction` base (`Shopware\Core\Content\Flow\Dispatching\Action\FlowAction`):

```php
class MyAction extends FlowAction
{
    public static function getName(): string { /* ... */ }
    public function requirements(): array { /* ... */ }
    public function handleFlow(StorableFlow $flow): void { /* ... */ }
}
```

## Essential identifiers

- `Shopware\Core\Content\Flow\Dispatching\Action\FlowAction`
- `FlowAction::handleFlow(StorableFlow $flow)`, `FlowAction::requirements()`, `FlowAction::getName()`

## Gotchas

- The interface sketched in the ADR (`Previewable` with `preview(...): PreviewResponseStruct`) is labelled "could look like this" and does not exist in the installed 6.7.15.1 code; no preview endpoint or service exists in core Flow either. Do not implement against it.
- The ADR advises implementing preview anyway once available, because it helps merchants and adds value to the action — but the preview must stay as close as possible to the real action logic, otherwise it gives merchants a wrong impression of what the flow does.
- Preview does not replace logging: it shows what a flow would do, not what went wrong in past executions.

## Code check (6.7.15.1)
- absent `Previewable` — proposed preview interface, not found anywhere in the installed code
- absent `PreviewResponseStruct` — proposed preview output struct, not found anywhere in the installed code
- confirmed `FlowAction` — abstract base class for flow actions — vendor/shopware/core/Content/Flow/Dispatching/Action/FlowAction.php:9
- confirmed `FlowAction::handleFlow()` — abstract, takes `StorableFlow` — vendor/shopware/core/Content/Flow/Dispatching/Action/FlowAction.php:16
- confirmed `FlowAction::requirements()` — abstract, returns list of required data — vendor/shopware/core/Content/Flow/Dispatching/Action/FlowAction.php:14
- confirmed `FlowAction::getName()` — abstract static — vendor/shopware/core/Content/Flow/Dispatching/Action/FlowAction.php:18
