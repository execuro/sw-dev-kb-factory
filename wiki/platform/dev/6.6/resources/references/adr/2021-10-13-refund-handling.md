---
id: platform/dev/6.6/resources/references/adr/2021-10-13-refund-handling.md
title: Refund handling
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-10-13-refund-handling.html
sourceHash: 72c5c5238712498407d0acf8ff59580f99425697
keywords: ["refund handling", "OrderTransactionCapture", "OrderTransactionCaptureRefund", "OrderTransactionCaptureRefundPosition", "PaymentRefundHandlerInterface", "PaymentRefundProcessor", "AppRefundHandler", "refundHandlingEnabled", "capture", "order_transaction_capture", "state machine", "refunds"]
summary: ADR introducing a unified refund data model — captures and refunds tied to order transactions — plus PaymentRefundHandlerInterface for extensions.
lastBuilt: 2026-09-15
---
## What it is
Architecture decision record introducing a unified refund handling structure so payment extensions no longer implement refunds independently or omit them entirely.

## When to use
Relevant when a payment extension needs to support capturing and refunding payments through a common Shopware data structure instead of a custom one.

## Key steps / config
New entities persist captures and their refunds, each tied to an `OrderTransaction`:

- `OrderTransactionCapture` — n captures to 1 `order_transaction`; table `order_transaction_capture` (fields include `transaction_id`, `state_id`, `external_reference`, `amount`, `custom_fields`).
- `OrderTransactionCaptureRefund` — n refunds to 1 capture; table `order_transaction_capture_refund` (fields include `capture_id`, `state_id`, `reason`, `amount`, `external_reference`, `custom_fields`).
- `OrderTransactionCaptureRefundPosition` — optional, position-specific refund lines; table `order_transaction_capture_refund_position` (fields include `refund_id`, `line_item_id`, `quantity`, `reason`, `refund_amount`, `custom_fields`).

Two new state machines are added: `order_transaction_capture.state` (`pending`, `completed`, `failed`) and `order_transaction_capture_refund.state` (`open`, `in_progress`, `cancelled`, `failed`, `completed`).

New interface for handlers:

```php
public function refund(string $orderRefundId, Context $context): void;
```

`PaymentRefundProcessor` is triggered via an Admin-API action and exposes:

```php
public function processRefund(string $refundId, Context $context): Response;
```

Manifest change: add `refundUrl` to the app manifest's `PaymentMethod` XML (and update the corresponding XSD) so apps can handle refunds via `AppRefundHandler`; captures are written over the Admin-API endpoint.

## Essential identifiers
- `PaymentRefundHandlerInterface::refund()`
- `PaymentRefundProcessor::processRefund()`
- `AppRefundHandler`
- `\Shopware\Core\Framework\App\Manifest\Xml\PaymentMethod` (`refundUrl`)
- `PaymentMethod.refundHandlingEnabled` (computed, set when the handler implements `RefundHandlerInterface`)

## Gotchas
- `PaymentMethod::refundHandlingEnabled` is only added as a computed field when the payment method handler implements `RefundHandlerInterface`.
- `OrderTransaction` gains a `OneToManyAssociation` to `OrderTransactionCaptureCollection` (`captures`), and `OrderLineItem` gains one to `OrderTransactionCaptureRefundPositionCollection|null` (`refundPositions`).
