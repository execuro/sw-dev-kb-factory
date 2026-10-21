---
id: platform/dev/6.7/resources/references/adr/2025-01-31-move-flow-execution-after-business-process.md
title: Move flow execution after business process
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2025-01-31-move-flow-execution-after-business-process.html
sourceHash: 9a2982a1ce1898deec706eaf8422702e63f1ce6a
codeCheckedAgainst: "6.7.15.1"
keywords: ["flow builder", "flow execution", "FLOW_EXECUTION_AFTER_BUSINESS_PROCESS", "FlowDispatcher", "BufferedFlowExecutionTriggersListener", "BufferedFlowQueue", "BufferedFlowExecutor", "KernelEvents::TERMINATE", "WorkerMessageHandledEvent", "ConsoleEvents::TERMINATE", "deferred flows", "feature flag", "adr"]
summary: "ADR: with FLOW_EXECUTION_AFTER_BUSINESS_PROCESS (default from 6.8), flows are buffered in memory and run after the request, message or command ends."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2025-01-31, area Core, tagged experimental) that moves flow execution out of the business process (checkout, product update, any user-triggered event) and runs flows after that unit of work has finished. It only takes effect when the feature flag `FLOW_EXECUTION_AFTER_BUSINESS_PROCESS` is enabled.

## When to use

- Your plugin relies on a flow action having run before the triggering business process returns (e.g. reading data written by a flow in the same request).
- You debug flows and see them executing in a terminate/handled listener instead of inside the event dispatch.
- You want to understand why a failing flow no longer aborts a checkout.

## Key steps / config

Problems with in-process flow execution, per the ADR:

- A fatal error in any flow cancels the in-progress business process.
- Flows such as mail sending slow down the business process although they are not needed to complete it.
- Flows run from a decorator of Symfony's `EventDispatcher`, which bloats stack traces and complicates debugging.

Decision: flows are queued in memory and executed once the execution environment signals the end of a unit of work:

1. Web: after a controller action → `KernelEvents::TERMINATE`
2. Queue: after a queued message is processed → `WorkerMessageHandledEvent`
3. CLI: after a command is executed → `ConsoleEvents::TERMINATE`

How the installed code does it:

- `Shopware\Core\Content\Flow\Dispatching\FlowDispatcher` (decorates the event dispatcher) checks `Feature::isActive('FLOW_EXECUTION_AFTER_BUSINESS_PROCESS') || Feature::isActive('v6.8.0.0')`. If active, it creates a buffered flow via `FlowFactory::createBuffered()` and queues it in `BufferedFlowQueue` instead of calling the flow executor directly.
- `BufferedFlowExecutionTriggersListener` subscribes to the three events above (only when the flag or `v6.8.0.0` is active) and calls `BufferedFlowExecutor::executeBufferedFlows()` when the queue is not empty.
- Enable the flag in the feature configuration: it is declared in `feature.yaml` with `default: false`, `major: true`, `toggleable: true`.

The rejected alternative was dispatching flows as queue messages: simpler, but harder to debug and with an unpredictable delay even on a high-priority queue.

## Essential identifiers

- `FLOW_EXECUTION_AFTER_BUSINESS_PROCESS` — feature flag
- `FlowDispatcher`, `BufferedFlowQueue`, `BufferedFlowExecutor`, `BufferedFlowExecutionTriggersListener`
- `KernelEvents::TERMINATE`, `WorkerMessageHandledEvent`, `ConsoleEvents::TERMINATE`

## Gotchas

- Plugins relying on flows being executed during the business process must be updated.
- Flows can no longer fail the business process; the interface for registering flows does not change.
- Total execution time is not expected to increase significantly; business process performance is expected to improve.
- `FlowDispatcher` and `BufferedFlowExecutionTriggersListener` are `@internal` and `@final` — not for decoration or replacement.

## Version notes

- 6.7: opt-in via the flag (default off). The flag description states it becomes the default in 6.8, and the code already treats `v6.8.0.0` as enabling it.

## Code check (6.7.15.1)
- confirmed `FLOW_EXECUTION_AFTER_BUSINESS_PROCESS` — declared default false, toggleable — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:34
- confirmed `FlowDispatcher::dispatch()` — reads the flag (or v6.8.0.0) and buffers flows — vendor/shopware/core/Content/Flow/Dispatching/FlowDispatcher.php:41
- confirmed `BufferedFlowQueue` — buffered flow is queued instead of executed — vendor/shopware/core/Content/Flow/Dispatching/FlowDispatcher.php:60
- confirmed `KernelEvents::TERMINATE` — trigger for web requests — vendor/shopware/core/Content/Flow/Dispatching/BufferedFlowExecutionTriggersListener.php:36
- confirmed `WorkerMessageHandledEvent` — trigger for queue messages — vendor/shopware/core/Content/Flow/Dispatching/BufferedFlowExecutionTriggersListener.php:37
- confirmed `ConsoleEvents::TERMINATE` — trigger for CLI commands — vendor/shopware/core/Content/Flow/Dispatching/BufferedFlowExecutionTriggersListener.php:38
- confirmed `BufferedFlowExecutor` — executes buffered flows when the queue is non-empty — vendor/shopware/core/Content/Flow/Dispatching/BufferedFlowExecutionTriggersListener.php:48
