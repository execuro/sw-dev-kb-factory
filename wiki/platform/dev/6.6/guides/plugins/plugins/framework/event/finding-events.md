---
id: platform/dev/6.6/guides/plugins/plugins/framework/event/finding-events.md
title: Finding events
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/event/finding-events.html
sourceHash: dd4c37810df5d0bb3a90ee90ed6b4d855d6ac870
keywords: ["finding events", "DAL events", "entity_name.event", "extends NestedEvent", "implements ShopwareEvent", "event_dispatcher", "PageLoadedEvent", "CriteriaEvent", "route events", "BusinessEventInterface", "MailActionInterface", "emitter publish", "vue emit", "Symfony profiler"]
summary: "Techniques for locating Shopware's DAL, PHP, storefront JS, and administration events, including search patterns and route event names."
lastBuilt: "2026-09-15"
---
## What it is
Covers how to discover events available in Shopware, across DAL entity events, general PHP events, storefront JS events, and administration Vue events.

## When to use
Use when trying to find an existing event to subscribe to, rather than knowing about it upfront.

## Key steps / config
- DAL events follow the pattern `entity_name.event`, e.g. `product.written`, `custom_entity.deleted`. Some entities have an "event class" of constants (e.g. `ProductEvents`); find these by searching for `@Event`.
- General PHP events: search the codebase for `extends NestedEvent`, `extends Event`, `implements ShopwareEvent`, or `->dispatch` to find where they're fired.
- Look at service definitions/constructors for `event_dispatcher` / `EventDispatcherInterface` to find classes that fire events.
- Page Loaded Events: search for `PageLoadedEvent` (e.g. `GenericPageLoadedEvent` fired from `GenericPageLoader`).
- Criteria Events: search for `CriteriaEvent` (e.g. `ProductListingCriteriaEvent`); not guaranteed to exist for every entity.
- Route events (fine-grained, per Symfony route name):

| Event name | Scope | Event Type |
|---|---|---|
| `{route}.request` | Global | `Symfony\Component\HttpKernel\Event\RequestEvent` |
| `{route}.response` | Global | `Symfony\Component\HttpKernel\Event\ResponseEvent` |
| `{route}.render` | Storefront | `Shopware\Storefront\Event\StorefrontRenderEvent` |
| `{route}.encode` | Store-API | `Symfony\Component\HttpKernel\Event\ResponseEvent` |
| `{route}.controller` | Global | `Symfony\Component\HttpKernel\Event\ControllerEvent` |

- Business events: search for `implements BusinessEventInterface` or `implements MailActionInterface` (the latter results in an email being sent).
- Symfony profiler's "Events" tab shows all events fired in the current request.
- Storefront JS events: search for `$emitter.publish` in the storefront JS source.
- Administration Vue events: search for `$emit` in the administration JS source.
- Flow builder events (from Shopware 6.5): stored in `StorableFlow`; `getAvailableData` can no longer be used to get data from the Flow Builder.

## Essential identifiers
- `extends NestedEvent`, `implements ShopwareEvent`, `->dispatch`
- `event_dispatcher`, `EventDispatcherInterface`
- `PageLoadedEvent`, `CriteriaEvent`
- `{route}.request`, `{route}.response`, `{route}.render`, `{route}.encode`, `{route}.controller`
- `BusinessEventInterface`, `MailActionInterface`
- `$emitter.publish`, `$emit`
- `StorableFlow`

## Gotchas
- `{route}.encode` and `{route}.controller` were only introduced in 6.6.11.0.
- `CriteriaEvent`s are not auto-generated and may not exist for a given entity.
- From Shopware 6.5, Flow Builder event data lives in `StorableFlow`, and `getAvailableData` can no longer be used for it.

## Version notes
- `{route}.encode` and `{route}.controller` route events were introduced in 6.6.11.0.
- Flow Builder event data storage changed starting with Shopware 6.5.
