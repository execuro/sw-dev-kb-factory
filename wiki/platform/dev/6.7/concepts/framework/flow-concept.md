---
id: platform/dev/6.7/concepts/framework/flow-concept.md
title: Flow
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/flow-concept.html
sourceHash: 0daa6a28949a0d751a656429cb05478e5e4a639a
codeCheckedAgainst: "6.7.13.0"
keywords: ["flow builder", "automation", "FlowDispatcher", "FlowExecutor", "FlowEventAware", "FlowFactory", "StorableFlow", "FlowStorer", "OrderStorer", "StopFlowAction", "FlowAction", "trigger", "action", "flow template", "storer"]
summary: Flow Builder concept - triggers, conditions, actions, templates; how FlowDispatcher and FlowExecutor run sequences; FlowStorer data storage.
lastBuilt: 2026-09-15
---
## What it is

Concept page for Flow Builder, Shopware's no-code automation: a flow binds a trigger (event) to actions, optionally gated by conditions (rules). The page also explains how the core dispatches and executes flow sequences and how flow data is stored via storer classes.

## When to use

- You need the vocabulary (flow, trigger, condition, action, flow template) before writing a custom trigger, action or storer.
- You are debugging why a flow action did or did not run for an event.

## Key steps / config

Terms:

- **Flow** — automation process; several flows with the same trigger run in order of their priority.
- **Trigger** — an event from the Storefront or application that starts the flow; triggers implement `FlowEventAware` (plus `*Aware` interfaces).
- **Condition** — a business rule deciding whether an action runs.
- **Action** — a task run on the trigger or when conditions match. "Stop flow" (`StopFlowAction`) stops further actions in the sequence.
- **Flow template** — a pre-created, read-only flow shipped in the flow library; created by apps or plugins.

Evaluation path in 6.7.13.0:

1. `FlowDispatcher::dispatch()` dispatches the event normally; if it is `FlowEventAware`, not propagation-stopped and the context lacks `Context::SKIP_TRIGGER_FLOW`, it creates a `StorableFlow` via `FlowFactory::create()` and runs the matching flows.
2. `FlowExecutor::execute()` walks each flow's sequences through `FlowExecutor::executeSequence()`.
3. An if-sequence is resolved by `FlowExecutor::executeIf()`, which calls the private `sequenceRuleMatches()` and continues with the true or false branch.
4. `FlowExecutor::executeAction()` calls the action's `handleFlow(StorableFlow $flow)` (inside a transaction for `TransactionalAction`), then follows `nextAction`; it returns early when the flow state is stopped or delayed.

Example: placing an order → `checkout.order.place` dispatched through `FlowDispatcher::dispatch()` → `FlowExecutor::execute()` → `FlowExecutor::executeAction()` → action `handleFlow()`.

Storer concept: storer classes (`ProductStorer`, `OrderStorer`, `MailStorer`, …) extend abstract `FlowStorer`, which declares:

```php
abstract public function store(FlowEventAware $event, array $stored): array;
abstract public function restore(StorableFlow $storable): void;
```

They are invoked when `FlowFactory` builds the `StorableFlow`; `restore` loads data directly or lazily. Storers map to `*Aware` interfaces — e.g. `CheckoutOrderPlacedEvent` implements `OrderAware`, so `OrderStorer` stores/restores the order.

## Essential identifiers

- `FlowDispatcher::dispatch()`, `FlowFactory::create()`, `StorableFlow`
- `FlowExecutor::execute()`, `FlowExecutor::executeSequence()`, `FlowExecutor::executeIf()`, `FlowExecutor::executeAction()`
- `FlowAction` (abstract `requirements()`, `handleFlow()`), `StopFlowAction`
- `FlowStorer::store()`, `FlowStorer::restore()`, `OrderStorer`, `ProductStorer`, `MailStorer`
- `FlowEventAware`, `OrderAware`, `CheckoutOrderPlacedEvent`

## Gotchas

- The docs' diagram labels methods `executeAction1()`, `executeAction2()`, `executeAction3()`; these do not exist — they are diagram placeholders for `executeAction()` reached via different branches.
- Flow data is not persisted by default; it is restored in the same request. Only delayed flows persist stored data for later execution.
- Setting `Context::SKIP_TRIGGER_FLOW` on the event context suppresses flow execution.

## Version notes

- With feature flag `FLOW_EXECUTION_AFTER_BUSINESS_PROCESS` (default off, "will become the default for next major 6.8") or `v6.8.0.0` active, `FlowDispatcher` queues a buffered flow (`FlowFactory::createBuffered()`, `BufferedFlowQueue`) instead of executing immediately.

## Code check (6.7.13.0)
- absent `executeAction3` — not in installed code; diagram placeholder
- absent `executeAction2` — not in installed code; diagram placeholder
- absent `executeAction1` — not in installed code; diagram placeholder
- confirmed `FlowDispatcher::dispatch()` — only `FlowEventAware` events trigger flows — vendor/shopware/core/Content/Flow/Dispatching/FlowDispatcher.php:41
- confirmed `FlowExecutor::execute()` — entry point per flow — vendor/shopware/core/Content/Flow/Dispatching/FlowExecutor.php:102
- confirmed `FlowExecutor::executeAction()` — calls handleFlow, follows nextAction — vendor/shopware/core/Content/Flow/Dispatching/FlowExecutor.php:130
- confirmed `FlowExecutor::sequenceRuleMatches()` — private, called from executeIf — vendor/shopware/core/Content/Flow/Dispatching/FlowExecutor.php:231
- confirmed `StopFlowAction::handleFlow()` — stop flow action — vendor/shopware/core/Content/Flow/Dispatching/Action/StopFlowAction.php:28
- confirmed `FlowStorer::store()` — abstract store/restore pair — vendor/shopware/core/Content/Flow/Dispatching/Storer/FlowStorer.php:17
- confirmed `FlowFactory::create()` — builds the StorableFlow from a FlowEventAware event — vendor/shopware/core/Content/Flow/Dispatching/FlowFactory.php:29
