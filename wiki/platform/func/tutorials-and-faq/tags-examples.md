---
id: platform/func/tutorials-and-faq/tags-examples.md
title: Tags Examples
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/tags-examples"
sourceHash: "0ffe0fb72bcc645fae5b8d8b820f9b5ebbcfedb7ab37cf735878ad706d09bdae"
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["tags", "dynamic product groups", "rule builder", "shipping rule", "availability rule", "flow builder", "promotion", "google shopping export", "customer tag", "bulky goods"]
summary: "Five worked examples of using Shopware tags: product export filters, shipping rules, customer discounts, dynamic groups, and Flow Builder conditions."
lastBuilt: "2026-09-15"
---

## What it is

Five worked examples of using tags (keywords attachable to products, categories, media,
customers, orders, shipping methods, newsletter recipients, landing pages) to drive
filters and automation elsewhere in the shop.

## When to use

When a merchant needs to group or filter products, customers, or flows based on a
shared label rather than a fixed category or attribute — e.g. selecting an export feed,
routing bulky items to a special shipping method, or targeting a customer segment.

## Key steps / config

- **Google Shopping export filter**: tag the relevant products (e.g. "Google Shopping"),
  then create a dynamic product group with the rule `Tags | Same | Google Shopping` and
  use that group to select products for the export feed.
- **Bulky-goods shipping**: tag products (e.g. "bulky goods"), then on a shipping
  method's availability rule add a condition such as
  `Item with tag | At least one | Is one of | "bulky"`.
- **Customer discount by tag**: assign a tag to selected customers, create a rule under
  **Settings > Rule Builder** that filters customers by that tag, then reference that
  rule as the customer rule of a discount **Promotion** (Marketing > Promotions).
- **Dynamic product groups by tag**: under **Catalogues > Dynamic product groups**,
  assign the same tag to a set of products (e.g. "Sale") and build a rule around it; the
  resulting group can then be assigned to a category to sell those products together.
- **Flow Builder conditions on tags**: in **Settings > Flow Builder**, edit a flow (e.g.
  "order placed") and add a condition based on a customer's or product's stored tag to
  trigger a differentiated action, such as sending a special order-confirmation email to
  tagged premium customers.

## Essential identifiers

- Tags (attachable to products, categories, media, customers, orders, shipping methods,
  newsletter recipients, landing pages)
- **Settings > Rule Builder**, **Marketing > Promotions**
- **Catalogues > Dynamic product groups**
- **Settings > Flow Builder**
