---
id: platform/dev/6.7/guides/plugins/plugins/framework/flow/action-transactions.md
title: Running Actions Inside Transactions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/flow/action-transactions.html
sourceHash: 15f1a8ecce0d423fe7828eebd592931aa49e7a59
codeCheckedAgainst: "6.7.13.0"
keywords: ["TransactionalAction", "Shopware\\Core\\Content\\Flow\\Dispatching\\TransactionalAction", "TransactionFailedException", "TransactionFailedException::because", "FlowAction", "FlowExecutor", "flow action transaction", "database transaction", "rollback", "flow builder", "Doctrine\\DBAL\\Exception", "RetryableTransaction"]
summary: "Implement the TransactionalAction marker interface on a FlowAction to run handleFlow in a DB transaction; throw TransactionFailedException to roll back."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/flow/add-flow-builder-action.md", "platform/dev/6.7/resources/references/adr/2024-02-11-transactional-flow-actions.md"]
---
## What it is

Opt-in mechanism that makes the flow dispatcher run a custom flow action's `handleFlow()` inside a database transaction, so failures roll back. Background: ADR [Action Transactions](platform/dev/6.7/resources/references/adr/2024-02-11-transactional-flow-actions.md).

## When to use

You already have a flow action (see [Add Flow Builder Action](platform/dev/6.7/guides/plugins/plugins/framework/flow/add-flow-builder-action.md)) whose writes must be all-or-nothing, and you want rollbacks handled for you.

## Key steps / config

1. Implement the marker interface `Shopware\Core\Content\Flow\Dispatching\TransactionalAction` on the action. It has no methods; the action still declares all `FlowAction` abstract members:

```php
use Shopware\Core\Content\Flow\Dispatching\Action\FlowAction;
use Shopware\Core\Content\Flow\Dispatching\StorableFlow;
use Shopware\Core\Content\Flow\Dispatching\TransactionalAction;

class CreateTagAction extends FlowAction implements TransactionalAction
{
    public static function getName(): string { return 'action.create.tag'; }
    public function requirements(): array { return [/* ... */]; }
    public function handleFlow(StorableFlow $flow): void { /* runs in a transaction */ }
}
```

2. To force a rollback, throw `\Shopware\Core\Content\Flow\Dispatching\TransactionFailedException`, typically built from another exception with the static `because()`:

```php
try {
    $entity = $this->repo->find(/* ... */);
} catch (NotFoundException $e) {
    throw TransactionFailedException::because($e);
}
```

### When the transaction is rolled back

In the installed `FlowExecutor`, a `TransactionalAction` runs via `RetryableTransaction::transactional()`; any `\Throwable` rolls back and is rethrown as a `FlowException` whose error code tells the cause:

| Cause | Error code |
|---|---|
| action threw `TransactionFailedException` | `FLOW_ACTION_TRANSACTION_ABORTED` |
| Doctrine threw `Doctrine\DBAL\Exception` (e.g. on commit) | `FLOW_ACTION_TRANSACTION_COMMIT_FAILED` |
| any other uncaught exception | `FLOW_ACTION_TRANSACTION_UNCAUGHT_EXCEPTION` |

When flows run through `FlowExecutor::executeFlows()`, that exception is caught and logged as an error ("Could not execute flow ..."), and the remaining flows continue.

## Essential identifiers

- `Shopware\Core\Content\Flow\Dispatching\TransactionalAction`
- `Shopware\Core\Content\Flow\Dispatching\TransactionFailedException` / `TransactionFailedException::because()`
- `Shopware\Core\Content\Flow\Dispatching\Action\FlowAction`
- `Shopware\Core\Content\Flow\FlowException`

## Gotchas

- The source's snippets only declare `handleFlow()`; `FlowAction` also has abstract `requirements()` and static `getName()`, so those snippets do not compile as-is.
- Actions not implementing the interface run without a wrapping transaction.
- Nested transactions: if the action runs inside an outer transaction (Shopware's default is no save points), the docs say the exception is rethrown and the connection is marked rollback-only so the caller rolls back instead of committing. In code, `RetryableTransaction::transactional()` rethrows at any nesting level; at nesting level 0 it first resets the connection's nesting state.

## Code check (6.7.13.0)
- confirmed `TransactionalAction` — marker interface without methods — vendor/shopware/core/Content/Flow/Dispatching/TransactionalAction.php:11
- confirmed `TransactionFailedException::because()` — static factory wrapping a Throwable — vendor/shopware/core/Content/Flow/Dispatching/TransactionFailedException.php:14
- confirmed `FlowAction::requirements()` — abstract, must be declared — vendor/shopware/core/Content/Flow/Dispatching/Action/FlowAction.php:14
- confirmed `FlowAction::getName()` — abstract static, must be declared — vendor/shopware/core/Content/Flow/Dispatching/Action/FlowAction.php:18
- confirmed `FlowExecutor::callHandle()` — non-transactional actions call handleFlow directly — vendor/shopware/core/Content/Flow/Dispatching/FlowExecutor.php:194
- confirmed `RetryableTransaction::transactional()` — wraps transactional actions — vendor/shopware/core/Content/Flow/Dispatching/FlowExecutor.php:223
- corrected `FlowException::transactionFailed()` — docs: exception caught in the transaction wrapper and logged; code rethrows as FlowException — vendor/shopware/core/Content/Flow/Dispatching/FlowExecutor.php:227
- confirmed `DBALException` — Doctrine\DBAL\Exception maps to FLOW_ACTION_TRANSACTION_COMMIT_FAILED — vendor/shopware/core/Content/Flow/FlowException.php:62
- confirmed `FlowExecutor::executeFlows()` — catches and logs flow execution errors — vendor/shopware/core/Content/Flow/Dispatching/FlowExecutor.php:66
- unverified `rollback only` — Doctrine DBAL connection behaviour, vendor/doctrine out of scope
