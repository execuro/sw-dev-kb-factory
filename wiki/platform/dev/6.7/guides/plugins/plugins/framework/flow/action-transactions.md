---
id: platform/dev/6.7/guides/plugins/plugins/framework/flow/action-transactions.md
title: Running Actions Inside Transactions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/flow/action-transactions.html
sourceHash: 15f1a8ecce0d423fe7828eebd592931aa49e7a59
codeCheckedAgainst: "6.7.15.1"
keywords: ["TransactionalAction", "TransactionFailedException", "TransactionFailedException::because", "FlowAction", "FlowExecutor", "RetryableTransaction", "FlowException::transactionFailed", "flow action transaction", "rollback", "database transaction", "flow builder", "Doctrine\\DBAL\\Exception"]
summary: "Opt a flow action into a DB transaction by implementing TransactionalAction; throw TransactionFailedException::because() to force a rollback."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/resources/references/adr/2024-02-11-transactional-flow-actions.md", "platform/dev/6.7/guides/plugins/plugins/framework/flow/add-flow-builder-action.md"]
---
## What it is

How to make a custom Flow Builder action run inside a database transaction so its writes are rolled back as a unit when something fails. The behaviour is opt-in per action via a marker interface. Background: the ADR [Action Transactions](platform/dev/6.7/resources/references/adr/2024-02-11-transactional-flow-actions.md).

## When to use

You have an existing flow action (see [Add Flow Builder Action](platform/dev/6.7/guides/plugins/plugins/framework/flow/add-flow-builder-action.md)) whose work must be atomic - e.g. several writes that must not be partially committed - or that needs to abort and roll back on a specific error.

## Key steps / config

1. Implement the marker interface `Shopware\Core\Content\Flow\Dispatching\TransactionalAction` on your action. It declares no methods. The flow executor then runs `handleFlow()` inside `RetryableTransaction::transactional()`.
2. To force a rollback, throw `\Shopware\Core\Content\Flow\Dispatching\TransactionFailedException`, built from another exception with the static `because()`:

```php
use Shopware\Core\Content\Flow\Dispatching\Action\FlowAction;
use Shopware\Core\Content\Flow\Dispatching\StorableFlow;
use Shopware\Core\Content\Flow\Dispatching\TransactionalAction;
use Shopware\Core\Content\Flow\Dispatching\TransactionFailedException;

class CreateTagAction extends FlowAction implements TransactionalAction
{
    public static function getName(): string { /* ... */ }
    public function requirements(): array { /* ... */ }

    public function handleFlow(StorableFlow $flow): void
    {
        try { /* search for some record */ }
        catch (NotFoundException $e) { throw TransactionFailedException::because($e); }
    }
}
```

The transaction is rolled back when:

1. Doctrine throws a `Doctrine\DBAL\Exception` during commit;
2. the action throws `TransactionFailedException`;
3. any other unhandled exception is thrown during the action.

## Essential identifiers

- `Shopware\Core\Content\Flow\Dispatching\TransactionalAction`
- `Shopware\Core\Content\Flow\Dispatching\TransactionFailedException` / `TransactionFailedException::because()`
- `Shopware\Core\Content\Flow\Dispatching\Action\FlowAction` (`getName()`, `requirements()`, `handleFlow()`)
- `Shopware\Core\Content\Flow\FlowException::transactionFailed()` - wraps the failure; error codes `FLOW_ACTION_TRANSACTION_ABORTED`, `FLOW_ACTION_TRANSACTION_COMMIT_FAILED`, `FLOW_ACTION_TRANSACTION_UNCAUGHT_EXCEPTION`

## Gotchas

- The source's snippets only show `handleFlow()`; `FlowAction` is abstract and also requires `getName()` and `requirements()` - a subclass without them does not compile.
- In the installed code the failure is not swallowed inside the action call: `FlowExecutor` catches the throwable and rethrows it as `FlowException::transactionFailed()`; the error is then logged ("Could not execute flow ...") in `FlowExecutor::executeFlows()`, and the remaining flows continue.
- If the transaction runs nested inside another transaction without save points (the Shopware default), the exception is rethrown so the caller can roll back; the connection is marked rollback-only.

## Code check (6.7.15.1)
- confirmed `TransactionalAction` — marker interface without methods — vendor/shopware/core/Content/Flow/Dispatching/TransactionalAction.php:11
- confirmed `TransactionFailedException::because()` — static factory wrapping the previous throwable — vendor/shopware/core/Content/Flow/Dispatching/TransactionFailedException.php:14
- confirmed `FlowAction::getName()` — abstract static, required in subclasses alongside `requirements()`/`handleFlow()` — vendor/shopware/core/Content/Flow/Dispatching/Action/FlowAction.php:18
- confirmed `RetryableTransaction::transactional()` — wraps `handleFlow()` of a `TransactionalAction` — vendor/shopware/core/Content/Flow/Dispatching/FlowExecutor.php:231
- corrected `FlowException::transactionFailed()` — docs: exception caught and logged by the dispatcher; executor rethrows it wrapped — vendor/shopware/core/Content/Flow/Dispatching/FlowExecutor.php:235
- confirmed `FLOW_ACTION_TRANSACTION_COMMIT_FAILED` — used for a `DBALException` during commit — vendor/shopware/core/Content/Flow/FlowException.php:63
- confirmed `FLOW_ACTION_TRANSACTION_ABORTED` — used for `TransactionFailedException` — vendor/shopware/core/Content/Flow/FlowException.php:56
- confirmed `FlowExecutor::executeFlows()` — logs the error per failed flow and continues — vendor/shopware/core/Content/Flow/Dispatching/FlowExecutor.php:68
- confirmed `getTransactionNestingLevel` — nested transactions are not retried — vendor/shopware/core/Framework/DataAbstractionLayer/Doctrine/RetryableTransaction.php:46
