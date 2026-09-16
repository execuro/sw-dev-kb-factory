---
id: platform/dev/6.7/guides/plugins/plugins/checkout/payment/customize-payment-provider.md
title: Customize Payment Provider
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/payment/customize-payment-provider.html
sourceHash: ab6f07bd4e2d80ebd68f6d9b6a4114dec552b535
codeCheckedAgainst: "6.7.13.0"
keywords: ["customize payment provider", "decorate payment handler", "AbstractPaymentHandler", "PaymentTransactionStruct", "OrderTransactionStateHandler", "DefaultPayment", "InvoicePayment", "services.php", ".inner", "decorate", "shopware.payment.method", "payment method", "service decoration"]
summary: Customizing an existing Shopware 6.7 payment handler by decorating its service with an AbstractPaymentHandler subclass registered in services.php.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md"]
---
## What it is

How to change the behaviour of an existing payment provider (payment handler) without replacing it: create a class that wraps the original handler service and register it as a Symfony service decorator. The docs use a synchronous flow as the example; the same procedure applies to handlers that redirect (asynchronous flow).

## When to use

You need custom logic before or after an existing handler's `pay()` step (or other handler steps) while keeping the original payment method and its handler identifier. Service decoration basics: [adjusting a service](platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md).

## Key steps / config

1. Create a class extending `Shopware\Core\Checkout\Payment\Cart\PaymentHandler\AbstractPaymentHandler`. In 6.7 it declares two abstract methods, `supports()` and `pay()`; `validate()`, `finalize()`, `refund()` and `recurring()` have default implementations. The built-in handlers (`DefaultPayment`, `InvoicePayment`, `PrePayment`, `CashPayment`) are `@internal` and `DefaultPayment` has no constructor, so wrap the inner service instead of calling a parent constructor.
2. Inject `OrderTransactionStateHandler` if you change transaction state; its methods take a transaction id string and a `Context`.
3. Register the class as a decorator in `services.php` with `service('.inner')` as the decorated handler.

```php
class ExamplePayment extends AbstractPaymentHandler
{
    public function __construct(private readonly OrderTransactionStateHandler $transactionStateHandler, private readonly AbstractPaymentHandler $decorated) {}

    public function supports(PaymentHandlerType $type, string $paymentMethodId, Context $context): bool
    { return $this->decorated->supports($type, $paymentMethodId, $context); }

    public function pay(Request $request, PaymentTransactionStruct $transaction, Context $context, ?Struct $validateStruct): ?RedirectResponse
    { /* custom stuff */ $this->transactionStateHandler->process($transaction->getOrderTransactionId(), $context); return $this->decorated->pay($request, $transaction, $context, $validateStruct); }
}
```

```php
$services->set(ExamplePayment::class)
    ->decorate(InvoicePayment::class) // the handler service id to customize
    ->args([service(OrderTransactionStateHandler::class), service('.inner')]);
```

## Essential identifiers

- `Shopware\Core\Checkout\Payment\Cart\PaymentHandler\AbstractPaymentHandler`
- `Shopware\Core\Checkout\Payment\Cart\PaymentTransactionStruct` (`getOrderTransactionId()`, `getReturnUrl()`)
- `Shopware\Core\Checkout\Order\Aggregate\OrderTransaction\OrderTransactionStateHandler` (`process()`, `paid()`)
- `Shopware\Core\Checkout\Payment\Cart\PaymentHandler\PaymentHandlerType`
- `.inner`, `decorate()`, service tag `shopware.payment.method`

## Gotchas

- The docs example extends and decorates `DebitPayment`, which is deprecated for v6.8.0 ("removed without replacement") and `@internal`.
- The docs snippet imports `SyncPaymentTransactionStruct`, which no longer exists; `pay()` receives a `PaymentTransactionStruct`.
- The docs snippet calls `parent::__construct($transactionStateHandler)`, but the built-in handlers' base `DefaultPayment` declares no constructor, and it calls `$transaction->getOrderTransaction()->getId()` with an undefined `$salesChannelContext`; in 6.7 use `$transaction->getOrderTransactionId()` and the `Context` argument.
- The docs `pay()` returns nothing although its signature is `?RedirectResponse`; return `null` or the decorated result.

## Code check (6.7.13.0)
- absent `Shopware\Core\Checkout\Payment\Cart\SyncPaymentTransactionStruct` — not in the installed code; replaced by `PaymentTransactionStruct`
- deprecated `DebitPayment` — `@deprecated tag:v6.8.0`, removed without replacement, also `@internal` — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/DebitPayment.php:13
- confirmed `AbstractPaymentHandler::supports()` — abstract, must be declared — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:24
- confirmed `AbstractPaymentHandler::pay()` — abstract, returns `?RedirectResponse` — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:34
- corrected `DefaultPayment` — docs: parent constructor accepts `OrderTransactionStateHandler`; class has no constructor — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/DefaultPayment.php:16
- corrected `PaymentTransactionStruct::getOrderTransactionId()` — docs: `getOrderTransaction()->getId()` — vendor/shopware/core/Checkout/Payment/Cart/PaymentTransactionStruct.php:19
- confirmed `OrderTransactionStateHandler::process()` — takes transaction id and `Context` — vendor/shopware/core/Checkout/Order/Aggregate/OrderTransaction/OrderTransactionStateHandler.php:66
- confirmed `InvoicePayment` — built-in `@internal` handler extending `DefaultPayment` — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/InvoicePayment.php:13
- confirmed `shopware.payment.method` — tag on built-in handler services — vendor/shopware/core/Checkout/DependencyInjection/payment.xml:106
