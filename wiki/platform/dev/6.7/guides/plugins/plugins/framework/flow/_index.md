---
id: platform/dev/6.7/guides/plugins/plugins/framework/flow/_index.md
title: Flow
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/flow/
sourceHash: 74dc41ec79415b5ceae1790fd6278508d3f87c93
codeCheckedAgainst: "6.7.15.1"
keywords: ["flow builder", "flow", "flow action", "flow trigger", "FlowAction", "FlowEventAware", "workflow automation", "business events", "BusinessEventCollectorEvent", "flow.action", "automation"]
summary: Overview of extending the Flow Builder in plugins - custom flow actions (tasks to automate) and custom flow triggers (events that start a flow).
lastBuilt: 2026-10-21
---
## What it is

Section overview for extending the Flow Builder from a plugin. The Flow Builder lets shop owners build custom workflows and automation; it consists of two parts:

- **Actions** - customizable tasks or processes the flow executes automatically.
- **Triggers** - the events or conditions that start the execution of a flow.

Both are defined and executed within the Flow Builder, so the shop reacts to specific events or changes in the platform.

## When to use

Start here when a plugin needs to add its own automation step (a custom flow action) or make its own event selectable as the start of a flow (a custom flow trigger); the child guides of this section cover each in detail.

## Essential identifiers

From the installed code, the two extension points this section's guides build on:

- `Shopware\Core\Content\Flow\Dispatching\Action\FlowAction` - abstract base class of a flow action.
- `Shopware\Core\Framework\Event\FlowEventAware` - interface an event implements to act as a flow trigger.

## Code check (6.7.15.1)
- confirmed `FlowAction` — abstract base class for flow actions (`requirements()`, `handleFlow()`, `getName()`) — vendor/shopware/core/Content/Flow/Dispatching/Action/FlowAction.php:9
- confirmed `FlowEventAware` — trigger interface requiring `getAvailableData()` and `getName()` — vendor/shopware/core/Framework/Event/FlowEventAware.php:9
- confirmed `flow.action` — DI tag collected by the flow executor, indexed by `key` — vendor/shopware/core/Content/DependencyInjection/flow.php:164
- confirmed `BusinessEventCollectorEvent::NAME` — event used to add triggers to the trigger list — vendor/shopware/core/Framework/Event/BusinessEventCollectorEvent.php:14
