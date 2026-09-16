---
id: platform/dev/6.6/guides/plugins/plugins/checkout/payment/add-payment-plugin.md
title: Add payment plugin
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/checkout/payment/add-payment-plugin.html
sourceHash: 725713241a0146725c69a497964cfc6f3e22c0cb
keywords: ["payment handler", "payment plugin", "SynchronousPaymentHandlerInterface", "AsynchronousPaymentHandlerInterface", "PreparedPaymentHandlerInterface", "RefundPaymentHandlerInterface", "RecurringPaymentHandlerInterface", "shopware.payment.method.sync", "shopware.payment.method.async", "OrderTransactionStateHandler", "PaymentException", "handlerIdentifier", "formattedHandlerIdentifier", "payment_method.repository", "psp"]
summary: "Shopware 6.6 payment handlers: sync/async/prepared/refund/recurring interfaces, DI tags, required methods, creating the payment method on install."
lastBuilt: 2026-09-15
---
## What it is

The 6.6 guide for building a payment plugin: a payment handler service implementing one of the legacy payment handler interfaces, tagged in the DI container, plus a payment method entity created by the plugin that points to the handler.

## When to use

When writing or maintaining a payment integration for Shopware 6.6 (pre-6.7 payment handling). With 6.6.5.0 payment handling was refactored; most of this approach is deprecated and obsolete with 6.7.0.0, where a single `AbstractPaymentHandler` is used instead.

## Key steps / config

1. **Pick an interface** (namespace `Shopware\Core\Checkout\Payment\Cart\PaymentHandler\`) and its DI tag:

| Interface | DI tag | Usage |
|---|---|---|
| `SynchronousPaymentHandlerInterface` | `shopware.payment.method.sync` | handled locally, e.g. pre-payment |
| `AsynchronousPaymentHandlerInterface` | `shopware.payment.method.async` | redirect to external provider, e.g. PayPal |
| `PreparedPaymentHandlerInterface` | `shopware.payment.method.prepared` | payment prepared beforehand, validated and captured by the handler |
| `RefundPaymentHandlerInterface` | `shopware.payment.method.refund` | refund handling |
| `RecurringPaymentHandlerInterface` | `shopware.payment.method.recurring` | recurring payments, e.g. subscriptions |

2. **Implement the required methods:**
   - `pay(SyncPaymentTransactionStruct|AsyncPaymentTransactionStruct $transaction, RequestDataBag $dataBag, SalesChannelContext $salesChannelContext)` — called after the order is placed. Use the transaction amount, not the order total (multiple transactions are supported). Async handlers return a `RedirectResponse`; the return URL comes from `$transaction->getReturnUrl()`. Sync handlers set the transaction state directly (e.g. `paid`).
   - `finalize(AsyncPaymentTransactionStruct $transaction, Request $request, SalesChannelContext $salesChannelContext)` — async only, after the customer returns; check result and call `paid()` or `reopen()` on the state handler.
   - `validate(Cart $cart, RequestDataBag $requestDataBag, SalesChannelContext $context): Struct` — prepared only, before the order is placed; the returned struct is passed as `$preOrderPaymentStruct` to `capture`.
   - `capture(PreparedPaymentTransactionStruct $transaction, RequestDataBag $requestDataBag, SalesChannelContext $context, Struct $preOrderPaymentStruct)` — after the order is placed; set state to `paid`.
   - `refund(OrderTransactionCaptureRefundEntity $refund, Context $context)` — iterate `$refund->getPositions()`, call the PSP, then `OrderTransactionCaptureRefundStateHandler::complete()`.
   - `captureRecurring(RecurringPaymentTransactionStruct $transaction, Context $context)` — charges a recurring payment against an existing billing agreement.

3. **Register the service** in `<plugin root>/src/Resources/config/services.xml` (standard Symfony `services-1.0.xsd` container):

```xml
<services>
    <service id="Swag\PaymentPlugin\Service\ExamplePayment">
        <argument type="service" id="Shopware\Core\Checkout\Order\Aggregate\OrderTransaction\OrderTransactionStateHandler"/>
        <tag name="shopware.payment.method.sync" />
    </service>
</services>
```

4. **Create the payment method** in the plugin's `install()` via `payment_method.repository`, looking up the plugin id with `PluginIdProvider::getPluginIdByBaseClass()`:

```php
[
    'handlerIdentifier' => ExamplePayment::class,
    'name' => '...',
    'description' => '...',
    'pluginId' => $pluginId,
    'afterOrderEnabled' => true, // usable after order creation, e.g. retry
]
```

Set `active` to true/false in `activate()`/`deactivate()` and only deactivate in `uninstall()`. Find the existing id with `new EqualsFilter('handlerIdentifier', ExamplePayment::class)`.

## Essential identifiers

- `Shopware\Core\Checkout\Payment\Cart\SyncPaymentTransactionStruct`, `Shopware\Core\Checkout\Payment\Cart\AsyncPaymentTransactionStruct`, `PreparedPaymentTransactionStruct`, `RecurringPaymentTransactionStruct`
- `Shopware\Core\Checkout\Order\Aggregate\OrderTransaction\OrderTransactionStateHandler` (`paid`, `reopen`, `fail`)
- `Shopware\Core\Checkout\Payment\PaymentException` factories: `asyncProcess`, `asyncCustomerCanceled`, `preparedValidate`, `preparedCapture`, `refund`, `recurringInterrupted`
- Exceptions: `AsyncPaymentProcessException`, `SyncPaymentProcessException`, `CustomerCanceledAsyncPaymentException`, `AsyncPaymentFinalizeException`, `ValidatePreparedPaymentException`, `CapturePreparedPaymentException`, `RefundException`, `RecurringPaymentProcessException`
- `\Shopware\Core\System\SalesChannel\SalesChannelContext`
- `formattedHandlerIdentifier`; `Shopware\Core\Checkout\Payment\DataAbstractionLayer\PaymentHandlerIdentifierSubscriber`

## Gotchas

- Process/finalize exceptions set the transaction to `cancelled`; a failed capture activates the after-order process so the customer can pay again; a refund exception sets the refund state to `failed`.
- `SalesChannelContext` is injected into every handler method except `captureRecurring`, and it has nullable properties — check for `NULL`.
- Prepared payments: Shopware cannot ensure the frontend-created transaction is valid for the cart, so `validate` must verify the payload with the payment service.
- Never delete the payment method on uninstall — orders may reference it; deactivate instead.
- `formattedHandlerIdentifier` shortens the handler class, e.g. `Custom/Payment/SEPAPayment` becomes `handler_custom_sepapayment`.
- Recurring payments require the commercial Subscriptions feature.

## Version notes

- 6.6.5.0 refactored payment handling; these interfaces are deprecated and obsolete in 6.7.0.0, replaced by `AbstractPaymentHandler`.
