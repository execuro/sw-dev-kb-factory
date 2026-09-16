---
id: platform/dev/6.6/products/extensions/b2b-components/order-approval/guides/03-payment-process.md
title: Payment Process
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/b2b-components/order-approval/guides/03-payment-process.html
sourceHash: 2ba9e039bba21a5252fd0aa82c07b7a5e59e3de9
keywords: ["payment process", "order approval", "PendingOrderApprovedEvent", "shouldProceedPlaceOrder", "ApprovalPendingOrderController", "pending-approval detail page", "storefront twig override", "EventSubscriberInterface", "online payment", "b2b order approval", "approve order", "commercial b2b"]
summary: "Order approval's payment runs after approval for online methods; override the detail twig or cancel it via PendingOrderApprovedEvent."
lastBuilt: "2026-09-15"
---
## What it is

The payment process of the order approval component reuses the standard order component's payment process, with one difference: for online payment methods (e.g. Visa, PayPal), payment is executed only after the order has been approved.

## When to use

Relevant when customizing how or whether payment executes for orders that go through the B2B order approval workflow, either in the storefront template or via an event subscriber.

## Key steps / config

- Storefront rendering can be customized by extending or overriding the template `@OrderApproval/storefront/pending-order/page/pending-approval/detail.html.twig`.
- Normally, once a reviewer approves the order, payment executes automatically. To approve the order without executing payment, subscribe to `PendingOrderApprovedEvent` and call `PendingOrderApprovedEvent::setShouldProceedPlaceOrder(false)`.
- This event is dispatched inside `Shopware\Commercial\B2B\OrderApproval\Storefront\Controller\ApprovalPendingOrderController::order`.

```php
use Shopware\Commercial\B2B\OrderApproval\Event\PendingOrderApprovedEvent;

class MySubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            PendingOrderApprovedEvent::class => 'onPendingOrderApproved'
        ];
    }

    public function onPendingOrderApproved(PendingOrderApprovedEvent $event): void
    {
        $event->setShouldProceedPlaceOrder(false);
    }
}
```

## Essential identifiers

- `@OrderApproval/storefront/pending-order/page/pending-approval/detail.html.twig`
- `Shopware\Commercial\B2B\OrderApproval\Event\PendingOrderApprovedEvent`
- `PendingOrderApprovedEvent::shouldProceedPlaceOrder`
- `Shopware\Commercial\B2B\OrderApproval\Storefront\Controller\ApprovalPendingOrderController::order`
