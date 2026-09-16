---
id: platform/func/settings/rules.md
title: "Rules"
docType: functional
version: "6.7"
versions: ["6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/settings/rules"
sourceHash: "ca1a8f70d77488cdad5209157e4ecfe54b175fcad8aeb337d4a99168945ca21b"
revision:
  current: true
  range: "6.7.1.0 - 6.7.11.0"
  swMin: "6.7.1.0"
  swMax: "6.7.11.0"
keywords: ["rule builder", "conditions", "operators", "priority", "evaluation context", "AND connection", "OR connection", "subcondition", "preview mode", "share rules", "download rule", "upload rule", "assignments tab", "availability rule"]
summary: "Documents Shopware's Rule Builder: components, conditions, operators, preview mode, assignments, and sharing rules via JSON export/import."
lastBuilt: "2026-09-15"
---
## What it is

Shopware's Rule Builder (Settings > Automation > Rule Builder) lets merchants define reusable rules made of conditions and operators, used to control availability of payment/shipping methods, promotions, discounts, prices, flows, and Dynamic Access visibility.

## When to use

Use rules whenever a feature needs to apply conditionally — e.g. restrict a payment method to one country, apply a discount above a cart total, or trigger a flow based on order status.

## Key steps / config

- Create: Settings > Automation > Rule Builder > Create Rule; fill in Name, Description, Priority, optional Type and Tags; add at least one condition, an operator, and an input value; Save.
- Delete: use the row's context menu > Delete (rules that are still assigned cannot be deleted).
- A rule consists of general information (Name, Description, Priority, Type, Tags) and Conditions. Conditions can be joined with AND (all must match) or OR (any must match); switching between AND/OR automatically creates subconditions.
- Preview mode (Shopware Rise plan and higher) evaluates the rule's conditions in real time against a selected order, showing TRUE/FALSE per condition; a Time and date field lets you simulate a point in time for conditions that query a specific moment.
- The Assignments tab lists every place a rule is already used or can be used (availability of payment/shipping methods, shipping cost calculation, promotions, discounts, advanced prices, flows, and — with Dynamic Access — product/category/Shopping Experience Block visibility). It is read-only navigation, not an assignment tool: buttons are inactive if no suitable data records exist yet.
- Share Rules (from Shopware 6.7.1.0, Rise plan): download a rule via the row's `[...]` menu > Download to export a JSON file with all conditions, operators and optional references (customer/customer group/sales channel references can be omitted); upload via Rule Builder > Upload rule > Choose file > Upload — any missing references are flagged for reassignment in the target system.

## Essential identifiers

- Settings > Automation > Rule Builder
- Rule columns: Rule, Priority, Description, Updated at, Creation date, Status
- AND connection / OR connection / Subcondition
- Preview mode (Shopware Rise plan and higher)
- Share Rules download/upload (Shopware 6.7.1.0+, Rise plan)

## Gotchas

- Rules cannot be deleted while still assigned, and deleted rules cannot be restored.
- The "Item available" condition evaluated actual stock minus unshipped sold items up to version 6.5, but since 6.6 it just mirrors the stock value directly — use "Item in stock" instead from 6.6 onward.
- The "New customer" condition will be removed in the next major release; use "Time since first login" instead, since it lets you specify exactly how long a customer counts as new.
- Some conditions accept an optional filter (shown via a filter icon in the input field) to further narrow the input value, e.g. limiting a subtotal condition to a specific category or tag.

## Version notes

Preview mode and Share Rules require the Shopware Rise plan or higher. Share Rules was introduced with Shopware 6.7.1.0.
