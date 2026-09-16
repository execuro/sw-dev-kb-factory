---
id: platform/dev/6.6/guides/plugins/plugins/framework/rate-limiter/_index.md
title: Rate Limiter
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/rate-limiter/"
sourceHash: "15ca1de8f0778acc2ef1717930cabefcf2c31d3b"
keywords: ["rate limiter", "rate limiting", "API request limit", "brute-force protection", "request frequency", "system stability", "resource allocation", "throttling", "misuse protection"]
summary: "Landing page for the rate limiter: limits how many API requests can be processed in a time period to prevent misuse."
lastBuilt: "2026-09-15"
---
## What it is

This is the landing page for the "Rate Limiter" section of the plugin guides. A rate limiter
controls the rate or frequency at which API requests can be made.

## When to use

Use a rate limiter when an endpoint needs protection against excessive usage — the source
specifically calls out eliminating the chance of brute-force attacks as a goal, alongside
maintaining system stability and ensuring fair resource allocation.

## Key steps / config

The source describes the rate limiter's behavior rather than a configuration API on this
landing page: it sets limits on the number of requests that can be processed within a
specified time period, and enforces predefined limits on the rate of incoming requests once
that threshold is reached.

## Essential identifiers

- Rate limiter — the feature this section documents, controlling API request frequency.
