---
id: platform/dev/6.7/resources/references/adr/2024-02-11-transactional-flow-actions.md
title: Introduce transactional flow actions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2024-02-11-transactional-flow-actions.html
sourceHash: 20a1687610407342583df2456d32ffb6bd5b9d5d
codeCheckedAgainst: "6.7.15.1"
keywords: ["TransactionalAction", "TransactionFailedException", "TransactionFailedException::because", "FlowAction", "FlowExecutor", "DelayableAction", "handleFlow", "RetryableTransaction", "flow action transaction", "database transaction", "rollback", "flow builder"]
summary: "ADR: flow actions implementing the TransactionalAction marker interface run inside a DB transaction; throw TransactionFailedException to roll back."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record that introduces the marker interface `\Shopware\Core\Content\Flow\Dispatching\TransactionalAction`. The flow executor runs any flow action that implements it inside a database transaction, so the action no longer starts, commits or rolls back transactions itself.

## When to use

Use it when a custom flow action writes to the database and those writes must succeed or fail together. Before this ADR, actions managed transactions by hand. If a commit failed, the flow dispatcher caught the error and logged a vague message, and the flows kept running. When a transaction was already open before the flow ran, a failed nested commit marked the connection as rollback-only. Shopware's default connection has no save points, so the outer commit failed later without knowing why.

## Key steps / config

1. Extend `FlowAction` and also implement `TransactionalAction`. The interface has no methods. `FlowAction` requires `requirements()`, `handleFlow()` and the static `getName()`:

```php
class SetOrderStateAction extends FlowAction implements DelayableAction, TransactionalAction
{
    public static function getName(): string { /* ... */ }
    public function requirements(): array { /* ... */ }
    public function handleFlow(StorableFlow $flow): void
    {
        // do stuff - wrapped in a transaction by the executor
    }
}
```

2. Remove manual `beginTransaction()` / `commit()` calls from `handleFlow()`.
3. To force a rollback, throw `\Shopware\Core\Content\Flow\Dispatching\TransactionFailedException`. Its static `because(\Throwable $e)` builds it from another exception, for example `throw TransactionFailedException::because($e);` inside a `catch (NotFoundException $e)` block.

In the installed code, `FlowExecutor` checks `$action instanceof TransactionalAction` and calls `handleFlow()` through `RetryableTransaction::transactional($this->connection, ...)`. Any `\Throwable` thrown inside is wrapped with `FlowException::transactionFailed($e)` and rethrown. A `TransactionFailedException` becomes the error code `FLOW_ACTION_TRANSACTION_ABORTED` ("transaction was aborted and rolled back").

## Essential identifiers

- `\Shopware\Core\Content\Flow\Dispatching\TransactionalAction`: marker interface
- `\Shopware\Core\Content\Flow\Dispatching\TransactionFailedException`, `TransactionFailedException::because()`
- `Shopware\Core\Content\Flow\Dispatching\Action\FlowAction`: base class (`requirements`, `handleFlow`, `getName`)
- `FlowExecutor`, `FlowException::transactionFailed()`
- `RetryableTransaction::transactional()`

## Gotchas

- The ADR says the transaction is rolled back when Doctrine throws a `Doctrine\DBAL\Exception` during commit, when the action throws `TransactionFailedException`, or when the action throws any other unhandled exception (to help debugging).
- The ADR also says a failure inside a nested transaction without save points is rethrown, so the calling code can roll back. Once that happens, other scheduled actions do not run. In 6.7.15.1, `RetryableTransaction::transactional()` rethrows when it was entered at a nesting level above 0. However, `FlowExecutor::executeFlows()` catches every `\Throwable` per flow and logs "Could not execute flow". The failing flow stops and the next flow still runs. Only the direct `FlowExecutor::execute()` path lets the exception reach the caller.
- The ADR's examples use `SetOrderStateAction`. In 6.7.15.1 the core `SetOrderStateAction` implements `TransactionalAction` itself.

## Code check (6.7.15.1)
- confirmed `TransactionalAction` — empty marker interface — vendor/shopware/core/Content/Flow/Dispatching/TransactionalAction.php:11
- confirmed `TransactionFailedException::because()` — static factory taking a `\Throwable` — vendor/shopware/core/Content/Flow/Dispatching/TransactionFailedException.php:14
- confirmed `FlowAction::requirements()` — abstract member — vendor/shopware/core/Content/Flow/Dispatching/Action/FlowAction.php:14
- confirmed `FlowAction::handleFlow()` — abstract member — vendor/shopware/core/Content/Flow/Dispatching/Action/FlowAction.php:16
- confirmed `FlowAction::getName()` — abstract static member — vendor/shopware/core/Content/Flow/Dispatching/Action/FlowAction.php:18
- confirmed `TransactionalAction` — executor wraps only implementing actions in a transaction — vendor/shopware/core/Content/Flow/Dispatching/FlowExecutor.php:224
- confirmed `RetryableTransaction::transactional()` — used to wrap `handleFlow()` — vendor/shopware/core/Content/Flow/Dispatching/FlowExecutor.php:231
- confirmed `FlowException::transactionFailed()` — wraps any throwable from a transactional action — vendor/shopware/core/Content/Flow/FlowException.php:51
- corrected `FlowExecutor::executeFlows()` — docs: exception rethrown to caller, scheduled actions not executed; code catches, logs per flow and continues — vendor/shopware/core/Content/Flow/Dispatching/FlowExecutor.php:68
- confirmed `SetOrderStateAction` — core action implements `TransactionalAction` — vendor/shopware/core/Content/Flow/Dispatching/Action/SetOrderStateAction.php:26
