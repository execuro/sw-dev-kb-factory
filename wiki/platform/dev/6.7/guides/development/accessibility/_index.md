---
id: platform/dev/6.7/guides/development/accessibility/_index.md
title: Accessibility
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/accessibility/
sourceHash: 945e99ccee36afcf0e635877d5810f8a982ebaef
codeCheckedAgainst: "6.7.15.1"
keywords: ["accessibility", "a11y", "ACCESSIBILITY_TWEAKS", "feature flag", "WCAG 2.1 AA", "barrier-free", "storefront accessibility", "accessibility checklist", "EU accessibility regulations", "inclusive design"]
summary: Overview of accessibility in Shopware 6.7 - WCAG 2.1 AA responsibility for themes/extensions and testing with the ACCESSIBILITY_TWEAKS feature flag.
lastBuilt: 2026-10-20
relatedPages: ["platform/dev/6.7/guides/development/accessibility/storefront-accessibility.md", "platform/dev/6.7/guides/development/accessibility/accessibility-checklist.md"]
---
## What it is

Section landing page for accessibility in Shopware. Accessibility covers the core Storefront and every custom theme and extension; developers are responsible for making their implementations comply with standards such as WCAG 2.1 Level AA. The section contains the Storefront Accessibility guide and the Accessibility Checklist.

## When to use

Building or reviewing a theme or extension that renders Storefront markup and needing to know the accessibility expectations and how to test against upcoming core changes.

## Key steps / config

- Target WCAG 2.1 Level AA in your own templates, styles and scripts.
- Shopware ships accessibility improvements continuously in regular releases; test your extension against them (see Gotchas for the feature flag involved).
- Reasons given by the source: legal compliance (e.g. EU accessibility regulations), better usability for all users, improved SEO and performance, future-proof storefront implementations.

## Gotchas

- The source says to always test extensions with the `ACCESSIBILITY_TWEAKS` feature flag enabled. In 6.7.15.1 the flag is declared in core `feature.yaml` with `default: true` (and `toggleable: true`), and no Storefront template or code reads it — the improvements it once gated are already the 6.7 default, so enabling it changes nothing in practice.

## Code check (6.7.15.1)
- unread `ACCESSIBILITY_TWEAKS` — declared with default true, toggleable, but not read by any template or code — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:24
