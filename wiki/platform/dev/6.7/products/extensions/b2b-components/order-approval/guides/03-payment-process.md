---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/products/extensions/b2b-components/order-approval/guides/03-payment-process.md
sourceHash: 2ba9e039bba21a5252fd0aa82c07b7a5e59e3de9
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/order-approval/guides/03-payment-process.html
title: Payment Process
version: "6.7"
versions: ["6.7"]
keywords: ["PendingOrderApprovedEvent", "setShouldProceedPlaceOrder", "shouldProceedPlaceOrder", "ApprovalPendingOrderController", "@OrderApproval/storefront/pending-order/page/pending-approval/detail.html.twig", "order approval payment", "online payment after approval", "pending order", "b2b", "skip payment on approve"]
summary: B2B Order Approval payment flow - online payment runs only after approval; PendingOrderApprovedEvent can stop placing the order on approve.
lastBuilt: 2026-10-21
---
## What it is

How payment works for orders that go through B2B Order Approval. The employee picks a payment method as in the normal checkout. For online payment methods (the source names Visa and PayPal as examples), payment is only executed after a reviewer has approved the order.

## When to use

- You want to customize the storefront page of a pending order awaiting approval.
- You want a reviewer's approval to approve the order without running the payment and placing the order.

## Key steps / config

**Storefront customization** — extend or override the template
`@OrderApproval/storefront/pending-order/page/pending-approval/detail.html.twig`.

**Approve without payment** — by default, approval runs the payment process automatically. `PendingOrderApprovedEvent` is dispatched in `Shopware\Commercial\B2B\OrderApproval\Storefront\Controller\ApprovalPendingOrderController::order`. Subscribe to it and set `shouldProceedPlaceOrder` to `false`:

```php
use Shopware\Commercial\B2B\OrderApproval\Event\PendingOrderApprovedEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class MySubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [PendingOrderApprovedEvent::class => 'onPendingOrderApproved'];
    }

    public function onPendingOrderApproved(PendingOrderApprovedEvent $event): void
    {
        $event->setShouldProceedPlaceOrder(false);
    }
}
```

## Essential identifiers

- `Shopware\Commercial\B2B\OrderApproval\Event\PendingOrderApprovedEvent`
- `PendingOrderApprovedEvent::setShouldProceedPlaceOrder()`
- `Shopware\Commercial\B2B\OrderApproval\Storefront\Controller\ApprovalPendingOrderController::order`
- `@OrderApproval/storefront/pending-order/page/pending-approval/detail.html.twig`

## Gotchas

- The event is keyed by its class name (`PendingOrderApprovedEvent::class`), not by a string event name.
- The deferred payment applies to online payment methods. The source does not say anything else about other payment methods.

## Code check (6.7.15.1)
- unverified `PendingOrderApprovedEvent` — Shopware Commercial B2B class, not in the core/storefront/administration packages
- unverified `PendingOrderApprovedEvent::setShouldProceedPlaceOrder()` — Shopware Commercial B2B class, out of scope
- unverified `ApprovalPendingOrderController::order` — Shopware Commercial B2B storefront controller, out of scope
- unverified `@OrderApproval/storefront/pending-order/page/pending-approval/detail.html.twig` — template ships with the commercial plugin, out of scope
- unverified `EventSubscriberInterface` — vendor/symfony, out of scope
