---
id: platform/dev/6.6/resources/references/adr/2024-02-11-transactional-flow-actions.md
title: Introduce transactional flow actions
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2024-02-11-transactional-flow-actions.html"
sourceHash: 20a1687610407342583df2456d32ffb6bd5b9d5d
keywords: ["TransactionalAction", "TransactionFailedException", "flow action", "flow executor", "handleFlow", "database transaction", "DelayableAction", "Doctrine\\DBAL\\Exception", "flow dispatcher", "save points", "rollback only"]
summary: "ADR: flow actions implementing `TransactionalAction` are auto-wrapped in a DB transaction; throw `TransactionFailedException` to force rollback."
lastBuilt: 2026-09-15
---
## What it is
Architecture decision record introducing a marker interface that lets flow actions run inside a managed database transaction instead of manually starting/committing one and silently swallowing commit errors.

## When to use
Relevant when writing a custom flow action that must perform multiple database writes atomically, or that needs to force the whole flow's transaction to roll back on failure.

## Key steps / config
- Implement `\Shopware\Core\Content\Flow\Dispatching\TransactionalAction` on the flow action; the flow executor then wraps `handleFlow` in a database transaction automatically — no manual `beginTransaction`/`commit` needed.
- Throw `\Shopware\Core\Content\Flow\Dispatching\TransactionFailedException` (optionally built via its static `because` method from another exception) to force the transaction to roll back.

```php
class SetOrderStateAction extends FlowAction implements DelayableAction, TransactionalAction
{
    public function handleFlow(StorableFlow $flow): void
    {
        //do stuff - will be wrapped in a transaction
    }
}
```

The transaction rolls back if: Doctrine throws `Doctrine\DBAL\Exception` during commit, the action throws `TransactionFailedException`, or any other unhandled exception is thrown during execution.

## Essential identifiers
- `\Shopware\Core\Content\Flow\Dispatching\TransactionalAction`
- `\Shopware\Core\Content\Flow\Dispatching\TransactionFailedException`
- `TransactionFailedException::because`

## Gotchas
If Shopware's DB connection is configured without save points (the default), a failed nested commit marks the connection rollback-only; the outer commit then fails unaware of the earlier failure. When a transactional flow action fails inside a nested transaction without save points, the exception is rethrown so the calling code can roll back instead of committing, and any other scheduled actions will not execute.
