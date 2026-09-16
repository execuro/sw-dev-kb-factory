---
id: platform/func/settings/measurementsystem.md
title: Measurementsystem
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/settings/measurementsystem
sourceHash: 99cbb73d04c0c283f00dba6c8b3416385e5d7ec8021302a4d4c83570871b4f4a
revision:
  current: true
  range: "current"
  swMin: null
  swMax: null
keywords: ["measurement system", "settings general measurement system", "metric", "imperial", "unit of length", "unit of weight", "default unit system", "sales channel units", "product dimensions", "product weight"]
summary: Settings > General > Measurement system defines the default unit system, length unit, and weight unit used by new sales channels.
lastBuilt: 2026-09-15
---
## What it is

The Measurement system settings, found under **Settings > General > Measurement system**, define which units of measurement (system of units, unit of length, unit of weight) are used by default in newly created sales channels, affecting how product dimensions and weights are displayed.

## When to use

Use this when setting the default measurement conventions — metric or imperial, and specific length/weight units — that new sales channels should inherit.

## Key steps / config

- Choose the system of units, e.g. metric or imperial.
- Choose the unit of length, e.g. millimeters, centimeters, or meters.
- Choose the unit of weight, e.g. kilograms or grams.

## Essential identifiers

Admin path: **Settings > General > Measurement system**.

## Gotchas

These settings only apply as defaults for new sales channels; the units customers ultimately see can be overridden per sales channel in that sales channel's own settings.
