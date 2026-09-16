---
id: platform/dev/6.6/products/extensions/subscriptions/concept.md
title: Concepts
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/subscriptions/concept.html
sourceHash: 4627f8f50e97298e917d71baa045df3da7ce021e
keywords: ["subscription plan", "interval", "relative interval", "absolute interval", "mixed interval", "DateInterval", "cron expression", "billing interval", "subscriptions", "delivery cycle", "Shopware administration"]
summary: Subscriptions are built from plans (interval plus product) and intervals, which can be relative, absolute, or mixed via DateInterval and cron.
lastBuilt: 2026-09-15
---
## What it is

Explains the two core concepts behind the subscription extension: plans and intervals, both created and managed in the Shopware administration.

## When to use

Read this before configuring a subscription offer, to understand how a plan's billing interval and product are tied together and how the three interval types behave.

## Key steps / config

A **plan** is a set of rules that define the subscription, including the billing interval and the product the customer will receive; multiple intervals can be assigned to a single plan.

An **interval** is the time between each delivery cycle (e.g. monthly, quarterly, annually); billing is triggered each time a delivery cycle repeats, and the interval — defined within the plan — can be set to any time frame.

Intervals come in three types:

- **Relative** — determined by the previous interval. Example: a customer on a monthly plan gets their next interval one month after the first delivery. Implemented using PHP's `DateInterval` class.
- **Absolute** — determined by a fixed date. Example: a monthly plan's next interval lands on a fixed day, such as the 1st or 15th of each month. Implemented with cron expressions.
- **Mixed** — combines both. Example: a plan delivers every 12 weeks, but only on a Friday. Implemented using PHP's `DateInterval` class in combination with cron expressions.

## Essential identifiers

- PHP class: `DateInterval`
- Concepts: plan, interval (relative, absolute, mixed)

## Gotchas

The three interval types are not interchangeable implementation-wise: relative intervals rely solely on `DateInterval` arithmetic from the prior delivery, while absolute and mixed intervals additionally depend on cron expressions to pin deliveries to specific calendar days.
