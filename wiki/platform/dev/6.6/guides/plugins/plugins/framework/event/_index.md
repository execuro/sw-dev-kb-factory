---
id: platform/dev/6.6/guides/plugins/plugins/framework/event/_index.md
title: Event
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/event/"
sourceHash: "05ba736027112bcb46610f4e805f3ff4ae399659"
keywords: ["events", "event system", "storefront events", "administration events", "flow builder events", "event-driven architecture", "order placement", "product updates", "custom logic", "hook", "extend platform"]
summary: "Landing page for Shopware's event system: storefront, administration, and flow builder events used to hook into core actions."
lastBuilt: "2026-09-15"
---
## What it is

This is the landing page for the "Event" section of the plugin guides. Shopware events
provide a way to extend the functionality of the e-commerce platform: events are triggered at
specific actions, and plugin code can intercept them to execute custom logic during those
actions.

## When to use

Use events when a plugin needs to react to something happening in the platform rather than
initiate it directly — for example sending notifications, modifying data, or integrating with
external services in response to core actions such as order placement or product updates.

## Key steps / config

The source names three categories of events that a plugin can hook into:

- Storefront events.
- Administration events.
- Flow builder events.

By leveraging these, plugin code can hook into core system actions — such as order placement
or product updates — and perform additional tasks: sending notifications, modifying data, or
integrating with external services. This event-driven approach is described as enabling
integration of custom functionality so the platform can be extended and customized to meet
specific business requirements.

## Essential identifiers

- Storefront events, administration events, flow builder events — the three event categories
  named on this page.
- Typical trigger actions cited: order placement, product updates.
