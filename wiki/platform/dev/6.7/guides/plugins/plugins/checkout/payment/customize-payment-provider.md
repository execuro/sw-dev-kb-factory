---
id: platform/dev/6.7/guides/plugins/plugins/checkout/payment/customize-payment-provider.md
title: Customize Payment Provider
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/payment/customize-payment-provider.html
sourceHash: ab6f07bd4e2d80ebd68f6d9b6a4114dec552b535
codeCheckedAgainst: "6.7.15.1"
keywords: ["AbstractPaymentHandler", "OrderTransactionStateHandler", "PaymentTransactionStruct", "decorate", ".inner", "shopware.payment.method", "getDecorated", "payment provider", "payment handler decoration", "customize payment", "service decorator", "DebitPayment"]
summary: Customize an existing payment handler by decorating its service with a class that wraps the inner handler and overrides pay().
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md"]
---
## What it is

How to change the behaviour of an existing payment handler (the source uses a synchronous flow; the same applies to asynchronous ones) by decorating its service in the DI container. Background on decoration: [adjusting a service](platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md).

## When to use

An installed payment method should keep its handler identifier but run additional logic during `pay()` (or another handler method).

## Key steps / config

1. Create a class that receives the original handler (`.inner`) and an `OrderTransactionStateHandler`. In 6.7.15.1 the built-in handlers declare no constructor and no `transactionStateHandler` property, so inject and store both yourself instead of calling `parent::__construct()`. Extending `Shopware\Core\Checkout\Payment\Cart\PaymentHandler\AbstractPaymentHandler` obliges you to declare `supports()` and `pay()`:

```php
class ExampleDebitPayment extends AbstractPaymentHandler
{
    public function __construct(
        private readonly OrderTransactionStateHandler $transactionStateHandler,
        private readonly AbstractPaymentHandler $decorated,
    ) {}
    public function getDecorated(): AbstractPaymentHandler { return $this->decorated; }
    public function supports(PaymentHandlerType $type, string $paymentMethodId, Context $context): bool { /* delegate */ }
    public function pay(Request $request, PaymentTransactionStruct $transaction, Context $context, ?Struct $validateStruct): ?RedirectResponse
    {
        // custom logic
        $this->transactionStateHandler->process($transaction->getOrderTransactionId(), $context);
        return null;
    }
}
```

2. Register it as a decorator of the original handler service in `services.php`:

```php
$services->set(ExampleDebitPayment::class)
    ->decorate(<OriginalHandler>::class)
    ->args([service(OrderTransactionStateHandler::class), service('.inner')]);
```

## Essential identifiers

- `Shopware\Core\Checkout\Payment\Cart\PaymentHandler\AbstractPaymentHandler`
- `Shopware\Core\Checkout\Order\Aggregate\OrderTransaction\OrderTransactionStateHandler`
- `Shopware\Core\Checkout\Payment\Cart\PaymentTransactionStruct::getOrderTransactionId()`
- `->decorate(...)`, `service('.inner')`

## Gotchas

- The source's example decorates `Shopware\Core\Checkout\Payment\Cart\PaymentHandler\DebitPayment`, which is `@internal` and deprecated for removal in 6.8.0 without replacement — avoid building on it.
- The source snippet does not run as written: it imports `SyncPaymentTransactionStruct` (gone), calls a non-existent parent constructor, uses `$transaction->getOrderTransaction()` and an undefined `$salesChannelContext`, and `pay()` returns nothing. Use `getOrderTransactionId()` and the `$context` argument, and return `null` or a `RedirectResponse`.

## Code check (6.7.15.1)
- absent `Shopware\Core\Checkout\Payment\Cart\SyncPaymentTransactionStruct` — replaced by PaymentTransactionStruct in 6.7
- deprecated `DebitPayment` — `@internal`, removed in 6.8.0 without replacement — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/DebitPayment.php:13
- corrected `DefaultPayment` — docs: parent constructor takes OrderTransactionStateHandler; parent declares no constructor — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/DefaultPayment.php:16
- confirmed `AbstractPaymentHandler::pay()` — abstract, returns `?RedirectResponse` — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:34
- confirmed `AbstractPaymentHandler::supports()` — abstract, must be declared — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:24
- corrected `PaymentTransactionStruct::getOrderTransactionId()` — docs: getOrderTransaction()->getId() — vendor/shopware/core/Checkout/Payment/Cart/PaymentTransactionStruct.php:22
- confirmed `OrderTransactionStateHandler::process()` — takes transaction id and Context — vendor/shopware/core/Checkout/Order/Aggregate/OrderTransaction/OrderTransactionStateHandler.php:66
- unverified `.inner` — Symfony decoration, vendor/symfony out of scope
