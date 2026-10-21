---
id: platform/dev/6.7/guides/plugins/plugins/checkout/payment/add-payment-plugin.md
title: Add Payment Plugin
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/payment/add-payment-plugin.html
sourceHash: eb5eae986d5cab5660b6f0072e99a873892d93e0
codeCheckedAgainst: "6.7.15.1"
keywords: ["AbstractPaymentHandler", "shopware.payment.method", "PaymentHandlerType", "PaymentTransactionStruct", "PaymentException", "OrderTransactionStateHandler", "handlerIdentifier", "technicalName", "payment_method.repository", "formattedHandlerIdentifier", "payment handler", "refund", "recurring payment", "async payment", "psp"]
summary: Build a 6.7 payment handler extending AbstractPaymentHandler (pay/finalize/validate/refund/recurring), tag it and create the payment method.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md"]
---
## What it is

How a plugin adds a payment method in Shopware 6.7: one handler class extending `Shopware\Core\Checkout\Payment\Cart\PaymentHandler\AbstractPaymentHandler`, registered with the `shopware.payment.method` tag, plus a `payment_method` entity created on plugin install that points to the handler.

## When to use

Integrating a payment service provider (synchronous, redirect-based, prepared/headless, refund-capable or recurring), or migrating a pre-6.7 payment plugin.

## Key steps / config

1. Register the handler in the [DI container](platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md) with the tag (also auto-added for autoconfigured services extending the abstract class):

```php
$services->set(MyCustomPaymentHandler::class)
    ->tag('shopware.payment.method')
    ->args([service(OrderTransactionStateHandler::class)]);
```

2. Extend the abstract class. `supports()` and `pay()` are abstract; `validate()`, `finalize()`, `refund()`, `recurring()` are optional overrides:

```php
class MyCustomPaymentHandler extends AbstractPaymentHandler
{
    public function supports(PaymentHandlerType $type, string $paymentMethodId, Context $context): bool { /* ... */ }
    public function pay(Request $request, PaymentTransactionStruct $transaction, Context $context, ?Struct $validateStruct): ?RedirectResponse { /* ... */ }
    // optional: validate(Cart, RequestDataBag, SalesChannelContext): ?Struct
    // optional: finalize(Request, PaymentTransactionStruct, Context): void
    // optional: refund(RefundPaymentTransactionStruct, Context): void
    // optional: recurring(PaymentTransactionStruct, Context): void
}
```

3. Variants:
   - **Synchronous**: `pay()` returns `null` and sets the state itself, e.g. `$this->transactionStateHandler->process($transaction->getOrderTransactionId(), $context)`. Throw a `PaymentException` on failure; the transaction goes to `failed`.
   - **Asynchronous**: `pay()` sends `$transaction->getReturnUrl()` to the provider and returns a `RedirectResponse` (`PaymentException::asyncProcessInterrupted(...)` on gateway errors); `finalize()` runs after the redirect back — throw `PaymentException::customerCanceled(...)` on cancel, else set `paid`.
   - **Prepared**: `validate()` runs before order creation; throw `PaymentException::validatePreparedPaymentInterrupted(...)` or return a struct (e.g. `ArrayStruct`) that arrives in `pay()` as `$validateStruct`; fail there with `PaymentException::syncProcessInterrupted(...)`.
   - **Refund**: `supports()` returns `true` for `PaymentHandlerType::REFUND`; `refund()` reads `$transaction->getRefundId()`, iterates refund positions, throws `PaymentException::refundInterrupted(...)` on error, and ends with `OrderTransactionCaptureRefundStateHandler::complete()`. Inject `service('order_transaction_capture_refund.repository')`, `OrderTransactionStateHandler`, `OrderTransactionCaptureRefundStateHandler`.
   - **Recurring**: `supports()` returns `true` for `PaymentHandlerType::RECURRING`; `pay()` sets up the billing agreement on the initial checkout (`$transaction->getRecurring()`), `recurring()` captures later charges; `PaymentException::recurringInterrupted(...)` sets `failed`.
4. Create the payment method in `install()` via `payment_method.repository`:

```php
[
    'handlerIdentifier' => MyCustomPaymentHandler::class,
    'name' => '...', 'description' => '...',
    'pluginId' => $pluginId,            // PluginIdProvider::getPluginIdByBaseClass()
    'afterOrderEnabled' => true,
    'technicalName' => 'swag_example-example_payment',
]
```

5. In `uninstall()` only set `active` to `false`; toggle `active` in `activate()`/`deactivate()`.
6. Identify the method by `technicalName` or the runtime field `formattedHandlerIdentifier` (`Custom/Payment/SEPAPayment` becomes `handler_custom_sepapayment`; see `Shopware\Core\Checkout\Payment\DataAbstractionLayer\PaymentHandlerIdentifierSubscriber`).

## Essential identifiers

- `AbstractPaymentHandler`, `PaymentHandlerType` (`REFUND`, `RECURRING`), `PaymentTransactionStruct`, `RefundPaymentTransactionStruct` (namespace `Shopware\Core\Checkout\Payment\Cart\...`)
- `Shopware\Core\Checkout\Payment\PaymentException`
- `Shopware\Core\Checkout\Order\Aggregate\OrderTransaction\OrderTransactionStateHandler`
- tag `shopware.payment.method`; repository `payment_method.repository`

## Gotchas

- `technicalName` is required in 6.7; keep it unique with a plugin prefix. Omitting it can block install/activation.
- Never delete the payment method on uninstall — orders may reference it; deactivate instead.
- The source's refund `services.php` wires `OrderTransactionCaptureStateHandler`, but the constructor expects `OrderTransactionCaptureRefundStateHandler`.
- The source's `getPaymentMethodId()` filters `handlerIdentifier` by `ExamplePayment` instead of the handler class written on install; use the same class.
- `finalize()` is only called if `pay()` returns a `RedirectResponse`; `validate()` is always called. Default `refund()`/`recurring()` throw `PaymentException::paymentHandlerTypeUnsupported`.

## Version notes

- 6.7.0.0 replaced the `PaymentHandlerInterface` family (`SynchronousPaymentHandlerInterface`, `AsynchronousPaymentHandlerInterface`, `PreparedPaymentHandlerInterface`, `RecurringPaymentHandlerInterface`, `RefundPaymentHandlerInterface`) with the single abstract class: sync maps to `pay`, async to `finalize`, prepared to `validate`, recurring/refund to `recurring`/`refund` plus the matching `PaymentHandlerType` in `supports`.
- Remove the old tags `shopware.payment.method.sync`, `.async`, `.prepared`, `.recurring`, `.refund`.
- Prepared payments: the former `capture` method is replaced by `pay`.

## Code check (6.7.15.1)
- absent `Shopware\Core\Checkout\Payment\Cart\PaymentHandler\PaymentHandlerInterface` — removed in 6.7; old sub-interfaces and `shopware.payment.method.*` tags also not found
- confirmed `AbstractPaymentHandler::supports()` — abstract, must be declared — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:24
- confirmed `AbstractPaymentHandler::pay()` — abstract, returns `?RedirectResponse` — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:34
- confirmed `AbstractPaymentHandler::refund()` — default throws unsupported — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:71
- confirmed `shopware.payment.method` — autoconfigured for AbstractPaymentHandler — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:131
- confirmed `PaymentHandlerType` — enum cases RECURRING, REFUND — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/PaymentHandlerType.php:8
- confirmed `PaymentTransactionStruct::getReturnUrl()` — nullable return URL — vendor/shopware/core/Checkout/Payment/Cart/PaymentTransactionStruct.php:27
- confirmed `PaymentException::validatePreparedPaymentInterrupted()` — takes message only — vendor/shopware/core/Checkout/Payment/PaymentException.php:292
- confirmed `technicalName` — StringField flagged Required — vendor/shopware/core/Checkout/Payment/PaymentMethodDefinition.php:82
- corrected `OrderTransactionCaptureRefundStateHandler::complete()` — docs: services.php injects OrderTransactionCaptureStateHandler — vendor/shopware/core/Checkout/Order/Aggregate/OrderTransactionCaptureRefund/OrderTransactionCaptureRefundStateHandler.php:29
