---
id: platform/dev/6.7/resources/references/adr/2023-07-13-flow-builder-preview.md
title: Flow Builder Preview
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-07-13-flow-builder-preview.html
sourceHash: 55c243740ad2e0a6247f5e7fdd5348946aa4ad73
codeCheckedAgainst: "6.7.13.0"
keywords: ["flow builder preview", "flow builder", "FlowAction", "handleFlow", "StorableFlow", "flow action", "preview", "flow logging", "dry run", "simulate flow", "debug flow", "adr"]
summary: "ADR: optional Flow Builder preview (evaluate rules, validate action input, never call handleFlow); its interface is not in the installed 6.7 code."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2023-07-13, area Business Ops, tags services-settings/flow): a proposed Flow Builder Preview. Merchants would see which steps and decisions a flow takes without the flow's actions actually executing. The ADR covers only the preview; Flow Builder Logging is a separate topic.

## When to use

When debugging why a merchant's flow does not behave as intended (the ADR's example is a shop that sent no mails). Also when deciding whether a custom flow action should offer a preview, or when looking for preview support in the installed code.

## Key steps / config

Scope decided by the ADR (helping merchants create and update flows):

- Will do: evaluate the flow's path by executing rules; validate the input data of actions; let each action decide how much real code runs.
- Won't do: execute flow actions, i.e. call an action's `handleFlow` method. Won't run one large database transaction and roll it back afterwards. Instead, a mail action could render its template and send it to a given address, and a CRUD action could only check input or open and roll back its own transaction.
- Planned: preview support is optional for existing and new actions, and actions without it are shown as "skipped" in the Administration.
- Planned: a new core interface defines the preview output structure. Actions opt in by implementing it and must produce the preview without writing or executing anything real.

Installed flow action contract in 6.7 (what a custom action must declare today):

```php
class MyAction extends FlowAction
{
    public function requirements(): array { /* ... */ }
    public function handleFlow(StorableFlow $flow): void { /* ... */ }
    public static function getName(): string { /* ... */ }
}
```

## Essential identifiers

- `Shopware\Core\Content\Flow\Dispatching\Action\FlowAction`
- `FlowAction::handleFlow(StorableFlow $flow)`, `FlowAction::requirements()`, `FlowAction::getName()`

## Gotchas

- The ADR sketches the interface as `Previewable` with `preview(...): PreviewResponseStruct`. Neither name exists in the installed core, storefront or administration code, so there is nothing to implement against in 6.7.13.0.
- A preview executes differently from the real flow. The ADR advises keeping an action's preview implementation as close as possible to its real implementation, or the merchant gets a wrong impression.

## Code check (6.7.13.0)
- absent `Previewable` — sketched core interface not found in the installed code
- absent `PreviewResponseStruct` — sketched preview output struct not found in the installed code
- confirmed `FlowAction::handleFlow()` — abstract, takes StorableFlow — vendor/shopware/core/Content/Flow/Dispatching/Action/FlowAction.php:16
- confirmed `FlowAction::requirements()` — abstract member of the action contract — vendor/shopware/core/Content/Flow/Dispatching/Action/FlowAction.php:14
- confirmed `FlowAction::getName()` — abstract static member — vendor/shopware/core/Content/Flow/Dispatching/Action/FlowAction.php:18
- confirmed `SendMailAction::handleFlow()` — mail action implements the real execution entry point — vendor/shopware/core/Content/Flow/Dispatching/Action/SendMailAction.php:87
