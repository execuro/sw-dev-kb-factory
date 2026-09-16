---
id: "platform/dev/6.6/resources/references/adr/2020-11-06-creating-events.md"
title: "Creating events in Shopware"
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2020-11-06-creating-events.html"
sourceHash: "6d5a062c3df4c17ebaf12d697dc9eb96b3a12114"
keywords: ["ShopwareEvent", "ShopwareSalesChannelEvent", "Context", "SalesChannelContext", "event consistency", "Shopware\\Core\\Framework\\Event", "event design", "core events", "event context"]
summary: "ADR: every core event must carry Context (and SalesChannelContext when applicable) and implement ShopwareEvent or ShopwareSalesChannelEvent."
lastBuilt: "2026-09-15"
---
## What it is

This ADR standardizes what context data Shopware core events must carry, addressing inconsistency across the codebase in what data prior events contained — event content had depended entirely on the domain where the event was thrown.

## When to use

Relevant when designing or reviewing a new event class in Shopware core, or in a plugin that wants to follow core conventions for event data.

## Key steps / config

- Every event must expose the current `Shopware\Core\Framework\Context` as a property, at minimum.
- If the event is raised within a sales channel context, it must also expose `Shopware\Core\System\SalesChannel\SalesChannelContext` as a property.
- Every new event must implement `Shopware\Core\Framework\Event\ShopwareEvent`.
- If a `SalesChannelContext` is available, the event must implement `Shopware\Core\Framework\Event\ShopwareSalesChannelEvent` instead of `ShopwareEvent`, in addition to carrying the sales channel context property.

## Essential identifiers

- `Shopware\Core\Framework\Context`
- `Shopware\Core\System\SalesChannel\SalesChannelContext`
- `Shopware\Core\Framework\Event\ShopwareEvent`
- `Shopware\Core\Framework\Event\ShopwareSalesChannelEvent`

## Gotchas

Choose the interface based on context availability: a plain `Context`-only event implements `ShopwareEvent`; an event that also carries a `SalesChannelContext` must implement `ShopwareSalesChannelEvent` instead of `ShopwareEvent`, not both.
