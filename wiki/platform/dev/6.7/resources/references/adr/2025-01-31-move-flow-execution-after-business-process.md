---
id: platform/dev/6.7/resources/references/adr/2025-01-31-move-flow-execution-after-business-process.md
title: Move flow execution after business process
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2025-01-31-move-flow-execution-after-business-process.html
sourceHash: 9a2982a1ce1898deec706eaf8422702e63f1ce6a
codeCheckedAgainst: "6.7.13.0"
keywords: ["FLOW_EXECUTION_AFTER_BUSINESS_PROCESS", "FlowDispatcher", "BufferedFlowExecutionTriggersListener", "BufferedFlowQueue", "BufferedFlowExecutor", "KernelEvents::TERMINATE", "WorkerMessageHandledEvent", "ConsoleEvents::TERMINATE", "flow builder", "flow execution", "deferred flows", "feature flag", "adr"]
summary: "ADR: flows buffered in memory, run after the unit of work (kernel/console terminate, worker message handled); flag FLOW_EXECUTION_AFTER_BUSINESS_PROCESS"
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2025-01-31, area Core) moving Flow Builder execution out of the business process (checkout, product update, etc.) so that flows run after the triggering unit of work has finished. The behaviour is experimental and gated by the feature flag `FLOW_EXECUTION_AFTER_BUSINESS_PROCESS`.

## When to use

- You maintain a plugin that relies on flows (or flow actions such as mail sending) being executed synchronously during the business process — the ADR states such plugins have to be updated.
- You are debugging why a flow action runs later than the event that triggered it, or why a flow error no longer aborts the request.

## Key steps / config

Problem with the old approach: flows ran directly from a decorator of Symfony's `EventDispatcher` (`Shopware\Core\Content\Flow\Dispatching\FlowDispatcher`), so a fatal error in a flow cancelled the business process, expensive actions (mails) slowed it down, and stack traces were bloated.

Decision:
1. Flows are "queued" in memory instead of executed inline (with the flag on, `FlowDispatcher::dispatch()` builds a buffered flow and pushes it to `BufferedFlowQueue`).
2. They are executed as soon as the execution environment signals that a unit of work finished:
   - Web: `KernelEvents::TERMINATE`
   - Queue: `WorkerMessageHandledEvent`
   - CLI: `ConsoleEvents::TERMINATE`
3. In the installed code these three events are subscribed by `BufferedFlowExecutionTriggersListener`, which calls `BufferedFlowExecutor::executeBufferedFlows()` when the queue is not empty.

Enabling: the flag is declared in core `feature.yaml` with `default: false`, `major: true`, `toggleable: true`; set it like any feature flag (e.g. env var `FLOW_EXECUTION_AFTER_BUSINESS_PROCESS=1`). The code also activates the buffered path when `v6.8.0.0` is active.

Rejected alternative: handling flow executions as queue messages — simpler, but harder to debug and introduces an unpredictable delay, even with a high-priority queue.

## Essential identifiers

- `FLOW_EXECUTION_AFTER_BUSINESS_PROCESS` (feature flag)
- `Shopware\Core\Content\Flow\Dispatching\FlowDispatcher`
- `Shopware\Core\Content\Flow\Dispatching\BufferedFlowExecutionTriggersListener`
- `BufferedFlowQueue`, `BufferedFlowExecutor`
- `KernelEvents::TERMINATE`, `WorkerMessageHandledEvent`, `ConsoleEvents::TERMINATE`

## Gotchas

- Flows can no longer fail the business process — but code that expects flow side effects (e.g. a sent mail or a written entity) to exist right after dispatching the event will break.
- The interface for registering flows does not change.
- Total execution time is not expected to increase significantly; business-process performance is expected to improve.
- `BufferedFlowExecutionTriggersListener` is `@internal` — not intended for decoration or replacement.

## Version notes

The flag description in 6.7 says the behaviour "will become the default for next major 6.8"; the code already treats an active `v6.8.0.0` flag as enabling it.

## Code check (6.7.13.0)
- confirmed `FLOW_EXECUTION_AFTER_BUSINESS_PROCESS` — declared default false, major, toggleable — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:34
- confirmed `FlowDispatcher::dispatch()` — queues buffered flow when flag or v6.8.0.0 active — vendor/shopware/core/Content/Flow/Dispatching/FlowDispatcher.php:41
- confirmed `BufferedFlowQueue::queueFlow()` — called from FlowDispatcher in buffered path — vendor/shopware/core/Content/Flow/Dispatching/FlowDispatcher.php:60
- confirmed `KernelEvents::TERMINATE` — web trigger for buffered flows — vendor/shopware/core/Content/Flow/Dispatching/BufferedFlowExecutionTriggersListener.php:36
- confirmed `WorkerMessageHandledEvent` — queue trigger for buffered flows — vendor/shopware/core/Content/Flow/Dispatching/BufferedFlowExecutionTriggersListener.php:37
- confirmed `ConsoleEvents::TERMINATE` — CLI trigger for buffered flows — vendor/shopware/core/Content/Flow/Dispatching/BufferedFlowExecutionTriggersListener.php:38
- confirmed `BufferedFlowExecutor::executeBufferedFlows()` — invoked when queue not empty — vendor/shopware/core/Content/Flow/Dispatching/BufferedFlowExecutionTriggersListener.php:48
