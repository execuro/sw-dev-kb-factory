---
id: platform/dev/6.7/resources/references/adr/2021-10-13-refund-handling.md
title: Refund handling
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-10-13-refund-handling.html
sourceHash: 72c5c5238712498407d0acf8ff59580f99425697
codeCheckedAgainst: "6.7.15.1"
keywords: ["refund", "capture", "order_transaction_capture", "order_transaction_capture_refund", "order_transaction_capture_refund_position", "PaymentRefundProcessor", "AbstractPaymentHandler", "refundUrl", "order_transaction_capture.state", "order_transaction_capture_refund.state", "AppPaymentHandler", "refund position"]
summary: "ADR: unified refunds via capture, refund and refund-position entities, two state machines, a refund Admin API action and app refundUrl."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (area checkout) introducing a unified refund structure for all extension types: payment extensions persist captures per order transaction, refunds are recorded against captures (optionally per line item), and a processor dispatches refunds to the payment handler or app.

## When to use

Read this when a payment plugin or app should support refunds from the Administration/Admin API, or when you need the data model for captures and refunds.

## Key steps / config

**1. Persist captures.** A payment extension writes its actual captures (amount, optional external reference) via the Admin API. Relation: n `order_transaction_capture` to 1 `order_transaction`. Installed fields: `id`, `order_transaction_id` (`orderTransactionId`), `state_id`, `external_reference`, `amount` (calculated price), `custom_fields`; associations `transaction`, `stateMachineState`, `refunds`.

**2. Refunds.** n `order_transaction_capture_refund` to 1 capture: `id`, `capture_id`, `state_id`, `reason`, `amount`, `custom_fields`, `external_reference`; associations `stateMachineState`, `transactionCapture`, `positions`.

**3. Refund positions (optional, position-specific refunds).** n `order_transaction_capture_refund_position` to 1 refund: `id`, `refund_id`, `order_line_item_id` (`orderLineItemId`), `quantity`, `reason`, `amount`, `external_reference`, `custom_fields`; associations `orderLineItem`, `orderTransactionCaptureRefund`.

**4. State machines.**
- `order_transaction_capture.state`: `pending`, `completed`, `failed`
- `order_transaction_capture_refund.state`: `open`, `in_progress`, `cancelled`, `failed`, `completed`

**5. Handler.** In 6.7.15.1 refunds are handled by the payment handler itself: extend `AbstractPaymentHandler`, return `true` from `supports()` for `PaymentHandlerType::REFUND`, and override:

```php
public function refund(RefundPaymentTransactionStruct $transaction, Context $context): void;
```

**6. Trigger.** `POST /api/_action/order_transaction_capture_refund/{refundId}` (ACL `order_refund.editor`) calls `PaymentRefundProcessor::processRefund(string $refundId, Context $context): void`. It requires the refund to be in state `open`, resolves the transaction's payment handler, checks REFUND support, calls `refund()`, and moves the refund to `failed` if the handler throws. The action responds with HTTP 204.

**7. Apps.** The manifest payment method (`Shopware\Core\Framework\App\Manifest\Xml\PaymentMethod\PaymentMethod`) has a `refundUrl`; `AppPaymentHandler` uses it to send refund payloads to the app. Captures are written via the Admin API.

## Essential identifiers

- `order_transaction_capture`, `order_transaction_capture_refund`, `order_transaction_capture_refund_position`
- `order_transaction_capture.state`, `order_transaction_capture_refund.state`
- `PaymentRefundProcessor::processRefund()`
- `AbstractPaymentHandler::refund()`, `PaymentHandlerType::REFUND`
- `/api/_action/order_transaction_capture_refund/{refundId}`
- `refundUrl`, `AppPaymentHandler`

## Gotchas

- The ADR's `PaymentRefundHandlerInterface` and separate `AppRefundHandler` do not exist in 6.7.15.1; use `AbstractPaymentHandler::refund()` and the app `refundUrl` handled by `AppPaymentHandler`.
- ADR column names differ from the installed schema: capture uses `order_transaction_id` (ADR: `transaction_id`), refund position uses `order_line_item_id` (ADR: `line_item_id`) and `amount` (ADR: `refund_amount`).
- A `refundHandlingEnabled` computed field on the payment method was planned but is not present in the installed code.
- `processRefund()` only accepts refunds in state `open`.

## Code check (6.7.15.1)
- corrected `PaymentRefundProcessor::processRefund()` — docs: returns Response; returns void — vendor/shopware/core/Checkout/Payment/Cart/PaymentRefundProcessor.php:32
- corrected `AbstractPaymentHandler::refund()` — docs: PaymentRefundHandlerInterface::refund(string $orderRefundId, Context) — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:71
- confirmed `/api/_action/order_transaction_capture_refund/{refundId}` — Admin API refund action — vendor/shopware/core/Checkout/Order/Api/OrderActionController.php:167
- corrected `order_transaction_id` — docs: transaction_id on capture — vendor/shopware/core/Checkout/Order/Aggregate/OrderTransactionCapture/OrderTransactionCaptureDefinition.php:64
- corrected `order_line_item_id` — docs: line_item_id on refund position — vendor/shopware/core/Checkout/Order/Aggregate/OrderTransactionCaptureRefundPosition/OrderTransactionCaptureRefundPositionDefinition.php:63
- confirmed `OrderTransactionCaptureStates::STATE_MACHINE` — order_transaction_capture.state — vendor/shopware/core/Checkout/Order/Aggregate/OrderTransactionCapture/OrderTransactionCaptureStates.php:10
- confirmed `OrderTransactionCaptureRefundStates::STATE_MACHINE` — order_transaction_capture_refund.state — vendor/shopware/core/Checkout/Order/Aggregate/OrderTransactionCaptureRefund/OrderTransactionCaptureRefundStates.php:10
- corrected `PaymentMethod::$refundUrl` — docs: class \Shopware\Core\Framework\App\Manifest\Xml\PaymentMethod; actual class is in sub-namespace PaymentMethod — vendor/shopware/core/Framework/App/Manifest/Xml/PaymentMethod/PaymentMethod.php:45
- corrected `AppPaymentHandler` — docs: separate AppRefundHandler; app refunds go through AppPaymentHandler — vendor/shopware/core/Framework/App/Payment/Handler/AppPaymentHandler.php:53
- absent `refundHandlingEnabled` — planned payment method computed field, not found in the installed code
