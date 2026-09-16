---
id: platform/dev/6.7/guides/plugins/plugins/framework/flow/_index.md
title: Flow
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/flow/
sourceHash: 74dc41ec79415b5ceae1790fd6278508d3f87c93
codeCheckedAgainst: "6.7.13.0"
keywords: ["flow builder", "flow", "flow actions", "flow triggers", "workflow automation", "FlowAction", "FlowEventAware", "flow.action", "FlowExecutor", "business events", "automation"]
summary: "Overview of Flow Builder extension: custom flow actions (tasks to run) and custom flow triggers (events that start a flow) for plugins."
lastBuilt: 2026-09-15
---
## What it is

Entry page for the Flow Builder plugin guides. Flow Builder lets shop owners create custom workflows and automation; a flow consists mainly of triggers and actions.

- **Actions** automate tasks or processes.
- **Triggers** are the events or conditions that start the execution of a flow.

Both can be customised by plugins and are then configured and executed within Flow Builder, so the shop reacts to specific events or changes.

## When to use

A plugin needs to add its own automated task to Flow Builder (a custom action) or make its own event available as a starting point of a flow (a custom trigger). The child guides of this section cover adding an action and running actions inside transactions.

## Key steps / config

Extension points in the installed core (6.7.13.0):

- A custom action is a service extending `Shopware\Core\Content\Flow\Dispatching\Action\FlowAction` (abstract methods `requirements()`, `handleFlow(StorableFlow $flow)`, static `getName()`), tagged `flow.action` with a `key` attribute; `FlowExecutor` indexes tagged actions by that `key`.
- A trigger is an event implementing `Shopware\Core\Framework\Event\FlowEventAware` (requires static `getAvailableData()` and `getName()`, plus `getContext()` from `ShopwareEvent`).

## Essential identifiers

- `Shopware\Core\Content\Flow\Dispatching\Action\FlowAction`
- `Shopware\Core\Framework\Event\FlowEventAware`
- `flow.action` (service tag)
- `Shopware\Core\Content\Flow\Dispatching\FlowExecutor`

## Code check (6.7.13.0)
- confirmed `FlowAction::requirements()` — abstract — vendor/shopware/core/Content/Flow/Dispatching/Action/FlowAction.php:14
- confirmed `FlowAction::handleFlow()` — abstract, takes StorableFlow — vendor/shopware/core/Content/Flow/Dispatching/Action/FlowAction.php:16
- confirmed `FlowAction::getName()` — abstract static — vendor/shopware/core/Content/Flow/Dispatching/Action/FlowAction.php:18
- confirmed `FlowEventAware::getAvailableData()` — static, returns EventDataCollection — vendor/shopware/core/Framework/Event/FlowEventAware.php:11
- confirmed `flow.action` — tagged_iterator indexed by key, injected into FlowExecutor — vendor/shopware/core/Content/DependencyInjection/flow.xml:61
