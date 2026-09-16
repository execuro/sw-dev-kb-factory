---
id: platform/dev/6.6/guides/plugins/plugins/checkout/payment/customize-payment-provider.md
title: Customize payment provider
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/checkout/payment/customize-payment-provider.html"
sourceHash: "62d8e1762af11f71743a890001db2c810c66079f"
keywords: ["customize payment provider", "DebitPayment", "decoration pattern", "getDecorated", "decorates", "SynchronousPaymentHandler", "AsynchronousPaymentHandler", "OrderTransactionStateHandler", ".inner", "service decoration"]
summary: "Shows decorating an existing payment provider (e.g. DebitPayment) via the Symfony service decoration pattern to customize its pay() behavior."
lastBuilt: "2026-09-15"
---
## What it is
Explains customizing an existing payment provider by decorating it, using `Shopware\Core\Checkout\Payment\Cart\PaymentHandler\DebitPayment` as the example; the same approach applies to asynchronous payment handlers.

## When to use
Use when a plugin needs to alter or extend the behavior of a payment handler that already exists in Shopware core (or another plugin), rather than writing an entirely new one.

## Key steps / config
1. Create a class extending the provider to customize (e.g. `DebitPayment`), with a constructor accepting the original dependency (`OrderTransactionStateHandler`) plus an instance of the decorated class itself, and implement `getDecorated()` to return the injected decorated instance:
```php
class ExampleDebitPayment extends DebitPayment
{
    public function __construct(OrderTransactionStateHandler $transactionStateHandler, DebitPayment $decorated)
    {
        parent::__construct($transactionStateHandler);
        $this->decorated = $decorated;
    }

    public function getDecorated(): DebitPayment { return $this->decorated; }

    public function pay(...): void { /* custom logic, then delegate/transition */ }
}
```
2. Register the decorator in `services.xml` using the `decorates` attribute and the `.inner` reference for the original service:
```xml
<service id="Swag\BasicExample\Service\ExampleDebitPayment" decorates="Shopware\Core\Checkout\Payment\Cart\PaymentHandler\DebitPayment">
    <argument type="service" id="Shopware\Core\Checkout\Order\Aggregate\OrderTransaction\OrderTransactionStateHandler"/>
    <argument type="service" id="Swag\BasicExample\Service\ExampleDebitPayment.inner"/>
</service>
```

## Essential identifiers
- `Shopware\Core\Checkout\Payment\Cart\PaymentHandler\DebitPayment`
- `Shopware\Core\Checkout\Order\Aggregate\OrderTransaction\OrderTransactionStateHandler`
- `getDecorated()`
- XML attribute `decorates`, argument suffix `.inner`
