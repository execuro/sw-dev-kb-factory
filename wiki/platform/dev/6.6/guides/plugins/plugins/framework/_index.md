---
id: platform/dev/6.6/guides/plugins/plugins/framework/_index.md
title: Framework
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/"
sourceHash: "0727fe82bb077339cee8e8565f077ff19f402ae5"
keywords: ["framework", "Shopware framework", "data abstraction layer", "DAL", "custom fields", "events", "event-driven architecture", "rules", "rule builder", "message queue", "filesystem", "Flysystem", "flow builder", "rate limiter"]
summary: "Landing page for the plugin Framework section: DAL, custom fields, events, rules, message queues, filesystem, flow builder, and rate limiter."
lastBuilt: "2026-09-15"
---
## What it is

This is the landing page for the "Framework" section of the plugin guides. Shopware is
described as a flexible e-commerce framework that lets developers extend and customize the
platform for specific business needs, building scalable and personalized online stores. The
framework itself offers data abstraction, custom fields, events, rules, message queues, file
systems, flows, and rate limiters, with detailed guidance on each provided in the further
sections beneath this page.

## When to use

Use this page as the entry point when a plugin needs to touch one of the framework's core
subsystems — reading or writing entity data, storing extra per-entity attributes, reacting to
platform actions, defining dynamic business conditions, processing background work
asynchronously, reading or writing files, automating multi-step workflows, or protecting an
endpoint from excessive requests.

## Essential identifiers

The framework section groups the following topics, each documented on its own child page:

- Data Handling / Data Abstraction Layer (DAL) — Shopware's data access layer, covering
  reading, writing and adding complex/translated data, plus database events.
- Custom Fields — additional data fields attached to entities such as products, customers,
  or orders, managed via the administration or the API.
- Event — Shopware's event system (storefront, administration, and flow builder events) used
  to hook into core actions like order placement or product updates.
- Rule — the Rule Builder, for defining dynamic conditions and actions based on customer
  data, cart contents, order details, and similar attributes.
- Message Queue — asynchronous message handling built on the Symfony Messenger component.
- Filesystem — file read/write access built on the Flysystem library, abstracting local and
  cloud storage behind the same API.
- Flow — the Flow Builder's actions and triggers for custom workflow automation.
- Rate Limiter — controls on the rate/frequency of incoming API requests to prevent misuse
  such as brute-force attacks.
