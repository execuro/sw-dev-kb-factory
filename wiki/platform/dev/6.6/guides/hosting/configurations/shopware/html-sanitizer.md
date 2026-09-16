---
id: platform/dev/6.6/guides/hosting/configurations/shopware/html-sanitizer.md
title: HTML sanitizer
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/hosting/configurations/shopware/html-sanitizer.html
sourceHash: 607120456144192bfd206ea5b540e461af22290d
keywords: ["html sanitizer", "z-shopware.yaml", "html_sanitizer", "text editor sanitization", "self-hosted", "whitelist html tags", "shopware.yaml", "sanitize attributes"]
summary: "Config for whitelisting HTML tags/attributes or disabling the self-hosted text-editor sanitizer via z-shopware.yaml."
lastBuilt: "2026-09-15"
---
## What it is

The HTML sanitizer improves security, reliability and usability of the text editor by removing potentially unsafe or malicious HTML, and by sanitizing styles/attributes for consistent rendering across platforms and browsers. It is exclusive to self-hosted shops and is not available for cloud stores; it was introduced in Shopware 6.5.

## When to use

Use this when the editor strips a tag or attribute you need to keep (e.g. an `<img>` tag gets removed automatically a few seconds after being added), or when you need to relax or disable sanitization for a self-hosted instance.

## Key steps / config

- Sanitizer whitelisting is configured via a `z-shopware.yaml` file placed under `config/packages/` on the server. By default this file does not exist; create it by copying the existing `shopware.yaml` in the same directory.
- In the copied file, add an `html_sanitizer:` key inside the `shopware:` section; it holds the tags/attributes/wildcards to whitelist (the docs give an example that whitelists the `<img>` tag together with the `src`, `alt` and `style` attributes).
- To deactivate the sanitizer entirely (despite the security risk), the docs give a separate example snippet for that inside the same `z-shopware.yaml`.

## Essential identifiers

- `z-shopware.yaml` (under `config/packages/`)
- `shopware.html_sanitizer` config key

## Gotchas

Disabling the HTML sanitizer allows potentially unsafe or malicious HTML to be inserted into the shop.

## Version notes

Introduced in Shopware 6.5; only available for self-hosted shops, not for cloud stores.
