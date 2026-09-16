---
id: platform/dev/6.6/concepts/framework/flow-concept.md
title: Flow
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/concepts/framework/flow-concept.html
sourceHash: 5b203cf228af7b30d10104a3aa60292d2be6df90
keywords: ["flow builder", "flow", "trigger", "condition", "action", "flow template", "stop flow", "flowdispatcher", "flowexecutor", "floweventaware", "stopflowaction", "aware interface", "cartorderroute"]
summary: "Explains Flow Builder concepts (flow, trigger, condition, action, template) and how FlowDispatcher/FlowExecutor evaluate a flow."
lastBuilt: "2026-09-15"
---
## What it is

Flow Builder is Shopware's automation solution letting shop owners build workflows that automate tasks without programming knowledge, composed of flows, triggers, conditions, and actions.

## When to use

Relevant when implementing custom flow triggers/actions/conditions in an app or plugin, or when tracing how an event on the Storefront results in a flow's actions running.

## Key steps / config

Concepts:
- **Flow** — an automation process specifying which actions a trigger runs, with optional conditions; if multiple flows share a trigger, a priority point decides which runs first.
- **Trigger** — an event that starts the flow, detected from the Storefront or the application; a trigger can have multiple actions.
- **Condition** — a business rule determining whether an action should execute.
- **Action** — a task executed on a trigger or when conditions are met; the special "Stop flow" action stops any further action in the sequence.
- **Flow Template** — a pre-created flow shipped with Shopware or created by apps/plugins; viewable like a regular flow but not modifiable.

Evaluation sequence: triggers implement the *Aware* interface (e.g. `FlowEventAware`). Once an action happens, `FlowDispatcher::dispatch()` dispatches the `FlowEventAware` event to `FlowExecutor::execute()`, which calls `FlowExecutor::sequenceRuleMatches()` to decide whether to run the action, then executes it and finally calls `StopFlowAction::handleFlow()`.

Example: placing a Storefront order dispatches the `checkout.order.place` event from `CartOrderRoute::Order()` to `FlowDispatcher::dispatch()`, which calls `FlowExecutor::execute()` → `FlowExecutor::executeAction()` → `StopFlowAction::handleFlow()`.

## Essential identifiers

- `FlowDispatcher::dispatch()`, `FlowExecutor::execute()`, `FlowExecutor::sequenceRuleMatches()`, `StopFlowAction::handleFlow()`
- `FlowEventAware` — the *Aware* interface implemented by triggers
- `checkout.order.place` — example dispatched event, via `CartOrderRoute::Order()`
