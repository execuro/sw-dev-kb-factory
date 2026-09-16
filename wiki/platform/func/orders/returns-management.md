---
id: platform/func/orders/returns-management.md
title: Returns Management
docType: functional
version: "6.5"
versions: ["6.5", "6.6"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/orders/returns-management"
sourceHash: "65048861241f38c121f2a4672aa8d72f379f7cd76c10842830763570d12cce40"
revision:
  current: true
  range: "6.5.0.0 - 6.6.10.18"
  swMin: "6.5.0.0"
  swMax: "6.6.10.18"
keywords: ["returns management", "Return items", "Add to return", "Returns tab", "Partial cancellation", "Shopware Commercial", "Shopware Rise", "return status", "return quantity", "order returns"]
summary: "How merchants create and process a customer return from an existing order using the returns management feature."
lastBuilt: "2026-09-15"
---
## What it is

Describes processing customer returns directly in the admin, by creating a return based on an existing order.

## When to use

When a merchant receives a returned item from a customer and needs to record and process it against the original order.

## Key steps / config

1. Open the existing order, go to the **General** tab, select the returned items, and choose **Return items**.
2. In the resulting window, set the **Return quantity** and an optional **Comment**, then click **Add to return**. This adds a new **Returns** tab to the order with the return's details.
3. Under **General** in the Returns tab, set the overall return status and add comments; under **Positions**, edit individual return items (adjust quantity, assign status, remove item, edit shipping costs).
4. A **Partial cancellation** document can be created under the order's **Documents** tab, but only once an invoice already exists for the order.
5. To fully complete the return, go to the **Returns > Items** section, process each return line item, and set its status to **Return requested**; only then is the return considered complete and the order updated.

## Essential identifiers

- Order actions: `Return items`, `Add to return`
- Tabs: `Returns` (with `General`, `Positions`, `Items` sections)
- Document: `Partial cancellation`
- Status: `Return requested`, `Returned`

## Gotchas

- Only one return can currently be created per order.
- There is no automatic stock calculation for returns — it must be done manually.
- Creating a return does not automatically set the order status to `Returned`; the return items must be processed and explicitly set to `Returned` to complete it.

## Version notes

Returns management is available from the Shopware Rise plan via the Shopware Commercial extension.
