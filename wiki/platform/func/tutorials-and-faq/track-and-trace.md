---
id: platform/func/tutorials-and-faq/track-and-trace.md
title: Track And Trace
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/track-and-trace"
sourceHash: "92455d8bf7e666fbafe661662c34b4049c9c239bd2807085092cb04d172666e1"
revision:
  current: true
  range: "6.0.0 - 6.4.7.0"
  swMax: "6.4.7.0"
  swMin: "6.0.0"
keywords: ["tracking link", "tracking number", "trackingcode", "email templates", "shipping method", "order deliveries", "twig", "storefront orders", "dhl", "shipment tracking"]
summary: "How to integrate a carrier tracking link into email templates and the shipping method, and where to enter/view tracking numbers on orders."
lastBuilt: "2026-09-15"
---

## What it is

Explains how to integrate order tracking (a tracking link and/or tracking number) into
Shopware: adding the link to email templates via Twig, setting the base tracking URL on
a shipping method, and where merchants and customers find the tracking number.

## When to use

When a shop wants order-status emails and the customer's order-detail view to include a
clickable tracking link for the carrier used on that order (the guide uses DHL as the
example).

## Key steps / config

- Find the carrier's tracking link pattern from the logistics provider's own portal
  using the shipment number, e.g. `https://www.dhl.de/en/privatkunden/pakete-empfangen/verfolgen.html?piececode=12345678`
  where `12345678` is the tracking number.
- Add the tracking link to an email template under **Settings > Email templates** (the
  example edits "Entry delivery status: shipped"). In the template's **text** section,
  loop over deliveries and tracking codes:

```twig
{% for delivery in order.deliveries %}
    {% for trackingCode in delivery.trackingCodes %}
        https://www.dhl.de/en/privatkunden/pakete-empfangen/verfolgen.html?piececode={{ trackingCode }}
    {% endfor %}
{% endfor %}
```

  In the **HTML** section, the same loop can render a labelled link instead.
- Enter the carrier's base tracking URL (the part before the tracking code, e.g.
  `https://www.dhl.de/en/privatkunden/pakete-empfangen/verfolgen.html?piececode=`) under
  **Settings > Shop > Shipping** for the shipping method.
- Enter one or more tracking numbers on an order by opening it in the admin and clicking
  **edit**.
- Customers see the tracking number in the storefront under their **orders**.

## Essential identifiers

- `order.deliveries`, `delivery.trackingCodes` (Twig template variables)
- **Settings > Email templates**, **Settings > Shop > Shipping**

## Version notes

Documented as applicable for Shopware 6.0.0 through 6.4.7.0.
