---
id: platform/dev/6.7/guides/plugins/plugins/checkout/payment/add-payment-plugin.md
title: Add Payment Plugin
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/payment/add-payment-plugin.html
sourceHash: eb5eae986d5cab5660b6f0072e99a873892d93e0
codeCheckedAgainst: "6.7.13.0"
keywords: ["AbstractPaymentHandler", "shopware.payment.method", "PaymentHandlerType", "PaymentTransactionStruct", "PaymentException", "OrderTransactionStateHandler", "technicalName", "handlerIdentifier", "formattedHandlerIdentifier", "payment_method.repository", "payment handler", "psp", "refund", "recurring payment", "async payment redirect"]
summary: Shopware 6.7 payment plugin - extend AbstractPaymentHandler (supports, pay), tag shopware.payment.method, create the payment method with technicalName.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md"]
---
## What it is

How to add a payment method via a plugin in Shopware 6.7: one handler class extending `Shopware\Core\Checkout\Payment\Cart\PaymentHandler\AbstractPaymentHandler`, registered as a service, plus a `payment_method` entity pointing at it.

## When to use

When integrating a payment service provider (synchronous, redirect-based, prepared/headless, refund or recurring), or migrating a pre-6.7 payment plugin.

## Key steps / config

1. **Handler class.** Extend `AbstractPaymentHandler`. Abstract (required): `supports()`, `pay()`. Optional overrides: `validate()`, `finalize()`, `refund()`, `recurring()`.

```php
class MyCustomPaymentHandler extends AbstractPaymentHandler
{
    public function supports(PaymentHandlerType $type, string $paymentMethodId, Context $context): bool { /* ... */ }
    public function pay(Request $request, PaymentTransactionStruct $transaction, Context $context, ?Struct $validateStruct): ?RedirectResponse { /* ... */ }
    // optional: validate(Cart, RequestDataBag, SalesChannelContext): ?Struct
    // finalize(Request, PaymentTransactionStruct, Context): void
    // refund(RefundPaymentTransactionStruct, Context): void; recurring(PaymentTransactionStruct, Context): void
}
```

2. **Service** (`services.php`): `$services->set(MyCustomPaymentHandler::class)->tag('shopware.payment.method')->args([service(OrderTransactionStateHandler::class)]);`
3. **Variants:**
   - *Synchronous*: process in `pay`, set the state there (`$this->transactionStateHandler->process($transaction->getOrderTransactionId(), $context)`), return `null`; throw a `PaymentException` on failure (transaction becomes `failed`).
   - *Asynchronous*: `pay` sends `$transaction->getReturnUrl()` to the PSP and returns `new RedirectResponse($redirectUrl)` (errors: `PaymentException::asyncProcessInterrupted($orderTransactionId, $message)`); `finalize` runs after the redirect back — `PaymentException::customerCanceled(...)` on cancel, else e.g. `paid(...)`.
   - *Prepared*: `validate` runs before order creation; throw `PaymentException::validatePreparedPaymentInterrupted('...')` or return a struct (e.g. `ArrayStruct`), received as `$validateStruct` in `pay` (mismatch: `PaymentException::syncProcessInterrupted(...)`).
   - *Refund*: `supports` returns `$type === PaymentHandlerType::REFUND`; `refund` loads the refund from `order_transaction_capture_refund.repository` by `$transaction->getRefundId()`, throws `PaymentException::refundInterrupted(...)` on error, ends with `OrderTransactionCaptureRefundStateHandler::complete($refundId, $context)`.
   - *Recurring*: `supports` returns `$type === PaymentHandlerType::RECURRING`; `pay` does the initial charge (`$transaction->getRecurring()`), `recurring` captures later charges, `PaymentException::recurringInterrupted(...)` marks `failed`.
4. **Payment method** created in the plugin's `install()` via `payment_method.repository` (plugin id from `PluginIdProvider::getPluginIdByBaseClass()`):

```php
[
    'handlerIdentifier' => MyCustomPaymentHandler::class,
    'name' => '...', 'description' => '...',
    'pluginId' => $pluginId,
    'afterOrderEnabled' => true,
    'technicalName' => 'swag_example-example_payment',
]
```

   `uninstall()`/`deactivate()` set `active` false; `activate()` sets it true.
5. **Identify** it by `technicalName` or the runtime field `formattedHandlerIdentifier` (`Custom/Payment/SEPAPayment` becomes `handler_custom_sepapayment`, see `Shopware\Core\Checkout\Payment\DataAbstractionLayer\PaymentHandlerIdentifierSubscriber`).

## Essential identifiers

- `AbstractPaymentHandler`, `PaymentHandlerType` (`REFUND`, `RECURRING`)
- `Shopware\Core\Checkout\Payment\Cart\PaymentTransactionStruct`, `RefundPaymentTransactionStruct`
- `Shopware\Core\Checkout\Payment\PaymentException`
- `Shopware\Core\Checkout\Order\Aggregate\OrderTransaction\OrderTransactionStateHandler`
- `OrderTransactionCaptureRefundStateHandler`
- tag `shopware.payment.method`; `payment_method.repository`; fields `handlerIdentifier`, `technicalName`, `afterOrderEnabled`

## Gotchas

- `technicalName` is `Required` on the payment method definition; use a unique plugin-specific prefix, or install/activation can fail.
- Never delete the payment method on uninstall (orders reference it); deactivate it.
- `finalize` is only called when `pay` returns a `RedirectResponse`; `validate` is always called.
- Default `refund()`/`recurring()` throw `PaymentException::paymentHandlerTypeUnsupported`.
- Source inconsistencies: the refund `services.php` injects `OrderTransactionCaptureStateHandler` though the constructor expects `OrderTransactionCaptureRefundStateHandler`; `getPaymentMethodId()` filters on `ExamplePayment::class` instead of the handler class.
- Core also autoconfigures the `shopware.payment.method` tag for `AbstractPaymentHandler` subclasses.

## Version notes

- 6.7.0.0 replaced the `Shopware\Core\Checkout\Payment\Cart\PaymentHandler\PaymentHandlerInterface` family with `AbstractPaymentHandler`: `SynchronousPaymentHandlerInterface` maps to `pay`, `AsynchronousPaymentHandlerInterface` to `finalize`, `PreparedPaymentHandlerInterface` to `validate` (`capture` replaced by `pay`), `RecurringPaymentHandlerInterface` to `recurring`, `RefundPaymentHandlerInterface` to `refund` (the last two gated by `supports`). None exist in 6.7.13.0.
- Drop the tags `shopware.payment.method.sync`, `.async`, `.prepared`, `.recurring`, `.refund`; handlers now load order data themselves.

## Code check (6.7.13.0)
- absent `Shopware\Core\Checkout\Payment\Cart\PaymentHandler\PaymentHandlerInterface` — removed in 6.7; no match in installed code
- confirmed `AbstractPaymentHandler::supports()` — abstract — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:24
- confirmed `AbstractPaymentHandler::pay()` — abstract, returns `?RedirectResponse` — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:34
- confirmed `AbstractPaymentHandler::refund()` — default throws unsupported — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:71
- confirmed `shopware.payment.method` — autoconfigured tag — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:130
- confirmed `PaymentHandlerType::RECURRING` — enum case — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/PaymentHandlerType.php:10
- confirmed `technicalName` — `Required` flag — vendor/shopware/core/Checkout/Payment/PaymentMethodDefinition.php:79
- confirmed `PaymentException::validatePreparedPaymentInterrupted()` — message only — vendor/shopware/core/Checkout/Payment/PaymentException.php:292
- confirmed `OrderTransactionCaptureRefundStateHandler::complete()` — refund completion — vendor/shopware/core/Checkout/Order/Aggregate/OrderTransactionCaptureRefund/OrderTransactionCaptureRefundStateHandler.php:29
- confirmed `PaymentHandlerIdentifierSubscriber` — formatted identifier — vendor/shopware/core/Checkout/Payment/DataAbstractionLayer/PaymentHandlerIdentifierSubscriber.php:18
