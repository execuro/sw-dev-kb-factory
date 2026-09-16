---
id: platform/dev/6.7/resources/references/adr/2024-02-11-transactional-flow-actions.md
title: Introduce transactional flow actions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2024-02-11-transactional-flow-actions.html
sourceHash: 20a1687610407342583df2456d32ffb6bd5b9d5d
codeCheckedAgainst: "6.7.13.0"
keywords: ["TransactionalAction", "TransactionFailedException", "FlowAction", "FlowExecutor", "DelayableAction", "handleFlow", "flow action", "flow builder", "database transaction", "rollback", "savepoints", "FlowException"]
summary: "ADR: flow actions implementing TransactionalAction run inside a DB transaction; throw TransactionFailedException::because() to force a rollback."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (Core, 2024-02): the marker interface `\Shopware\Core\Content\Flow\Dispatching\TransactionalAction` makes the flow executor wrap a flow action's execution in a database transaction, so actions no longer begin/commit transactions themselves.

## When to use

- Writing a custom flow action whose database writes must be atomic.
- Debugging failing outer transactions after a flow action commit failed.

## Key steps / config

1. Extend `FlowAction` and additionally implement `TransactionalAction` (an empty marker interface) — nothing else is required. Do not call `beginTransaction()`/`commit()` in the action.

```php
class SetOrderStateAction extends FlowAction implements DelayableAction, TransactionalAction
{
    public static function getName(): string { /* ... */ }
    public function requirements(): array { /* ... */ }
    public function handleFlow(StorableFlow $flow): void
    {
        // wrapped in a transaction by the flow executor
    }
}
```

2. To force a rollback, throw `\Shopware\Core\Content\Flow\Dispatching\TransactionFailedException`, built from another exception with the static `because()`:

```php
} catch (NotFoundException $e) {
    throw TransactionFailedException::because($e);
}
```

3. `FlowExecutor` runs non-transactional actions directly; transactional ones go through `RetryableTransaction::transactional($this->connection, ...)`. Any `\Throwable` is converted via `FlowException::transactionFailed()` into a distinct error for a `TransactionFailedException`, a Doctrine DBAL exception on commit, or any other uncaught exception.

## Essential identifiers

- `Shopware\Core\Content\Flow\Dispatching\TransactionalAction`
- `Shopware\Core\Content\Flow\Dispatching\TransactionFailedException::because()`
- `Shopware\Core\Content\Flow\Dispatching\Action\FlowAction` (`getName`, `requirements`, `handleFlow`)
- `Shopware\Core\Content\Flow\Dispatching\FlowExecutor`
- `Shopware\Core\Content\Flow\FlowException::transactionFailed()`

## Gotchas

- Rollback happens when Doctrine throws `Doctrine\DBAL\Exception` during commit, when the action throws `TransactionFailedException`, or when any other unhandled exception is thrown in the action.
- Background: Shopware connections default to no savepoints, so a failed nested commit marks the connection rollback-only and the outer commit also fails. Per the ADR, a failed transaction is logged and, inside a nested transaction without savepoints, the exception is rethrown so calling code can roll back — then remaining scheduled actions are not executed.
- Without the interface, commit errors in an action are caught by the flow dispatcher, logged vaguely, and flows continue.

## Code check (6.7.13.0)
- confirmed `TransactionalAction` — empty marker interface — vendor/shopware/core/Content/Flow/Dispatching/TransactionalAction.php:11
- confirmed `TransactionFailedException::because()` — static factory wrapping a `\Throwable` — vendor/shopware/core/Content/Flow/Dispatching/TransactionFailedException.php:14
- confirmed `FlowAction::requirements()` — abstract, required in subclasses — vendor/shopware/core/Content/Flow/Dispatching/Action/FlowAction.php:14
- confirmed `FlowAction::handleFlow()` — abstract, required in subclasses — vendor/shopware/core/Content/Flow/Dispatching/Action/FlowAction.php:16
- confirmed `FlowAction::getName()` — abstract static, required in subclasses — vendor/shopware/core/Content/Flow/Dispatching/Action/FlowAction.php:18
- confirmed `FlowExecutor` — only `TransactionalAction` instances are wrapped in `RetryableTransaction::transactional` — vendor/shopware/core/Content/Flow/Dispatching/FlowExecutor.php:40
- confirmed `FlowException::transactionFailed()` — maps TransactionFailedException, DBAL exception and other throwables — vendor/shopware/core/Content/Flow/FlowException.php:52
- confirmed `SetOrderStateAction` — core action implements `DelayableAction, TransactionalAction` — vendor/shopware/core/Content/Flow/Dispatching/Action/SetOrderStateAction.php:26
- unverified `rethrow in nested transaction without savepoints` — no savepoint/nesting-level check found under Content/Flow; behaviour likely inside `RetryableTransaction`, not read
