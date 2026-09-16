---
id: platform/dev/6.7/products/extensions/b2b-components/order-approval/guides/03-payment-process.md
title: Payment Process
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/order-approval/guides/03-payment-process.html
sourceHash: 2ba9e039bba21a5252fd0aa82c07b7a5e59e3de9
codeCheckedAgainst: "6.7.13.0"
keywords: ["order approval", "payment process", "PendingOrderApprovedEvent", "setShouldProceedPlaceOrder", "shouldProceedPlaceOrder", "ApprovalPendingOrderController", "@OrderApproval/storefront/pending-order/page/pending-approval/detail.html.twig", "b2b", "commercial", "pending order", "online payment", "event subscriber"]
summary: "B2B order approval payment: online payment runs only after approval; skip it via PendingOrderApprovedEvent::setShouldProceedPlaceOrder(false)."
lastBuilt: 2026-09-15
---
## What it is

How payment works in the B2B Order Approval component (Shopware Commercial). Payment method selection is the same as for a normal order, but for online payment methods (Visa, PayPal, etc.) the payment process is executed only after a reviewer has approved the pending order.

## When to use

- Customizing the Storefront page for a pending order awaiting approval.
- Approving a pending order without automatically triggering payment / order placement.

## Key steps / config

**Storefront:** extend or override the template
`@OrderApproval/storefront/pending-order/page/pending-approval/detail.html.twig`.

**Skip automatic payment after approval:** subscribe to
`Shopware\Commercial\B2B\OrderApproval\Event\PendingOrderApprovedEvent` and set `shouldProceedPlaceOrder` to `false`. The event is dispatched in
`Shopware\Commercial\B2B\OrderApproval\Storefront\Controller\ApprovalPendingOrderController::order`.

```php
use Shopware\Commercial\B2B\OrderApproval\Event\PendingOrderApprovedEvent;

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

- Default behaviour: once a reviewer approves, the payment process runs automatically; you must opt out via the event.
- All identifiers live in the Shopware Commercial plugin, which is not part of the installed `vendor/shopware` core/storefront/administration packages, so they could not be verified against installed code.

## Code check (6.7.13.0)
- unverified `Shopware\Commercial\B2B\OrderApproval\Event\PendingOrderApprovedEvent` — Commercial plugin, not in the installed vendor/shopware roots
- unverified `PendingOrderApprovedEvent::setShouldProceedPlaceOrder()` — Commercial plugin, not installed
- unverified `Shopware\Commercial\B2B\OrderApproval\Storefront\Controller\ApprovalPendingOrderController::order` — Commercial plugin, not installed
- unverified `@OrderApproval/storefront/pending-order/page/pending-approval/detail.html.twig` — Commercial plugin template, not installed
- unverified `EventSubscriberInterface` — vendor/symfony, out of scope
