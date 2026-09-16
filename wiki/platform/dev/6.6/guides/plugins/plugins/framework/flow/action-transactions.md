---
id: platform/dev/6.6/guides/plugins/plugins/framework/flow/action-transactions.md
title: Running actions inside transactions
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/flow/action-transactions.html
sourceHash: c916d5d5cef4c236f8f9246186c27b7ee16657a8
keywords: ["flow action transaction", "TransactionalAction", "TransactionFailedException", "flow dispatcher", "rollback", "handleFlow", "FlowAction", "StorableFlow", "database transaction"]
summary: "How to opt a custom Flow Action into running inside a DB transaction using TransactionalAction, and how to force a rollback."
lastBuilt: "2026-09-15"
---
## What it is
Explains how to run a custom Flow Builder action's code inside a database transaction so it can be rolled back gracefully on failure.

## When to use
Use when a Flow Action performs multiple related writes that should either all succeed or all roll back together.

## Key steps / config
1. Implement `Shopware\Core\Content\Flow\Dispatching\TransactionalAction` on the action class (it has no methods to implement) alongside `FlowAction`:
```php
class CreateTagAction extends FlowAction implements TransactionalAction
{
    public function handleFlow(StorableFlow $flow): void
    {
        //do stuff - will be wrapped in a transaction
    }
}
```
2. When the interface is implemented, the Flow Dispatcher wraps the action in a transaction; on an uncaught exception, it is caught, the transaction rolled back, and an error logged.
3. To force a rollback explicitly, throw `Shopware\Core\Content\Flow\Dispatching\TransactionFailedException`, using its static `because` method to wrap another exception:
```php
try {
    $entity = $this->repo->find(...);
} catch (NotFoundException $e) {
    throw TransactionFailedException::because($e);
}
```
4. The transaction rolls back if any of: Doctrine throws `Doctrine\DBAL\Exception` during commit; the action throws `TransactionFailedException`; or any other unhandled exception occurs during execution — an error is logged in all cases.

## Essential identifiers
- `Shopware\Core\Content\Flow\Dispatching\TransactionalAction`
- `Shopware\Core\Content\Flow\Dispatching\TransactionFailedException`
- `TransactionFailedException::because()`
- `FlowAction::handleFlow()`

## Gotchas
- If the transaction runs inside a nested transaction without save points enabled (Shopware's default), the exception is rethrown instead of only rolling back, and the connection is marked rollback-only — the calling code must handle it.
