---
id: platform/dev/6.6/resources/guidelines/code/events.md
title: Events
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/events.html"
sourceHash: "d4eb97c7b217a5e2ef6e9c3083d06e3958a1a446"
keywords: ["events", "ShopwareEvent", "ShopwareSalesChannelEvent", "SalesChannelAware", "sales channel", "decoration pattern", "program flow", "event system"]
summary: "Every event implements ShopwareEvent; sales-channel events also implement ShopwareSalesChannelEvent and SalesChannelAware, must not alter program flow."
lastBuilt: "2026-09-15"
---
## What it is
Coding guideline for events fired within Shopware core: which interfaces an event class must implement and what events are meant to be used for.

## Key steps / config
- An event must always implement the `\Shopware\Core\Framework\Event\ShopwareEvent` interface.
- Events thrown in the context of a sales channel must always implement the interfaces `ShopwareSalesChannelEvent` and `Shopware\Core\Framework\Event\SalesChannelAware`.
- Events are mostly used to allow developers to load more data; as a rule they should not interfere with the program flow. The decoration pattern is intended for influencing the program flow instead.

## Essential identifiers
- `\Shopware\Core\Framework\Event\ShopwareEvent`
- `ShopwareSalesChannelEvent`
- `Shopware\Core\Framework\Event\SalesChannelAware`
