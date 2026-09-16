---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/resources/references/adr/2021-10-13-refund-handling.md
sourceHash: 72c5c5238712498407d0acf8ff59580f99425697
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-10-13-refund-handling.html
title: Refund handling
version: "6.7"
versions:
  - "6.7"
keywords: ["refund", "capture", "order_transaction_capture", "order_transaction_capture_refund", "order_transaction_capture_refund_position", "OrderTransactionCaptureEntity", "OrderTransactionCaptureRefundEntity", "OrderTransactionCaptureRefundPositionEntity", "PaymentRefundProcessor", "processRefund", "order_transaction_capture_refund.state", "refundUrl", "refund-url", "AbstractPaymentHandler", "adr"]
summary: "ADR: refund data model (order_transaction_capture, _refund, _refund_position), their state machines, the refund handler call and the app refund-url."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2021-10-13, area checkout) introducing unified refund handling for plugins and apps: persisted captures per order transaction, refunds per capture, optional position-level refunds, two new state machines, a refund processor triggered via the Admin API, and an app refund endpoint.

## When to use

- You build a payment extension that should support refunds through Shopware's unified refund handling.
- You need the table/entity layout of captures and refunds or their state names.

## Key steps / config

1. Persist captures: an `order_transaction_capture` belongs to one `order_transaction` (n:1), with amount and optional external reference. Captures are written via the Admin API.
2. Create refunds: an `order_transaction_capture_refund` belongs to one capture (n:1), with `reason`, `amount`, `external_reference`.
3. Optionally add positions: `order_transaction_capture_refund_position` rows (n:1 to a refund) referencing an `order_line_item` with `quantity`, `reason`, amount.
4. Trigger the refund via the Admin API action backed by `PaymentRefundProcessor::processRefund(string $refundId, Context $context): void`. It requires the refund to be in state `open`, resolves the payment method handler, and calls its refund method; on any exception the refund is set to `failed`.
5. Handler side (6.7 code): extend `AbstractPaymentHandler`, return true from `supports()` for `PaymentHandlerType::REFUND`, and implement `refund(RefundPaymentTransactionStruct $transaction, Context $context): void`.
6. Apps: declare `refund-url` in the manifest `payment-method`; `AppPaymentHandler::refund()` posts the payload to that URL.

State machines (installed values):

| State machine | States |
|---|---|
| `order_transaction_capture.state` | `pending`, `completed`, `failed` |
| `order_transaction_capture_refund.state` | `open`, `in_progress`, `cancelled`, `failed`, `completed` |

Installed column/property names that differ from the ADR tables: capture FK `order_transaction_id` / `orderTransactionId`; position FK `order_line_item_id` / `orderLineItemId`; the line item association is `orderTransactionCaptureRefundPositions`; the transaction association is `captures`.

## Essential identifiers

- `OrderTransactionCaptureEntity`, `OrderTransactionCaptureRefundEntity`, `OrderTransactionCaptureRefundPositionEntity`
- `OrderTransactionCaptureStates`, `OrderTransactionCaptureRefundStates`
- `PaymentRefundProcessor::processRefund()`
- `AbstractPaymentHandler::refund()`, `PaymentHandlerType::REFUND`, `RefundPaymentTransactionStruct`
- `Shopware\Core\Framework\App\Manifest\Xml\PaymentMethod\PaymentMethod` (`refundUrl`)

## Gotchas

- Refund handling only works when the payment extension persists its actual captures.
- Refund positions are optional and only used for position-specific refunds.
- The ADR's `PaymentRefundHandlerInterface` / `RefundHandlerInterface`, the computed `refundHandlingEnabled` payment method field and a separate `AppRefundHandler` do not exist in the installed code.

## Version notes

- ADR signatures `refund(string $orderRefundId, Context $context)` and `processRefund(...): Response` are superseded in 6.7 by the struct-based `AbstractPaymentHandler::refund()` and a `void` `processRefund()`.

## Code check (6.7.13.0)
- corrected `OrderTransactionCaptureEntity::$orderTransactionId` — docs: transactionId / transaction_id — vendor/shopware/core/Checkout/Order/Aggregate/OrderTransactionCapture/OrderTransactionCaptureEntity.php:20
- confirmed `OrderTransactionCaptureRefundEntity::$captureId` — refund belongs to a capture — vendor/shopware/core/Checkout/Order/Aggregate/OrderTransactionCaptureRefund/OrderTransactionCaptureRefundEntity.php:20
- corrected `OrderTransactionCaptureRefundPositionEntity::$orderLineItemId` — docs: lineItemId — vendor/shopware/core/Checkout/Order/Aggregate/OrderTransactionCaptureRefundPosition/OrderTransactionCaptureRefundPositionEntity.php:23
- confirmed `OrderTransactionCaptureStates::STATE_MACHINE` — order_transaction_capture.state with pending/completed/failed — vendor/shopware/core/Checkout/Order/Aggregate/OrderTransactionCapture/OrderTransactionCaptureStates.php:10
- confirmed `OrderTransactionCaptureRefundStates::STATE_MACHINE` — order_transaction_capture_refund.state with open/in_progress/cancelled/failed/completed — vendor/shopware/core/Checkout/Order/Aggregate/OrderTransactionCaptureRefund/OrderTransactionCaptureRefundStates.php:10
- corrected `PaymentRefundProcessor::processRefund()` — docs: returns Response; code returns void — vendor/shopware/core/Checkout/Payment/Cart/PaymentRefundProcessor.php:32
- corrected `AbstractPaymentHandler::refund()` — docs: PaymentRefundHandlerInterface::refund(string $orderRefundId, Context) — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:71
- corrected `PaymentMethod::$refundUrl` — docs: class Manifest\Xml\PaymentMethod; installed in Manifest\Xml\PaymentMethod\PaymentMethod — vendor/shopware/core/Framework/App/Manifest/Xml/PaymentMethod/PaymentMethod.php:45
- absent `AppRefundHandler` — app refunds are sent by AppPaymentHandler::refund() instead
- absent `refundHandlingEnabled` — no such computed field on payment methods
