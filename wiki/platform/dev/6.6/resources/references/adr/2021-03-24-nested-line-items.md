---
id: platform/dev/6.6/resources/references/adr/2021-03-24-nested-line-items.md
title: Processing of nested line items
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-03-24-nested-line-items.html
sourceHash: 1a0df9e315754a80cc27a099c3e43cd077bbc0eb
keywords: ["nested line items", "getFlat", "process", "CartProcessorInterface", "cart processor", "line items", "Cart", "CartDataCollection", "CartBehavior", "checkout cart", "plugin-line-item-type"]
summary: "ADR: core cart processors only process the first level of line items via process(); nested items must be handled by the owning plugin."
lastBuilt: "2026-09-15"
---
## What it is

An architecture decision record on how nested cart line items are processed, since core cart processors previously only considered the first level of line items even though line items can be nested.

## When to use

Relevant when writing a plugin that adds nested line items (e.g. a bundle-like line item with child product/credit line items) to the cart.

## Key steps / config

- Core cart processors continue to use `getFlat()` in `enrich`, so the required data for all items in the cart (at any nesting level) is fetched.
- The `process` method still does not use `getFlat()`; it only handles line items at the first level, avoiding collisions between processors.
- A plugin that reuses core line items nested under its own line item type can call the other processors itself to handle its nested line items, as shown by a `PluginCartProcessor implements CartProcessorInterface` example that filters `$original->getLineItems()->filterType('plugin-line-item-type')`, then in a private `calculate()` method builds temporary `Cart` instances and calls `$this->productCartProcessor->process(...)` and `$this->creditCartProcessor->process(...)` on the children before reassigning them with `$lineItem->setChildren(...)`.

## Essential identifiers

- `CartProcessorInterface`
- `getFlat()`, `process()`
- `Cart`, `CartDataCollection`, `CartBehavior`
- `LineItem::hasChildren()`, `LineItem::getChildren()`, `LineItem::setChildren()`

## Gotchas

Plugins that reuse a specific implementation of nested line items have to implement their own processing logic for those nested items, or extend Shopware's cart processors — core processors will not descend into nested levels on their own.
