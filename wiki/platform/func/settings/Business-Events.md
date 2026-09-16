---
id: platform/func/settings/Business-Events.md
title: Business Events
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/settings/Business-Events
sourceHash: 10040f4b05ad6eb5f87234745e8f69e7eb4a25b893cf5d961e2763373d4c4649
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["Business Events", "Flow Builder", "B2B-Suite", "Rule Builder", "email template", "checkout.order.placed", "event", "sales channel", "email recipients"]
summary: "Assigns Shopware events to email templates with optional Rule Builder conditions and sales-channel scoping; superseded by Flow Builder."
lastBuilt: 2026-09-15
---
## What it is
Business Events (Settings > Shop > Business Events) let merchants assign Shopware events, such as a customer registering or an order being received, to email templates, optionally restricted by Rule Builder rules and sales channel.

## When to use
Use when you need to trigger automated emails for specific store events under specific conditions, on shops that still rely on Business Events rather than Flow Builder.

## Key steps / config
- Overview columns: Event (technical name + description), Title, Sales Channel (empty = applies to all sales channels), Rules (from the Rule Builder), Email template, Active, and a List settings context menu to show/hide columns.
- "Add Business-Event" form fields: Title, Active, Event (e.g. selecting "Order placed" maps to the technical event `checkout.order.placed`), Email template, Sales Channel, Rules.
- Email recipients: optionally add internal email addresses to receive the template instead of the customer; if any email recipients are entered, the customer no longer receives the mail for that event, so sending to both requires two separate events with the same settings, one of which stores internal recipients.

## Essential identifiers
- Menu path: `Settings > Shop > Business Events`
- Example technical event: `checkout.order.placed`

## Gotchas
- Business Events will be replaced by the Flow Builder starting with major release 6.4.8.0; Business Events continue to be used only for the B2B-Suite.
- Customers only receive the configured email template automatically when no internal email recipients are stored for that event.

## Version notes
- Superseded by Flow Builder starting with Shopware 6.4.8.0.
