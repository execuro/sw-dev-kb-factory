---
id: platform/dev/6.7/concepts/framework/flow-concept.md
title: Flow
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/flow-concept.html
sourceHash: 0daa6a28949a0d751a656429cb05478e5e4a639a
codeCheckedAgainst: "6.7.15.1"
keywords: ["flow builder", "automation", "workflow", "trigger", "action", "FlowDispatcher", "FlowExecutor", "StopFlowAction", "FlowEventAware", "FlowStorer", "StorableFlow", "FlowFactory", "OrderStorer", "flow template", "checkout.order.placed"]
summary: "Flow Builder concept: flows, triggers, conditions, actions, templates; FlowDispatcher/FlowExecutor evaluation and FlowStorer store/restore of flow data."
lastBuilt: 2026-10-20
---
## What it is

Flow Builder is Shopware's automation feature: shop owners build workflows (flows) that run actions when a trigger fires, optionally gated by conditions, without programming. This page explains the building blocks and how the Core evaluates a flow sequence and stores flow data.

## When to use

Read this before writing custom flow triggers, actions or storers in a plugin or app, or when debugging why a flow action did or did not run.

## Key steps / config

Building blocks:

- **Flow** - an automation process: which actions a trigger runs, under which conditions. If several flows share a trigger, their priority decides which runs first.
- **Trigger** - an event from the Storefront or the application that starts the flow; one trigger can have multiple actions.
- **Condition** - a business rule deciding whether an action executes.
- **Action** - a task executed on the trigger or when conditions match. The special "Stop flow" action stops all further actions in the sequence.
- **Flow template** - a pre-created flow from the flow library; created by apps or plugins; viewable like a flow but not modifiable.

Evaluation in the Core:

1. Triggers are events implementing the `*Aware` interfaces, in particular `FlowEventAware`.
2. `FlowDispatcher::dispatch()` passes the event to `FlowExecutor::execute()`.
3. `FlowExecutor::executeSequence()` walks the sequence: an if-sequence evaluates its rule (`FlowExecutor::sequenceRuleMatches()`) and continues on the true or false branch; an action sequence runs `FlowExecutor::executeAction()`.
4. `StopFlowAction::handleFlow()` ends the sequence.

Example - placing an order: `CartOrderRoute::order()` dispatches `checkout.order.placed` → `FlowDispatcher::dispatch()` → `FlowExecutor::execute()` → `FlowExecutor::executeAction()` → `StopFlowAction::handleFlow()`.

Storer concept: storer classes (`ProductStorer`, `OrderStorer`, `MailStorer`, ...) extend the abstract `FlowStorer`, which declares:

```php
abstract public function store(FlowEventAware $event, array $stored): array;
abstract public function restore(StorableFlow $storable): void;
```

`FlowFactory::create()` builds the `StorableFlow` and calls the storers; `restore` loads the stored data directly or lazily. Storers are tied to `*Aware` interfaces: `CheckoutOrderPlacedEvent` implements `OrderAware`, so `OrderStorer` stores and restores the order.

## Essential identifiers

- `FlowDispatcher::dispatch()`, `FlowExecutor::execute()`, `FlowExecutor::executeSequence()`, `FlowExecutor::executeAction()`, `FlowExecutor::sequenceRuleMatches()`
- `StopFlowAction::handleFlow()`
- `FlowEventAware`, `OrderAware`, `CheckoutOrderPlacedEvent` (`checkout.order.placed`)
- `FlowStorer::store()`, `FlowStorer::restore()`, `ProductStorer`, `OrderStorer`, `MailStorer`
- `StorableFlow`, `FlowFactory`, `CartOrderRoute::order()`

## Gotchas

- The docs' diagram labels `FlowExecutor::executeAction1()`, `executeAction2()` and `executeAction3()` are not real methods - they stand for `FlowExecutor::executeAction()` on the false, true and no-condition branches.
- The docs' event label `checkout.order.place` is `checkout.order.placed` in code.
- Flow data is not persisted by default; it is restored in the same request for instant actions. Only delayed flows persist it for later execution.

## Code check (6.7.15.1)
- absent `executeAction1` — diagram placeholder, no such method in the installed code
- absent `executeAction2` — diagram placeholder, no such method in the installed code
- absent `executeAction3` — diagram placeholder, no such method in the installed code
- confirmed `FlowDispatcher::dispatch()` — entry point for flow events — vendor/shopware/core/Content/Flow/Dispatching/FlowDispatcher.php:41
- confirmed `FlowExecutor::executeAction()` — runs an `ActionSequence` — vendor/shopware/core/Content/Flow/Dispatching/FlowExecutor.php:124
- confirmed `FlowExecutor::sequenceRuleMatches()` — private rule check for if-sequences — vendor/shopware/core/Content/Flow/Dispatching/FlowExecutor.php:239
- confirmed `StopFlowAction::handleFlow()` — stop-flow action, delayable — vendor/shopware/core/Content/Flow/Dispatching/Action/StopFlowAction.php:28
- confirmed `FlowStorer::store()` — abstract, with `restore(StorableFlow)` — vendor/shopware/core/Content/Flow/Dispatching/Storer/FlowStorer.php:17
- confirmed `FlowFactory::create()` — builds `StorableFlow` from a `FlowEventAware` event — vendor/shopware/core/Content/Flow/Dispatching/FlowFactory.php:29
- corrected `CheckoutOrderPlacedEvent::EVENT_NAME` — docs: `checkout.order.place`; code `checkout.order.placed` — vendor/shopware/core/Checkout/Cart/Event/CheckoutOrderPlacedEvent.php:34
